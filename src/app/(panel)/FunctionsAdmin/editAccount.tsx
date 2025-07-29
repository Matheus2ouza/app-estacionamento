import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import RoleMenu from "@/src/components/RoleMenu";
import Colors from "@/src/constants/Colors";
import { useUserActions } from "@/src/hooks/auth/useUserActions";
import { styles } from "@/src/styles/functions/editAcccontStyle";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Provider as PaperProvider, TextInput } from "react-native-paper";

const ROLE_OPTIONS = [
  { label: "Administrador", value: "ADMIN" },
  { label: "Funcionário", value: "NORMAL" },
];

export default function EditAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | undefined>("");

  const {
    editUser,
    deleteUser,
    loadingEdit,
    loadingDelete,
    error,
    success
  } = useUserActions();


  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const params = useLocalSearchParams();
  const { id, username: initialUsername, role: initialRole } = params;

  const handleUpdateUser = async () => {
    try {
      await editUser({
        id: id as string,
        username,
        password,
        role: role as "ADMIN" | "NORMAL",
      });
      setFeedbackMessage("Usuário atualizado com sucesso!");
      setFeedbackSuccess(true);
      setFeedbackVisible(true);
    } catch {}
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(id as string);
      setFeedbackMessage("Usuário excluído com sucesso!");
      setFeedbackSuccess(true);
      setFeedbackVisible(true);
    } catch {}
  };

  useEffect(() => {
    if (initialUsername) setUsername(initialUsername as string);
    if (initialRole) setRole(initialRole as string);
  }, []);

  useEffect(() => {
    if (error) {
      setFeedbackMessage(error);
      setFeedbackSuccess(false);
      setFeedbackVisible(true);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.back();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <Header title="Editar usuário" />

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
                disabled={loadingEdit || loadingDelete}
                style={[styles.input, { fontSize: 14 }]}
                theme={{
                  colors: {
                    primary: Colors.blue.logo,
                  },
                }}
              />

              <View style={{ marginBottom: 8 }}>
                <TextInput
                  label="Senha"
                  mode="outlined"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  disabled={loadingEdit || loadingDelete}
                  style={[styles.input, { fontSize: 14 }]}
                  theme={{
                    colors: {
                      primary: Colors.blue.logo,
                    },
                  }}
                />
                <Text style={styles.passwordHint}>
                  *Deixe em branco para manter a senha atual*
                </Text>
              </View>

              <RoleMenu
                label="Cargo"
                value={role}
                onChange={setRole}
                disabled={loadingEdit || loadingDelete}
                options={ROLE_OPTIONS}
                style={[styles.input]}
              />

              <View style={styles.containerButton}>
                <PrimaryButton
                  title={loadingEdit ? "Atualizando..." : "Salvar"}
                  onPress={handleUpdateUser}
                  style={styles.button}
                />
                <PrimaryButton
                  title={loadingDelete ? "Excluindo..." : "Excluir"}
                  onPress={handleDeleteUser}
                  style={[styles.button, { backgroundColor: Colors.red[500] }]}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        isSuccess={feedbackSuccess}
        onClose={() => setFeedbackVisible(false)}
      />
    </PaperProvider>
  );
}

