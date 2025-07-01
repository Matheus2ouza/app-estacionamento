import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useParking from "@/src/hooks/vehicleFlow/useParking";
import { styles } from "@/src/styles/functions/parkingStyle";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

export default function Parking() {
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const { cars, loading, refresh, occupancyPercentage } = useParking();

  const getPercentageColor = (percentage: number) => {
    if (percentage < 50) return Colors.green;
    if (percentage <= 75) return Colors.yellow;
    return Colors.red;
  };

  const filteredCars = cars.filter((car) =>
    car.plate.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Pátio" />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusPatio}>
            <Text
              style={[
                styles.percentage,
                { color: getPercentageColor(occupancyPercentage) },
              ]}
            >
              {occupancyPercentage}%
            </Text>

            <View style={styles.separator} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.searchContainer}>
            <TextInput
              label="Buscar"
              value={search}
              mode="outlined"
              autoCapitalize="none"
              onChangeText={setSearch}
              style={styles.searchInput}
            />

            {/* Botão de Refresh */}
            <View style={styles.refreshContainer}>
              <Pressable onPress={refresh}>
                <View style={styles.refreshIcon}>
                  <FontAwesome name="refresh" size={24} color={Colors.white} />
                </View>
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
          >
            {filteredCars.map((car, index) => (
              <View key={`${car.plate}-${index}`} style={styles.listItem}>
                <Text style={styles.itemNumber}>{index + 1}</Text>

                <View style={styles.itemData}>
                  <Text style={styles.itemPlate}>{car.plate}</Text>

                  <View style={styles.itemDetails}>
                    <Text style={styles.detailText}>
                      Entrada: {car.formattedEntryTime}
                    </Text>
                    <Text style={styles.detailText}>
                      Tempo: {car.elapsedTime}
                    </Text>
                  <Text style={styles.detailText}>Operador: {car.operator}</Text>
                  <Text style={styles.detailText}>Categoria: {car.category}</Text>
                  </View>
                </View>

                <Pressable
                  style={styles.menuButton}
                  onPress={() => setMenuVisible(true)}
                >
                  <FontAwesome
                    name="ellipsis-v"
                    size={20}
                    color={Colors.darkGray}
                  />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
