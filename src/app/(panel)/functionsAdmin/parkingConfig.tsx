import FeedbackModal from "@/components/FeedbackModal";
import Header from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import Separator from "@/components/Separator";
import Colors from "@/constants/Colors";
import { useParkingConfig } from "@/hooks/parking/useParkingConfig";
import { styles } from "@/styles/functions/patioConfigStyle";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from "react";
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export default function ParkingConfig() {
  const {
    spots,
    loading: initialLoading,
    error,
    handleChange,
    handleSave,
    refreshData,
  } = useParkingConfig();

  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [saving, setSaving] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleSaveWithFeedback = async () => {
    // Validação dos inputs
    if (!spots.car || !spots.motorcycle) {
      setFeedbackMessage("Por favor, preencha todos os campos de configuração");
      setFeedbackType('warning');
      setShowFeedback(true);
      return;
    }

    const carSpots = parseInt(spots.car, 10);
    const motorcycleSpots = parseInt(spots.motorcycle, 10);

    if (carSpots < 0 || motorcycleSpots < 0) {
      setFeedbackMessage("As quantidades de vagas não podem ser negativas");
      setFeedbackType('warning');
      setShowFeedback(true);
      return;
    }

    if (carSpots === 0 && motorcycleSpots === 0) {
      setFeedbackMessage("Pelo menos um tipo de vaga deve ter quantidade maior que zero");
      setFeedbackType('warning');
      setShowFeedback(true);
      return;
    }

    setSaving(true);
    try {
      const result = await handleSave();
      if (result.success) {
        setFeedbackMessage(result.message || "Configurações salvas com sucesso!");
        setFeedbackType('success');
      } else {
        setFeedbackMessage(result.message || "Erro ao salvar configurações");
        setFeedbackType('error');
      }
      
      setShowFeedback(true);
    } catch (error) {
      setFeedbackMessage("Erro inesperado ao salvar configurações");
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setSaving(false);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRetry = async () => {
    await refreshData();
  };

  const handleInputChange = (key: keyof typeof spots, value: string) => {
    // Remove caracteres não numéricos
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    // Converte para número e valida
    const numericValue = cleanValue === '' ? '' : parseInt(cleanValue, 10).toString();
    
    // Limita a 3 dígitos
    if (numericValue.length <= 3) {
      handleChange(key, numericValue);
    }
  };

  // Tela de erro
  if (error && !initialLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Header title="Configurações do Estacionamento" titleStyle={styles.header} />
        
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <MaterialIcons name="error-outline" size={64} color={Colors.red.error} />
          </View>
          
          <Text style={styles.errorTitle}>Erro ao Carregar Dados</Text>
          
          <Text style={styles.errorMessage}>
            {error}
          </Text>
          
          <Text style={styles.errorSubtitle}>
            Verifique sua conexão com a internet e tente novamente.
          </Text>
          
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
            disabled={initialLoading}
          >
            <MaterialIcons name="refresh" size={24} color={Colors.white} />
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Configurações do Estacionamento" titleStyle={styles.header} />

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.blue.primary]}
            tintColor={Colors.blue.primary}
            title="Atualizando..."
            titleColor={Colors.text.primary}
          />
        }
      >
        
        {/* Seção Informativa */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="info" size={24} color="white" />
            </View>
            <Text style={styles.infoTitle}>
              Configuração de Vagas
            </Text>
          </View>
          <Text style={styles.infoDescription}>
            Configure a quantidade máxima de vagas disponíveis para cada tipo de veículo no estacionamento. 
            Estas configurações não afetam o controle de entrada de veículos. Ela servirá somente para controle de capacidade e para relatórios futuros.
          </Text>
        </View>

        {/* Seção de Configurações */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quantidade de Vagas</Text>
          </View>
          
          {/* Vagas para Carros */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Vagas para Carros</Text>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Quantidade máxima:</Text>
              <TextInput
                keyboardType="numeric"
                value={spots.car}
                onChangeText={(text) => handleInputChange("car", text)}
                onFocus={() => handleInputFocus("car")}
                onBlur={handleInputBlur}
                placeholder="0"
                style={[styles.numericInput, focusedInput === "car" && styles.inputFocused]}
                placeholderTextColor={Colors.text.secondary}
                maxLength={3}
                selectionColor={Colors.blue.primary}
                returnKeyType="next"
                blurOnSubmit={false}
              />
              <View style={styles.unitContainer}>
                <Text style={styles.unitText}>Vagas</Text>
              </View>
            </View>
            <Text style={styles.optionalText}>
              Define o número máximo de carros que podem estacionar simultaneamente
            </Text>
          </View>

          {/* Separador */}
          <Separator style={styles.separator}/>

          {/* Vagas para Motos */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Vagas para Motos</Text>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Quantidade máxima:</Text>
              <TextInput
                keyboardType="numeric"
                value={spots.motorcycle}
                onChangeText={(text) => handleInputChange("motorcycle", text)}
                onFocus={() => handleInputFocus("motorcycle")}
                onBlur={handleInputBlur}
                placeholder="0"
                style={[styles.numericInput, focusedInput === "motorcycle" && styles.inputFocused]}
                placeholderTextColor={Colors.text.secondary}
                maxLength={3}
                selectionColor={Colors.blue.primary}
                returnKeyType="done"
              />
              <View style={styles.unitContainer}>
                <Text style={styles.unitText}>Vagas</Text>
              </View>
            </View>
            <Text style={styles.optionalText}>
              Define o número máximo de motos que podem estacionar simultaneamente
            </Text>
          </View>
        </View>

      <View style={styles.button}>
        <PrimaryButton
          title={saving ? "Salvando..." : "Salvar Configurações"}
          style={styles.primaryButton}
          onPress={handleSaveWithFeedback}
          disabled={saving}
        />
      </View>
      </ScrollView>

      <FeedbackModal
        visible={showFeedback}
        message={feedbackMessage}
        type={feedbackType}
        onClose={handleFeedbackClose}
        dismissible={true}
        autoNavigateOnSuccess={false}
        navigateDelay={2000}
      />

      <Spinner
        visible={initialLoading}
        textContent="Carregando..."
        textStyle={{
          color: Colors.text.primary,
          fontSize: 16,
          fontWeight: '500'
        }}
        color={Colors.blue.primary}
        overlayColor={Colors.overlay.medium}
        size="large"
        animation="fade"
      />
    </View>
  );
}

