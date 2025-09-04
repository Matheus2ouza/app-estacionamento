import Colors from "@/src/constants/Colors";
import { Octicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PermissionDeniedModalProps {
  visible: boolean;
  onClose: () => void;
  action?: string;
  requiredRole?: string;
  currentRole?: string;
  message?: string;
}

export default function PermissionDeniedModal({
  visible,
  onClose,
  action = "realizar esta ação",
  requiredRole,
  currentRole,
  message,
}: PermissionDeniedModalProps) {
  const getDefaultMessage = () => {
    if (requiredRole && currentRole) {
      return `Você precisa ter permissão de ${requiredRole} para ${action}. Sua permissão atual é ${currentRole}.`;
    } else if (requiredRole) {
      return `Você precisa ter permissão de ${requiredRole} para ${action}.`;
    } else {
      return `Você não tem permissão para ${action}.`;
    }
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      ADMIN: Colors.red[600],
      NORMAL: Colors.blue[600],
      MANAGER: Colors.orange[600]
    };
    return roleColors[role as keyof typeof roleColors] || Colors.gray[600];
  };

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      ADMIN: "Administrador",
      NORMAL: "Usuário Normal",
      MANAGER: "Gerente"
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Ícone de Aviso */}
          <View style={styles.iconContainer}>
            <Octicons name="shield-x" size={52} color={Colors.red[500]} />
          </View>

          {/* Título */}
          <Text style={styles.title}>Acesso Negado</Text>

          {/* Mensagem */}
          <Text style={styles.message}>
            {message || getDefaultMessage()}
          </Text>

          {/* Informações de Permissão */}
          {requiredRole && currentRole && (
            <View style={styles.permissionInfo}>
              <View style={styles.permissionRow}>
                <Text style={styles.permissionLabel}>Permissão necessária:</Text>
                <View style={[styles.roleBadge, { backgroundColor: getRoleColor(requiredRole) }]}>
                  <Text style={styles.roleText}>{getRoleLabel(requiredRole)}</Text>
                </View>
              </View>
              
              <View style={styles.permissionRow}>
                <Text style={styles.permissionLabel}>Sua permissão:</Text>
                <View style={[styles.roleBadge, { backgroundColor: getRoleColor(currentRole) }]}>
                  <Text style={styles.roleText}>{getRoleLabel(currentRole)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Botão de Fechar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Entendi</Text>
          </TouchableOpacity>
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
    color: Colors.red[600],
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
  permissionInfo: {
    width: "100%",
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  permissionLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.white,
    textTransform: "uppercase",
  },
  closeButton: {
    backgroundColor: Colors.red[500],
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 120,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
