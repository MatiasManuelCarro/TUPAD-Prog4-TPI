import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/shared/store/notificationStore";
import { useCartStore } from "@/store/cartStore";

import { CheckoutForm } from "../components/CheckoutForm";
import { useCrearPedido } from "../hooks/useCrearPedido";

import type { PedidoCreate } from "../types/pedido.types";

export const CheckoutPage = () => {
  const navigate = useNavigate();

  const items = useCartStore(
    (state) => state.items,
  );

  const total = useCartStore(
    (state) => state.total,
  );

  const vaciar = useCartStore(
    (state) => state.vaciar,
  );

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const crearPedidoMutation = useCrearPedido();

  const handleSubmit = (
    pedido: PedidoCreate,
  ) => {
    crearPedidoMutation.mutate(
      pedido,
      {
        onSuccess: () => {
          vaciar();

          showNotification(
            "Pedido creado correctamente",
          );

          navigate("/mis-pedidos");
        },

        onError: (error) => {
          showNotification(
            handleApiError(
              error,
              "No se pudo crear el pedido",
            ),
          );
        },
      },
    );
  };

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
        <h1
          className="
            text-3xl
            font-bold
            text-app-text
          "
        >
          Finalizar compra
        </h1>

        <p className="mt-1 text-app-text/70">
          Completa los datos de entrega para confirmar el pedido.
        </p>
      </div>

      <CheckoutForm
        items={items}
        total={total}
        isPending={crearPedidoMutation.isPending}
        isError={crearPedidoMutation.isError}
        onSubmit={handleSubmit}
        onVolver={() => navigate("/carrito")}
      />
    </main>
  );
};

export default CheckoutPage;