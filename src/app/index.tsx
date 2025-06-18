import Colors from "@/src/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/loginStyles";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const toggleRemember = () => setRemember(!remember);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {/* Imagem decorativa fora da ScrollView */}
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
            colors={[Colors.zinc, "#1C274C"]}
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
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.optionsRow}>
              <Pressable
                style={styles.rememberContainer}
                onPress={toggleRemember}
              >
                <View style={styles.circle}>
                  {remember && <View style={styles.innerDot} />}
                </View>
                <Text style={styles.label}>Lembre-se de mim</Text>
              </Pressable>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
