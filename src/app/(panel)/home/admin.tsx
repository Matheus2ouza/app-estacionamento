import { useCallback, useState } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { ReactNode } from "react";

import Colors from "@/src/constants/Colors";
import { styles } from "@/src/styles/home/adminHomeStyles";
import Separator from "@/src/components/Separator";
import CashRegisterModal from "@/src/components/CashRegisterModal";
import CashStatusModal from "@/src/components/CashStatusModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import LoadingModal from "@/src/components/LoadingModal";
import useCashService from "@/src/hooks/cash/useCashStatus";
import useCashDetails from "@/src/hooks/cash/useCashDetails";
import { router } from "expo-router";

type CashData = {
  "Valor Inicial": number;
  Dinheiro: number;
  Cartão: number;
  Pix: number;
  Saída: number;
  Total: number;
};

type ParkingStatus = {
  free: number;
  used: number;
  details: [number, number]; // [carros, motos]
};

type ModalState = {
  openCashModal: boolean;
  closedCashModal: boolean;
  loading: boolean;
  loadingText: string;
  feedback: {
    visible: boolean;
    message: string;
    isSuccess: boolean;
  };
};

export default function AdminHome() {
  // Services
  const { getStatusCash, openCash, openCashId, cashStatus } = useCashService();
  const { dataToHome, parkingToHome } = useCashDetails();

  // State
  const [modals, setModals] = useState<ModalState>({
    openCashModal: false,
    closedCashModal: false,
    loading: false,
    loadingText: "",
    feedback: { visible: false, message: "", isSuccess: false },
  });

  const [cashData, setCashData] = useState<CashData>({
    "Valor Inicial": 0,
    Dinheiro: 0,
    Cartão: 0,
    Pix: 0,
    Saída: 0,
    Total: 0,
  });

  const [parkingStatus, setParkingStatus] = useState<ParkingStatus>({
    free: 0,
    used: 0,
    details: [0, 0],
  });

  // Converter dados de estacionamento
  const convertParkingData = (data: any): ParkingStatus => {
    if (!data) {
      return { free: 0, used: 0, details: [0, 0] };
    }

    // Soma o total de vagas livres
    const totalFree = data.carVacancies + data.motorcycleVacancies;
    console.log(totalFree)
    return {
      free: totalFree,
      used: data.totalCarsInside + data.totalMotosInside,
      details: [data.totalCarsInside, data.totalMotosInside],
    };
  };

  // Buscar dados do caixa
  const fetchCashData = useCallback(async () => {
    if (!openCashId) return;

    try {
      const data = await dataToHome(openCashId);
      if (data) {
        setCashData({
          "Valor Inicial": data.initialValue,
          Dinheiro: data.totalCash,
          Cartão: data.totalCredit + data.totalDebit,
          Pix: data.totalPix,
          Saída: data.outgoingExpenseTotal,
          Total: data.finalValue,
        });
      }
    } catch (err) {
      console.error("Erro ao buscar dados do caixa:", err);
      showFeedback("Erro ao carregar dados do caixa", false);
    }
  }, [openCashId]);

  // Buscar dados de estacionamento
  const fetchParkingStatus = useCallback(async () => {
    try {
      const parkingData = await parkingToHome();
      console.log(parkingData)
      if (parkingData) {
        setParkingStatus(convertParkingData(parkingData));
      }
    } catch (err) {
      console.error("Erro ao buscar status das vagas:", err);
      showFeedback("Erro ao carregar dados das vagas", false);
    }
  }, []);

  // Verificar status do caixa
  const checkCashStatus = useCallback(async () => {
    try {
      await getStatusCash();

      if (cashStatus === "CLOSED") {
        setModals((prev) => ({ ...prev, closedCashModal: true }));
      } else if (!openCashId) {
        setModals((prev) => ({ ...prev, openCashModal: true }));
      } else {
        await fetchCashData();
        setModals((prev) => ({
          ...prev,
          openCashModal: false,
          closedCashModal: false,
        }));
      }
    } catch (error) {
      console.error("Erro ao verificar status do caixa:", error);
      showFeedback("Erro ao verificar status do caixa", false);
    }
  }, [cashStatus, openCashId, fetchCashData]);

  // Abrir caixa
  const handleOpenCash = async (initialValue: string) => {
    const parsedValue = parseFloat(initialValue);

    if (isNaN(parsedValue)) {
      return showFeedback("Valor inválido", false);
    }

    setLoading("Abrindo caixa...");

    try {
      const { success, message } = await openCash(parsedValue);
      showFeedback(message, success);

      if (success) {
        setModals((prev) => ({ ...prev, openCashModal: false }));
        await checkCashStatus();
      }
    } catch (err) {
      console.error(err);
      showFeedback("Erro ao abrir o caixa", false);
    } finally {
      setLoading(false);
    }
  };

  // Helpers de UI
  const showFeedback = (message: string, isSuccess: boolean) => {
    setModals((prev) => ({
      ...prev,
      feedback: { visible: true, message, isSuccess },
    }));
  };

  const setLoading = (loadingText: string | false) => {
    setModals((prev) => ({
      ...prev,
      loading: loadingText !== false,
      loadingText: loadingText || "",
    }));
  };

  // Atualizar somente os dados do caixa
  const handleRefreshCash = async () => {
    setLoading("Atualizando dados do caixa...");
    try {
      await checkCashStatus();
    } catch (error) {
      console.error("Erro ao atualizar caixa:", error);
      showFeedback("Erro ao atualizar dados do caixa", false);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar somente os dados das vagas
  const handleRefreshParking = async () => {
    setLoading("Atualizando dados das vagas...");
    try {
      await fetchParkingStatus();
    } catch (error) {
      console.error("Erro ao atualizar vagas:", error);
      showFeedback("Erro ao atualizar dados das vagas", false);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar todos os dados
  const handleRefreshAll = async () => {
    setLoading("Atualizando dados...");
    try {
      await Promise.all([checkCashStatus(), fetchParkingStatus()]);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      showFeedback("Erro ao atualizar dados", false);
    } finally {
      setLoading(false);
    }
  };

  // Efeitos
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        if (!isActive) return;
        setLoading("Carregando dados...");
        try {
          await handleRefreshAll();
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      loadData();
      return () => {
        isActive = false;
      };
    }, [checkCashStatus, fetchParkingStatus])
  );

  // Componentes de renderização
  const renderCashRow = (label: string, value: number) => (
    <View key={label} style={styles.cashRow}>
      <Text style={styles.cashLabel}>{label}</Text>
      <View style={styles.dottedLine} />
      <Text style={styles.cashValue}>R$ {value.toFixed(2)}</Text>
    </View>
  );

  const renderParkingIcon = (icon: ReactNode, value: number) => (
    <View style={styles.iconDescriptionRow}>
      {icon}
      <Text style={styles.iconText}>{value}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Modals */}
      <LoadingModal visible={modals.loading} text={modals.loadingText} />

      <CashStatusModal
        visible={modals.closedCashModal}
        onClose={() => setModals((prev) => ({ ...prev, closedCashModal: false }))}
        onConfirm={() =>
          setModals((prev) => ({ ...prev, closedCashModal: false, openCashModal: true }))
        }
      />

      <CashRegisterModal
        visible={modals.openCashModal}
        mode="open"
        onClose={() => setModals((prev) => ({ ...prev, openCashModal: false }))}
        onSubmitCashRegister={handleOpenCash}
      />

      <FeedbackModal
        visible={modals.feedback.visible}
        message={modals.feedback.message}
        isSuccess={modals.feedback.isSuccess}
        onClose={() =>
          setModals((prev) => ({
            ...prev,
            feedback: { ...prev.feedback, visible: false },
          }))
        }
      />

      {/* Header */}
      <LinearGradient colors={[Colors.gray.zinc, Colors.blue.light]} style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandMain}>LEÃO</Text>
          <Text style={styles.brandSub}>Estacionamento</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/Config/config")}>
          <View style={styles.iconCircle}>
            <AntDesign name="user" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Conteúdo principal */}
      <View style={styles.body}>
        {/* Caixa */}
        <View style={styles.cashBox}>
          <View style={styles.BoxHeader}>
            <Text style={styles.title}>Caixa</Text>
            <Pressable onPress={handleRefreshCash}>
              <View style={styles.refreshIcon}>
                <FontAwesome name="refresh" size={24} color={Colors.white} />
              </View>
            </Pressable>
          </View>
          <Separator style={{ width: "90%" }} />
          <View style={styles.cashContent}>
            {Object.entries(cashData).map(([label, value]) => renderCashRow(label, value))}
          </View>
        </View>

        {/* Vagas */}
        <View style={styles.parkingStatus}>
          <View style={styles.BoxHeader}>
            <Text style={styles.title}>Vagas</Text>
            <Pressable onPress={handleRefreshParking}>
              <View style={styles.refreshIcon}>
                <FontAwesome name="refresh" size={24} color={Colors.white} />
              </View>
            </Pressable>
          </View>
          <Separator style={{ width: "90%" }} />
          <View style={styles.parkingContent}>
            <View style={styles.statusParking}>
              <View style={styles.freeParking}>
                <Text style={styles.numberFree}>{parkingStatus.free}</Text>
                <Text style={styles.labelFree}>Livres</Text>
              </View>
              <View style={styles.dividerVertical} />
              <View style={styles.usedParking}>
                <Text style={styles.numberUsed}>{parkingStatus.used}</Text>
                <Text style={styles.labelUsed}>Em uso</Text>
              </View>
            </View>
            <Separator style={{ width: "90%", alignSelf: "center" }} />
            <View style={styles.detailsParking}>
              {renderParkingIcon(
                <MaterialCommunityIcons name="car-hatchback" size={22} color="black" />,
                parkingStatus.details[0]
              )}
              <View style={styles.dividerVertical} />
              {renderParkingIcon(
                <FontAwesome name="motorcycle" size={18} color="black" />,
                parkingStatus.details[1]
              )}
            </View>
          </View>
        </View>

        {/* Rodapé */}
        <LinearGradient colors={[Colors.gray.zinc, Colors.blue.light]} style={styles.bottomBar}>
          <Pressable onPress={() => router.push("/Functions/entreyRegister")}>
            <View style={styles.buttonEntry}>
              <Entypo name="login" size={40} color={Colors.white} />
            </View>
          </Pressable>

          <Pressable onPress={() => router.push("/Functions/scanExit")}>
            <View style={styles.buttonExit}>
              <Entypo name="log-out" size={40} color={Colors.white} />
            </View>
          </Pressable>

          <Pressable onPress={() => router.push("/Functions/parking")}>
            <View style={styles.buttonPatio}>
              <FontAwesome name="product-hunt" size={40} color={Colors.white} />
            </View>
          </Pressable>

          <Pressable onPress={() => router.push("/Functions/ListSaleScreen")}>
            <View style={styles.buttonDashboard}>
              <MaterialCommunityIcons name="food-fork-drink" size={40} color={Colors.white} />
            </View>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}