import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/axiosInstance";
import type { AuthContextData, DecodedToken } from "../types/auth";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Tempo de sessão
const EXPIRATION_MINUTES = 60;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"ADMIN" | "NORMAL" | "MANAGER" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const expiration = await SecureStore.getItemAsync("token_expiration");

        if (storedToken && expiration) {
          const now = Date.now();
          const expiresAt = parseInt(expiration, 10);

          if (now < expiresAt) {
            const decoded = jwtDecode<DecodedToken>(storedToken);
            setToken(storedToken);
            setUserId(decoded.id);
            setRole(decoded.role);
          } else {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("token_expiration");
          }
        }
      } catch (error) {
        console.error("[Auth] Erro ao restaurar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = async (newToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(newToken);
      setToken(newToken);
      setUserId(decoded.id);
      setRole(decoded.role);

      const expiresAt = Date.now() + EXPIRATION_MINUTES * 60 * 1000;
      await SecureStore.setItemAsync("token", newToken);
      await SecureStore.setItemAsync("token_expiration", expiresAt.toString());
    } catch (error) {
      console.error("[Auth] Erro no login:", error);
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setUserId(null);
      setRole(null);
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("token_expiration");
    } catch (error) {
      console.error("[Auth] Erro no logout:", error);
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, userId, role, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
