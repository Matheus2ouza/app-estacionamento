
export type LoginData = {
  username: string;
  password: string;
};

export interface AuthContextData {
  token: string | null;
  userId: string | null;
  role: "ADMIN" | "EMPLOYEE" | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type DecodedToken = {
  id: string;
  role: "ADMIN" | "EMPLOYEE";
  exp: number;
  iat: number;
};