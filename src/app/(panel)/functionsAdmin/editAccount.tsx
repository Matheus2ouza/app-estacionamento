import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import Colors from "@/src/constants/Colors";
import { useUserActions } from "@/src/hooks/auth/useUserActions";
import { styles } from "@/src/styles/functions/editAcccontStyle";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const ROLE_OPTIONS = [
  { label: "Administrador", value: "ADMIN", icon: "shield-checkmark", color: Colors.red[600] },
  { label: "Gerente", value: "MANAGER", icon: "business", color: Colors.orange[600] },
  { label: "Funcionário", value: "NORMAL", icon: "person", color: Colors.blue[600] },
];

export default function EditAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | undefined>("");
  const [hasChanges, setHasChanges] = useState(false);

  const {
    editUser,
    loadingEdit,
    error,
    success
  } = useUserActions();

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const params = useLocalSearchParams();

  console.log(params);
  const { 
    id, 
    username: initialUsername, 
    role: initialRole,
    createdAt: initialCreatedAt,
    updatedAt: initialUpdatedAt
  } = params;
  
  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  const handleUpdateUser = async () => {
    if (!username.trim()) {
      showFeedback("Nome de usuário é obrigatório", "error");
      return;
    }

    if (!role) {
      showFeedback("Selecione um cargo para o usuário", "error");
      return;
    }

    if (!hasChanges) {
      showFeedback("Nenhuma alteração foi feita", "warning");
      return;
    }

    try {
      await editUser({
        id: id as string,
        username: username.trim(),
        password,
        role: role as "ADMIN" | "NORMAL" | "MANAGER",
      });
      showFeedback("Usuário atualizado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      showFeedback("Erro ao atualizar usuário. Tente novamente.", "error");
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
  };

  useEffect(() => {
    if (initialUsername) setUsername(initialUsername as string);
    if (initialRole) setRole(initialRole as string);
  }, [initialUsername, initialRole]);

  // Verificar se houve alterações
  useEffect(() => {
    const usernameChanged = username !== (initialUsername as string);
    const roleChanged = role !== (initialRole as string);
    const passwordChanged = password.trim().length > 0;
    
    setHasChanges(usernameChanged || roleChanged || passwordChanged);
  }, [username, role, password, initialUsername, initialRole]);

  useEffect(() => {
    if (error) {
      showFeedback(error, "error");
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

  const formatDate = (dateString: string | string[] | null | undefined) => {
    if (!dateString || Array.isArray(dateString)) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return null;
    }
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
      disabled={loadingEdit}
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
      <Header title="Editar Usuário" titleStyle={styles.header} />

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
          {/* Card de Informações do Usuário */}
          <View style={styles.userInfoCard}>
            <View style={styles.userInfoHeader}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={32} color={Colors.white} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{username || "Nome do Usuário"}</Text>
                
                {/* Data de Criação */}
                <View style={styles.dateInfoContainer}>
                  <Text style={styles.dateLabel}>Criado em:</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(initialCreatedAt) || "Data não disponível"}
                  </Text>
                </View>

                {/* Data de Atualização */}
                <View style={styles.dateInfoContainer}>
                  <Text style={styles.dateLabel}>Atualizado em:</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(initialUpdatedAt) || "Data não disponível"}
                  </Text>
                </View>
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
                Informações sobre Edição
              </Text>
            </View>
            <Text style={styles.infoDescription}>
              Você pode editar o nome de usuário, senha e cargo. As datas de criação e última atualização são apenas para consulta e não podem ser modificadas. Em relação a senha, por questão de segunrança não será possível visualizar a senha atual.
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
              placeholder="Digite a nova senha (opcional)"
              placeholderTextColor={Colors.gray[400]}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.passwordHint}>
              Deixe em branco para manter a senha atual
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
              title="Voltar"
              onPress={() => router.back()}
              style={styles.cancelButton}
            />

            <PrimaryButton
              title={loadingEdit ? "Salvando..." : "Salvar Alterações"}
              onPress={handleUpdateUser}
              style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
              disabled={loadingEdit || !hasChanges}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Spinner
        visible={loadingEdit}
        textContent="Atualizando usuário..."
        textStyle={{
          color: Colors.text.primary,
          fontSize: 16,
          fontWeight: '500'
        }}
        color={Colors.blue.logo}
        overlayColor={Colors.overlay.medium}
        size="large"
        animation="fade"
      />

      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setFeedbackVisible(false)}
        dismissible={true}
        onBackPress={() => router.back()}
        autoNavigateOnSuccess={true}
        navigateDelay={2000}
      />
    </View>
  );
}

