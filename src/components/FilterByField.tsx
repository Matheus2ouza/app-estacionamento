import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

export type FilterOption = string;

interface FilterOptionItem {
  label: string;
  value: FilterOption;
}

interface Props {
  filter: FilterOption;
  setFilter: (value: FilterOption) => void;
  options?: FilterOptionItem[]; // agora as opções podem ser passadas
}

const defaultOptions: FilterOptionItem[] = [
  { label: "Placa", value: "placa" },
  { label: "Nome", value: "nome" },
  { label: "Modelo", value: "modelo" },
];

export default function FilterByField({
  filter,
  setFilter,
  options = defaultOptions,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>Filtrar por campo:</Text>
      <View style={styles.radioGroup}>
        {options.map((opt) => {
          const isSelected = filter === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setFilter(opt.value)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 5,
    gap: 5,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 5,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: 5,
    gap: 10,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioOuterSelected: {
    borderColor: Colors.blueLogo,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.blueLogo,
  },
  radioLabel: {
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
  },
});
