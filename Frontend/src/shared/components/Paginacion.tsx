import { Button } from "@/shared/components/ui/Button";

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  puedeAnterior: boolean;
  puedeSiguiente: boolean;
  onAnterior: () => void;
  onSiguiente: () => void;
}

export const Paginacion = ({
  paginaActual,
  totalPaginas,
  puedeAnterior,
  puedeSiguiente,
  onAnterior,
  onSiguiente,
}: PaginacionProps) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <span className="text-sm text-app-text/70">
        Página {paginaActual} de {totalPaginas}
      </span>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={onAnterior}
          disabled={!puedeAnterior}
        >
          Anterior
        </Button>

        <Button
          variant="secondary"
          onClick={onSiguiente}
          disabled={!puedeSiguiente}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};