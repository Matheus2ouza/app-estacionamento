import CashBox from "@/src/components/CashBox";
import CashClosedModal from "@/src/components/CashClosedModal";
import CashRegisterModal from "@/src/components/CashRegisterModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import MessageModal from "@/src/components/MessageModal";
import ParkingBox from "@/src/components/ParkingBox";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { useCashContext } from "@/src/context/CashContext";
import { styles } from "@/src/styles/home/adminHomeStyles";
import { Feather } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export default function AdminHome() {
  const [message, setMessage] = useState(false)
  const [showCashRegister, setShowCashRegister] = useState(false)
  const [cashRegisterMode, setCashRegisterMode] = useState<'open' | 'reopen'>('open')
  const [showCashClosed, setShowCashClosed] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)
  const [timeCloseFeedback, setTimeCloseFeedback] = useState(5000)
  const { role, userId } = useAuth();
  const { 
    loading: cashLoading, 
    error, 
    cashStatus, 
    cashData, 
    cashDetails,
    parkingDetails,
    openCash,
    reOpenCash,
    closeCash,
    refreshAllData,
    fetchCashStatus,
    fetchCashDetails,
    fetchParkingDetails,
    isCashOpen,
    isCashClosed,
    isCashNotCreated,
  } = useCashContext();


  // Referência estável para evitar re-execuções
  const refreshAllDataRef = useRef(refreshAllData);
  refreshAllDataRef.current = refreshAllData;

  // Função para converter dados do estacionamento para o formato esperado pelo ParkingBox
  const convertParkingData = () => {
    if (!parkingDetails?.data) return undefined;
    
    const { data } = parkingDetails;
    const free = data.capacityMax - data.quantityVehicles;
    
    return {
      free,
      used: data.quantityVehicles,
      details: [data.quantityCars, data.quantityMotorcycles]
    };
  };

  // Buscar dados quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      console.log('🔍 [AdminHome] useFocusEffect: Tela recebeu foco, verificando status do caixa');
      
      const fetchDataOnFocus = async () => {
        try {
          // Primeiro busca o status do caixa
          const { status, cashId } = await fetchCashStatus();
          console.log('🔍 [AdminHome] useFocusEffect: Status do caixa:', status, 'ID:', cashId);
          
          // Baseado no status, decide quais dados buscar
          if (status === 'open') {
            console.log('✅ [AdminHome] useFocusEffect: Caixa aberto - buscando dados do caixa e estacionamento');
            // Buscar detalhes do caixa
            if (cashId) {
              await fetchCashDetails(cashId);
              // Buscar dados do estacionamento
              await fetchParkingDetails(cashId);
            }
          } else if (status === 'closed') {
            console.log('🔒 [AdminHome] useFocusEffect: Caixa fechado - buscando apenas dados do caixa');
            // Buscar apenas detalhes do caixa
            if (cashId) {
              await fetchCashDetails(cashId);
            }
          } else if (status === 'not_created') {
            console.log('❌ [AdminHome] useFocusEffect: Caixa não criado - não buscando dados');
            // Não busca nenhum dado quando o caixa não foi criado
          }
        } catch (error) {
          console.error('❌ [AdminHome] useFocusEffect: Erro ao buscar dados:', error);
        }
      };

      fetchDataOnFocus();
    }, []) // Remover dependências para evitar loop
  );



  // Função específica para refresh do CashBox
  const handleCashBoxRefresh = async () => {
    console.log('🔍 [AdminHome] handleCashBoxRefresh: Iniciando refresh do CashBox');
    
    // Verificar se o caixa não foi criado antes de fazer refresh
    if (isCashNotCreated()) {
      console.log('❌ [AdminHome] handleCashBoxRefresh: Caixa não criado, mostrando modal');
      setMessage(true);
      return;
    }
    
    setShowLoader(true);
    const startTime = Date.now();
    
    try {
      // Buscar apenas o status e detalhes do caixa
      const { status, cashId } = await fetchCashStatus();
      console.log('🔍 [AdminHome] handleCashBoxRefresh: Status atualizado:', status, 'ID:', cashId);
      
      // Se o caixa existe, buscar detalhes do caixa
      if ((status === 'open' || status === 'closed') && cashId) {
        await fetchCashDetails(cashId);
        console.log('✅ [AdminHome] handleCashBoxRefresh: Detalhes do caixa atualizados');
      }
    } catch (error) {
      console.error('❌ [AdminHome] handleCashBoxRefresh: Erro ao atualizar dados do caixa:', error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      
      setTimeout(() => {
        setShowLoader(false);
        console.log('🔍 [AdminHome] handleCashBoxRefresh: Finalizando refresh');
      }, remainingTime);
    }
  };

  // Função específica para refresh do ParkingBox
  const handleParkingBoxRefresh = async () => {
    console.log('🔍 [AdminHome] handleParkingBoxRefresh: Iniciando refresh do ParkingBox');
    
    // Verificar se o caixa não foi criado antes de fazer refresh
    if (isCashNotCreated()) {
      console.log('❌ [AdminHome] handleParkingBoxRefresh: Caixa não criado, mostrando modal');
      setMessage(true);
      return;
    }
    
    setShowLoader(true);
    const startTime = Date.now();
    
    try {
      // Buscar apenas dados do estacionamento
      if (cashData?.id) {
        await fetchParkingDetails(cashData.id);
        console.log('✅ [AdminHome] handleParkingBoxRefresh: Dados do estacionamento atualizados');
      } else {
        console.log('❌ [AdminHome] handleParkingBoxRefresh: ID do caixa não disponível');
      }
    } catch (error) {
      console.error('❌ [AdminHome] handleParkingBoxRefresh: Erro ao atualizar dados do estacionamento:', error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      
      setTimeout(() => {
        setShowLoader(false);
        console.log('🔍 [AdminHome] handleParkingBoxRefresh: Finalizando refresh');
      }, remainingTime);
    }
  };

  // Monitorar mudanças no status do caixa
  useEffect(() => {
    console.log('🔍 [AdminHome] useEffect cashStatus: Status mudou para:', cashStatus);
    
    if (isCashOpen()) {
      console.log('✅ [AdminHome] useEffect cashStatus: Caixa aberto');
      setMessage(false);
      setShowCashClosed(false);
    }
    
    if (isCashClosed()) {
      console.log('🔒 [AdminHome] useEffect cashStatus: Caixa fechado');
      setMessage(false);
      setShowCashClosed(true);
    }
    
    if (isCashNotCreated()) {
      console.log('❌ [AdminHome] useEffect cashStatus: Caixa não criado');
      setMessage(true);
      setShowCashClosed(false);
    }
  }, [cashStatus]);


  const handleOpenCash = () => {
    setMessage(false);
    setShowCashClosed(false);
    setCashRegisterMode('open');
    setShowCashRegister(true);
  };

  const handleReopenCash = () => {
    setCashRegisterMode('reopen');
    setShowCashRegister(true);
  };

  const handleOpenCashRegister = async (initialValue: string) => {
    setShowLoader(true);
    const startTime = Date.now();
    
    try {
      // Função para converter valor monetário brasileiro para número
      const convertBrazilianCurrency = (value: string): number => {
        if (!value || value.trim() === '') return 0;
        
        // Remove espaços e caracteres não numéricos exceto vírgula e ponto
        let cleanValue = value.replace(/\s/g, '').replace(/[^\d,.-]/g, '');
        
        // Se tem vírgula, assume formato brasileiro (17,50)
        if (cleanValue.includes(',')) {
          // Substitui vírgula por ponto para parseFloat
          cleanValue = cleanValue.replace(',', '.');
        }
        
        const result = parseFloat(cleanValue);
        return isNaN(result) ? 0 : result;
      };

      const numericValue = convertBrazilianCurrency(initialValue);
      
      const [success, message] = await openCash(numericValue);
      
      if (success) {
        setShowCashRegister(false);
        setFeedbackMessage(message);
        setFeedbackSuccess(true);
        setShowFeedback(true);
        setTimeCloseFeedback(3000)
      } else {
        setFeedbackMessage(message);
        setFeedbackSuccess(false);
        setShowFeedback(true);
        setTimeCloseFeedback(3000)
      }
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      
      setTimeout(() => {
        setShowLoader(false);
      }, remainingTime);
    }
  };

  const handleReopenCashRegister = async () => {
    if (!cashData?.id) {
      console.error('ID do caixa não encontrado');
      setFeedbackMessage('Erro: Caixa não encontrado');
      setFeedbackSuccess(false);
      setShowFeedback(true);
      return;
    }

    setShowLoader(true);
    const startTime = Date.now();
    
    try {
      const [success, message] = await reOpenCash(cashData.id);
      
      if (success) {
        setShowCashRegister(false);
        setFeedbackMessage(message);
        setFeedbackSuccess(true);
        setShowFeedback(true);
        setTimeCloseFeedback(3000)
      } else {
        setFeedbackMessage(message);
        setFeedbackSuccess(false);
        setShowFeedback(true);
        setTimeCloseFeedback(3000)
      }
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      
      setTimeout(() => {
        setShowLoader(false);
      }, remainingTime);
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
    setCashRegisterMode('reopen');
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
            router.push("/config/admin");
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
        message="Nenhum caixa foi criado ainda. Deseja criar um novo caixa? Caso escolha não abrir o caixa pode ser que algumas funções do sistema não funcionem corretamente ou não estejam disponíveis."
        title="Caixa não encontrado"
        buttons={[
          {
            text: "Sim, Abrir o caixa",
            onPress: handleOpenCash
          }
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
        type={feedbackSuccess ? 'success' : 'error'}
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
          fontWeight: '500'
        }}
        color={Colors.blue.logo}
        overlayColor={Colors.overlay.medium}
        size="large"
        animation="fade"
      />

      <View style={styles.body}>
        <CashBox 
          cashStatus={cashStatus}
          onRefresh={handleCashBoxRefresh}
          cashData={cashDetails ? {
            "Valor Inicial": cashDetails.initialValue,
            Dinheiro: cashDetails.totalCash,
            Credito: cashDetails.totalCredit,
            Debito: cashDetails.totalDebit,
            Pix: cashDetails.totalPix,
            Saída: cashDetails.outgoingExpenseTotal,
            Total: cashDetails.finalValue
          } : undefined}
        />

        <ParkingBox 
          cashStatus={cashStatus}
          onRefresh={handleParkingBoxRefresh}
          parkingData={convertParkingData()}
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
              <FontAwesome name="product-hunt" size={40} color={Colors.text.inverse} />
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/functions/registerProductSale");
            }}
          >
            <View style={styles.buttonDashboard}>
              <MaterialCommunityIcons name="food-fork-drink" size={40} color={Colors.text.inverse} />
            </View>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}
