import Colors from "@/constants/Colors";
import { useProductCache } from "@/context/ProductCacheContext";
import { useProductsPagination } from "@/hooks/products/useSearchProduc";
import { styles } from "@/styles/components/ProductListModalStyle";
import { Product } from "@/types/productsTypes/products";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import SearchInput from "./SearchInput";

// Usando o tipo Product importado do arquivo de tipos

interface ProductListModalProps {
  visible: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
  selectedProducts?: Product[]; // Lista de produtos já selecionados
}

export default function ProductListModal({ visible, onClose, onProductSelect, selectedProducts = [] }: ProductListModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<string>("name");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("1");

  // Hook de paginação para produtos
  const { 
    products, 
    loading, 
    error, 
    hasMore, 
    loadInitial, 
    loadMore,
    getAllProducts
  } = useProductsPagination(6);

  // Hook de cache de produtos
  const { getFromCache } = useProductCache();

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

  // Obter todos os produtos do cache para filtragem
  const allCachedProducts = getAllProducts();
  
  // Filtra e ordena os produtos (usando cache se disponível, senão usa a lista paginada)
  const productsToFilter = allCachedProducts.length > 0 ? allCachedProducts : products;
  
  const filteredProducts = productsToFilter.filter((product) => {
    const searchTerm = searchQuery.toLowerCase();
    // Filtrar apenas produtos ativos (isActive !== false)
    const isActive = product.isActive !== false;
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm);
    return isActive && matchesSearch;
  }).sort((a, b) => {
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
    if (visible) {
      loadInitial();
    }
  }, [visible]);

  const handleProductPress = (product: Product) => {
    if (selectedProduct?.id === product.id) {
      // Se o produto já está selecionado, desmarca
      setSelectedProduct(null);
      setQuantity("1");
    } else {
      // Se não está selecionado, seleciona
      setSelectedProduct(product);
      setQuantity("1");
    }
  };

  // Função para calcular quantidade já selecionada de um produto
  const getSelectedQuantity = (productName: string) => {
    // Primeiro, tentar buscar no cache
    const cachedProduct = getFromCache(productName);
    if (cachedProduct) {
      return cachedProduct.soldQuantity;
    }
    
    // Fallback para lista de produtos selecionados
    const fallbackQuantity = selectedProducts
      .filter(p => p.productName === productName)
      .reduce((sum, p) => sum + p.quantity, 0);
    
    return fallbackQuantity;
  };

  // Função para verificar se pode adicionar mais quantidade
  const canAddMore = (product: Product, currentQuantity: number) => {
    // Primeiro, tentar buscar no cache
    const cachedProduct = getFromCache(product.productName);
    if (cachedProduct) {
      const totalRequested = cachedProduct.soldQuantity + currentQuantity;
      const canAdd = totalRequested <= cachedProduct.originalStock;
      return canAdd;
    }
    
    // Fallback para lógica original
    const alreadySelected = getSelectedQuantity(product.productName);
    const totalRequested = alreadySelected + currentQuantity;
    const canAdd = totalRequested <= product.quantity;
    
    return canAdd;
  };

  const handleAddToCart = () => {
    if (selectedProduct && quantity) {
      const requestedQuantity = parseInt(quantity) || 1;
      
      if (canAddMore(selectedProduct, requestedQuantity)) {
        const productWithQuantity = {
          ...selectedProduct,
          quantity: requestedQuantity
        };
        onProductSelect(productWithQuantity);
        setSelectedProduct(null);
        setQuantity("1");
      }
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isSelected = selectedProduct?.id === item.id;
    
    // Buscar no cache primeiro
    const cachedProduct = getFromCache(item.productName);
    let availableQuantity: number;
    let isOutOfStock: boolean;
    
    if (cachedProduct) {
      availableQuantity = cachedProduct.availableStock;
      isOutOfStock = availableQuantity <= 0;
    } else {
      // Fallback para lógica original
      const alreadySelected = getSelectedQuantity(item.productName);
      availableQuantity = item.quantity - alreadySelected;
      isOutOfStock = availableQuantity <= 0;
    }

    return (
      <View style={[
        styles.productCard,
        isSelected && styles.productCardSelected,
        isOutOfStock && styles.productCardDisabled
      ]}>
        <Pressable 
          onPress={() => !isOutOfStock && handleProductPress(item)}
          disabled={isOutOfStock}
        >
          <View style={styles.productHeader}>
            <Text style={[styles.productName, isOutOfStock && styles.productNameDisabled]}>
              {item.productName}
            </Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: isOutOfStock ? Colors.red[500] : Colors.blue.primary }
            ]}>
              <Text style={styles.statusText}>
                {isOutOfStock ? "Indisponível" : "Disponível"}
              </Text>
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
              <Text style={styles.detailLabel}>Disponível:</Text>
              <Text style={styles.detailValue}>{availableQuantity}</Text>
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
        </Pressable>

        {/* Quantity Controls - Only show for selected product */}
        {isSelected && !isOutOfStock && (
          <View style={styles.quantityContainer}>
            <View style={styles.quantityInputContainer}>
              <Text style={styles.quantityLabel}>Quantidade:</Text>
              <View style={styles.quantityControls}>
                <Pressable
                  style={[
                    styles.quantityButton,
                    parseInt(quantity) <= 1 && styles.quantityButtonDisabled
                  ]}
                  onPress={() => {
                    const newQuantity = Math.max(1, parseInt(quantity) - 1);
                    setQuantity(newQuantity.toString());
                  }}
                  disabled={parseInt(quantity) <= 1}
                >
                  <MaterialIcons 
                    name="remove" 
                    size={16} 
                    color={parseInt(quantity) <= 1 ? Colors.gray[400] : Colors.white} 
                  />
                </Pressable>
                
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 1;
                    const maxAllowed = Math.min(availableQuantity, item.quantity);
                    const clampedValue = Math.max(1, Math.min(num, maxAllowed));
                    setQuantity(clampedValue.toString());
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
                
                <Pressable
                  style={[
                    styles.quantityButton,
                    parseInt(quantity) >= availableQuantity && styles.quantityButtonDisabled
                  ]}
                  onPress={() => {
                    const newQuantity = Math.min(availableQuantity, parseInt(quantity) + 1);
                    setQuantity(newQuantity.toString());
                  }}
                  disabled={parseInt(quantity) >= availableQuantity}
                >
                  <MaterialIcons 
                    name="add" 
                    size={16} 
                    color={parseInt(quantity) >= availableQuantity ? Colors.gray[400] : Colors.white} 
                  />
                </Pressable>
              </View>
            </View>
            
            <Pressable 
              style={[
                styles.addToCartButton,
                (!selectedProduct || !canAddMore(selectedProduct, parseInt(quantity))) && styles.addToCartButtonDisabled
              ]} 
              onPress={handleAddToCart}
              disabled={!selectedProduct || !canAddMore(selectedProduct, parseInt(quantity))}
            >
              <MaterialIcons name="add-shopping-cart" size={20} color={Colors.white} />
              <Text style={styles.addToCartButtonText}>Adicionar</Text>
            </Pressable>
          </View>
        )}
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
          Nenhum produto encontrado.
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Selecionar Produto</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

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
            return <View style={{ height: 20 }} />;
          }}
        />

      </View>
    </Modal>
  );
}
