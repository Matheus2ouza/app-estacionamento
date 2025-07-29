import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import PreviewPDF from "@/src/components/PreviewPDF";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";
import useRegisterVehicle from "@/src/hooks/vehicleFlow/useRegisterEntry";
import { styles } from "@/src/styles/functions/entreyStyle";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function EntreyRegister() {
  const [plate, setPlate] = useState("");
  const [observation, setObservation] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"carro" | "moto">(
    "carro"
  );

  const { registerVehicle, loading, error, success, reset } =
    useRegisterVehicle();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const { downloadPdf } = usePdfActions();

  const handleRegister = async () => {
    const data = {
      plate: plate.toUpperCase().trim(),
      category: selectedCategory,
      observation,
      photo,
    };

    const result = await registerVehicle(data);

    setModalMessage(result.message);
    setModalIsSuccess(result.success);
    setModalVisible(true);

    if (result.success && result.pdfBase64) {
      setPdfBase64(result.pdfBase64);
      setPdfPreviewVisible(true);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      setModalMessage("Permissão para acessar a câmera foi negada");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const handleDownload = async () => {
    if (!pdfBase64 || !plate) return;

    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `ticket-${plate}-${dateStr}.pdf`;

    try {
      await downloadPdf(pdfBase64, filename);
      console.log("Download feito com sucesso");
    } catch (err) {
      console.error("Erro ao baixar o PDF:", err);
    }
  };

  useEffect(() => {
    if (error || success) reset();
  }, [plate]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Header title="Entrada" />
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <TextInput
              label="Placa *"
              value={plate}
              style={styles.input}
              mode="outlined"
              autoCapitalize="characters"
              onChangeText={setPlate}
              outlineColor="#ddd"
              activeOutlineColor="#002B50"
            />

            <View style={styles.observationContainer}>
              <TextInput
                placeholder="Observação (opcional)"
                value={observation}
                style={styles.observationInput}
                mode="outlined"
                multiline
                numberOfLines={4}
                maxLength={150}
                onChangeText={setObservation}
                outlineColor="#ddd"
                activeOutlineColor="#002B50"
                dense={true}
              />
              <Text style={styles.characterCount}>
                {observation.length}/150
              </Text>
            </View>

            <View style={styles.photoSection}>
              <Text style={styles.sectionLabel}>Foto (opcional)</Text>
              {photo ? (
                <View style={styles.photoPreviewContainer}>
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={handleRemovePhoto}
                  >
                    <MaterialIcons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleTakePhoto}
                >
                  <MaterialIcons name="add-a-photo" size={24} color="#002B50" />
                  <Text style={styles.addPhotoText}>Adicionar Foto</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.categoryContainer}>
              <Text style={styles.sectionLabel}>Categoria do Veículo *</Text>
              <View style={styles.categoryButtons}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === "carro" &&
                      styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory("carro")}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === "carro" &&
                        styles.categoryButtonTextSelected,
                    ]}
                  >
                    Carro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === "moto" &&
                      styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory("moto")}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === "moto" &&
                        styles.categoryButtonTextSelected,
                    ]}
                  >
                    Moto
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <PrimaryButton
            title={loading ? "Registrando..." : "Confirmar Entrada"}
            onPress={handleRegister}
            style={styles.confirmButton}
            disabled={!plate || loading}
          />
        </View>

        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          isSuccess={modalIsSuccess}
          onClose={() => setModalVisible(false)}
        />

        <PreviewPDF
          base64={pdfBase64 || ""}
          visible={pdfPreviewVisible}
          onClose={() => setPdfPreviewVisible(false)}
          onDownload={handleDownload}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
