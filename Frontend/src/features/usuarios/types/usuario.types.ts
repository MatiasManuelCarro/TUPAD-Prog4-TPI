import type { UserRole } from "@/features/auth";

export type Usuario = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  disabled: boolean;
  created_at: string;
};