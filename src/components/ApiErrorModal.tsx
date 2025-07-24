import React, { useEffect } from "react";
import {
  BackHandler,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";

type ApiErrorModalProps = {
  visible: boolean;
  message: string | null;
  onClose: () => void;
};

export default function ApiErrorModal({ visible, message, onClose }: ApiErrorModalProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      // Listener para botão voltar no Android
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        onClose();
        return true; // evita comportamento padrão de fechar app
      });

      return () => {
        clearTimeout(timer);
        backHandler.remove();
      };
    }
  }, [visible, onClose]);

  if (!message) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose} // chamado ao apertar o botão voltar no Android
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Evitar fechar ao clicar dentro do modal */}
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <Text style={styles.title}>Erro no Cadastro</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
    color: "#e53935",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
});
