import { useForm } from "@tanstack/react-form";

import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Input } from "@/shared/components/ui/Input";

import type {
  Producto,
  ProductoStockUpdate,
} from "../types/producto.types";

type StockModalProps = {
  producto: Producto;
  isPending: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (stock: ProductoStockUpdate) => void;
};

export const StockModal = ({
  producto,
  isPending,
  errorMessage,
  onClose,
  onSubmit,
}: StockModalProps) => {
  const form = useForm({
    defaultValues: {
      stock: producto.stock,
      disponible: producto.disponible,
    },

    onSubmit: ({ value }) => {
      onSubmit({
        stock: value.stock,
        disponible: value.disponible,
      });
    },
  });

  return (
    <Modal
      title={`Stock de ${producto.nombre}`}
      onClose={onClose}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();

          if (isPending) {
            return;
          }

          form.handleSubmit();
        }}
      >
        <form.Field
          name="stock"
          validators={{
            onChange: ({ value }) =>
              value < 0
                ? "El stock no puede ser negativo"
                : undefined,
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="mb-1 block font-medium"
              >
                Stock
              </label>

              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                step="1"
                value={field.state.value}
                onChange={(event) => {
                  const value =
                    event.target.valueAsNumber;

                  field.handleChange(
                    Number.isNaN(value)
                      ? 0
                      : value,
                  );
                }}
              />

              {!field.state.meta.isValid && (
                <p className="mt-1 text-sm text-app-danger">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="disponible">
          {(field) => (
            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-2
              "
            >
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.checked,
                  )
                }
              />

              Disponible
            </label>
          )}
        </form.Field>

        {errorMessage && (
          <p className="text-sm text-app-danger">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending
              ? "Guardando..."
              : "Guardar stock"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};