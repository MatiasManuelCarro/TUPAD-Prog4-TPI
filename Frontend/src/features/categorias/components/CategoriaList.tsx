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

import type { Categoria } from "../types/categoria.types";
import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Paginacion } from "@/shared/components/Paginacion";

type CategoriaListProps = {
  categorias: Categoria[];
  esAdmin: boolean;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
};

export const CategoriaList = ({
  categorias,
  esAdmin,
  onEdit,
  onDelete,
}: CategoriaListProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Categoria>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => row.original.descripcion || "Sin descripción",
    },
  ];

  if (esAdmin) {
    columns.push({
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="edit" onClick={() => onEdit(row.original)}>
            Editar
          </Button>

          <Button variant="danger" onClick={() => onDelete(row.original.id)}>
            Eliminar
          </Button>
        </div>
      ),
    });
  }

  const table = useReactTable({
    data: categorias,
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

  if (categorias.length === 0) {
    return <EmptyState message="No hay categorías para mostrar." />;
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
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-app-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`
                          px-5
                          py-4
                          font-semibold
                          text-app-text
                          ${header.column.id === "acciones" ? "text-right" : ""}
                        `}
                  >
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="
                              cursor-pointer
                              font-semibold
                            "
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.getIsSorted() === "asc" && " ↑"}

                        {header.column.getIsSorted() === "desc" && " ↓"}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="
                  border-b
                  border-app-border
                  last:border-b-0
                "
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`
                      px-5
                      py-4
                      text-app-text
                      ${cell.column.id === "acciones" ? "text-right" : ""}
                    `}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
            table.getState().pagination.pageIndex + 1
          }
          totalPaginas={table.getPageCount()}
          puedeAnterior={table.getCanPreviousPage()}
          puedeSiguiente={table.getCanNextPage()}
          onAnterior={() => table.previousPage()}
          onSiguiente={() => table.nextPage()}
        />
      </div>

    </div>
  );
};
