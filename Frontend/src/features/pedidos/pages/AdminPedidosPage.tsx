import { useState } from "react";

import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";

import { PedidosTable } from "../components/PedidosTable";
import { useCambiarEstadoPedido } from "../hooks/useCambiarEstadoPedido";
import { usePedidos } from "../hooks/usePedidos";

import type {
  EstadoPedido,
  Pedido,
} from "../types/pedido.types";

const getSiguienteEstado = (
  estado: EstadoPedido,
): EstadoPedido | null => {
  if (estado === "PENDIENTE") {
    return "EN_PREPARACION";
  }

  if (estado === "EN_PREPARACION") {
    return "ENTREGADO";
  }

  return null;
};

export const AdminPedidosPage = () => {
  const [estado, setEstado] = useState<
    EstadoPedido | undefined
  >(undefined);

  const pedidosQuery = usePedidos({
    skip: 0,
    limit: 100,
    estado,
  });

  const cambiarEstadoMutation =
    useCambiarEstadoPedido();

  const handleCambiarEstado = (
    pedido: Pedido,
  ) => {
    const nuevoEstado =
      getSiguienteEstado(pedido.estado);

    if (!nuevoEstado) {
      return;
    }

    cambiarEstadoMutation.mutate({
      pedidoId: pedido.id,
      estado: nuevoEstado,
    });
  };

  const handleCancelar = (
    pedido: Pedido,
  ) => {
    if (
      pedido.estado !== "PENDIENTE" &&
      pedido.estado !== "EN_PREPARACION"
    ) {
      return;
    }

    const confirmar = window.confirm(
      `¿Deseas cancelar el pedido #${pedido.id}?`,
    );

    if (!confirmar) {
      return;
    }

    cambiarEstadoMutation.mutate({
      pedidoId: pedido.id,
      estado: "CANCELADO",
    });
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
        <ErrorState
          message={pedidosQuery.error.message}
        />
      </main>
    );
  }

  const pedidos = pedidosQuery.data.items;
  const sinPedidos = pedidos.length === 0;

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
        p-6
      "
    >
      <div className="mb-6">
        <h1
          className="
            text-3xl
            font-bold
            text-app-text
          "
        >
          Pedidos
        </h1>

        <p className="mt-1 text-app-text/70">
          Administra el estado de los pedidos.
        </p>

        <div className="mt-4 max-w-xs">
          <label
            htmlFor="estado"
            className="
              mb-1
              block
              font-medium
              text-app-text
            "
          >
            Filtrar por estado
          </label>

          <select
            id="estado"
            value={estado ?? ""}
            onChange={(event) => {
              const value =
                event.target.value;

              setEstado(
                value === ""
                  ? undefined
                  : (value as EstadoPedido),
              );
            }}
            className="
              w-full
              rounded-lg
              border
              border-app-border
              bg-app-background
              p-2
              text-app-text
            "
          >
            <option value="">
              Todos
            </option>

            <option value="PENDIENTE">
              Pendiente
            </option>

            <option value="EN_PREPARACION">
              En preparación
            </option>

            <option value="ENTREGADO">
              Entregado
            </option>

            <option value="CANCELADO">
              Cancelado
            </option>
          </select>
        </div>
      </div>

      {sinPedidos ? (
        <EmptyState message="No hay pedidos para mostrar." />
      ) : (
        <PedidosTable
          pedidos={pedidos}
          isPending={
            cambiarEstadoMutation.isPending
          }
          onCambiarEstado={
            handleCambiarEstado
          }
          onCancelar={handleCancelar}
        />
      )}
    </main>
  );
};

export default AdminPedidosPage;