import CashRegisterModal from "@/src/components/CashRegisterModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import Separator from "@/src/components/Separator";
import Colors from "@/src/constants/Colors";
import { styles } from "@/src/styles/home/normalHomeStyles";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import useCashDetails from "@/src/hooks/cash/useCashDetails";
import LoadingModal from "@/src/components/LoadingModal";
import React, { ReactNode } from "react";
import { useCash } from "@/src/context/CashContext";
import CashStatusModal from "@/src/components/CashStatusModal"; // Importe o modal de status

type ParkingStatus = {
  free: number;
  used: number;
  details: [number, number]; // [carros, motos]
};

export default function NormalHome() {
  // Obtém o contexto do caixa
  const { 
    openCashId, 
    cashStatus, 
    getStatusCash, 
    openCash,
    loading: cashLoading 
  } = useCash();

  // Outros serviços
  const { parkingToHome } = useCashDetails();

  // State
  const [modals, setModals] = useState({
    openCashModal: false,
    closedCashModal: false,
    loading: {
      visible: false,
      text: "",
    },
    feedback: {
      visible: false,
      message: "",
      isSuccess: false,
    },
    cashStatusChecked: false,
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

    const free =
      data.carVacancies +
      data.motorcycleVacancies -
      (data.totalCarsInside + data.totalMotosInside);

    return {
      free,
      used: data.totalCarsInside + data.totalMotosInside,
      details: [data.totalCarsInside, data.totalMotosInside],
    };
  };

  // Buscar dados de estacionamento
  const fetchParkingStatus = useCallback(async () => {
    try {
      const parkingData = await parkingToHome();
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
      setModals(prev => ({ ...prev, cashStatusChecked: false }));
      await getStatusCash();

      if (cashStatus === "CLOSED") {
        setModals(prev => ({ ...prev, closedCashModal: true, cashStatusChecked: true }));
      } else if (!openCashId) {
        setModals(prev => ({ ...prev, openCashModal: true, cashStatusChecked: true }));
      } else {
        setModals(prev => ({
          ...prev,
          openCashModal: false,
          closedCashModal: false,
          cashStatusChecked: true
        }));
      }
    } catch (error) {
      console.error("Erro ao verificar status do caixa:", error);
      showFeedback("Erro ao verificar status do caixa", false);
      setModals(prev => ({ ...prev, cashStatusChecked: true }));
    }
  }, [cashStatus, openCashId]);

  // Atualizar todos os dados
  const handleRefreshAll = async () => {
    setModals(prev => ({ ...prev, loading: { visible: true, text: "Atualizando dados..." } }));
    try {
      await Promise.all([checkCashStatus(), fetchParkingStatus()]);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      showFeedback("Erro ao atualizar dados", false);
    } finally {
      setModals(prev => ({ ...prev, loading: { visible: false, text: "" } }));
    }
  };

  // Helpers de UI
  const showFeedback = (message: string, isSuccess: boolean) => {
    setModals(prev => ({
      ...prev,
      feedback: { visible: true, message, isSuccess },
    }));
  };

  const handleOpenCash = async (initialValue: string) => {
    try {
      const parsedValue = parseFloat(initialValue);

      if (isNaN(parsedValue)) {
        showFeedback("Valor inválido.", false);
        return;
      }

      setModals(prev => ({ ...prev, loading: { visible: true, text: "Abrindo caixa..." } }));
      const { success, message } = await openCash(parsedValue);

      showFeedback(message, success);

      if (success) {
        setModals(prev => ({ ...prev, openCashModal: false }));
        await checkCashStatus();
      }
    } catch (err) {
      showFeedback("Não foi possível abrir o caixa.", false);
      console.error(err);
    } finally {
      setModals(prev => ({ ...prev, loading: { visible: false, text: "" } }));
    }
  };

  // Efeitos
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        if (!isActive) return;

        try {
          setModals(prev => ({ ...prev, loading: { visible: true, text: "Carregando..." } }));
          await checkCashStatus();
          await fetchParkingStatus();
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          showFeedback("Erro ao carregar dados", false);
        } finally {
          if (isActive) {
            setModals(prev => ({ ...prev, loading: { visible: false, text: "" } }));
          }
        }
      };

      loadData();
      return () => {
        isActive = false;
      };
    }, [checkCashStatus, fetchParkingStatus])
  );

  // Combinar estados de loading
  const isLoading = modals.loading.visible || cashLoading;

  // Componentes de renderização
  const renderParkingIcon = (icon: ReactNode, value: number) => (
    <View style={styles.iconDescriptionRow}>
      {icon}
      <Text style={styles.iconText}>{value}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Modals */}
      <LoadingModal visible={isLoading} text={modals.loading.text || "Processando..."} />

      {modals.cashStatusChecked && (
        <>
          <CashStatusModal
            visible={modals.closedCashModal}
            onClose={() => setModals(prev => ({ ...prev, closedCashModal: false }))}
            onConfirm={() => setModals(prev => ({ 
              ...prev, 
              closedCashModal: false, 
              openCashModal: true 
            }))}
          />

          <CashRegisterModal
            visible={modals.openCashModal}
            mode="open"
            onClose={() => setModals(prev => ({ ...prev, openCashModal: false }))}
            onSubmitCashRegister={handleOpenCash}
          />
        </>
      )}

      <FeedbackModal
        visible={modals.feedback.visible}
        message={modals.feedback.message}
        isSuccess={modals.feedback.isSuccess}
        onClose={() => setModals(prev => ({ 
          ...prev, 
          feedback: { ...prev.feedback, visible: false } 
        }))}
      />

      {/* Header */}
      <LinearGradient
        colors={[Colors.gray.zinc, Colors.blue.light]}
        style={styles.header}
      >
        <View style={styles.brandContainer}>
          <Text style={styles.brandMain}>LEÃO</Text>
          <Text style={styles.brandSub}>Estacionamento</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(panel)/Config/config")}>
          <View style={styles.iconCircle}>
            <Feather name="settings" size={30} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Conteúdo principal */}
      <View style={styles.body}>
        {/* Vagas */}
        <View style={styles.parkingStatus}>
          <View style={styles.BoxHeader}>
            <Text style={styles.title}>Vagas</Text>
            <Pressable onPress={handleRefreshAll}>
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
                <MaterialCommunityIcons
                  name="car-hatchback"
                  size={22}
                  color="black"
                />,
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
        <LinearGradient
          colors={[Colors.gray.zinc, Colors.blue.light]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bottomBar}
        >
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
              <MaterialCommunityIcons
                name="food-fork-drink"
                size={40}
                color={Colors.white}
              />
            </View>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}