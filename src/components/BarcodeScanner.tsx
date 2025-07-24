import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  StyleSheet,
  Modal,
  Dimensions
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Colors from "@/src/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  visible,
  onClose,
  onBarcodeScanned
}) => {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  // Calcula as dimensões da área de foco vertical
  const focusAreaWidth = windowWidth * 0.3;
  const focusAreaHeight = windowHeight * 0.9;
  const sideMargin = (windowWidth - focusAreaWidth) / 2;
  const topBottomMargin = (windowHeight - focusAreaHeight) / 2;

  useEffect(() => {
    if (!permission) return;

    if (!permission.granted) {
      if (permission.canAskAgain) {
        requestPermission();
      } else {
        Alert.alert(
          "Permissão necessária",
          "A câmera é necessária para ler códigos de barras. Por favor, habilite nas configurações do dispositivo.",
          [{ text: "OK" }]
        );
      }
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning || isProcessing) return;

    setIsScanning(false);
    setIsProcessing(true);

    try {
      onBarcodeScanned(data);
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Código de barras inválido ou mal formatado.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setIsScanning(true);
      }, 1500);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
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
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "codabar",
              "code39",
              "code93",
              "code128",
              "itf14",
            ],
          }}
        >
          {/* Overlay com área de foco VERTICAL */}
          <View style={styles.overlay}>
            {/* Área superior escura */}
            <View style={[styles.unfocusedArea, { height: topBottomMargin }]} />

            {/* Área central com retângulo de foco VERTICAL */}
            <View style={styles.middleArea}>
              {/* Área esquerda escura */}
              <View style={[styles.unfocusedArea, { width: sideMargin }]} />

              {/* Retângulo de foco VERTICAL (alto e estreito) */}
              <View
                style={[
                  styles.focusedArea,
                  {
                    width: focusAreaWidth,
                    height: focusAreaHeight,
                  },
                ]}
              >
                {/* Linha horizontal central */}
                <View style={styles.scanLine} />
              </View>

              {/* Área direita escura */}
              <View style={[styles.unfocusedArea, { width: sideMargin }]} />
            </View>

            {/* Área inferior escura */}
            <View style={[styles.unfocusedArea, { height: topBottomMargin }]} />
          </View>
        </CameraView>

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.processingText}>Processando código...</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <MaterialIcons name="flip-camera-ios" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center'
  },
  unfocusedArea: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleArea: {
    flexDirection: 'row',
  },
  focusedArea: {
    borderColor: Colors.blue.light,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    width: 2,
    height: '100%',
    backgroundColor: Colors.blue.light,
  },
  processingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  processingText: {
    marginTop: 20,
    color: 'white',
    fontSize: 18,
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: 'white',
  },
  permissionButton: {
    backgroundColor: Colors.blue.light,
    padding: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'column',
    gap: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomArea: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
    width: '80%',
  },
});

export default BarcodeScanner;