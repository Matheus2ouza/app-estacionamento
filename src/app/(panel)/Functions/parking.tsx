import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useParking from "@/src/hooks/parking/useParking";
import { styles } from "@/src/styles/functions/parkingStyle";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { TextInput } from "react-native-paper";

type FilterType = "plate" | "category" | "operator";

type FilterOption = {
  label: string;
  value: FilterType;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const FILTER_OPTIONS: FilterOption[] = [
  { label: "Placa", value: "plate", icon: "license" },
  { label: "Categoria", value: "category", icon: "tag" },
  { label: "Operador", value: "operator", icon: "account" },
];

export default function Parking() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("plate");
  const [refreshing, setRefreshing] = useState(false);
  const { cars, loading, refresh, occupancyPercentage } = useParking();

  const getPercentageColor = (percentage: number) => {
    if (percentage < 50) return Colors.green[500];
    if (percentage <= 75) return Colors.yellow[500];
    return Colors.red[500];
  };

  const filteredCars = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return cars.filter((car) => {
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
  }, [cars, search, filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando veículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Header title="Pátio" />

      {/* Status de ocupação */}
      <View style={styles.occupancyContainer}>
        <Text style={styles.occupancyLabel}>Ocupação do Pátio</Text>
        <View style={styles.percentageContainer}>
          <Text
            style={[
              styles.percentageText,
              { color: getPercentageColor(occupancyPercentage) },
            ]}
          >
            {occupancyPercentage}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${occupancyPercentage}%`,
                backgroundColor: getPercentageColor(occupancyPercentage),
              },
            ]}
          />
        </View>
      </View>

      {/* Barra de pesquisa e filtros */}
      <View style={styles.searchFilterContainer}>
        <TextInput
          label="Buscar veículo"
          value={search}
          mode="outlined"
          autoCapitalize="none"
          onChangeText={setSearch}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" color={Colors.gray.medium} />}
          outlineColor={Colors.gray.light}
          activeOutlineColor={Colors.primary}
        />

        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTER_OPTIONS.map((opt) => {
              const isSelected = filter === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setFilter(opt.value)}
                  style={[
                    styles.filterButton,
                    isSelected && styles.filterButtonSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={opt.icon}
                    size={20}
                    color={isSelected ? Colors.white : Colors.primary}
                  />
                  <Text
                    style={[
                      styles.filterButtonText,
                      isSelected && styles.filterButtonTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable
            onPress={onRefresh}
            style={styles.refreshButton}
            android_ripple={{ color: Colors.white, borderless: true }}
          >
            <FontAwesome name="refresh" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </View>

      {/* Lista de veículos */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        {filteredCars.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="car-off"
              size={50}
              color={Colors.gray.medium}
            />
            <Text style={styles.emptyText}>
              {search
                ? "Nenhum veículo encontrado"
                : "Nenhum veículo estacionado"}
            </Text>
          </View>
        ) : (
          filteredCars.map((car, index) => (
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
                styles.vehicleCard,
                pressed && styles.vehicleCardPressed,
                car.status === "DELETED" && styles.vehicleCardDeleted,
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIndex}>
                  <Text
                    style={[
                      styles.indexText,
                      car.status === "DELETED" && styles.indexTextDeleted,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>

                <View style={styles.cardTitleContainer}>
                  <Text
                    style={[
                      styles.cardTitle,
                      car.status === "DELETED" && styles.cardTitleDeleted,
                    ]}
                  >
                    {filter === "plate"
                      ? car.plate
                      : filter === "category"
                      ? car.category
                      : car.operator}
                  </Text>
                  {car.status === "DELETED" && (
                    <Text style={styles.deletedLabel}>EXCLUÍDO</Text>
                  )}
                </View>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name="clock-time-four-outline"
                      size={16}
                      color={Colors.gray.dark}
                    />
                    <Text style={styles.detailText}>
                      {car.formattedEntryTime}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name="timer-sand"
                      size={16}
                      color={Colors.gray.dark}
                    />
                    <Text style={styles.detailText}>{car.elapsedTime}</Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name="tag"
                      size={16}
                      color={Colors.gray.dark}
                    />
                    <Text style={styles.detailText}>{car.category}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name="account"
                      size={16}
                      color={Colors.gray.dark}
                    />
                    <Text style={styles.detailText}>{car.operator}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
