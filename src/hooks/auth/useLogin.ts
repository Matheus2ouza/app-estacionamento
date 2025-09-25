import { AuthApi } from "@/api/userService";
import type { DecodedToken, LoginData } from "@/types/authTypes/auth";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

export function useUserLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(data: LoginData) {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApi.loginUser(data); // espera { token: string }
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
      const message = err.response?.data?.error || err.response?.data?.message || "Erro desconhecido";
      setError(message);
      throw new Error(message); // importante para os modais também
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
