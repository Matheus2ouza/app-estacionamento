import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import { useCashContext } from "@/src/context/CashContext";
import { useExpenses } from "@/src/hooks/expense/useExpenses";
import { styles } from "@/src/styles/functions/expenseRecordStyles";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const PAYMENT_METHODS = [
  { 
    id: "dinheiro", 
    label: "Dinheiro", 
    icon: { library: "MaterialIcons", name: "payments" },
    color: Colors.green[500],
    backgroundColor: Colors.green[50],
    borderColor: Colors.green[200],
  },
  { 
    id: "pix", 
    label: "PIX", 
    icon: { library: "MaterialIcons", name: "qr-code" },
    color: Colors.blue[500],
    backgroundColor: Colors.blue[50],
    borderColor: Colors.blue[200],
  },
  { 
    id: "debito", 
    label: "Débito", 
    icon: { library: "MaterialIcons", name: "credit-card" },
    color: Colors.orange[500],
    backgroundColor: Colors.orange[50],
    borderColor: Colors.orange[200],
  },
  { 
    id: "credito", 
    label: "Crédito", 
    icon: { library: "MaterialIcons", name: "credit-card" },
    color: Colors.purple[500],
    backgroundColor: Colors.purple[50],
    borderColor: Colors.purple[200],
  },
];

export default function ExpenseRecord() {
  const params = useLocalSearchParams();
  const isEditMode = params.expenseId && params.expenseData;
  const expenseId = params.expenseId as string;
  const expenseData = params.expenseData ? JSON.parse(params.expenseData as string) : null;

  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const { cashData } = useCashContext();
  const { createExpense, updateExpense, loading, success, error, message } = useExpenses(cashData?.id || "");

  // Pré-preencher formulário se estiver em modo de edição (apenas uma vez)
  useEffect(() => {
    if (isEditMode && expenseData) {
      setDescription(expenseData.description || "");
      setAmount(expenseData.amount ? expenseData.amount.toString().replace('.', ',') : "");
      setSelectedPaymentMethod(expenseData.method?.toLowerCase() || "");
    }
  }, [isEditMode]); // Removido expenseData das dependências

  // Monitorar mudanças no hook
  useEffect(() => {
    if (success && message) {
      setFeedbackMessage(message);
      setFeedbackType('success');
      setFeedbackVisible(true);
      
      // Limpar formulário apenas se não estiver em modo de edição
      if (!isEditMode) {
        setDescription("");
        setAmount("");
        setSelectedPaymentMethod("");
      }
      
      // Navegar de volta após 2 segundos
      setTimeout(() => {
        router.back();
      }, 2000);
    }
    
    if (error) {
      setFeedbackMessage(error);
      setFeedbackType('error');
      setFeedbackVisible(true);
    }
  }, [success, error, message, isEditMode]);

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

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
  const handleAmountChange = (text: string) => {
    // Remove caracteres não numéricos exceto vírgula
    const cleanText = text.replace(/[^0-9,]/g, '');
    // Garante que só há uma vírgula
    const parts = cleanText.split(',');
    if (parts.length > 2) {
      setAmount(parts[0] + ',' + parts.slice(1).join(''));
    } else {
      setAmount(cleanText);
    }
  };

  // Função para renderizar ícones de diferentes bibliotecas
  const renderIcon = (iconConfig: { library: string; name: string }, size: number, color: string) => {
    switch (iconConfig.library) {
      case "MaterialIcons":
        return <MaterialIcons name={iconConfig.name as any} size={size} color={color} />;
      case "Ionicons":
        return <MaterialIcons name="help" size={size} color={color} />;
      case "AntDesign":
        return <AntDesign name={iconConfig.name as any} size={size} color={color} />;
      default:
        return <MaterialIcons name="help" size={size} color={color} />;
    }
  };

  // Funções
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  // Função para validar se o formulário está correto
  const isFormValid = () => {
    if (!description.trim()) return false;
    if (!amount || parseBrazilianNumber(amount) <= 0) return false;
    if (!selectedPaymentMethod) return false;
    return true;
  };

  const handleConfirmExpense = async () => {
    if (!description.trim()) {
      showFeedback("Preencha a descrição da despesa", "warning");
      return;
    }

    if (!amount || parseBrazilianNumber(amount) <= 0) {
      showFeedback("Preencha o valor da despesa", "warning");
      return;
    }

    if (!selectedPaymentMethod) {
      showFeedback("Selecione um método de pagamento", "warning");
      return;
    }

    // Preparar dados para a API
    const expenseData = {
      cashId: cashData?.id || "",
      description: description.trim(),
      amount: parseBrazilianNumber(amount),
      method: selectedPaymentMethod.toUpperCase() as "DINHEIRO" | "PIX" | "CREDITO" | "DEBITO"
    };

    console.log("🚀 [ExpenseRecord] Dados da despesa para", isEditMode ? "atualização" : "registro", ":", expenseData);
    
    // Chamar a função do hook para criar ou atualizar a despesa
    if (isEditMode && expenseId) {
      await updateExpense(expenseId, expenseData);
    } else {
      await createExpense(expenseData);
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
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={isEditMode ? "Editar Despesa" : "Registro de Despesas"} />
      
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
          {/* Card de Informações da Despesa */}
          <View style={styles.expenseInfoCard}>
            <View style={styles.expenseHeader}>
              <View style={styles.expenseIcon}>
                <MaterialIcons name="receipt-long" size={32} color={Colors.white} />
              </View>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>{isEditMode ? "Editar Despesa" : "Nova Despesa"}</Text>
                <Text style={styles.expenseSubtitle}>
                  {isEditMode ? "Modifique os dados da despesa" : "Registre uma nova despesa do caixa"}
                </Text>
              </View>
            </View>
          </View>

          {/* Seção de Dados da Despesa */}
          <View style={styles.dataSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="edit" size={24} color={Colors.blue[600]} />
              <Text style={styles.sectionTitle}>Dados da Despesa</Text>
            </View>
            
            <View style={styles.dataCard}>
              {/* Campo Descrição */}
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <MaterialIcons name="description" size={18} color={Colors.gray[500]} />
                  <Text style={styles.inputLabel}>Descrição</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Ex: Combustível, Manutenção, Material de escritório..."
                  placeholderTextColor={Colors.gray[400]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  editable={!loading}
                />
              </View>

              {/* Campo Valor */}
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <MaterialIcons name="attach-money" size={18} color={Colors.gray[500]} />
                  <Text style={styles.inputLabel}>Valor</Text>
                </View>
                <View style={styles.valueInputWrapper}>
                  <Text style={styles.currencySymbol}>R$</Text>
                  <TextInput
                    style={styles.valueInput}
                    value={amount}
                    onChangeText={handleAmountChange}
                    placeholder="0,00"
                    placeholderTextColor={Colors.gray[400]}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
                {amount && parseBrazilianNumber(amount) > 0 && (
                  <Text style={styles.valuePreview}>
                    {formatBrazilianCurrency(parseBrazilianNumber(amount))}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Métodos de Pagamento */}
          <View style={styles.paymentSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="payment" size={24} color={Colors.blue[600]} />
              <Text style={styles.sectionTitle}>Método de Retirada</Text>
            </View>
            <View style={styles.paymentMethodsContainer}>
              {PAYMENT_METHODS.map(renderPaymentMethod)}
            </View>
          </View>

          {/* Botão de Confirmação */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={loading ? (isEditMode ? "Atualizando..." : "Registrando...") : (isEditMode ? "Atualizar Despesa" : "Registrar Despesa")}
              onPress={handleConfirmExpense}
              style={styles.confirmButton}
              disabled={loading || !isFormValid()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>


      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setFeedbackVisible(false)}
        dismissible={true}
      />
    </View>
  );
}