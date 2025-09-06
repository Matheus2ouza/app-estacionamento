import CameraComponent from "@/src/components/CameraComponent";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import PreviewPDF from "@/src/components/previewPDF";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import { useBillingMethod } from "@/src/hooks/cash/useBillingMethod";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";
import useRegisterVehicle from "@/src/hooks/vehicleFlow/useRegisterEntry";
import { styles } from "@/src/styles/functions/entreyStyle";
import { BillingMethodList } from "@/src/types/billingMethod";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const CATEGORY_OPTIONS = [
  { 
    label: "Carro", 
    value: "carro", 
    icon: "car", 
    color: Colors.blue[500],
  },
  { 
    label: "Moto", 
    value: "moto", 
    icon: "bicycle", 
    color: Colors.orange[500],
  },
];

export default function EntreyRegister() {
  const [plate, setPlate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "carro" | "moto"
  >("carro");

  const { registerVehicle, loading, error, success, message } =
    useRegisterVehicle();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);

  // PDF base64 retornado pela API após registro bem-sucedido
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const { downloadPdf, printPdf } = usePdfActions();

  // VALIDAÇÃO DE PLACA COM DEBOUNCE
  // Valida formatos ABC1234, ABC-1234 e ABC1D23 (antigo e Mercosul) com delay de 1.5s
  const [isValidating, setIsValidating] = useState(false);
  const [isPlateValid, setIsPlateValid] = useState(true);
  const [validationTimeout, setValidationTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // MÉTODOS DE COBRANÇA
  // Carrega e gerencia métodos de cobrança disponíveis
  const [billingMethods, setBillingMethods] = useState<BillingMethodList[]>([]);
  const [selectedBillingMethod, setSelectedBillingMethod] = useState<BillingMethodList | null>(null);
  const [billingMethodsLoading, setBillingMethodsLoading] = useState(false);
  const { handleGetMethods } = useBillingMethod();

  const [observation, setObservation] = useState("");

  // CÂMERA PARA FOTOGRAFAR AVARIAS
  // URI da foto capturada fica armazenado para envio posterior no request
  const [cameraVisible, setCameraVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);

  const loadBillingMethods = async () => {
    setBillingMethodsLoading(true);
    try {
      const result = await handleGetMethods();
      if (result.success && result.methods) {
        setBillingMethods(result.methods);
      }
    } catch (error) {
      console.error('Erro ao carregar métodos de cobrança:', error);
    } finally {
      setBillingMethodsLoading(false);
    }
  };

  // VALIDAÇÃO DE PLACA COM REGEX
  // Aceita formatos: ABC1234, ABC-1234 e ABC1D23
  const validatePlateFormat = (plateValue: string): boolean => {
    if (!plateValue.trim()) return true;
    
    const cleanPlate = plateValue.trim().toUpperCase();
    const plateRegex = /^[A-Z]{3}[-]?[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    
    return plateRegex.test(cleanPlate);
  };

  // DEBOUNCE DE VALIDAÇÃO
  // Aguarda 1.5s após parar de digitar para validar a placa
  const handlePlateChange = (text: string) => {
    setPlate(text);
    
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
    
    if (!text.trim()) {
      setIsPlateValid(true);
      setIsValidating(false);
      return;
    }
    
    setIsValidating(true);
    
    const timeout = setTimeout(() => {
      const isValid = validatePlateFormat(text);
      setIsPlateValid(isValid);
      setIsValidating(false);
    }, 1500);
    
    setValidationTimeout(timeout);
  };

  // REGISTRO DE VEÍCULO
  // Envia dados para API e gerencia resposta (sucesso/erro)
  const handleRegister = async () => {
    const vehicleData = {
      plate: plate.trim(),
      category: selectedCategory,
      photo: capturedPhotoUri || undefined,
      observation: observation.trim() || undefined,
      billingMethod: selectedBillingMethod?.id || undefined,
    };

    const result = await registerVehicle(vehicleData);

    setModalMessage(result.message);
    setModalIsSuccess(result.success);
    setModalVisible(true);

    if (result.success && result.ticket) {
      setPdfBase64(result.ticket);
      setPdfPreviewVisible(true);
      
      // Limpa formulário após sucesso para novo registro (mas mantém o PDF)
      setTimeout(() => {
        setPlate("");
        setSelectedCategory("carro");
        setObservation("");
        setSelectedBillingMethod(null);
        setCapturedPhotoUri(null); // Limpa foto capturada
        // Não limpa pdfBase64 aqui - só limpa quando fechar o preview
      }, 2000);
    }
  };

  const handleDownload = async () => {
    console.log("handleDownload chamado");
    console.log("pdfBase64:", pdfBase64 ? "disponível" : "não disponível");
    console.log("plate:", plate);

    if (!pdfBase64) {
      setModalMessage("Erro: PDF não disponível para download");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `ticket-${plate || 'veiculo'}-${dateStr}.pdf`;

    try {
      console.log("Iniciando download do PDF...");
      await downloadPdf(pdfBase64, filename);
      
      setModalMessage("PDF baixado com sucesso! Verifique sua pasta de downloads ou compartilhamentos.");
      setModalIsSuccess(true);
      setModalVisible(true);
    } catch (err) {
      console.error("Erro ao baixar o PDF:", err);
      
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao baixar o PDF";
      setModalMessage(`Erro ao baixar PDF: ${errorMessage}`);
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  };

  const handlePrint = async () => {
    if (!pdfBase64) {
      setModalMessage("Erro: PDF não disponível para impressão");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    try {
      console.log("Iniciando impressão do PDF...");
      await printPdf(pdfBase64);
      
      setModalMessage("Comando de impressão enviado com sucesso!");
      setModalIsSuccess(true);
      setModalVisible(true);
    } catch (err) {
      console.error("Erro ao imprimir o PDF:", err);
      
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao imprimir o PDF";
      setModalMessage(`Erro ao imprimir PDF: ${errorMessage}`);
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  };

  // CLEANUP DE TIMEOUTS
  // Evita vazamentos de memória ao desmontar componente
  useEffect(() => {
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [validationTimeout]);

  useEffect(() => {
    loadBillingMethods();
  }, []);

  // CÂMERA PARA AVARIAS (SEM QR CODE)
  // Função mantida apenas para compatibilidade com CameraComponent
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    console.log("Função de escaneamento não utilizada para registro de avarias");
  };

  const handleOpenCamera = () => {
    setCameraVisible(true);
    setIsScanning(false);
    setIsProcessing(false);
  };

  const handleCloseCamera = () => {
    setCameraVisible(false);
  };

  // ARMAZENAMENTO DA FOTO CAPTURADA
  // Recebe URI da foto e armazena para envio posterior no request
  const handlePhotoCaptured = (photoUri: string) => {
    setCapturedPhotoUri(photoUri);
  };

  // CÁLCULO DINÂMICO DE VALORES
  // Converte valores da API (string/number) e formata para exibição
  const getBillingValue = (): string => {
    if (!selectedBillingMethod) return "Ainda não selecionado";
    
    const value = selectedCategory === "carro" 
      ? selectedBillingMethod.carroValue 
      : selectedBillingMethod.motoValue;
    
    if (value === undefined || value === null) return "Ainda não selecionado";
    
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return "Ainda não selecionado";
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue);
  };

  // CONVERSÃO DE TEMPO
  // Converte minutos para formato hh:mm:ss
  const formatTimeFromMinutes = (minutes: number | string): string => {
    const numericMinutes = typeof minutes === 'string' ? parseInt(minutes) : minutes;
    
    if (numericMinutes === 0 || isNaN(numericMinutes)) return "00:00:00";
    
    const hours = Math.floor(numericMinutes / 60);
    const remainingMinutes = numericMinutes % 60;
    const seconds = 0; // Sempre 0 pois recebemos apenas minutos
    
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderCategoryOption = (option: typeof CATEGORY_OPTIONS[0]) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === option.value && styles.categoryButtonSelected,
        { borderColor: option.color }
      ]}
      onPress={() => setSelectedCategory(option.value as any)}
      disabled={loading}
    >
      <View style={[styles.categoryIconContainer, { backgroundColor: option.color }]}>
        <Ionicons name={option.icon as any} size={20} color={Colors.white} />
      </View>
      <View style={styles.categoryTextContainer}>
        <Text style={[
          styles.categoryButtonText,
          selectedCategory === option.value && styles.categoryButtonTextSelected
        ]}>
          {option.label}
        </Text>
      </View>
      {selectedCategory === option.value && (
        <View style={styles.categoryCheckmark}>
          <Ionicons name="checkmark-circle" size={20} color={option.color} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      {/* CÂMERA EM TELA CHEIA PARA AVARIAS */}
      {cameraVisible && (
        <View style={styles.cameraFullScreen}>
          <CameraComponent
            mode="default"
            onBarcodeScanned={handleBarcodeScanned}
            onManualAction={handleCloseCamera}
            onPhotoCaptured={handlePhotoCaptured}
            manualButtonText="Fechar Câmera"
            isProcessing={isProcessing}
            isScanning={false}
          />
        </View>
      )}

      {/* FORMULÁRIO PRINCIPAL */}
      {!cameraVisible && (
        <>
          <Header title="Entrada de Veículo" titleStyle={styles.header} />

          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.welcomeCard}>
                <View style={styles.welcomeHeader}>
                  <View style={styles.welcomeIcon}>
                    <Ionicons name="car" size={32} color={Colors.white} />
                  </View>
                  <View style={styles.welcomeInfo}>
                    <Text style={styles.welcomeTitle}>
                      {plate.trim() ? `${plate.toUpperCase()}` : "Placa do Veículo"}
                    </Text>
                    <Text style={styles.welcomeDescription}>
                      Preencha os dados do veículo para registrar sua entrada no estacionamento.
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Placa do Veículo</Text>
                <TextInput
                  style={styles.textInput}
                  value={plate}
                  onChangeText={handlePlateChange}
                  placeholder="Digite a placa do veículo"
                  placeholderTextColor={Colors.gray[400]}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={8}
                />
                <Text style={[
                  styles.inputHint,
                  !isPlateValid && plate.trim() && !isValidating && styles.inputHintError,
                  isPlateValid && plate.trim() && !isValidating && styles.inputHintSuccess,
                  isValidating && styles.inputHintValidating
                ]}>
                  {isValidating && plate.trim()
                    ? "Validando placa..."
                    : !isPlateValid && plate.trim() 
                      ? "Formato inválido! Use ABC1234, ABC-1234 ou ABC1D23" 
                      : isPlateValid && plate.trim()
                        ? "✓ Placa aceita"
                        : "Digite a placa no formato ABC1234, ABC-1234 ou ABC1D23"
                  }
                </Text>
              </View>

              <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Categoria do Veículo</Text>
                <View style={styles.categoryButtons}>
                  {CATEGORY_OPTIONS.map((option) => (
                    <View key={option.value}>
                      {renderCategoryOption(option)}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.billingContainer}>
                <Text style={styles.billingLabel}>Método de Cobrança</Text>
                {billingMethods.filter(method => method.isActive).length === 0 ? (
                  <View style={styles.emptyBillingContainer}>
                    <View style={styles.emptyBillingIcon}>
                      <Ionicons name="card-outline" size={24} color={Colors.gray[400]} />
                    </View>
                    <View style={styles.emptyBillingContent}>
                      <Text style={styles.emptyBillingTitle}>Nenhum método disponível</Text>
                      <Text style={styles.emptyBillingMessage}>
                        Configure métodos de cobrança para continuar
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={billingMethods
                      .filter(method => method.isActive)
                      .map(method => ({
                        label: method.title,
                        value: method.id || method.title
                      }))}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Selecione um método de cobrança"
                    searchPlaceholder="Buscar..."
                    value={selectedBillingMethod?.id || selectedBillingMethod?.title || null}
                    onChange={(item) => {
                      const method = billingMethods.find(m => m.id === item.value || m.title === item.value);
                      setSelectedBillingMethod(method || null);
                    }}
                    renderLeftIcon={() => (
                      <Ionicons 
                        style={styles.icon} 
                        color={Colors.gray[500]} 
                        name="card" 
                        size={20} 
                      />
                    )}
                  />
                )}
              </View>

              {selectedBillingMethod && (
                <View style={styles.billingDataContainer}>
                  <Text style={styles.billingDataTitle}>Dados do Método Selecionado</Text>
                  
                  <View style={styles.billingDataRow}>
                    <Text style={styles.billingDataLabel}>Valor:</Text>
                    <Text style={styles.billingDataValue}>{getBillingValue()}</Text>
                  </View>
                  
                  {selectedBillingMethod.time !== undefined && selectedBillingMethod.time !== null && (
                    <View style={styles.billingDataRow}>
                      <Text style={styles.billingDataLabel}>Tempo de Permanência:</Text>
                      <Text style={styles.billingDataValue}>{formatTimeFromMinutes(selectedBillingMethod.time)}</Text>
                    </View>
                  )}
                  
                  <View style={styles.billingDataRow}>
                    <Text style={styles.billingDataLabel}>Tolerância:</Text>
                    <Text style={styles.billingDataValue}>{selectedBillingMethod.tolerance} minutos</Text>
                  </View>
                </View>
              )}

              <View style={styles.observationContainer}>
                <Text style={styles.observationLabel}>Observação (Opcional)</Text>
                <TextInput
                  style={styles.observationInput}
                  value={observation}
                  onChangeText={setObservation}
                  placeholder="Digite uma observação sobre o veículo..."
                  placeholderTextColor={Colors.gray[400]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={200}
                />
                <Text style={styles.observationHint}>
                  {observation.length}/200 caracteres
                </Text>
              </View>

              <View style={styles.cameraButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.cameraButton,
                    capturedPhotoUri && styles.cameraButtonSuccess
                  ]}
                  onPress={handleOpenCamera}
                  disabled={loading}
                >
                  <View style={[
                    styles.cameraButtonIcon,
                    capturedPhotoUri && styles.cameraButtonIconSuccess
                  ]}>
                    <Ionicons 
                      name={capturedPhotoUri ? "checkmark" : "camera"} 
                      size={24} 
                      color={Colors.white} 
                    />
                  </View>
                  <View style={styles.cameraButtonText}>
                    <Text style={styles.cameraButtonTitle}>
                      {capturedPhotoUri ? "Foto Registrada" : "Registrar Avaria"}
                    </Text>
                    <Text style={styles.cameraButtonSubtitle}>
                      {capturedPhotoUri 
                        ? "Foto capturada com sucesso" 
                        : "Fotografe avarias ou problemas do veículo"
                      }
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.gray[500]} />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <PrimaryButton
                  title={loading ? "Registrando..." : "Confirmar Entrada"}
                  onPress={handleRegister}
                  style={[
                    styles.buttonConfirm, 
                    (!plate.trim() || !isPlateValid || isValidating || billingMethods.filter(method => method.isActive).length === 0) && styles.buttonDisabled
                  ]}
                  disabled={loading || !plate.trim() || !isPlateValid || isValidating || billingMethods.filter(method => method.isActive).length === 0}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}

      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        type={modalIsSuccess ? 'success' : 'error'}
        onClose={() => setModalVisible(false)}
        dismissible={!modalIsSuccess}
        onBackPress={() => {
          if (modalIsSuccess) {
            router.back();
          }
        }}
        autoNavigateOnSuccess={modalIsSuccess}
        navigateDelay={2000}
      />
      
      <PreviewPDF
        base64={pdfBase64 || ""}
        visible={pdfPreviewVisible}
        onClose={() => {
          setPdfPreviewVisible(false);
          setPdfBase64(null); // Limpa o PDF quando fechar o preview
        }}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />
    </View>
  );
}