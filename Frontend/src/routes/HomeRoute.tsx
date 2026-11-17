import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth";
import { CatalogPage } from "@/features/products";

export const HomeRoute = () => {
  const {
    user,
    status,
  } = useAuth();

  if (status === "checking") {
    return (
      <p className="p-6 text-center text-app-text">
        Verificando sesión...
      </p>
    );
  }

  if (
    status === "unauthenticated" ||
    !user
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role === "admin") {
    return (
      <Navigate
        to="/admin/resumen"
        replace
      />
    );
  }

  return <CatalogPage />;
};