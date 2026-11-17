import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "@/features/auth";
import { useThemeStore } from "@/shared/store/themeStore";

const navLinkClass = ({
  isActive,
}: {
  isActive: boolean;
}) => `
  rounded-lg
  px-3
  py-2
  font-semibold
  transition
  ${isActive
    ? "bg-app-primary text-white"
    : "text-app-text hover:bg-app-background"
  }
`;

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const darkMode = useThemeStore(
    (state) => state.darkMode,
  );

  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme,
  );

  const isAdmin = user?.role === "admin";

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  return (
    <header
      className="
        border-b
        border-app-border
        bg-app-surface
      "
    >
      <nav
        className="
          mx-auto
          flex
          max-w-6xl
          flex-wrap
          items-center
          justify-between
          gap-4
          px-6
          py-5
        "
      >
        <NavLink
          to="/"
          className="
            text-2xl
            font-bold
            text-app-text
          "
        >
          Food Store
        </NavLink>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          {!isAuthPage && (
            <>
              <NavLink
                to="/"
                end
                className={navLinkClass}
              >
                Catálogo
              </NavLink>

              {!isAdmin && (
                <NavLink
                  to="/carrito"
                  className={navLinkClass}
                >
                  Carrito
                </NavLink>
              )}

              {user && !isAdmin && (
                <NavLink
                  to="/mis-pedidos"
                  className={navLinkClass}
                >
                  Mis pedidos
                </NavLink>
              )}

              {isAdmin && (
                <>
                  <NavLink
                    to="/admin/resumen"
                    className={navLinkClass}
                  >
                    Resumen
                  </NavLink>

                  <NavLink
                    to="/admin/categorias"
                    className={navLinkClass}
                  >
                    Categorías
                  </NavLink>

                  <NavLink
                    to="/admin/productos"
                    className={navLinkClass}
                  >
                    Productos
                  </NavLink>

                  <NavLink
                    to="/admin/pedidos"
                    className={navLinkClass}
                  >
                    Pedidos
                  </NavLink>

                  <NavLink
                    to="/admin/usuarios"
                    className={navLinkClass}
                  >
                    Usuarios
                  </NavLink>
                </>
              )}
            </>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="
              rounded-lg
              border
              border-app-border
              px-3
              py-2
              font-semibold
              text-app-text
              transition
              hover:bg-app-background
            "
          >
            {darkMode
              ? "Modo claro"
              : "Modo oscuro"}
          </button>

          {!isAuthPage && (
            <>
              {user ? (
                <>
                  <span
                    className="
                      px-2
                      text-sm
                      text-app-text/70
                    "
                  >
                    {user.full_name} · {user.role}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      void handleLogout()
                    }
                    className="
                      rounded-lg
                      border
                      border-app-border
                      px-3
                      py-2
                      font-semibold
                      text-app-text
                      transition
                      hover:bg-app-background
                    "
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className={navLinkClass}
                >
                  Iniciar sesión
                </NavLink>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};