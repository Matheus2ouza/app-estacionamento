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
import { styles } from "@/src/styles/functions/paymentProductStyle";
import LoadingModal from "@/src/components/LoadingModal";
import { useRegisterPayment } from "@/src/hooks/products/useRegisterPayment";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";
import PreviewPDF from "@/src/components/PreviewPDF";
import ProductListModal from "@/src/components/ListProducts";
import PixPayment from "@/src/components/PixPayment";
import { useCash } from "@/src/context/CashContext"; // Importe o contexto do caixa

type PaymentMethod = "Dinheiro" | "Crédito" | "Débito" | "Pix" | "";

export default function PaymentProducts() {
  const params = useLocalSearchParams();
  const { openCashId, cashStatus, loading: cashLoading } = useCash(); // Use o contexto do caixa

  const parsedSaleItems = params.saleItems
    ? JSON.parse(String(params.saleItems))
    : [];

  const [isProductListVisible, setIsProductListVisible] = useState(false);
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
  const { registerPayment, error } = useRegisterPayment();
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const { downloadPdf } = usePdfActions();
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  // Extrair parâmetros do produto
  const quantityProducts = params.totalItems
    ? String(params.totalItems)
    : "Produto Desconhecido";
  const totalAmount = params.totalAmount
    ? parseFloat(String(params.totalAmount).replace(",", "."))
    : 0;

  // Calcular valores
  const discountValue = parseFloat(discount.replace(",", ".")) || 0;
  const paid = parseFloat(paidValue.replace(",", ".")) || 0;
  const finalPrice = totalAmount - discountValue;
  const change = paid - finalPrice;

  useEffect(() => {
    const fetchCashStatus = async () => {
      setTextLoading("Verificando status do caixa...");
      setLoadingModal(true);

      try {
        // Verificação do caixa já é feita pelo contexto
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
    if (cashStatus !== 'OPEN') {
      setModalMessage("O caixa não está aberto. Por favor, abra o caixa antes de registrar pagamentos.");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    if (!openCashId) {
      setModalMessage("Nenhum caixa aberto encontrado");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

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

    const parsedAmount = Number(paidValue.replace(",", "."));
    const parsedDiscount = Number(discount.replace(",", "."));
    const finalPrice = totalAmount - parsedDiscount;
    const change = parsedAmount - finalPrice;

    if (parsedAmount < finalPrice) {
      setModalMessage("Valor pago é menor que o valor final");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    setTextLoading("Registrando pagamento...");
    setLoadingModal(true);
    setIsProcessing(true);

    const paymentData = {
      paymentMethod,
      cashRegisterId: openCashId, // Usando o ID do caixa do contexto
      totalAmount,
      discountValue: parsedDiscount,
      finalPrice,
      amountReceived: parsedAmount,
      changeGiven: change,
      saleItems: parsedSaleItems,
      receiptImage: paymentMethod === "Pix" ? receiptImage : null,
    };

    try {
      const result = await registerPayment(paymentData);

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
    } catch (err) {
      console.error("Erro ao baixar o PDF:", err);
    }
  };

  useEffect(() => {
    if (totalAmount > 0) {
      const valorInicial = totalAmount.toFixed(2).replace(".", ",");
      setPaidValue(valorInicial);
    }
  }, [totalAmount]);

  const formatCurrency = (value: string | number): string => {
    const str =
      typeof value === "string" ? value.replace(",", ".") : String(value);
    const num = Number(str);
    return isNaN(num) ? "0,00" : num.toFixed(2).replace(".", ",");
  };

  const isFormValid = paymentMethod && paidValue && cashStatus === 'OPEN';

  return (
    <View style={styles.container}>
      <LoadingModal visible={loadingModal} text={textLoading} />

      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        isSuccess={modalIsSuccess}
        onClose={() => setModalVisible(false)}
      />

      <ProductListModal
        visible={isProductListVisible}
        onClose={() => setIsProductListVisible(false)}
        products={parsedSaleItems}
        quantityProducts={Number(quantityProducts)}
        totalAmount={totalAmount}
      />

      <PreviewPDF
        base64={pdfBase64 || ""}
        visible={pdfPreviewVisible}
        onClose={() => setPdfPreviewVisible(false)}
        onDownload={handleDownload}
      />

      <Header title="Pagamento" titleStyle={{ fontSize: 27 }} />

          {cashStatus !== 'OPEN' && (
        <View style={styles.cashWarning}>
          <Text style={styles.cashWarningText}>
            {cashLoading ? "Verificando status do caixa..." : "Caixa não está aberto"}
          </Text>
        </View>
      )}
    
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>
            Produtos ({quantityProducts}):
          </Text>
          <TouchableOpacity
            onPress={() => setIsProductListVisible(true)}
            style={styles.fullListButton}
          >
            <FontAwesome name="th-list" size={22} color={Colors.white} />
            <Text style={styles.fullListButtonText}>Lista Completa</Text>
          </TouchableOpacity>
          <Text style={styles.productPrice}>
            Total: R$ {totalAmount.toFixed(2).replace(".", ",")}
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

              {paymentMethod === "Pix" && (
                <PixPayment
                  visible={showPixPayment}
                  onClose={() => setShowPixPayment(false)}
                  onReceiptUpload={(uri) => setReceiptImage(uri)}
                  qrCodeImage={require("@/src/assets/images/QRCODEpagamento.png")}
                />
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
                R$ {totalAmount.toFixed(2).replace(".", ",")}
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
          (!isFormValid || isProcessing || cashStatus !== 'OPEN') && {
            backgroundColor: Colors.gray.dark,
          },
        ]}
        disabled={!isFormValid || isProcessing || cashStatus !== 'OPEN'}
        onPress={handlePayment}
      >
        {isProcessing ? (
          <ActivityIndicator color={Colors.white} />
        ) : cashStatus !== 'OPEN' ? (
          <Text style={styles.paymentButtonText}>Caixa Fechado</Text>
        ) : (
          <Text style={styles.paymentButtonText}>
            {isProcessing ? `Processando${dotText}` : "Confirmar Pagamento"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
