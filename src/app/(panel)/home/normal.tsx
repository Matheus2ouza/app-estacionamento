import CashClosedModal from "@/components/CashClosedModal";
import CashRegisterModal from "@/components/CashRegisterModal";
import FeedbackModal from "@/components/FeedbackModal";
import MessageModal from "@/components/MessageModal";
import ParkingBox from "@/components/ParkingBox";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext"; // Adicionado
import { useCashContext } from "@/context/CashContext";
import { styles } from "@/styles/home/normalHomeStyles";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export default function NormalHome() {
  const [message, setMessage] = useState(false);
  const [showCashRegister, setShowCashRegister] = useState(false);
  const [cashRegisterMode, setCashRegisterMode] = useState<"open" | "reopen">(
    "open"
  );
  const [showCashClosed, setShowCashClosed] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [timeCloseFeedback, setTimeCloseFeedback] = useState(5000);
  const { role, userId } = useAuth();
  const {
    loading: cashLoading,
    error,
    cashStatus,
    cashData,
    cashDetails,
    parkingDetails,
    updateCashStatus,
    fetchCashDetails,
    fetchParkingDetails,
    openCash,
    closeCash,
    reopenCash,
  } = useCashContext();

  // Funções utilitárias locais
  const isCashOpen = (): boolean => cashStatus === "open";
  const isCashClosed = (): boolean => cashStatus === "closed";
  const isCashNotCreated = (): boolean => cashStatus === "not_created";

  // Referência estável para evitar re-execuções
  const isCashNotCreatedRef = useRef(isCashNotCreated);
  isCashNotCreatedRef.current = isCashNotCreated;

  // Buscar dados ao montar a tela
  useEffect(() => {
    console.log(
      "🔍 [AdminHome] useEffect inicial: Montando tela, buscando dados"
    );
    updateCashStatus();
  }, []);

  // Função para converter dados do estacionamento para o formato esperado pelo ParkingBox
  const convertParkingData = () => {
    console.log(
      "🔍 [AdminHome] convertParkingData: Convertendo dados do estacionamento"
    );
    console.log(
      "🔍 [AdminHome] convertParkingData: parkingDetails:",
      parkingDetails
    );

    if (!parkingDetails?.data) {
      console.log(
        "❌ [AdminHome] convertParkingData: Nenhum dado de estacionamento disponível"
      );
      return undefined;
    }

    const { data } = parkingDetails;
    const free = data.capacityMax - data.quantityVehicles;

    const result = {
      free,
      used: data.quantityVehicles,
      details: [data.quantityCars, data.quantityMotorcycles],
    };

    console.log(
      "✅ [AdminHome] convertParkingData: Dados convertidos:",
      result
    );
    return result;
  };

  // Buscar dados quando a tela recebe foco e, se não houver caixa, solicitar abertura (sem dependências para evitar loop)
  useFocusEffect(
    useCallback(() => {
      console.log(
        "🔍 [NormalHome] useFocusEffect: Tela recebeu foco, atualizando dados do estacionamento"
      );
      let cancelled = false;
      (async () => {
        // Atualizar status do caixa e obter ID
        const cash = await updateCashStatus();

        if (cancelled) return;

        // Se caixa não foi criado, mostrar modal
        if (isCashNotCreatedRef.current()) {
          setMessage(true);
          return;
        }

        // Buscar dados atualizados do estacionamento quando a tela recebe foco (apenas para normal)
        if (cashStatus === "open" && (cash?.id || cashData?.id)) {
          console.log(
            "🔍 [NormalHome] useFocusEffect: Caixa aberto, buscando dados atualizados do estacionamento"
          );
          try {
            const idToUse = cash?.id || cashData?.id!;
            await fetchParkingDetails(idToUse);
            console.log(
              "✅ [NormalHome] useFocusEffect: Dados do estacionamento atualizados"
            );
          } catch (error) {
            console.error(
              "❌ [NormalHome] useFocusEffect: Erro ao buscar dados do estacionamento:",
              error
            );
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  // Função específica para refresh do ParkingBox
  const handleParkingBoxRefresh = async () => {
    console.log(
      "🔍 [AdminHome] handleParkingBoxRefresh: Iniciando refresh do ParkingBox"
    );
    setShowLoader(true);

    try {
      // Atualizar status do caixa primeiro e obter ID
      const cash = await updateCashStatus();
      console.log("🔍 [AdminHome] handleParkingBoxRefresh: Status atualizado");

      // Buscar dados do estacionamento se o caixa estiver aberto
      if (cashStatus === "open" && (cash?.id || cashData?.id)) {
        const idToUse = cash?.id || cashData?.id!;
        await fetchParkingDetails(idToUse);
        console.log(
          "✅ [AdminHome] handleParkingBoxRefresh: Dados do estacionamento atualizados"
        );
      } else {
        console.log(
          "❌ [AdminHome] handleParkingBoxRefresh: Caixa não aberto ou ID não disponível"
        );
      }
    } catch (error) {
      console.error(
        "❌ [AdminHome] handleParkingBoxRefresh: Erro ao atualizar dados do estacionamento:",
        error
      );
    } finally {
      setShowLoader(false);
    }
  };

  // Monitorar mudanças no status do caixa
  useEffect(() => {
    console.log(
      "🔍 [AdminHome] useEffect cashStatus: Status mudou para:",
      cashStatus
    );

    if (isCashOpen()) {
      console.log("✅ [AdminHome] useEffect cashStatus: Caixa aberto");
      setMessage(false);
      setShowCashClosed(false);

      // Buscar dados do pátio automaticamente quando caixa for aberto
      if (cashData?.id) {
        console.log(
          "🔍 [AdminHome] useEffect cashStatus: Buscando dados do pátio automaticamente"
        );
        fetchParkingDetails(cashData.id).catch((error) => {
          console.error(
            "❌ [AdminHome] useEffect cashStatus: Erro ao buscar dados do pátio:",
            error
          );
        });
      }
    }

    if (isCashClosed()) {
      console.log("🔒 [AdminHome] useEffect cashStatus: Caixa fechado");
      setMessage(false);
      setShowCashClosed(true);
    }

    if (isCashNotCreated()) {
      console.log("❌ [AdminHome] useEffect cashStatus: Caixa não criado");
      setMessage(true);
      setShowCashClosed(false);
    }
  }, [cashStatus, cashData?.id]);

  // Monitorar mudanças nos dados do estacionamento
  useEffect(() => {
    console.log(
      "🔍 [AdminHome] useEffect parkingDetails: Dados do estacionamento mudaram:",
      parkingDetails
    );
  }, [parkingDetails]);

  const handleOpenCash = () => {
    setMessage(false);
    setShowCashClosed(false);
    setCashRegisterMode("open");
    setShowCashRegister(true);
  };

  const handleOpenCashRegister = async (initialValue: string) => {
    console.log(
      "🔍 [AdminHome] handleOpenCashRegister: Abrindo caixa com valor:",
      initialValue
    );

    try {
      setShowLoader(true);
      const numericValue =
        typeof initialValue === "string"
          ? parseFloat(initialValue)
          : initialValue;
      const result = await openCash(numericValue);

      setFeedbackMessage(result.message);
      setFeedbackSuccess(result.success);
      setShowFeedback(true);
      setTimeCloseFeedback(3000);

      if (result.success) {
        // Fechar o modal de abertura do caixa
        setShowCashRegister(false);

        // Forçar atualização dos dados após abrir caixa
        setTimeout(async () => {
          await updateCashStatus();
          // Usar o cashId retornado pela API ou aguardar o cashData ser atualizado
          const cashIdToUse = result.cashId || cashData?.id;
          if (cashIdToUse) {
            await fetchParkingDetails(cashIdToUse);
          }
        }, 100);
      }
    } catch (error) {
      console.error(
        "❌ [AdminHome] handleOpenCashRegister: Erro ao abrir caixa:",
        error
      );
      setFeedbackMessage("Erro inesperado ao abrir caixa");
      setFeedbackSuccess(false);
      setShowFeedback(true);
      setTimeCloseFeedback(3000);
    } finally {
      setShowLoader(false);
    }
  };

  const handleReopenCashRegister = async () => {
    try {
      setShowLoader(true);
      const result = await reopenCash(cashData?.id);

      setFeedbackMessage(result.message);
      setFeedbackSuccess(result.success);
      setShowFeedback(true);
      setTimeCloseFeedback(3000);

      if (result.success) {
        // Fechar o modal de reabertura do caixa
        setShowCashRegister(false);

        // Forçar atualização dos dados após reabrir caixa
        setTimeout(async () => {
          await updateCashStatus();
          // Usar o cashId retornado pela API ou aguardar o cashData ser atualizado
          const cashIdToUse = result.cashId || cashData?.id;
          if (cashIdToUse) {
            await fetchParkingDetails(cashIdToUse);
          }
        }, 100);
      }
    } catch (error) {
      console.error(
        "❌ [AdminHome] handleReopenCashRegister: Erro ao reabrir caixa:",
        error
      );
      setFeedbackMessage("Erro inesperado ao reabrir caixa");
      setFeedbackSuccess(false);
      setShowFeedback(true);
      setTimeCloseFeedback(3000);
    } finally {
      setShowLoader(false);
    }
  };

  const handleCloseCashRegister = () => {
    setShowCashRegister(false);
  };

  const handleCloseCashClosedModal = () => {
    setShowCashClosed(false);
  };

  const handleOpenCashFromModal = () => {
    setShowCashClosed(false);
    setCashRegisterMode("reopen");
    setShowCashRegister(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[Colors.gray.zinc, Colors.blue.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.brandContainer}>
          <Text style={styles.brandMain}>LEÃO</Text>
          <Text style={styles.brandSub}>Estacionamento</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push("/config/normal");
          }}
        >
          <View style={styles.iconCircle}>
            <Feather name="settings" size={30} color={Colors.text.inverse} />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <MessageModal
        visible={message}
        onClose={() => setMessage(false)}
        message="Nenhum caixa foi criado ainda. Para poder buscar dados do estacionamento você precisa abrir o caixa."
        title="Caixa não encontrado"
        buttons={[
          {
            text: "Sim, Abrir o caixa",
            onPress: handleOpenCash,
          },
        ]}
        closeButtonText="Fechar"
      />

      <CashClosedModal
        visible={showCashClosed}
        onClose={handleCloseCashClosedModal}
        onOpenCash={handleOpenCashFromModal}
      />

      <CashRegisterModal
        visible={showCashRegister}
        role={role}
        mode={cashRegisterMode}
        onClose={handleCloseCashRegister}
        onOpenCashRegister={handleOpenCashRegister}
        onReopenCash={handleReopenCashRegister}
      />

      <FeedbackModal
        visible={showFeedback}
        message={feedbackMessage}
        type={feedbackSuccess ? "success" : "error"}
        onClose={() => setShowFeedback(false)}
        dismissible={true}
        timeClose={timeCloseFeedback}
      />

      <Spinner
        visible={showLoader}
        textContent="Carregando..."
        textStyle={{
          color: Colors.text.primary,
          fontSize: 16,
          fontWeight: "500",
        }}
        color={Colors.blue.logo}
        overlayColor={Colors.overlay.medium}
        size="large"
        animation="fade"
      />

      <View style={styles.body}>
        <ParkingBox
          cashStatus={cashStatus}
          onRefresh={handleParkingBoxRefresh}
          parkingData={(() => {
            const data = convertParkingData();
            console.log(
              "🔍 [AdminHome] Renderizando ParkingBox com dados:",
              data
            );
            console.log(
              "🔍 [AdminHome] Renderizando ParkingBox com cashStatus:",
              cashStatus
            );
            return data;
          })()}
        />

        <LinearGradient
          colors={[Colors.gray.zinc, Colors.blue.light]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bottomBar}
        >
          <Pressable
            onPress={() => {
              router.push("/functions/entreyRegister");
            }}
          >
            <View style={styles.buttonEntry}>
              <Entypo name="login" size={40} color={Colors.text.inverse} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              router.push("/functions/scanExit");
            }}
          >
            <View style={styles.buttonExit}>
              <Entypo name="log-out" size={40} color={Colors.text.inverse} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              router.push("/functions/parking");
            }}
          >
            <View style={styles.buttonPatio}>
              <FontAwesome
                name="product-hunt"
                size={40}
                color={Colors.text.inverse}
              />
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/functions/registerProductSale");
            }}
          >
            <View style={styles.buttonDashboard}>
              <MaterialCommunityIcons
                name="food-fork-drink"
                size={40}
                color={Colors.text.inverse}
              />
            </View>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}
