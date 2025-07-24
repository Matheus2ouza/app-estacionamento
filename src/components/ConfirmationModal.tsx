import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  titleStyle?: object;
  messageStyle?: object;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  confirmButtonColor = "#2196F3",
  cancelButtonColor = "#f44336",
  titleStyle = {},
  messageStyle = {},
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          <Text style={[styles.message, messageStyle]}>{message}</Text>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.button, 
                styles.cancelButton,
                { backgroundColor: cancelButtonColor }
              ]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>{cancelText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.confirmButton,
                { backgroundColor: confirmButtonColor }
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    marginRight: 10,
  },
  confirmButton: {
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ConfirmationModal;