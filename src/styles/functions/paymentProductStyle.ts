import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  productInfo: {
    padding: 20,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.blue.light,
    marginBottom: 5,
  },
  fullListButton: {
    backgroundColor: Colors.blue.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 50,
    width: "45%",
    borderRadius: 6,
  },
  fullListButtonText: {
    color: Colors.white,
    fontWeight: "500",
  },
  separator: {
    width: "95%",
    alignSelf: "center",
    height: 2,
    backgroundColor: Colors.gray.light,
    marginTop: 0,
  },
  productPrice: {
    fontSize: 20,
    color: Colors.blue.light,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: Colors.white,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: Colors.gray.dark,
    marginBottom: 10,
    fontWeight: "500",
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  methodButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  methodButton: {
    flex: 1,
    minWidth: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: Colors.white,
  },
  methodButtonSelected: {
    backgroundColor: Colors.blue.light,
    borderColor: Colors.blue.light,
  },
  methodButtonText: {
    marginLeft: 8,
    color: Colors.gray.dark,
  },
  methodButtonTextSelected: {
    color: Colors.white,
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.gray.dark,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  positive: {
    color: Colors.success,
  },
  negative: {
    color: Colors.error,
  },
  paymentButton: {
    backgroundColor: Colors.blue.light,
    padding: 16,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  cashWarning: {
    backgroundColor: Colors.red[500],
    padding: 10,
    alignItems: "center",
  },
  cashWarningText: {
    color: Colors.white,
    fontWeight: "bold",
  },
});
