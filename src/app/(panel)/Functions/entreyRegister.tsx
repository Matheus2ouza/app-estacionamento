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
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import Colors from "@/src/constants/Colors";
import CashAlertModal from "@/src/components/CashAlertModal"; // Adicionado
import { useCash } from "@/src/context/CashContext"; // Adicionado

export default function EntryRegister() {
  const [plate, setPlate] = useState("");
  const [observation, setObservation] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"carro" | "moto">("carro");

  const { registerVehicle, loading, error, success, reset } = useRegisterVehicle();
  const { cashStatus, getStatusCash } = useCash(); // Adicionado

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [showCashAlert, setShowCashAlert] = useState(false); // Adicionado
  const { downloadPdf } = usePdfActions();

  // Verificar status do caixa ao montar o componente
  useEffect(() => {
    getStatusCash();
  }, []);

  // Mostrar alerta se caixa não estiver aberto
  useEffect(() => {
    if (cashStatus && cashStatus !== "OPEN") {
      setShowCashAlert(true);
    }
  }, [cashStatus]);

  const handleRegister = async () => {
    // Verificar se o caixa está aberto antes de registrar
    if (cashStatus !== "OPEN") {
      setShowCashAlert(true);
      return;
    }

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
    // Verificar se o caixa está aberto antes de tirar foto
    if (cashStatus !== "OPEN") {
      setShowCashAlert(true);
      return;
    }

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
      quality: 0.5,
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
      setModalMessage("Ticket baixado com sucesso!");
      setModalIsSuccess(true);
      setModalVisible(true);
    } catch (err) {
      setModalMessage("Erro ao baixar o ticket");
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  };

  useEffect(() => {
    if (error || success) reset();
  }, [plate]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Adicionar o CashAlertModal */}
        <CashAlertModal
          visible={showCashAlert}
          type="block"
          onClose={() => {
            setShowCashAlert(false);
            router.back(); // Ou navegar para a tela de abertura de caixa
          }}
        />

        <Image
          source={require("@/src/assets/images/splash-icon-blue.png")}
          style={styles.backgroundImage}
        />
        
        <Header title="Registrar Entrada" />
        
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
              <Text style={styles.sectionTitle}>Informações do Veículo</Text>
              
              <TextInput
                label="Placa *"
                value={plate}
                style={styles.input}
                mode="outlined"
                autoCapitalize="characters"
                onChangeText={setPlate}
                theme={{
                  colors: {
                    primary: Colors.blue.logo,
                    background: Colors.white,
                  },
                  roundness: 8,
                }}
                left={<TextInput.Icon icon="car" color={Colors.gray.dark} />}
              />

              <View style={styles.categoryContainer}>
                <Text style={styles.sectionLabel}>Categoria *</Text>
                <View style={styles.categoryButtons}>
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      selectedCategory === "carro" && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory("carro")}
                  >
                    <MaterialIcons 
                      name="directions-car" 
                      size={24} 
                      color={selectedCategory === "carro" ? Colors.white : Colors.gray.dark} 
                    />
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === "carro" && styles.categoryButtonTextSelected,
                    ]}>
                      Carro
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      selectedCategory === "moto" && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory("moto")}
                  >
                    <MaterialIcons 
                      name="two-wheeler" 
                      size={24} 
                      color={selectedCategory === "moto" ? Colors.white : Colors.gray.dark} 
                    />
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === "moto" && styles.categoryButtonTextSelected,
                    ]}>
                      Moto
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput
                placeholder="Observação (opcional)"
                value={observation}
                style={[styles.input, styles.observationInput]}
                mode="outlined"
                multiline
                numberOfLines={4}
                maxLength={150}
                onChangeText={setObservation}
                theme={{
                  colors: {
                    primary: Colors.blue.logo,
                    background: Colors.white,
                  },
                  roundness: 8,
                }}
              />
              <Text style={styles.characterCount}>
                {observation.length}/150
              </Text>

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
                    <MaterialIcons name="add-a-photo" size={24} color={Colors.blue.logo} />
                    <Text style={styles.addPhotoText}>Adicionar Foto</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>          
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <PrimaryButton
            title={loading ? "Registrando..." : "Confirmar Entrada"}
            onPress={handleRegister}
            style={styles.createButton}
            disabled={!plate || loading || cashStatus !== "OPEN"} // Desabilitar se caixa não estiver aberto
            loading={loading}
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