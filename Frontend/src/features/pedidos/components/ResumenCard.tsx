import { Card } from "@/shared/components/ui/Card";

type ResumenCardProps = {
  titulo: string;
  valor: string | number;
};

export const ResumenCard = ({
  titulo,
  valor,
}: ResumenCardProps) => {
  return (
    <Card className="p-6">
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
    </Card>
  );
};