import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "@/src/components/Header";
import { usePaymentConfig } from "@/src/hooks/vehicleFlow/usePaymentConfig";
import { styles } from "@/src/styles/functions/createPaymentStyle";

const CreatePayment = () => {
  const {
    config,
    selectedMethod,
    isLoading,
    vehicleTypes,
    billingMethods,
    loadBillingMethods, // Adicionado
    saveConfig,
    updateRule,
    updateTolerance,
    selectMethodById,
  } = usePaymentConfig();

  const [isSaving, setIsSaving] = useState(false);
  const [displayValues, setDisplayValues] = useState<Record<string, string>>(
    {}
  );

  // Carrega os métodos de cobrança quando o componente é montado
  useEffect(() => {
    const fetchBillingMethods = async () => {
      try {
        await loadBillingMethods();
      } catch (error) {
        console.error("Failed to load billing methods:", error);
        // Você pode adicionar um alerta ou tratamento de erro aqui
      }
    };

    fetchBillingMethods();
  }, [loadBillingMethods]);

  const handleSave = async () => {
    if (!config) return;

    setIsSaving(true);
    try {
      await saveConfig(config);
      alert("Configuração salva com sucesso!");
    } catch (error) {
      alert("Erro ao salvar configuração");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDisplayValue = (
    value: number | undefined,
    key: string
  ): string => {
    return displayValues[key] ?? value?.toString().replace(".", ",") ?? "";
  };

  const handleCurrencyInput = (
    text: string,
    key: string,
    callback: (value: number) => void
  ) => {
    const cleaned = text.replace(/[^0-9,.]/g, "");
    setDisplayValues((prev) => ({ ...prev, [key]: cleaned }));
    const normalized = cleaned.replace(",", ".");
    const numericValue = parseFloat(normalized) || 0;
    callback(numericValue);
  };

  if (isLoading && billingMethods.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Configurar Forma de Cobrança"
        titleStyle={{ fontSize: 25 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Seleção do método */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Cobrança</Text>
          <View style={styles.methodsContainer}>
            {billingMethods.map((method) => (
              <TouchableOpacity
                key={method.id || method.name} // Usa name como fallback para key
                style={[
                  styles.methodButton,
                  selectedMethod?.id === (method.id || method.name) &&
                    styles.selectedMethod,
                ]}
                onPress={() => selectMethodById(method.id || method.name)}
              >
                <Text
                  style={[
                    styles.methodText,
                    selectedMethod?.id === (method.id || method.name) &&
                      styles.selectedMethodText,
                  ]}
                >
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedMethod && (
          <>
            {/* Descrição do método */}
            <View style={styles.section}>
              <Text style={styles.description}>
                {selectedMethod.description}
              </Text>
            </View>

            {/* Tolerância */}
            {selectedMethod.tolerance !== null && config && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tolerância (minutos)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={config.toleranceMinutes?.toString() || "0"}
                  onChangeText={(text) =>
                    updateTolerance(Number(text.replace(/[^0-9]/g, "")) || 0)
                  }
                  placeholder="Ex: 10"
                />
              </View>
            )}

            {/* Regras por tipo de veículo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Configuração por Tipo de Veículo
              </Text>

              {vehicleTypes.map((vehicle) => {
                const rule = config?.rules[vehicle.id];
                return (
                  <View key={vehicle.id} style={styles.vehicleSection}>
                    <Text style={styles.vehicleTitle}>{vehicle.name}</Text>

                    {/* Preço */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Preço</Text>
                      <TextInput
                        style={styles.input}
                        keyboardType="decimal-pad"
                        value={formatDisplayValue(
                          rule?.price,
                          `${vehicle.id}_price`
                        )}
                        onChangeText={(text) =>
                          handleCurrencyInput(
                            text,
                            `${vehicle.id}_price`,
                            (value) => updateRule(vehicle.id, "price", value)
                          )
                        }
                        placeholder="Ex: 5,00"
                      />
                    </View>

                    {/* Tempo base */}
                    <View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Tempo Base (minutos)</Text>
  <Text style={[styles.input, {paddingVertical: 12}]}>
    {selectedMethod?.name.includes("Hora") ? "60" : "30"}
  </Text>
</View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Botão de salvar */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving || !selectedMethod}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Configuração</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreatePayment;
