import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadingState } from "@/shared/components/ui/LoadingState";

import { useResumenPedidos } from "../hooks/useResumenPedidos";

type ResumenCardProps = {
  titulo: string;
  valor: string | number;
};

const ResumenCard = ({
  titulo,
  valor,
}: ResumenCardProps) => {
  return (
    <article
      className="
        rounded-xl
        border
        border-app-border
        bg-app-surface
        p-6
        shadow-sm
      "
    >
      <p
        className="
          text-sm
          font-medium
          text-app-text/70
        "
      >
        {titulo}
      </p>

      <p
        className="
          mt-2
          text-3xl
          font-bold
          text-app-primary
        "
      >
        {valor}
      </p>
    </article>
  );
};

export const AdminResumenPage = () => {
  const resumenQuery = useResumenPedidos();

  if (resumenQuery.isPending) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <LoadingState message="Cargando resumen..." />
      </main>
    );
  }

  if (resumenQuery.isError) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <ErrorState
          message={resumenQuery.error.message}
        />
      </main>
    );
  }

  const resumen = resumenQuery.data;

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
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
          Resumen
        </h1>

        <p className="mt-1 text-app-text/70">
          Estado general de los pedidos.
        </p>
      </div>

      <section
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <ResumenCard
          titulo="Pendientes"
          valor={resumen.pendientes}
        />

        <ResumenCard
          titulo="En preparación"
          valor={resumen.en_preparacion}
        />

        <ResumenCard
          titulo="Entregados"
          valor={resumen.entregados}
        />

        <ResumenCard
          titulo="Cancelados"
          valor={resumen.cancelados}
        />

        <ResumenCard
          titulo="Pedidos de hoy"
          valor={resumen.pedidos_hoy}
        />

        <ResumenCard
          titulo="Ingresos entregados"
          valor={`$${resumen.ingresos_entregados.toFixed(2)}`}
        />
      </section>
    </main>
  );
};

export default AdminResumenPage;