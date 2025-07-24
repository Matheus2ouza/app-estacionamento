import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import FeedbackModal from "@/src/components/FeedbackModal";
import { styles } from "@/src/styles/functions/registerPaymentStyle";
import LoadingModal from "@/src/components/LoadingModal";
import useRegisterExit from "@/src/hooks/vehicleFlow/useRegisterExit";
import useCashService from "@/src/hooks/cash/useCashStatus";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";
import PreviewPDF from "@/src/components/PreviewPDF";

type PaymentMethod = "Dinheiro" | "Crédito" | "Débito" | "Pix" | "";

export default function PaymentVehicle() {
  const { getStatusCash, openCash, openCashId, cashStatus } = useCashService();
  const params = useLocalSearchParams();

  // Extrair parâmetros do veículo
  const {
    id,
    plate = "",
    category = "",
    entryTime = "",
    exitTime = "",
    stayDuration = "",
    amount = 0,
  } = params;

  const [discount, setDiscount] = useState("");
  const [paidValue, setPaidValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Dinheiro");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [textLoading, setTextLoading] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [dotText, setDotText] = useState(".");
  const { registerVehiclePayment, error } = useRegisterExit();
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const { downloadPdf, printPdf } = usePdfActions();

  // Calcular valores
  const discountValue = parseFloat(discount.replace(",", ".")) || 0;
  const paid = parseFloat(paidValue.replace(",", ".")) || 0;
  const finalPrice = Number(amount) - discountValue;
  const change = paid - finalPrice;

  useEffect(() => {
    const fetchCashStatus = async () => {
      setTextLoading("Buscando Dados...");
      setLoadingModal(true);

      try {
        await getStatusCash();
      } finally {
        setLoadingModal(false);
      }
    };

    fetchCashStatus();
  }, []);

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setDotText((prev) => {
        if (prev.length >= 3) return ".";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const handlePayment = async () => {
    if (!paymentMethod) {
      setModalMessage("Selecione um método de pagamento");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    if (paid < finalPrice) {
      setModalMessage("Valor pago é menor que o valor final");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    if (!openCashId) {
      setModalMessage("Nenhum caixa aberto. Abra um caixa para continuar.");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    setTextLoading("Registrando pagamento...");
    setLoadingModal(true);
    setIsProcessing(true);

    const paymentData = {
      paymentMethod,
      cashRegisterId: openCashId,
      vehicleId: String(id),
      totalAmount: amount,
      discountValue,
      finalPrice,
      amountReceived: Number(paidValue),
      changeGiven: change,
      entryTime: String(entryTime),
      exitTime: String(exitTime),
      stayDuration: String(stayDuration),
    };

    try {
      const result = await registerVehiclePayment(paymentData);

      if (result.success) {
        setModalMessage(result.message || "Pagamento registrado com sucesso!");
        setModalIsSuccess(true);
        setModalVisible(true);

        setTimeout(() => {
          setPdfBase64(result.pdfBase64 ?? null);
          setPdfPreviewVisible(true);
          setTransactionId(result.transactionId ?? null);
        });
      } else {
        setModalMessage(result.message || "Erro ao registrar o pagamento.");
        setModalIsSuccess(false);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      setModalMessage(
        typeof error === "string"
          ? error
          : "Erro inesperado ao processar pagamento."
      );
      setModalIsSuccess(false);
      setModalVisible(true);
    } finally {
      setLoadingModal(false);
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfBase64 || !transactionId) return;

    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `Comprovante-${transactionId}-${dateStr}.pdf`;

    try {
      await downloadPdf(pdfBase64, filename);
      console.log("Download feito com sucesso");
    } catch (err) {
      console.error("Erro ao baixar o PDF:", err);
    }
  };

  const handlePrint = () => {
    if (!pdfBase64) return;
    printPdf(pdfBase64);
  };

  const isFormValid = paymentMethod && paidValue;

  return (
    <View style={styles.container}>
      <LoadingModal visible={loadingModal} text={textLoading} />

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
        onPrint={handlePrint}
      />

      <Header
        title="Pagamento de Estacionamento"
        titleStyle={{ fontSize: 27 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleTitle}>Placa: {plate}</Text>
          <Text style={styles.vehicleDetail}>Categoria: {category}</Text>
          <Text style={styles.vehicleDetail}>
            Entrada:{" "}
            {typeof entryTime === "string"
              ? new Date(entryTime).toLocaleString()
              : "N/A"}
          </Text>
          <Text style={styles.vehicleDetail}>
            Saída:{" "}
            {typeof exitTime === "string"
              ? new Date(exitTime).toLocaleString()
              : "N/A"}
          </Text>
          <Text style={styles.vehicleDetail}>Tempo: {stayDuration}</Text>
          <Text style={styles.vehiclePrice}>
            Valor: R$ {Number(amount).toFixed(2).replace(".", ",")}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.formContainer}>
          <TextInput
            label="Desconto"
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            value={discount}
            onChangeText={setDiscount}
            left={<TextInput.Affix text="R$" />}
          />

          <View style={styles.paymentMethodContainer}>
            <Text style={styles.label}>Método de Pagamento:</Text>
            <View style={styles.methodButtons}>
              {(["Dinheiro", "Crédito", "Débito", "Pix"] as const).map(
                (method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodButton,
                      paymentMethod === method && styles.methodButtonSelected,
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <MaterialIcons
                      name={
                        method === "Dinheiro"
                          ? "attach-money"
                          : method === "Crédito"
                          ? "credit-card"
                          : method === "Débito"
                          ? "credit-card"
                          : "pix"
                      }
                      size={24}
                      color={
                        paymentMethod === method
                          ? Colors.white
                          : Colors.blue.light
                      }
                    />
                    <Text
                      style={[
                        styles.methodButtonText,
                        paymentMethod === method &&
                          styles.methodButtonTextSelected,
                      ]}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          <TextInput
            label="Valor Pago (R$)"
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            value={paidValue}
            onChangeText={setPaidValue}
            left={<TextInput.Affix text="R$" />}
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={[styles.summaryValue, { color: Colors.blue.light }]}>
                R$ {Number(amount).toFixed(2).replace(".", ",")}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Desconto:</Text>
              <Text style={[styles.summaryValue, { color: Colors.red[500] }]}>
                - R$ {discountValue.toFixed(2).replace(".", ",")}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Valor Final:</Text>
              <Text style={[styles.summaryValue, { color: Colors.blue.light }]}>
                R$ {finalPrice.toFixed(2).replace(".", ",")}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Valor Recebido:</Text>
              <Text style={[styles.summaryValue, { color: Colors.blue.light }]}>
                R$ {Number(paidValue).toFixed(2).replace(".", ",")}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Troco:</Text>
              <Text
                style={[
                  styles.summaryValue,
                  change >= 0 ? styles.positive : styles.negative,
                ]}
              >
                R$ {Math.abs(change).toFixed(2).replace(".", ",")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={[
          styles.paymentButton,
          (!isFormValid || isProcessing) && {
            backgroundColor: Colors.gray.dark,
          },
        ]}
        disabled={!isFormValid || isProcessing}
        onPress={handlePayment}
      >
        {isProcessing ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.paymentButtonText}>
            {isProcessing ? `Processando${dotText}` : "Confirmar Pagamento"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
