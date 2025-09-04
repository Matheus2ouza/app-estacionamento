import Colors from "@/src/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PasswordConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export default function PasswordConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title = "Confirmação de Senha",
  message = "Digite sua senha para confirmar esta ação:",
  loading = false,
}: PasswordConfirmationModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Limpa a senha quando o modal é aberto/fechado
  useEffect(() => {
    if (!visible) {
      setPassword("");
      setShowPassword(false);
    }
  }, [visible]);

  const handleConfirm = () => {
    onConfirm(password);
    // Limpa a senha após confirmar
    setPassword("");
  };

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  // Função para limpar a senha quando o modal sair da tela
  const clearPasswordOnExit = () => {
    setPassword("");
    setShowPassword(false);
  };

  // Verifica se o botão deve estar desabilitado
  const isConfirmDisabled = !password.trim() || loading;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      onDismiss={clearPasswordOnExit}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Ícone de Segurança */}
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={52} color={Colors.blue[600]} />
          </View>

          {/* Título */}
          <Text style={styles.title}>{title}</Text>

          {/* Mensagem */}
          <Text style={styles.message}>{message}</Text>

          {/* Campo de Senha */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite sua senha"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={Colors.gray[500]}
              />
            </TouchableOpacity>
          </View>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, isConfirmDisabled && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={isConfirmDisabled}
            >
              {loading ? (
                <Text style={styles.confirmButtonText}>Verificando...</Text>
              ) : (
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    alignItems: "center",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: Colors.gray[50],
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text.primary,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.gray[200],
  },
  confirmButton: {
    backgroundColor: Colors.blue[600],
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
