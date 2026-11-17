import { useQuery } from "@tanstack/react-query";

import { getResumenPedidos } from "../api/pedidos";

export const useResumenPedidos = () => {
  return useQuery({
    queryKey: ["pedidos", "resumen"],
    queryFn: getResumenPedidos,
  });
};