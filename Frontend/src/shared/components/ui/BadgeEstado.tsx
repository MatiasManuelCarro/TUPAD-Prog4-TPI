import type { EstadoPedido } from "@/features/pedidos/types/pedido.types";

type BadgeEstadoProps = {
  estado: EstadoPedido;
};

const estadoConfig: Record<
  EstadoPedido,
  {
    label: string;
    className: string;
  }
> = {
  PENDIENTE: {
    label: "Pendiente",
    className: "text-app-pending",
  },
  EN_PREPARACION: {
    label: "En preparación",
    className: "text-app-preparing",
  },
  ENTREGADO: {
    label: "Entregado",
    className: "text-app-delivered",
  },
  CANCELADO: {
    label: "Cancelado",
    className: "text-app-cancelled",
  },
};

export const BadgeEstado = ({
  estado,
}: BadgeEstadoProps) => {
  const config = estadoConfig[estado];

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        border-current
        px-3
        py-1
        text-sm
        font-semibold
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
};