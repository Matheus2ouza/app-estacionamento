import { useAuth } from "@/src/context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeLayout() {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Aguarda até que o carregamento da autenticação esteja completo
    if (isLoading) return;

    // Verifica se o usuário está dentro da rota "home"
    const isHomeRoute = segments[1] === "home";
    if (!isHomeRoute) return;

    // Obtém a tela atual a partir dos segmentos da rota
    const currentScreen = segments[segments.length - 1];

    // Redireciona o usuário para a subpasta correta com base na role
    if (role === "ADMIN" && currentScreen !== "admin") {
      router.replace("/(panel)/home/admin");
    } else if (role === "NORMAL" && currentScreen !== "normal") {
      router.replace("/(panel)/home/normal");
    }
    // Se já estiver na rota correta, não faz nada
  }, [isLoading, role, segments]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("@/src/assets/images/splash-icon-blue.png")}
        style={styles.heroImage}
      />
      <Slot />
    </SafeAreaView>
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
