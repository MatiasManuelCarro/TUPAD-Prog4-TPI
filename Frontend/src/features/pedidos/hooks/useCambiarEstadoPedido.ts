import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useNotificationStore } from "@/shared/store/notificationStore";

import { cambiarEstadoPedido } from "../api/pedidos";

import type {
  EstadoPedido,
} from "../types/pedido.types";

type CambiarEstadoVariables = {
  pedidoId: number;
  estado: EstadoPedido;
};

export const useCambiarEstadoPedido = () => {
  const queryClient = useQueryClient();

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  return useMutation({
    mutationFn: ({
      pedidoId,
      estado,
    }: CambiarEstadoVariables) =>
      cambiarEstadoPedido(
        pedidoId,
        {
          estado,
        },
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pedidos"],
      });

      showNotification(
        "Estado del pedido actualizado correctamente",
      );
    },

    onError: () => {
      showNotification(
        "No se pudo actualizar el estado del pedido",
      );
    },
  });
};