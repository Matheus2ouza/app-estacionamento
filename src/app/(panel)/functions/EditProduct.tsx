import CameraComponent from "@/components/CameraComponent";
import FeedbackModal from "@/components/FeedbackModal";
import GenericConfirmationModal from "@/components/GenericConfirmationModal";
import Header from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import ProductConfirmationModal from "@/components/ProductConfirmationModal";
import { SecondaryButton } from "@/components/SecondaryButton";
import Colors from "@/constants/Colors";
import useBarcodeSearch from "@/hooks/products/useBarcodeSearch";
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";
import { styles } from "@/styles/functions/editProductStyle";
import { parseMMYYYYToDate } from "@/utils/dateUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import DatePicker from "react-native-date-picker";
import Spinner from "react-native-loading-spinner-overlay";

interface Product {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  barcode?: string;
  expirationDate?: string;
  isActive?: boolean;
}

export default function EditProduct() {
  const { productData } = useLocalSearchParams();
  
  // Parse dos dados do produto recebidos via parâmetros
  const product: Product = productData ? JSON.parse(productData as string) : {
    id: "",
    productName: "",
    unitPrice: 0,
    quantity: 0,
    barcode: "",
    expirationDate: ""
  };

  const [productName, setProductName] = useState(product.productName || "");
  const [unitPrice, setUnitPrice] = useState(product.unitPrice ? product.unitPrice.toString() : "");
  const [quantity, setQuantity] = useState(product.quantity ? product.quantity.toString() : "");
  const [expirationDate, setExpirationDate] = useState(product.expirationDate || "");
  const [barcode, setBarcode] = useState(product.barcode || "");
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
  
  // Estados para modais de confirmação
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showProductConfirmationModal, setShowProductConfirmationModal] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<any>(null);
  
  const { searchByBarcode, loading: barcodeLoading } = useBarcodeSearch();
  const { updateProduct, loading: updateLoading } = useUpdateProduct();

  // Atualizar estados quando os parâmetros chegarem
  useEffect(() => {
    if (productData) {
      const parsedProduct = JSON.parse(productData as string);
      setProductName(parsedProduct.productName || "");
      setUnitPrice(parsedProduct.unitPrice ? parsedProduct.unitPrice.toString() : "");
      setQuantity(parsedProduct.quantity ? parsedProduct.quantity.toString() : "");
      setExpirationDate(parsedProduct.expirationDate || "");
      setBarcode(parsedProduct.barcode || "");
      
      // Configurar a data inicial do DatePicker se houver data de expiração
      if (parsedProduct.expirationDate) {
        setDate(parseMMYYYYToDate(parsedProduct.expirationDate));
      }
    }
  }, [productData]);

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

  // Funções para modais de confirmação
  const handleActivationConfirm = () => {
    if (productToUpdate) {
      // Ativar o produto
      productToUpdate.isActive = true;
      setShowActivationModal(false);
      setShowProductConfirmationModal(true);
    }
  };

  const handleActivationCancel = () => {
    if (productToUpdate) {
      // Manter o produto desativado
      productToUpdate.isActive = false;
      setShowActivationModal(false);
      setShowProductConfirmationModal(true);
    }
  };

  const handleProductConfirmationConfirm = async () => {
    if (!productToUpdate) return;

    try {
      const result = await updateProduct(productToUpdate);
      
      if (result.success) {
        showFeedback("Produto atualizado com sucesso!", "success");
        setShowProductConfirmationModal(false);
        setProductToUpdate(null);
        
        // Redirecionar de volta após 2 segundos
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        showFeedback(result.message, "error");
        setShowProductConfirmationModal(false);
        setProductToUpdate(null);
      }
    } catch (error) {
      showFeedback("Erro ao atualizar produto", "error");
      setShowProductConfirmationModal(false);
      setProductToUpdate(null);
    }
  };

  const handleProductConfirmationCancel = () => {
    setShowProductConfirmationModal(false);
    setProductToUpdate(null);
  };

  const handleUpdate = async () => {
    const parsedPrice = parseFloat(unitPrice.replace(",", "."));
    const parsedQuantity = parseInt(quantity, 10);
    const parsedExpiration = expirationDate || undefined;

    const updatedProduct = {
      id: product.id,
      productName,
      unitPrice: parsedPrice,
      barcode: barcode,
      quantity: parsedQuantity,
      expirationDate: parsedExpiration,
      isActive: product.isActive // Manter o status atual
    };

    // Se o produto está desativado, mostrar modal de ativação
    if (!product.isActive) {
      setProductToUpdate(updatedProduct);
      setShowActivationModal(true);
    } else {
      // Se está ativo, ir direto para confirmação
      setProductToUpdate(updatedProduct);
      setShowProductConfirmationModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Editar Produto" />

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
            title="Atualizar"
            onPress={handleUpdate}
            disabled={!isFormValid}
            style={styles.updateButton}
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
        theme="light"
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

      {/* Modal de confirmação para ativar produto desativado */}
      <GenericConfirmationModal
        visible={showActivationModal}
        title="Produto Desativado"
        message="Este produto está desativado. Deseja ativá-lo?"
        details={`Produto: ${productToUpdate?.productName || ''}\n\nSe você ativar o produto, ele poderá ser usado para vendas. Se mantiver desativado, ele continuará inativo mas as alterações nos outros campos serão salvas.`}
        confirmText="Ativar"
        cancelText="Manter Desativado"
        confirmButtonStyle="success"
        onConfirm={handleActivationConfirm}
        onCancel={handleActivationCancel}
      />

      {/* Modal de confirmação dos dados do produto */}
      {productToUpdate && (
        <ProductConfirmationModal
          visible={showProductConfirmationModal}
          product={productToUpdate}
          onConfirm={handleProductConfirmationConfirm}
          onCancel={handleProductConfirmationCancel}
          loading={updateLoading}
        />
      )}
    </View>
  );
}