import { axiosInstance } from "@/shared/api/axiosInstance";

import type {
  RegisterData,
  User,
} from "../types/auth.types";

export const registerUser = async (
  data: RegisterData,
): Promise<User> => {
  const response = await axiosInstance.post<User>(
    "/auth/register",
    data,
  );

  return response.data;
};