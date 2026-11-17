export { useAuth } from "./hooks/useAuth";
export { useAuthStore } from "./store/authStore";

export { default as LoginPage } from "./pages/LoginPage";
export { default as RegisterPage } from "./pages/RegisterPage";

export type {
  User,
  UserRole,
  RegisterData,
} from "./types/auth.types";