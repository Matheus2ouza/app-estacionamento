import Colors from "@/src/constants/Colors";
import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    height: 55,
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  scanButton: {
    backgroundColor: Colors.blue.light,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    alignSelf: "center",
    gap: 8,
    marginTop: 10,
  },
  scanButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 55, // Ajustado para ficar logo abaixo do campo de busca
    left: 10,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
    maxHeight: 300,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.black,
  },
  scanIcon: {
    padding: 8,
  },

});

export const ModalStyle = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: Platform.OS === "ios" ? 20 : 0, // Ajuste adicional para iOS
  },
  modalContent: {
    width: "100%",
  },
  modalInfoContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  modalInfoText: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: Colors.black,
  },
  modalPrice: {
    fontSize: 16,
    color: Colors.blue.light,
    marginBottom: 20,
    textAlign: "center",
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: Colors.gray.light,
    borderRadius: 5,
    padding: 15,
    width: "100%",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    minWidth: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.gray.light,
  },
  addButton: {
    backgroundColor: Colors.blue.logo,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export const productListStyles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 80,
    width: "95%",
    alignSelf: "center",
  },
  listItem: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  productDetails: {
    fontSize: 14,
    color: Colors.gray[500],
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.blue[500], // Usando a paleta de azuis
  },
  productExpiration: {
    fontSize: 12,
    color: Colors.orange[600], // Nível específico da paleta laranja
    marginTop: 4,
    fontStyle: 'italic',
  },
  productStock: {
    fontSize: 12,
    color: Colors.gray[600],
    marginTop: 4,
  },
  paymentButton: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: Colors.green[500], // Verde primário
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    marginTop: 8,
    padding: 4,
  },
});
