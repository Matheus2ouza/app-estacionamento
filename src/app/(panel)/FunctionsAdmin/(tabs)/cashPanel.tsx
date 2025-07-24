import CashRegisterModal from "@/src/components/CashRegisterModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import useCashDetails from "@/src/hooks/cash/useCashDetails";
import useCashService from "@/src/hooks/cash/useCashStatus";
import { styles } from "@/src/styles/functions/cashpanelStyle";
import CashStatusModal from "@/src/components/CashStatusModal";
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
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
  const { getStatusCash, openCash, closeCash, openCashId, cashStatus } = useCashService();
  const { generalCashierData, loading, error } = useCashDetails();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cashStatusLoaded, setCashStatusLoaded] = useState(false);

  const [isCloseModalVisible, setIsCloseModalVisible] = useState(false);
  const [isCashClosedModalVisible, setIsCashClosedModalVisible] = useState(false);

  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    message: "",
    isSuccess: false,
    goBack: false,
  });

  const [transactionValues, setTransactionValues] = useState<{
    finalValue: string | '';
    totalValue: number | null;
    valuesEntry: number | null;
    valuesExit: number | null;
    veicles: number | null;
    products: number | null;
  }>({
    finalValue: '',
    totalValue: null,
    valuesEntry: null,
    valuesExit: null,
    veicles: null,
    products: null,
  });

  const fetchCashStatus = async () => {
    await getStatusCash();
    setCashStatusLoaded(true);
  };

  useFocusEffect(
    useCallback(() => {
      setCashStatusLoaded(false);
      fetchCashStatus();
    }, [])
  );

useEffect(() => {
  if (!cashStatusLoaded) return;

  console.log(`O STATUS DO CASHHHH: ${cashStatus}`)

  if (cashStatus === "CLOSED") {
    setIsCashClosedModalVisible(true);
  } else if (openCashId === null) {
    setIsModalVisible(true);
  } else {
    setIsModalVisible(false);
    setIsCashClosedModalVisible(false);
  }
}, [openCashId, cashStatus, cashStatusLoaded]);

  useEffect(() => {
    const fetchCashDetails = async () => {
      if (cashStatusLoaded && openCashId !== null) {
        const data = await generalCashierData(openCashId);
        if (data) {
          setTransactionValues({
            finalValue: String(data.finalValue),
            totalValue: data.totalValue || 0,
            valuesEntry:
              Number(data.generalSaleTotal) + Number(data.vehicleEntryTotal),
            valuesExit: data.outgoingExpenseTotal || 0,
            veicles: data.vehicleEntryTotal || 0,
            products: data.generalSaleTotal || 0,
          });
        }
      }
    };

    fetchCashDetails();
  }, [cashStatusLoaded, openCashId]);

  useEffect(() => {
    if (error) {
      setFeedbackModal({
        visible: true,
        message: error,
        isSuccess: false,
        goBack: false,
      });
    }
  }, [error]);

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
    } finally {
      await getStatusCash();
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

      const { success, message } = await closeCash(openCashId!, parsedValue);

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
    } finally {
      await getStatusCash();
    }
  };

  if (!cashStatusLoaded || loading) {
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

      <CashStatusModal
        visible={isCashClosedModalVisible}
        onClose={() => setIsCashClosedModalVisible(false)}
        onConfirm={() => {
          setIsCashClosedModalVisible(false);
          setIsModalVisible(true);
        }}
      />

      <CashRegisterModal
        visible={isCloseModalVisible}
        mode="open"
        initialValue={transactionValues.finalValue}
        onClose={() => setIsCloseModalVisible(false)}
        onSubmitCashRegister={handleOpenCash}
      />

      <CashRegisterModal
        visible={isCloseModalVisible}
        mode="close"
        initialValue={transactionValues.finalValue}
        onClose={() => setIsCloseModalVisible(false)}
        onSubmitCashRegister={(value) => handleCloseCash(value)}
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
        <View style={styles.previewBalence}>
          <View style={styles.cornerTopLeft} />
          <Text style={styles.totalValue}>{transactionValues.totalValue}</Text>
          <View style={styles.cornerBottomRight} />
        </View>

        <View style={styles.cashierDetails}>
          <View style={styles.entries}>
            <View style={styles.icon}>
              <FontAwesome5
                name="long-arrow-alt-up"
                size={30}
                color={Colors.blueLight}
              />
            </View>
            <View>
              <Text style={[styles.Number, { color: Colors.greenLight }]}>
                $ {transactionValues.valuesEntry}
              </Text>
              <Text style={styles.Label}>Entradas</Text>
            </View>
          </View>

          <View style={styles.exits}>
            <View style={styles.icon}>
              <FontAwesome5
                name="long-arrow-alt-down"
                size={30}
                color={Colors.blueLight}
              />
            </View>
            <View>
              <Text style={[styles.Number, { color: Colors.red }]}>
                $ {transactionValues.valuesExit}
              </Text>
              <Text style={styles.Label}>Saída</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.transactionList}>
            {/* 1. Veículos */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <MaterialCommunityIcons
                  name="car-estate"
                  size={30}
                  color={Colors.blueLight}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Veículos</Text>
                <Text style={styles.transactionSubtitle}>Carro e Moto</Text>
              </View>
              <Text style={styles.transactionValue}>
                {transactionValues.veicles ?? 0}
              </Text>
            </View>

            {/* 2. Produtos */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name="cube-outline"
                  size={30}
                  color={Colors.blueLight}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Produtos diversos</Text>
                <Text style={styles.transactionSubtitle}>Refrigerante...</Text>
              </View>
              <Text style={styles.transactionValue}>
                {transactionValues.products ?? 0}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Fechar Caixa"
              onPress={() => setIsCloseModalVisible(true)}
              style={styles.button}
              disabled={openCashId === null || cashStatus === "CLOSED"}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
