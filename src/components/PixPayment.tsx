import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";

interface PixPaymentProps {
  visible: boolean;
  onClose: () => void;
  onReceiptUpload: (uri: string) => void;
  qrCodeImage: string | number; // Aceita string (URL) ou number (require)
}

const PixPayment: React.FC<PixPaymentProps> = ({
  visible,
  onClose,
  onReceiptUpload,
  qrCodeImage, // Recebe a imagem do QR Code como prop
}) => {
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  // Modifique a função takePicture no PixPayment
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos de permissão para acessar a câmera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
      onReceiptUpload(result.assets[0].uri); // Continua enviando normalmente
      onClose(); // Fecha o modal automaticamente
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>

          <Text style={styles.title}>Pagamento via PIX</Text>

          <View style={styles.qrCodeContainer}>
            <Image
              source={
                typeof qrCodeImage === "string"
                  ? { uri: qrCodeImage }
                  : qrCodeImage
              }
              style={styles.qrCode}
              resizeMode="contain"
            />
            <Text style={styles.instructions}>Escaneie o QR Code acima</Text>
          </View>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <MaterialIcons name="camera-alt" size={24} color={Colors.white} />
            <Text style={styles.captureButtonText}>
              Tirar Foto do Comprovante
            </Text>
          </TouchableOpacity>

          {receiptImage && (
            <View style={styles.receiptPreviewContainer}>
              <Text style={styles.receiptLabel}>Comprovante:</Text>
              <Image
                source={{ uri: receiptImage }}
                style={styles.receiptImage}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Os estilos permanecem os mesmos
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: Colors.red[500],
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.blue.logo,
    textAlign: "center",
    marginBottom: 15,
  },
  qrCodeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrCode: {
    width: 350,
    height: 350,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 14,
    color: Colors.gray.dark,
    textAlign: "center",
  },
  captureButton: {
    flexDirection: "row",
    backgroundColor: Colors.blue.logo,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  captureButtonText: {
    color: Colors.white,
    marginLeft: 10,
    fontWeight: "bold",
  },
  receiptPreviewContainer: {
    marginTop: 10,
  },
  receiptLabel: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginBottom: 5,
  },
  receiptImage: {
    width: "100%",
    height: 150,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
});

export default PixPayment;
