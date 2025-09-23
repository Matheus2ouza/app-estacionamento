import Colors from "@/constants/Colors";
import { TypographyThemes } from "@/constants/Fonts";
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
  // Seção informativa
  infoContainer: {
    marginTop: 5,
    padding: 20,
    backgroundColor: Colors.green[500],
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.green[400],
    shadowColor: Colors.green[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  infoTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontWeight: '700',
    color: Colors.white,
  },
  infoDescription: {
    ...TypographyThemes.nunito.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
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
  categoryDescription: {
    ...TypographyThemes.nunito.caption,
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
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
  textInputError: {
    borderColor: Colors.red[500],
    backgroundColor: Colors.red[50],
  },
  // Botões de ação
  buttonContainer: {
    marginBottom: 25,
    alignItems: "center",
    width: "100%",
  },
  buttonConfirm: {
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
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
  dropdownRequired: {
    borderColor: Colors.red[300],
    backgroundColor: Colors.red[50],
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
  cameraButtonContainer: {
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.gray[200],
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cameraButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.blue[500],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cameraButtonIconSuccess: {
    backgroundColor: Colors.green[500],
  },
  cameraButtonSuccess: {
    borderColor: Colors.green[300],
    backgroundColor: Colors.green[50],
  },
  cameraButtonText: {
    flex: 1,
  },
  cameraButtonTitle: {
    ...TypographyThemes.inter.subtitle,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  cameraButtonSubtitle: {
    ...TypographyThemes.nunito.bodySmall,
    fontSize: 13,
    color: Colors.text.secondary,
  },
  // Estilo para câmera em tela cheia
  cameraFullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: '#000',
  },
  // Estilos para tela bloqueada
  blockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  blockedAlert: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
});