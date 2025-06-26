import { useAuth } from "@/src/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

export default function ConfigLayout() {
  const { role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const redirected = useRef(false); // <- evita múltiplos redirecionamentos

  console.log(
    "[ConfigLayout] Renderizando. Role:", role,
    "isLoading:", isLoading,
    "isAuthenticated:", isAuthenticated,
    "segments:", segments
  );

  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirected.current) {
      const lastSegment = segments[segments.length - 1];
      console.log("[ConfigLayout] Verificando role e rota atual", { role, lastSegment });

      if (role === "ADMIN" && lastSegment !== "configAdmin") {
        console.log("[ConfigLayout] Redirecionando para configAdmin");
        redirected.current = true;
        router.replace("/(panel)/Config/configAdmin");
      } else if (role === "NORMAL" && lastSegment !== "config") {
        console.log("[ConfigLayout] Redirecionando para config");
        redirected.current = true;
        router.replace("/(panel)/Config/config");
      }
    }
  }, [isLoading, isAuthenticated, role]); // ❌ removido segments daqui

  if (isLoading || !isAuthenticated) {
    console.log("[ConfigLayout] Carregando ou não autenticado, não renderiza");
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
