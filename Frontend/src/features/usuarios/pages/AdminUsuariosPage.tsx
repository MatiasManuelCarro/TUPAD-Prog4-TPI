import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useAuth } from "@/features/auth";
import { Button } from "@/shared/components/ui/Button";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";

import { useUsers } from "../hooks/useUsers";

import type { Usuario } from "../types/usuario.types";

const columnHelper = createColumnHelper<Usuario>();

export const AdminUsuariosPage = () => {
  const { user } = useAuth();

  const {
    usuariosQuery,
    activarMutation,
    desactivarMutation,
  } = useUsers();

  const columns = [
    columnHelper.accessor("username", {
      header: "Usuario",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("full_name", {
      header: "Nombre",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("role", {
      header: "Rol",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("disabled", {
      header: "Estado",
      cell: (info) =>
        info.getValue()
          ? "Desactivado"
          : "Activo",
    }),

    columnHelper.display({
      id: "acciones",
      header: "Acciones",

      cell: ({ row }) => {
        const usuario = row.original;

        if (usuario.disabled) {
          return (
            <Button
              onClick={() =>
                activarMutation.mutate(
                  usuario.id,
                )
              }
              disabled={
                activarMutation.isPending
              }
            >
              Activar
            </Button>
          );
        }

        if (usuario.id === user?.id) {
          return null;
        }

        return (
          <Button
            variant="danger"
            onClick={() =>
              desactivarMutation.mutate(
                usuario.id,
              )
            }
            disabled={
              desactivarMutation.isPending
            }
          >
            Desactivar
          </Button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: usuariosQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (usuariosQuery.isPending) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <LoadingState message="Cargando usuarios..." />
      </main>
    );
  }

  if (usuariosQuery.isError) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <ErrorState
          message={usuariosQuery.error.message}
        />
      </main>
    );
  }

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
          Usuarios
        </h1>

        <p className="mt-1 text-app-text/70">
          Administración de usuarios del sistema.
        </p>
      </div>

      {(activarMutation.isError ||
        desactivarMutation.isError) && (
        <div className="mb-4">
          <ErrorState
            message={
              activarMutation.error?.message ??
              desactivarMutation.error?.message ??
              "No se pudo actualizar el usuario."
            }
          />
        </div>
      )}

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
                          className="
                            px-5
                            py-4
                            font-semibold
                            text-app-text
                          "
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef
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
                          className="
                            px-5
                            py-4
                            text-app-text
                          "
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
      </div>
    </main>
  );
};

export default AdminUsuariosPage;