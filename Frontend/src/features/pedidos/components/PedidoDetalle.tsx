import { BadgeEstado } from "@/shared/components/ui/BadgeEstado";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";

import type { Pedido } from "../types/pedido.types";

type PedidoDetalleProps = {
  pedido: Pedido;
  isPending: boolean;
  onCancelar: (pedidoId: number) => void;
};

export const PedidoDetalle = ({
  pedido,
  isPending,
  onCancelar,
}: PedidoDetalleProps) => {
  return (
    <Card className="overflow-hidden">
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
          <BadgeEstado estado={pedido.estado} />

          {pedido.estado === "PENDIENTE" && (
            <Button
              variant="danger"
              onClick={() =>
                onCancelar(pedido.id)
              }
              disabled={isPending}
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
                  {item.nombre_producto}
                </p>

                <p className="text-sm text-app-text/70">
                  {item.cantidad} × $
                  {item.precio_unitario.toFixed(2)}
                </p>
              </div>

              <span
                className="
                  font-semibold
                  text-app-text
                "
              >
                ${item.subtotal.toFixed(2)}
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
            <strong>Forma de pago:</strong>{" "}
            {pedido.forma_pago}
          </p>

          <p>
            <strong>Dirección:</strong>{" "}
            {pedido.direccion_entrega}
          </p>

          {pedido.notas && (
            <p className="sm:col-span-2">
              <strong>Notas:</strong>{" "}
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
            Total: ${pedido.total.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};