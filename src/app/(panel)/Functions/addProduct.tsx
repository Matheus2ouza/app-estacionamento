import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useRegisterProduct from "@/src/hooks/products/useRegisterProduct";
import { styles } from "@/src/styles/functions/addProductStyle";
import LoadingModal from "@/src/components/LoadingModal";
import { Product } from "@/src/types/products";
import { useEffect, useState, useRef, } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Modal,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [dotText, setDotText] = useState(".");
  const [isAdding, setIsAdding] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const { registerProduct, fetchProductByBarcode } = useRegisterProduct();
  const [LoadingIsModal, setLoadingIsModal] = useState(false);
  const [textLoading, setTextLoading] = useState("");
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);

  // Estados para a câmera
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isFormValid = productName && unitPrice && quantity;

  // Animação de pulsação
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

  useEffect(() => {
    if (!isAdding) return;

    const interval = setInterval(() => {
      setDotText((prev) => {
        if (prev.length >= 3) return ".";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isAdding]);

  // Função para lidar com código de barras escaneado
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning || isProcessing) return;

    setIsScanning(false);
    setIsProcessing(true);
    setBarcode(data); // Define o código imediatamente

    try {
      await fetchProduct(data);
    } catch (error) {
      console.error("Erro ao processar código:", error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        // Reativar scanner após 2 segundos
        setTimeout(() => setIsScanning(true), 2000);
      }, 1500);
    }
  };

const fetchProduct = async (code: string) => {
  setTextLoading("Buscando Produto...");
  setLoadingIsModal(true);
  setIsScannerVisible(false);
  setBarcode(code);

  try {
    const productData = await fetchProductByBarcode(code);

    if (!productData) {
      setModalMessage("Produto não encontrado na base de dados. Preencha os dados manualmente.");
      setModalIsSuccess(false);
      setModalVisible(true);
      setShouldNavigateBack(false); // Não navega
      return;
    }

    const essentialData = {
      name: productData.product_name_pt || productData.product_name || "",
      quantity: productData.product_quantity || "",
      unit: productData.product_quantity_unit || "",
      packaging: productData.packaging || "",
    };

    if (essentialData.name) {
      setProductName(`${essentialData.name} - ${essentialData.quantity}${essentialData.unit}`);
    }

    setModalMessage("Produto encontrado! Verifique os dados e complete se necessário.");
    setModalIsSuccess(true);
    setModalVisible(true);
    setShouldNavigateBack(false); // Não navega mesmo no sucesso
  } catch (err: any) {
    setModalMessage("Erro ao tentar buscar o produto. Preencha os dados manualmente.");
    setModalIsSuccess(false);
    setModalVisible(true);
    setShouldNavigateBack(false); // Não navega
  } finally {
    setLoadingIsModal(false);
  }
};

const handleRegister = async () => {
  setIsAdding(true);

  try {
    const parsedPrice = parseFloat(unitPrice.replace(",", "."));
    const parsedQuantity = parseInt(quantity, 10);
    const parsedExpiration = expirationDate || undefined;

    const product: Product = {
      id: `temp_${Date.now()}`,
      productName,
      barcode,
      unitPrice: parsedPrice,
      quantity: parsedQuantity,
      expirationDate: parsedExpiration,
    };

    const response = await registerProduct(product);

    if (response.success) {
      setModalMessage("Produto cadastrado com sucesso!");
      setModalIsSuccess(true);
      setShouldNavigateBack(true); // Navega apenas no sucesso do registro
      // Limpa os campos
      setProductName("");
      setUnitPrice("");
      setQuantity("");
      setExpirationDate("");
      setBarcode("");
    } else {
      setModalMessage(response.message);
      setModalIsSuccess(false);
      setShouldNavigateBack(false); // Não navega
    }
  } catch (err: any) {
    setModalMessage(err.message || "Erro inesperado.");
    setModalIsSuccess(false);
    setShouldNavigateBack(false); // Não navega
  } finally {
    setIsAdding(false);
    setModalVisible(true);
  }
};
  // Alternar entre câmera frontal e traseira
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Solicitando permissão...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Precisamos da sua permissão para acessar a câmera</Text>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: Colors.blue.logo,
            borderRadius: 5,
          }}
          onPress={requestPermission}
        >
          <Text style={{ color: "white" }}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modal do scanner de código de barras */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isScannerVisible}
        onRequestClose={() => setIsScannerVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CameraView
              style={{ flex: 1 }}
              facing={facing}
              onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
              barcodeScannerSettings={{
                barcodeTypes: [
                  "qr",
                  "ean13",
                  "ean8",
                  "upc_a",
                  "upc_e",
                  "code39",
                  "code128",
                ],
              }}
            />

            {/* Overlay sobre a câmera */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {/* Parte de cima do overlay */}
              <View
                style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              />

              {/* Linha do meio com o retângulo */}
              <View
                style={{
                  flexDirection: "row",
                  height: 500,
                  backgroundColor: "transparent",
                }}
              >
                {/* Lado esquerdo */}
                <View
                  style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                />

                {/* Área do scanner */}
                <Animated.View
                  style={{
                    width: 250,
                    borderWidth: 2,
                    borderColor: "white",
                    borderRadius: 10,
                    backgroundColor: "transparent",
                  }}
                />

                {/* Lado direito */}
                <View
                  style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                />
              </View>

              {/* Parte de baixo do overlay */}
              <View
                style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              />
            </View>
          </View>

          {/* Botões de ação do scanner */}
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: Colors.blue.logo,
                padding: 15,
                borderRadius: 50,
              }}
              onPress={toggleCameraFacing}
            >
              <MaterialIcons name="flip-camera-ios" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: Colors.red[500],
                padding: 15,
                borderRadius: 50,
              }}
              onPress={() => setIsScannerVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Indicador de processamento */}
          {isProcessing && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={{ color: "white", marginTop: 10 }}>
                Processando código...
              </Text>
            </View>
          )}
        </View>
      </Modal>

<FeedbackModal
  visible={modalVisible}
  message={modalMessage}
  isSuccess={modalIsSuccess}
  onClose={() => {
    setModalVisible(false);
    if (shouldNavigateBack && modalIsSuccess) {
      router.back(); // Navega apenas se for sucesso no registro
    }
  }}
/>

      <LoadingModal visible={LoadingIsModal} text={textLoading} />

      <Header title="Adicionar Produto" titleStyle={{ fontSize: 27 }} />

      <ScrollView>
        <View style={styles.formContainer}>
          {/* Nome do Produto */}
          <TextInput
            label="Nome do Produto"
            mode="outlined"
            style={styles.input}
            placeholderTextColor={Colors.blue.logo}
            value={productName}
            onChangeText={setProductName}
            cursorColor={Colors.blue.light}
          />

          <View style={styles.barcodeContainer}>
            <View style={styles.barcodeRow}>
              <TextInput
                style={[styles.input, styles.barcodeInput]}
                mode="outlined"
                placeholder="Leia o código de barras"
                placeholderTextColor={Colors.gray[500]}
                value={barcode}
                onChangeText={setBarcode}
                editable={true}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setIsScannerVisible(true)}
              >
                <MaterialIcons name="qr-code-scanner" size={24} color="white" />
                <Text style={styles.scanButtonText}>Ler Código</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Valor e Quantidade em linha */}
          <View style={styles.inputRow}>
            <View style={styles.smallInput}>
              <TextInput
                label="Valor (R$)"
                mode="outlined"
                style={styles.input}
                placeholderTextColor={Colors.gray[500]}
                keyboardType="numeric"
                value={unitPrice}
                onChangeText={setUnitPrice}
              />
            </View>

            <View style={styles.smallInput}>
              <TextInput
                label="Quantidade"
                mode="outlined"
                style={styles.input}
                placeholderTextColor={Colors.gray[500]}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
          </View>
          <TextInput
            label="Validade (MM/AAAA)"
            mode="outlined"
            style={[styles.input, { marginTop: 25 }]}
            placeholderTextColor={Colors.gray[500]}
            value={expirationDate}
            onChangeText={setExpirationDate}
            keyboardType="ascii-capable"
          />
          <Text style={styles.description}>*A validade é opcional*</Text>
        </View>
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[
            styles.addButton,
            (!isFormValid || isAdding) && {
              backgroundColor: Colors.gray[500],
            },
          ]}
          disabled={!isFormValid || isAdding}
          onPress={handleRegister}
        >
          <Text
            style={[
              styles.addButtonText,
              (!isFormValid || isAdding) && { color: Colors.gray.light },
            ]}
          >
            {isAdding ? `Adicionando${dotText}` : "Adicionar Produto"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
