import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useNotificationStore } from "@/shared/store/notificationStore";
import { handleApiError } from "@/shared/api/handleApiError";
import { cancelarPedido } from "../api/pedidos";

export const useCancelarPedido = () => {
  const queryClient = useQueryClient();

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  return useMutation({
    mutationFn: cancelarPedido,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pedidos"],
      });

      showNotification(
        "Pedido cancelado correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo cancelar el pedido",
        ),
      );
    },
  });
};