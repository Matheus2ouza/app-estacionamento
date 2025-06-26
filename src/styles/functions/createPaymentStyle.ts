import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  header: {
    fontSize: 25,
  },
  dropdownWrapper: {
    zIndex: 100,
  },
  inputsWrapper: {
    gap: 5,
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.red,
    marginLeft: 8,
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.zincLight,
    marginBottom: 5,
  },
  extraInputWrapper: {
    flexDirection: "row",
    width: '100%',
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 10
  },

  extraInputLabel: {
    fontSize: 13,
    color: "#333",
  },

  extraInputInput: {
    width:45,
    height: 40,
    fontSize: 10,
    textAlign: "justify",
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    borderColor: Colors.zincDark,
    padding: 0,
  },

  toleranceInput: {
    width: 50,
    height: 40,
    fontSize: 14,
    textAlign: "justify",
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    borderColor: Colors.zincDark,
    padding: 0,
  },

  vehicleSection: {
    marginTop: 5,
  },
  vehicleLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
  },
  inputRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  inputWrapper: {
    width: "30%",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
    color: "#666",
  },
  input: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderColor: Colors.zincDark,
    paddingHorizontal: 0,
    height: 32,
    width: 90,
  },
  button: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButton: {
    width: "90%",
  },
});
