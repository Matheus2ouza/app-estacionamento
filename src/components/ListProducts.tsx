import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";

interface ProductListModalProps {
  visible: boolean;
  onClose: () => void;
  products: any[];
  quantityProducts: number;
  totalAmount: number;
}

const ProductListModal = ({
  visible,
  onClose,
  products,
  quantityProducts,
  totalAmount,
}: ProductListModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={modalStyles.container}>
        <View style={modalStyles.header}>
          <Text style={modalStyles.title}>
            Produtos ({quantityProducts})
          </Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <ScrollView style={modalStyles.listContainer}>
          {products.map((item, index) => (
            <View key={index} style={modalStyles.item}>
              <Text style={modalStyles.productName}>
                {item.productName} {/* Alterado de item.product.productName para item.productName */}
              </Text>
              <Text style={modalStyles.quantity}>
                x{item.soldQuantity || item.quantity} {/* Adicionado fallback para item.quantity */}
              </Text>
              <Text style={modalStyles.price}>
                R$ {item.unitPrice.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={modalStyles.footer}>
          <Text style={modalStyles.total}>
            Total: R$ {totalAmount.toFixed(2).replace(".", ",")}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.blue.light,
  },
  listContainer: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  productName: {
    fontSize: 16,
    color: Colors.gray.dark,
    flex: 2,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
    width: 40,
    textAlign: "center",
  },
  price: {
    fontSize: 16,
    color: Colors.gray.dark,
    width: 80,
    textAlign: "right",
  },
  footer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.blue.light,
    textAlign: "right",
  },
});

export default ProductListModal;