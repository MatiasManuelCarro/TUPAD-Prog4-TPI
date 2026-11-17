import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const user = useAuthStore(
    (state) => state.user,
  );

  const status = useAuthStore(
    (state) => state.status,
  );

  const login = useAuthStore(
    (state) => state.login,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const checkSession = useAuthStore(
    (state) => state.checkSession,
  );

  const hasRole = useAuthStore(
    (state) => state.hasRole,
  );

  return {
    user,
    status,
    login,
    logout,
    checkSession,
    hasRole,
  };
};