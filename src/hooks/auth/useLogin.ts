import { AuthApi } from "@/src/api/userService";
import type { DecodedToken, LoginData } from "@/src/types/auth";
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
      console.log(data)
      const response = await AuthApi.loginUser(data);
      const token = response.token;
      console.log(response)

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
      const message = err.response?.data?.message || "Erro desconhecido";
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
