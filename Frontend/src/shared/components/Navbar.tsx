import {
  NavLink,
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
  px-4
  py-2
  font-semibold
  transition
  ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
  }
`;

export const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const darkMode = useThemeStore(
    (state) => state.darkMode,
  );

  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme,
  );

  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  return (
    <header
      className="
        border-b
        border-gray-200
        bg-white
        dark:border-gray-700
        dark:bg-gray-900
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
            text-gray-900
            dark:text-white
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
          <NavLink
            to="/"
            className={navLinkClass}
          >
            Catálogo
          </NavLink>

          <NavLink
            to="/carrito"
            className={navLinkClass}
          >
            Carrito
          </NavLink>

          {user && (
            <NavLink
              to="/mis-pedidos"
              className={navLinkClass}
            >
              Mis pedidos
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin/resumen"
              className={navLinkClass}
            >
              Administración
            </NavLink>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="
              rounded-lg
              border
              border-gray-300
              px-4
              py-2
              font-semibold
              text-gray-700
              hover:bg-gray-100
              dark:border-gray-600
              dark:text-gray-200
              dark:hover:bg-gray-800
            "
          >
            {darkMode ? "Modo claro" : "Modo oscuro"}
          </button>

          {user ? (
            <>
              <span
                className="
                  px-2
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                "
              >
                {user.full_name} · {user.role}
              </span>

              <button
                type="button"
                onClick={() => void handleLogout()}
                className="
                  rounded-lg
                  border
                  border-gray-300
                  px-4
                  py-2
                  font-semibold
                  text-gray-700
                  hover:bg-gray-100
                  dark:border-gray-600
                  dark:text-gray-200
                  dark:hover:bg-gray-800
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
        </div>
      </nav>
    </header>
  );
};