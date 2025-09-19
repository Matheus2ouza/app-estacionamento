import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace("/(public)/login");
  }, [logout, router]);

  return { handleLogout };
}
