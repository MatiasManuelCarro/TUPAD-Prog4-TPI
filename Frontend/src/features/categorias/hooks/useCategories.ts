import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/shared/store/notificationStore";

import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "../services/categoryService";

import type { CategoriaUpdate } from "../types/categoria.types";

type UpdateCategoriaVariables = {
  id: number;
  categoria: CategoriaUpdate;
};

export const useCategories = () => {
  const queryClient = useQueryClient();

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const categoriasQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const createMutation = useMutation({
    mutationFn: createCategoria,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });

      showNotification(
        "Categoría creada correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo crear la categoría",
        ),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      categoria,
    }: UpdateCategoriaVariables) =>
      updateCategoria(id, categoria),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });

      showNotification(
        "Categoría actualizada correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo actualizar la categoría",
        ),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });

      showNotification(
        "Categoría eliminada correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo eliminar la categoría",
        ),
      );
    },
  });

  return {
    categoriasQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};