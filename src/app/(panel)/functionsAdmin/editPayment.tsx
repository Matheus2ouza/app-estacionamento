import ConfirmationModal from "@/src/components/ConfirmationModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import Colors from "@/src/constants/Colors";
import { useBillingMethod } from "@/src/hooks/cash/useBillingMethod";
import { styles } from "@/src/styles/functions/editPaymentStyle";
import { changeOptions } from "@/src/types/billingMethod";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";

export default function EditPayment() {
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    category: string;
    tolerance: string;
    time?: string;
    carPrice: string;
    motoPrice: string;
  }>();

  console.log('params', params);

  const [change, setChange] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tolerance, setTolerance] = useState<string>("");
  const [time, setTime] = useState<string>("00:00:00");
  const [carPrice, setCarPrice] = useState<string>("");
  const [motoPrice, setMotoPrice] = useState<string>("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date(2024, 0, 1, 0, 0, 0));
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [specialCase, setSpecialCase] = useState<{
    title: string;
    message: string;
    errors: ("tolerance" | "time" | "carPrice" | "motoPrice")[];
  } | undefined>(undefined);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const { loading, error, success, message, handleUpdatePutMethod } = useBillingMethod();

  const selectedOption = changeOptions.find(option => option.value === change);
  const isFixedValue = change === "VALOR_FIXO";

  // Carrega os dados recebidos via path apenas uma vez
  useEffect(() => {
    if (params && !dataLoaded) {
      setChange(params.category || "");
      setTitle(params.title || "");
      setTolerance(params.tolerance || "");
      
      const defaultTime = new Date(2024, 0, 1, 0, 0, 0);
      
      if (params.time === "0" || !params.time?.trim()) {
        setTime("00:00:00");
        setSelectedTime(defaultTime);
      } else {
        const minutes = parseInt(params.time);
        if (!isNaN(minutes)) {
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          const formattedTime = `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`;
          setTime(formattedTime);
          setSelectedTime(new Date(2024, 0, 1, hours, remainingMinutes, 0));
        } else {
          setTime("00:00:00");
          setSelectedTime(defaultTime);
        }
      }
      
      setCarPrice(params.carPrice || "");
      setMotoPrice(params.motoPrice || "");
      setDataLoaded(true);
    }
  }, [params, dataLoaded]);

  const handleDisabledFieldPress = () => {
    if (isFixedValue) {
      setFeedbackMessage("Campo desabilitado para valor fixo");
      setFeedbackType('info');
      setShowFeedback(true);
    }
  };

  const getTimePlaceholder = () => {
    const placeholders = {
      POR_HORA: "HH:MM (Ex: 02:30 = 2h 30min)",
      POR_MINUTO: "HH:MM (Ex: 00:30 = 30min)"
    };
    return placeholders[change as keyof typeof placeholders] || "HH:MM";
  };

  const handleTimePickerConfirm = (date: Date) => {
    setShowTimePicker(false);
    
    const newSelectedTime = new Date(2024, 0, 1, date.getHours(), date.getMinutes(), date.getSeconds());
    setSelectedTime(newSelectedTime);
    
    const formattedTime = [
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
      date.getSeconds().toString().padStart(2, '0')
    ].join(':');
    
    setTime(formattedTime);
  };

  const handleTimePickerCancel = () => {
    setShowTimePicker(false);
  };

  const handleToleranceChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setTolerance(cleanText);
  };

  const handleUpdate = async () => {
    if (!selectedOption || !title.trim() || !carPrice || !motoPrice) {
      const messages = {
        noOption: "Selecione um método de cobrança",
        noTitle: "Digite um título",
        noPrices: "Digite os preços para carro e moto"
      };
      
      setFeedbackMessage(
        !selectedOption ? messages.noOption :
        !title.trim() ? messages.noTitle : messages.noPrices
      );
      setFeedbackType('error');
      setShowFeedback(true);
      return;
    }

    const toleranceValue = parseInt(tolerance) || 0;
    
    if (!isFixedValue && (toleranceValue === 0 || toleranceValue > 60)) {
      const isZero = toleranceValue === 0;
      setSpecialCase({
        title: "Atenção: Tolerância inválida",
        message: isZero 
          ? "Você definiu a tolerância como 0 minutos. Isso significa que não haverá tempo gratuito para os clientes."
          : "Você definiu a tolerância como maior que 60 minutos. O valor máximo permitido é 60 minutos.",
        errors: ["tolerance"]
      });
      setShowConfirmation(true);
      return;
    }
    
    const isPriceZeroOrEmpty = (price: string): boolean => {
      if (!price?.trim()) return true;
      
      let cleanPrice = price.replace(/\s/g, '').replace(/[^\d,.-]/g, '');
      if (cleanPrice.includes(',')) {
        cleanPrice = cleanPrice.replace(',', '.');
      }
      
      const numericPrice = parseFloat(cleanPrice);
      return isNaN(numericPrice) || numericPrice === 0;
    };

    if (isPriceZeroOrEmpty(carPrice) || isPriceZeroOrEmpty(motoPrice)) {
      const priceErrors: ("carPrice" | "motoPrice")[] = [];
      const messages = {
        car: "Você definiu o preço do carro como 0. Isso significa que não haverá cobrança para os clientes.",
        moto: "Você definiu o preço da moto como 0. Isso significa que não haverá cobrança para os clientes."
      };
      
      if (isPriceZeroOrEmpty(carPrice)) {
        priceErrors.push("carPrice");
      }
      if (isPriceZeroOrEmpty(motoPrice)) {
        priceErrors.push("motoPrice");
      }
      
      setSpecialCase({
        title: "Atenção: Preços Zerados",
        message: priceErrors.includes("carPrice") ? messages.car : messages.moto,
        errors: priceErrors
      });
      setShowConfirmation(true);
      return;
    }
    
    setSpecialCase(undefined);
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    if (feedbackType === 'success') {
      router.back();
    }
  };

  const updateBillingMethod = async () => {
    if (!selectedOption) return;
    
    const toleranceValue = parseInt(tolerance) || 0;
    const timeValue = isFixedValue ? undefined : time;
    const finalToleranceValue = isFixedValue ? 0 : toleranceValue;
    
    const result = await handleUpdatePutMethod({
      id: params.id!,
      title: title.trim(),
      category: change,
      tolerance: finalToleranceValue.toString(),
      time: timeValue,
      carPrice: carPrice,
      motoPrice: motoPrice
    });

    setFeedbackMessage(result.message);
    setFeedbackType(result.success ? 'success' : 'error');
    setShowFeedback(true);
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmation(false);
    await updateBillingMethod();
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <Header title="Editar Dados da Cobrança" titleStyle={{ fontSize: 25, fontWeight: 'bold' }} />
        
        <View style={styles.contentWrapper}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            
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
                Você pode editar o título, tolerância, tempo de cobrança e preços. O método de cobrança não pode ser alterado após a criação.
              </Text>
            </View>

            {/* Método de Cobrança - APENAS LEITURA */}
            <View style={styles.methodContainer}>
              <Text style={styles.methodLabel}>
                Método de Cobrança
              </Text>
              <View style={styles.methodField}>
                <View style={styles.methodContent}>
                  <View style={styles.methodLeft}>
                    <View style={styles.methodIconContainer}>
                      <Ionicons name="card-outline" size={22} color="#475569" />
                    </View>
                    <Text style={styles.methodText}>
                      {selectedOption ? selectedOption.label : "Carregando..."}
                    </Text>
                  </View>
                  <View style={styles.methodBadge}>
                    <Text style={styles.methodBadgeText}>
                      Somente Leitura
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.methodDescription}>
                O método de cobrança não pode ser alterado após a criação
              </Text>
            </View>

            {/* Seção de Configurações */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Configurações de Preços</Text>
              </View>
              
              {/* Título */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Título</Text>
                <TextInput
                  style={[
                    styles.input, 
                    title ? styles.inputWithText : styles.inputWithPlaceholder
                  ]}
                  placeholder="Digite o título"
                  placeholderTextColor="#999"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Tolerância */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tolerância (minutos)</Text>
                {isFixedValue ? (
                  <TouchableOpacity
                    style={[styles.input, styles.inputDisabled]}
                    onPress={handleDisabledFieldPress}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.disabledText}>Campo desabilitado para valor fixo</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <View style={styles.timeInputContainer}>
                      <TextInput
                        style={[styles.timeInput, tolerance ? styles.inputWithText : styles.inputWithPlaceholder]}
                        placeholder="Ex: 15 (15m de tolerância)"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={tolerance}
                        onChangeText={handleToleranceChange}
                      />
                      <View style={styles.timeUnitContainer}>
                        <Text style={styles.timeUnitText}>min tolerância</Text>
                      </View>
                    </View>
                    <Text style={styles.optionalText}>
                      Tempo em que vai ser desconsiderado ao calcular o valor do pagamento.
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Tempo {selectedOption?.typeTime && selectedOption.typeTime !== 'deactivated' ? `(${selectedOption.typeTime})` : ''}
                </Text>
                {isFixedValue ? (
                  <TouchableOpacity
                    style={[styles.input, styles.inputDisabled]}
                    onPress={handleDisabledFieldPress}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.disabledText}>Campo desabilitado para valor fixo</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.timeInputContainer}
                      onPress={() => setShowTimePicker(true)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.timeInput,
                          time !== "00:00:00" ? styles.inputWithText : styles.inputWithPlaceholder,
                          { paddingVertical: 16, textAlign: 'left', color: time !== "00:00:00" ? '#000' : '#999' }
                        ]}
                      >
                        {time !== "00:00:00" ? time : getTimePlaceholder()}
                      </Text>
                      <View style={styles.timeUnitContainer}>
                        <Text style={styles.timeUnitText}>selecionar</Text>
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.optionalText}>
                      Tempo atual configurado: {time !== "00:00:00" ? time : "00:00:00"}. 
                      {time !== "00:00:00" ? " Se desejar manter o mesmo tempo, selecione-o novamente." : " Selecione o tempo de cobrança."}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Preço Carro</Text>
                <TextInput
                  style={[
                    styles.input, 
                    carPrice ? styles.inputWithText : styles.inputWithPlaceholder
                  ]}
                  placeholder="R$ 00,00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={carPrice}
                  onChangeText={(text) => {
                    const cleanText = text.replace(/[^\d,.-]/g, '');
                    setCarPrice(cleanText);
                  }}
                />
              </View>

              {/* Preço Moto */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Preço Moto</Text>
                <TextInput
                  style={[
                    styles.input, 
                    motoPrice ? styles.inputWithText : styles.inputWithPlaceholder
                  ]}
                  placeholder="R$ 00,00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={motoPrice}
                  onChangeText={(text) => {
                    const cleanText = text.replace(/[^\d,.-]/g, '');
                    setMotoPrice(cleanText);
                  }}
                />
              </View>
            </View>

            {/* Botões */}
            <View style={styles.buttonContainer}>
              <SecondaryButton
                title="Voltar"
                onPress={handleCancel}
                style={styles.cancelButton}
              />

              <PrimaryButton
                title={loading ? "Salvando..." : "Salvar Alterações"}
                onPress={handleUpdate}
                style={styles.saveButton}
                disabled={loading}
              />
            </View>
          </ScrollView>
        </View>

        <DatePicker
          modal
          open={showTimePicker}
          date={selectedTime}
          mode="time"
          onConfirm={handleTimePickerConfirm}
          onCancel={handleTimePickerCancel}
          locale="pt-BR"
          title="Selecionar Tempo"
          confirmText="Confirmar"
          cancelText="Cancelar"
          minuteInterval={1}
          is24hourSource="locale"
          buttonColor={Colors.blue.dark}
          dividerColor={Colors.blue.light}
        />

        <FeedbackModal
          visible={showFeedback}
          message={feedbackMessage}
          type={feedbackType}
          onClose={handleFeedbackClose}
          dismissible={true}
          onBackPress={() => router.back()}
          autoNavigateOnSuccess={false}
          navigateDelay={2000}
        />

        <ConfirmationModal
          visible={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmUpdate}
          data={{
            title,
            category: change!,
            tolerance,
            time: isFixedValue ? undefined : time,
            carPrice,
            motoPrice
          }}
          specialCase={specialCase}
          confirmText="Confirmar"
          cancelText="Voltar e ajustar"
          loading={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
