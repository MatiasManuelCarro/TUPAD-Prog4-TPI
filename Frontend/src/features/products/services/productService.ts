import { axiosInstance } from "@/shared/api/axiosInstance";

import type {
  Producto,
  ProductoCreate,
  ProductoPaginatedResponse,
  ProductoStockUpdate,
  ProductoUpdate,
} from "../types/producto.types";

export type ProductoFilters = {
  skip?: number;
  limit?: number;
  search?: string;
  categoria_id?: number;
  disponible?: boolean;
};

export const getProducts = async (
  filters: ProductoFilters = {},
): Promise<ProductoPaginatedResponse> => {
  const response =
    await axiosInstance.get<ProductoPaginatedResponse>(
      "/productos",
      {
        params: filters,
      },
    );

  return response.data;
};

export const createProducto = async (
  producto: ProductoCreate,
): Promise<Producto> => {
  const response =
    await axiosInstance.post<Producto>(
      "/productos",
      producto,
    );

  return response.data;
};

export const updateProducto = async (
  id: number,
  producto: ProductoUpdate,
): Promise<Producto> => {
  const response =
    await axiosInstance.put<Producto>(
      `/productos/${id}`,
      producto,
    );

  return response.data;
};

export const updateProductoStock = async (
  id: number,
  stock: ProductoStockUpdate,
): Promise<Producto> => {
  const response =
    await axiosInstance.patch<Producto>(
      `/productos/${id}/stock`,
      stock,
    );

  return response.data;
};

export const deleteProducto = async (
  id: number,
): Promise<void> => {
  await axiosInstance.delete(
    `/productos/${id}`,
  );
};