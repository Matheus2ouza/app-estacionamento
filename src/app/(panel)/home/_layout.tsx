import { useAuth } from "@/src/context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeLayout() {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments(); // Pega os segmentos da rota atual

  useEffect(() => {
    console.log("[HomeLayout] useEffect executado");
    console.log("[HomeLayout] isLoading:", isLoading, "role:", role);
    console.log("[HomeLayout] segments:", segments);

    if (isLoading) {
      console.log("[HomeLayout] Está carregando, aguardando...");
      return;
    }

    const isHomeRoute = segments[1] === "home"; // ['(panel)', 'home', ...]
    console.log("[HomeLayout] isHomeRoute:", isHomeRoute);
    if (!isHomeRoute) {
      console.log("[HomeLayout] Não está na rota home, não redireciona");
      return; // não redirecionar se não estiver dentro da pasta home
    }

    const currentScreen = segments[segments.length - 1]; // último segmento
    console.log("[HomeLayout] currentScreen:", currentScreen);

    if (role === "ADMIN" && currentScreen !== "admin") {
      console.log("[HomeLayout] Redirecionando ADMIN para /home/admin");
      router.replace("/(panel)/home/admin");
    } else if (role === "NORMAL" && currentScreen !== "normal") {
      console.log("[HomeLayout] Redirecionando NORMAL para /home/normal");
      router.replace("/(panel)/home/normal");
    } else {
      console.log("[HomeLayout] Usuário já está na rota correta");
    }
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
