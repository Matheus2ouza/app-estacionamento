import Colors from "@/src/constants/Colors";
import { styles } from "@/src/styles/components/ProductDetailsModalStyles";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

interface ProductDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  products: any[]; // Usando any[] para ser mais flexível com diferentes estruturas de dados
  title?: string;
}

export default function ProductDetailsModal({ 
  visible, 
  onClose, 
  products, 
  title = "Detalhes dos Produtos" 
}: ProductDetailsModalProps) {

  // Debug: verificar os dados recebidos
  console.log('🔍 [ProductDetailsModal] Produtos recebidos:', products);

  const renderProductItem = ({ item }: { item: any }) => {
    // Usar as propriedades corretas baseadas nos dados enviados
    const productName = item.productName || item.name || "Produto não identificado";
    const unitPrice = item.unitPrice || item.price || 0;
    const quantity = item.quantity || 0;
    const expirationDate = item.expirationDate;
    
    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>
            {productName}
          </Text>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>
              Qtd: {quantity}
            </Text>
          </View>
        </View>

        <View style={styles.productDetails}>
          <View style={styles.detailItem}>
            <FontAwesome name="dollar" size={16} color={Colors.blue.primary} />
            <Text style={styles.detailLabel}>Preço Unit.:</Text>
            <Text style={styles.detailValue}>R$ {Number(unitPrice).toFixed(2)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <FontAwesome name="calculator" size={16} color={Colors.green[600]} />
            <Text style={styles.detailLabel}>Total:</Text>
            <Text style={styles.detailValue}>R$ {(Number(unitPrice) * quantity).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.expirationContainer}>
          <FontAwesome name="calendar" size={14} color={Colors.gray[500]} />
          <Text style={styles.expirationText}>
            Validade: {expirationDate 
              ? expirationDate.slice(0, 10).split("-").reverse().join("/")
              : "Não registrada"}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="shopping-cart" size={64} color={Colors.gray[400]} />
        <Text style={styles.emptyText}>
          Nenhum produto selecionado.
        </Text>
      </View>
    );
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const unitPrice = product.unitPrice || product.price || 0;
      const quantity = product.quantity || 0;
      return total + (Number(unitPrice) * quantity);
    }, 0);
  };

  const calculateTotalItems = () => {
    return products.reduce((total, product) => {
      const quantity = product.quantity || 0;
      return total + quantity;
    }, 0);
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
          <Text style={styles.headerTitle}>{title}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

        {/* Summary Card */}
        {products.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <MaterialIcons name="receipt" size={24} color={Colors.blue[600]} />
              <Text style={styles.summaryTitle}>Resumo da Venda</Text>
            </View>
            
            <View style={styles.summaryDetails}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total de Itens:</Text>
                <Text style={styles.summaryValue}>{calculateTotalItems()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total da Venda:</Text>
                <Text style={styles.summaryTotalValue}>
                  R$ {calculateTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Product List */}
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id || item.productName}
          contentContainerStyle={[
            styles.productList,
            products.length === 0 && { flexGrow: 1 }
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>
    </Modal>
  );
}
