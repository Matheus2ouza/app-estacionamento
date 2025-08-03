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
  Image,
  TouchableOpacity,
  Alert,
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { editUser, deleteUser, loadingEdit, loadingDelete, error, success } =
    useUserActions();

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
    } catch (error: any) {
      setFeedbackMessage(error.message || "Erro ao atualizar usuário");
      setFeedbackSuccess(false);
      setFeedbackVisible(true);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      await deleteUser(id as string);
      setFeedbackMessage("Usuário excluído com sucesso!");
      setFeedbackSuccess(true);
      setFeedbackVisible(true);
      setConfirmDelete(false);
    } catch (error: any) {
      setFeedbackMessage(error.message || "Erro ao excluir usuário");
      setFeedbackSuccess(false);
      setFeedbackVisible(true);
      setConfirmDelete(false);
    }
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
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  return (
    <PaperProvider>
      <View style={styles.screenContainer}>
        <Image
          source={require("@/src/assets/images/splash-icon-blue.png")}
          style={styles.backgroundImage}
        />

        <Header title="Editar Usuário" />

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Informações do Usuário</Text>

              <TextInput
                label="Nome de usuário"
                mode="outlined"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                disabled={loadingEdit || loadingDelete}
                style={styles.input}
                theme={{
                  colors: {
                    primary: Colors.blue.logo,
                    background: Colors.white,
                  },
                  roundness: 8,
                }}
                left={
                  <TextInput.Icon icon="account" color={Colors.blue.light} />
                }
              />

            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
              theme={{
                  colors: {
                    primary: Colors.blue.logo,
                    background: Colors.white,
                  },
                  roundness: 8,
                }}
                left={<TextInput.Icon icon="lock" color={Colors.blue.light} />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                  color={Colors.blue.light}
                />
              }
            />
              <Text style={styles.passwordHint}>
                Deixe em branco para manter a senha atual
              </Text>

              <RoleMenu
                label="Nível de acesso"
                value={role}
                onChange={setRole}
                disabled={loadingEdit || loadingDelete}
                options={ROLE_OPTIONS}
                style={styles.roleMenu}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

          <View style={styles.footer}>
            <PrimaryButton
              title={loadingEdit ? "Salvando..." : "Salvar Alterações"}
              onPress={handleUpdateUser}
              style={styles.saveButton}
              disabled={loadingEdit || loadingDelete}
            />

            <TouchableOpacity
              onPress={handleDeleteUser}
              style={[
                styles.deleteButton,
                confirmDelete && { backgroundColor: Colors.red[700] },
              ]}
              disabled={loadingEdit || loadingDelete}
            >
              <Text style={styles.deleteButtonText}>
                {confirmDelete
                  ? "Confirmar Exclusão"
                  : loadingDelete
                  ? "Excluindo..."
                  : "Excluir Usuário"}
              </Text>
            </TouchableOpacity>
          </View>

        <FeedbackModal
          visible={feedbackVisible}
          message={feedbackMessage}
          isSuccess={feedbackSuccess}
          onClose={() => setFeedbackVisible(false)}
        />
      </View>
    </PaperProvider>
  );
}
