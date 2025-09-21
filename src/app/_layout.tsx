import FontsToLoad from "@/constants/Fonts";
import { AuthProvider } from "@/context/AuthContext";
import { CashProvider } from "@/context/CashContext";
import { ProductCacheProvider } from "@/context/ProductCacheContext";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1C274C",
  },
};


// Configura para mostrar banner mesmo com app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  // banner no topo (foreground)
    shouldShowList: true,    // adiciona na lista de notificações
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts(FontsToLoad);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(async (notification) => {
      // ⚡️ Apenas dispara a mesma notificação como local
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
          sound: "default",
        },
        trigger: null, // mostra imediatamente
      });
    });

    return () => subscription.remove();
  }, []);
  

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <CashProvider>
            <ProductCacheProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </ProductCacheProvider>
          </CashProvider>
        </AuthProvider>
      </PaperProvider>
    </View>
  );
}
