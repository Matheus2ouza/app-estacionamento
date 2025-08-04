import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { useActivePaymentMethod } from "@/src/hooks/vehicleFlow/usePaymentConfig";
import { styles } from "@/src/styles/functions/methodPaymentStyle";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from "react-native";

export default function MethodPayment() {
  const {
    activeMethod,
    isLoading,
    error,
    formatCurrency,
    formatMinutes,
    refresh,
  } = useActivePaymentMethod();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("@/src/assets/images/splash-icon-blue.png")}
        style={styles.heroImage}
      />
      <Header title="Formas de Pagamento e preço" titleStyle={styles.header} />

      <View style={styles.container}>
        <Text style={styles.title}>Métodos Ativos</Text>
        <View style={styles.separator} />

        <ScrollView contentContainerStyle={styles.body}>
          {activeMethod ? (
            <View style={styles.methodContainer}>
              {/* Informações do método */}
              <Text style={styles.methodLabel}>
                Método: {activeMethod.method.name}
              </Text>
              <Text style={styles.methodDescription}>
                {activeMethod.method.description}
              </Text>

              {activeMethod.method.tolerance !== null && (
                <Text style={styles.methodDetail}>
                  Tolerância: {activeMethod.method.tolerance} minuto(s)
                </Text>
              )}

              {/* Regras por tipo de veículo */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Valores por Tipo de Veículo
                </Text>

                {activeMethod.rules.map((rule) => (
                  <View key={rule.id} style={styles.vehicleSection}>
                    <Text style={styles.vehicleLabel}>
                      {rule.vehicle_type === "CARRO" ? "Carro" : "Moto"}
                    </Text>

                    <Text style={styles.inputDetail}>
                      Preço: R$ {formatCurrency(rule.price)}
                    </Text>
                    <Text style={styles.inputDetail}>
                      Tempo Base: {formatMinutes(rule.base_time_minutes)}{" "}
                      minutos
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.noConfigText}>
              {error || "Nenhum método de cobrança ativo configurado."}
            </Text>
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
