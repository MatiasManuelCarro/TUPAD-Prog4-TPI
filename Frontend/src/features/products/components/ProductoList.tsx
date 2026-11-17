import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/ui/EmptyState";

import type { Producto } from "../types/producto.types";

type ProductoListProps = {
  productos: Producto[];
  esAdmin: boolean;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
};

export const ProductoList = ({
  productos,
  esAdmin,
  onEdit,
  onDelete,
}: ProductoListProps) => {
  const [sorting, setSorting] =
    useState<SortingState>([]);

  const columns: ColumnDef<Producto>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) =>
        row.original.descripcion ||
        "Sin descripción",
    },
    {
      id: "categoria",
      header: "Categoría",
      cell: ({ row }) =>
        row.original.categoria.nombre,
    },
    {
      accessorKey: "precio_base",
      header: "Precio",
      cell: ({ row }) =>
        `$${row.original.precio_base}`,
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "disponible",
      header: "Disponible",
      cell: ({ row }) =>
        row.original.disponible
          ? "Sí"
          : "No",
    },
    ...(esAdmin
      ? [
          {
            id: "acciones",
            header: "Acciones",
            enableSorting: false,
            cell: ({ row }) => (
              <div className="flex justify-end gap-2">
                <Button
                  variant="edit"
                  onClick={() =>
                    onEdit(row.original)
                  }
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    onDelete(row.original.id)
                  }
                >
                  Eliminar
                </Button>
              </div>
            ),
          } satisfies ColumnDef<Producto>,
        ]
      : []),
  ];

  const table = useReactTable({
    data: productos,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (productos.length === 0) {
    return (
      <EmptyState message="No hay productos para mostrar." />
    );
  }

  return (
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
                        {header.column.getCanSort() ? (
                          <button
                            type="button"
                            onClick={
                              header.column.getToggleSortingHandler()
                            }
                            className="
                              cursor-pointer
                              font-semibold
                            "
                          >
                            {flexRender(
                              header.column
                                .columnDef.header,
                              header.getContext(),
                            )}

                            {header.column.getIsSorted() ===
                              "asc" && " ↑"}

                            {header.column.getIsSorted() ===
                              "desc" && " ↓"}
                          </button>
                        ) : (
                          flexRender(
                            header.column
                              .columnDef.header,
                            header.getContext(),
                          )
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
          {table.getState().pagination.pageIndex +
            1}{" "}
          de {table.getPageCount()}
        </span>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => table.previousPage()}
            disabled={
              !table.getCanPreviousPage()
            }
          >
            Anterior
          </Button>

          <Button
            variant="secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};