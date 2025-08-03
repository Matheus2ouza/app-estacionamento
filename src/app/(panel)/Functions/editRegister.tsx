import ConfirmationModal from "@/src/components/ConfirmationModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import PreviewPDF from "@/src/components/PreviewPDF";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import useEditVehicle from "@/src/hooks/vehicleFlow/useEditVehicle";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";
import { styles, modalStyles } from "@/src/styles/functions/editStyle";
import { useLocalSearchParams, router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "@/src/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";

interface RouteParams {
  id?: string;
  category?: "carro" | "moto";
  plate?: string;
  status?: string;
  description?: string;
}

export default function EntryRegister() {
  const params = useLocalSearchParams() as RouteParams;

  const categoryParam = (params.category || "carro").toLowerCase() as
    | "carro"
    | "moto";

  // Estados
  const [plate, setPlate] = useState(params.plate || "");
  const [selectedCategory, setSelectedCategory] = useState<"carro" | "moto">(
    categoryParam
  );
  const [description] = useState(params.description || "");
  const [status] = useState(params.status || "INSIDE");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [goBack, setGoBack] = useState(true);

  const [updateConfirmationVisible, setUpdateConfirmationVisible] =
    useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  // Hooks
  const {
    editVehicle,
    deleteVehicle,
    secondTicket,
    reactivateVehicle,
    loadingStates,
    error,
    success,
    reset,
  } = useEditVehicle();

  const { downloadPdf } = usePdfActions();

  // Efeitos
  useEffect(() => {
    if (error || success) reset();
  }, [plate, error, success, reset]);

  // Manipulação de dados
  const handleDeletePress = () => {
    params.id ? setDeleteConfirmationVisible(true) : confirmDelete();
  };

  const confirmDelete = useCallback(async () => {
    setDeleteConfirmationVisible(false);

    if (params.id) {
      try {
        const result = await deleteVehicle(params.id);

        if (result.success) {
          setModalMessage(result.message || "Veículo excluído com sucesso");
          setModalIsSuccess(true);
          setModalVisible(true);
          setGoBack(true);
        }
      } catch (err) {
        setModalMessage("Erro ao excluir veículo");
        setModalIsSuccess(false);
        setModalVisible(true);
      }
    }
  }, [params.id, deleteVehicle]);

  const handleRegister = () => setUpdateConfirmationVisible(true);

  const confirmUpdate = useCallback(async () => {
    setUpdateConfirmationVisible(false);

    try {
      const result = await editVehicle(
        params.id || "",
        plate,
        selectedCategory
      );

      if (result.success) {
        setModalMessage(result.message || "Dados do veículo atualizados");
        setModalIsSuccess(true);
        setModalVisible(true);
        setGoBack(true);
      }
    } catch (err) {
      setModalMessage("Erro ao atualizar veículo");
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  }, [params.id, plate, selectedCategory, editVehicle]);

  const handleSecondWay = async () => {
    if (!params.id) return;

    const result = await secondTicket(params.id);
    if (result.success && result.ticket) {
      setPdfBase64(result.ticket);
      setPdfPreviewVisible(true);
    }
  };

  const handleReactivatePress = () => {
    setUpdateConfirmationVisible(true);
  };

  const confirmReactivate = useCallback(async () => {
    setUpdateConfirmationVisible(false);

    try {
      if (!params.id || !params.plate) {
        throw new Error("Dados do veículo incompletos");
      }

      const result = await reactivateVehicle(params.id, params.plate);
      if (result.success) {
        setModalMessage(result.message || "Veículo reativado com sucesso");
        setModalIsSuccess(true);
        setModalVisible(true);
        setGoBack(true);
      }
    } catch (err) {
      setModalMessage("Erro ao reativar veículo");
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  }, [params.id, params.plate, reactivateVehicle]);

  const handleDownload = async () => {
    if (!pdfBase64 || !plate) return;

    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `ticket-${plate}-${dateStr}.pdf`;

    try {
      await downloadPdf(pdfBase64, filename);
      setModalMessage("Ticket baixado com sucesso");
      setModalIsSuccess(true);
      setModalVisible(true);
    } catch (err) {
      setModalMessage("Erro ao baixar o ticket");
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screenContainer}>
          <Image
            source={require("@/src/assets/images/splash-icon-blue.png")}
            style={styles.backgroundImage}
          />

          <Header title={params.id ? "Editar Veículo" : "Nova Entrada"} />

          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Informações do Veículo</Text>

              <TextInput
                label="Placa *"
                value={plate}
                style={styles.input}
                mode="outlined"
                autoCapitalize="characters"
                onChangeText={(text) => setPlate(text.toUpperCase())}
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
                  {(["carro", "moto"] as const).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        selectedCategory === category &&
                          styles.categoryButtonSelected,
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <MaterialIcons
                        name={
                          category === "carro"
                            ? "directions-car"
                            : "two-wheeler"
                        }
                        size={24}
                        color={
                          selectedCategory === category
                            ? Colors.white
                            : Colors.gray.dark
                        }
                      />
                      <Text
                        style={[
                          styles.categoryButtonText,
                          selectedCategory === category &&
                            styles.categoryButtonTextSelected,
                        ]}
                      >
                        {category === "carro" && "Carro"}
                        {category === "moto" && "Moto"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {description && (
                  <View style={styles.historyButtonContainer}>
                    <TouchableOpacity
                      style={modalStyles.historyButton}
                      onPress={() => setHistoryModalVisible(true)}
                    >
                      <MaterialIcons
                        name="history"
                        size={20}
                        color={Colors.white}
                      />
                      <Text style={modalStyles.historyButtonText}>
                        Ver Histórico
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.footer}>
              {status === "DELETED" ? (
                <PrimaryButton
                  title="Reativar Veículo"
                  onPress={handleReactivatePress}
                  style={styles.buttonReactivate}
                  disabled={loadingStates}
                  loadingType="reactivate"
                  loadingText="Reativando..."
                />
              ) : (
                <>
                  <PrimaryButton
                    title="Excluir Veículo"
                    onPress={handleDeletePress}
                    style={styles.buttonDelete}
                    disabled={loadingStates}
                    loadingType="delete"
                    loadingText="Excluindo..."
                  />
                  <PrimaryButton
                    title="Atualizar"
                    onPress={handleRegister}
                    style={styles.buttonAtt}
                    disabled={loadingStates}
                    loadingType="edit"
                    loadingText="Processando..."
                  />
                  {params.id && (
                    <PrimaryButton
                      title="2° via do Ticket"
                      onPress={handleSecondWay}
                      style={styles.buttonSecondTicket}
                      disabled={loadingStates}
                      loadingType="secondTicket"
                      loadingText="Gerando..."
                    />
                  )}
                </>
              )}
            </View>
          </View>

          {/* Modal de Histórico */}
          {description && (
            <Modal
              visible={historyModalVisible}
              animationType="slide"
              transparent={false}
              onRequestClose={() => setHistoryModalVisible(false)}
            >
              <View style={modalStyles.modalContainer}>
                <View style={modalStyles.modalHeader}>
                  <Text style={modalStyles.modalTitle}>Histórico Completo</Text>
                  <TouchableOpacity
                    onPress={() => setHistoryModalVisible(false)}
                    style={modalStyles.closeButton}
                  >
                    <MaterialIcons
                      name="close"
                      size={24}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                </View>

                <View style={modalStyles.historyContent}>
                  {description ? (
                    description
                      .split("\n")
                      .filter((line) => line.trim() !== "")
                      .map((line, index) => (
                        <View key={index} style={modalStyles.historyItem}>
                          <MaterialIcons
                            name="history"
                            size={16}
                            color={Colors.gray.dark}
                          />
                          <Text style={modalStyles.historyText}>{line}</Text>
                        </View>
                      ))
                  ) : (
                    <Text style={modalStyles.historyText}>
                      Nenhum registro histórico
                    </Text>
                  )}
                </View>
              </View>
            </Modal>
          )}

          {/* Outros modais */}
          <FeedbackModal
            visible={modalVisible}
            message={modalMessage}
            isSuccess={modalIsSuccess}
            onClose={() => {
              setModalVisible(false);
              if (goBack) router.back();
            }}
          />

          <ConfirmationModal
            visible={updateConfirmationVisible}
            title={
              status === "DELETED"
                ? "Confirmar Reativação"
                : params.id
                ? "Confirmar Atualização"
                : "Confirmar Cadastro"
            }
            message={
              status === "DELETED"
                ? "Tem certeza que deseja reativar este veículo?"
                : params.id
                ? "Tem certeza que deseja atualizar os dados deste veículo?"
                : "Tem certeza que deseja cadastrar este veículo?"
            }
            confirmText="Confirmar"
            cancelText="Cancelar"
            onConfirm={status === "DELETED" ? confirmReactivate : confirmUpdate}
            onCancel={() => setUpdateConfirmationVisible(false)}
          />

          <ConfirmationModal
            visible={deleteConfirmationVisible}
            title="Confirmar Exclusão"
            message="Tem certeza que deseja excluir este veículo permanentemente?"
            confirmText="Sim, Excluir"
            cancelText="Cancelar"
            onConfirm={confirmDelete}
            onCancel={() => setDeleteConfirmationVisible(false)}
          />

          <PreviewPDF
            base64={pdfBase64 || ""}
            visible={pdfPreviewVisible}
            onClose={() => setPdfPreviewVisible(false)}
            onDownload={handleDownload}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
