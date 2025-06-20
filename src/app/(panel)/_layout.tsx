import { useAuth } from "@/src/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function PanelLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  console.log("[PanelLayout] Renderizando. isLoading:", isLoading, "isAuthenticated:", isAuthenticated);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("[PanelLayout] Não autenticado, redirecionando para /login");
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    console.log("[PanelLayout] Carregando autenticação, não renderiza nada");
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
