import CashAvailabilityAlert from "@/components/CashAvailabilityAlert";
import FeedbackModal from "@/components/FeedbackModal";
import Colors from "@/constants/Colors";
import { useCashContext } from "@/context/CashContext";
import { useFetchVehicle } from "@/hooks/vehicleFlow/useFetchVehicle";
import { styles } from "@/styles/functions/scanExit";
import { FontAwesome6 } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScanExit() {
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [vehicleData, setVehicleData] = useState<any>(null);
  
  // Contexto do caixa para verificar status
  const { cashStatus } = useCashContext();

  // Funções utilitárias locais para verificar status do caixa
  const isCashClosed = (): boolean => cashStatus === 'closed';
  const isCashNotCreated = (): boolean => cashStatus === 'not_created';

  // Verificar se a tela deve ser bloqueada
  const isScreenBlocked = isCashNotCreated() || isCashClosed();

  // Funções de callback para os botões do alerta
  const handleBackPress = () => {
    router.back();
  };
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const {
    fetchVehicle,
    loading,
    success,
    error,
    message,
  } = useFetchVehicle();

  // Animação do scanner
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Verificar permissões da câmera
  useEffect(() => {
    if (!permission) return;

    if (!permission.granted) {
      if (permission.canAskAgain) {
        requestPermission();
      } else {
        Alert.alert(
          "Permissão necessária",
          "A câmera é necessária para ler QR Codes. Por favor, habilite nas configurações do dispositivo.",
          [{ text: "OK" }]
        );
      }
    }
  }, [permission]);

  // Monitorar mudanças no hook useFetchVehicle
  useEffect(() => {
    if (success && message && vehicleData) {
      setModalMessage(message);
      setModalIsSuccess(true);
      setModalVisible(true);
      setIsScanning(false);
      // Navegar para a tela de informações do veículo com os dados reais
      router.push({
        pathname: "/functions/informationExit",
        params: {
          vehicleData: JSON.stringify(vehicleData)
        }
      });
    }
    
    if (error) {
      setModalMessage(error);
      setModalIsSuccess(false);
      setModalVisible(true);
      setIsScanning(true);
    }
  }, [success, error, message, vehicleData]);

  // Função para processar QR Code escaneado
  const handleQRCodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning || isProcessing) return;

    try {
      console.log("QR Code lido:", data);

      let payload = data;

      // Verifica se é base64 e decodifica
      if (/^[A-Za-z0-9+/=]+$/.test(data)) {
        try {
          payload = Buffer.from(data, "base64").toString("utf-8");
        } catch (decodeError) {
          console.warn("Erro ao decodificar base64, usando o valor original.");
        }
      }

      const parsed = JSON.parse(payload);
      const { id, plate } = parsed;

      if (!id || !plate) {
        throw new Error("QR Code não contém os dados necessários.");
      }

      // Processar veículo escaneado
      await handleVehicleScanned(id, plate);
    } catch (error) {
      console.error("Erro ao processar QR Code:", error);
      Alert.alert("Erro", "QR Code inválido ou mal formatado.");
    }
  };

  // Função para lidar com veículo escaneado
  const handleVehicleScanned = async (id: string, plate: string) => {
    setIsScanning(false);
    setIsProcessing(true);
    
    try {
      const result = await fetchVehicle(id, plate);

      console.log("Result:", result);
      
      if (result?.data) {
        // Armazenar dados do veículo para passar como parâmetro
        setVehicleData(result.data);
      } else {
        // Erro na busca - o useEffect vai lidar com o erro
        setIsScanning(true);
      }
    } catch (error) {
      console.error("Erro ao buscar veículo:", error);
      setModalMessage("Erro ao buscar dados do veículo");
      setModalIsSuccess(false);
      setModalVisible(true);
      setIsScanning(true);
    } finally {
      setIsProcessing(false);
    }
  };


  // Função para alternar câmera
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Consulta manual
  const handleManualConsult = () => {
    router.push("/functions/listExit");
  };

  // Fechar modal de feedback
  const handleCloseModal = () => {
    setModalVisible(false);
    if (!modalIsSuccess) {
      // Se foi erro, voltar ao scan
      setIsScanning(true);
    }
  };


  // Tela de scan
  return (
    <View style={styles.container}>
      {/* ALERTA DE TELA BLOQUEADA */}
      {isScreenBlocked ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 40,
          backgroundColor: Colors.black,
        }}>
          <CashAvailabilityAlert 
            mode="blocking" 
            cashStatus={cashStatus} 
            style={{
              marginHorizontal: 0,
              marginVertical: 0,
            }}
          />
        </View>
      ) : !permission ? (
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
          <Text style={styles.permissionText}>Solicitando permissão...</Text>
        </View>
      ) : !permission.granted ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Precisamos da sua permissão para acessar a câmera
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <CameraView
            style={styles.camera}
            facing={facing}
            onBarcodeScanned={isScanning ? handleQRCodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />

          {/* Overlay de visualização para scan */}
          <View style={styles.scanOverlay}>
            <View style={styles.unfocusedArea} />
            <View style={styles.middleRow}>
              <View style={styles.unfocusedArea} />
              <View style={styles.focusedArea}>
                {/* Cantos do scanner */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                
                {/* Linha de scan animada */}
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [{ translateY: pulseAnim.interpolate({
                        inputRange: [1, 1.1],
                        outputRange: [0, 200],
                      })}],
                    },
                  ]}
                />
              </View>
              <View style={styles.unfocusedArea} />
            </View>
            <View style={styles.unfocusedArea} />
            
            {/* Texto de instrução */}
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Posicione o QR Code dentro da área destacada
              </Text>
            </View>
          </View>

          {isProcessing && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={Colors.white} />
              <Text style={styles.processingText}>Processando QR Code...</Text>
            </View>
          )}

          <View style={styles.scanButtonContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <FontAwesome6 name="camera-rotate" size={30} color={Colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.manualButton}
              onPress={handleManualConsult}
              disabled={isProcessing}
            >
              <Text style={styles.manualButtonText}>Consultar manualmente</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        type={modalIsSuccess ? 'success' : 'error'}
        onClose={handleCloseModal}
      />
    </View>
  );
}