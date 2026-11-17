import { create } from "zustand";
import { persist } from "zustand/middleware";

import { axiosInstance } from "@/shared/api/axiosInstance";

import type {
  User,
  UserRole,
} from "../types/auth.types";

export type AuthStatus =
  | "checking"
  | "authenticated"
  | "unauthenticated";

type AuthState = {
  user: User | null;
  status: AuthStatus;

  login: (
    username: string,
    password: string,
  ) => Promise<void>;

  logout: () => Promise<void>;

  checkSession: () => Promise<void>;

  hasRole: (...roles: UserRole[]) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: "checking",

      login: async (
        username: string,
        password: string,
      ) => {
        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("password", password);

        await axiosInstance.post(
          "/auth/token",
          formData,
        );

        const response = await axiosInstance.get<User>(
          "/auth/me",
        );

        set({
          user: response.data,
          status: "authenticated",
        });
      },

      logout: async () => {
        await axiosInstance.post(
          "/auth/logout",
        );

        set({
          user: null,
          status: "unauthenticated",
        });
      },

      checkSession: async () => {
        set({
          status: "checking",
        });

        try {
          const response =
            await axiosInstance.get<User>(
              "/auth/me",
            );

          set({
            user: response.data,
            status: "authenticated",
          });
        } catch {
          set({
            user: null,
            status: "unauthenticated",
          });
        }
      },

      hasRole: (...roles: UserRole[]) => {
        const user = get().user;

        if (!user) {
          return false;
        }

        return roles.includes(user.role);
      },
    }),
    {
      name: "food-store-auth",

      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);