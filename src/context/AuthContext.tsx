import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextData, DecodedToken } from "../types/auth";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Tempo de sessão em minutos
const EXPIRATION_MINUTES = 10;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"ADMIN" | "NORMAL" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        console.log("[Auth] Tentando restaurar sessão...");
        const storedToken = await SecureStore.getItemAsync("token");
        const expiration = await SecureStore.getItemAsync("token_expiration");

        console.log("[Auth] Token armazenado:", storedToken);
        console.log("[Auth] Expiração armazenada:", expiration);

        if (storedToken && expiration) {
          const now = Date.now();
          const expiresAt = parseInt(expiration, 10);

          if (now < expiresAt) {
            console.log("[Auth] Token válido, restaurando estado...");
            const decoded = jwtDecode<DecodedToken>(storedToken);
            setToken(storedToken);
            setUserId(decoded.id);
            setRole(decoded.role);
            console.log("[Auth] Role do usuário restaurado:", decoded.role);
          } else {
            console.log("[Auth] Token expirado, limpando dados...");
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("token_expiration");
          }
        } else {
          console.log("[Auth] Nenhum token ou expiração encontrada.");
        }
      } catch (error) {
        console.error("[Auth] Erro ao restaurar sessão:", error);
      } finally {
        setIsLoading(false);
        console.log("[Auth] Restore session finalizado. isLoading false.");
      }
    };

    restoreSession();
  }, []);

  const login = async (newToken: string) => {
    try {
      console.log("[Auth] Iniciando login...");
      const decoded = jwtDecode<DecodedToken>(newToken);
      setToken(newToken);
      setUserId(decoded.id);
      setRole(decoded.role);
      console.log("[Auth] Role no login:", decoded.role);

      const expiresAt = Date.now() + EXPIRATION_MINUTES * 60 * 1000;
      await SecureStore.setItemAsync("token", newToken);
      await SecureStore.setItemAsync("token_expiration", expiresAt.toString());
      console.log("[Auth] Login realizado com sucesso. Token salvo com expiração:", new Date(expiresAt));
    } catch (error) {
      console.error("[Auth] Erro no login:", error);
    }
  };

  const logout = async () => {
    try {
      console.log("[Auth] Realizando logout...");
      setToken(null);
      setUserId(null);
      setRole(null);
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("token_expiration");
      console.log("[Auth] Logout finalizado, dados apagados.");
    } catch (error) {
      console.error("[Auth] Erro no logout:", error);
    }
  };

  const isAuthenticated = !!token;

  console.log("[Auth] Renderizando AuthContext: isAuthenticated =", isAuthenticated, "role =", role, "isLoading =", isLoading);

  return (
    <AuthContext.Provider
      value={{ token, userId, role, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
