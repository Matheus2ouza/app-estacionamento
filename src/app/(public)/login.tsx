import Colors from "@/constants/Colors";
import { styles } from "@/styles/login/loginStyles";
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

import FeedbackModal from "@/components/FeedbackModal";
import { useAuth } from "@/context/AuthContext";
import { useUserLogin } from "@/hooks/auth/useLogin";
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
        if (Platform.OS !== "android") {
          return;
        }

        // Cria canal de notificação (Android)
        try {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        } catch (channelErr) {
          // Erro ao criar canal de notificação
        }

        const settings = await Notifications.getPermissionsAsync();
        let granted = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;

        if (!granted) {
          const ask = await Notifications.requestPermissionsAsync();
          granted = ask.granted || ask.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
        }

        if (!granted) {
          return; // silencioso se negado
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
        const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
        const token = tokenResponse.data;
        setPushToken(token);
        await SecureStore.setItemAsync("expoPushToken", token);
      } catch (e) {
        // Erro ao solicitar permissões de notificação ou obter token
      }
    }

    requestAndroidNotificationsPermission();
  }, []);

  async function handleLogin() {
    try {
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
