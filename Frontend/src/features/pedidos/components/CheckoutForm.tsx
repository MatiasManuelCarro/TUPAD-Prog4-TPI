import { useForm } from "@tanstack/react-form";

import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Input } from "@/shared/components/ui/Input";

import type { CartItem } from "@/store/cartStore";

import type {
  FormaPago,
  PedidoCreate,
} from "../types/pedido.types";

type CheckoutFormProps = {
  items: CartItem[];
  total: number;
  isPending: boolean;
  isError: boolean;
  onSubmit: (pedido: PedidoCreate) => void;
  onVolver: () => void;
};

export const CheckoutForm = ({
  items,
  total,
  isPending,
  isError,
  onSubmit,
  onVolver,
}: CheckoutFormProps) => {
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
          producto_id: item.producto_id,
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

      onSubmit(pedido);
    },
  });

  return (
    <Card>
      <form
        className="
          space-y-6
          p-6
        "
        onSubmit={(event) => {
          event.preventDefault();

          if (isPending) {
            return;
          }

          form.handleSubmit();
        }}
      >
        <form.Field name="forma_pago">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="
                  mb-1
                  block
                  font-medium
                  text-app-text
                "
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
                className="
                  mb-1
                  block
                  font-medium
                  text-app-text
                "
              >
                Dirección de entrega
              </label>

              <Input
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
                className="
                  mb-1
                  block
                  font-medium
                  text-app-text
                "
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
            <span
              className="
                font-semibold
                text-app-text
              "
            >
              Total
            </span>

            <span
              className="
                text-xl
                font-bold
                text-app-primary
              "
            >
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {isError && (
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
            type="button"
            variant="secondary"
            onClick={onVolver}
            disabled={isPending}
          >
            Volver
          </Button>

          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending
              ? "Confirmando..."
              : "Confirmar pedido"}
          </Button>
        </div>
      </form>
    </Card>
  );
};