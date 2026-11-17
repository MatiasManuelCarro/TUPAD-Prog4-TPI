import { useForm } from "@tanstack/react-form";

import type { Categoria } from "@/features/categories";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";

import type {
  Producto,
  ProductoCreate,
} from "../types/producto.types";

type ProductoModalProps = {
  producto: Producto | null;
  categorias: Categoria[];
  isPending: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (producto: ProductoCreate) => void;
};

export const ProductoModal = ({
  producto,
  categorias,
  isPending,
  errorMessage,
  onClose,
  onSubmit,
}: ProductoModalProps) => {
  const esEdicion = producto !== null;

  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio_base: producto?.precio_base ?? 0,
      imagen_url: producto?.imagen_url ?? "",
      stock: producto?.stock ?? 0,
      disponible: producto?.disponible ?? true,
      categoria_id:
        producto?.categoria_id ??
        categorias[0]?.id ??
        0,
    },

    onSubmit: ({ value }) => {
      const descripcion = value.descripcion.trim();
      const imagenUrl = value.imagen_url.trim();

      onSubmit({
        nombre: value.nombre.trim(),
        descripcion:
          descripcion.length > 0
            ? descripcion
            : null,
        precio_base: value.precio_base,
        imagen_url:
          imagenUrl.length > 0
            ? imagenUrl
            : null,
        stock: value.stock,
        disponible: value.disponible,
        categoria_id: value.categoria_id,
      });
    },
  });

  return (
    <Modal
      title={
        esEdicion
          ? "Editar producto"
          : "Nuevo producto"
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
            onChange: ({ value }) =>
              value.trim().length === 0
                ? "El nombre es obligatorio"
                : undefined,
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

              <input
                id={field.name}
                name={field.name}
                type="text"
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

        <form.Field
          name="precio_base"
          validators={{
            onChange: ({ value }) =>
              value < 0
                ? "El precio no puede ser negativo"
                : undefined,
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="mb-1 block font-medium"
              >
                Precio
              </label>

              <input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                step="0.01"
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

        <form.Field name="imagen_url">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="mb-1 block font-medium"
              >
                URL de imagen
              </label>

              <input
                id={field.name}
                name={field.name}
                type="url"
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

              <input
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

        <form.Field name="categoria_id">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="mb-1 block font-medium"
              >
                Categoría
              </label>

              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    Number(event.target.value),
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
                {categorias.map((categoria) => (
                  <option
                    key={categoria.id}
                    value={categoria.id}
                  >
                    {categoria.nombre}
                  </option>
                ))}
              </select>
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
              : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};