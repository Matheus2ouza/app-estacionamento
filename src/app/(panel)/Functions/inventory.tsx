import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useSeachProducts from "@/src/hooks/products/useSearchProduc";
import { styles } from "@/src/styles/functions/inventoryStyles";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { TextInput } from "react-native-paper";

type FilterType = "name" | "price" | "quantity";

type FilterOption = {
  label: string;
  value: FilterType;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const FILTER_OPTIONS: FilterOption[] = [
  { label: "Nome", value: "name", icon: "format-letter-matches" },
  { label: "Preço", value: "price", icon: "currency-usd" },
  { label: "Quantidade", value: "quantity", icon: "numeric" },
];

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("name");
  const [refreshing, setRefreshing] = useState(false);
  const { searchProducts, loading } = useSeachProducts();
  const [products, setProducts] = useState<any[]>([]);

  const filteredProducts = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    return products.filter((product) => {
      switch (filter) {
        case "name":
          return product.productName.toLowerCase().includes(searchTerm);
        case "price":
          return product.unitPrice.toString().includes(searchTerm);
        case "quantity":
          return product.quantity.toString().includes(searchTerm);
        default:
          return true;
      }
    });
  }, [products, searchQuery, filter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const fetchProducts = async () => {
    const response = await searchProducts();
    if (response.success) {
      setProducts(response.list || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Header title="Estoque" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Barra de pesquisa e filtros */}
        <View style={styles.searchFilterContainer}>
          <TextInput
            label="Buscar produto"
            value={searchQuery}
            mode="outlined"
            autoCapitalize="none"
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            left={<TextInput.Icon icon="magnify" color={Colors.gray.medium} />}
            outlineColor={Colors.gray.light}
            activeOutlineColor={Colors.primary}
          />

          <View style={styles.filterContainer}>
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
          </View>
        </View>

        {/* Lista de produtos */}
        <View style={styles.listContainer}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="package-variant"
                size={50}
                color={Colors.gray.medium}
              />
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Nenhum produto encontrado"
                  : "Nenhum produto registrado"}
              </Text>
              <Pressable onPress={() => router.push("/Functions/addProduct")}>
                <Text style={styles.emptyLink}>Adicionar produto</Text>
              </Pressable>
            </View>
          ) : (
            filteredProducts.map((product, index) => (
              <Pressable
                key={`${product.id}-${index}`}
                onPress={() => {
                  router.push({
                    pathname: "/Functions/editProduct",
                    params: product,
                  });
                }}
                style={({ pressed }) => [
                  styles.productCard,
                  pressed && styles.productCardPressed,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardIndex}>
                    <Text style={styles.indexText}>
                      {index + 1}
                    </Text>
                  </View>

                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>
                      {product.productName}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons
                        name="currency-usd"
                        size={16}
                        color={Colors.gray.dark}
                      />
                      <Text style={styles.detailText}>
                        R$ {Number(product.unitPrice).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons
                        name="numeric"
                        size={16}
                        color={Colors.gray.dark}
                      />
                      <Text style={styles.detailText}>
                        {product.quantity} unidades
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={16}
                        color={Colors.gray.dark}
                      />
                      <Text style={styles.detailText}>
                        {product.expirationDate
                          ? product.expirationDate.slice(0, 10).split("-").reverse().join("/")
                          : "Sem validade"}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/Functions/addProduct")}
      >
        <MaterialCommunityIcons name="plus" size={24} color={Colors.white} />
      </Pressable>
    </View>
  );
}