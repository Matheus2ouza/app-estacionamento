import ConfirmationModal from "@/src/components/ConfirmationModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import PreviewPDF from "@/src/components/previewPDF";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import useEditVehicle from "@/src/hooks/vehicleFlow/useEditVehicle";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";
import { styles } from "@/src/styles/functions/editStyle";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

interface RouteParams {
  id?: string;
  category?: "carro" | "moto" | "carroGrande";
  plate?: string;
}

export default function EntryRegister() {
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [updateConfirmationVisible, setUpdateConfirmationVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);

  // Hooks
  const {
    editVehicle,
    deleteVehicle,
    secondTicket,
    loading,
    error,
    success,
    reset,
  } = useEditVehicle();
  
  const { downloadPdf, printPdf } = usePdfActions();

  // Efeitos
  useEffect(() => {
    if (error || success) reset();
  }, [plate, error, success, reset]);

  // Funções auxiliares
  const closeFeedbackModal = useCallback(() => {
    setModalVisible(false);
    reset();
  }, [reset]);

  const showFeedback = useCallback((isSuccess: boolean, message: string) => {
    setModalIsSuccess(isSuccess);
    setModalMessage(message);
    setModalVisible(true);
  }, []);

  // Manipulação de dados
  const handleDeletePress = () => {
    params.id 
      ? setDeleteConfirmationVisible(true)
      : confirmDelete();
  };

  const confirmDelete = useCallback(async () => {
    setDeleteConfirmationVisible(false);

    if (params.id) {
      try {
        await deleteVehicle(params.id);
      } catch (err) {
        // Erro tratado no hook
      }
    } else {
      setPlate("");
      setSelectedCategory("carro");
      showFeedback(true, "Dados do formulário limpos!");
    }
  }, [params.id, deleteVehicle, showFeedback]);

  const handleRegister = () => setUpdateConfirmationVisible(true);

  const confirmUpdate = useCallback(async () => {
    setUpdateConfirmationVisible(false);

    try {
      await editVehicle(params.id || "", plate, selectedCategory);
      if (!params.id) {
        setPlate("");
        setSelectedCategory("carro");
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
    } else {
      showFeedback(false, result.message);
    }
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
                {(["carro", "carrogrande", "moto"] as const).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category && styles.categoryButtonTextSelected,
                      ]}
                    >
                      {category === "carro" && "Carro"}
                      {category === "carrogrande" && "Carro Grande"}
                      {category === "moto" && "Moto"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Botões de ação */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={params.id ? "Excluir Veículo" : "Limpar Dados"}
              onPress={handleDeletePress}
              style={styles.buttonDelete}
              disabled={loading}
            />
            
            <PrimaryButton
              title={loading ? "Processando..." : params.id ? "Atualizar" : "Cadastrar"}
              onPress={handleRegister}
              style={styles.buttonAtt}
              disabled={loading}
            />
            
            {params.id && (
              <PrimaryButton
                title={loading ? "Gerando..." : "2° via do Ticket"}
                onPress={handleSecondWay}
                style={styles.buttonAtt}
                disabled={loading}
              />
            )}
          </View>
        </View>

        {/* Modais */}
        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          isSuccess={modalIsSuccess}
          onClose={closeFeedbackModal}
          dismissible={false}
        />

        <ConfirmationModal
          visible={updateConfirmationVisible}
          title={params.id ? "Confirmar Atualização" : "Confirmar Cadastro"}
          message={
            params.id
              ? "Tem certeza que deseja atualizar os dados deste veículo?"
              : "Tem certeza que deseja cadastrar este veículo?"
          }
          confirmText="Confirmar"
          cancelText="Cancelar"
          confirmButtonColor="#3498db"
          cancelButtonColor="#95a5a6"
          onConfirm={confirmUpdate}
          onCancel={() => setUpdateConfirmationVisible(false)}
          titleStyle={{ color: "#2980b9" }}
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