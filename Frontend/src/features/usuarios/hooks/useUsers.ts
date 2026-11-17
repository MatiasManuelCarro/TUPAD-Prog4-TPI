import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/shared/store/notificationStore";

import {
  activarUsuario,
  desactivarUsuario,
  getUsuarios,
} from "../services/userService";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const usuariosQuery = useQuery({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
  });

  const activarMutation = useMutation({
    mutationFn: activarUsuario,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });

      showNotification(
        "Usuario activado correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo activar el usuario",
        ),
      );
    },
  });

  const desactivarMutation = useMutation({
    mutationFn: desactivarUsuario,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });

      showNotification(
        "Usuario desactivado correctamente",
      );
    },

    onError: (error) => {
      showNotification(
        handleApiError(
          error,
          "No se pudo desactivar el usuario",
        ),
      );
    },
  });

  return {
    usuariosQuery,
    activarMutation,
    desactivarMutation,
  };
};