import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { useExitConfirmation } from "@/src/hooks/vehicleFlow/useExitConfirmation";
import { styles } from "@/src/styles/functions/informationStyle";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function InformationExit() {
  const params = useLocalSearchParams();

  console.log("Params received:", params);

  const initialData = params.id
    ? {
        id: params.id as string,
        plate: params.plate as string,
        category: params.category as string,
        time: params.time as string, // ISO string
        entryTime: params.entryTime as string, // Hora formatada
      }
    : null;

  const exitData = useExitConfirmation(initialData);

  if (!exitData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
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

  console.log("Full exit data:", exitData);

  const parseDateFlexible = (str: string): Date | null => {
    if (!str) return null;

    // Detecta ISO
    if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
      const date = new Date(str);
      return isNaN(date.getTime()) ? null : date;
    }

    // Trata "dd/MM/yyyy HH:mm:ss"
    const [datePart] = str.split(" ");
    if (!datePart) return null;

    const [day, month, year] = datePart.split("/").map(Number);
    return new Date(year, month - 1, day); // Local time (fuso da máquina)
  };

  // Uso:
  const entryDateOnly = time
    ? (() => {
        const dt = parseDateFlexible(time);
        return dt ? dt.toLocaleDateString("pt-BR") : "--/--/----";
      })()
    : "--/--/----";

  return (
    <View style={{ flex: 1 }}>
      <Header title="Dados" />

      <View style={styles.container}>
        <View style={styles.photo}>
          <Text style={styles.letra}>{plate.charAt(0)}</Text>
        </View>

        <View style={styles.datas}>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Categoria</Text>
            <Text style={styles.informationValue}>{category.toUpperCase()}</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Placa</Text>
            <Text style={styles.informationValue}>{plate.toUpperCase()}</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Entrada</Text>
            <Text style={styles.informationValue}>{entryDateOnly}</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Saída</Text>
            <Text style={styles.informationValue}>{exitDate}</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Hora Entrada</Text>
            <Text style={styles.informationValue}>{formattedEntryTime}</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Permanencia</Text>
            <Text style={styles.informationValue}>{formattedStayDuration}</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Hora Saída</Text>
            <Text style={styles.informationValue}>{exitTime}</Text>
          </View>
        </View>

        <PrimaryButton
          title="Gerar pagamento"
          onPress={() => {
            router.push({
              pathname: "/functions/registerPayment",
              params: {
                id: exitData.id,
                plate,
                category,
                entryTime: time, // Enviamos o ISO string
                exitTime: new Date().toISOString(),
                stayDuration: formattedStayDuration,
              },
            });
          }}
          style={styles.Button}
        />
      </View>
    </View>
  );
}
