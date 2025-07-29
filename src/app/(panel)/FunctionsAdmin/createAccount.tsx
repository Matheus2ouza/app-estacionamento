// components/CreateAccountForm.tsx
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { Provider as PaperProvider, TextInput } from "react-native-paper";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import RoleMenu from "@/src/components/RoleMenu";
import Colors from "@/src/constants/Colors";
import { useCreateUser } from "@/src/hooks/auth/useCreateUser";
import { styles } from "@/src/styles/functions/createAccountStyle" 

const ROLE_OPTIONS = [
  { label: "Administrador", value: "ADMIN" },
  { label: "Funcionário", value: "NORMAL" },
];

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: false,
    password: false,
    role: false,
  });

  const { createUser, loading } = useCreateUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const errors = {
      username: !formData.username.trim(),
      password: !formData.password.trim(),
      role: !formData.role,
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setModalMessage("Preencha todos os campos corretamente");
      setModalSuccess(false);
      setModalVisible(true);
      return;
    }

    try {
      await createUser({
        username: formData.username,
        password: formData.password,
        role: formData.role as "ADMIN" | "NORMAL",
      });

      // Success feedback
      setModalMessage("Usuário criado com sucesso!");
      setModalSuccess(true);
      setModalVisible(true);

      // Reset form
      setFormData({
        username: "",
        password: "",
        role: "",
      });
    } catch (err: any) {
      setModalMessage(err.message || "Erro ao criar usuário");
      setModalSuccess(false);
      setModalVisible(true);
    }
  };

  const isFormValid = formData.username && formData.password && formData.role;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header title="Criar usuário" />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <TextInput
                label="Nome de usuário"
                mode="outlined"
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
                autoCapitalize="none"
                style={styles.input}
                error={formErrors.username}
                theme={{
                  colors: {
                    primary: Colors.blue.logo,
                    error: Colors.red.error,
                  },
                }}
              />

              <TextInput
                label="Senha"
                mode="outlined"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                style={styles.input}
                error={formErrors.password}
                theme={{
                  colors: {
                    primary: Colors.blue.logo,
                    error: Colors.red.error,
                  },
                }}
              />

              <RoleMenu
                label="Permissão"
                value={formData.role}
                onChange={(value) => handleChange("role", value)}
                options={ROLE_OPTIONS}
                style={styles.input}
                error={formErrors.role}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={loading ? "Criando..." : "Registrar"}
              onPress={handleSubmit}
              style={styles.button}
              disabled={!isFormValid || loading}
            />
          </View>
        </KeyboardAvoidingView>

        <FeedbackModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          isSuccess={modalSuccess}
          shouldGoBack={true}
        />
      </View>
    </PaperProvider>
  );
}