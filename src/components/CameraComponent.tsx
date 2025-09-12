import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from '../constants/Colors';

interface CameraComponentProps {
  mode: 'default' | 'update' | 'barcode';
  onBarcodeScanned?: (data: { data: string }) => void;
  onManualAction?: () => void;
  onPhotoCaptured?: (photoUri: string) => void;
  onUpdatePhoto?: (photoUri: string) => void;
  manualButtonText?: string;
  isProcessing?: boolean;
}

export default function CameraComponent({
  mode,
  onBarcodeScanned,
  onManualAction,
  onPhotoCaptured,
  onUpdatePhoto,
  manualButtonText = "Consultar manualmente",
  isProcessing = false,
}: CameraComponentProps) {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  // URI da foto capturada - salva o caminho do arquivo temporário no dispositivo
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // CAPTURA E ARMAZENAMENTO DA FOTO
  // Salva a foto como arquivo temporário no dispositivo e retorna o URI
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: false,
          skipProcessing: true,
        });
        
        if (photo?.uri) {
          // URI contém o caminho do arquivo temporário: file:///path/to/image.jpg
          setCapturedPhoto(photo.uri);
          setShowPreview(true);
          // NO MODO UPDATE: NÃO chama onPhotoCaptured imediatamente
          // Apenas no modo default chama onPhotoCaptured
          if (mode === 'default') {
            onPhotoCaptured?.(photo.uri);
          }
        }
      } catch (error) {
        console.error('Erro ao capturar foto:', error);
        Alert.alert('Erro', 'Não foi possível capturar a foto');
      }
    }
  };

  const acceptPhoto = () => {
    setShowPreview(false);
    if (mode === 'update' && capturedPhoto) {
      onUpdatePhoto?.(capturedPhoto);
      // Fechar câmera automaticamente após atualizar foto
      onManualAction?.();
    } else {
      onManualAction?.();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setShowPreview(false);
  };


  const renderCameraContent = () => {
    switch (mode) {
      case 'default':
        return renderDefaultCamera();
      case 'update':
        return renderUpdateCamera();
      case 'barcode':
        return renderBarcodeCamera();
      default:
        return renderDefaultCamera();
    }
  };

  const renderDefaultCamera = () => {
    if (!permission) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#FFFFFF" />
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
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        />

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.processingText}>Processando foto...</Text>
          </View>
        )}

        <View style={styles.photoButtonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <FontAwesome6 name="camera-rotate" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isProcessing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          {onManualAction && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onManualAction}
              disabled={isProcessing}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderUpdateCamera = () => {
    if (!permission) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#FFFFFF" />
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
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        />

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.processingText}>Atualizando foto...</Text>
          </View>
        )}

        <View style={styles.photoButtonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <FontAwesome6 name="camera-rotate" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isProcessing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          {onManualAction && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onManualAction}
              disabled={isProcessing}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderBarcodeCamera = () => {
    if (!permission) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#FFFFFF" />
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
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417", "aztec", "ean13", "ean8", "upc_e", "upc_a", "code128", "code39", "codabar", "itf14", "datamatrix"],
          }}
          onBarcodeScanned={onBarcodeScanned}
        />

        {/* Overlay para código de barras */}
        <View style={styles.barcodeOverlay}>
          <Text style={styles.barcodeInstruction}>
            Posicione o código de barras dentro do quadro
          </Text>
          <Text style={styles.barcodeSubInstruction}>
            A leitura será automática
          </Text>
          
          <View style={styles.barcodeFrame}>
            <Animated.View style={[styles.barcodeFrameInner, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.barcodeCorners}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </Animated.View>
          </View>
        </View>

        <View style={styles.photoButtonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <FontAwesome6 name="camera-rotate" size={30} color="white" />
          </TouchableOpacity>

          {onManualAction && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onManualAction}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // PREVIEW DA FOTO CAPTURADA
  // Mostra a imagem salva e permite aceitar ou rejeitar
  const renderPhotoPreview = () => {
    if (!capturedPhoto) return null;

    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
        
        <View style={styles.previewButtonContainer}>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={retakePhoto}
          >
            <FontAwesome6 name="arrow-rotate-left" size={20} color="white" />
            <Text style={styles.retakeButtonText}>Tirar Novamente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={acceptPhoto}
          >
            <FontAwesome6 
              name={mode === 'update' ? "upload" : "check"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.acceptButtonText}>
              {mode === 'update' ? 'Atualizar Foto' : 'Usar Foto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // CONTROLE DE RENDERIZAÇÃO
  // Mostra preview se foto foi capturada, senão mostra câmera
  if (showPreview && capturedPhoto) {
    return renderPhotoPreview();
  }

  return renderCameraContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  processingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: Colors.white,
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  photoButtonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipButton: {
    backgroundColor: Colors.overlay.dark,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.whiteSemiTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.white,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
  },
  closeButton: {
    backgroundColor: Colors.overlay.dark,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  permissionText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  previewButtonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  retakeButton: {
    backgroundColor: Colors.red.error,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  retakeButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: Colors.green.success,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  acceptButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  barcodeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeFrame: {
    width: 320,
    height: 200,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  barcodeFrameInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeCorners: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Colors.blue.logo,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  barcodeInstruction: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: Colors.overlay.dark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  barcodeSubInstruction: {
    color: Colors.gray[300],
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    backgroundColor: Colors.overlay.medium,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 0,
  },
});
