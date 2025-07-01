import { useAuth } from "@/src/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

export default function ConfigLayout() {
  const { role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const redirected = useRef(false); // Evita múltiplos redirecionamentos em um mesmo ciclo

  useEffect(() => {
    // Aguarda a autenticação terminar e garante que só redireciona uma vez
    if (!isLoading && isAuthenticated && !redirected.current) {
      const lastSegment = segments[segments.length - 1]; // Último segmento da rota atual

      // Redireciona ADMIN para configAdmin
      if (role === "ADMIN" && lastSegment !== "configAdmin") {
        redirected.current = true;
        router.replace("/(panel)/Config/configAdmin");
      }

      // Redireciona NORMAL para config
      else if (role === "NORMAL" && lastSegment !== "config") {
        redirected.current = true;
        router.replace("/(panel)/Config/config");
      }
    }
  }, [isLoading, isAuthenticated, role]);

  // Evita renderizar antes da autenticação terminar
  if (isLoading || !isAuthenticated) {
    return null;
  }

  // Renderiza o stack de rotas (sem header)
  return <Stack screenOptions={{ headerShown: false }} />;
}
