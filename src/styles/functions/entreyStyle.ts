import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: "space-between",
  },
  formInputs: {
    gap: 16,
    position: "relative",
  },
  input: {
    width: "100%",
  },
  categoryContainer: {
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  categoryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  categoryButtonSelected: {
    backgroundColor: "#002B50", // azul escuro
    borderColor: "#002B50",
  },
  categoryButtonText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
  },
  categoryButtonTextSelected: {
    color: "#fff",
  },
  buttonContainer: {
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonConfirm: {
    width: "100%",
  },
});
