import { useState } from "react";

import { useAuth } from "@/features/auth";
import { Button } from "@/shared/components/ui/Button";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";

import { ProductoList } from "../components/ProductoList";
import { ProductoModal } from "../components/ProductoModal";
import { useProducts } from "../hooks/useProducts";

import type {
  Producto,
  ProductoCreate,
} from "../types/producto.types";

export const ProductsPage = () => {
  const { user } = useAuth();

  const esAdmin = user?.role === "admin";

  const {
    productosQuery,
    categoriasQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useProducts();

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState<Producto | null>(null);

  const closeModal = () => {
    setModalOpen(false);
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
    productoSeleccionado
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
    </main>
  );
};

export default ProductsPage;