import Colors from "@/src/constants/Colors";
import { styles } from "@/src/styles/login/loginStyles";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import ApiErrorModal from "@/src/components/ApiErrorModal";
import { useAuth } from "@/src/context/AuthContext";
import { useUserLogin } from "@/src/hooks/auth/useLogin";
import { useRouter } from "expo-router";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const { login, loading, error, clearError } = useUserLogin();
  const auth = useAuth(); // <-- aqui para usar auth.login()
  const router = useRouter();

  async function handleLogin() {
    try {
      console.log("Iniciando login...");

      const { token, role } = await login({ username, password });

      console.log("Login bem-sucedido. Token:", token);
      console.log("Role recebido:", role);

      await auth.login(token);
      console.log("Contexto de autenticação atualizado.");

      if (role === "ADMIN") {
        console.log("Redirecionando para admin...");
        router.replace("/home/admin");
      } else {
        console.log("Redirecionando para employee...");
        router.replace("/home/normal");
      }
    } catch (err) {
      console.log("Erro no handleLogin:", err);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
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
            colors={[Colors.zinc, Colors.blueLight]}
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
              keyboardType="email-address"
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
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <ApiErrorModal visible={!!error} message={error} onClose={clearError} />
    </SafeAreaView>
  );
}
