import Header from "@/src/components/Header";
import { BILLING_METHODS, VEHICLE_TYPES } from "@/src/constants/BillingMethods";
import Colors from "@/src/constants/Colors";
import { usePaymentConfig } from "@/src/hooks/vehicleFlow/usePaymentConfig";
import { styles } from "@/src/styles/functions/methodPaymentStyle";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MethodPayment() {
  const { config } = usePaymentConfig();

  // Encontra o método ativo
  const selectedMethod = config 
    ? BILLING_METHODS.find(method => method.id === config.methodId)
    : null;

  // Função para formatar valores monetários
  const formatCurrency = (value: number | string | undefined) => {
    if (value === undefined) return "0,00";
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? "0,00" : num.toFixed(2).replace(".", ",");
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Formas de Pagamento e preço" titleStyle={styles.header} />

      <View style={styles.container}>
        <Text style={styles.title}>Método Ativo</Text>
        <View style={styles.separator} />

        <ScrollView contentContainerStyle={styles.body}>
          {config && selectedMethod ? (
            <View>
              {/* Informações do método */}
              <Text style={styles.methodLabel}>Método: {selectedMethod.name}</Text>
              
              {config.toleranceMinutes !== undefined && (
                <Text style={styles.methodDetail}>
                  Tolerância: {config.toleranceMinutes} minuto(s)
                </Text>
              )}

              {/* Valores globais */}
              {config.globalValues && Object.keys(config.globalValues).length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Valores Globais</Text>
                  {Object.entries(config.globalValues).map(([key, value]) => {
                    const input = selectedMethod.inputs.find(i => i.key === key);
                    return (
                      <Text key={key} style={styles.methodDetail}>
                        {input?.label || key}: {formatCurrency(value)}
                      </Text>
                    );
                  })}
                </View>
              )}

              {/* Valores por tipo de veículo */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Valores por Veículo</Text>
                
                {VEHICLE_TYPES.map(vehicle => {
                  const vehicleValues = config.values[vehicle.id];
                  if (!vehicleValues) return null;

                  return (
                    <View key={vehicle.id} style={styles.vehicleSection}>
                      <Text style={styles.vehicleLabel}>{vehicle.name}</Text>
                      
                      {Object.entries(vehicleValues).map(([key, value]) => {
                        const input = selectedMethod.inputs.find(i => i.key === key);
                        return (
                          <Text key={key} style={styles.inputDetail}>
                            {input?.label || key}: R$ {formatCurrency(value)}
                          </Text>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <Text style={styles.noConfigText}>Nenhuma configuração cadastrada ainda.</Text>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push("/FunctionsAdmin/createPayment")}
        >
          <Ionicons name="add-outline" size={50} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}