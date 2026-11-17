import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/Button";


export const UnauthorizedPage = () => {
  return (
    <main
      className="
        mx-auto
        flex
        w-full
        max-w-md
        flex-1
        items-center
        p-6
      "
    >
      <div
        className="
          w-full
          rounded-xl
          border
          border-app-border
          bg-app-surface
          p-6
          text-center
          shadow-sm
        "
      >
        <h1 className="text-3xl font-bold text-app-text">
          Acceso denegado
        </h1>

        <p className="mt-2 text-app-text/70">
          No tienes permisos para acceder a esta página.
        </p>

        <div className="mt-6">
          <Link to="/categories">
            <Button>
              Volver a categorías
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};


export default UnauthorizedPage;