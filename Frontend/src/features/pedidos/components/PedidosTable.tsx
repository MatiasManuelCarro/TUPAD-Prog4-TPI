import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { Paginacion } from "@/shared/components/Paginacion";
import { BadgeEstado } from "@/shared/components/ui/BadgeEstado";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";

import type {
  EstadoPedido,
  Pedido,
} from "../types/pedido.types";

type PedidosTableProps = {
  pedidos: Pedido[];
  isPending: boolean;
  onCambiarEstado: (pedido: Pedido) => void;
  onCancelar: (pedido: Pedido) => void;
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

export const PedidosTable = ({
  pedidos,
  isPending,
  onCambiarEstado,
  onCancelar,
}: PedidosTableProps) => {
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
      cell: ({ row }) => (
        <BadgeEstado
          estado={row.original.estado}
        />
      ),
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
                disabled={isPending}
                onClick={() =>
                  onCambiarEstado(pedido)
                }
              >
                {textoAccion}
              </Button>
            )}

            {puedeCancelar && (
              <Button
                variant="danger"
                disabled={isPending}
                onClick={() =>
                  onCancelar(pedido)
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
    data: pedidos,
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

  return (
    <Card className="overflow-hidden">
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
                                .columnDef.header,
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
                          cell.column.columnDef
                            .cell,
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
          border-t
          border-app-border
          px-5
          py-4
        "
      >
        <Paginacion
          paginaActual={
            table.getState().pagination
              .pageIndex + 1
          }
          totalPaginas={table.getPageCount()}
          puedeAnterior={
            table.getCanPreviousPage()
          }
          puedeSiguiente={
            table.getCanNextPage()
          }
          onAnterior={() =>
            table.previousPage()
          }
          onSiguiente={() =>
            table.nextPage()
          }
        />
      </div>
    </Card>
  );
};