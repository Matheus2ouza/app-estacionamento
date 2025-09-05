import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { TypographyThemes } from "../constants/Fonts";

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
    flex: 1,
    gap: 8,
  },
  groupTitle: {
    ...TypographyThemes.nunito.bodySmall, // Nunito para título - amigável
    color: Colors.text.primary,
    marginRight: 8,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.gray.medium,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioOuterSelected: {
    borderColor: Colors.blue.primary,
    backgroundColor: Colors.blue.light,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.blue.primary,
  },
  radioLabel: {
    ...TypographyThemes.nunito.bodySmall, // Nunito para labels - amigável
    color: Colors.text.primary,
    fontSize: 14,
  },
});
