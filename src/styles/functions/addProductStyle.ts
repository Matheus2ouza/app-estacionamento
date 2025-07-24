import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.blueLogo,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    fontSize: 15,
    fontWeight: "500",
    height: 58,
    backgroundColor: Colors.lightGray,
    borderColor: Colors.grayLight,
  },
  description: {
    fontSize: 13,
    color: Colors.gray,
    marginLeft: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
    backgroundColor: Colors.blueLight,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: Colors.blueLight,
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
});
