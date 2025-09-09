import Colors from "@/src/constants/Colors";
import { TypographyThemes } from "@/src/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    ...TypographyThemes.inter.title,
    fontSize: 25,
  },
  scrollContainer: {
    gap: 20,
  },
  // Card de boas-vindas
  welcomeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.blue[500],
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeInfo: {
    flex: 1,
  },
  welcomeTitle: {
    ...TypographyThemes.poppins.title,
    fontSize: 20,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  welcomeDescription: {
    ...TypographyThemes.nunito.bodySmall,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    ...TypographyThemes.inter.subtitle,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text.primary,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  // Container de categorias
  categoryContainer: {
    gap: 8,
  },
  categoryLabel: {
    ...TypographyThemes.inter.subtitle,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  categoryButtons: {
    flexDirection: "column",
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: Colors.white,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.blue[50],
    borderColor: Colors.blue[500],
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryButtonText: {
    ...TypographyThemes.inter.subtitle,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.text.primary,
    textAlign: "left",
  },
  categoryButtonTextSelected: {
    fontWeight: "600",
    color: Colors.blue[600],
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 12,
  },
  categoryCheckmark: {
    marginLeft: "auto",
  },
  inputHint: {
    ...TypographyThemes.nunito.bodySmall,
    fontSize: 13,
    color: Colors.gray[500],
    marginLeft: 4,
    fontStyle: "italic",
  },
  inputHintError: {
    color: Colors.red[500],
    fontWeight: "800",
  },
  inputHintSuccess: {
    color: Colors.green[600],
    fontWeight: "600",
  },
  inputHintValidating: {
    color: Colors.orange[500],
    fontWeight: "600",
  },
  // Estilos para método de cobrança
  billingContainer: {
    gap: 8,
  },
  billingLabel: {
    ...TypographyThemes.inter.subtitle,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  // Estilos para estado vazio dos métodos de cobrança
  emptyBillingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.gray[200],
    borderStyle: "dashed",
  },
  emptyBillingIcon: {
    marginRight: 12,
  },
  emptyBillingContent: {
    flex: 1,
  },
  emptyBillingTitle: {
    ...TypographyThemes.inter.subtitle,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray[600],
    marginBottom: 2,
  },
  emptyBillingMessage: {
    ...TypographyThemes.nunito.bodySmall,
    fontSize: 12,
    color: Colors.gray[500],
    lineHeight: 16,
  },
  dropdown: {
    height: 50,
    borderColor: Colors.gray[200],
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.gray[400],
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  // Estilos para dados do método de cobrança
  billingDataContainer: {
    backgroundColor: Colors.blue[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.blue[200],
    gap: 12,
  },
  billingDataTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blue[700],
    marginBottom: 4,
  },
  billingDataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  billingDataLabel: {
    ...TypographyThemes.nunito.bodySmall,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  billingDataValue: {
    ...TypographyThemes.inter.subtitle,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: "600",
  },
  // Estilos para campo de observação
  observationContainer: {
    gap: 8,
  },
  observationLabel: {
    ...TypographyThemes.inter.subtitle,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  observationInput: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 100,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  observationHint: {
    ...TypographyThemes.nunito.bodySmall,
    fontSize: 12,
    color: Colors.gray[500],
    marginLeft: 4,
    textAlign: "right",
  },
  // Botões de ação
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  buttonConfirm: {
    flex: 1,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonCancel: {
    flex: 1,
    width: "100%",
  },
});
