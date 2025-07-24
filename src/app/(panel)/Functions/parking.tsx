import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useParking from "@/src/hooks/parking/useParking";
import { styles } from "@/src/styles/functions/parkingStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
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
  const [filter, setFilter] = useState<"plate" | "category" | "operator">(
    "plate"
  );
  const { cars, loading, refresh, occupancyPercentage } = useParking();

  const filterOptions = [
    { label: "Placa", value: "plate" },
    { label: "Categoria", value: "category" },
    { label: "Operador", value: "operator" },
  ];

  const getPercentageColor = (percentage: number) => {
    if (percentage < 50) return Colors.green[500];
    if (percentage <= 75) return Colors.yellow[500];
    return Colors.red[500];
  };

  const filteredCars = useMemo(() => {
    const searchTerm = search.toLowerCase();

    // Filtra os veículos
    let filtered = cars.filter((car) => {
      switch (filter) {
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

    return filtered;
  }, [cars, search, filter]);

  // Obtém o texto principal baseado no filtro selecionado
  const getMainText = (car: any) => {
    switch (filter) {
      case "plate":
        return car.plate;
      case "category":
        return car.category;
      case "operator":
        return car.operator;
      default:
        return car.plate;
    }
  };

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
                      status: car.status,
                      category: car.category,
                      description: car.description,
                    },
                  });
                }}
                style={({ pressed }) => [
                  pressed && { opacity: 0.9 },
                  car.status === "DELETED" && styles.deletedItem,
                ]}
              >
                <View
                  style={[
                    styles.listItem,
                    car.status === "DELETED" && styles.listItemDeleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.itemNumber,
                      car.status === "DELETED" && styles.itemNumberDeleted,
                    ]}
                  >
                    {index + 1}
                  </Text>

                  <View style={styles.itemData}>
                    <Text
                      style={[
                        styles.itemMainText,
                        car.status === "DELETED" && styles.itemMainTextDeleted,
                      ]}
                    >
                      {getMainText(car)}
                    </Text>

                    {car.status === "DELETED" ? (
                      <View style={styles.deletedMessageContainer}>
                        <Text style={styles.deletedMessage}>
                          Veículo excluído
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.itemDetails}>
                        <View style={styles.detailColumn}>
                          <Text style={styles.detailTitle}>Entrada:</Text>
                          <Text style={styles.detailValue}>
                            {car.formattedEntryTime}
                          </Text>
                        </View>

                        <View style={styles.detailColumn}>
                          <Text style={styles.detailTitle}>Tempo:</Text>
                          <Text style={styles.detailValue}>
                            {car.elapsedTime}
                          </Text>
                        </View>

                        {filter !== "operator" && (
                          <View style={styles.detailColumn}>
                            <Text style={styles.detailTitle}>Operador:</Text>
                            <Text style={styles.detailValue}>
                              {car.operator}
                            </Text>
                          </View>
                        )}

                        {filter !== "category" && (
                          <View style={styles.detailColumn}>
                            <Text style={styles.detailTitle}>Categoria:</Text>
                            <Text style={styles.detailValue}>
                              {car.category}
                            </Text>
                          </View>
                        )}

                        {filter !== "plate" && (
                          <View style={styles.detailColumn}>
                            <Text style={styles.detailTitle}>Placa:</Text>
                            <Text style={styles.detailValue}>{car.plate}</Text>
                          </View>
                        )}
                      </View>
                    )}
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
