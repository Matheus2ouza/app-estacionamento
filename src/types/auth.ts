
export type LoginData = {
  username: string;
  password: string;
};

export interface AuthContextData {
  token: string | null;
  userId: string | null;
  role: "ADMIN" | "NORMAL" | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type DecodedToken = {
  id: string;
  role: "ADMIN" | "NORMAL";
  exp: number;
  iat: number;
};