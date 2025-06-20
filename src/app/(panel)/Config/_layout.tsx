import { useAuth } from "@/src/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function ConfigLayout() {
  const { role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  console.log("[ConfigLayout] Renderizando. Role:", role, "isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "segments:", segments);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const lastSegment = segments[segments.length - 1];
      console.log("[ConfigLayout] Verificando role e rota atual", { role, lastSegment });

      if (role === "ADMIN" && lastSegment !== "configAdmin") {
        console.log("[ConfigLayout] Redirecionando para configAdmin");
        router.replace("/(panel)/Config/configAdmin");
      } else if (role === "NORMAL" && lastSegment !== "config") {
        console.log("[ConfigLayout] Redirecionando para config");
        router.replace("/(panel)/Config/config");
      }
    }
  }, [role, isLoading, isAuthenticated, segments]);

  if (isLoading || !isAuthenticated) {
    console.log("[ConfigLayout] Carregando ou não autenticado, não renderiza");
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
