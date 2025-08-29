import FontsToLoad from "@/src/constants/Fonts";
import { AuthProvider } from "@/src/context/AuthContext";
import { CashProvider } from "@/src/context/CashContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
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

export default function RootLayout() {
  const [fontsLoaded] = useFonts(FontsToLoad);

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
            <Stack screenOptions={{ headerShown: false }} />
          </CashProvider>
        </AuthProvider>
      </PaperProvider>
    </View>
  );
}
