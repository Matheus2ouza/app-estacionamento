import Colors from "@/src/constants/Colors";
import { styles } from "@/src/styles/login/loginStyles";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import FeedbackModal from "@/src/components/FeedbackModal";
import { useAuth } from "@/src/context/AuthContext";
import { useUserLogin } from "@/src/hooks/auth/useLogin";
import { useRouter } from "expo-router";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pushToken, setPushToken] = React.useState<string | null>(null);

  const { login, loading, error, clearError } = useUserLogin();
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    async function requestAndroidNotificationsPermission() {
      try {
        console.log("[Push] useEffect mounted - starting permission flow");
        console.log("[Push] Platform:", Platform.OS, "Version:", Platform.Version);
        if (Platform.OS !== "android") {
          console.log("[Push] Not Android. Skipping permission request.");
          return;
        }

        // Cria canal de notificação (Android)
        try {
          console.log("[Push] Creating Android notification channel 'default'");
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.DEFAULT,
          });
          console.log("[Push] Notification channel 'default' created/ensured");
        } catch (channelErr) {
          console.log("[Push] Error creating notification channel:", channelErr);
        }

        const settings = await Notifications.getPermissionsAsync();
        console.log("[Push] Current permissions:", settings);
        let granted = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
        console.log("[Push] Granted before request?", granted);

        if (!granted) {
          console.log("[Push] Requesting permissions...");
          const ask = await Notifications.requestPermissionsAsync();
          console.log("[Push] Permissions after request:", ask);
          granted = ask.granted || ask.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
          console.log("[Push] Granted after request?", granted);
        }

        if (!granted) {
          console.log("[Push] Permission denied. Exiting silently.");
          return; // silencioso se negado
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
        console.log("[Push] Using projectId:", projectId);
        const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
        console.log("[Push] Token response:", tokenResponse);
        const token = tokenResponse.data;
        setPushToken(token);
        await SecureStore.setItemAsync("expoPushToken", token);
        console.log("[Push] Token stored and state updated:", token);
      } catch (e) {
        console.log("[Push] Error while requesting notifications permission or fetching token:", e);
      }
    }

    requestAndroidNotificationsPermission();
  }, []);

  async function handleLogin() {
    try {
      console.log("[Push] Starting login...");
      console.log("[Push] Pushing token:", pushToken);
      console.log("[Push] Username:", username);
      console.log("[Push] Password:", password);
      const { token, role } = await login({ username, password, expoPushToken: pushToken || undefined });

      await auth.login(token);

      if (role === "ADMIN" || role === "MANAGER") {
        router.replace("/home/admin");
      } else if (role === "NORMAL") {
        router.replace("/home/normal");
      }
    } catch (err) {
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background.primary }}>
      <Image
        source={require("@/src/assets/images/splash-icon-blue.png")}
        style={styles.heroImage}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <LinearGradient
            colors={[Colors.gray.zinc, Colors.blue.light]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.brandContainer}>
              <Text style={styles.brandMain}>LEÃO</Text>
              <Text style={styles.brandSub}>Estacionamento</Text>
            </View>
          </LinearGradient>

          <View style={styles.formContainer}>
            <TextInput
              label="Usuario"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
            />

            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.text.inverse} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <FeedbackModal
        visible={!!error}
        message={error || ''}
        type="error"
        onClose={clearError}
        dismissible={true}
        autoNavigateOnSuccess={false}
        navigateDelay={2000}
      />
    </SafeAreaView>
  );
}
