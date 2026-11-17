import { useQuery } from "@tanstack/react-query";

import {
  getPedidos,
  type PedidoFilters,
} from "../api/pedidos";

export const usePedidos = (
  filters: PedidoFilters = {},
) => {
  return useQuery({
    queryKey: [
      "pedidos",
      filters,
    ],
    queryFn: () => getPedidos(filters),
  });
};
