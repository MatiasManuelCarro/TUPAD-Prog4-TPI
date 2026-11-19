import { useForm } from "@tanstack/react-form";
import { Input } from "@/shared/components/ui/Input";

import type {
  Categoria,
  CategoriaCreate,
} from "../types/categoria.types";

import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";

type CategoriaModalProps = {
  categoria: Categoria | null;
  isPending: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (categoria: CategoriaCreate) => void;
};

export const CategoriaModal = ({
  categoria,
  isPending,
  errorMessage,
  onClose,
  onSubmit,
}: CategoriaModalProps) => {
  const esEdicion = categoria !== null;

  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? "",
      descripcion: categoria?.descripcion ?? "",
    },

    onSubmit: ({ value }) => {
      const descripcion = value.descripcion.trim();

      onSubmit({
        nombre: value.nombre.trim(),
        descripcion:
          descripcion.length > 0
            ? descripcion
            : null,
      });
    },
  });

  return (
    <Modal
      title={
        esEdicion
          ? "Editar categoría"
          : "Nueva categoría"
      }
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
          name="nombre"
          validators={{
            onChange: ({ value }) => {
              const nombre = value.trim();

              if (nombre.length < 2) {
                return "El nombre debe tener al menos 2 caracteres";
              }

              if (nombre.length > 100) {
                return "El nombre no puede superar los 100 caracteres";
              }

              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="mb-1 block font-medium"
              >
                Nombre
              </label>

              <Input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value,
                  )
                }
                maxLength={100}
              />

              {!field.state.meta.isValid && (
                <p className="mt-1 text-sm text-app-danger">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="descripcion">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="mb-1 block font-medium"
              >
                Descripción
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
              : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};