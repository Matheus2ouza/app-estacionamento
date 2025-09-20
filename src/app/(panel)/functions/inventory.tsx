import CashAvailabilityAlert from "@/components/CashAvailabilityAlert";
import GenericConfirmationModal from "@/components/GenericConfirmationModal";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import Colors from "@/constants/Colors";
import { useCashContext } from "@/context/CashContext";
import { useProductStatus } from "@/hooks/products/useProductStatus";
import { useProductsPagination } from "@/hooks/products/useSearchProduc";
import { styles } from "@/styles/functions/inventoryStyles";
import { formatDateToMMYYYY } from "@/utils/dateUtils";
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
  Switch,
  Text,
  View,
} from "react-native";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<string>("name");
  const [showInactiveProducts, setShowInactiveProducts] = useState(false);
  const { cashData, cashStatus } = useCashContext();
  
  // Funções utilitárias locais para verificar status do caixa
  const isCashOpen = (): boolean => cashStatus === 'open';
  const isCashClosed = (): boolean => cashStatus === 'closed';
  const isCashNotCreated = (): boolean => cashStatus === 'not_created';

  // Hook de paginação para produtos
  const { 
    products, 
    loading, 
    error, 
    hasMore, 
    loadInitial, 
    loadMore 
  } = useProductsPagination(6);

  // Hook para gerenciar status dos produtos
  const { toggleProductStatus, loading: statusLoading } = useProductStatus();

  // Estado para controlar a visibilidade do alerta
  const [showCashAlert, setShowCashAlert] = useState(false);

  // Estados para o modal de confirmação de desativação
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [productToDeactivate, setProductToDeactivate] = useState<any>(null);

  // Estados para o modal de confirmação de ativação
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [productToActivate, setProductToActivate] = useState<any>(null);

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
      // Filtro por status ativo/inativo
      if (!showInactiveProducts && !product.isActive) {
        return false;
      }
      
      // Filtro por busca
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
  }, [products, searchQuery, selectedSort, showInactiveProducts]);

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

  // Funções para o modal de confirmação de desativação
  const handleConfirmDeactivation = async () => {
    if (!productToDeactivate) return;
    
    try {
      const response = await toggleProductStatus(productToDeactivate.id, productToDeactivate.isActive);
      
      if (response?.success) {
        // Recarregar a lista de produtos para refletir as mudanças
        await loadInitial();
        console.log(`✅ [Inventory] Status do produto ${productToDeactivate.productName} alterado com sucesso`);
      }
    } catch (error) {
      console.error("❌ [Inventory] Erro ao alterar status do produto:", error);
    } finally {
      setShowDeactivateModal(false);
      setProductToDeactivate(null);
    }
  };

  const handleCancelDeactivation = () => {
    setShowDeactivateModal(false);
    setProductToDeactivate(null);
  };

  // Funções para o modal de confirmação de ativação
  const handleConfirmActivation = async () => {
    if (!productToActivate) return;
    
    try {
      const response = await toggleProductStatus(productToActivate.id, productToActivate.isActive);
      
      if (response?.success) {
        // Recarregar a lista de produtos para refletir as mudanças
        await loadInitial();
        console.log(`✅ [Inventory] Status do produto ${productToActivate.productName} alterado com sucesso`);
      }
    } catch (error) {
      console.error("❌ [Inventory] Erro ao alterar status do produto:", error);
    } finally {
      setShowActivateModal(false);
      setProductToActivate(null);
    }
  };

  const handleCancelActivation = () => {
    setShowActivateModal(false);
    setProductToActivate(null);
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

  const handleEditProduct = () => {
    router.push({
      pathname: "/functions/EditProduct",
      params: {
        productData: JSON.stringify({
          id: item.id,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          barcode: item.barcode,
          expirationDate: formatDateToMMYYYY(item.expirationDate),
          isActive: item.isActive
        })
      }
    });
  };

  const handleToggleProductStatus = () => {
    if (item.isActive) {
      // Se o produto está ativo, mostrar modal de confirmação para desativar
      setProductToDeactivate(item);
      setShowDeactivateModal(true);
    } else {
      // Se o produto está inativo, mostrar modal de confirmação para ativar
      setProductToActivate(item);
      setShowActivateModal(true);
    }
  };

  return (
    <View style={[
      styles.productCard,
      !item.isActive && styles.deactivatedCard
    ]}>
      <View style={styles.productHeader}>
        <View style={styles.productTitleContainer}>
          <Text style={[
            styles.productName,
            !item.isActive && styles.deactivatedProductName
          ]}>
            {item.productName}
          </Text>
          {!item.isActive && (
            <View style={styles.deactivatedMessageContainer}>
              <Ionicons name="information-circle" size={16} color={Colors.orange[500]} />
              <Text style={styles.deactivatedMessage}>
                Produto removido. Para usar, ative novamente ou atualize seus dados.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerRightContainer}>
          <View style={styles.actionButtons}>
            <Pressable 
              style={styles.editButton} 
              onPress={handleEditProduct}
            >
              <Ionicons name="pencil" size={20} color={Colors.gray.light} />
            </Pressable>
            <Pressable 
              style={[
                styles.deleteButton,
                item.isActive ? styles.deactivateButton : styles.activateButton
              ]} 
              onPress={handleToggleProductStatus}
              disabled={statusLoading}
            >
              {statusLoading ? (
                <ActivityIndicator size={16} color={Colors.white} />
              ) : (
                item.isActive ? (
                  <Ionicons 
                    name="trash" 
                    size={20} 
                    color={Colors.red[500]} 
                  />
                ) : (
                  <Feather 
                    name="check" 
                    size={24} 
                    color={Colors.green[700]}
                  />
                )
              )}
            </Pressable>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: !item.isActive ? Colors.red[500] : expirationStatus.color }
          ]}>
            <Text style={styles.statusText}>
              {!item.isActive ? "Inválido" : expirationStatus.text}
            </Text>
          </View>
        </View>
      </View>

      {/* Mostrar detalhes apenas se o produto estiver ativo */}
      {item.isActive && (
        <>
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
                ? formatDateToMMYYYY(item.expirationDate)
                : "Não registrada"}
            </Text>
          </View>
        </>
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
          overlay
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

      {/* Toggle para mostrar produtos inativos */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleContent}>
          <View style={styles.toggleInfo}>
            <Ionicons name="eye-off" size={20} color={Colors.gray[600]} />
            <Text style={styles.toggleLabel}>Mostrar produtos inativos</Text>
          </View>
          <Switch
            value={showInactiveProducts}
            onValueChange={setShowInactiveProducts}
            trackColor={{ false: Colors.gray[300], true: Colors.blue.light }}
            thumbColor={showInactiveProducts ? Colors.blue.primary : Colors.gray[400]}
            ios_backgroundColor={Colors.gray[300]}
          />
        </View>
      </View>

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

      {/* Modal de confirmação para desativar produto */}
      <GenericConfirmationModal
        visible={showDeactivateModal}
        title="Desativar Produto"
        message="Deseja realmente desativar esse produto?"
        details={`Produto: ${productToDeactivate?.productName || ''}\n\nOs dados do produto não serão perdidos, mas ele não poderá ser usado para vendas até ser reativado. Você pode reativá-lo a qualquer momento clicando no botão de ativar.`}
        confirmText="Desativar"
        cancelText="Cancelar"
        confirmButtonStyle="danger"
        onConfirm={handleConfirmDeactivation}
        onCancel={handleCancelDeactivation}
      />

      {/* Modal de confirmação para ativar produto */}
      <GenericConfirmationModal
        visible={showActivateModal}
        title="Ativar Produto"
        message="Você deseja realmente ativar esse produto?"
        confirmText="Ativar"
        cancelText="Cancelar"
        confirmButtonStyle="success"
        onConfirm={handleConfirmActivation}
        onCancel={handleCancelActivation}
      />
    </View>
  );
}
