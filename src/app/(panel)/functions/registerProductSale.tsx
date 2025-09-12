import CameraComponent from "@/src/components/CameraComponent";
import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import ProductListModal from "@/src/components/ProductListModal";
import Separator from "@/src/components/Separator";
import Colors, { generateRandomColor } from "@/src/constants/Colors";
import useBarcodeSearch from "@/src/hooks/products/useBarcodeSearch";
import { styles } from "@/src/styles/functions/registerProductSaleStyle";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";


interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode?: string;
  borderColor?: string;
}

export default function RegisterProductSale() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [dotText, setDotText] = useState(".");
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  
  // Animações para cada card de produto
  const [animations, setAnimations] = useState<{[key: string]: Animated.Value}>({});
  
  
  // Estados para feedback
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  // Estados para modal de código de barras
  const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);
  
  // Estados para modal de lista de produtos
  const [productListModalVisible, setProductListModalVisible] = useState(false);
  
  // Estados para loading
  const [loading, setLoading] = useState(false);
  const { searchByBarcode, loading: barcodeLoading } = useBarcodeSearch();

  const isFormValid = products.length > 0;

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  const handleBarcodeScanned = async (data: { data: string }) => {
    const scannedBarcode = data.data;
    setBarcodeModalVisible(false);
    
    // Buscar produto automaticamente
    const result = await searchByBarcode(scannedBarcode);
    
    if (result.success && result.data) {
      // Verificar se o produto já existe na lista
      const existingProductIndex = products.findIndex(p => p.name === result.data?.name);
      
      if (existingProductIndex !== -1) {
        // Se o produto já existe, incrementar a quantidade
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex].quantity += 1;
        setProducts(updatedProducts);
        updateTotalAmount(updatedProducts);
      } else {
        // Se é um produto novo, adicionar à lista
        // Por enquanto, só temos o nome do produto das APIs externas
        const newProduct: ProductItem = {
          id: Date.now().toString(),
          name: result.data?.name || "Produto não identificado",
          price: 0, // Preço será definido manualmente
          quantity: 1,
          barcode: scannedBarcode,
          borderColor: generateRandomColor(),
        };
        
        setProducts(prev => [...prev, newProduct]);
        updateTotalAmount([...products, newProduct]);
      }
      
      showFeedback("Produto adicionado com sucesso", "success");
    } else {
      showFeedback(
        result.message || "Produto não encontrado na base de dados", 
        "warning"
      );
    }
  };

  const handleCloseBarcodeModal = () => {
    setBarcodeModalVisible(false);
  };

  const handleProductSelect = (product: any) => {
    console.log('🛒 [RegisterProductSale] Produto selecionado:', product);
    console.log('🛒 [RegisterProductSale] Produtos atuais:', products);
    
    // Verificar se o produto já existe na lista
    const existingProductIndex = products.findIndex(p => p.name === product.productName);
    
    if (existingProductIndex !== -1) {
      // Se o produto já existe, incrementar a quantidade
      console.log('🛒 [RegisterProductSale] Produto já existe, incrementando quantidade');
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity += product.quantity || 1;
      setProducts(updatedProducts);
      updateTotalAmount(updatedProducts);
    } else {
      // Se é um produto novo, adicionar à lista
      console.log('🛒 [RegisterProductSale] Produto novo, adicionando à lista');
      const newProduct: ProductItem = {
        id: product.id || Date.now().toString(),
        name: product.productName,
        price: product.unitPrice,
        quantity: product.quantity || 1,
        barcode: product.barcode,
        borderColor: generateRandomColor(),
      };
      
      setProducts(prev => [...prev, newProduct]);
      updateTotalAmount([...products, newProduct]);
    }
    
    setProductListModalVisible(false);
  };

  const updateTotalAmount = (productList: ProductItem[]) => {
    const total = productList.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    setTotalAmount(total);
  };

  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }
    
    const updatedProducts = products.map(product =>
      product.id === productId ? { ...product, quantity: newQuantity } : product
    );
    setProducts(updatedProducts);
    updateTotalAmount(updatedProducts);
  };

  const removeProduct = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    updateTotalAmount(updatedProducts);
    
    // Remove animação e estado expandido do produto removido
    setAnimations(prev => {
      const newAnimations = { ...prev };
      delete newAnimations[productId];
      return newAnimations;
    });
    setExpandedCards(prev => prev.filter(id => id !== productId));
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
      // Simular registro da venda
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showFeedback("Lista de produtos finalizada com sucesso!", "success");
      
      // Limpar campos após sucesso
      setProducts([]);
      setTotalAmount(0);
      
      // Redirecionar de volta após 2 segundos
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      showFeedback("Erro ao finalizar lista", "error");
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

  const renderProductItem = ({ item }: { item: ProductItem }) => {
    const isExpanded = expandedCards.includes(item.id);
    const animationValue = animations[item.id] || new Animated.Value(0);
    
    return (
      <Animated.View style={[
        styles.productCard,
        isExpanded && styles.expandedProductCard,
        {
          borderLeftColor: item.borderColor || Colors.blue.primary,
          transform: [{
            scale: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.02],
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
          R$ {item.price.toFixed(2)}
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
              <Text style={styles.productDetailValue}>R$ {item.price.toFixed(2)}</Text>
            </View>
            
            <View style={styles.productDetailRow}>
              <Text style={styles.productDetailLabel}>Quantidade</Text>
              <Text style={styles.productDetailValue}>{item.quantity}</Text>
            </View>
            
            <View style={styles.productDetailRow}>
              <Text style={styles.productDetailLabel}>Valor Total</Text>
              <Text style={styles.productDetailValue}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
            </View>
            
            <View style={styles.productDetailRow}>
              <Text style={styles.productDetailLabel}>Estoque</Text>
              <Text style={styles.productDetailValue}>N/A</Text>
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
                  style={styles.quantityButton}
                  onPress={() => updateProductQuantity(item.id, item.quantity + 1)}
                >
                  <MaterialIcons name="add" size={16} color={Colors.white} />
                </Pressable>
              </View>
              
              <Pressable
                style={styles.removeButton}
                onPress={() => removeProduct(item.id)}
              >
                <MaterialIcons name="delete" size={16} color={Colors.red[600]} />
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
            style={[styles.scanButton, barcodeLoading && styles.scanButtonDisabled]}
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
            <Text style={styles.emptyProductsText}>Nenhum produto adicionado</Text>
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
                        isExpanded && styles.expandedProductCardWrapper
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
            (!isFormValid || loading) && styles.finalizeButtonDisabled
          ]}
          onPress={handleRegisterSale}
          disabled={!isFormValid || loading}
        >
          <Text style={styles.finalizeButtonText}>
            {loading ? `Finalizando${dotText}` : "Finalizar Lista"}
          </Text>
        </TouchableOpacity>
      </View>

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
        selectedProducts={products.map(p => ({
          id: p.id,
          productName: p.name,
          unitPrice: p.price,
          quantity: p.quantity,
          barcode: p.barcode
        }))}
      />

      {/* Spinner para busca de produto */}
      <Spinner
        visible={barcodeLoading}
        textContent="Buscando produto..."
        textStyle={{
          color: Colors.text.primary,
          fontSize: 16,
          fontWeight: '500'
        }}
        color={Colors.blue.logo}
        overlayColor={Colors.overlay.medium}
        size="large"
        animation="fade"
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
