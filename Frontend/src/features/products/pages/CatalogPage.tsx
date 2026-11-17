import { useState } from "react";

import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";

import { ProductoCard } from "../components/ProductoCard";
import { useCatalog } from "../hooks/useCatalog";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/shared/store/notificationStore";

import type { Producto } from "../types/producto.types";

const PAGE_SIZE = 12;

export const CatalogPage = () => {
  const [search, setSearch] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);

  const addItem = useCartStore((state) => state.addItem);

  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );

  const { productosQuery, categoriasQuery } = useCatalog({
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
    search: search.trim().length > 0 ? search.trim() : undefined,
    categoria_id: categoriaId,
    disponible: true,
  });

  const handleAddToCart = (producto: Producto) => {
    addItem(producto);

    showNotification("Producto agregado al carrito");
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleCategoriaChange = (value: string) => {
    setCategoriaId(value === "" ? undefined : Number(value));

    setPage(0);
  };

  if (categoriasQuery.isPending) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <LoadingState message="Cargando catálogo..." />
      </main>
    );
  }

  if (categoriasQuery.isError) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <ErrorState message={categoriasQuery.error.message} />
      </main>
    );
  }

  const productos = productosQuery.data?.items ?? [];

  const total = productosQuery.data?.total ?? 0;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
        p-6
      "
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-app-text">Catálogo</h1>

        <p className="mt-1 text-app-text/70">
          Explora los productos disponibles.
        </p>
      </div>

      <div
        className="
          mb-6
          grid
          gap-4
          md:grid-cols-2
        "
      >
        <div>
          <label
            htmlFor="search"
            className="
              mb-1
              block
              font-medium
              text-app-text
            "
          >
            Buscar
          </label>

          <input
            id="search"
            type="search"
            value={search}
            placeholder="Buscar productos..."
            onChange={(event) => handleSearchChange(event.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-app-border
              bg-app-background
              p-2
              text-app-text
            "
          />
        </div>

        <div>
          <label
            htmlFor="categoria"
            className="
              mb-1
              block
              font-medium
              text-app-text
            "
          >
            Categoría
          </label>

          <select
            id="categoria"
            value={categoriaId ?? ""}
            onChange={(event) => handleCategoriaChange(event.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-app-border
              bg-app-background
              p-2
              text-app-text
            "
          >
            <option value="">Todas las categorías</option>

            {categoriasQuery.data.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {productosQuery.isPending && (
        <LoadingState message="Cargando productos..." />
      )}

      {productosQuery.isError && (
        <ErrorState message={productosQuery.error.message} />
      )}

      {!productosQuery.isPending &&
        !productosQuery.isError &&
        productos.length === 0 && (
          <EmptyState message="No se encontraron productos." />
        )}

      {!productosQuery.isPending &&
        !productosQuery.isError &&
        productos.length > 0 && (
          <>
            <div
              className="
                grid
                gap-6
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {productos.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <div
              className="
                mt-8
                flex
                items-center
                justify-center
                gap-4
              "
            >
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                className="
                  rounded-lg
                  border
                  border-app-border
                  px-4
                  py-2
                  font-semibold
                  text-app-text
                  disabled:opacity-50
                "
              >
                Anterior
              </button>

              <span className="text-sm text-app-text/70">
                Página {page + 1} de {Math.max(totalPages, 1)}
              </span>

              <button
                type="button"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="
                  rounded-lg
                  border
                  border-app-border
                  px-4
                  py-2
                  font-semibold
                  text-app-text
                  disabled:opacity-50
                "
              >
                Siguiente
              </button>
            </div>
          </>
        )}
    </main>
  );
};

export default CatalogPage;
