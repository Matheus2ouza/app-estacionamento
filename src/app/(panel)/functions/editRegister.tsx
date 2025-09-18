import CameraComponent from "@/components/CameraComponent";
import FeedbackModal from "@/components/FeedbackModal";
import GenericConfirmationModal from "@/components/GenericConfirmationModal";
import Header from "@/components/Header";
import PDFViewer from "@/components/PDFViewer";
import PhotoViewerModal from "@/components/PhotoViewerModal";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import Colors from "@/constants/Colors";
import { useBillingMethod } from "@/hooks/cash/useBillingMethod";
import useEditVehicle from "@/hooks/vehicleFlow/useEditVehicle";
import { useVehiclePhoto } from "@/hooks/vehicleFlow/useVehiclePhoto";
import { styles } from "@/styles/functions/editStyle";
import { BillingMethodList } from "@/types/billingMethodTypes/billingMethod";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Spinner from "react-native-loading-spinner-overlay";

interface RouteParams {
  id?: string;
  category?: "carro" | "moto";
  plate?: string;
  observation?: string;
  billingMethodId?: string;
  billingMethodTitle?: string;
  photoType?: string;
}

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

export default function EditRegister() {
  // Parâmetros da rota
  const params = useLocalSearchParams() as RouteParams;
  const { loading: loadingImage, error: photoError, fetchVehiclePhoto, invalidateCache } = useVehiclePhoto();
  const categoryParam = (params.category || "carro").toLowerCase() as
    | "carro"
    | "moto";

  // Estados principais
  const [plate, setPlate] = useState(params.plate || "");
  const [selectedCategory, setSelectedCategory] = useState<
    "carro" | "moto"
  >(categoryParam);
  const [observation, setObservation] = useState(params.observation || "");
  
  // Estados para modais e feedback
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  // Estados para modal de confirmação
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  
  // Estados para modal de geração de ticket
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  
  // Estados para PDF do ticket
  const [ticketPdf, setTicketPdf] = useState<string | null>(null);
  const [ticketPdfVisible, setTicketPdfVisible] = useState(false);

  // Estados para imagem do veículo
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  // Estados para métodos de cobrança
  const [billingMethods, setBillingMethods] = useState<BillingMethodList[]>([]);
  const [selectedBillingMethod, setSelectedBillingMethod] = useState<BillingMethodList | null>(null);
  const [billingMethodsLoading, setBillingMethodsLoading] = useState(false);
  const { handleGetMethods } = useBillingMethod();

  // Validação de placa
  const [isValidating, setIsValidating] = useState(false);
  const [isPlateValid, setIsPlateValid] = useState(true);
  const [validationTimeout, setValidationTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Hooks
  const {
    updateVehicle,
    updateVehiclePhoto,
    deleteVehiclePhoto,
    loading,
    error,
    success,
  } = useEditVehicle();

  // Carregar métodos de cobrança
  const loadBillingMethods = async () => {
    setBillingMethodsLoading(true);
    try {
      const result = await handleGetMethods();
      if (result.success && result.methods) {
        setBillingMethods(result.methods);
        
        // Preencher método de cobrança selecionado se passado por parâmetro
        if (params.billingMethodId || params.billingMethodTitle) {
          const method = result.methods.find((m: BillingMethodList) => 
            m.id === params.billingMethodId || m.title === params.billingMethodTitle
          );
          if (method) {
            setSelectedBillingMethod(method);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar métodos de cobrança:', error);
    } finally {
      setBillingMethodsLoading(false);
    }
  };

  // Função para buscar foto automaticamente
  const loadVehiclePhoto = async () => {
    if (!params.id || loadingImage) {
      return;
    }
    
    setLoadingPhoto(true);
    try {
      const photoData = await fetchVehiclePhoto(params.id);
      
      if (photoData) {
        setVehicleImage(photoData.photo);
      } else {
        setVehicleImage(null);
      }
      // Não mostrar erro se não houver foto, pois é opcional
    } catch (error) {
      // Erro silencioso para foto opcional
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleViewImage = async () => {
    if (loadingImage) {
      return;
    }
    
    try {
      const photoData = await fetchVehiclePhoto(params.id!);
      
      if (photoData) {
        setVehicleImage(photoData.photo);
        setPhotoViewerVisible(true);
      } else if (photoError) {
        setFeedbackMessage(photoError);
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      setFeedbackMessage('Não foi possível carregar a imagem');
      setFeedbackType('error');
      setShowFeedback(true);
    }
  };

  // Validação de placa
  const validatePlateFormat = (plateValue: string): boolean => {
    if (!plateValue.trim()) return true;
    
    const cleanPlate = plateValue.trim().toUpperCase();
    const plateRegex = /^[A-Z]{3}[-]?[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    
    return plateRegex.test(cleanPlate);
  };

  // Debounce de validação
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

  // Efeitos
  useEffect(() => {
    loadBillingMethods();
    loadVehiclePhoto();
  }, []);

  // useEffect removido - as mensagens são definidas diretamente nas funções


  // Validação e preparação para confirmação
  const handleUpdate = () => {
    // Validação dos dados obrigatórios
    if (!plate.trim() || !isPlateValid || isValidating || !selectedBillingMethod) {
      setFeedbackMessage("Por favor, preencha todos os campos obrigatórios: placa, categoria e método de cobrança.");
      setFeedbackType('error');
      setShowFeedback(true);
      return;
    }

    if (!params.id) {
      setFeedbackMessage("ID do veículo não encontrado.");
      setFeedbackType('error');
      setShowFeedback(true);
      return;
    }

    // Mostrar modal de confirmação
    setConfirmationVisible(true);
  };

  // Execução real da atualização após confirmação
  const handleConfirmUpdate = async () => {
    setConfirmationVisible(false);
    
    // Mostrar modal para gerar ticket (sem enviar para API ainda)
    setTicketModalVisible(true);
  };

  // Funções auxiliares para formatação
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

  const formatTimeFromMinutes = (minutes: number | string): string => {
    const numericMinutes = typeof minutes === 'string' ? parseInt(minutes) : minutes;
    
    if (numericMinutes === 0 || isNaN(numericMinutes)) return "00:00:00";
    
    const hours = Math.floor(numericMinutes / 60);
    const remainingMinutes = numericMinutes % 60;
    const seconds = 0;
    
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Funções para controle de imagem
  const handleOpenCamera = () => {
    setCameraVisible(true);
    setIsProcessing(false);
  };

  const handleCloseCamera = () => {
    setCameraVisible(false);
  };

  const handlePhotoCaptured = async (photoUri: string) => {
    if (!params.id) {
      setFeedbackMessage("ID do veículo não encontrado.");
      setFeedbackType('error');
      setShowFeedback(true);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await updateVehiclePhoto(params.id, photoUri);
      
      if (result.success) {
        // Invalidar cache para forçar nova busca na API
        invalidateCache(params.id);
        
        // Fazer nova busca da foto após atualização
        setLoadingPhoto(true);
        try {
          const photoData = await fetchVehiclePhoto(params.id);
          
          if (photoData) {
            setVehicleImage(photoData.photo);
          } else {
            setVehicleImage(null);
          }
        } catch (error) {
          // Erro silencioso
        } finally {
          setLoadingPhoto(false);
        }
        
        setCameraVisible(false);
        setFeedbackMessage(result.message || "Foto atualizada com sucesso");
        setFeedbackType('success');
        setShowFeedback(true);
      } else {
        setFeedbackMessage(result.message || "Erro ao atualizar foto");
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      setFeedbackMessage('Erro ao salvar a foto do veículo');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewPhoto = () => {
    if (vehicleImage) {
      setPhotoViewerVisible(true);
    }
  };

  const handleDeletePhoto = async () => {
    if (!params.id) {
      setFeedbackMessage("ID do veículo não encontrado.");
      setFeedbackType('error');
      setShowFeedback(true);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await deleteVehiclePhoto(params.id);
      
      if (result.success) {
        // Invalidar cache para forçar nova busca na API
        invalidateCache(params.id);
        
        // Fazer nova busca da foto após deleção para confirmar que foi removida
        setLoadingPhoto(true);
        try {
          const photoData = await fetchVehiclePhoto(params.id);
          
          if (photoData) {
            setVehicleImage(photoData.photo);
          } else {
            setVehicleImage(null);
          }
        } catch (error) {
          // Se não conseguir buscar a foto, assume que foi deletada
          setVehicleImage(null);
        } finally {
          setLoadingPhoto(false);
        }
        
        setFeedbackMessage(result.message || "Foto removida com sucesso");
        setFeedbackType('success');
        setShowFeedback(true);
      } else {
        setFeedbackMessage(result.message || "Erro ao remover foto");
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      setFeedbackMessage('Erro ao remover a foto do veículo');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setIsProcessing(false);
    }
  };


  // Função para atualizar o veículo na API
  const updateVehicleInAPI = async (requiredTicket: boolean = false) => {
    try {
      // Preparar dados para envio
      const vehicleData = {
        plate,
        category: selectedCategory,
        billingMethod: selectedBillingMethod?.id,
        observation: observation.trim() === "" ? null : observation.trim(),
        requiredTicket
      };

      const result = await updateVehicle(params.id!, vehicleData);
      
      if (result.success) {
        // Se foi solicitado ticket e ele foi retornado, mostrar o PDF
        if (requiredTicket && result.ticket) {
          setTicketPdf(result.ticket);
          setTicketPdfVisible(true);
        } else {
          setFeedbackMessage("Veículo atualizado com sucesso");
          setFeedbackType('success');
          setShowFeedback(true);
          
          // Volta para a tela anterior após um delay
          setTimeout(() => {
            router.back();
          }, 2000);
        }
      } else {
        setFeedbackMessage(result.message);
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (err) {
      // Erro tratado no hook
    }
  };

  // Funções para modal de ticket
  const handleGenerateTicket = async () => {
    setTicketModalVisible(false);
    
    // Atualizar veículo na API com requiredTicket = true
    await updateVehicleInAPI(true);
  };

  const handleSkipTicket = async () => {
    setTicketModalVisible(false);
    
    // Atualizar veículo na API com requiredTicket = false
    await updateVehicleInAPI(false);
  };

  // Funções para PDF do ticket
  const handleCloseTicketPdf = () => {
    setTicketPdfVisible(false);
    setTicketPdf(null);
    
    // Volta para a tela anterior após fechar o PDF
    setTimeout(() => {
      router.back();
    }, 500);
  };

  const handleTicketPdfSuccess = (message: string) => {
    setFeedbackMessage(message);
    setFeedbackType('success');
    setShowFeedback(true);
  };

  const handleTicketPdfError = (error: string) => {
    setFeedbackMessage(error);
    setFeedbackType('error');
    setShowFeedback(true);
  };


  // Cleanup de timeouts
  useEffect(() => {
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [validationTimeout]);

  const renderCategoryOption = (option: typeof CATEGORY_OPTIONS[0]) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === option.value && {
          ...styles.categoryButtonSelected,
          backgroundColor: option.color === Colors.blue[500] ? Colors.blue[50] : Colors.orange[50],
          borderColor: option.color
        },
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
          selectedCategory === option.value && {
            ...styles.categoryButtonTextSelected,
            color: option.color
          }
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
      {/* Câmera em tela cheia */}
      {cameraVisible && (
        <View style={styles.cameraFullScreen}>
          <CameraComponent
            mode="update"
            onManualAction={handleCloseCamera}
            onPhotoCaptured={handlePhotoCaptured}
            onUpdatePhoto={handlePhotoCaptured}
            manualButtonText="Fechar Câmera"
            isProcessing={isProcessing}
          />
        </View>
      )}

      {/* Formulário principal */}
      {!cameraVisible && (
        <>
      <Header title="Editar Veículo" titleStyle={styles.header} />

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
              <View style={[
                styles.welcomeIcon,
                { backgroundColor: selectedCategory === "carro" ? Colors.blue[500] : Colors.orange[500] }
              ]}>
                <Ionicons 
                  name={selectedCategory === "carro" ? "car" : "bicycle"} 
                  size={32} 
                  color={Colors.white} 
                />
              </View>
              <View style={styles.welcomeInfo}>
                <Text style={styles.welcomeTitle}>
                  {plate.trim() ? `${plate.toUpperCase()}` : "Placa do Veículo"}
                </Text>
                <Text style={styles.welcomeDescription}>
                  Edite os dados do veículo conforme necessário.
                </Text>
              </View>
            </View>
          </View>

          {/* Seção Informativa */}
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="information-circle" size={24} color="white" />
              </View>
              <Text style={styles.infoTitle}>
                Informações sobre Edição
              </Text>
            </View>
            <Text style={styles.infoDescription}>
              Você pode editar a placa, categoria e método de cobrança do veículo. A observação é opcional e pode ser usada para registrar informações adicionais sobre o veículo. Caso não queira mexer em algum dos campos, basta deixar o valor atual. No caso da foto, ela é atualizada separadamente dos dados do veículo.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Placa do Veículo <Text style={{ color: Colors.red[500] }}>*</Text>
            </Text>
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
            <Text style={styles.categoryLabel}>
              Categoria do Veículo <Text style={{ color: Colors.red[500] }}>*</Text>
            </Text>
            <View style={styles.categoryButtons}>
              {CATEGORY_OPTIONS.map((option) => (
                <View key={option.value}>
                  {renderCategoryOption(option)}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.billingContainer}>
            <Text style={styles.billingLabel}>
              Método de Cobrança <Text style={{ color: Colors.red[500] }}>*</Text>
            </Text>
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
              
              <View style={styles.billingDataRow}>
                <Text style={styles.billingDataLabel}>Tipo de Cobrança:</Text>
                <Text style={styles.billingDataValue}>
                  {selectedBillingMethod.category === 'POR_HORA' ? 'Por Hora' :
                   selectedBillingMethod.category === 'POR_MINUTO' ? 'Por Minuto' :
                   selectedBillingMethod.category === 'VALOR_FIXO' ? 'Valor Fixo' :
                   selectedBillingMethod.category}
                </Text>
              </View>
              
              {selectedBillingMethod.timeMinutes !== undefined && selectedBillingMethod.timeMinutes !== null && (
                <View style={styles.billingDataRow}>
                  <Text style={styles.billingDataLabel}>Tempo de Cobrança:</Text>
                  <Text style={styles.billingDataValue}>{formatTimeFromMinutes(selectedBillingMethod.timeMinutes)}</Text>
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

          {/* Campo de Imagem */}
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Foto do Veículo (Opcional)</Text>
            
            {vehicleImage ? (
              <View style={styles.imagePreviewContainer}>
                <View style={styles.imagePreview}>
                  <Ionicons name="image" size={48} color={Colors.blue[500]} />
                </View>
                
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={[styles.imageActionButton, styles.viewButton]}
                    onPress={handleViewPhoto}
                  >
                    <Ionicons name="eye" size={20} color={Colors.white} />
                    <Text style={styles.imageActionText}>Visualizar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.imageActionButton, styles.cameraButton]}
                    onPress={handleOpenCamera}
                    disabled={loading || isProcessing}
                  >
                    <Ionicons name="camera" size={20} color={Colors.white} />
                    <Text style={styles.imageActionText}>Nova Foto</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.imageActionButton, styles.deleteButton]}
                    onPress={handleDeletePhoto}
                    disabled={loading || isProcessing}
                  >
                    <Ionicons name="trash" size={20} color={Colors.white} />
                    <Text style={styles.imageActionText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.noImageContainer}
                onPress={handleOpenCamera}
                disabled={loading || isProcessing}
              >
                <View style={styles.noImageIcon}>
                  <Ionicons name="camera-outline" size={32} color={Colors.gray[400]} />
                </View>
                <View style={styles.noImageContent}>
                  <Text style={styles.noImageTitle}>Nenhuma foto registrada</Text>
                  <Text style={styles.noImageSubtitle}>
                    Toque para fotografar o veículo
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <SecondaryButton
              title="Cancelar"
              onPress={() => router.back()}
              style={styles.buttonCancel}
            />

            <PrimaryButton
              title={loading ? "Atualizando..." : "Salvar Alterações"}
              onPress={handleUpdate}
              style={styles.buttonConfirm}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
        </>
      )}

      <PhotoViewerModal
        visible={photoViewerVisible}
        onClose={() => setPhotoViewerVisible(false)}
        photoData={vehicleImage ? {
          photo: vehicleImage,
          photoType: "image/jpeg"
        } : null}
      />

      <GenericConfirmationModal
        visible={confirmationVisible}
        title="Confirmar Edição"
        message="Tem certeza que deseja salvar as alterações nos dados do veículo?"
        details="Uma vez confirmado, os dados do veículo serão atualizados no estacionamento e não podem ser restaurados para os que eram anteriores."
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setConfirmationVisible(false)}
        confirmButtonStyle="primary"
      />

      <GenericConfirmationModal
        visible={ticketModalVisible}
        title="Gerar Ticket"
        message="Deseja gerar um ticket com os dados atualizados do veículo?"
        confirmText="Gerar Ticket"
        cancelText="Pular"
        onConfirm={handleGenerateTicket}
        onCancel={handleSkipTicket}
        confirmButtonStyle="primary"
      />

      <Spinner
        visible={loadingPhoto || isProcessing}
        textContent={isProcessing ? "Processando..." : "Carregando foto do veículo..."}
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

      <FeedbackModal
        visible={showFeedback}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setShowFeedback(false)}
        dismissible={true}
        autoNavigateOnSuccess={false}
        navigateDelay={2000}
      />

      <PDFViewer
        base64={ticketPdf || ""}
        visible={ticketPdfVisible}
        onClose={handleCloseTicketPdf}
        filename={`ticket-${plate || 'veiculo'}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.pdf`}
        onSuccess={handleTicketPdfSuccess}
        onError={handleTicketPdfError}
      />
    </View>
  );
}