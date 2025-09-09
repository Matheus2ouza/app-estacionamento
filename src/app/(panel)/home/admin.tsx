import CashBox from "@/src/components/CashBox";
import CashClosedModal from "@/src/components/CashClosedModal";
import CashRegisterModal from "@/src/components/CashRegisterModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import MessageModal from "@/src/components/MessageModal";
import ParkingBox from "@/src/components/ParkingBox";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { useCashContext } from "@/src/context/CashContext";
import { useCash } from "@/src/hooks/cash/useCash";
import { styles } from "@/src/styles/home/adminHomeStyles";
import { CashData } from "@/src/types/cash";
import { Feather } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
  const [cashDetails, setCashDetails] = useState<CashData | null>(null)
  const { role, userId } = useAuth();
  const { 
    loading: cashLoading, 
    error, 
    cashStatus, 
    cashData, 
    fetchStatus, 
    openCash,
    reOpenCash,
    closeCash,
  } = useCashContext();

  const { detailsCash } = useCash();

  // Função para buscar detalhes do caixa
  const fetchCashDetails = async () => {
    if (cashData?.id && !cashDetails) {
      const details = await detailsCash(cashData.id);
      if (details) {
        setCashDetails(details);
      }
    }
  };

  // Função para atualizar dados do caixa (usada no refresh)
  const updateCashDetails = async () => {
    // Primeiro verifica o status do caixa
    const status = await fetchStatus();
    
    // Depois busca os detalhes se o caixa existir
    if (cashData?.id && (status === 'open' || status === 'closed')) {
      const details = await detailsCash(cashData.id);
      console.log("o details logo abaixo")
      console.log(details)
      if (details) {
        setCashDetails(details);
      }
    }
  };

  // Buscar status do caixa quando a tela for montada
  useEffect(() => {
    checkCashStatus();
  }, []);

  // Monitorar mudanças no status do caixa
  useEffect(() => {
    if (cashStatus === 'open') {
      setMessage(false);
      setShowCashClosed(false);
      // Buscar detalhes do caixa quando estiver aberto
      fetchCashDetails();
    }
    
    if (cashStatus === 'closed') {
      setMessage(false);
      setShowCashClosed(true);
      // Manter detalhes do caixa mesmo quando fechado
      if (!cashDetails && cashData?.id) {
        fetchCashDetails();
      }
    }
    
    if (cashStatus === 'not_created') {
      setMessage(true);
      setShowCashClosed(false);
      setCashDetails(null); // Limpar detalhes apenas quando não há caixa
    }
  }, [cashStatus, cashData?.id]);

  const checkCashStatus = async () => {
    setShowLoader(true);
    const startTime = Date.now();
    
    try {
      const status = await fetchStatus();
      
      if(status === 'not_created') {
        setMessage(true);
        setShowCashClosed(false);
        setCashDetails(null);
      }
      
      if(status === 'closed') {
        setMessage(false);
        setShowCashClosed(true);
        // Buscar detalhes se não tiver ainda
        if (!cashDetails && cashData?.id) {
          await fetchCashDetails();
        }
      }
      
      if(status === 'open') {
        setMessage(false);
        setShowCashClosed(false);
        // Buscar detalhes se não tiver ainda
        if (!cashDetails && cashData?.id) {
          await fetchCashDetails();
        }
      }
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      
      setTimeout(() => {
        setShowLoader(false);
      }, remainingTime);
    }
  };

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
          onRefresh={updateCashDetails}
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
          onRefresh={checkCashStatus}
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
              router.push("/functions/inventory");
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
