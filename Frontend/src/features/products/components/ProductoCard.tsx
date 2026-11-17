import type { Producto } from "../types/producto.types";

type ProductoCardProps = {
  producto: Producto;
  onAddToCart: (producto: Producto) => void;
};

export const ProductoCard = ({
  producto,
  onAddToCart,
}: ProductoCardProps) => {
  const puedeAgregar =
    producto.disponible && producto.stock > 0;

  return (
    <article
      className="
        flex
        h-full
        flex-col
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
          aspect-video
          items-center
          justify-center
          overflow-hidden
          bg-app-background
        "
      >
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <span className="text-sm text-app-text/60">
            Sin imagen
          </span>
        )}
      </div>

      <div
        className="
          flex
          flex-1
          flex-col
          gap-3
          p-5
        "
      >
        <div>
          <p
            className="
              text-sm
              font-medium
              text-app-primary
            "
          >
            {producto.categoria.nombre}
          </p>

          <h2
            className="
              mt-1
              text-xl
              font-bold
              text-app-text
            "
          >
            {producto.nombre}
          </h2>
        </div>

        <p
          className="
            flex-1
            text-sm
            text-app-text/70
          "
        >
          {producto.descripcion ||
            "Sin descripción"}
        </p>

        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-xl
                font-bold
                text-app-text
              "
            >
              ${producto.precio_base}
            </p>

            <p className="text-sm text-app-text/60">
              {puedeAgregar
                ? `Stock: ${producto.stock}`
                : "Sin stock"}
            </p>
          </div>

          <button
            type="button"
            disabled={!puedeAgregar}
            onClick={() =>
              onAddToCart(producto)
            }
            className="
              rounded-lg
              bg-app-primary
              px-4
              py-2
              font-semibold
              text-white
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
};