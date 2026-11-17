import { useForm } from "@tanstack/react-form";
import { Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/shared/components/ui/Button";
import { useNotificationStore } from "@/shared/store/notificationStore";
import { useCartStore } from "@/store/cartStore";

import { useCrearPedido } from "../hooks/useCrearPedido";

import type {
  FormaPago,
  PedidoCreate,
} from "../types/pedido.types";

export const CheckoutPage = () => {
  const navigate = useNavigate();

  const items = useCartStore(
    (state) => state.items,
  );

  const clearCart = useCartStore(
    (state) => state.clearCart,
  );

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const crearPedidoMutation = useCrearPedido();

  const total = items.reduce(
    (acumulador, item) =>
      acumulador +
      item.producto.precio_base * item.cantidad,
    0,
  );

  const form = useForm({
    defaultValues: {
      forma_pago: "EFECTIVO" as FormaPago,
      direccion_entrega: "",
      notas: "",
    },

    onSubmit: ({ value }) => {
      const notas = value.notas.trim();

      const pedido: PedidoCreate = {
        items: items.map((item) => ({
          producto_id: item.producto.id,
          cantidad: item.cantidad,
        })),
        forma_pago: value.forma_pago,
        direccion_entrega:
          value.direccion_entrega.trim(),
        notas:
          notas.length > 0
            ? notas
            : null,
      };

      crearPedidoMutation.mutate(
        pedido,
        {
          onSuccess: () => {
            clearCart();

            showNotification(
              "Pedido creado correctamente",
            );

            navigate("/mis-pedidos");
          },

          onError: () => {
            showNotification(
              "No se pudo crear el pedido",
            );
          },
        },
      );
    },
  });

  if (items.length === 0) {
    return (
      <Navigate
        to="/carrito"
        replace
      />
    );
  }

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-3xl
        p-6
      "
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-app-text">
          Finalizar compra
        </h1>

        <p className="mt-1 text-app-text/70">
          Completa los datos de entrega para confirmar el pedido.
        </p>
      </div>

      <form
        className="
          space-y-6
          rounded-xl
          border
          border-app-border
          bg-app-surface
          p-6
          shadow-sm
        "
        onSubmit={(event) => {
          event.preventDefault();

          if (crearPedidoMutation.isPending) {
            return;
          }

          form.handleSubmit();
        }}
      >
        <form.Field
          name="forma_pago"
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="mb-1 block font-medium text-app-text"
              >
                Forma de pago
              </label>

              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as FormaPago,
                  )
                }
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
                <option value="EFECTIVO">
                  Efectivo
                </option>

                <option value="TRANSFERENCIA">
                  Transferencia
                </option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field
          name="direccion_entrega"
          validators={{
            onChange: ({ value }) => {
              const direccion = value.trim();

              if (direccion.length < 5) {
                return "La dirección debe tener al menos 5 caracteres";
              }

              if (direccion.length > 200) {
                return "La dirección no puede superar los 200 caracteres";
              }

              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="mb-1 block font-medium text-app-text"
              >
                Dirección de entrega
              </label>

              <input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                maxLength={200}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value,
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-app-border
                  bg-app-background
                  p-2
                  text-app-text
                "
              />

              {!field.state.meta.isValid && (
                <p className="mt-1 text-sm text-app-danger">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="notas">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="mb-1 block font-medium text-app-text"
              >
                Notas
              </label>

              <textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value,
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-app-border
                  bg-app-background
                  p-2
                  text-app-text
                "
              />
            </div>
          )}
        </form.Field>

        <div
          className="
            border-t
            border-app-border
            pt-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <span className="font-semibold text-app-text">
              Total
            </span>

            <span className="text-xl font-bold text-app-primary">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {crearPedidoMutation.isError && (
          <p className="text-sm text-app-danger">
            No se pudo completar el pedido.
          </p>
        )}

        <div
          className="
            flex
            justify-end
            gap-3
          "
        >
          <Button
            variant="secondary"
            onClick={() =>
              navigate("/carrito")
            }
            disabled={crearPedidoMutation.isPending}
          >
            Volver
          </Button>

          <Button
            type="submit"
            disabled={crearPedidoMutation.isPending}
          >
            {crearPedidoMutation.isPending
              ? "Confirmando..."
              : "Confirmar pedido"}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default CheckoutPage;