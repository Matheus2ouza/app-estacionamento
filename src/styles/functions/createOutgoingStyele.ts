import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  vehicleInfo: {
    padding: 20,
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.blue.light,
    marginBottom: 5,
  },
  vehicleDetail: {
    fontSize: 16,
    color: Colors.gray.dark,
    marginBottom: 3,
  },
  observationContainer: {
    position: "relative",
  },
  observationInputContainer: {
    position: "relative",
  },
  descriptionInput: {
    height: 90,
    textAlignVertical: "top",
  },
  characterCount: {
    position: "absolute",
    right: 15,
    bottom: 15,
    color: Colors.gray[500],
    fontSize: 12,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Fundo levemente branco para melhor legibilidade
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  vehiclePrice: {
    fontSize: 20,
    color: Colors.blue.light,
    fontWeight: "bold",
    marginTop: 10,
  },
  separator: {
    width: "95%",
    alignSelf: "center",
    height: 2,
    backgroundColor: Colors.gray.light,
    marginTop: 0,
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
});

export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fundo mais escuro para melhor contraste
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 12,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.red[600], // Vermelho mais intenso para atenção
    marginBottom: 16,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.gray[800], // Texto mais escuro para melhor legibilidade
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24, // Melhor espaçamento entre linhas
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: "600", // Semi-bold
    fontSize: 16,
  },
  // Estilo adicional para o ícone de atenção (opcional)
  iconContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
});
