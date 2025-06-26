import React from "react";
import { DimensionValue, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../constants/Colors";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  inputWidth?: string | number;
}

export default function SearchInput({
  search,
  setSearch,
  inputWidth = "100%",
}: Props) {
  return (
    <TextInput
      label="Buscar"
      value={search}
      mode="outlined"
      autoCapitalize="none"
      onChangeText={setSearch}
      style={[styles.searchInput, { width: inputWidth as DimensionValue }]}
    />
  );
}

const styles = StyleSheet.create({
  searchInput: {
    borderColor: Colors.blueLogo,
  },
});
