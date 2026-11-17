import { useState } from "react";

import { useAuth } from "@/features/auth";
import { Button } from "@/shared/components/ui/Button";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";

import { ProductoList } from "../components/ProductoList";
import { ProductoModal } from "../components/ProductoModal";
import { StockModal } from "../components/StockModal";
import { useProducts } from "../hooks/useProducts";

import type {
  Producto,
  ProductoCreate,
  ProductoStockUpdate,
} from "../types/producto.types";

export const ProductsPage = () => {
  const { user } = useAuth();

  const esAdmin = user?.role === "admin";

  const {
    productosQuery,
    categoriasQuery,
    createMutation,
    updateMutation,
    stockMutation,
    deleteMutation,
  } = useProducts();

  const [modalOpen, setModalOpen] =
    useState(false);

  const [stockModalOpen, setStockModalOpen] =
    useState(false);

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState<Producto | null>(null);

  const closeModal = () => {
    setModalOpen(false);
    setProductoSeleccionado(null);
  };

  const closeStockModal = () => {
    setStockModalOpen(false);
    setProductoSeleccionado(null);
  };

  const handleNewProducto = () => {
    createMutation.reset();
    updateMutation.reset();

    setProductoSeleccionado(null);
    setModalOpen(true);
  };

  const handleEditProducto = (
    producto: Producto,
  ) => {
    createMutation.reset();
    updateMutation.reset();

    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const handleStockProducto = (
    producto: Producto,
  ) => {
    stockMutation.reset();

    setProductoSeleccionado(producto);
    setStockModalOpen(true);
  };

  const handleDeleteProducto = (
    id: number,
  ) => {
    const confirmar = window.confirm(
      "¿Deseas eliminar este producto?",
    );

    if (!confirmar) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const handleSubmit = (
    producto: ProductoCreate,
  ) => {
    if (productoSeleccionado) {
      updateMutation.mutate(
        {
          id: productoSeleccionado.id,
          producto,
        },
        {
          onSuccess: closeModal,
        },
      );

      return;
    }

    createMutation.mutate(
      producto,
      {
        onSuccess: closeModal,
      },
    );
  };

  const handleStockSubmit = (
    stock: ProductoStockUpdate,
  ) => {
    if (!productoSeleccionado) {
      return;
    }

    stockMutation.mutate(
      {
        id: productoSeleccionado.id,
        stock,
      },
      {
        onSuccess: closeStockModal,
      },
    );
  };

  if (
    productosQuery.isPending ||
    categoriasQuery.isPending
  ) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <LoadingState message="Cargando productos..." />
      </main>
    );
  }

  if (productosQuery.isError) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <ErrorState
          message={productosQuery.error.message}
        />
      </main>
    );
  }

  if (categoriasQuery.isError) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <ErrorState
          message={categoriasQuery.error.message}
        />
      </main>
    );
  }

  const activeMutation =
    productoSeleccionado && modalOpen
      ? updateMutation
      : createMutation;

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
        p-6
      "
    >
      <div
        className="
          mb-6
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <h1 className="text-3xl font-bold text-app-text">
            Productos
          </h1>

          <p className="mt-1 text-app-text/70">
            Administra los productos disponibles en el catálogo.
          </p>
        </div>

        {esAdmin && (
          <Button onClick={handleNewProducto}>
            Nuevo producto
          </Button>
        )}
      </div>

      {deleteMutation.isError && (
        <div className="mb-4">
          <ErrorState
            message={deleteMutation.error.message}
          />
        </div>
      )}

      <ProductoList
        productos={productosQuery.data.items}
        esAdmin={esAdmin}
        onEdit={handleEditProducto}
        onStock={handleStockProducto}
        onDelete={handleDeleteProducto}
      />

      {modalOpen && (
        <ProductoModal
          key={
            productoSeleccionado?.id ??
            "nuevo"
          }
          producto={productoSeleccionado}
          categorias={categoriasQuery.data}
          isPending={activeMutation.isPending}
          errorMessage={
            activeMutation.isError
              ? activeMutation.error.message
              : null
          }
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      {stockModalOpen &&
        productoSeleccionado && (
          <StockModal
            key={productoSeleccionado.id}
            producto={productoSeleccionado}
            isPending={stockMutation.isPending}
            errorMessage={
              stockMutation.isError
                ? stockMutation.error.message
                : null
            }
            onClose={closeStockModal}
            onSubmit={handleStockSubmit}
          />
        )}
    </main>
  );
};

export default ProductsPage;