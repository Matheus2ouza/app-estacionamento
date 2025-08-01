import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useRegisterProduct from "@/src/hooks/products/useRegisterProduct";
import { styles } from "@/src/styles/functions/addProductStyle";
import LoadingModal from "@/src/components/LoadingModal";
import { Product } from "@/src/types/products";
import { useEffect, useState, useRef } from "react";
import { DeleteAnimationModal } from "@/src/components/DeleteAnimationModal";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  ToastAndroid,
} from "react-native";
import { TextInput } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { Animated, Easing } from "react-native";

export default function EditProduct() {
  // Recebendo os parâmetros do produto a ser editado
  const params = useLocalSearchParams();
  const productToEdit = params as unknown as Product;

  // Estados do formulário
  const [productName, setProductName] = useState(productToEdit.productName || "");
  const [unitPrice, setUnitPrice] = useState(productToEdit.unitPrice?.toString() || "");
  const [quantity, setQuantity] = useState(productToEdit.quantity?.toString() || "");
  const [expirationDate, setExpirationDate] = useState(productToEdit.expirationDate || "");
  const [barcode, setBarcode] = useState(productToEdit.barcode || "");

  // Estados de UI
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [dotText, setDotText] = useState(".");
  const [isAdding, setIsAdding] = useState(false);
  const [LoadingIsModal, setLoadingIsModal] = useState(false);
  const [textLoading, setTextLoading] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { editProduct, deleteProduct } = useRegisterProduct();
  const isFormValid = productName && unitPrice && quantity;

  useEffect(() => {
    if (!isAdding) return;

    const interval = setInterval(() => {
      setDotText((prev) => {
        if (prev.length >= 3) return ".";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isAdding]);

  const handleUpdate = async () => {
    setIsAdding(true);

    const product: Product = {
      id: productToEdit.id,
      productName,
      barcode,
      unitPrice: parseFloat(unitPrice.replace(",", ".")),
      quantity: parseInt(quantity, 10),
      expirationDate: expirationDate || undefined,
    };

    try {
      const response = await editProduct(product);
      setModalMessage(response.success ? "Produto atualizado com sucesso!" : response.message);
      setModalIsSuccess(response.success);
    } catch (err: any) {
      setModalMessage(err.message || "Erro inesperado.");
      setModalIsSuccess(false);
    } finally {
      setIsAdding(false);
      setModalVisible(true);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowConfirmModal(false);
    
    try {
      const response = await deleteProduct(productToEdit.id, productToEdit.barcode);
      
      if (response.success) {
        setShowDeleteAnimation(true); // Mostra animação de exclusão
      } else {
        ToastAndroid.show(response.message || "Erro ao excluir produto", ToastAndroid.LONG);
        setIsDeleting(false);
      }
    } catch (error) {
      ToastAndroid.show("Erro ao excluir produto", ToastAndroid.LONG);
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    setShowConfirmModal(true);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Modais */}
      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        isSuccess={modalIsSuccess}
        shouldGoBack={false}
        onClose={() => {
          setModalVisible(false);
          if (modalIsSuccess) router.back();
        }}
      />

      <ConfirmationModal
        visible={showConfirmModal}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmButtonColor={Colors.blue.light}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmModal(false)}
      />

      <DeleteAnimationModal
        visible={showDeleteAnimation}
        onComplete={() => {
          setShowDeleteAnimation(false);
          ToastAndroid.show("Produto excluído com sucesso!", ToastAndroid.LONG);
          router.back();
        }}
        itemName={productName}
      />

      <LoadingModal visible={LoadingIsModal} text={textLoading} />

      {/* Conteúdo principal */}
      <Header title="Editar Produto" titleStyle={{ fontSize: 27 }} />

      <ScrollView>
        <View style={styles.formContainer}>
          {/* Nome do Produto */}
          <TextInput
            label="Nome do Produto"
            mode="outlined"
            style={styles.input}
            placeholderTextColor={Colors.blue.logo}
            value={productName}
            onChangeText={setProductName}
            cursorColor={Colors.blue.light}
          />

          {/* Codigo de barras */}
          <Pressable
            onPress={() =>
              ToastAndroid.show(
                "O codigo de barras não pode ser editado",
                ToastAndroid.SHORT
              )
            }
          >
            <TextInput
              label="Código de Barras"
              mode="outlined"
              style={[styles.input, { marginTop: 20 }]}
              placeholderTextColor={Colors.gray[500]}
              value={barcode}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>

          {/* Valor e Quantidade em linha */}
          <View style={styles.inputRow}>
            <View style={styles.smallInput}>
              <TextInput
                label="Valor (R$)"
                mode="outlined"
                style={styles.input}
                placeholderTextColor={Colors.gray[500]}
                keyboardType="numeric"
                value={unitPrice}
                onChangeText={setUnitPrice}
              />
            </View>

            <View style={styles.smallInput}>
              <TextInput
                label="Quantidade"
                mode="outlined"
                style={styles.input}
                placeholderTextColor={Colors.gray[500]}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
          </View>

          <TextInput
            label="Validade (MM/AAAA)"
            mode="outlined"
            style={[styles.input, { marginTop: 25 }]}
            placeholderTextColor={Colors.gray[500]}
            value={expirationDate}
            onChangeText={setExpirationDate}
            keyboardType="ascii-capable"
          />
          <Text style={styles.description}>*A validade é opcional*</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        {/* Botão de Excluir */}
        <Pressable
          style={[
            styles.deleteButton,
            isDeleting && { backgroundColor: Colors.gray[500] },
          ]}
          disabled={isDeleting}
          onPress={confirmDelete}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? "Excluindo..." : "Excluir Produto"}
          </Text>
        </Pressable>

        {/* Botão de Atualizar */}
        <Pressable
          style={[
            styles.addButton,
            (!isFormValid || isAdding || isDeleting) && {
              backgroundColor: Colors.gray[500],
            },
          ]}
          disabled={!isFormValid || isAdding || isDeleting}
          onPress={handleUpdate}
        >
          <Text
            style={[
              styles.addButtonText,
              (!isFormValid || isAdding || isDeleting) && {
                color: Colors.gray.light,
              },
            ]}
          >
            {isAdding ? `Atualizando${dotText}` : "Atualizar Produto"}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}