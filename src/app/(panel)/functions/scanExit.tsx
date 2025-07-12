import FeedbackModal from "@/src/components/FeedbackModal";
import { useFetchVehicle } from "@/src/hooks/vehicleFlow/useFetchVehicle";
import { styles } from "@/src/styles/functions/scanExit";
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
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const {
    fetchVehicle,
    loading,
    success,
    vehicle,
    error,
    entryTime,
  } = useFetchVehicle();

  // Animação de pulsação
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  // Solicitar permissão da câmera
  useEffect(() => {
    if (!permission) return;

    // Se ainda não concedeu
    if (!permission.granted) {
      // Se ainda podemos pedir, então pedimos
      if (permission.canAskAgain) {
        requestPermission();
      } else {
        // Se não der pra pedir de novo, aí sim mostramos o alerta
        Alert.alert(
          "Permissão necessária",
          "A câmera é necessária para ler QR Codes. Por favor, habilite nas configurações do dispositivo.",
          [{ text: "OK" }]
        );
      }
    }
  }, [permission]);

  // Função para lidar com QR Code escaneado
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning || isProcessing) return;

    setIsScanning(false);
    setIsProcessing(true);

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

      searchVehicle(id, plate);
    } catch (error) {
      console.error("Erro ao processar QR Code:", error);
      alert("QR Code inválido ou mal formatado.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        // Reativar scanner após 2 segundos
        setTimeout(() => setIsScanning(true), 2000);
      }, 1500);
    }
  };

  const searchVehicle = async (id: string, plate: string) => {
    const result = await fetchVehicle(id, plate)

    router.push({
      pathname: "/Functions/informationExit",
      params: {
        id: id,
        plate: plate,
        category: result?.category,
        entryTime: result?.formattedEntryTime,
        time: result?.entryTime
      },
    })
  }

  // Alternar entre câmera frontal e traseira
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Consulta manual
  const handleManualConsult = () => {
    router.push("/Functions/exitRegister");
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.permissionText}>Solicitando permissão...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
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
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        {/* Overlay de visualização */}
        <View style={styles.overlay}>
          <View style={styles.unfocusedArea} />

          <View style={styles.middleRow}>
            <View style={styles.unfocusedArea} />

            {/* Área focal com efeito de pulsação */}
            <Animated.View
              style={[
                styles.focusedArea,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              {/* Cantos pulsantes */}
              <Animated.View
                style={[
                  styles.corner,
                  styles.topLeft,
                  {
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.corner,
                  styles.topRight,
                  {
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.corner,
                  styles.bottomLeft,
                  {
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.corner,
                  styles.bottomRight,
                  {
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ]}
              />
            </Animated.View>

            <View style={styles.unfocusedArea} />
          </View>

          <View style={styles.unfocusedArea} />
        </View>
      </CameraView>

      {/* Indicador de processamento */}
      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.processingText}>Processando QR Code...</Text>
        </View>
      )}

      {/* Botões de ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.flipButtonText}>Alternar Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualConsult}
          disabled={isProcessing}
        >
          <Text style={styles.manualButtonText}>Consultar manualmente</Text>
        </TouchableOpacity>
      </View>

      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        isSuccess={modalIsSuccess}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
