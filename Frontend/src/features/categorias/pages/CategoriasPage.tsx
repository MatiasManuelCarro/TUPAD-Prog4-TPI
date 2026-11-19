import { useState } from "react";

import { useAuth } from "@/features/auth";
import { Button } from "@/shared/components/ui/Button";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";

import { CategoriaList } from "../components/CategoriaList";
import { CategoriaModal } from "../components/CategoriaModal";
import { useCategories } from "../hooks/useCategories";

import type {
  Categoria,
  CategoriaCreate,
} from "../types/categoria.types";

export const CategoriasPage = () => {
  const { user } = useAuth();

  const esAdmin = user?.role === "admin";

  const {
    categoriasQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useCategories();

  const [modalOpen, setModalOpen] = useState(false);

  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada,
  ] = useState<Categoria | null>(null);

  const closeModal = () => {
    setModalOpen(false);
    setCategoriaSeleccionada(null);
  };

  const handleNewCategoria = () => {
    createMutation.reset();
    updateMutation.reset();

    setCategoriaSeleccionada(null);
    setModalOpen(true);
  };

  const handleEditCategoria = (
    categoria: Categoria,
  ) => {
    createMutation.reset();
    updateMutation.reset();

    setCategoriaSeleccionada(categoria);
    setModalOpen(true);
  };

  const handleDeleteCategoria = (
    id: number,
  ) => {
    const confirmar = window.confirm(
      "¿Deseas eliminar esta categoría?",
    );

    if (!confirmar) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const handleSubmit = (
    categoria: CategoriaCreate,
  ) => {
    if (categoriaSeleccionada) {
      updateMutation.mutate(
        {
          id: categoriaSeleccionada.id,
          categoria,
        },
        {
          onSuccess: closeModal,
        },
      );

      return;
    }

    createMutation.mutate(
      categoria,
      {
        onSuccess: closeModal,
      },
    );
  };

  if (categoriasQuery.isPending) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <LoadingState message="Cargando categorías..." />
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

  const activeMutation = categoriaSeleccionada
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
            Categorías
          </h1>

          <p className="mt-1 text-app-text/70">
            Administra las categorías disponibles en el catálogo.
          </p>
        </div>

        {esAdmin && (
          <Button onClick={handleNewCategoria}>
            Nueva categoría
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

      <CategoriaList
        categorias={categoriasQuery.data}
        esAdmin={esAdmin}
        onEdit={handleEditCategoria}
        onDelete={handleDeleteCategoria}
      />

      {modalOpen && (
        <CategoriaModal
          key={
            categoriaSeleccionada?.id ??
            "nueva"
          }
          categoria={categoriaSeleccionada}
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

export default CategoriasPage;