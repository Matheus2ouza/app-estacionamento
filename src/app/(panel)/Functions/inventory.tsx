import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useSeachProducts from "@/src/hooks/products/useSearchProduc";
import { styles } from "@/src/styles/functions/inventoryStyles";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const { searchProducts, loading, error } = useSeachProducts();

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = filteredProducts.filter((product) =>
      product.productName.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  const handleSearchProduct = async () => {
    const response = await searchProducts();
    console.log(response.list)
    if (response.success) {
      setFilteredProducts(response.list || []);
    }
  };

  useEffect(() => {
    handleSearchProduct();
  }, []);

const renderProductItem = ({ item }: { item: any }) => (
  <Pressable
    onPress={() =>
      router.push({
        pathname: "/Functions/editProduct",
        params: item,
      })
    }
  >
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.productName}</Text>

      <View style={styles.productDetails}>
        <Text style={styles.productDetailText}>
          Valor: R$ {Number(item.unitPrice).toFixed(2)}
        </Text>
        <Text style={styles.productDetailText}>
          Quantidade: {item.quantity}
        </Text>
      </View>

      <Text style={[styles.productDetailText, { marginTop: 6 }]}>
        Validade:{" "}
        {item.expirationDate
          ? item.expirationDate.slice(0, 10).split("-").reverse().join("/")
          : "(Não registrada)"}
      </Text>
    </View>
  </Pressable>
);

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.blue.light} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Nenhum produto registrado. Deseja registrar?
        </Text>
        <Pressable onPress={() => router.push("/Functions/addProduct")}>
          <Text style={styles.emptyLink}>Registrar</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Estoque" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={20}
          color={Colors.gray.dark}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produto..."
          placeholderTextColor={Colors.gray[500]}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {/* Refresh Button */}
      <Pressable style={styles.refreshButton} onPress={handleSearchProduct}>
        <FontAwesome name="refresh" size={25} color={Colors.white} />
      </Pressable>

      <View style={styles.separator} />

      {/* Product List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.productList, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>

      {/* Floating Action Button */}
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/Functions/addProduct")}
      >
        <Feather name="plus" size={40} color={Colors.white} />
      </Pressable>
    </View>
  );
}
