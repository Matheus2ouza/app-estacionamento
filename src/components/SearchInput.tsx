import React from "react";
import { DimensionValue, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../constants/Colors";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  inputWidth?: string | number;
  placeholder?: string;
}

export default function SearchInput({
  search,
  setSearch,
  inputWidth = "100%",
  placeholder = "Buscar",
}: Props) {
  return (
    <TextInput
      label={placeholder} // Usamos o placeholder como label
      value={search}
      mode="outlined"
      autoCapitalize="none"
      onChangeText={setSearch}
      style={[styles.searchInput, { width: inputWidth as DimensionValue }]}
      placeholder={placeholder} // Adicionamos o placeholder também
    />
  );
}

const styles = StyleSheet.create({
  searchInput: {
    borderColor: Colors.blue.logo,
  },
});