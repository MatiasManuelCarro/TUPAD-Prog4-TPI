import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { useCartStore } from "@/store/cartStore";

export const CarritoPage = () => {
  const items = useCartStore((state) => state.items);

  const removeItem = useCartStore((state) => state.removeItem);

  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const clearCart = useCartStore((state) => state.clearCart);

  const total = items.reduce(
    (acumulador, item) =>
      acumulador + item.producto.precio_base * item.cantidad,
    0
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-app-text">Carrito</h1>

        <EmptyState message="Tu carrito está vacío." />

        <div className="mt-6 text-center">
          <Link to="/" className="font-semibold text-app-primary">
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
          <h1 className="text-3xl font-bold text-app-text">Carrito</h1>

          <p className="mt-1 text-app-text/70">
            Revisa los productos antes de continuar.
          </p>
        </div>

        <Button variant="danger" onClick={clearCart}>
          Vaciar carrito
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.producto.id}
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
            <div
              className="
                h-24
                w-full
                shrink-0
                overflow-hidden
                rounded-lg
                bg-app-background
                sm:w-32
              "
            >
              {item.producto.imagen_url ? (
                <img
                  src={item.producto.imagen_url}
                  alt={item.producto.nombre}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    items-center
                    justify-center
                    text-sm
                    text-app-text/60
                  "
                >
                  Sin imagen
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-sm
                  font-medium
                  text-app-primary
                "
              >
                {item.producto.categoria.nombre}
              </p>

              <h2 className="text-lg font-bold text-app-text">
                {item.producto.nombre}
              </h2>

              <p className="text-sm text-app-text/70">
                ${item.producto.precio_base} por unidad
              </p>

              <p className="text-sm text-app-text/60">
                Stock disponible: {item.producto.stock}
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
                htmlFor={`cantidad-${item.producto.id}`}
                className="text-sm font-medium text-app-text"
              >
                Cantidad
              </label>

              <input
                id={`cantidad-${item.producto.id}`}
                type="number"
                min="1"
                max={item.producto.stock}
                value={item.cantidad}
                onChange={(event) => {
                  const cantidad = event.target.valueAsNumber;

                  if (Number.isNaN(cantidad)) {
                    return;
                  }

                  updateQuantity(item.producto.id, cantidad);
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
                ${(item.producto.precio_base * item.cantidad).toFixed(2)}
              </div>

              <Button
                variant="danger"
                onClick={() => removeItem(item.producto.id)}
              >
                Quitar
              </Button>
            </div>
          </article>
        ))}
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
          <span className="text-xl font-semibold text-app-text">Total</span>

          <span className="text-2xl font-bold text-app-primary">
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
