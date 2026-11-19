import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getCategorias } from "@/features/categorias";
import { handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/shared/store/notificationStore";

import {
  createProducto,
  deleteProducto,
  getProducts,
  updateProducto,
  updateProductoStock,
} from "../services/productService";

import type {
  ProductoStockUpdate,
  ProductoUpdate,
} from "../types/producto.types";

type UpdateProductoVariables = {
  id: number;
  producto: ProductoUpdate;
};

type UpdateProductoStockVariables = {
  id: number;
  stock: ProductoStockUpdate;
};

export const useProducts = () => {
  const queryClient = useQueryClient();

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const productosQuery = useQuery({
    queryKey: ["productos"],
    queryFn: () =>
      getProducts({
        skip: 0,
        limit: 100,
      }),
  });

  const categoriasQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const createMutation = useMutation({
    mutationFn: createProducto,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification(
        "Producto creado correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo crear el producto",
        ),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      producto,
    }: UpdateProductoVariables) =>
      updateProducto(id, producto),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification(
        "Producto actualizado correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo actualizar el producto",
        ),
      );
    },
  });

  const stockMutation = useMutation({
    mutationFn: ({
      id,
      stock,
    }: UpdateProductoStockVariables) =>
      updateProductoStock(id, stock),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification(
        "Stock actualizado correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo actualizar el stock",
        ),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification(
        "Producto eliminado correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo eliminar el producto",
        ),
      );
    },
  });

  return {
    productosQuery,
    categoriasQuery,
    createMutation,
    updateMutation,
    stockMutation,
    deleteMutation,
  };
};