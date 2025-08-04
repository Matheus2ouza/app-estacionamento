import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.blue.logo,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    fontSize: 15,
    fontWeight: "500",
    height: 58,
    backgroundColor: Colors.gray.light,
    borderColor: Colors.gray.light,
  },
  description: {
    fontSize: 13,
    color: Colors.gray[500],
    marginLeft: 10,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  smallInput: {
    flex: 1,
    marginTop: 20,
  },
  barcodeContainer: {
    marginTop: 15,
  },
  barcodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  barcodeInput: {
    flex: 1,
  },
  scanButton: {
    backgroundColor: Colors.blue.light,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scanButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12, // Espaço entre os botões
  },

  addButton: {
    backgroundColor: Colors.blue.light,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: Colors.red[500],
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
