import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useParking from "@/src/hooks/parking/useParking";
import { styles } from "@/src/styles/functions/parkingStyle";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
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
  const [filter, setFilter] = useState<"plate" | "category" | "operator">("plate");
  const { cars, loading, refresh, occupancyPercentage } = useParking();
  
  const filterOptions = [
    { label: "Placa", value: "plate" },
    { label: "Categoria", value: "category" },
    { label: "Operador", value: "operator" },
  ];

  const getPercentageColor = (percentage: number) => {
    if (percentage < 50) return Colors.green;
    if (percentage <= 75) return Colors.yellow;
    return Colors.red;
  };

  const filteredCars = cars.filter((car) => {
    const searchTerm = search.toLowerCase();
    switch(filter) {
      case "plate":
        return car.plate.toLowerCase().includes(searchTerm);
      case "category":
        return car.category.toLowerCase().includes(searchTerm);
      case "operator":
        return car.operator.toLowerCase().includes(searchTerm);
      default:
        return true;
    }
  });

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

            {/* Filtros e botão de Refresh */}
            <View style={styles.filterRow}>
              
              <View style={styles.filterGroup}>
                {filterOptions.map((opt) => {
                  const isSelected = filter === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => setFilter(opt.value as any)}
                      style={styles.radioItem}
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioLabel}>{opt.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable onPress={refresh} style={styles.refreshButton}>
                <FontAwesome name="refresh" size={20} color={Colors.white} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
          >
            {filteredCars.map((car, index) => (
              <Pressable
                key={`${car.plate}-${index}`}
                onPress={() => {
                  router.push({
                    pathname: "/Functions/editRegister",
                    params: {
                      id: car.id,
                      plate: car.plate,
                      category: car.category,
                    },
                  });
                }}
                style={({ pressed }) => [pressed && { opacity: 0.9 }]}
              >
                <View style={styles.listItem}>
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
                      <Text style={styles.detailText}>
                        Operador: {car.operator}
                      </Text>
                      <Text style={styles.detailText}>
                        Categoria: {car.category}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}