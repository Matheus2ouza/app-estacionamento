import Colors from "@/constants/Colors";
import { TypographyThemes } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  
  // Card de informações da venda
  saleInfoCard: {
    backgroundColor: Colors.blue[50],
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.blue[200],
    elevation: 3,
    shadowColor: Colors.blue[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
  },
  saleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.blue[600],
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 2,
  },
  saleInfo: {
    flex: 1,
    paddingTop: 4,
  },
  saleTitle: {
    ...TypographyThemes.poppins.title,
    fontSize: 25,
    color: Colors.text.primary,
    marginBottom: 14,
    fontWeight: '700',
  },
  saleDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    flex: 1,
  },
  itemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemsLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  itemsCount: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.blue[600],
    fontWeight: '700',
  },
  viewDetailsButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.blue[100],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.blue[300],
    gap: 3,
    elevation: 1,
    shadowColor: Colors.blue[300],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  viewDetailsText: {
    ...TypographyThemes.nunito.body,
    fontSize: 11,
    color: Colors.blue[600],
    fontWeight: '600',
  },

  // Seções
  valuesSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  paymentSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },

  // Card de valores
  valueCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  
  // Linhas de valores
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  finalValueRow: {
    borderBottomWidth: 0,
    backgroundColor: Colors.blue[50],
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  changeRow: {
    borderBottomWidth: 0,
    backgroundColor: Colors.green[50],
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  valueLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  valueLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  finalValueLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.blue[700],
    fontWeight: '600',
  },
  valueAmount: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  finalAmount: {
    fontSize: 20,
    color: Colors.blue[700],
    fontWeight: '700',
  },
  positiveChange: {
    color: Colors.green[700],
    fontWeight: '700',
  },
  negativeChange: {
    color: Colors.red[700],
    fontWeight: '700',
  },

  // Inputs
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  inputLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.text.secondary,
    flex: 1,
  },
  valueInput: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
  },

  // Métodos de pagamento
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  paymentMethodCard: {
    width: '47%',
    backgroundColor: Colors.gray[50],
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentMethodCardSelected: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodCheckmark: {
    marginLeft: 8,
  },
  paymentMethodContent: {
    gap: 4,
  },
  paymentMethodLabel: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  paymentMethodDescription: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },

  // Botão
  buttonContainer: {
    paddingBottom: 10,
    alignItems: 'center',
  },
  confirmButton: {
    width: '100%',
  },

  // Modal PIX
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  closeButton: {
    backgroundColor: Colors.red[500],
    width: 32,
    height: 32,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});