import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import Colors from "@/src/constants/Colors";
import { useBillingMethod } from "@/src/hooks/cash/useBillingMethod";
import useEditVehicle from "@/src/hooks/vehicleFlow/useEditVehicle";
import { styles } from "@/src/styles/functions/editStyle";
import { BillingMethodList } from "@/src/types/billingMethod";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

interface RouteParams {
  id?: string;
  category?: "carro" | "moto";
  plate?: string;
  observation?: string;
  billingMethodId?: string;
  billingMethodTitle?: string;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);

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
    editVehicle,
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
          const method = result.methods.find(m => 
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
  }, []);

  useEffect(() => {
    if (error || success) {
      // Reset states when error or success occurs
      setModalMessage(error || success ? "Operação realizada" : "");
      setModalIsSuccess(!!success);
      setModalVisible(!!(error || success));
    }
  }, [error, success]);

  // Funções auxiliares
  const closeFeedbackModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const showFeedback = useCallback((isSuccess: boolean, message: string) => {
    setModalIsSuccess(isSuccess);
    setModalMessage(message);
    setModalVisible(true);
  }, []);

  // Manipulação de dados
  const handleUpdate = async () => {
    // Validação dos dados obrigatórios
    if (!plate.trim() || !isPlateValid || isValidating || !selectedBillingMethod) {
      setModalMessage("Por favor, preencha todos os campos obrigatórios: placa, categoria e método de cobrança.");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    if (!params.id) {
      setModalMessage("ID do veículo não encontrado.");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    try {
      const result = await editVehicle(params.id, plate, selectedCategory);
      
      setModalMessage(result.message);
      setModalIsSuccess(result.success);
      setModalVisible(true);

      if (result.success) {
        // Volta para a tela anterior após sucesso
        setTimeout(() => {
          router.back();
        }, 2000);
      }
    } catch (err) {
      // Erro tratado no hook
    }
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
              <View style={styles.welcomeIcon}>
                <Ionicons name="car" size={32} color={Colors.white} />
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
    </View>
  );
}