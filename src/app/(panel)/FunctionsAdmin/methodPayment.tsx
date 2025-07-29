import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { usePaymentConfig } from "@/src/hooks/vehicleFlow/usePaymentConfig";
import { styles } from "@/src/styles/functions/methodPaymentStyle";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { ActiveBillingRuleWithMethod, VehicleCategory } from "@/src/types/cash";

export default function MethodPayment() {
  const { 
    activeMethods,
    isLoading,
    error,
    loadActiveBillingMethods,
    config
  } = usePaymentConfig();

  // Carrega os métodos ativos ao iniciar a tela
  useEffect(() => {
    loadActiveBillingMethods();
  }, []);

  // Função para formatar valores monetários
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "0,00";
    return value.toFixed(2).replace(".", ",");
  };

  // Função para formatar minutos
  const formatMinutes = (minutes: number | undefined) => {
    if (minutes === undefined) return "0";
    return minutes.toString();
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Agrupa regras ativas por método de cobrança
  const groupRulesByMethod = (rules: ActiveBillingRuleWithMethod[]) => {
    return rules.reduce((acc, rule) => {
      if (!acc[rule.billing_method_id]) {
        acc[rule.billing_method_id] = {
          method: rule.billing_method,
          rules: []
        };
      }
      acc[rule.billing_method_id].rules.push(rule);
      return acc;
    }, {} as Record<string, { method: ActiveBillingRuleWithMethod['billing_method']; rules: ActiveBillingRuleWithMethod[] }>);
  };

  const groupedMethods = groupRulesByMethod(activeMethods);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Formas de Pagamento e preço" titleStyle={styles.header} />

      <View style={styles.container}>
        <Text style={styles.title}>Métodos Ativos</Text>
        <View style={styles.separator} />

        <ScrollView contentContainerStyle={styles.body}>
          {Object.keys(groupedMethods).length > 0 ? (
            Object.values(groupedMethods).map(({ method, rules }) => (
              <View key={method.id} style={styles.methodContainer}>
                {/* Informações do método */}
                <Text style={styles.methodLabel}>Método: {method.name}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
                
                {method.tolerance !== null && (
                  <Text style={styles.methodDetail}>
                    Tolerância: {method.tolerance} minuto(s)
                  </Text>
                )}

                {/* Regras por tipo de veículo */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Valores por Tipo de Veículo</Text>
                  
                  {rules.map((rule) => (
                    <View key={rule.id} style={styles.vehicleSection}>
                      <Text style={styles.vehicleLabel}>
                        {rule.vehicle_type === VehicleCategory.CARRO ? 'Carro' : 'Moto'}
                      </Text>
                      
                      <Text style={styles.inputDetail}>
                        Preço: R$ {formatCurrency(rule.price)}
                      </Text>
                      <Text style={styles.inputDetail}>
                        Tempo Base: {formatMinutes(rule.base_time_minutes)} minutos
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noConfigText}>Nenhum método de cobrança ativo configurado.</Text>
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