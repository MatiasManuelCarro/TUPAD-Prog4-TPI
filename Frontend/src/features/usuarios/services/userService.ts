import { axiosInstance } from "@/shared/api/axiosInstance";

import type { Usuario } from "../types/usuario.types";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response =
    await axiosInstance.get<Usuario[]>(
      "/admin/usuarios",
    );

  return response.data;
};

export const activarUsuario = async (
  id: number,
): Promise<Usuario> => {
  const response =
    await axiosInstance.post<Usuario>(
      `/admin/usuarios/${id}/activar`,
    );

  return response.data;
};

export const desactivarUsuario = async (
  id: number,
): Promise<Usuario> => {
  const response =
    await axiosInstance.post<Usuario>(
      `/admin/usuarios/${id}/desactivar`,
    );

  return response.data;
};