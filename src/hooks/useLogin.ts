import { loginUser } from "@/src/api/userService";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import type { DecodedToken, LoginData } from "../types/auth";

export function useUserLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(data: LoginData) {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(data); // espera { token: string }
      const token = response.token;

      // Salva token localmente
      await SecureStore.setItemAsync("token", token);

      // Decodifica para pegar info do usuário
      const decoded = jwtDecode<DecodedToken>(token);

      setLoading(false);

      // Retorna tudo que o componente precisa (inclusive o role)
      return {
        token,
        userId: decoded.id,
        role: decoded.role,
      };
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Erro desconhecido");
      throw err;
    }
  }

  function clearError() {
    setError(null);
  }

  return {
    login,
    loading,
    error,
    clearError,
  };
}
