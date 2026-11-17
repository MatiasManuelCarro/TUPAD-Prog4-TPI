import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  activarUsuario,
  desactivarUsuario,
  getUsuarios,
} from "../services/userService";

import { useNotificationStore } from "@/shared/store/notificationStore";

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

    onError: () => {
      showNotification(
        "No se pudo activar el usuario",
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

    onError: () => {
      showNotification(
        "No se pudo desactivar el usuario",
      );
    },
  });

  return {
    usuariosQuery,
    activarMutation,
    desactivarMutation,
  };
};