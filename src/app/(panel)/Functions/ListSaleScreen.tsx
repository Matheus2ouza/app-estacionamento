import {
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Colors from "@/src/constants/Colors";
import useSearchProducts from "@/src/hooks/products/useSearchProduc";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import BarcodeScanner from "@/src/components/BarcodeScanner";
import { useState, useCallback, useEffect, useRef } from "react";
import { Product } from "@/src/types/products";
import {
  styles,
  productListStyles,
  ModalStyle,
} from "@/src/styles/functions/newSaleStyle";
import Header from "@/src/components/Header";
import FeedbackModal from "@/src/components/FeedbackModal";
import { router } from "expo-router";

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [barcode, setBarcode] = useState("");
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shouldShowSuggestions, setShouldShowSuggestions] = useState(false);
  const [filterTimeout, setFilterTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("1");

  const { searchProducts, loading } = useSearchProducts();
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const result = await searchProducts();
      if (result.success) {
        setProducts(result.list);
        setFilteredProducts(result.list);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    setShouldShowSuggestions(
      isInputFocused && (searchQuery.length > 0 || products.length > 0)
    );
  }, [isInputFocused, searchQuery, products]);

  // Filtrar produtos conforme pesquisa
  const filterProducts = useCallback(
    (query: string) => {
      if (!query) {
        // Se não há query, mostrar produtos mais relevantes (ex: mais vendidos, em estoque)
        return products
          .filter((p) => p.quantity > 0) // Mostrar apenas com estoque
          .slice(0, 5); // Limitar a 5 itens
      }

      // Filtro inteligente que busca no nome e no código de barras
      const queryLower = query.toLowerCase();
      return products.filter(
        (product) =>
          product.productName.toLowerCase().includes(queryLower) ||
          (product.barcode && product.barcode.includes(query))
      );
    },
    [products]
  );

  // Handler de mudança de texto otimizado
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (filterTimeout) {
      clearTimeout(filterTimeout);
    }

    // Debounce para evitar processamento a cada tecla pressionada
    const timeout = setTimeout(() => {
      setFilteredProducts(filterProducts(text));
    }, 200);

    setFilterTimeout(timeout as unknown as NodeJS.Timeout);
  };

  useEffect(() => {
    return () => {
      if (filterTimeout) clearTimeout(filterTimeout);
    };
  }, [filterTimeout]);

  // Buscar por código de barras
  const handleBarcodeScanned = (data: string) => {
    setBarcode(data);
    setIsScannerVisible(false);

    const productFound = products.find((product) => product.barcode === data);

    if (productFound) {
      setSelectedProduct(productFound);
      setIsQuantityModalVisible(true);
    } else {
      setModalMessage("Produto não encontrado com este código de barras");
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  };

  // Abrir modal para adicionar quantidade
  const openQuantityModal = (product: Product) => {
    setSelectedProduct(product);
    setIsQuantityModalVisible(true);
    setQuantity("1");
  };

  // Adicionar produto à lista com quantidade
  const addProductWithQuantity = () => {
    if (!selectedProduct) return;

    const quantityValue = parseInt(quantity) || 1;

    // Verifica se a quantidade é maior que o estoque disponível
    if (quantityValue > selectedProduct.quantity) {
      setModalMessage(
        `Quantidade indisponível! Estoque atual: ${selectedProduct.quantity}`
      );
      setModalIsSuccess(false);
      setModalVisible(true);
      return; // Impede a adição do produto
    }

    const productWithQuantity = {
      ...selectedProduct,
      quantity: quantityValue,
      total: (selectedProduct.unitPrice || 0) * quantityValue,
    };

    setSelectedProducts((prev) => [...prev, productWithQuantity]);
    setIsQuantityModalVisible(false);
    setSearchQuery("");
    setShowSuggestions(false);
  };
  // Funções de manipulação de foco
  const handleInputFocus = () => {
    setIsInputFocused(true);
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  // Remover produto da lista
  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Calcular total da venda
  const calculateTotal = () => {
    return selectedProducts.reduce(
      (sum, product) => sum + product.unitPrice * product.quantity,
      0
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        handleInputBlur();
      }}
    >
      <View style={{ flex: 1 }}>
        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          isSuccess={modalIsSuccess}
          onClose={() => setModalVisible(false)}
        />

        {/* Scanner de código de barras */}
        <BarcodeScanner
          visible={isScannerVisible}
          onClose={() => setIsScannerVisible(false)}
          onBarcodeScanned={handleBarcodeScanned}
        />

        {/* Modal para selecionar quantidade */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isQuantityModalVisible}
          onRequestClose={() => setIsQuantityModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={ModalStyle.modalOverlay}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={ModalStyle.modalContainer}>
                <View style={ModalStyle.modalContent}>
                  <Text style={ModalStyle.modalTitle}>
                    {selectedProduct?.productName}
                  </Text>

                  <View style={ModalStyle.modalInfoContainer}>
                    <Text style={ModalStyle.modalInfoText}>
                      Código: {selectedProduct?.barcode}
                    </Text>
                    <Text style={ModalStyle.modalInfoText}>
                      Preço Unitário: R${" "}
                      {selectedProduct?.unitPrice?.toFixed(2)}
                    </Text>
                    <Text style={ModalStyle.modalInfoText}>
                      Estoque: {selectedProduct?.quantity}
                    </Text>
                    {selectedProduct?.expirationDate && (
                      <Text style={ModalStyle.modalInfoText}>
                        Validade:{" "}
                        {new Date(
                          selectedProduct.expirationDate
                        ).toLocaleDateString()}
                      </Text>
                    )}
                  </View>

                  <TextInput
                    style={ModalStyle.quantityInput}
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="Quantidade"
                    autoFocus={true}
                  />

                  <View style={ModalStyle.modalButtons}>
                    <TouchableOpacity
                      style={[ModalStyle.modalButton, ModalStyle.cancelButton]}
                      onPress={() => setIsQuantityModalVisible(false)}
                    >
                      <Text style={ModalStyle.buttonText}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[ModalStyle.modalButton, ModalStyle.addButton]}
                      onPress={addProductWithQuantity}
                    >
                      <Text style={ModalStyle.buttonText}>Adicionar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>

        <Header title="Nova Compra" />

        {/* Campo de busca */}
        <View style={{ position: "relative", zIndex: 10, marginTop: 10 }}>
          <View style={styles.searchBox}>
            <FontAwesome
              name="search"
              size={20}
              color={Colors.gray.dark}
              style={styles.searchIcon}
            />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Pesquisar produto..."
              placeholderTextColor={Colors.gray.dark}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.scanIcon}
              onPress={() => setIsScannerVisible(true)}
            >
              <MaterialIcons
                name="qr-code-scanner"
                size={24}
                color={Colors.blue.logo}
              />
            </TouchableOpacity>
          </View>

          {/* Sugestões de busca */}
          {shouldShowSuggestions && (
            <View style={styles.suggestionsContainer}>
              <ScrollView
                nestedScrollEnabled
                style={{ maxHeight: 300 }}
                keyboardShouldPersistTaps="always"
              >
                {/* Mensagem quando não encontra resultados */}
                {searchQuery.length > 0 && filteredProducts.length === 0 && (
                  <View style={styles.suggestionItem}>
                    <Text style={styles.suggestionText}>
                      Nenhum produto encontrado para "{searchQuery}"
                    </Text>
                  </View>
                )}

                {filteredProducts.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.suggestionItem}
                    onPress={() => {
                      openQuantityModal(product);
                      setSearchQuery("");
                      setShowSuggestions(false); // Fecha a lista de sugestões
                      setShouldShowSuggestions(false); // Garante que não vai reaparecer
                    }}
                  >
                    <Text style={styles.suggestionText} numberOfLines={1}>
                      {product.productName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Lista de produtos selecionados */}
        <ScrollView
          style={productListStyles.listContainer}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {selectedProducts.map((product) => (
            <View key={product.id} style={productListStyles.listItem}>
              <View style={{ flex: 1 }}>
                <Text style={productListStyles.productName}>
                  {product.productName}
                </Text>
                <Text style={productListStyles.productDetails}>
                  {product.quantity} x R$ {product.unitPrice?.toFixed(2)}
                </Text>
                {product.expirationDate && (
                  <Text style={productListStyles.productExpiration}>
                    Validade:{" "}
                    {new Date(product.expirationDate).toLocaleDateString()}
                  </Text>
                )}
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={productListStyles.productPrice}>
                  R$ {(product.unitPrice * product.quantity).toFixed(2)}
                </Text>
                <Text style={productListStyles.productStock}>
                  Cód: {product.barcode}
                </Text>
                <TouchableOpacity
                  onPress={() => removeProduct(product.id)}
                  style={productListStyles.removeButton}
                >
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color={Colors.red.accent}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Botão de finalização */}
        <TouchableOpacity
          style={productListStyles.paymentButton}
          onPress={() => {
            if (selectedProducts.length === 0) return;

            router.push({
              pathname: "/Functions/paymentProducts",
              params: {
                totalAmount: calculateTotal().toFixed(2),
                saleItems: JSON.stringify(selectedProducts),
                totalItems: selectedProducts.length.toString(),
              },
            });
          }}
          disabled={selectedProducts.length === 0}
        >
          <Text style={productListStyles.paymentButtonText}>
            Finalizar Compra (R$ {calculateTotal().toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
