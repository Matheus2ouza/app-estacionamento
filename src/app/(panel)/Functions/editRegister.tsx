import ConfirmationModal from "@/src/components/ConfirmationModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import PreviewPDF from "@/src/components/PreviewPDF";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import useEditVehicle from "@/src/hooks/vehicleFlow/useEditVehicle";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";
import { styles } from "@/src/styles/functions/editStyle";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "@/src/constants/Colors";

interface RouteParams {
  id?: string;
  category?: "carro" | "moto" | "carroGrande";
  plate?: string;
  status?: string;
  description?: string;
}

export default function EntryRegister() {
  const { role } = useAuth();
  // Parâmetros da rota
  const params = useLocalSearchParams() as RouteParams;

  const categoryParam = (params.category || "carro").toLowerCase() as
    | "carro"
    | "moto"
    | "carrogrande";

  // Estados
  const [plate, setPlate] = useState(params.plate || "");
  const [selectedCategory, setSelectedCategory] = useState<
    "carro" | "moto" | "carrogrande"
  >(categoryParam);
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

  // Hooks
  const {
    editVehicle,
    deleteVehicle,
    secondTicket,
    reactivateVehicle,
    loadingStates, // Recebemos os estados individuais
    error,
    success,
    reset,
  } = useEditVehicle();

  const { downloadPdf, printPdf } = usePdfActions();

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
          setModalMessage(result.message || "Veiculo Excluido");
          setModalIsSuccess(true);
          setModalVisible(true);
          setGoBack(true);
        }
      } catch (err) {
        // Erro tratado no hook
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
      console.log(result);
      if (result.success) {
        setModalMessage(result.message || "Dados do veiculo atualizados");
        setModalIsSuccess(true);
        setModalVisible(true);
        setGoBack(true);
      }
    } catch (err) {
      // Erro tratado no hook
    }
  }, [params.id, plate, selectedCategory, editVehicle]);

  // Manipulação de PDF
  const handleSecondWay = async () => {
    if (!params.id) return;

    const result = await secondTicket(params.id);
    if (result.success && result.ticket) {
      setPdfBase64(result.ticket);
      setPdfPreviewVisible(true);
    }
  };

  // Adicione esta função para reativação
  const handleReactivatePress = () => {
    setUpdateConfirmationVisible(true);
  };

  const confirmReactivate = useCallback(async () => {
    setUpdateConfirmationVisible(false);

    try {
      // Adicione verificações para garantir que os parâmetros existam
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
      console.error("Erro ao reativar veículo:", err);
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
      console.log("Download feito com sucesso");
    } catch (err) {
      console.error("Erro ao baixar o PDF:", err);
    }
  };

  const handlePrint = async () => {
    if (!pdfBase64) return;

    try {
      await printPdf(pdfBase64);
      console.log("Impressão solicitada com sucesso");
    } catch (err) {
      console.error("Erro ao imprimir:", err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <Header title={params.id ? "Editar Veículo" : "Nova Entrada"} />

        {/* Formulário principal */}
        <View style={styles.container}>
          <View style={styles.formSection}>
            <View style={styles.formInputs}>
              <TextInput
                label="Placa"
                value={plate}
                style={styles.input}
                mode="outlined"
                autoCapitalize="characters"
                onChangeText={(text) => setPlate(text.toUpperCase())}
              />

              <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Categoria do Veículo</Text>
                <View style={styles.categoryButtons}>
                  {(["carro", "carrogrande", "moto"] as const).map(
                    (category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryButton,
                          selectedCategory === category &&
                            styles.categoryButtonSelected,
                        ]}
                        onPress={() => setSelectedCategory(category)}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            selectedCategory === category &&
                              styles.categoryButtonTextSelected,
                          ]}
                        >
                          {category === "carro" && "Carro"}
                          {category === "carrogrande" && "Carro Grande"}
                          {category === "moto" && "Moto"}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>
                Histórico de Alterações:
              </Text>
              <ScrollView
                style={styles.descriptionScroll}
                contentContainerStyle={styles.descriptionContent}
              >
                {description ? (
                  description
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, index) => (
                      <Text key={index} style={styles.descriptionText}>
                        {line}
                      </Text>
                    ))
                ) : (
                  <Text style={styles.descriptionText}>
                    Nenhum registro histórico
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>

          {/* Botões de ação */}
          <View style={styles.buttonContainer}>
            {/* Substitua o botão de Excluir/Atualizar por este código */}
            {status === "DELETED" ? (
              <PrimaryButton
                title={"Reativar Veículo"}
                onPress={handleReactivatePress}
                style={styles.buttonReactivate}
                disabled={loadingStates}
                loadingType="reactivate"
                loadingText="Reativando..."
              />
            ) : (
              <>
                <PrimaryButton
                  title={"Excluir Veículo"}
                  onPress={handleDeletePress}
                  style={styles.buttonDelete}
                  disabled={loadingStates}
                  loadingType="delete"
                  loadingText="Excluindo..."
                />
                <PrimaryButton
                  title={"Atualizar"}
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
                    style={styles.buttonAtt}
                    disabled={loadingStates}
                    loadingType="secondTicket"
                    loadingText="Gerando..."
                  />
                )}
              </>
            )}
          </View>
        </View>

        {/* Modais */}
        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          isSuccess={modalIsSuccess}
          onClose={() => {
            setModalVisible(false);
          }}
          shouldGoBack={goBack}
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
          confirmButtonColor={
            status === "DELETED" ? Colors.green[500] : "#3498db"
          }
          cancelButtonColor="#95a5a6"
          onConfirm={status === "DELETED" ? confirmReactivate : confirmUpdate}
          onCancel={() => setUpdateConfirmationVisible(false)}
          titleStyle={{
            color: status === "DELETED" ? Colors.green[700] : "#2980b9",
          }}
          messageStyle={{ color: "#34495e" }}
        />

        <ConfirmationModal
          visible={deleteConfirmationVisible}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este veículo permanentemente?"
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          confirmButtonColor="#e74c3c"
          cancelButtonColor="#95a5a6"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirmationVisible(false)}
          titleStyle={{ color: "#c0392b" }}
          messageStyle={{ color: "#34495e" }}
        />

        <PreviewPDF
          base64={pdfBase64 || ""}
          visible={pdfPreviewVisible}
          onClose={() => setPdfPreviewVisible(false)}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
