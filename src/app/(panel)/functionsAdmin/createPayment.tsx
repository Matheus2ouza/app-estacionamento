import ConfirmationModal from "@/src/components/ConfirmationModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import Colors from "@/src/constants/Colors";
import { useBillingMethod } from "@/src/hooks/cash/useBillingMethod";
import { styles } from "@/src/styles/functions/createPaymentStyle";
import { changeOptions } from "@/src/types/billingMethodTypes/billingMethod";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { Dropdown } from "react-native-element-dropdown";
import { Provider as PaperProvider } from "react-native-paper";

export default function CreatePayment() {
  const [change, setChange] = useState<string>();
  const [title, setTitle] = useState<string>("");
  const [tolerance, setTolerance] = useState<string>("");
  const [time, setTime] = useState<string>("00:00:00");
  const [carPrice, setCarPrice] = useState<string>("");
  const [motoPrice, setMotoPrice] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [specialCase, setSpecialCase] = useState<{
    title: string;
    message: string;
    errors: ("tolerance" | "time" | "carPrice" | "motoPrice")[];
  } | undefined>(undefined);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date(2024, 0, 1, 0, 0, 0));

  const { loading, error, success, message, handleSaveMethod } = useBillingMethod();

  const selectedOption = changeOptions.find(option => option.value === change);
  const isFixedValue = change === "VALOR_FIXO";

  const handleChange = (item: any) => {
    setChange(item.value);
  };

  const handleDisabledFieldPress = () => {
    if (isFixedValue) {
      setFeedbackMessage("Campo desabilitado para valor fixo");
      setFeedbackType('info');
      setShowFeedback(true);
    }
  };

  const getTimePlaceholder = () => {
    if (change === "POR_HORA") {
      return "HH:MM (Ex: 02:30 = 2h 30min)";
    } else if (change === "POR_MINUTO") {
      return "HH:MM (Ex: 00:30 = 30min)";
    }
    return "HH:MM";
  };

  const handleTimePickerConfirm = (date: Date) => {
    setShowTimePicker(false);
    
    // Criar uma nova data com o horário selecionado mas data fixa
    const newSelectedTime = new Date(2024, 0, 1, date.getHours(), date.getMinutes(), date.getSeconds());
    setSelectedTime(newSelectedTime);
    
    // Formatar para HH:MM:SS
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
    setTime(formattedTime);
  };

  const handleTimePickerCancel = () => {
    setShowTimePicker(false);
  };

  const handleToleranceChange = (text: string) => {
    // Permitir apenas números
    const cleanText = text.replace(/[^0-9]/g, '');
    setTolerance(cleanText);
  };

  const handleSave = async () => {
    console.log('Debug - handleSave called, change:', change);
    
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

    // Verificar se tolerância é zero para mostrar aviso especial
    const toleranceValue = parseInt(tolerance) || 0;
    
    // Verificar tolerância zero apenas se não for VALOR_FIXO
    if (!isFixedValue && toleranceValue === 0) {
      setSpecialCase({
        title: "Atenção: Tolerância inválida",
        message: "Você definiu a tolerância como 0 minutos. Isso significa que não haverá tempo gratuito para os clientes.",
        errors: ["tolerance"]
      });
      setShowConfirmation(true);
      return;
    }
    if (!isFixedValue && toleranceValue > 60) {
      setSpecialCase({
        title: "Atenção: Tolerância inválida",
        message: "Você definiu a tolerância como maior que 60 minutos. O valor máximo permitido é 60 minutos.",
        errors: ["tolerance"]
      });
      setShowConfirmation(true);
      return;
    }
    
    // Função para verificar se o preço é zero ou vazio
    const isPriceZeroOrEmpty = (price: string): boolean => {
      if (!price || price.trim() === '') return true;
      
      // Remove espaços e caracteres não numéricos exceto vírgula e ponto
      let cleanPrice = price.replace(/\s/g, '').replace(/[^\d,.-]/g, '');
      
      // Se tem vírgula, substitui por ponto
      if (cleanPrice.includes(',')) {
        cleanPrice = cleanPrice.replace(',', '.');
      }
      
      const numericPrice = parseFloat(cleanPrice);
      return isNaN(numericPrice) || numericPrice === 0;
    };

    // Verificar preços zerados
    if (isPriceZeroOrEmpty(carPrice) || isPriceZeroOrEmpty(motoPrice)) {
      const priceErrors: ("carPrice" | "motoPrice")[] = [];
      let message = "";
      
      if (isPriceZeroOrEmpty(carPrice)) {
        message = "Você definiu o preço do carro como 0. Isso significa que não haverá cobrança para os clientes.";
        priceErrors.push("carPrice");
      }
      if (isPriceZeroOrEmpty(motoPrice)) {
        message = "Você definiu o preço da moto como 0. Isso significa que não haverá cobrança para os clientes.";
        priceErrors.push("motoPrice");
      }
      
      setSpecialCase({
        title: "Atenção: Preços Zerados",
        message: message,
        errors: priceErrors
      });
      setShowConfirmation(true);
      return;
    }

    // Verificar se o tempo é válido apenas para POR_MINUTO
    if (change === 'POR_MINUTO') {
      console.log('Debug - Entrou na validação POR_MINUTO, time:', time);
      
      // Verificar se o tempo não foi selecionado
      if (time === "00:00:00") {
        const errorCase = {
          title: "Erro: Tempo não selecionado",
          message: "Por favor, selecione um tempo válido para este método de cobrança.",
          errors: ["time"] as ("tolerance" | "time" | "carPrice" | "motoPrice")[]
        };
        console.log('Debug - Setting specialCase:', errorCase);
        setSpecialCase(errorCase);
        setShowConfirmation(true);
        return;
      }
      
      // Verificar se os minutos são válidos (0-59)
      const timeParts = time.split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      
      // Para POR_MINUTO, só considerar os minutos (0-59)
      if (minutes < 1 || minutes > 59) {
        setSpecialCase({
          title: "Erro: Tempo Inválido",
          message: "Para cobrança por minuto, o tempo deve ser entre 1 e 59 minutos. Por favor, ajuste o tempo selecionado.",
          errors: ["time"]
        });
        setShowConfirmation(true);
        return;
      }
      
      // Verificar se há horas (não permitido para POR_MINUTO)
      if (hours > 0) {
        setSpecialCase({
          title: "Erro: Tempo Inválido",
          message: "Para cobrança por minuto, não é permitido usar horas. Selecione apenas minutos.",
          errors: ["time"]
        });
        setShowConfirmation(true);
        return;
      }
    }
    
    // Se não há erros, mostra confirmação normal
    setSpecialCase(undefined);
    setShowConfirmation(true);
  };

  const saveBillingMethod = async () => {
    const result = await handleSaveMethod({
      title: title.trim(),
      category: change!,
      tolerance,
      time: time,
      carPrice,
      motoPrice
    });

    setFeedbackMessage(result.message);
    setFeedbackType(result.success ? 'success' : 'error');
    setShowFeedback(true);
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    if (feedbackType === 'success') {
      router.back();
    }
  };

  const handleConfirmSave = async () => {
    setShowConfirmation(false);
    await saveBillingMethod();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      keyboardVerticalOffset={0}
    >
      <View style={{ flex: 1 }}>
        <Header title="Forma de Cobrança e Preços" titleStyle={styles.header} />

        <ScrollView contentContainerStyle={styles.container}>
          <PaperProvider>
            <View style={styles.contentWrapper}>
              <Dropdown
                data={changeOptions}
                onChange={handleChange}
                labelField="label"
                valueField="value"
                placeholder="Selecione o método de cobrança"
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItemText}
                selectedTextStyle={styles.dropdownSelectedText}
              />
              
              {selectedOption && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>
                    {selectedOption.description}
                  </Text>
                </View>
              )}

              {selectedOption && (
                <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Configurações de Preços</Text>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Título</Text>
                  <TextInput
                    style={[styles.input, title ? styles.inputWithText : styles.inputWithPlaceholder]}
                    placeholder="Digite o título"
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

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
                          <Text style={styles.timeUnitText}>
                            min tolerância
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.optionalText}>Tempo em que vai ser desconsiderado ao calcular o valor do pagamento.</Text>
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
                        <Text style={styles.timeUnitText}>
                          selecionar
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Preço Carro</Text>
                  <TextInput
                    style={[styles.input, carPrice ? styles.inputWithText : styles.inputWithPlaceholder]}
                    placeholder="R$ 00,00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={carPrice}
                    onChangeText={(text) => {
                      // Permitir apenas números, vírgula e ponto
                      const cleanText = text.replace(/[^\d,.-]/g, '');
                      setCarPrice(cleanText);
                    }}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Preço Moto</Text>
                  <TextInput
                    style={[styles.input, motoPrice ? styles.inputWithText : styles.inputWithPlaceholder]}
                    placeholder="R$ 00,00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={motoPrice}
                    onChangeText={(text) => {
                      // Permitir apenas números, vírgula e ponto
                      const cleanText = text.replace(/[^\d,.-]/g, '');
                      setMotoPrice(cleanText);
                    }}
                  />
                </View>
                
                <PrimaryButton
                  title={loading ? "Salvando..." : "Salvar Configurações"}
                  onPress={handleSave}
                  style={styles.button}
                  disabled={loading}
                />
              </View>
              )}
            </View>
          </PaperProvider>
        </ScrollView>
      </View>

      <ConfirmationModal
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSave}
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
    </KeyboardAvoidingView>
  );
}