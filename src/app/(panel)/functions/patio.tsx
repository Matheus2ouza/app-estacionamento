import Header from "@/src/components/Header";
import { styles } from "@/src/styles/functions/patioStyle";
import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { IconButton, Menu, TextInput } from "react-native-paper";

export default function Patio() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"placa" | "nome" | "modelo">("placa");
  const [menuVisible, setMenuVisible] = useState(false);

  const filterOptions = [
    { label: "Placa", value: "placa" },
    { label: "Nome", value: "nome" },
    { label: "Modelo", value: "modelo" },
  ];

  function log() {
    console.log("TouchableOpacity clicado")
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Pátio" />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusPatio}>
            <Text style={styles.percentage}>100%</Text>
            <View style={styles.separator} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.search}>
            <TextInput
              label="Buscar"
              value={search}
              mode="outlined"
              autoCapitalize="none"
              onChangeText={setSearch}
              style={styles.searchInput}
            />

            <View style={styles.inlineRadioContainer}>
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
            </View>
          </View>

          <View style={styles.list}>
            <View style={styles.separator} />

            <TouchableOpacity onPress={log}>
              <View style={styles.listRow}>
                {/* Coluna 1: Número */}
                <Text style={styles.number}>1°</Text>

                {/* Coluna 2: Dados */}
                <View style={styles.data}>
                  <Text style={styles.placa}>LSN 4L49</Text>
                  <View style={styles.details}>
                    <Text style={styles.detailsLabel}>23/06/2025</Text>
                    <Text style={styles.detailsLabel}>03:40:20</Text>
                  </View>
                </View>

                {/* Coluna 3: Menu de três pontos */}
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      size={24}
                      onPress={() => setMenuVisible(true)}
                      style={styles.menuAnchor}
                    />
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      console.log("editar clicado")
                      setMenuVisible(false);
                    }}
                    title="Editar"
                  />
                  <Menu.Item
                    onPress={() => {
                      console.log("apagar clicado")
                      setMenuVisible(false);
                    }}
                    title="Apagar"
                  />
                </Menu>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />
          </View>
        </View>
      </View>
    </View>
  );
}
