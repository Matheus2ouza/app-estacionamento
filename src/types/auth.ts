
export type LoginData = {
  username: string;
  password: string;
};

export interface AuthContextData {
  token: string | null;
  userId: string | null;
  role: "ADMIN" | "NORMAL" | "MANAGER" | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Employee {
  id: string;
  username: string;
  role: "NORMAL" | "ADMIN" | "MANAGER";
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export const roleHierarchy = {
  ADMIN: 3,
  MANAGER: 2,
  NORMAL: 1,
};

export type DecodedToken = {
  id: string;
  role: "ADMIN" | "NORMAL" | "MANAGER";
  exp: number;
  iat: number;
};

export type DataUser = {
  username: string;
  password: string;
  role: "ADMIN" | "NORMAL" | "MANAGER";
  adminPassword?: string;
}

export type ListUsers = {
  list: {
    id: string;
    username: string;
    role: "ADMIN" | "NORMAL" | "MANAGER";
    created_at: string;
    updated_at: string;
    updated_by: string;
  }[];
};

export type UserData = {
  id: string;
  username: string;
  password?: string;
  role: "ADMIN" | "NORMAL" | "MANAGER";
}