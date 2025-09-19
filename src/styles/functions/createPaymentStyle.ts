import Colors from "@/constants/Colors";
import { Fonts, TypographyThemes } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    ...TypographyThemes.inter.title,
    fontSize: 25,
  },
  container: {
    flexGrow: 1,
  },
  dropdown: {
    width: "100%",
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.gray.light,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    marginTop: -1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItemText: {
    ...TypographyThemes.openSans.body,
    color: Colors.text.primary,
  },
  dropdownSelectedText: {
    ...TypographyThemes.openSans.body,
    fontFamily: Fonts.OpenSansSemiBold, 
    color: Colors.text.primary,
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.blue.light,
    shadowColor: Colors.blue.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionText: {
    ...TypographyThemes.nunito.bodySmall, // Nunito para descrições - amigável e legível
    lineHeight: 22,
    color: Colors.text.primary,
    textAlign: "left",
  },
  sectionContainer: {
    marginTop: 28,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    ...TypographyThemes.poppins.title, // Poppins para títulos de seção - elegante
    color: Colors.text.primary,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    ...TypographyThemes.inter.subtitle, // Inter para labels - moderna e clara
    color: Colors.text.primary,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.gray.light,
    ...TypographyThemes.openSans.input, // Open Sans para inputs - clássica e legível
    color: Colors.text.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFocused: {
    borderColor: Colors.blue.primary,
    shadowColor: Colors.blue.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputDisabled: {
    backgroundColor: Colors.gray.light,
    borderColor: Colors.gray.medium,
    opacity: 0.6,
  },
  disabledText: {
    color: Colors.text.secondary,
    ...TypographyThemes.nunito.bodySmall, // Nunito para texto desabilitado - amigável
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentWrapper: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  optionalText: {
    ...TypographyThemes.nunito.caption, // Nunito para texto opcional - amigável
    color: Colors.text.secondary,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    shadowColor: Colors.blue.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: Colors.white,
    ...TypographyThemes.poppins.button, // Poppins para botões - elegante
  },
  button: {
    alignSelf: "center",
    marginTop: 24,
    width: "100%",
    alignItems: "center",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.gray.light,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  timeInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    ...TypographyThemes.openSans.input, // Open Sans para input de tempo - legível
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
    ...TypographyThemes.nunito.caption, // Nunito para texto de unidade - amigável
    color: Colors.text.secondary,
  },
  placeholderText: {
    ...TypographyThemes.nunito.caption, // Nunito para placeholder - amigável
    fontSize: 10,
  },
  inputWithText: {
    ...TypographyThemes.openSans.body, // Open Sans para texto com input - legível
    fontSize: 15,
  },
  inputWithPlaceholder: {
    ...TypographyThemes.openSans.body, // Open Sans para placeholder - legível
    fontSize: 13,
  }
});