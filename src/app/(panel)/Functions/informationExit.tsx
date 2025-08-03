import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { useExitConfirmation } from "@/src/hooks/vehicleFlow/useExitConfirmation";
import { styles, infoStyles } from "@/src/styles/functions/informationStyle";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View, ScrollView, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from "@/src/constants/Colors";

export default function InformationExit() {
  const params = useLocalSearchParams();

  const initialData = params.id
    ? {
        id: params.id as string,
        plate: params.plate as string,
        category: params.category as string,
        time: params.time as string,
        entry_time: params.entryTime as string,
      }
    : null;

  const exitData = useExitConfirmation(initialData);

  if (!exitData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando dados do veículo...</Text>
      </View>
    );
  }

  const {
    plate,
    category,
    formattedEntryTime,
    exitDate,
    exitTime,
    formattedStayDuration,
    time,
  } = exitData;

  const vehicleIcon = category.toLowerCase() === 'carro' 
    ? <MaterialCommunityIcons name="car" size={80} color={Colors.white} />
    : <MaterialCommunityIcons name="motorbike" size={80} color={Colors.white} />;

  const parseDateFlexible = (str: string): Date | null => {
    if (!str) return null;
    if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
      const date = new Date(str);
      return isNaN(date.getTime()) ? null : date;
    }
    const [datePart] = str.split(" ");
    if (!datePart) return null;
    const [day, month, year] = datePart.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const entryDateOnly = time
    ? (() => {
        const dt = parseDateFlexible(time);
        return dt ? dt.toLocaleDateString("pt-BR") : "--/--/----";
      })()
    : "--/--/----";

  return (
    <View style={styles.mainContainer}>
      <Header title="Confirmação de Saída"/>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.vehicleBadge}>
          <View style={styles.vehicleIconContainer}>
            {vehicleIcon}
          </View>
          <Text style={styles.plateText}>{plate.toUpperCase()}</Text>
          <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>ENTRADA</Text>
            <InfoRow label="Data:" value={entryDateOnly} />
            <InfoRow label="Hora:" value={formattedEntryTime} />
          </View>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>SAÍDA</Text>
            <InfoRow label="Data:" value={exitDate} />
            <InfoRow label="Hora:" value={exitTime} />
          </View>

          <View style={styles.divider} />

          <View style={styles.durationSection}>
            <Text style={styles.durationLabel}>TEMPO DE PERMANÊNCIA</Text>
            <Text style={styles.durationValue}>{formattedStayDuration}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Gerar Pagamento"
          onPress={() => {
            router.push({
              pathname: "/Functions/registerPayment",
              params: {
                id: exitData.id,
                plate,
                category,
                entryTime: time,
                exitTime: new Date().toISOString(),
                stayDuration: formattedStayDuration,
              },
            });
          }}
          icon={<MaterialCommunityIcons name="cash" size={24} color="white" />}
        />
      </View>
    </View>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={infoStyles.row}>
    <Text style={infoStyles.label}>{label}</Text>
    <Text style={infoStyles.value}>{value}</Text>
  </View>
);

