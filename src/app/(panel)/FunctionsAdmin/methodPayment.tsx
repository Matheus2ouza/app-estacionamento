import Header from "@/src/components/Header";
import { METHODS } from "@/src/constants/BillingMethods";
import Colors from "@/src/constants/Colors";
import { usePaymentConfig } from "@/src/hooks/cash/usePaymentConfig";
import { styles } from "@/src/styles/functions/methodPaymentStyle";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MethodPayment() {
  const { config, loadConfig } = usePaymentConfig();

  useFocusEffect(
    useCallback(() => {
      loadConfig();
    }, [])
  );

  // Define o método selecionado, se houver
  const selectedMethod = METHODS.find((method) => method.value === config?.method);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Formas de Pagamento e preço" titleStyle={styles.header} />

      <View style={styles.container}>
        <Text style={styles.title}>Método Ativo</Text>
        <View style={styles.separator} />

        <ScrollView contentContainerStyle={styles.body}>
          {config ? (
            <View>
              <Text style={styles.methodLabel}>Método: {config.method}</Text>
              <Text style={styles.methodDetail}>Tolerância: {config.tolerance} minuto(s)</Text>

              {/* Exibe o valor do extraInput (como tempo mínimo), se houver */}
              {selectedMethod?.extraInput && (
                <Text style={styles.methodDetail}>
                  {selectedMethod.extraInput.label}:{" "}
                  {config.values["global"]?.[selectedMethod.extraInput.key] ?? 0} minuto(s)
                </Text>
              )}

              {/* Listagem por veículos, excluindo a chave 'global' */}
              {Object.entries(config.values)
                .filter(([key]) => key !== "global")
                .map(([vehicleKey, inputs]) => (
                  <View key={vehicleKey} style={styles.vehicleSection}>
                    <Text style={styles.vehicleLabel}>
                      {vehicleKey === "car" ? "Carro" :
                       vehicleKey === "motorcycle" ? "Moto" :
                       vehicleKey === "largeCar" ? "Carro Grande" :
                       "Outro"}
                    </Text>

                    {Object.entries(inputs).map(([inputKey, value]) => {
                      const formattedValue = typeof value === "number" && !isNaN(value)
                        ? value.toFixed(2)
                        : "0,00";

                      return (
                        <Text key={inputKey} style={styles.inputDetail}>
                          {inputKey}: R$ {formattedValue}
                        </Text>
                      );
                    })}
                  </View>
                ))}
            </View>
          ) : (
            <Text style={styles.noConfigText}>Nenhuma configuração cadastrada ainda.</Text>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            router.push("/FunctionsAdmin/createPayment");
          }}
        >
          <Ionicons name="add-outline" size={50} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
