import CashRegisterModal from "@/src/components/CashRegisterModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import useCashDetails from "@/src/hooks/cash/useCashDetails";
import { useCash } from "@/src/context/CashContext";
import { styles } from "@/src/styles/functions/cashpanelStyle";
import CashStatusModal from "@/src/components/CashStatusModal";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  Image,
} from "react-native";

export default function CashPanel() {
  const {
    openCashId,
    cashStatus,
    getStatusCash,
    openCash,
    closeCash,
    reopenCash,
    loading: cashLoading,
    error: cashError,
  } = useCash();

  const {
    generalCashierData,
    loading: detailsLoading,
    error: detailsError,
  } = useCashDetails();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCloseModalVisible, setIsCloseModalVisible] = useState(false);
  const [isCashClosedModalVisible, setIsCashClosedModalVisible] =
    useState(false);

  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    message: "",
    isSuccess: false,
    goBack: false,
  });

  const [transactionValues, setTransactionValues] = useState({
    initialValue: 0,
    finalValue: 0,
    totalValue: 0,
    valuesEntry: 0,
    valuesExit: 0,
    veicles: 0,
    products: 0,
  });

  const formatCurrency = (value: number | null | undefined) => {
    if (
      value === null ||
      value === undefined ||
      typeof value !== "number" ||
      isNaN(value)
    ) {
      return "R$ 0,00";
    }
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  const formatCurrencyNegative = (value: number | null | undefined) => {
    if (
      value === null ||
      value === undefined ||
      typeof value !== "number" ||
      isNaN(value)
    ) {
      return "R$ 0,00";
    }
    return `R$ -${value.toFixed(2).replace(".", ",")}`;
  };

  useFocusEffect(
    useCallback(() => {
      getStatusCash();
    }, [])
  );

  useEffect(() => {
    if (cashStatus === "CLOSED") {
      setIsCashClosedModalVisible(true);
      setIsModalVisible(false);
      setIsCloseModalVisible(false);
    } else if (cashStatus === "NOT_CREATED" || !openCashId) {
      setIsModalVisible(true);
      setIsCashClosedModalVisible(false);
      setIsCloseModalVisible(false);
    } else if (cashStatus === "OPEN") {
      setIsModalVisible(false);
      setIsCashClosedModalVisible(false);
      setIsCloseModalVisible(false);
    }
  }, [cashStatus, openCashId]);

  useEffect(() => {
    const fetchCashDetails = async () => {
      console.log("[CashPanel] Fetching cash details", openCashId);
      if (openCashId) {
        const data = await generalCashierData(openCashId);
        if (data) {
          const safeParse = (value: any): number => {
            if (value === null || value === undefined) return 0;
            const num =
              typeof value === "string" ? parseFloat(value) : Number(value);
            return isNaN(num) ? 0 : num;
          };

          setTransactionValues({
            initialValue: safeParse(data.initial_value),
            finalValue: safeParse(data.final_value),
            totalValue: safeParse(data.totalValue),
            valuesEntry:
              safeParse(data.general_sale_total) +
              safeParse(data.vehicle_entry_total),
            valuesExit: safeParse(data.outgoing_expense_total),
            veicles: safeParse(data.vehicle_entry_total),
            products: safeParse(data.general_sale_total),
          });
        } else {
          setTransactionValues({
            initialValue: 0,
            finalValue: 0,
            totalValue: 0,
            valuesEntry: 0,
            valuesExit: 0,
            veicles: 0,
            products: 0,
          });
        }
      }
    };

    fetchCashDetails();
  }, [openCashId]);

  useEffect(() => {
    if (cashError || detailsError) {
      setFeedbackModal({
        visible: true,
        message: cashError || detailsError || "Erro desconhecido",
        isSuccess: false,
        goBack: false,
      });
    }
  }, [cashError, detailsError]);

  const handleOpenCash = async (initialValue: string) => {
    try {
      const parsedValue = parseFloat(initialValue);

      if (isNaN(parsedValue)) {
        setFeedbackModal({
          visible: true,
          message: "Valor inválido.",
          isSuccess: false,
          goBack: false,
        });
        return;
      }

      const { success, message } = await openCash(parsedValue);

      setFeedbackModal({
        visible: true,
        message,
        isSuccess: success,
        goBack: false,
      });

      if (success) {
        setIsModalVisible(false);
      }
    } catch (err) {
      setFeedbackModal({
        visible: true,
        message: "Não foi possível abrir o caixa.",
        isSuccess: false,
        goBack: false,
      });
      console.error(err);
    }
  };

  const handleCloseCash = async (finalValue: string) => {
    try {
      const parsedValue = parseFloat(finalValue);

      if (isNaN(parsedValue)) {
        setFeedbackModal({
          visible: true,
          message: "Valor inválido.",
          isSuccess: false,
          goBack: false,
        });
        return;
      }

      if (!openCashId) {
        setFeedbackModal({
          visible: true,
          message: "Nenhum caixa aberto para fechar.",
          isSuccess: false,
          goBack: false,
        });
        return;
      }

      const { success, message } = await closeCash(openCashId, parsedValue);

      setFeedbackModal({
        visible: true,
        message,
        isSuccess: success,
        goBack: true,
      });

      if (success) {
        setIsCloseModalVisible(false);
      }
    } catch (err) {
      setFeedbackModal({
        visible: true,
        message: "Erro ao fechar o caixa.",
        isSuccess: false,
        goBack: false,
      });
      console.error(err);
    }
  };

  const handleReopenCash = async () => {
    console.log(openCashId);
    try {
      if (!openCashId) {
        setFeedbackModal({
          visible: true,
          message: "Nenhum caixa selecionado para reabrir.",
          isSuccess: false,
          goBack: false,
        });
        return;
      }

      const { success, message } = await reopenCash(openCashId);

      setFeedbackModal({
        visible: true,
        message,
        isSuccess: success,
        goBack: false,
      });

      if (success) {
        setIsCashClosedModalVisible(false);
      }
    } catch (err) {
      setFeedbackModal({
        visible: true,
        message: "Não foi possível reabrir o caixa.",
        isSuccess: false,
        goBack: false,
      });
      console.error(err);
    }
  };

  if (cashLoading || detailsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("@/src/assets/images/splash-icon-blue.png")}
        style={styles.heroImage}
      />

      {/* Modal para caixa fechado */}
      <CashStatusModal
        visible={isCashClosedModalVisible}
        mode={cashStatus === "CLOSED" ? "CLOSED" : "NOT_CREATED"}
        onClose={() => setIsCashClosedModalVisible(false)}
        onConfirm={handleReopenCash}
      />

      <CashRegisterModal
        visible={isModalVisible}
        mode="open"
        initialValue={transactionValues.finalValue.toString()}
        onClose={() => setIsModalVisible(false)}
        onSubmitCashRegister={handleOpenCash}
      />

      {/* Modal para fechar caixa */}
      <CashRegisterModal
        visible={isCloseModalVisible}
        mode="close"
        initialValue={transactionValues.finalValue.toString()}
        onClose={() => setIsCloseModalVisible(false)}
        onSubmitCashRegister={handleCloseCash}
      />

      <FeedbackModal
        visible={feedbackModal.visible}
        message={feedbackModal.message}
        isSuccess={feedbackModal.isSuccess}
        onClose={() => setFeedbackModal({ ...feedbackModal, visible: false })}
      />

      <Header
        title="Caixa"
        onBackPress={() => router.push("/Config/configAdmin")}
      />

      <View style={styles.container}>
        {/* Balanço total */}
        <View style={styles.previewBalence}>
          <View style={styles.cornerTopLeft} />
          <Text style={styles.totalValue}>
            {formatCurrency(transactionValues.finalValue)}
          </Text>
          <View style={styles.cornerBottomRight} />
        </View>

        {/* Entradas e Saídas */}
        <View style={styles.cashierDetails}>
          <View style={styles.entries}>
            <View style={styles.icon}>
              <FontAwesome5
                name="long-arrow-alt-up"
                size={30}
                color={Colors.green[500]}
              />
            </View>
            <View>
              <Text style={[styles.Number, { color: Colors.green[500] }]}>
                {formatCurrency(transactionValues.valuesEntry)}
              </Text>
              <Text style={styles.Label}>Entradas</Text>
            </View>
          </View>

          <View style={styles.exits}>
            <View style={styles.icon}>
              <FontAwesome5
                name="long-arrow-alt-down"
                size={30}
                color={Colors.red[500]}
              />
            </View>
            <View>
              <Text style={[styles.Number, { color: Colors.red[500] }]}>
                {formatCurrency(transactionValues.valuesExit)}
              </Text>
              <Text style={styles.Label}>Saídas</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.transactionList}>
            {/* Valor de entrada */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <MaterialCommunityIcons
                  name="cash-check"
                  size={30}
                  color={Colors.blue.light}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Entrada</Text>
                <Text style={styles.transactionSubtitle}>
                  Valor de entrada do caixa
                </Text>
              </View>
              <Text
                style={
                  transactionValues.initialValue === 0
                    ? styles.transactionValueSNeutral
                    : styles.transactionValue
                }
              >
                {formatCurrency(transactionValues.initialValue)}
              </Text>
            </View>

            {/* Veículos */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <MaterialCommunityIcons
                  name="car-estate"
                  size={30}
                  color={Colors.blue.light}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Veículos</Text>
                <Text style={styles.transactionSubtitle}>Carro e Moto</Text>
              </View>
              <Text
                style={
                  transactionValues.veicles === 0
                    ? styles.transactionValueSNeutral
                    : styles.transactionValue
                }
              >
                {formatCurrency(transactionValues.veicles)}
              </Text>
            </View>

            {/* Produtos */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name="cube-outline"
                  size={30}
                  color={Colors.blue.light}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Produtos diversos</Text>
                <Text style={styles.transactionSubtitle}>Refrigerante...</Text>
              </View>
              <Text
                style={
                  transactionValues.products === 0
                    ? styles.transactionValueSNeutral
                    : styles.transactionValue
                }
              >
                {formatCurrency(transactionValues.products)}
              </Text>
            </View>

            {/* Despesas */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <MaterialCommunityIcons
                  name="cash-minus"
                  size={30}
                  color={Colors.blue.light}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Despesas</Text>
                <Text style={styles.transactionSubtitle}>gastos no geral</Text>
              </View>
              <Text
                style={
                  transactionValues.valuesExit === 0
                    ? styles.transactionValueSNeutral
                    : styles.transactionValue
                }
              >
                {formatCurrencyNegative(transactionValues.valuesExit)}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={
                cashStatus === "OPEN"
                  ? "Fechar Caixa"
                  : cashStatus === "CLOSED"
                  ? "Reabrir Caixa"
                  : "Abrir Caixa"
              }
              onPress={() => {
                if (cashStatus === "OPEN") {
                  // Se caixa está aberto, mostra modal de fechamento
                  setIsCloseModalVisible(true);
                } else if (cashStatus === "CLOSED") {
                  // Se caixa está fechado, tenta reabrir diretamente
                  handleReopenCash();
                } else {
                  // Se caixa não existe/não criado, mostra modal de abertura
                  setIsModalVisible(true);
                }
              }}
              style={styles.button}
              disabled={cashLoading || detailsLoading}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
