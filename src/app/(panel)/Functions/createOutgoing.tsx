import { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { TextInput } from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import FeedbackModal from "@/src/components/FeedbackModal";
import { styles } from "@/src/styles/functions/createOutgoingStyele";
import LoadingModal from "@/src/components/LoadingModal";
import useCashService from "@/src/hooks/cash/useCashStatus";
import { useOutgoingExpense } from "@/src/hooks/cash/useOutgoingExpense";
import { useLocalSearchParams } from "expo-router/build/hooks";

type PaymentMethod = "Dinheiro" | "Pix" | "";

export default function CreateOutgoing() {
  const params = useLocalSearchParams()
  const { cashId } = params
  const { registerExpense } = useOutgoingExpense();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [textLoading, setTextLoading] = useState("");

  const handleRegisterExpense = async () => {
    if (!paymentMethod) {
      setModalMessage("Selecione um método de pagamento");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    if (!amount) {
      setModalMessage("Informe o valor da despesa");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    if (!cashId) {
      setModalMessage("Nenhum caixa aberto. Abra um caixa para continuar.");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    try {
      setTextLoading("Registrando despesa...");
      setLoadingModal(true);
      console.log(cashId)
      const response = await registerExpense({
        amount: parseFloat(amount.replace(",", ".")),
        method: paymentMethod,
        description,
        openCashId: String(cashId)
      });

      if (response.success) {
        setModalMessage(response.message);
        setModalIsSuccess(true);
        setModalVisible(true);
        
        // Limpar formulário após sucesso
        setAmount("");
        setPaymentMethod("");
        setDescription("");
      } else {
        setModalMessage(response.message);
        setModalIsSuccess(false);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Erro ao registrar despesa:", error);
      setModalMessage(
        typeof error === "string"
          ? error
          : "Erro inesperado ao registrar despesa."
      );
      setModalIsSuccess(false);
      setModalVisible(true);
    } finally {
      setLoadingModal(false);
    }
  };

  const isFormValid = paymentMethod && amount;

  return (
    <View style={styles.container}>
      <LoadingModal visible={loadingModal} text={textLoading} />

      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        isSuccess={modalIsSuccess}
        onClose={() => {
          setModalVisible(false);
          if (modalIsSuccess) {
            router.back();
          }
        }}
      />

      <Header title="Registrar Despesa" titleStyle={{ fontSize: 25 }} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <TextInput
            label="Valor da Despesa"
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            left={<TextInput.Affix text="R$" />}
          />

          <View style={styles.paymentMethodContainer}>
            <Text style={styles.label}>Método de Pagamento:</Text>
            <View style={styles.methodButtons}>
              {(["Dinheiro", "Pix"] as const).map((method) => (
                <Pressable
                  key={method}
                  style={[
                    styles.methodButton,
                    paymentMethod === method && styles.methodButtonSelected,
                  ]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <MaterialIcons
                    name={method === "Dinheiro" ? "attach-money" : "pix"}
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
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.observationContainer}>
            <TextInput
              placeholder="Observação (opcional)"
              value={description}
              style={styles.descriptionInput}
              mode="outlined"
              multiline
              numberOfLines={4}
              maxLength={150}
              onChangeText={setDescription}
              outlineColor="#ddd"
              activeOutlineColor="#002B50"
              dense={true}
            />
            <Text style={styles.characterCount}>{description.length}/150</Text>
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={[
          styles.paymentButton,
          !isFormValid && { backgroundColor: Colors.gray.dark },
        ]}
        disabled={!isFormValid}
        onPress={handleRegisterExpense}
      >
        <Text style={styles.paymentButtonText}>Registrar Despesa</Text>
      </Pressable>
    </View>
  );
}