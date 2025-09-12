import CameraComponent from "@/src/components/CameraComponent";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import Colors from "@/src/constants/Colors";
import useBarcodeSearch from "@/src/hooks/products/useBarcodeSearch";
import useRegisterProduct from "@/src/hooks/products/useRegisterProduct";
import { styles } from "@/src/styles/functions/addProductStyle";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import DatePicker from "react-native-date-picker";
import Spinner from "react-native-loading-spinner-overlay";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [barcode, setBarcode] = useState("");
  const [dotText, setDotText] = useState(".");
  
  // Estados para foco dos inputs
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Estados para feedback
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  // Estados para modal de código de barras
  const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);
  
  // Estados para seletor de data
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  
  const { registerProduct, loading, error, success, message } = useRegisterProduct();
  const { searchByBarcode, loading: barcodeLoading } = useBarcodeSearch();

  const isFormValid = productName && unitPrice && quantity;

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  const handleBarcodeScanned = async (data: { data: string }) => {
    const scannedBarcode = data.data;
    setBarcode(scannedBarcode);
    setBarcodeModalVisible(false);
    
    // Buscar produto automaticamente
    const result = await searchByBarcode(scannedBarcode);
    
    if (result.success && result.data) {
      // Preencher campos automaticamente
      if (result.data.name) {
        setProductName(result.data.name);
      }
      
      showFeedback(
        "Produto encontrado na base de dados", 
        "success"
      );
    } else {
      showFeedback(
        result.message || "Código escaneado, mas produto não encontrado nas bases de dados", 
        "warning"
      );
    }
  };

  const handleCloseBarcodeModal = () => {
    setBarcodeModalVisible(false);
  };


  const onDateChange = useCallback((selectedDate: Date) => {
    setDate(selectedDate);
    setShow(false);
    
    // Formatar data para MM/AAAA (ignorando o dia)
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${month}/${year}`;
    setExpirationDate(formattedDate);
  }, []);

  const onCancel = useCallback(() => {
    setShow(false);
  }, []);

  const openDatePicker = useCallback(() => {
    setShow(true);
  }, []);


  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setDotText((prev) => {
        if (prev.length >= 3) return ".";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [loading]);

  // Monitorar estados do hook
  useEffect(() => {
    if (error) {
      showFeedback(error, "error");
    }
  }, [error]);

  useEffect(() => {
    if (success && message) {
      showFeedback(message, "success");
      // Limpar campos após sucesso
      setProductName("");
      setUnitPrice("");
      setQuantity("");
      setExpirationDate("");
      setBarcode("");
      setDate(new Date());
      setShow(false);
      
      // Redirecionar de volta após 2 segundos
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  }, [success, message]);


  const handleRegister = async () => {
    const parsedPrice = parseFloat(unitPrice.replace(",", "."));
    const parsedQuantity = parseInt(quantity, 10);

    const parsedExpiration = expirationDate || undefined;

    const product = {
      productName,
      unitPrice: parsedPrice,
      quantity: parsedQuantity,
      expirationDate: parsedExpiration,
    };

    await registerProduct(product);
  };

  return (
    <View style={styles.container}>
      <Header title="Adicionar Produto" />

      <ScrollView>
        <View style={styles.formContainer}>
          {/* Nome do Produto */}
          <Text style={styles.label}>Nome do Produto</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'productName' && styles.inputFocused
            ]}
            placeholder="Digite o nome do produto"
            placeholderTextColor={Colors.gray[400]}
            value={productName}
            onChangeText={setProductName}
            onFocus={() => setFocusedInput('productName')}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Valor e Quantidade em linha */}
          <View style={styles.inputRow}>
            <View style={styles.smallInput}>
              <Text style={styles.label}>Valor (R$)</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'unitPrice' && styles.inputFocused
                ]}
                placeholder="0,00"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="numeric"
                value={unitPrice}
                onChangeText={setUnitPrice}
                onFocus={() => setFocusedInput('unitPrice')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.smallInput}>
              <Text style={styles.label}>Quantidade</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'quantity' && styles.inputFocused
                ]}
                placeholder="0"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                onFocus={() => setFocusedInput('quantity')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Código de Barras */}
          <Text style={styles.label}>Código de Barras</Text>
          <View style={styles.barcodeContainer}>
            <TextInput
              style={[
                styles.barcodeInput,
                focusedInput === 'barcode' && styles.inputFocused
              ]}
              placeholder="Código escaneado aparecerá aqui"
              placeholderTextColor={Colors.gray[400]}
              value={barcode}
              onChangeText={setBarcode}
              onFocus={() => setFocusedInput('barcode')}
              onBlur={() => setFocusedInput(null)}
              editable={false}
            />
            <Pressable
              style={[styles.scanButton, barcodeLoading && styles.scanButtonDisabled]}
              onPress={() => setBarcodeModalVisible(true)}
              disabled={barcodeLoading}
            >
              <MaterialIcons 
                name={barcodeLoading ? "hourglass-empty" : "qr-code-scanner"} 
                size={24} 
                color={Colors.white} 
              />
            </Pressable>
          </View>
          <Text style={styles.description}>
            *O código de barras é opcional. Clique no scanner para escanear*
          </Text>

          {/* Validade */}
          <Text style={styles.label}>Validade (MM/AAAA)</Text>
          <Pressable
            style={[
              styles.input,
              styles.dateInput,
              focusedInput === 'expirationDate' && styles.dateInputFocused
            ]}
            onPress={openDatePicker}
            onPressIn={() => setFocusedInput('expirationDate')}
            onPressOut={() => setFocusedInput(null)}
            android_disableSound={true}
          >
            <Text style={[
              styles.dateInputText,
              !expirationDate && styles.dateInputPlaceholder
            ]}>
              {expirationDate || "Selecione a validade"}
            </Text>
            <View style={[
              styles.dateInputIcon,
              focusedInput === 'expirationDate' && styles.dateInputIconFocused
            ]}>
              <MaterialIcons 
                name="calendar-today" 
                size={18} 
                color={Colors.white} 
              />
            </View>
          </Pressable>
          <Text style={styles.description}>*A validade é opcional. Apenas mês/ano será usado, o dia será ignorado*</Text>
        </View>

        {/* Botões */}
        <View style={styles.buttonsContainer}>
        <SecondaryButton
          title="Cancelar"
          onPress={() => router.back()}
          style={styles.cancelButton}
        />
        <PrimaryButton
          title={loading ? `Adicionando${dotText}` : "Adicionar"}
          onPress={handleRegister}
          disabled={!isFormValid || loading}
          style={styles.addButton}
        />
        </View>
      </ScrollView>


      {/* Modal de Código de Barras */}
      <Modal
        visible={barcodeModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraComponent
          mode="barcode"
          onBarcodeScanned={handleBarcodeScanned}
          onManualAction={handleCloseBarcodeModal}
        />
      </Modal>

      {/* Date Picker */}
      <DatePicker
        modal
        open={show}
        date={date}
        mode="date"
        onConfirm={onDateChange}
        onCancel={onCancel}
        title="Selecionar Validade"
        confirmText="Confirmar"
        cancelText="Cancelar"
        minimumDate={new Date()}
        maximumDate={new Date(new Date().getFullYear() + 10, 11, 31)}
        locale="pt"
      />

      {/* Spinner para busca de produto */}
      <Spinner
        visible={barcodeLoading}
        textContent="Buscando produto..."
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

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setFeedbackVisible(false)}
        dismissible={true}
      />
    </View>
  );
}
