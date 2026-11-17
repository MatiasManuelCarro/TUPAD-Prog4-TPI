import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";

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

const getTextoAccion = (
  estado: EstadoPedido,
): string | null => {
  if (estado === "PENDIENTE") {
    return "Preparar";
  }

  if (estado === "EN_PREPARACION") {
    return "Entregar";
  }

  return null;
};

export const AdminPedidosPage = () => {
  const [estado, setEstado] =
    useState<EstadoPedido | undefined>(
      undefined,
    );

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

  const columns: ColumnDef<Pedido>[] = [
    {
      accessorKey: "id",
      header: "Pedido",
      cell: ({ row }) =>
        `#${row.original.id}`,
    },
    {
      accessorKey: "usuario_id",
      header: "Usuario",
      cell: ({ row }) =>
        `#${row.original.usuario_id}`,
    },
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: ({ row }) =>
        new Date(
          row.original.created_at,
        ).toLocaleString(),
    },
    {
      accessorKey: "estado",
      header: "Estado",
    },
    {
      accessorKey: "forma_pago",
      header: "Pago",
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) =>
        `$${row.original.total.toFixed(2)}`,
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,

      cell: ({ row }) => {
        const pedido = row.original;

        const textoAccion =
          getTextoAccion(pedido.estado);

        const puedeCancelar =
          pedido.estado === "PENDIENTE" ||
          pedido.estado === "EN_PREPARACION";

        return (
          <div
            className="
              flex
              flex-wrap
              justify-end
              gap-2
            "
          >
            {textoAccion && (
              <Button
                variant="edit"
                disabled={
                  cambiarEstadoMutation.isPending
                }
                onClick={() =>
                  handleCambiarEstado(pedido)
                }
              >
                {textoAccion}
              </Button>
            )}

            {puedeCancelar && (
              <Button
                variant="danger"
                disabled={
                  cambiarEstadoMutation.isPending
                }
                onClick={() =>
                  handleCancelar(pedido)
                }
              >
                Cancelar
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: pedidosQuery.data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

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

  const sinPedidos =
    pedidosQuery.data.items.length === 0;

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
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-app-border
            bg-app-surface
            shadow-sm
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                {table
                  .getHeaderGroups()
                  .map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="
                        border-b
                        border-app-border
                      "
                    >
                      {headerGroup.headers.map(
                        (header) => (
                          <th
                            key={header.id}
                            className={`
                              px-5
                              py-4
                              font-semibold
                              text-app-text
                              ${
                                header.column.id ===
                                "acciones"
                                  ? "text-right"
                                  : ""
                              }
                            `}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column
                                    .columnDef
                                    .header,
                                  header.getContext(),
                                )}
                          </th>
                        ),
                      )}
                    </tr>
                  ))}
              </thead>

              <tbody>
                {table
                  .getRowModel()
                  .rows.map((row) => (
                    <tr
                      key={row.id}
                      className="
                        border-b
                        border-app-border
                        last:border-b-0
                      "
                    >
                      {row
                        .getVisibleCells()
                        .map((cell) => (
                          <td
                            key={cell.id}
                            className={`
                              px-5
                              py-4
                              text-app-text
                              ${
                                cell.column.id ===
                                "acciones"
                                  ? "text-right"
                                  : ""
                              }
                            `}
                          >
                            {flexRender(
                              cell.column
                                .columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              border-t
              border-app-border
              px-5
              py-4
            "
          >
            <span className="text-sm text-app-text/70">
              Página{" "}
              {table.getState().pagination
                .pageIndex + 1}{" "}
              de {table.getPageCount()}
            </span>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  table.previousPage()
                }
                disabled={
                  !table.getCanPreviousPage()
                }
              >
                Anterior
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  table.nextPage()
                }
                disabled={
                  !table.getCanNextPage()
                }
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminPedidosPage;