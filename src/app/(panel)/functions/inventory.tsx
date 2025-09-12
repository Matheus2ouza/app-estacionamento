import CashAvailabilityAlert from "@/src/components/CashAvailabilityAlert";
import Header from "@/src/components/Header";
import SearchInput from "@/src/components/SearchInput";
import Colors from "@/src/constants/Colors";
import { useCashContext } from "@/src/context/CashContext";
import { useProductsPagination } from "@/src/hooks/products/useSearchProduc";
import { styles } from "@/src/styles/functions/inventoryStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<string>("name");
  const { cashData, cashStatus, isCashNotCreated, isCashClosed } = useCashContext();

  // Hook de paginação para produtos
  const { 
    products, 
    loading, 
    error, 
    hasMore, 
    loadInitial, 
    loadMore 
  } = useProductsPagination(6);

  // Estado para controlar a visibilidade do alerta
  const [showCashAlert, setShowCashAlert] = useState(false);

  // Estados para o botão flutuante expansível
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const fabAnimation = useState(new Animated.Value(0))[0];
  const addButtonAnimation = useState(new Animated.Value(0))[0];
  const sellButtonAnimation = useState(new Animated.Value(0))[0];

  // Verificar se deve mostrar o alerta de caixa
  const shouldShowCashAlert = isCashNotCreated() || isCashClosed();

  // Opções de ordenação
  const sortOptions = [
    { key: "name", label: "Nome", icon: "text" },
    { key: "price", label: "Preço", icon: "cash" },
    { key: "quantity", label: "Quantidade", icon: "layers" },
    { key: "expiration", label: "Validade", icon: "calendar" },
  ];

  const handleSortChange = (sortKey: string | string[]) => {
    const key = Array.isArray(sortKey) ? sortKey[0] : sortKey;
    setSelectedSort(key);
  };

  // Filtra e ordena os produtos
  const filteredProducts = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    
    let filtered = products.filter((product) => {
      switch(selectedSort) {
        case "name":
          return product.productName.toLowerCase().includes(searchTerm);
        case "price":
          return product.productName.toLowerCase().includes(searchTerm);
        case "quantity":
          return product.productName.toLowerCase().includes(searchTerm);
        case "expiration":
          return product.productName.toLowerCase().includes(searchTerm);
        default:
          return product.productName.toLowerCase().includes(searchTerm);
      }
    });

    // Ordena pelo campo selecionado
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case "name":
          return a.productName.localeCompare(b.productName);
        case "price":
          return Number(a.unitPrice) - Number(b.unitPrice);
        case "quantity":
          return Number(b.quantity) - Number(a.quantity);
        case "expiration":
          if (!a.expirationDate && !b.expirationDate) return 0;
          if (!a.expirationDate) return 1;
          if (!b.expirationDate) return -1;
          return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
        default:
          return a.productName.localeCompare(b.productName);
      }
    });

    return filtered;
  }, [products, searchQuery, selectedSort]);

  // Estados para paginação
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLoadMore = async () => {
    if (hasMore && !loading && !loadingMore) {
      setLoadingMore(true);
      try {
        await loadMore();
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInitial();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  // Mostrar alerta quando o status do caixa mudar
  useEffect(() => {
    if (shouldShowCashAlert) {
      setShowCashAlert(true);
    }
  }, [shouldShowCashAlert]);

  // Função para fechar o alerta
  const handleCloseCashAlert = () => {
    setShowCashAlert(false);
  };

  // Funções para o botão flutuante expansível
  const toggleFab = () => {
    const toValue = isFabExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(fabAnimation, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonAnimation, {
        toValue,
        duration: 200,
        delay: toValue ? 50 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(sellButtonAnimation, {
        toValue,
        duration: 200,
        delay: toValue ? 100 : 0,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsFabExpanded(!isFabExpanded);
  };

  const handleAddProduct = () => {
    setIsFabExpanded(false);
    toggleFab();
    router.push("/functions/addProduct");
  };

  const handleSellProduct = () => {
    setIsFabExpanded(false);
    toggleFab();
    router.push("/functions/registerProductSale");
  };

const renderProductItem = ({ item }: { item: any }) => {
  const isExpiringSoon = () => {
    if (!item.expirationDate) return false;
    const expirationDate = new Date(item.expirationDate);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isExpired = () => {
    if (!item.expirationDate) return false;
    const expirationDate = new Date(item.expirationDate);
    const today = new Date();
    return expirationDate < today;
  };

  const getExpirationStatus = () => {
    if (isExpired()) return { color: Colors.red[500], text: "Vencido" };
    if (isExpiringSoon()) return { color: Colors.yellow[500], text: "Vence em breve" };
    return { color: Colors.green[500], text: "Válido" };
  };

  const expirationStatus = getExpirationStatus();

  return (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.productName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: expirationStatus.color }]}>
          <Text style={styles.statusText}>{expirationStatus.text}</Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <View style={styles.detailItem}>
          <FontAwesome name="dollar" size={16} color={Colors.blue.primary} />
          <Text style={styles.detailLabel}>Preço:</Text>
          <Text style={styles.detailValue}>R$ {Number(item.unitPrice).toFixed(2)}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <FontAwesome name="cube" size={16} color={Colors.blue.primary} />
          <Text style={styles.detailLabel}>Qtd:</Text>
          <Text style={styles.detailValue}>{item.quantity}</Text>
        </View>
      </View>

      <View style={styles.expirationContainer}>
        <FontAwesome name="calendar" size={14} color={Colors.gray[500]} />
        <Text style={styles.expirationText}>
          Validade: {item.expirationDate 
            ? item.expirationDate.slice(0, 10).split("-").reverse().join("/")
            : "Não registrada"}
        </Text>
      </View>
    </View>
  );
};

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
        <Pressable onPress={() => router.push("/functions/addProduct")}>
          <Text style={styles.emptyLink}>Registrar</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Estoque" />

      {/* Cash Availability Alert */}
      {shouldShowCashAlert && showCashAlert && (
        <CashAvailabilityAlert 
          mode="warning" 
          cashStatus={cashStatus} 
          onClosePress={handleCloseCashAlert}
          style={styles.cashAlert}
        />
      )}

      {/* Search Input with Sort Options */}
      <SearchInput
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Pesquisar produto..."
        sortOptions={sortOptions}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        showSortOptions={true}
        multipleSelection={false}
      />

      {/* Product List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id || item.productName}
          contentContainerStyle={[
            styles.productList,
            filteredProducts.length === 0 && { flexGrow: 1 }
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.blue.primary]}
              tintColor={Colors.blue.primary}
            />
          }
          ListFooterComponent={() => {
            if (hasMore && products.length > 0) {
              return (
                <View style={styles.loadingMore}>
                  <Pressable 
                    style={[
                      styles.loadMoreButton,
                      loadingMore && styles.loadMoreButtonDisabled
                    ]}
                    onPress={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <ActivityIndicator size="small" color={Colors.gray[400]} />
                    ) : (
                      <FontAwesome 
                        name="chevron-down" 
                        size={16} 
                        color={Colors.white} 
                      />
                    )}
                    <Text style={[
                      styles.loadMoreButtonText,
                      loadingMore && styles.loadMoreButtonTextDisabled
                    ]}>
                      {loadingMore ? 'Carregando...' : 'Carregar Mais'}
                    </Text>
                  </Pressable>
                </View>
              );
            }
            
            // Espaçamento para o botão flutuante quando não há mais itens
            return <View style={{ height: 30 }} />;
          }}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
        />
      </View>

      {/* Floating Action Button Expansível */}
      <View style={styles.fabContainer}>
        {/* Botão Adicionar Produto */}
        <Animated.View
          style={[
            styles.fabSecondary,
            {
              transform: [
                {
                  translateY: addButtonAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -80],
                  }),
                },
                {
                  scale: addButtonAnimation,
                },
              ],
              opacity: addButtonAnimation,
            },
          ]}
        >
          <Pressable style={styles.fabSecondaryButton} onPress={handleAddProduct}>
            <Feather name="plus" size={32} color={Colors.white} />
          </Pressable>
        </Animated.View>

        {/* Botão Vender Produto */}
        <Animated.View
          style={[
            styles.fabSecondary,
            {
              transform: [
                {
                  translateY: sellButtonAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -158],
                  }),
                },
                {
                  scale: sellButtonAnimation,
                },
              ],
              opacity: sellButtonAnimation,
            },
          ]}
        >
          <Pressable style={styles.fabSecondaryButton} onPress={handleSellProduct}>
            <Feather name="shopping-cart" size={25} color={Colors.white} />
          </Pressable>
        </Animated.View>

        {/* Botão Principal */}
        <Animated.View
          style={[
            styles.fabMain,
            {
              transform: [
                {
                  rotate: fabAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '0deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Pressable style={styles.fabMainButton} onPress={toggleFab}>
            {isFabExpanded ? (
              <AntDesign name="close" size={36} color={Colors.white} />
            ) : (
              <Ionicons name="list" size={36} color={Colors.white} />
            )}
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
