import FeedbackModal from "@/src/components/FeedbackModal";
import GenericConfirmationModal from "@/src/components/GenericConfirmationModal";
import Header from "@/src/components/Header";
import PasswordConfirmationModal from "@/src/components/PasswordConfirmationModal";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import Colors from "@/src/constants/Colors";
import { useCreateUser } from "@/src/hooks/auth/useCreateUser";
import { styles } from "@/src/styles/functions/createAccountStyle";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const ROLE_OPTIONS = [
  { label: "Administrador", value: "ADMIN", icon: "shield-checkmark", color: Colors.red[600] },
  { label: "Gerente", value: "MANAGER", icon: "business", color: Colors.orange[600] },
  { label: "Funcionário", value: "NORMAL", icon: "person", color: Colors.blue[600] },
];

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | undefined>("");

  const { createUser, loading, error, success } = useCreateUser();

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  // Estados para confirmação de permissões avançadas
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<{
    username: string;
    password: string;
    role: "ADMIN" | "NORMAL" | "MANAGER";
  } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      showFeedback("Nome de usuário é obrigatório", "error");
      return;
    }

    if (!password.trim()) {
      showFeedback("Senha é obrigatória", "error");
      return;
    }

    if (!role) {
      showFeedback("Selecione um cargo para o usuário", "error");
      return;
    }

    // Se for ADMIN ou MANAGER, mostra confirmação
    if (role === "ADMIN" || role === "MANAGER") {
      setPendingUserData({
        username: username.trim(),
        password,
        role: role as "ADMIN" | "NORMAL" | "MANAGER"
      });
      setShowConfirmationModal(true);
      return;
    }

    // Se for NORMAL, cria diretamente
    await createUserAccount({
      username: username.trim(),
      password,
      role: role as "ADMIN" | "NORMAL" | "MANAGER"
    });
  };

  const createUserAccount = async (userData: {
    username: string;
    password: string;
    role: "ADMIN" | "NORMAL" | "MANAGER";
  }) => {
    try {
      await createUser(userData);

      showFeedback("Usuário criado com sucesso!", "success");

      // Limpa os campos após sucesso
      setTimeout(() => {
        setUsername("");
        setPassword("");
        setRole("");
      }, 2000);
    } catch (err: any) {
      console.error("Erro ao criar usuário:", err);
      showFeedback(err.message || "Erro ao criar usuário. Tente novamente.", "error");
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleFeedbackClose = () => {
    setFeedbackVisible(false);
    if (feedbackType === 'success') {
      router.back();
    }
  };

  // Função para lidar com confirmação de permissões avançadas
  const handleConfirmationConfirm = () => {
    if (!pendingUserData) return;

    setShowConfirmationModal(false);

    // Se for ADMIN, pede senha de confirmação
    if (pendingUserData.role === "ADMIN") {
      setShowPasswordModal(true);
    } else {
      // Se for MANAGER, cria diretamente
      createUserAccount(pendingUserData);
    }
  };

  const handleConfirmationCancel = () => {
    setShowConfirmationModal(false);
    setPendingUserData(null);
  };

  // Função para lidar com confirmação de senha de ADMIN
  const handlePasswordConfirm = async (adminPassword: string) => {
    if (!pendingUserData) return;

    setShowPasswordModal(false);

    try {
      // Aqui você pode implementar a verificação da senha do ADMIN atual
      // Por enquanto, vamos prosseguir com a criação
      await createUserAccount(pendingUserData);
    } catch (error) {
      console.error("Erro ao verificar senha:", error);
      showFeedback("Erro ao verificar senha. Tente novamente.", "error");
    }
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setPendingUserData(null);
  };

  const renderRoleOption = (option: typeof ROLE_OPTIONS[0]) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.roleOption,
        role === option.value && styles.roleOptionSelected,
        { borderColor: option.color }
      ]}
      onPress={() => handleRoleChange(option.value)}
      disabled={loading}
    >
      <View style={[styles.roleIconContainer, { backgroundColor: option.color }]}>
        <Ionicons name={option.icon as any} size={20} color={Colors.white} />
      </View>
      <Text style={[
        styles.roleOptionText,
        role === option.value && styles.roleOptionTextSelected
      ]}>
        {option.label}
      </Text>
      {role === option.value && (
        <View style={styles.roleCheckmark}>
          <Ionicons name="checkmark-circle" size={20} color={option.color} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <Header title="Criar Usuário" titleStyle={styles.header} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card de Boas-vindas */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeIcon}>
                <Ionicons name="person-add" size={32} color={Colors.white} />
              </View>
              <View style={styles.welcomeInfo}>
                <Text style={styles.welcomeTitle}>Criar Nova Conta</Text>
                <Text style={styles.welcomeDescription}>
                  Preencha os campos abaixo para criar uma nova conta de usuário no sistema.
                </Text>
              </View>
            </View>
          </View>

          {/* Seção Informativa */}
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="information-circle" size={24} color="white" />
              </View>
              <Text style={styles.infoTitle}>
                Informações sobre Criação
              </Text>
            </View>
            <Text style={styles.infoDescription}>
              Ao criar uma nova conta, o usuário terá acesso ao sistema de acordo com o nível de permissão selecionado. 
              Administradores têm acesso total, gerentes têm acesso intermediário e funcionários têm acesso básico.
            </Text>
          </View>

          {/* Campo Nome de Usuário */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome de Usuário</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Digite o nome de usuário"
              placeholderTextColor={Colors.gray[400]}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Campo Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite a senha"
              placeholderTextColor={Colors.gray[400]}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.passwordHint}>
              A senha deve ter pelo menos 6 caracteres
            </Text>
          </View>

          {/* Seleção de Cargo */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cargo do Usuário</Text>
            <View style={styles.roleOptionsContainer}>
              {ROLE_OPTIONS.map(renderRoleOption)}
            </View>
          </View>

          {/* Botões de Ação */}
          <View style={styles.buttonContainer}>
            <SecondaryButton
              title="Cancelar"
              onPress={handleCancel}
              style={styles.cancelButton}
            />

            <PrimaryButton
              title={loading ? "Criando..." : "Criar Usuário"}
              onPress={handleSubmit}
              style={[styles.createButton, (!username || !password || !role) && styles.createButtonDisabled]}
              disabled={loading || !username || !password || !role}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={handleFeedbackClose}
        dismissible={true}
        onBackPress={() => router.back()}
        autoNavigateOnSuccess={true}
        navigateDelay={2000}
      />

      {/* Modal de Confirmação para Permissões Avançadas */}
      <GenericConfirmationModal
        visible={showConfirmationModal}
        title="Confirmar Criação de Usuário"
        message={`Você está criando um usuário com o cargo de "${pendingUserData?.role === 'ADMIN' ? 'Administrador' : 'Gerente'}".`}
        details={`${pendingUserData?.role === 'ADMIN' 
          ? 'Administradores têm acesso total ao sistema, incluindo gestão de usuários, configurações avançadas e relatórios.'
          : 'Gerentes têm acesso intermediário ao sistema, com permissões de gestão limitadas e relatórios.'
        }
        
Tem certeza de que deseja criar este usuário?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmationConfirm}
        onCancel={handleConfirmationCancel}
        confirmButtonStyle="primary"
      />

      {/* Modal de Confirmação de Senha para ADMIN */}
      <PasswordConfirmationModal
        visible={showPasswordModal}
        title="Confirmação de Senha de Administrador"
        message={`Para criar um usuário com permissões de ADMIN, digite sua senha de administrador:`}
        onClose={handlePasswordModalClose}
        onConfirm={handlePasswordConfirm}
        loading={loading}
      />
    </View>
  );
}
