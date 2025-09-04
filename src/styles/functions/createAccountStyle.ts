// src/styles/functions/createAccountStyle.ts
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
  // Seção informativa
  infoContainer: {
    marginTop: 5,
    padding: 20,
    backgroundColor: Colors.blue.primary,
    marginBottom: 8,
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
  // Card de boas-vindas
  welcomeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
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
    backgroundColor: Colors.green[500],
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
  passwordHint: {
    ...TypographyThemes.nunito.bodySmall,
    fontSize: 13,
    color: Colors.gray[500],
    marginLeft: 4,
    fontStyle: "italic",
  },
  roleOptionsContainer: {
    gap: 12,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
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
  roleOptionSelected: {
    backgroundColor: Colors.gray[50],
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roleOptionText: {
    ...TypographyThemes.inter.subtitle,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text.primary,
    flex: 1,
  },
  roleOptionTextSelected: {
    fontWeight: "600",
    color: Colors.text.primary,
  },
  roleCheckmark: {
    marginLeft: "auto",
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 25,
  },
  cancelButton: {
    flex: 1,
    marginTop: 0,
  },
  createButton: {
    flex: 1,
    marginTop: 0,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
});
