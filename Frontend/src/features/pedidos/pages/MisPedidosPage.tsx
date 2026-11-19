import { useState } from "react";

import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import { useCancelarPedido } from "../hooks/useCancelarPedido";
import { usePedidos } from "../hooks/usePedidos";
import { Paginacion } from "@/shared/components/Paginacion";
import { PedidoDetalle } from "../components/PedidoDetalle";
import type { EstadoPedido } from "../types/pedido.types";


const PAGE_SIZE = 10;

export const MisPedidosPage = () => {
  const [page, setPage] = useState(0);

  const [estado, setEstado] = useState<EstadoPedido | undefined>(undefined);

  const pedidosQuery = usePedidos({
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
    estado,
  });

  const cancelarMutation = useCancelarPedido();

  const handleEstadoChange = (value: string) => {
    setEstado(value === "" ? undefined : (value as EstadoPedido));

    setPage(0);
  };

  const handleCancelar = (pedidoId: number) => {
    const confirmar = window.confirm("¿Deseas cancelar este pedido?");

    if (!confirmar) {
      return;
    }

    cancelarMutation.mutate(pedidoId);
  };

  if (pedidosQuery.isPending) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <LoadingState message="Cargando pedidos..." />
      </main>
    );
  }

  if (pedidosQuery.isError) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <ErrorState message={pedidosQuery.error.message} />
      </main>
    );
  }

  const pedidos = pedidosQuery.data.items;
  const total = pedidosQuery.data.total;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
        p-6
      "
    >
      <div
        className="
          mb-6
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
              text-app-text
            "
          >
            Mis pedidos
          </h1>

          <p className="mt-1 text-app-text/70">
            Consulta el estado y detalle de tus pedidos.
          </p>
        </div>

        <div>
          <label
            htmlFor="estado"
            className="
              mb-1
              block
              text-sm
              font-medium
              text-app-text
            "
          >
            Estado
          </label>

          <select
            id="estado"
            value={estado ?? ""}
            onChange={(event) => handleEstadoChange(event.target.value)}
            className="
              rounded-lg
              border
              border-app-border
              bg-app-background
              p-2
              text-app-text
            "
          >
            <option value="">Todos</option>

            <option value="PENDIENTE">Pendiente</option>

            <option value="EN_PREPARACION">En preparación</option>

            <option value="ENTREGADO">Entregado</option>

            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <EmptyState message="No hay pedidos para mostrar." />
      ) : (
        <div className="space-y-5">
          {pedidos.map((pedido) => (
            <PedidoDetalle
              key={pedido.id}
              pedido={pedido}
              isPending={cancelarMutation.isPending}
              onCancelar={handleCancelar}
            />
          ))}

        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Paginacion
            paginaActual={page + 1}
            totalPaginas={totalPages}
            puedeAnterior={page > 0}
            puedeSiguiente={page + 1 < totalPages}
            onAnterior={() => setPage((current) => Math.max(current - 1, 0))}
            onSiguiente={() => setPage((current) => current + 1)}
          />
        </div>
      )}
    </main>
  );
};

export default MisPedidosPage;
