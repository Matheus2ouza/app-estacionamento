import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 25,
    color: Colors.white,
    fontWeight: 'bold',
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
  methodContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  methodLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    color: Colors.black,
  },
  methodDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  methodDetail: {
    fontSize: 16,
    color: Colors.gray[700],
    marginTop: 4,
    fontStyle: 'italic',
  },
  noConfigText: {
    fontSize: 16,
    marginTop: 20,
    color: Colors.gray[600],
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
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
    backgroundColor: Colors.gray[100],
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
    color: Colors.gray[700],
    marginBottom: 3,
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
});