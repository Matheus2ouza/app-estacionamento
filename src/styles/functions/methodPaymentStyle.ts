import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 25,
  },
  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 28,
    marginBottom: 10,
    color: Colors.blue.logo,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray.light,
    marginVertical: 10,
  },
  body: {
    paddingBottom: 100, // para evitar sobreposição do botão flutuante
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue.logo,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  methodLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  methodDetail: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  noConfigText: {
    fontSize: 16,
    marginTop: 20,
    color: "#999",
    textAlign: "center",
  },
section: {
    marginBottom: 20,
    backgroundColor: Colors.gray.light,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primary,
  },
  vehicleSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: Colors.gray.light,
    borderRadius: 8,
  },
  vehicleLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.gray.dark,
  },
  inputDetail: {
    fontSize: 14,
    color: Colors.gray.light,
    marginBottom: 3,
  },
});
