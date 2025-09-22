import Colors from "@/constants/Colors";
import { TypographyThemes } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  // Seção informativa
  infoContainer: {
    marginTop: 25,
    padding: 20,
    backgroundColor: Colors.blue.primary,
    marginBottom: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.blue.light,
    shadowColor: Colors.blue.primary,
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
  
  // Método de cobrança (somente leitura)
  methodContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.blue.light,
    shadowColor: Colors.blue.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  methodLabel: {
    ...TypographyThemes.inter.subtitle,
    marginBottom: 12,
    color: Colors.text.primary,
  },
  methodField: {
    backgroundColor: Colors.gray.light,
    borderWidth: 1.5,
    borderColor: Colors.gray.medium,
    borderRadius: 12,
    padding: 16,
    minHeight: 70,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIconContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  methodText: {
    ...TypographyThemes.openSans.body,
    color: Colors.text.primary,
    flex: 1,
    fontWeight: '600',
  },
  methodBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  methodBadgeText: {
    color: '#dc2626',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  methodDescription: {
    ...TypographyThemes.nunito.caption,
    color: Colors.text.secondary,
    marginTop: 12,
    backgroundColor: Colors.gray.light,
    padding: 8,
    borderRadius: 8,
  },
  
  // Campos de input
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    ...TypographyThemes.inter.subtitle,
    marginBottom: 10,
    color: Colors.text.primary,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.gray.light,
    ...TypographyThemes.openSans.input,
    color: Colors.text.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  inputDisabled: {
    backgroundColor: Colors.gray.light,
    borderColor: Colors.gray.medium,
    opacity: 0.6,
  },
  
  // Campo de tolerância desabilitado
  toleranceWarning: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  toleranceWarningText: {
    ...TypographyThemes.nunito.bodySmall,
    color: '#92400e',
    lineHeight: 18,
  },
  
  // Campo de tempo
  timeField: {
    width: "100%",
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.gray.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  timeFieldDisabled: {
    backgroundColor: Colors.gray.light,
    borderColor: Colors.gray.medium,
    opacity: 0.6,
  },
  timeText: {
    ...TypographyThemes.openSans.input,
    color: Colors.text.primary,
    flex: 1,
  },
  timeTextDisabled: {
    color: Colors.text.secondary,
  },
  timeIconContainer: {
    backgroundColor: Colors.blue.light,
    borderRadius: 10,
    padding: 8,
  },
  timeIconContainerDisabled: {
    backgroundColor: Colors.gray.medium,
  },
  timePlaceholder: {
    ...TypographyThemes.nunito.caption,
    color: Colors.text.secondary,
    marginTop: 8,
    backgroundColor: Colors.gray.light,
    padding: 10,
    borderRadius: 8,
  },
  
  // Botões
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 25,
  },
  cancelButton: {
    flex: 1,
    marginTop: 0,
  },
  saveButton: {
    flex: 1,
    marginTop: 0,
  },
  // Estilos adicionais para ficar igual ao createPayment
  sectionContainer: {
    marginTop: 28,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    ...TypographyThemes.poppins.title,
    color: Colors.text.primary,
    marginBottom: 20,
  },
  inputWithText: {
    ...TypographyThemes.openSans.body,
    fontSize: 15,
  },
  inputWithPlaceholder: {
    ...TypographyThemes.openSans.body,
    fontSize: 13,
  },
  disabledText: {
    color: Colors.text.secondary,
    ...TypographyThemes.nunito.bodySmall,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.gray.light,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  timeInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    ...TypographyThemes.openSans.input,
    color: Colors.text.primary,
  },
  timeUnitContainer: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: Colors.gray.light,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    minWidth: 80,
    marginRight: 2,
    alignItems: "center",
  },
  timeUnitText: {
    ...TypographyThemes.nunito.caption,
    color: Colors.text.secondary,
  },
  optionalText: {
    ...TypographyThemes.nunito.caption,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  inputDescriptoon: {
    marginBottom: 5
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
    minHeight: 140,
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
});
