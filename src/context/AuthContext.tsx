import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/axiosInstance";
import type { AuthContextData, DecodedToken } from "../types/authTypes/auth";

// Hierarquia de roles (igual ao backend)
const ROLE_HIERARCHY = {
  NORMAL: 1,
  MANAGER: 2,
  ADMIN: 3,
} as const;

type RoleType = keyof typeof ROLE_HIERARCHY;

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
    }
  };

  const isAuthenticated = !!token;

  // Função para verificar se o usuário tem permissão mínima
  const hasPermission = (minRole: RoleType): boolean => {
    if (!role) return false;
    const userRoleLevel = ROLE_HIERARCHY[role];
    const requiredRoleLevel = ROLE_HIERARCHY[minRole];
    return userRoleLevel >= requiredRoleLevel;
  };

  // Função para verificar se o usuário tem exatamente um role específico
  const hasExactRole = (exactRole: RoleType): boolean => {
    return role === exactRole;
  };

  // Função para verificar se o usuário tem permissão de MANAGER ou superior
  const hasManagerPermission = (): boolean => {
    return hasPermission('MANAGER');
  };

  // Função para verificar se o usuário tem permissão de ADMIN
  const hasAdminPermission = (): boolean => {
    return hasExactRole('ADMIN');
  };

  return (
    <AuthContext.Provider
      value={{ 
        token, 
        userId, 
        role, 
        login, 
        logout, 
        isAuthenticated, 
        isLoading,
        hasPermission,
        hasExactRole,
        hasManagerPermission,
        hasAdminPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
