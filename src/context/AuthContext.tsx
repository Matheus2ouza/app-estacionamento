import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/axiosInstance";
import type { AuthContextData, DecodedToken } from "../types/auth";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const ADMIN_EXPIRATION_MS = 2 * 60 * 60 * 1000; // 2 horas

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"ADMIN" | "NORMAL" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const expiration = await SecureStore.getItemAsync("token_expiration");

        if (storedToken) {
          const decoded = jwtDecode<DecodedToken>(storedToken);
          const userRole = decoded.role;

          if (userRole === "ADMIN" && expiration) {
            const now = Date.now();
            const expiresAt = parseInt(expiration, 10);

            if (now < expiresAt) {
              setToken(storedToken);
              setUserId(decoded.id);
              setRole(userRole);
            } else {
              await SecureStore.deleteItemAsync("token");
              await SecureStore.deleteItemAsync("token_expiration");
            }
          } else {
            setToken(storedToken);
            setUserId(decoded.id);
            setRole(userRole);
          }
        }
      } catch (error) {
        // Silenciar erro
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
      const userRole = decoded.role;

      setToken(newToken);
      setUserId(decoded.id);
      setRole(userRole);

      await SecureStore.setItemAsync("token", newToken);

      if (userRole === "ADMIN") {
        const expiresAt = Date.now() + ADMIN_EXPIRATION_MS;
        await SecureStore.setItemAsync("token_expiration", expiresAt.toString());
      } else {
        await SecureStore.deleteItemAsync("token_expiration");
      }
    } catch (error) {
      // Silenciar erro
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
      // Silenciar erro
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
