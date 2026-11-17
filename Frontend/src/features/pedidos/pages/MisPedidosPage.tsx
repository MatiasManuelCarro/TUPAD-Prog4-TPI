import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";

import { useCancelarPedido } from "../hooks/useCancelarPedido";
import { usePedidos } from "../hooks/usePedidos";

import type {
  EstadoPedido,
} from "../types/pedido.types";

const PAGE_SIZE = 10;

export const MisPedidosPage = () => {
  const [page, setPage] = useState(0);

  const [estado, setEstado] =
    useState<EstadoPedido | undefined>(
      undefined,
    );

  const pedidosQuery = usePedidos({
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
    estado,
  });

  const cancelarMutation =
    useCancelarPedido();

  const handleEstadoChange = (
    value: string,
  ) => {
    setEstado(
      value === ""
        ? undefined
        : (value as EstadoPedido),
    );

    setPage(0);
  };

  const handleCancelar = (
    pedidoId: number,
  ) => {
    const confirmar = window.confirm(
      "¿Deseas cancelar este pedido?",
    );

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
        <ErrorState
          message={pedidosQuery.error.message}
        />
      </main>
    );
  }

  const pedidos = pedidosQuery.data.items;
  const total = pedidosQuery.data.total;

  const totalPages = Math.ceil(
    total / PAGE_SIZE,
  );

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
            onChange={(event) =>
              handleEstadoChange(
                event.target.value,
              )
            }
            className="
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

      {pedidos.length === 0 ? (
        <EmptyState message="No hay pedidos para mostrar." />
      ) : (
        <div className="space-y-5">
          {pedidos.map((pedido) => (
            <article
              key={pedido.id}
              className="
                overflow-hidden
                rounded-xl
                border
                border-app-border
                bg-app-surface
                shadow-sm
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-app-border
                  p-5
                "
              >
                <div>
                  <h2
                    className="
                      text-lg
                      font-bold
                      text-app-text
                    "
                  >
                    Pedido #{pedido.id}
                  </h2>

                  <p className="text-sm text-app-text/70">
                    {new Date(
                      pedido.created_at,
                    ).toLocaleString()}
                  </p>
                </div>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      rounded-full
                      border
                      border-app-border
                      px-3
                      py-1
                      text-sm
                      font-semibold
                      text-app-text
                    "
                  >
                    {pedido.estado}
                  </span>

                  {pedido.estado ===
                    "PENDIENTE" && (
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleCancelar(
                          pedido.id,
                        )
                      }
                      disabled={
                        cancelarMutation.isPending
                      }
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {pedido.items.map((item) => (
                    <div
                      key={item.producto_id}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-app-border
                        pb-3
                        last:border-b-0
                        last:pb-0
                      "
                    >
                      <div>
                        <p
                          className="
                            font-semibold
                            text-app-text
                          "
                        >
                          {
                            item.nombre_producto
                          }
                        </p>

                        <p className="text-sm text-app-text/70">
                          {item.cantidad} × $
                          {item.precio_unitario.toFixed(
                            2,
                          )}
                        </p>
                      </div>

                      <span
                        className="
                          font-semibold
                          text-app-text
                        "
                      >
                        $
                        {item.subtotal.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="
                    mt-5
                    grid
                    gap-2
                    border-t
                    border-app-border
                    pt-4
                    text-sm
                    text-app-text
                    sm:grid-cols-2
                  "
                >
                  <p>
                    <strong>
                      Forma de pago:
                    </strong>{" "}
                    {pedido.forma_pago}
                  </p>

                  <p>
                    <strong>
                      Dirección:
                    </strong>{" "}
                    {
                      pedido.direccion_entrega
                    }
                  </p>

                  {pedido.notas && (
                    <p className="sm:col-span-2">
                      <strong>
                        Notas:
                      </strong>{" "}
                      {pedido.notas}
                    </p>
                  )}
                </div>

                <div
                  className="
                    mt-5
                    flex
                    justify-end
                    border-t
                    border-app-border
                    pt-4
                  "
                >
                  <span
                    className="
                      text-xl
                      font-bold
                      text-app-primary
                    "
                  >
                    Total: $
                    {pedido.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-4
          "
        >
          <Button
            variant="secondary"
            onClick={() =>
              setPage((current) =>
                Math.max(
                  current - 1,
                  0,
                ),
              )
            }
            disabled={page === 0}
          >
            Anterior
          </Button>

          <span className="text-sm text-app-text/70">
            Página {page + 1} de{" "}
            {totalPages}
          </span>

          <Button
            variant="secondary"
            onClick={() =>
              setPage(
                (current) =>
                  current + 1,
              )
            }
            disabled={
              page + 1 >= totalPages
            }
          >
            Siguiente
          </Button>
        </div>
      )}
    </main>
  );
};

export default MisPedidosPage;