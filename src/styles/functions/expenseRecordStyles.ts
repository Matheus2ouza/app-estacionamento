import Colors from "@/src/constants/Colors";
import { TypographyThemes } from "@/src/constants/Fonts";
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
    paddingBottom: 20,
  },
  
  // Card de informações da despesa
  expenseInfoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  expenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  expenseIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.red[500],
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: Colors.red[500],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    ...TypographyThemes.poppins.title,
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 8,
    fontWeight: '700',
  },
  expenseSubtitle: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
  },

  // Seções
  dataSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  paymentSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
  },

  // Card de dados
  dataCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    gap: 20,
  },
  
  // Containers de input
  inputContainer: {
    gap: 12,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '600',
  },

  // Inputs
  textInput: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  valueInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  currencySymbol: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.primary,
    fontWeight: '600',
    marginRight: 8,
    fontSize: 18,
  },
  valueInput: {
    ...TypographyThemes.nunito.body,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  valuePreview: {
    ...TypographyThemes.nunito.body,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.green[600],
    textAlign: 'center',
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: Colors.green[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.green[200],
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
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  paymentMethodCardSelected: {
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    transform: [{ scale: 1.02 }],
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentMethodCheckmark: {
    marginLeft: 8,
  },
  paymentMethodContent: {
    gap: 6,
  },
  paymentMethodLabel: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  paymentMethodDescription: {
    ...TypographyThemes.nunito.body,
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
  },


  // Botão
  buttonContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  confirmButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    elevation: 4,
    shadowColor: Colors.blue[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

});