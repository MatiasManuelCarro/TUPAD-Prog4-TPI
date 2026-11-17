import { axiosInstance } from "@/shared/api/axiosInstance";

import type {
  CambioEstado,
  EstadoPedido,
  Pedido,
  PedidoCreate,
  PedidosPaginados,
  ResumenPedidos,
} from "../types/pedido.types";

export type PedidoFilters = {
  skip?: number;
  limit?: number;
  estado?: EstadoPedido;
};

export const getPedidos = async (
  filters: PedidoFilters = {},
): Promise<PedidosPaginados> => {
  const response =
    await axiosInstance.get<PedidosPaginados>(
      "/pedidos",
      {
        params: filters,
      },
    );

  return response.data;
};

export const getPedido = async (
  pedidoId: number,
): Promise<Pedido> => {
  const response =
    await axiosInstance.get<Pedido>(
      `/pedidos/${pedidoId}`,
    );

  return response.data;
};

export const crearPedido = async (
  pedido: PedidoCreate,
): Promise<Pedido> => {
  const response =
    await axiosInstance.post<Pedido>(
      "/pedidos",
      pedido,
    );

  return response.data;
};

export const cambiarEstadoPedido = async (
  pedidoId: number,
  data: CambioEstado,
): Promise<Pedido> => {
  const response =
    await axiosInstance.patch<Pedido>(
      `/pedidos/${pedidoId}/estado`,
      data,
    );

  return response.data;
};

export const cancelarPedido = async (
  pedidoId: number,
): Promise<Pedido> => {
  const response =
    await axiosInstance.patch<Pedido>(
      `/pedidos/${pedidoId}/cancelar`,
    );

  return response.data;
};

export const getResumenPedidos =
  async (): Promise<ResumenPedidos> => {
    const response =
      await axiosInstance.get<ResumenPedidos>(
        "/pedidos/resumen",
      );

    return response.data;
  };
