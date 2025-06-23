import Header from "@/src/components/Header";
import { styles } from "@/src/styles/functions/exitStyle";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function ExitRegister() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"placa" | "nome" | "modelo">("placa");
  const [gender, setGender] = useState<"A" | "O" | "ambos">("ambos");

  const filterOptions = [
    { label: "Placa", value: "placa" },
    { label: "Nome", value: "nome" },
    { label: "Modelo", value: "modelo" },
  ];

  const genderOptions = [
    { label: "A", value: "A" },
    { label: "O", value: "O" },
    { label: "Ambos", value: "ambos" },
  ];

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

        <Text style={styles.groupTitle}>Filtrar por campo:</Text>
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
        </View>

        <View style={styles.searchBody}>
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => {router.push("/(panel)/Functions/informationExit")}}>
            <View style={styles.searchDataRow}>
              <Text style={styles.main}>LSN 4L49</Text>
              <View style={styles.information}>
                <View style={styles.informationColumn}>
                  <Text style={styles.informationTitle}>Nome</Text>
                  <Text style={styles.informationValue}>Matheus furtado</Text>
                </View>
                <View style={styles.informationColumn}>
                  <Text style={styles.informationTitle}>Entrada</Text>
                  <Text style={styles.informationValue}>23/06/2025</Text>
                </View>
                <View style={styles.informationColumn}>
                  <Text style={styles.informationTitle}>Modelo</Text>
                  <Text style={styles.informationValue}>Carro</Text>
                </View>
                <View style={styles.informationColumn}>
                  <Text style={styles.informationTitle}>Permanencia</Text>
                  <Text style={styles.informationValue}>00:00:00</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
