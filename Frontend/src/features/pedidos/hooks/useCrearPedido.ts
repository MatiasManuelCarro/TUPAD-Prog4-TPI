import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { crearPedido } from "../api/pedidos";

export const useCrearPedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearPedido,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pedidos"],
      });
    },
  });
};