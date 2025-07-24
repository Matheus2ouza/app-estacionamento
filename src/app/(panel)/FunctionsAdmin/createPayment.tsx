import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import Header from "@/src/components/Header";
import { usePaymentConfig } from "@/src/hooks/vehicleFlow/usePaymentConfig";
import { BillingMethod } from "@/src/types/cash";
import Colors from "@/src/constants/Colors";

const CreatePayment = () => {
  const {
    config,
    selectedMethod,
    isLoading,
    vehicleTypes,
    billingMethods,
    saveConfig,
    updateValue,
    updateGlobalValue,
    updateTolerance,
    selectMethod
  } = usePaymentConfig();

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!config) return;
    
    setIsSaving(true);
    try {
      await saveConfig(config);
      // Aqui você adicionaria a chamada para seu backend:
      // await api.savePaymentConfig(config);
      alert("Configuração salva com sucesso!");
    } catch (error) {
      alert("Erro ao salvar configuração");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Configurar Forma de Cobrança" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Seleção do método */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Cobrança</Text>
          <View style={styles.methodsContainer}>
            {billingMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodButton,
                  selectedMethod?.id === method.id && styles.selectedMethod
                ]}
                onPress={() => selectMethod(method.id)}
              >
                <Text style={[
                  styles.methodText,
                  selectedMethod?.id === method.id && styles.selectedMethodText
                ]}>
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
              <Text style={styles.description}>{selectedMethod.description}</Text>
            </View>

            {/* Tolerância */}
            {selectedMethod.tolerance && config && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tolerância (minutos)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={config.toleranceMinutes?.toString() || "0"}
                  onChangeText={text => updateTolerance(Number(text) || 0)}
                  placeholder="Ex: 10"
                />
              </View>
            )}

            {/* Inputs globais */}
            {selectedMethod.inputs.filter(input => !selectedMethod.vehicleSpecific).length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Valores Globais</Text>
                {selectedMethod.inputs
                  .filter(input => !selectedMethod.vehicleSpecific)
                  .map(input => (
                    <View key={input.key} style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{input.label}</Text>
                      <TextInput
                        style={styles.input}
                        keyboardType={input.type === "number" ? "numeric" : "default"}
                        value={(config?.globalValues?.[input.key] || "").toString()}
                        onChangeText={text => updateGlobalValue(input.key, input.type === "number" ? Number(text) : text)}
                        placeholder={input.placeholder}
                      />
                    </View>
                  ))}
              </View>
            )}

            {/* Valores por tipo de veículo */}
            {selectedMethod.vehicleSpecific && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Valores por Tipo de Veículo</Text>
                
                {vehicleTypes.map(vehicle => (
                  <View key={vehicle.id} style={styles.vehicleSection}>
                    <Text style={styles.vehicleTitle}>{vehicle.name}</Text>
                    
                    {selectedMethod.inputs.map(input => (
                      <View key={`${vehicle.id}-${input.key}`} style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>{input.label}</Text>
                        <TextInput
                          style={styles.input}
                          keyboardType={input.type === "number" ? "numeric" : "default"}
                          value={(config?.values[vehicle.id]?.[input.key] || "").toString()}
                          onChangeText={text => updateValue(
                            vehicle.id, 
                            input.key, 
                            input.type === "number" ? Number(text) : text
                          )}
                          placeholder={input.placeholder}
                        />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 25,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.primary,
  },
  methodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  methodButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.gray.dark,
    borderRadius: 20,
  },
  selectedMethod: {
    backgroundColor: Colors.primary,
  },
  methodText: {
    color: Colors.white,
  },
  selectedMethodText: {
    color: "white",
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: Colors.gray.dark,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: Colors.gray.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  vehicleSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.gray.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.blue.light,
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreatePayment;