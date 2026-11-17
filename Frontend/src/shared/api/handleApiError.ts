import axios from "axios";

type ApiErrorResponse = {
  detail?: unknown;
};

export const handleApiError = (
  error: unknown,
  fallbackMessage = "Ocurrió un error inesperado",
): string => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  const detail = error.response?.data?.detail;

  if (
    typeof detail === "string" &&
    detail.trim().length > 0
  ) {
    return detail;
  }

  return fallbackMessage;
};