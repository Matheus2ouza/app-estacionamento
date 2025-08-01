import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 25,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.primary,
  },
  methodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  methodButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.gray.light,
    borderRadius: 20,
  },
  selectedMethod: {
    backgroundColor: Colors.primary,
  },
  activeMethod: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  methodText: {
    color: Colors.gray.dark,
  },
  selectedMethodText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  activeMethodText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: Colors.gray.dark,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: Colors.gray.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  vehicleSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.gray.extraLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  activeMethodBanner: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
});