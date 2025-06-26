import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { styles } from "@/src/styles/functions/createAccountStyle";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from "react-native";
import { Provider as PaperProvider, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";

const ROLE_OPTIONS = [
  { label: "Administrador", value: "admin" },
  { label: "Funcionário", value: "employee" },
];

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | undefined>("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = () => {
    console.log({ username, password, role });
    // Aqui vai a chamada para o backend ou navegação
  };

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <Header title="Criar Conta" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <ScrollView
              contentContainerStyle={[styles.container, { paddingBottom: 20 }]}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                label="Username"
                mode="outlined"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={styles.input}
              />

              <TextInput
                label="Senha"
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              <DropDown
                label="Cargo"
                mode="outlined"
                visible={showDropdown}
                showDropDown={() => setShowDropdown(true)}
                onDismiss={() => setShowDropdown(false)}
                value={role}
                setValue={setRole}
                list={ROLE_OPTIONS}
                inputProps={{
                  style: styles.input,
                }}
              />
            </ScrollView>

            <PrimaryButton
              title="Avançar"
              onPress={handleSubmit}
              style={[styles.button, { alignSelf: "center" }]}
              disabled={!username || !password || !role}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </PaperProvider>
  );
}
