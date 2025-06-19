import { API_URL } from "@/src/config/api";
import { LoginData } from "../types/auth";

export async function loginUser(data: LoginData): Promise<any> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Falha ao fazer login");
  }

  return response.json();
}
