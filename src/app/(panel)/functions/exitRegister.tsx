import FeedbackModal from "@/components/FeedbackModal";
import GenericConfirmationModal from "@/components/GenericConfirmationModal";
import Header from "@/components/Header";
import PDFViewer from "@/components/PDFViewer";
import { PrimaryButton } from "@/components/PrimaryButton";
import QRCodeReceipt from "@/components/QRCodeReceipt";
import VehicleExitDetailsModal from "@/components/VehicleExitDetailsModal";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useCashContext } from "@/context/CashContext";
import { useRoleNavigation } from "@/hooks/auth/useRoleNavigation";
import { useExitVehicle } from "@/hooks/vehicleFlow/useExitVehicle";
import { styles } from "@/styles/functions/exitStyle";
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PAYMENT_METHODS = [
  { 
    id: "dinheiro", 
    label: "Dinheiro", 
    icon: { library: "MaterialIcons", name: "payments" },
    color: Colors.green[500],
    backgroundColor: Colors.green[50],
    borderColor: Colors.green[200],
    description: "Pagamento em espécie"
  },
  { 
    id: "pix", 
    label: "PIX", 
    icon: { library: "MaterialIcons", name: "qr-code" },
    color: Colors.blue[500],
    backgroundColor: Colors.blue[50],
    borderColor: Colors.blue[200],
    description: "Transferência instantânea"
  },
  { 
    id: "debito", 
    label: "Débito", 
    icon: { library: "MaterialIcons", name: "credit-card" },
    color: Colors.orange[500],
    backgroundColor: Colors.orange[50],
    borderColor: Colors.orange[200],
    description: "Cartão de débito"
  },
  { 
    id: "credito", 
    label: "Crédito", 
    icon: { library: "MaterialIcons", name: "credit-card" },
    color: Colors.purple[500],
    backgroundColor: Colors.purple[50],
    borderColor: Colors.purple[200],
    description: "Cartão de crédito"
  },
];

export default function ExitRegister() {
  const { exitData } = useLocalSearchParams();
  const { registerExit, loading, error, success, message } = useExitVehicle();
  
  // Parse dos dados do veículo recebidos via parâmetros
  const vehicle = exitData ? JSON.parse(exitData as string) : {
    id: "1",
    plate: "ABC-1234",
    category: "Carro",
    entryTime: new Date().toISOString(),
    permanenceTime: "2h 30min",
    calculatedAmount: 15.50,
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [discount, setDiscount] = useState<string>("0");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [pixModalVisible, setPixModalVisible] = useState(false);
  const [pixReceiptPhoto, setPixReceiptPhoto] = useState<string | null>(null);
  const [showPhotoConfirmation, setShowPhotoConfirmation] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);

  const { cashData } = useCashContext();
  const { role } = useAuth();
  const { redirectToRoleRoute } = useRoleNavigation();

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  // Monitorar erros do hook useExitVehicle
  useEffect(() => {
    if (error) {
      showFeedback(error, "error");
    }
  }, [error]);

  // Funções para converter vírgula para ponto (para cálculos)
  const parseBrazilianNumber = (value: string) => {
    if (!value || value === '') return 0;
    // Remove espaços e converte vírgula para ponto
    const cleanValue = value.replace(/\s/g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  // Função para formatar número com vírgula (para exibição)
  const formatBrazilianNumber = (value: number) => {
    // Se o valor for 0 ou muito próximo de 0, retorna "0,00"
    if (Math.abs(value) < 0.01) return "0,00";
    // Se o valor for negativo, mantém o sinal
    return value.toFixed(2).replace('.', ',');
  };

  // Função para formatar valor monetário brasileiro
  const formatBrazilianCurrency = (value: number) => {
    return `R$ ${formatBrazilianNumber(value)}`;
  };

  // Função para formatar input do usuário (permite vírgula)
  const handleDiscountChange = (text: string) => {
    // Remove caracteres não numéricos exceto vírgula
    const cleanText = text.replace(/[^0-9,]/g, '');
    // Garante que só há uma vírgula
    const parts = cleanText.split(',');
    if (parts.length > 2) {
      setDiscount(parts[0] + ',' + parts.slice(1).join(''));
    } else {
      setDiscount(cleanText);
    }
  };

  const handleReceivedAmountChange = (text: string) => {
    // Remove caracteres não numéricos exceto vírgula
    const cleanText = text.replace(/[^0-9,]/g, '');
    // Garante que só há uma vírgula
    const parts = cleanText.split(',');
    if (parts.length > 2) {
      setReceivedAmount(parts[0] + ',' + parts.slice(1).join(''));
    } else {
      setReceivedAmount(cleanText);
    }
  };

  // Cálculos
  const amountToPay = vehicle.calculatedAmount || 0;
  const discountValue = parseBrazilianNumber(discount);
  const receivedValue = parseBrazilianNumber(receivedAmount);
  const finalAmount = amountToPay - discountValue;
  const change = receivedValue - finalAmount;


  // Função para renderizar ícones de diferentes bibliotecas
  const renderIcon = (iconConfig: { library: string; name: string }, size: number, color: string) => {
    switch (iconConfig.library) {
      case "MaterialIcons":
        return <MaterialIcons name={iconConfig.name as any} size={size} color={color} />;
      case "Ionicons":
        return <Ionicons name={iconConfig.name as any} size={size} color={color} />;
      case "AntDesign":
        return <AntDesign name={iconConfig.name as any} size={size} color={color} />;
      case "FontAwesome":
      default:
        return <FontAwesome name={iconConfig.name as any} size={size} color={color} />;
    }
  };

  // Funções
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    
    // Se PIX for selecionado, abre o modal
    if (methodId === "pix") {
      setPixModalVisible(true);
    }
  };

  const handleViewDetails = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handlePixReceiptCaptured = (photoUri: string) => {
    setPixReceiptPhoto(photoUri);
  };

  const handlePixReceiptRemoved = () => {
    setPixReceiptPhoto(null);
  };

  const handlePixReceiptConfirmed = (photoUri: string) => {
    setPixReceiptPhoto(photoUri);
    setPixModalVisible(false);
  };

  const handleClosePixModal = () => {
    if (pixReceiptPhoto) {
      setShowPhotoConfirmation(true);
    } else {
      setPixModalVisible(false);
    }
  };

  const handleConfirmPhotoUse = () => {
    setShowPhotoConfirmation(false);
    setPixModalVisible(false);
  };

  const handleDiscardPhoto = () => {
    setPixReceiptPhoto(null);
    setShowPhotoConfirmation(false);
    setPixModalVisible(false);
  };

  const handleClosePdf = () => {
    setPdfVisible(false);
    setPdfData(null);
    // Navegar para o home baseado no role do usuário
    redirectToRoleRoute("/home");
  };

  const handlePdfSuccess = (message: string) => {
    showFeedback(message, "success");
  };

  const handlePdfError = (error: string) => {
    showFeedback(error, "error");
  };

  // Função para validar se o pagamento está correto
  const isPaymentValid = () => {
    if (!selectedPaymentMethod) return false;
    if (!receivedAmount || receivedValue <= 0) return false;
    // Valor recebido deve ser pelo menos o valor final (com desconto aplicado)
    if (receivedValue < finalAmount) return false;
    if (selectedPaymentMethod === "pix" && !pixReceiptPhoto) return false;
    return true;
  };

  const handleConfirmExit = async () => {
    if (!selectedPaymentMethod) {
      showFeedback("Selecione um método de pagamento", "warning");
      return;
    }

    if (!receivedAmount || receivedValue <= 0) {
      showFeedback("Preencha o valor recebido", "warning");
      return;
    }

    if (receivedValue < finalAmount) {
      showFeedback(`Valor recebido deve ser pelo menos ${formatBrazilianCurrency(finalAmount)}`, "warning");
      return;
    }

    if (selectedPaymentMethod === "pix" && !pixReceiptPhoto) {
      showFeedback("É necessário tirar uma foto do comprovante PIX", "warning");
      return;
    }

    try {
      // Preparar dados para a API
      const exitData = {
        cashId: cashData?.id || "",
        vehicleId: vehicle.id,
        amountReceived: receivedValue,
        changeGiven: change,
        discountAmount: discountValue,
        finalAmount: finalAmount,
        originalAmount: amountToPay,
        method: selectedPaymentMethod.toUpperCase() as "DINHEIRO" | "PIX" | "CREDITO" | "DEBITO",
        photo: selectedPaymentMethod === "pix" ? pixReceiptPhoto : null
      };

      console.log("🚀 [ExitRegister] Dados do veículo para registro:", exitData); 
      const result = await registerExit(exitData);
      
      if (result.success) {
        // Se há dados do PDF, mostrar o PDF
        if (result.data) {
          setPdfData(result.data);
          setPdfVisible(true);
        } else {
          // Se não há PDF, mostrar feedback e navegar
          showFeedback("Saída registrada com sucesso!", "success");
          setTimeout(() => {
            router.push('/functions/exitRegister')
          }, 1500);
        }
      } else {
        showFeedback(result.message || "Erro ao registrar saída. Tente novamente.", "error");
      }
    } catch (error) {
      console.error("Erro ao registrar saída:", error);
      showFeedback("Erro ao registrar saída. Tente novamente.", "error");
    }
  };

  const renderPaymentMethod = (method: typeof PAYMENT_METHODS[0]) => {
    const isSelected = selectedPaymentMethod === method.id;
    
    return (
      <TouchableOpacity
        key={method.id}
        style={[
          styles.paymentMethodCard,
          isSelected && {
            ...styles.paymentMethodCardSelected,
            borderColor: method.color,
            backgroundColor: method.backgroundColor
          }
        ]}
        onPress={() => handlePaymentMethodSelect(method.id)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <View style={styles.paymentMethodHeader}>
          <View style={[
            styles.paymentMethodIcon, 
            { backgroundColor: isSelected ? method.color : Colors.gray[300] }
          ]}>
            {renderIcon(method.icon, 24, Colors.white)}
          </View>
          
          {isSelected && (
            <View style={styles.paymentMethodCheckmark}>
              <AntDesign name="checkcircle" size={20} color={method.color} />
            </View>
          )}
        </View>
        
        <View style={styles.paymentMethodContent}>
          <Text style={[
            styles.paymentMethodLabel,
            isSelected && { color: method.color }
          ]}>
            {method.label}
          </Text>
          <Text style={[
            styles.paymentMethodDescription,
            isSelected && { color: method.color }
          ]}>
            {method.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Registro de Saída" />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Informações do Veículo */}
          <Pressable style={styles.vehicleInfoCard} onPress={handleViewDetails}>
            <View style={styles.vehicleHeader}>
              <View style={styles.vehicleIcon}>
                <MaterialIcons name="directions-car" size={32} color={Colors.white} />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehiclePlate}>{vehicle.plate}</Text>
                <View style={styles.timeContainer}>
                  <MaterialIcons name="schedule" size={16} color={Colors.gray[600]} />
                  <Text style={styles.vehicleTimeLabel}>Permanência:</Text>
                </View>
                <Text style={styles.vehicleTime}>{vehicle.permanenceTime || 'N/A'}</Text>
              </View>
              <View style={styles.viewDetailsButton}>
                <MaterialIcons name="info-outline" size={24} color={Colors.blue[600]} />
                <Text style={styles.viewDetailsText}>Ver Detalhes</Text>
              </View>
            </View>
          </Pressable>

          {/* Valores */}
          <View style={styles.valuesSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="calculate" size={24} color={Colors.blue[600]} />
              <Text style={styles.sectionTitle}>Valores</Text>
            </View>
            
            <View style={styles.valueCard}>
              <View style={styles.valueRow}>
                <View style={styles.valueLabelContainer}>
                  <MaterialIcons name="receipt" size={18} color={Colors.gray[500]} />
                  <Text style={styles.valueLabel}>Valor a Pagar</Text>
                </View>
                <Text style={styles.valueAmount}>{formatBrazilianCurrency(amountToPay)}</Text>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.valueLabelContainer}>
                  <MaterialIcons name="percent" size={18} color={Colors.gray[500]} />
                  <Text style={styles.inputLabel}>Desconto</Text>
                </View>
                <TextInput
                  style={styles.valueInput}
                  value={discount}
                  onChangeText={handleDiscountChange}
                  placeholder="0,00"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={styles.valueLabelContainer}>
                  <MaterialIcons name="payments" size={18} color={Colors.gray[500]} />
                  <Text style={styles.inputLabel}>Valor Recebido</Text>
                </View>
                <TextInput
                  style={styles.valueInput}
                  value={receivedAmount}
                  onChangeText={handleReceivedAmountChange}
                  placeholder="0,00"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <View style={[styles.valueRow, styles.finalValueRow]}>
                <View style={styles.valueLabelContainer}>
                  <AntDesign name="checkcircle" size={18} color={Colors.blue[600]} />
                  <Text style={styles.finalValueLabel}>Valor Final</Text>
                </View>
                <Text style={[styles.valueAmount, styles.finalAmount]}>
                  {formatBrazilianCurrency(finalAmount)}
                </Text>
              </View>

              {receivedValue > 0 && (
                <View style={[styles.valueRow, styles.changeRow]}>
                  <View style={styles.valueLabelContainer}>
                    <MaterialIcons 
                      name="monetization-on" 
                      size={18} 
                      color={Colors.green[600]} 
                    />
                    <Text style={styles.valueLabel}>Troco</Text>
                  </View>
                  <Text style={[styles.valueAmount, styles.positiveChange]}>
                    {formatBrazilianCurrency(change)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Métodos de Pagamento */}
          <View style={styles.paymentSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="payment" size={24} color={Colors.blue[600]} />
              <Text style={styles.sectionTitle}>Método de Pagamento</Text>
            </View>
            <View style={styles.paymentMethodsContainer}>
              {PAYMENT_METHODS.map(renderPaymentMethod)}
            </View>
          </View>

          {/* Botão de Confirmação */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={loading ? "Processando..." : "Confirmar Saída"}
              onPress={handleConfirmExit}
              style={styles.confirmButton}
              disabled={loading || !isPaymentValid()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal PIX - QR Code e Comprovante */}
      <Modal
        visible={pixModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pagamento PIX</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClosePixModal}
            >
              <Ionicons name="close" size={32} color={Colors.white} />
            </TouchableOpacity>
          </View>
          
          <QRCodeReceipt
            onPhotoCaptured={handlePixReceiptCaptured}
            onPhotoRemoved={handlePixReceiptRemoved}
            onPhotoConfirmed={handlePixReceiptConfirmed}
            initialPhotoUri={pixReceiptPhoto || undefined}
            disabled={loading}
          />
        </View>
      </Modal>

      {/* Modal de Detalhes do Veículo */}
      <VehicleExitDetailsModal
        visible={modalVisible}
        onClose={handleCloseModal}
        vehicle={vehicle}
        calculatedAmount={amountToPay}
      />

      {/* Modal de Confirmação da Foto */}
      <GenericConfirmationModal
        visible={showPhotoConfirmation}
        title="Confirmar Foto"
        message="Deseja usar esta foto do comprovante PIX ou descartar?"
        confirmText="Usar Foto"
        cancelText="Descartar"
        confirmButtonStyle="success"
        onConfirm={handleConfirmPhotoUse}
        onCancel={handleDiscardPhoto}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setFeedbackVisible(false)}
        dismissible={true}
      />

      {/* PDF Viewer Modal */}
      {pdfData && (
        <PDFViewer
          base64={pdfData}
          visible={pdfVisible}
          onClose={handleClosePdf}
          filename={`comprovante-saida-${vehicle.plate}-${new Date().toISOString().split('T')[0]}.pdf`}
          onSuccess={handlePdfSuccess}
          onError={handlePdfError}
        />
      )}
    </View>
  );
}