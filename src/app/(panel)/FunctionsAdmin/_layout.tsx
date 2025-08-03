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
    if (!isLoading && isAuthenticated) {
      if (role === "ADMIN") {
        // Permite continuar, nada a fazer
        return;
      }

      if (role === "NORMAL") {
        router.replace("/(panel)/home/normal");
      } else {
        router.replace("/(public)/login");
      }
    } else if (!isLoading && !isAuthenticated) {
      router.replace("/(public)/login");
    }
  }, [role, isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

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
