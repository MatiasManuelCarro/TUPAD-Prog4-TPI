import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
  type UserRole,
} from "@/features/auth";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

export const ProtectedRoute = ({
  allowedRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();

  const {
    status,
    hasRole,
  } = useAuth();

  if (status === "checking") {
    return (
      <p className="p-6 text-center">
        Verificando sesión...
      </p>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles &&
    !hasRole(...allowedRoles)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
};
