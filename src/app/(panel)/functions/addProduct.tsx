import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import useRegisterProduct from "@/src/hooks/products/useRegisterProduct";
import { styles } from "@/src/styles/functions/addProductStyle";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [dotText, setDotText] = useState(".");
  const [isAdding, setIsAdding] = useState(false); // Novo estado para controlar o efeito
  const { registerProduct, loading, error } = useRegisterProduct();

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

  const handleRegister = async () => {
    setIsAdding(true);

    const parsedPrice = parseFloat(unitPrice.replace(",", "."));
    const parsedQuantity = parseInt(quantity, 10);

    const parsedExpiration = expirationDate || undefined;

    const product = {
      productName,
      unitPrice: parsedPrice,
      quantity: parsedQuantity,
      expirationDate: parsedExpiration,
    };

    try {
      const response = await registerProduct(product);

      if (response.success) {
        setModalMessage("Produto cadastrado com sucesso!");
        setModalIsSuccess(true);
        setProductName("");
        setUnitPrice("");
        setQuantity("");
        setExpirationDate("");
      } else {
        setModalMessage(response.message);
        setModalIsSuccess(false);
      }
    } catch (err: any) {
      setModalMessage(err.message || "Erro inesperado.");
      setModalIsSuccess(false);
    } finally {
      setIsAdding(false);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        isSuccess={modalIsSuccess}
        onClose={() => {
          setModalVisible(false);
        }}
      />

      <Header title="Adicionar Produto" />

      <ScrollView>
        <View style={styles.formContainer}>
          {/* Nome do Produto */}
          <Text style={styles.label}>Nome do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do produto"
            placeholderTextColor={Colors.gray}
            value={productName}
            onChangeText={setProductName}
          />

          {/* Valor e Quantidade em linha */}
          <View style={styles.inputRow}>
            <View style={styles.smallInput}>
              <Text style={styles.label}>Valor (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="0,00"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
                value={unitPrice}
                onChangeText={setUnitPrice}
              />
            </View>

            <View style={styles.smallInput}>
              <Text style={styles.label}>Quantidade</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
          </View>

          {/* Validade */}
          <Text style={styles.label}>Validade (MM/AAAA)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 12/2025"
            placeholderTextColor={Colors.gray}
            value={expirationDate}
            onChangeText={setExpirationDate}
          />
          <Text style={styles.description}>*A validade é opcional*</Text>

          {/* Botão de Adicionar */}
          <Pressable
            style={[
              styles.addButton,
              (!isFormValid || isAdding) && {
                backgroundColor: Colors.darkGray,
              },
            ]}
            disabled={!isFormValid || isAdding}
            onPress={handleRegister}
          >
            <Text
              style={[
                styles.addButtonText,
                (!isFormValid || isAdding) && { color: Colors.zincLight },
              ]}
            >
              {isAdding ? `Adicionando${dotText}` : "Adicionar Produto"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
