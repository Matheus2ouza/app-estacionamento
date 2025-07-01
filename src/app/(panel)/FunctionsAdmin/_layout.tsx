import { useAuth } from "@/src/context/AuthContext";
import { SelectedUserProvider } from "@/src/context/SelectedUser";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FunctionsAdminLayout() {
  const { role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("[FunctionsAdminLayout] useEffect disparado", {
      role,
      isLoading,
      isAuthenticated,
    });

    if (!isLoading && isAuthenticated) {
      if (role === "ADMIN") {
        console.log(
          "[FunctionsAdminLayout] Usuário ADMIN autorizado a acessar."
        );
        // Permite continuar, nada a fazer
        return;
      }

      console.log(
        "[FunctionsAdminLayout] Usuário NÃO é ADMIN, redirecionando para a home correta."
      );

      if (role === "NORMAL") {
        console.log(
          "[FunctionsAdminLayout] Redirecionando para /(panel)/home/normal"
        );
        router.replace("/(panel)/home/normal");
      } else {
        console.log(
          "[FunctionsAdminLayout] Role inesperado ou indefinido, redirecionando para /(public)/login"
        );
        router.replace("/(public)/login");
      }
    } else if (!isLoading && !isAuthenticated) {
      console.log(
        "[FunctionsAdminLayout] Usuário não autenticado, redirecionando para /(public)/login"
      );
      router.replace("/(public)/login");
    }
  }, [role, isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    console.log(
      "[FunctionsAdminLayout] Loading ou não autenticado, não renderiza conteúdo."
    );
    return null;
  }

  console.log("[FunctionsAdminLayout] Renderizando telas para ADMIN");

  return (
    <SelectedUserProvider>
      <SafeAreaView style={styles.container}>
        <Image
          source={require("@/src/assets/images/splash-icon-blue.png")}
          style={styles.heroImage}
        />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SelectedUserProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: {
    position: "absolute",
    top: 80,
    right: -270,
    width: "130%",
    height: "95%",
    transform: [{ scaleX: -1 }],
    resizeMode: "cover",
    opacity: 0.1,
    zIndex: -1,
  },
});
