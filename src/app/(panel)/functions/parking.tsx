import Header from "@/src/components/Header";
import SearchInput from "@/src/components/SearchInput";
import Colors from "@/src/constants/Colors";
import useParking from "@/src/hooks/vehicleFlow/useExitData";
import { styles } from "@/src/styles/functions/parkingStyle";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

export default function Parking() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("plate");
  const { cars, loading, refresh, occupancyPercentage } = useParking();
  
  const sortOptions = [
    { key: "plate", label: "Placa", icon: "car" },
    { key: "category", label: "Categoria", icon: "list" },
    { key: "operator", label: "Operador", icon: "person" },
  ];

  const getPercentageColor = (percentage: number) => {
    if (percentage < 50) return Colors.green[500];  
    if (percentage <= 75) return Colors.yellow[500];
    return Colors.red[500];
  };

  const getStatusLabel = (percentage: number) => {
    if (percentage < 50) return "Ocupação Baixa";
    if (percentage <= 75) return "Ocupação Média";
    return "Ocupação Alta";
  };

  const handleSortChange = (sortKey: string | string[]) => {
    if (typeof sortKey === 'string') {
      setSortBy(sortKey);
    }
  };

  // Filtra e ordena os veículos
  const filteredCars = useMemo(() => {
    const searchTerm = search.toLowerCase();
    
    // Filtra os veículos baseado no campo de ordenação selecionado
    let filtered = cars.filter((car) => {
      switch(sortBy) {
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

    // Ordena alfabeticamente pelo campo selecionado
    filtered.sort((a, b) => {
      const fieldA = String(a[sortBy as keyof typeof a]).toLowerCase();
      const fieldB = String(b[sortBy as keyof typeof b]).toLowerCase();
      return fieldA.localeCompare(fieldB);
    });

    return filtered;
  }, [cars, search, sortBy]);

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <Header title="Pátio"/>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.blue.primary} />
          <Text style={styles.loadingText}>Carregando dados do pátio...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Pátio"/>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
      >
        {/* Container Unificado - Status e Lista */}
        <View style={styles.unifiedSection}>
          {/* Status do Pátio */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Status do Pátio</Text>
            <View style={styles.percentageContainer}>
              <Text
                style={[
                  styles.percentage,
                  { color: getPercentageColor(occupancyPercentage) },
                ]}
              >
                {occupancyPercentage}%
              </Text>
              <Text style={styles.statusLabel}>
                {getStatusLabel(occupancyPercentage)}
              </Text>
            </View>
          </View>

          {/* Separador */}
          <View style={styles.separator} />

          {/* Busca e Lista de Veículos */}
          <View style={styles.listContainer}>
            <SearchInput
              searchQuery={search}
              onSearchChange={setSearch}
              placeholder="Digite para buscar veículos..."
              sortOptions={sortOptions}
              selectedSort={sortBy}
              onSortChange={handleSortChange}
              showSortOptions={true}
              multipleSelection={false}
            />

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredCars.length === 0 ? (
                <View style={styles.emptyState}>
                  <FontAwesome 
                    name="car" 
                    size={48} 
                    color={Colors.gray.medium} 
                  />
                  <Text style={styles.emptyStateText}>
                    {search ? 
                      `Nenhum veículo encontrado para "${search}"` : 
                      "Nenhum veículo no pátio no momento"
                    }
                  </Text>
                </View>
              ) : (
                filteredCars.map((car, index) => (
                  <Pressable
                    key={`${car.plate}-${index}`}
                    onPress={() => {
                      router.push({
                        pathname: "/functions/editRegister",
                        params: {
                          id: car.id,
                          plate: car.plate,
                          category: car.category,
                        },
                      });
                    }}
                    style={({ pressed }) => [
                      pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
                    ]}
                  >
                    <View style={styles.listItem}>
                      <Text style={styles.itemNumber}>{index + 1}</Text>

                      <View style={styles.itemData}>
                        <Text style={styles.itemPlate}>{car.plate}</Text>

                        <View style={styles.itemDetails}>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Entrada</Text>
                            <Text style={styles.detailValue}>{car.formattedEntryTime}</Text>
                          </View>

                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Tempo</Text>
                            <Text style={styles.detailValue}>{car.elapsedTime}</Text>
                          </View>

                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Operador</Text>
                            <Text style={styles.detailValue}>{car.operator}</Text>
                          </View>

                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Categoria</Text>
                            <Text style={styles.detailValue}>{car.category}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}