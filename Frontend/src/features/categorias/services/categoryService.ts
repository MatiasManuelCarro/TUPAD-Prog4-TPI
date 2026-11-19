import { axiosInstance } from "@/shared/api/axiosInstance";

import type {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
} from "../types/categoria.types";

export const getCategorias = async (): Promise<Categoria[]> => {
  const response =
    await axiosInstance.get<Categoria[]>(
      "/categorias",
    );

  return response.data;
};

export const createCategoria = async (
  categoria: CategoriaCreate,
): Promise<Categoria> => {
  const response =
    await axiosInstance.post<Categoria>(
      "/categorias",
      categoria,
    );

  return response.data;
};

export const updateCategoria = async (
  id: number,
  categoria: CategoriaUpdate,
): Promise<Categoria> => {
  const response =
    await axiosInstance.put<Categoria>(
      `/categorias/${id}`,
      categoria,
    );

  return response.data;
};

export const deleteCategoria = async (
  id: number,
): Promise<void> => {
  await axiosInstance.delete(
    `/categorias/${id}`,
  );
};