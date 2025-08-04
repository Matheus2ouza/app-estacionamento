import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Modal,
} from "react-native";
import { TextInput } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import FeedbackModal from "@/src/components/FeedbackModal";
import {
  styles,
  modalStyles,
} from "@/src/styles/functions/registerPaymentStyle";
import LoadingModal from "@/src/components/LoadingModal";
import { useRegisterExit } from "@/src/hooks/vehicleFlow/useRegisterExit";
import useCashService from "@/src/hooks/cash/useCashStatus";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";
import PreviewPDF from "@/src/components/PreviewPDF";
import { useAuth } from "@/src/context/AuthContext";
import PixPayment from "@/src/components/PixPayment";

type PaymentMethod = "Dinheiro" | "Crédito" | "Débito" | "Pix" | "";

export default function PaymentVehicle() {
  const { role, isLoading, isAuthenticated } = useAuth();
  const { getStatusCash, openCashId } = useCashService();
  const params = useLocalSearchParams();

  // Extrair parâmetros do veículo
  const {
    id,
    plate = "",
    category = "",
    entryTime = "",
    exitTime = "",
    stayDuration = "",
  } = params;

  const { calculateAmount, registerExit } = useRegisterExit();
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [discount, setDiscount] = useState("");
  const [paidValue, setPaidValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Dinheiro");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [textLoading, setTextLoading] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [dotText, setDotText] = useState(".");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [zeroAmountModalVisible, setZeroAmountModalVisible] = useState(false);
  const { downloadPdf } = usePdfActions();
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPixSuccess, setShowPixSuccess] = useState(false);

  // Calcular valores
  const discountValue = parseFloat(discount.replace(",", ".")) || 0;
  const paid = parseFloat(paidValue.replace(",", ".")) || 0;
  const finalPrice = calculatedAmount - discountValue;
  const change = paid - finalPrice;

  useEffect(() => {
    const fetchData = async () => {
      setTextLoading("Buscando Dados...");
      setLoadingModal(true);

      try {
        await getStatusCash();

        if (category && stayDuration) {
          setIsCalculating(true);
          const { success, amount } = await calculateAmount(
            String(category).toLowerCase(),
            String(stayDuration)
          );

          if (success) {
            setCalculatedAmount(amount || 0);

            if (amount === 0) {
              setZeroAmountModalVisible(true);
            }
          }
        }
      } finally {
        setLoadingModal(false);
        setIsCalculating(false);
      }
    };

    fetchData();
  }, [category, stayDuration]);

  const handleNavigateHome = () => {
    if (role === "ADMIN") {
      router.replace("/home/admin");
    } else {
      router.replace("/home/normal");
    }
  };

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

    if (paymentMethod === "Pix" && !receiptImage) {
      setModalMessage("Por favor, anexe o comprovante do PIX");
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

    try {
      setTextLoading("Registrando pagamento...");
      setLoadingModal(true);
      setIsProcessing(true);

      // Construir dados para registro de saída
      const exitData = {
        plate: String(plate),
        exit_time: new Date().toISOString(), // Usar hora atual
        openCashId: openCashId || "",
        amount_received: paid,
        change_given: change,
        discount_amount: discountValue,
        final_amount: finalPrice,
        original_amount: calculatedAmount,
        method: paymentMethod,
        receiptImage: paymentMethod === "Pix" ? receiptImage || undefined : undefined,
      };

      // Chamar função de registro de saída
      const response = await registerExit(exitData);

      if (response.success) {
        // Mostrar comprovante se existir
        if (response.receipt) {
          setPdfBase64(response.receipt);
          setTransactionId(response.exitData || null);
          setPdfPreviewVisible(true);
        } else {
          setModalMessage("Pagamento registrado, mas comprovante não gerado");
          setModalIsSuccess(true);
          setModalVisible(true);
        }
      } else {
        setModalMessage(response.message || "Erro ao registrar pagamento");
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

  const handleDownload = async () => {
    if (!pdfBase64 || !transactionId) return;

    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `Comprovante-${transactionId}-${dateStr}.pdf`;

    try {
      await downloadPdf(pdfBase64, filename);
    } catch (err) {
      console.error("Erro ao baixar o PDF:", err);
    }
  };

  useEffect(() => {
    if (calculatedAmount > 0) {
      const valorInicial = calculatedAmount.toFixed(2).replace(".", ",");
      setPaidValue(valorInicial);
    }
  }, [calculatedAmount]);

  const formatCurrency = (value: string | number): string => {
    const str =
      typeof value === "string" ? value.replace(",", ".") : String(value);
    const num = Number(str);
    return isNaN(num) ? "0,00" : num.toFixed(2).replace(".", ",");
  };

  const isFormValid = paymentMethod && paidValue;

  return (
    <View style={styles.container}>
      <LoadingModal visible={loadingModal} text={textLoading} />

      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        isSuccess={modalIsSuccess}
        goToRoute="/Functions/scanExit"
        onClose={() => setModalVisible(false)}
      />

      <Modal
        visible={zeroAmountModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}} // Desabilita fechar com botão físico (Android)
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <View style={modalStyles.iconContainer}>
              <MaterialIcons name="warning" size={36} color={Colors.red[600]} />
            </View>

            <Text style={modalStyles.modalTitle}>Atenção</Text>
            <Text style={modalStyles.modalMessage}>
              O veículo ainda não ficou tempo suficiente para ser cobrado.
              {"\n\n"}
              Caso deseje removê-lo, vá em Pátio {">"} Selecione o veículo {">"}{" "}
              Excluir Veículo.
            </Text>
            <TouchableOpacity
              style={modalStyles.modalButton}
              onPress={handleNavigateHome}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.modalButtonText}>Voltar para Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PreviewPDF
        base64={pdfBase64 || ""}
        visible={pdfPreviewVisible}
        onClose={() => setPdfPreviewVisible(false)}
        onDownload={handleDownload}
        onNavigateBack={() => {
          if (role === "ADMIN") {
            router.replace("/home/admin");
          } else {
            router.replace("/home/normal");
          }
        }}
      />

      <PixPayment
        visible={showPixPayment}
        onClose={() => setShowPixPayment(false)}
        onReceiptUpload={(uri) => {
          setReceiptImage(uri);
          setShowPixSuccess(true); // Mostra feedback quando o comprovante é salvo
        }}
        qrCodeImage={require("@/src/assets/images/QRCODEpagamento.png")}
      />

      <FeedbackModal
        visible={showPixSuccess}
        message="Comprovante PIX salvo com sucesso!"
        isSuccess={true}
        onClose={() => setShowPixSuccess(false)}
      />

      <Header title="Pagamento de Estacionamento" />

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

          {isCalculating ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={styles.vehiclePrice}>
              Valor: R$ {calculatedAmount.toFixed(2).replace(".", ",")}
            </Text>
          )}
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
                    onPress={() => {
                      setPaymentMethod(method);
                      setShowPixPayment(method === "Pix");
                      if (method !== "Pix") setReceiptImage(null);
                    }}
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
                R$ {calculatedAmount.toFixed(2).replace(".", ",")}
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
                R$ {formatCurrency(paidValue)}
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
