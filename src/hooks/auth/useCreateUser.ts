import { AuthApi } from "@/src/api/userService";
import { useAuth } from "@/src/context/AuthContext"; // ou onde estiver o seu contexto
import { useState } from "react";

interface CreateUserData {
  username: string;
  password: string;
  role: "ADMIN" | "NORMAL";
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { role: currentUserRole } = useAuth(); // role do usuário logado

  const createUser = async (data: CreateUserData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Verificação local de permissão
      if (data.role === "ADMIN" && currentUserRole !== "ADMIN") {
        setError("Apenas administradores podem criar outros administradores.");
        return;
      }

      await AuthApi.userRegister(data);
      setSuccess(true);
    } catch (err: any) {
      setLoading(false);
      const message = err.response?.data?.message || "Erro desconhecido";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error, success };
}
