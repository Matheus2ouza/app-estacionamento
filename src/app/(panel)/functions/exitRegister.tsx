import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useParking from "@/src/hooks/vehicleFlow/useExitData";
import { styles } from "@/src/styles/functions/exitStyle";
import { FontAwesome } from "@expo/vector-icons";
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

export default function ExitRegister() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"plate" | "category" | "operator">("plate");
  const { cars, loading, refresh } = useParking();
  
  const filterOptions = [
    { label: "Placa", value: "plate" },
    { label: "Categoria", value: "category" },
    { label: "Operador", value: "operator" },
  ];

  // Filtra e ordena os veículos
  const filteredCars = useMemo(() => {
    const searchTerm = search.toLowerCase();
    
    // Filtra os veículos
    let filtered = cars.filter((car) => {
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

    // Ordena alfabeticamente pelo campo do filtro
    filtered.sort((a, b) => {
      const fieldA = a[filter].toLowerCase();
      const fieldB = b[filter].toLowerCase();
      return fieldA.localeCompare(fieldB);
    });

    return filtered;
  }, [cars, search, filter]);

  // Obtém o texto principal baseado no filtro selecionado
  const getMainText = (car: any) => {
    switch(filter) {
      case "plate": return car.plate;
      case "category": return car.category;
      case "operator": return car.operator;
      default: return car.plate;
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
      <Header title="Saída" />
      
      <View style={styles.container}>
        <View style={styles.search}>
          <TextInput
            label="Buscar"
            value={search}
            mode="outlined"
            autoCapitalize="none"
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.radioGroup}>
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
          
          <Pressable onPress={refresh} style={styles.refreshButton}>
            <FontAwesome name="refresh" size={20} color={Colors.white} />
          </Pressable>
        </View>

        <View style={styles.searchBody}>
          <View style={styles.separator} />
          
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {filteredCars.map((car, index) => (
              <Pressable
                key={`${car.plate}-${index}`}
                onPress={() => {
                  router.push({
                    pathname: "/Functions/informationExit",
                    params: {
                      id: car.id,
                      plate: car.plate,
                      category: car.category,
                      entryTime: car.formattedEntryTime,
                      time: car.entryTime
                    },
                  });
                }}
                style={({ pressed }) => [
                  pressed && { opacity: 0.9 },
                  styles.searchDataRow
                ]}
              >
                <View style={styles.listItem}>
                  <Text style={styles.main}>{getMainText(car)}</Text>
                  
                  <View style={styles.information}>
                    <View style={styles.informationColumn}>
                      <Text style={styles.informationTitle}>Entrada:</Text>
                      <Text style={styles.informationValue}>{car.formattedEntryTime}</Text>
                    </View>
                    
                    <View style={styles.informationColumn}>
                      <Text style={styles.informationTitle}>Tempo:</Text>
                      <Text style={styles.informationValue}>{car.elapsedTime}</Text>
                    </View>
                    
                    {filter !== "operator" && (
                      <View style={styles.informationColumn}>
                        <Text style={styles.informationTitle}>Operador:</Text>
                        <Text style={styles.informationValue}>{car.operator}</Text>
                      </View>
                    )}
                    
                    {filter !== "category" && (
                      <View style={styles.informationColumn}>
                        <Text style={styles.informationTitle}>Categoria:</Text>
                        <Text style={styles.informationValue}>{car.category}</Text>
                      </View>
                    )}
                    
                    {filter !== "plate" && (
                      <View style={styles.informationColumn}>
                        <Text style={styles.informationTitle}>Placa:</Text>
                        <Text style={styles.informationValue}>{car.plate}</Text>
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