import { AuthApi } from "@/api/userService";
import { useState } from "react";

interface CreateUserData {
  username: string;
  password: string;
  role: "ADMIN" | "NORMAL" | "MANAGER";
  adminPassword?: string;
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createUser = async (data: CreateUserData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await AuthApi.registerUser(data)
      
      if(response.success) {
        setSuccess(true);
        setLoading(false);
        return {
          success: true,
          message: response.message,
        }
      } else {
        setError(response.message);
        setLoading(false);
        return {
          success: false,
          error: response.message,
        }
      }
    } catch (error) {
      
    }
  };

  return { createUser, loading, error, success };
}
