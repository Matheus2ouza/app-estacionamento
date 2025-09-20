import CameraComponent from "@/components/CameraComponent";
import CashAvailabilityAlert from "@/components/CashAvailabilityAlert";
import FeedbackModal from "@/components/FeedbackModal";
import Header from "@/components/Header";
import ProductDetailModal from "@/components/ProductDetailModal";
import ProductListModal from "@/components/ProductListModal";
import Separator from "@/components/Separator";
import Colors, { generateRandomColor } from "@/constants/Colors";
import { useCashContext } from "@/context/CashContext";
import { useProductCache } from "@/context/ProductCacheContext";
import useBarcodeSearch from "@/hooks/products/useBarcodeSearch";
import { styles } from "@/styles/functions/registerProductSaleStyle";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";


interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number; // Quantidade sendo vendida
  stock: number; // Quantidade em estoque
  barcode?: string;
  borderColor?: string;
  expirationDate?: string;
}

export default function RegisterProductSale() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [dotText, setDotText] = useState(".");
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  
  // Animações para cada card de produto
  const [animations, setAnimations] = useState<{[key: string]: Animated.Value}>({});
  
  // Contexto do caixa para verificar status
  const { cashData, cashStatus } = useCashContext();
  
  // Funções utilitárias locais para verificar status do caixa
  const isCashOpen = (): boolean => cashStatus === 'open';
  const isCashClosed = (): boolean => cashStatus === 'closed';
  const isCashNotCreated = (): boolean => cashStatus === 'not_created';
  
  // Verificar se a tela deve ser bloqueada
  const isScreenBlocked = isCashNotCreated() || isCashClosed();
  
  // Estados para feedback
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  // Estados para modal de código de barras
  const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);
  
  // Estados para modal de lista de produtos
  const [productListModalVisible, setProductListModalVisible] = useState(false);
  
  // Estados para modal de detalhes do produto
  const [productDetailModalVisible, setProductDetailModalVisible] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<any>(null);
  
  // Estados para loading
  const [loading, setLoading] = useState(false);
  const { searchByBarcodeInDatabase, loading: barcodeLoading } = useBarcodeSearch();
  const { getFromCache, updateSoldQuantity, clearCache, getCacheStats, searchProductByBarcode } = useProductCache();

  const isFormValid = products.length > 0;

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  const handleBarcodeScanned = async (data: { data: string }) => {
    const scannedBarcode = data.data;
    console.log('🛒 Código escaneado:', scannedBarcode);
    setBarcodeModalVisible(false);
    
    // Proteção contra chamadas duplicadas
    if (barcodeLoading) {
      console.log('🛒 Busca já em andamento, ignorando...');
      return;
    }
    
    // Buscar produto automaticamente na base de dados usando cache unificado
    const result = await searchByBarcodeInDatabase(scannedBarcode);
    
    if (result.success && result.data) {
      const productName = result.data.productName;
      
      // Aguardar um pouco para o cache ser atualizado, depois buscar produto no cache
      setTimeout(() => {
        const cachedProduct = getFromCache(productName);
        
        if (cachedProduct) {
          
          // Mostrar modal de detalhes do produto encontrado
          setSelectedProductForDetail({
            id: cachedProduct.id || Date.now().toString(),
            productName: cachedProduct.productName,
            unitPrice: parseFloat(cachedProduct.unitPrice.toString()),
            quantity: cachedProduct.availableStock, // Estoque disponível do cache
            expirationDate: cachedProduct.expirationDate,
            barcode: scannedBarcode,
          });
          setProductDetailModalVisible(true);
        } else {
          // Fallback para dados da API se não estiver no cache
          setSelectedProductForDetail({
            id: result.data?.id || Date.now().toString(),
            productName: result.data?.productName || "Produto não identificado",
            unitPrice: parseFloat(result.data?.unitPrice?.toString() || "0") || 0,
            quantity: result.data?.quantity || 1,
            expirationDate: result.data?.expirationDate,
            barcode: scannedBarcode,
          });
          setProductDetailModalVisible(true);
        }
      }, 200); // Delay aumentado para garantir que o cache foi atualizado
    } else {
      console.log('🛒 Produto não encontrado');
      showFeedback(
        result.message || "Produto não encontrado na base de dados", 
        "warning"
      );
    }
  };

  const handleCloseBarcodeModal = () => {
    setBarcodeModalVisible(false);
  };

  const handleProductDetailClose = () => {
    setProductDetailModalVisible(false);
    setSelectedProductForDetail(null);
  };

  const handleProductDetailRegister = (product: any, quantity: number) => {
    // Verificar se o produto já existe na lista
    const existingProductIndex = products.findIndex(p => p.name === product.productName);
    
    if (existingProductIndex !== -1) {
      // Se o produto já existe, incrementar a quantidade sendo vendida
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity += quantity;
      // Atualizar o estoque disponível (diminuir a quantidade adicionada)
      updatedProducts[existingProductIndex].stock -= quantity;
      setProducts(updatedProducts);
      updateTotalAmount(updatedProducts);
      
      // Atualizar cache com nova quantidade vendida (com delay para garantir sincronização)
      const totalSoldQuantity = updatedProducts[existingProductIndex].quantity;
      setTimeout(() => {
        updateSoldQuantity(product.productName, totalSoldQuantity);
      }, 50);
    } else {
      // Se é um produto novo, adicionar à lista
      // Buscar no cache para obter o estoque disponível correto
      const cachedProduct = getFromCache(product.productName);
      const availableStock = cachedProduct ? cachedProduct.availableStock : product.quantity;
      
      console.log('🛒 Estoque disponível:', product.productName, `cache: ${cachedProduct?.availableStock || 'N/A'}`, `fallback: ${product.quantity}`, `usando: ${availableStock}`);
      
      const newProduct: ProductItem = {
        id: product.id,
        name: product.productName,
        price: parseFloat(product.unitPrice.toString()), // Converter para number
        quantity: quantity, // Quantidade sendo vendida
        stock: availableStock - quantity, // Estoque disponível (estoque do cache - quantidade vendida)
        barcode: product.barcode,
        borderColor: generateRandomColor(),
        expirationDate: product.expirationDate,
      };
      
      setProducts(prev => [...prev, newProduct]);
      updateTotalAmount([...products, newProduct]);
      
      // Atualizar cache com quantidade vendida (com delay para garantir sincronização)
      setTimeout(() => {
        updateSoldQuantity(product.productName, quantity);
      }, 50);
    }
    
    console.log('🛒 Produto adicionado:', product.productName, `qtd: ${quantity}`);
    setProductDetailModalVisible(false);
    setSelectedProductForDetail(null);
    showFeedback("Produto adicionado com sucesso", "success");
  };

  const handleProductSelect = (product: any) => {
    // Verificar se o produto já existe na lista
    const existingProductIndex = products.findIndex(p => p.name === product.productName);
    
    if (existingProductIndex !== -1) {
      // Se o produto já existe, incrementar a quantidade sendo vendida
      const updatedProducts = [...products];
      const quantityToAdd = product.quantity || 1;
      updatedProducts[existingProductIndex].quantity += quantityToAdd;
      // Atualizar o estoque disponível (diminuir a quantidade adicionada)
      updatedProducts[existingProductIndex].stock -= quantityToAdd;
      setProducts(updatedProducts);
      updateTotalAmount(updatedProducts);
      
      // Atualizar cache com nova quantidade vendida
      const totalSoldQuantity = updatedProducts[existingProductIndex].quantity;
      updateSoldQuantity(product.productName, totalSoldQuantity);
    } else {
      // Se é um produto novo, adicionar à lista
      const quantityToAdd = product.quantity || 1;
      
      // Buscar no cache para obter o estoque disponível correto
      const cachedProduct = getFromCache(product.productName);
      const availableStock = cachedProduct ? cachedProduct.availableStock : product.quantity;
      
      console.log('🛒 Estoque disponível (lista):', product.productName, `cache: ${cachedProduct?.availableStock || 'N/A'}`, `fallback: ${product.quantity}`, `usando: ${availableStock}`);
      
      const newProduct: ProductItem = {
        id: product.id || Date.now().toString(),
        name: product.productName,
        price: parseFloat(product.unitPrice.toString()), // Converter para number
        quantity: quantityToAdd, // Quantidade sendo vendida
        stock: availableStock - quantityToAdd, // Estoque disponível (estoque do cache - quantidade vendida)
        barcode: product.barcode,
        borderColor: generateRandomColor(),
        expirationDate: product.expirationDate,
      };
      
      setProducts(prev => [...prev, newProduct]);
      updateTotalAmount([...products, newProduct]);
      
      // Atualizar cache com quantidade vendida
      updateSoldQuantity(product.productName, quantityToAdd);
    }
    
    console.log('🛒 Produto da lista:', product.productName);
    setProductListModalVisible(false);
  };

  const updateTotalAmount = (productList: ProductItem[]) => {
    const total = productList.reduce((sum, product) => sum + ((product.price || 0) * (product.quantity || 0)), 0);
    setTotalAmount(total);
  };

  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Verificar se não está tentando vender mais do que o estoque total disponível
    const totalStockAvailable = product.stock + product.quantity;
    
    if (newQuantity > totalStockAvailable) {
      showFeedback(`Quantidade não pode ser maior que o estoque disponível (${totalStockAvailable})`, "warning");
      return;
    }
    
    const updatedProducts = products.map(p =>
      p.id === productId ? { 
        ...p, 
        quantity: newQuantity,
        stock: totalStockAvailable - newQuantity // Estoque = Total disponível - Nova quantidade
      } : p
    );
    
    setProducts(updatedProducts);
    updateTotalAmount(updatedProducts);
    
    // Atualizar cache com nova quantidade vendida
    updateSoldQuantity(product.name, newQuantity);
  };

  const removeProduct = (productId: string) => {
    // Encontrar o produto que está sendo removido para devolver o estoque
    const productToRemove = products.find(p => p.id === productId);
    
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    updateTotalAmount(updatedProducts);
    
    // Atualizar cache - remover quantidade vendida deste produto
    if (productToRemove) {
      updateSoldQuantity(productToRemove.name, 0);
    }
    
    // Remove animação e estado expandido do produto removido
    setAnimations(prev => {
      const newAnimations = { ...prev };
      delete newAnimations[productId];
      return newAnimations;
    });
    setExpandedCards(prev => prev.filter(id => id !== productId));
    
    // Mostrar feedback sobre a remoção
    if (productToRemove) {
      showFeedback(`${productToRemove.quantity} unidade(s) de ${productToRemove.name} removida(s)`, "info");
    }
  };

  // Função para alternar expansão do card com animação
  const toggleCardExpansion = (productId: string) => {
    const isExpanding = !expandedCards.includes(productId);
    
    // Criar animação se não existir
    if (!animations[productId]) {
      const newAnimationValue = new Animated.Value(0);
      setAnimations(prev => ({
        ...prev,
        [productId]: newAnimationValue
      }));
      
      // Iniciar animação imediatamente
      Animated.timing(newAnimationValue, {
        toValue: isExpanding ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // Usar animação existente
      const animationValue = animations[productId];
      Animated.timing(animationValue, {
        toValue: isExpanding ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    
    setExpandedCards(prev => {
      if (prev.includes(productId)) {
        // Remove o card se já estiver expandido
        return prev.filter(id => id !== productId);
      } else {
        // Adiciona o card se não estiver expandido
        return [...prev, productId];
      }
    });
  };


  const handleRegisterSale = async () => {
    setLoading(true);
    
    try {
      // Preparar dados da venda
      const saleData = {
        products: products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          stock: product.stock,
          barcode: product.barcode,
          borderColor: product.borderColor,
          expirationDate: product.expirationDate,
          // Dados adicionais que podem ser úteis
          totalValue: product.price * product.quantity
        })),
        totalAmount: totalAmount,
        totalItems: products.reduce((sum, product) => sum + product.quantity, 0),
        timestamp: new Date().toISOString()
      };

      console.log('🛒 Dados da venda:', saleData);
      
      // Redirecionar para tela de pagamento
      router.push({
        pathname: '/functions/RegisterPaymentProducts',
        params: { saleData: JSON.stringify(saleData) }
      });
      
      // Limpar campos após redirecionamento
      setProducts([]);
      setTotalAmount(0);
      
      // Limpar cache de produtos
      clearCache();
    } catch (error) {
      showFeedback("Erro ao preparar lista", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setDotText((prev) => {
        if (prev.length >= 3) return ".";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [loading]);

  // Limpar cache quando o componente for desmontado
  useEffect(() => {
    return () => {
      clearCache();
    };
  }, []); // Removida dependência clearCache para evitar loop

  const renderProductItem = ({ item }: { item: ProductItem }) => {
    const isExpanded = expandedCards.includes(item.id);
    const animationValue = animations[item.id] || new Animated.Value(0);
    
    // Debug: verificar se item.price está definido
    if (item.price === undefined || item.price === null) {
      console.log('🚨 item.price undefined:', item.name);
    }
    
    return (
      <Animated.View style={[
        styles.productCard,
        isExpanded && styles.expandedProductCard,
        {
          borderLeftColor: item.borderColor || Colors.blue.primary,
          borderLeftWidth: 4,
          transform: [{
            scale: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.00],
            })
          }],
          opacity: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1],
          })
        }
      ]}>
        <View style={styles.productCardHeader}>
          <Text style={[
            styles.productCardTitle,
            isExpanded && styles.expandedProductCardTitle
          ]}>
            {isExpanded ? item.name : item.name.substring(0, 5)}
          </Text>
          <TouchableOpacity 
            style={styles.productExpandButton}
            onPress={() => toggleCardExpansion(item.id)}
          >
            <Entypo 
              name={isExpanded ? "resize-100" : "resize-full-screen"} 
              size={isExpanded ? 20 : 16} 
              color={Colors.text.primary} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={[
          styles.productCardValue,
          isExpanded && styles.expandedProductCardValue
        ]}>
          R$ {(item.price || 0).toFixed(2)}
        </Text>
        
        {!isExpanded && (
          <Text style={styles.productCardQuantity}>
            Qtd: {item.quantity}
          </Text>
        )}
        
        {isExpanded && (
          <Animated.View style={[
            styles.expandedProductDetails,
            {
              opacity: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
              transform: [{
                translateY: animationValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                })
              }]
            }
          ]}>
            <Text style={styles.productDetailTitle}>Detalhes do Produto</Text>
            
            <View style={styles.productDetailRow}>
              <Text style={styles.productDetailLabel}>Valor Unitário</Text>
              <Text style={styles.productDetailValue}>R$ {(item.price || 0).toFixed(2)}</Text>
            </View>
            
            <View style={styles.productDetailRow}>
              <Text style={styles.productDetailLabel}>Quantidade</Text>
              <Text style={styles.productDetailValue}>{item.quantity}</Text>
            </View>
            
            <View style={styles.productDetailRow}>
              <Text style={styles.productDetailLabel}>Valor Total</Text>
              <Text style={styles.productDetailValue}>R$ {((item.price || 0) * (item.quantity || 0)).toFixed(2)}</Text>
            </View>
            
            <View style={styles.productDetailRow}>
              <Text style={styles.productDetailLabel}>Estoque</Text>
              <Text style={styles.productDetailValue}>{item.stock}</Text>
            </View>
            
            <View style={styles.productControls}>
              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateProductQuantity(item.id, item.quantity - 1)}
                >
                  <MaterialIcons name="remove" size={16} color={Colors.white} />
                </Pressable>
                
                <Text style={styles.quantityText}>{item.quantity}</Text>
                
                <Pressable
                  style={[
                    styles.quantityButton,
                    item.quantity >= (item.stock + item.quantity) && styles.quantityButtonDisabled
                  ]}
                  onPress={() => updateProductQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= (item.stock + item.quantity)}
                >
                  <MaterialIcons 
                    name="add" 
                    size={16} 
                    color={item.quantity >= (item.stock + item.quantity) ? Colors.gray[400] : Colors.white} 
                  />
                </Pressable>
              </View>
              
              <Pressable
                style={styles.removeButton}
                onPress={() => removeProduct(item.id)}
              >
                <MaterialIcons name="delete" size={35} color={Colors.red[600]} />
              </Pressable>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Lista de Produtos" titleStyle={{ fontSize: 24 }} />

      {/* ALERTA DE TELA BLOQUEADA */}
      {isScreenBlocked && (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}>
          <CashAvailabilityAlert 
            mode="blocking" 
            cashStatus={cashStatus} 
            style={{
              marginHorizontal: 0,
              marginVertical: 0,
            }}
          />
        </View>
      )}

      {/* CONTEÚDO PRINCIPAL - SÓ MOSTRA SE NÃO ESTIVER BLOQUEADO */}
      {!isScreenBlocked && (
        <>
        <View style={styles.formContainer}>
        {/* Botões de Ação */}
        <View style={styles.actionButtonsContainer}>
          <Pressable
            style={styles.addProductButton}
            onPress={() => setProductListModalVisible(true)}
          >
            <MaterialIcons name="add" size={20} color={Colors.white} />
            <Text style={styles.addProductButtonText}>Adicionar Produto</Text>
          </Pressable>

          <Pressable
            style={[
              styles.scanButton,
              barcodeLoading && styles.scanButtonDisabled,
            ]}
            onPress={() => setBarcodeModalVisible(true)}
            disabled={barcodeLoading}
          >
            <MaterialIcons
              name={barcodeLoading ? "hourglass-empty" : "qr-code-scanner"}
              size={20}
              color={Colors.white}
            />
          </Pressable>
        </View>

        <Separator marginTop={8} marginBottom={8} />

        {/* Título da Lista */}
        <Text style={styles.sectionTitle}>Produtos Selecionados</Text>

        {/* Lista de Produtos com Scroll */}
        <View style={styles.productsListContainer}>
          {products.length === 0 ? (
            <Text style={styles.emptyProductsText}>
              Nenhum produto adicionado
            </Text>
          ) : (
            <ScrollView
              style={styles.productsScrollView}
              contentContainerStyle={styles.productsListContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.productsGrid}>
                {products.map((item) => {
                  const isExpanded = expandedCards.includes(item.id);
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.productCardWrapper,
                        isExpanded && styles.expandedProductCardWrapper,
                      ]}
                    >
                      {renderProductItem({ item })}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>

          {/* Total e Botão Finalizar no fim da tela */}
          <View style={styles.bottomContainer}>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>R$ {totalAmount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.finalizeButton,
                (!isFormValid || loading) && styles.finalizeButtonDisabled,
              ]}
              onPress={handleRegisterSale}
              disabled={!isFormValid || loading}
            >
              <Text style={styles.finalizeButtonText}>
                {loading ? `Preparando${dotText}` : "Finalizar Lista"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Modal de Código de Barras */}
      <Modal
        visible={barcodeModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraComponent
          mode="barcode"
          onBarcodeScanned={handleBarcodeScanned}
          onManualAction={handleCloseBarcodeModal}
        />
      </Modal>

      {/* Modal de Lista de Produtos */}
      <ProductListModal
        visible={productListModalVisible}
        onClose={() => setProductListModalVisible(false)}
        onProductSelect={handleProductSelect}
        selectedProducts={products.map((p) => ({
          id: p.id,
          productName: p.name,
          unitPrice: p.price,
          quantity: p.stock + p.quantity, // Estoque total disponível (estoque atual + quantidade já vendida)
          barcode: p.barcode,
        }))}
      />

      {/* Spinner para busca de produto */}
      <Spinner
        visible={barcodeLoading}
        textContent="Buscando produto..."
        textStyle={{
          color: Colors.text.primary,
          fontSize: 16,
          fontWeight: "500",
        }}
        color={Colors.blue.logo}
        overlayColor={Colors.overlay.medium}
        size="large"
        animation="fade"
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={productDetailModalVisible}
        onClose={handleProductDetailClose}
        onRegister={handleProductDetailRegister}
        product={selectedProductForDetail}
        loading={false}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setFeedbackVisible(false)}
        dismissible={true}
      />
    </View>
  );
}
