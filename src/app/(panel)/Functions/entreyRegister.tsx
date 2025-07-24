import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import PreviewPDF from "@/src/components/PreviewPDF";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";
import useRegisterVehicle from "@/src/hooks/vehicleFlow/useRegisterEntry";
import { styles } from "@/src/styles/functions/entreyStyle";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

export default function EntreyRegister() {
  const [plate, setPlate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "carro" | "moto" | "carroGrande"
  >("carro");

  const { registerVehicle, loading, error, success, reset } =
    useRegisterVehicle();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);

  // agora guarda o PDF base64
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const { downloadPdf, printPdf } = usePdfActions();

  const handleRegister = async () => {
    const result = await registerVehicle(plate, selectedCategory);

    setModalMessage(result.message);
    setModalIsSuccess(result.success);
    setModalVisible(true);

    if (result.success && result.pdfBase64) {
      setPdfBase64(result.pdfBase64);
      setPdfPreviewVisible(true);
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

  useEffect(() => {
    if (error || success) reset();
  }, [plate]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <Header title="Entrada" />
        <View style={styles.container}>
          <View style={styles.formInputs}>
            <TextInput
              label="Placa"
              value={plate}
              style={styles.input}
              mode="outlined"
              autoCapitalize="characters"
              onChangeText={setPlate}
            />
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>Categoria do Veículo</Text>

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
                    selectedCategory === "carroGrande" &&
                      styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory("carroGrande")}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === "carroGrande" &&
                        styles.categoryButtonTextSelected,
                    ]}
                  >
                    Carro Grande
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

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={loading ? "Registrando..." : "Confirmar Entrada"}
              onPress={handleRegister}
              style={styles.buttonConfirm}
            />
          </View>
        </View>

        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          isSuccess={modalIsSuccess}
          onClose={() => setModalVisible(false)}
        />
        {/* Modal para abrir o PDF */}
        <PreviewPDF
          base64={pdfBase64 || ""}
          visible={pdfPreviewVisible}
          onClose={() => setPdfPreviewVisible(false)}
          onDownload={handleDownload}
          onPrint={() => {
            console.log(`Impressao feita!!`);
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
