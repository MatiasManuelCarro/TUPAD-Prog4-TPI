export type UserRole = "user" | "admin";

export type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  disabled: boolean;
  created_at: string;
};

export type RegisterData = {
  username: string;
  full_name: string;
  email: string;
  password: string;
};
