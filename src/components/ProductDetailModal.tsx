import Colors from "@/src/constants/Colors";
import { styles } from "@/src/styles/components/ProductDetailModalStyle";
import { Product } from "@/src/types/productsTypes/products";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";

interface ProductDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onRegister: (product: Product, quantity: number) => void;
  product: Product | null;
  loading?: boolean;
}

export default function ProductDetailModal({ 
  visible, 
  onClose, 
  onRegister, 
  product,
  loading = false 
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState("1");

  const handleRegister = () => {
    if (product && quantity) {
      const requestedQuantity = parseInt(quantity) || 1;
      onRegister(product, requestedQuantity);
      setQuantity("1");
    }
  };

  const handleClose = () => {
    setQuantity("1");
    onClose();
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Detalhes do Produto</Text>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color={Colors.white} />
            </Pressable>
          </View>

          {/* Product Card */}
          <View style={styles.productCard}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>
                {product.productName}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: Colors.blue.primary }]}>
                <Text style={styles.statusText}>Disponível</Text>
              </View>
            </View>

            <View style={styles.productDetails}>
              <View style={styles.detailItem}>
                <FontAwesome name="dollar" size={16} color={Colors.blue.primary} />
                <Text style={styles.detailLabel}>Preço:</Text>
                <Text style={styles.detailValue}>R$ {Number(product.unitPrice).toFixed(2)}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <FontAwesome name="cube" size={16} color={Colors.blue.primary} />
                <Text style={styles.detailLabel}>Estoque:</Text>
                <Text style={styles.detailValue}>{product.quantity}</Text>
              </View>
            </View>

            <View style={styles.expirationContainer}>
              <FontAwesome name="calendar" size={14} color={Colors.gray[500]} />
              <Text style={styles.expirationText}>
                Validade: {product.expirationDate 
                  ? product.expirationDate.slice(0, 10).split("-").reverse().join("/")
                  : "Não registrada"}
              </Text>
            </View>

            {product.barcode && (
              <View style={styles.barcodeContainer}>
                <FontAwesome name="barcode" size={14} color={Colors.gray[500]} />
                <Text style={styles.barcodeText}>
                  Código: {product.barcode}
                </Text>
              </View>
            )}
          </View>

          {/* Quantity Input */}
          <View style={styles.quantitySection}>
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
                  const maxAllowed = product.quantity;
                  const clampedValue = Math.max(1, Math.min(num, maxAllowed));
                  setQuantity(clampedValue.toString());
                }}
                keyboardType="numeric"
                selectTextOnFocus
              />
              
              <Pressable
                style={[
                  styles.quantityButton,
                  parseInt(quantity) >= product.quantity && styles.quantityButtonDisabled
                ]}
                onPress={() => {
                  const newQuantity = Math.min(product.quantity, parseInt(quantity) + 1);
                  setQuantity(newQuantity.toString());
                }}
                disabled={parseInt(quantity) >= product.quantity}
              >
                <MaterialIcons 
                  name="add" 
                  size={16} 
                  color={parseInt(quantity) >= product.quantity ? Colors.gray[400] : Colors.white} 
                />
              </Pressable>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable 
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.registerButton,
                loading && styles.registerButtonDisabled
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <MaterialIcons name="add-shopping-cart" size={20} color={Colors.white} />
              )}
              <Text style={styles.registerButtonText}>
                {loading ? "Registrando..." : "Registrar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
