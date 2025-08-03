import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useParking from "@/src/hooks/vehicleFlow/useExitData";
import { styles } from "@/src/styles/functions/exitStyle";
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

// 1. Definir os tipos corretamente
type FilterType = "plate" | "category" | "operator";

type FilterOption = {
  label: string;
  value: FilterType;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

// 2. Definir as opções de filtro UMA ÚNICA VEZ
const FILTER_OPTIONS: FilterOption[] = [
  { label: "Placa", value: "plate", icon: "car" },
  { label: "Categoria", value: "category", icon: "tag" },
  { label: "Operador", value: "operator", icon: "account" },
];

export default function ExitRegister() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("plate");
  const [refreshing, setRefreshing] = useState(false);
  const { cars, loading, refresh } = useParking();

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const filteredCars = useMemo(() => {
    const searchTerm = search.toLowerCase();

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

    filtered.sort((a, b) =>
      a[filter].toLowerCase().localeCompare(b[filter].toLowerCase())
    );
    return filtered;
  }, [cars, search, filter]);

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

  const getVehicleIcon = (category: string) => {
    return category.toLowerCase().includes("moto") ? (
      <MaterialCommunityIcons
        name="motorbike"
        size={24}
        color={Colors.primary}
      />
    ) : (
      <MaterialCommunityIcons name="car" size={24} color={Colors.primary} />
    );
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
      <Header title="Registro de Saída" />

      <View style={styles.searchContainer}>
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
      </View>

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
              color={Colors.gray[500]}
            />
            <Text style={styles.emptyText}>
              {search
                ? "Nenhum veículo encontrado"
                : "Nenhum veículo estacionado"}
            </Text>
          </View>
        ) : (
          filteredCars.map((car) => (
            <Pressable
              key={`${car.plate}-${car.entryTime}`}
              onPress={() => {
                router.push({
                  pathname: "/Functions/informationExit",
                  params: {
                    id: car.id,
                    plate: car.plate,
                    category: car.category,
                    entryTime: car.formattedEntryTime,
                    time: car.entryTime,
                  },
                });
              }}
              style={({ pressed }) => [
                styles.vehicleCard,
                pressed && styles.vehicleCardPressed,
              ]}
            >
              <View style={styles.cardHeader}>
                {getVehicleIcon(car.category)}
                <Text style={styles.cardTitle}>{getMainText(car)}</Text>
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
                  {filter !== "operator" && (
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons
                        name="account"
                        size={16}
                        color={Colors.gray.dark}
                      />
                      <Text style={styles.detailText}>{car.operator}</Text>
                    </View>
                  )}

                  {filter !== "category" && (
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons
                        name="tag"
                        size={16}
                        color={Colors.gray.dark}
                      />
                      <Text style={styles.detailText}>{car.category}</Text>
                    </View>
                  )}
                </View>

                {filter !== "plate" && (
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons
                        name="license"
                        size={16}
                        color={Colors.gray.dark}
                      />
                      <Text style={styles.detailText}>{car.plate}</Text>
                    </View>
                    <View style={styles.detailItem} />{" "}
                    {/* Espaço vazio para alinhamento */}
                  </View>
                )}
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
