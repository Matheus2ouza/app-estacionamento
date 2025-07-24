import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  formSection: {
    flexGrow: 1,
  },
  formInputs: {
    gap: 8,
    position: "relative",
  },
  input: {
    width: "100%",
  },
  categoryContainer: {},
  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
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
    backgroundColor: Colors.blue.dark, // azul escuro
    borderColor: Colors.blue.dark,
  },
  categoryButtonText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
  },
  categoryButtonTextSelected: {
    color: "#fff",
  },
  descriptionContainer: {
    marginTop: 20,
    width: "100%",
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.gray.dark,
  },
  descriptionScroll: {
    maxHeight: 160,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 4,
    padding: 8,
    backgroundColor: Colors.gray[100],
  },
  descriptionContent: {
    paddingBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginBottom: 6,
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
  },
  buttonAtt: {
    width: "100%",
  },
  buttonDelete: {
    width: "100%",
    backgroundColor: Colors.red[500],
  },
  buttonReactivate: {
    width: "100%",
    backgroundColor: Colors.green[500],
  },
});
