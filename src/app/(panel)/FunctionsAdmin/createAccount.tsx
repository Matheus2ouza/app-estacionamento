import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import RoleMenu from "@/src/components/RoleMenu";
import Colors from "@/src/constants/Colors";
import { useCreateUser } from "@/src/hooks/auth/useCreateUser";
import { styles } from "@/src/styles/functions/createAccountStyle";

import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from "react-native";
import { Provider as PaperProvider, TextInput } from "react-native-paper";

const ROLE_OPTIONS = [
  { label: "Administrador", value: "ADMIN" },
  { label: "Funcionário", value: "NORMAL" },
];

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | undefined>("");

  const { createUser, loading, error, success } = useCreateUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

const handleSubmit = async () => {
  try {
    await createUser({
      username,
      password,
      role: role as "ADMIN" | "NORMAL",
    });

    setModalMessage("Usuário criado com sucesso!");
    setModalSuccess(true);
    setModalVisible(true);

    // Limpa os campos
    setUsername("");
    setPassword("");
    setRole("");
  } catch (err: any) {
    setModalMessage(err.message || "Erro ao criar usuário.");
    setModalSuccess(false);
    setModalVisible(true);
  }
};


  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <Header title="Criar usuário" />

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
                label="Nome"
                mode="outlined"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={styles.input}
                theme={{
                  colors: {
                    primary: Colors.blue.logo
                  }
                }}
              />

              <TextInput
                label="Senha"
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                theme={{
                  colors: {
                    primary: Colors.blue.logo
                  }
                }}
              />

              <RoleMenu
                label="Permissão"
                value={role}
                onChange={setRole}
                options={ROLE_OPTIONS}
                style={styles.input}
                
              />
            </ScrollView>

            <PrimaryButton
              title={loading ? "Criando..." : "Registrar"}
              onPress={handleSubmit}
              style={[styles.button, { alignSelf: "center" }]}
              disabled={!username || !password || !role || !loading}
            />
          </View>
        </KeyboardAvoidingView>

        <FeedbackModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          isSuccess={modalSuccess}
        />
      </View>
    </PaperProvider>
  );
}
