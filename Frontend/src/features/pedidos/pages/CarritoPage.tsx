import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { useCartStore } from "@/store/cartStore";

export const CarritoPage = () => {
  const items = useCartStore(
    (state) => state.items,
  );

  const total = useCartStore(
    (state) => state.total,
  );

  const quitar = useCartStore(
    (state) => state.quitar,
  );

  const cambiarCantidad = useCartStore(
    (state) => state.cambiarCantidad,
  );

  const vaciar = useCartStore(
    (state) => state.vaciar,
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <h1
          className="
            mb-6
            text-3xl
            font-bold
            text-app-text
          "
        >
          Carrito
        </h1>

        <EmptyState message="Tu carrito está vacío." />

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="
              font-semibold
              text-app-primary
            "
          >
            Volver al catálogo
          </Link>
        </div>
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
      <div
        className="
          mb-6
          flex
          flex-wrap
          items-center
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
            Carrito
          </h1>

          <p className="mt-1 text-app-text/70">
            Revisa los productos antes de continuar.
          </p>
        </div>

        <Button
          variant="danger"
          onClick={vaciar}
        >
          Vaciar carrito
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const subtotal =
            item.precio_unitario *
            item.cantidad;

          return (
            <article
              key={item.producto_id}
              className="
                flex
                flex-col
                gap-4
                rounded-xl
                border
                border-app-border
                bg-app-surface
                p-4
                shadow-sm
                sm:flex-row
                sm:items-center
              "
            >
              <div className="min-w-0 flex-1">
                <h2
                  className="
                    text-lg
                    font-bold
                    text-app-text
                  "
                >
                  {item.nombre}
                </h2>

                <p className="text-sm text-app-text/70">
                  ${item.precio_unitario.toFixed(2)} por unidad
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
                <label
                  htmlFor={`cantidad-${item.producto_id}`}
                  className="
                    text-sm
                    font-medium
                    text-app-text
                  "
                >
                  Cantidad
                </label>

                <input
                  id={`cantidad-${item.producto_id}`}
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(event) => {
                    const cantidad =
                      event.target.valueAsNumber;

                    if (Number.isNaN(cantidad)) {
                      return;
                    }

                    cambiarCantidad(
                      item.producto_id,
                      cantidad,
                    );
                  }}
                  className="
                    w-20
                    rounded-lg
                    border
                    border-app-border
                    bg-app-background
                    p-2
                    text-app-text
                  "
                />

                <div
                  className="
                    min-w-28
                    text-right
                    font-bold
                    text-app-text
                  "
                >
                  ${subtotal.toFixed(2)}
                </div>

                <Button
                  variant="danger"
                  onClick={() =>
                    quitar(item.producto_id)
                  }
                >
                  Quitar
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <div
        className="
          mt-8
          rounded-xl
          border
          border-app-border
          bg-app-surface
          p-6
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <span
            className="
              text-xl
              font-semibold
              text-app-text
            "
          >
            Total
          </span>

          <span
            className="
              text-2xl
              font-bold
              text-app-primary
            "
          >
            ${total.toFixed(2)}
          </span>
        </div>

        <div
          className="
            mt-6
            flex
            flex-wrap
            justify-end
            gap-3
          "
        >
          <Link
            to="/"
            className="
              rounded-lg
              border
              border-app-border
              px-4
              py-2
              font-semibold
              text-app-text
            "
          >
            Seguir comprando
          </Link>

          <Link
            to="/checkout"
            className="
              rounded-lg
              bg-app-primary
              px-4
              py-2
              font-semibold
              text-white
            "
          >
            Finalizar compra
          </Link>
        </div>
      </div>
    </main>
  );
};

export default CarritoPage;