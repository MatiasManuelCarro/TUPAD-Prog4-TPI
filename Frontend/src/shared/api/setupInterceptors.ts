import type { AxiosError } from "axios";

import { useAuthStore } from "@/features/auth";
import { axiosInstance } from "./axiosInstance";

type ApiErrorResponse = {
  detail?: unknown;
};

const AUTH_ROUTES = [
  "/auth/token",
  "/auth/me",
];

axiosInstance.interceptors.response.use(
  (response) => response,

  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    const url = error.config?.url ?? "";

    const isAuthRoute = AUTH_ROUTES.some(
      (route) => url.includes(route),
    );

    const isExpiredSession =
      status === 401 && !isAuthRoute;

    const isDisabledUser =
      status === 400 &&
      detail === "Cuenta de usuario desactivada";

    if (isExpiredSession || isDisabledUser) {
      useAuthStore.setState({
        user: null,
        status: "unauthenticated",
      });
    }

    return Promise.reject(error);
  },
);