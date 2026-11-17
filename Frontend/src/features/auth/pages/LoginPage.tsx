import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setErrorMessage(null);
      setIsPending(true);

      try {
        await login(
          value.username.trim(),
          value.password,
        );

        navigate("/");
      } catch {
        setErrorMessage(
          "Usuario o contraseña incorrectos",
        );
      } finally {
        setIsPending(false);
      }
    },
  });

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
          shadow-sm
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
            Iniciar sesión
          </h1>

          <p className="mt-1 text-app-text/70">
            Ingresa con tu cuenta para continuar.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            if (isPending) {
              return;
            }

            form.handleSubmit();
          }}
        >
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0
                  ? "El usuario es obligatorio"
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="
                    mb-1
                    block
                    font-medium
                    text-app-text
                  "
                >
                  Usuario
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  autoComplete="username"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-app-border
                    bg-app-background
                    p-2
                    text-app-text
                  "
                />

                {!field.state.meta.isValid && (
                  <p className="mt-1 text-sm text-app-danger">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length === 0
                  ? "La contraseña es obligatoria"
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="
                    mb-1
                    block
                    font-medium
                    text-app-text
                  "
                >
                  Contraseña
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  autoComplete="current-password"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-app-border
                    bg-app-background
                    p-2
                    text-app-text
                  "
                />

                {!field.state.meta.isValid && (
                  <p className="mt-1 text-sm text-app-danger">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {errorMessage && (
            <p className="text-sm text-app-danger">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="
              w-full
              rounded-lg
              bg-app-primary
              px-4
              py-2
              font-semibold
              text-white
              transition
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {isPending
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>

          <p className="text-center text-sm text-app-text/70">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="
                font-semibold
                text-app-primary
              "
            >
              Registrarse
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;