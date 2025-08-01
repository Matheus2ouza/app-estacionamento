import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "@/src/components/Header";
import { useCreatePayment } from "@/src/hooks/vehicleFlow/useCreatePayment";
import { styles } from "@/src/styles/functions/createPaymentStyle";
import FeedbackModal from "@/src/components/FeedbackModal";

const CreatePayment = () => {
  const {
    paymentConfig,
    methods,
    activeMethod,
    isLoading,
    isSaving,
    modalState,
    vehicleTypes,
    selectMethod,
    updateRule,
    updateTolerance,
    getDisplayValue,
    handleSave,
    closeModal,
  } = useCreatePayment();

  console.log("Active Method Data:", activeMethod);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FeedbackModal
        visible={modalState.visible}
        message={modalState.message}
        isSuccess={modalState.isSuccess}
        onClose={closeModal}
      />

      <Header
        title="Configurar Forma de Cobrança"
        titleStyle={{ fontSize: 25 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Banner do método ativo */}
        
        {activeMethod && (
          <View style={styles.activeMethodBanner}>
            <Text style={styles.activeMethodText}>
              Método Ativo: {activeMethod.method.name}
            </Text>
          </View>
        )}

        {/* Seleção do método */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Cobrança</Text>
          <View style={styles.methodsContainer}>
            {methods.map((method) => {
              const isActive = activeMethod?.method.id === method.id;
              const isSelected = paymentConfig?.methodId === method.id;
              
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodButton,
                    isSelected && styles.selectedMethod,
                    isActive && styles.activeMethod,
                  ]}
                  onPress={() => selectMethod(method)}
                >
                  <Text
                    style={[
                      styles.methodText,
                      isSelected && styles.selectedMethodText,
                      isActive && styles.activeMethodText,
                    ]}
                  >
                    {method.name}
                    {isActive && " (Ativo)"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {paymentConfig && (
          <>
            {/* Descrição do método */}
            <View style={styles.section}>
              <Text style={styles.description}>
                {methods.find(m => m.id === paymentConfig.methodId)?.description || ""}
              </Text>
            </View>

            {/* Tolerância */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tolerância (minutos)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={paymentConfig.toleranceMinutes.toString()}
                onChangeText={(text) =>
                  updateTolerance(Number(text.replace(/[^0-9]/g, "")) || 0)
                }
                placeholder="Ex: 10"
              />
            </View>

            {/* Regras por tipo de veículo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Configuração por Tipo de Veículo
              </Text>

              {vehicleTypes.map((vehicle) => {
                const rule = paymentConfig.rules[vehicle.id];
                const method = methods.find(m => m.id === paymentConfig.methodId);
                const baseTime = method?.name.includes("Hora") ? 60 : 30;

                return (
                  <View key={vehicle.id} style={styles.vehicleSection}>
                    <Text style={styles.vehicleTitle}>{vehicle.name}</Text>

                    {/* Preço */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Preço</Text>
                      <TextInput
  style={styles.input}
  keyboardType="decimal-pad"
  value={getDisplayValue(vehicle.id, 'price', rule?.price || 0)}
  onChangeText={(text) => updateRule(vehicle.id, 'price', text)}
  placeholder="Ex: 4,50"
/>

                    </View>

                    {/* Tempo base */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>
                        Tempo Base (minutos)
                      </Text>
                      <Text style={[styles.input, { paddingVertical: 12 }]}>
                        {baseTime}
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
          disabled={isSaving || !paymentConfig}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>
              {paymentConfig?.methodId === activeMethod?.method.id
                ? "Atualizar Configuração"
                : "Definir como Método Ativo"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreatePayment;