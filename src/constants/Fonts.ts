import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from "@expo-google-fonts/inter";
import {
  Montserrat_400Regular,
  Montserrat_700Bold
} from "@expo-google-fonts/montserrat";
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold
} from "@expo-google-fonts/nunito";
import {
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold
} from "@expo-google-fonts/open-sans";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from "@expo-google-fonts/poppins";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold
} from "@expo-google-fonts/roboto";

const FontsToLoad = {
  // Roboto (atual)
  Montserrat_400Regular,
  Montserrat_700Bold,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
  
  // Inter (moderna e legível)
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  
  // Poppins (elegante e moderna)
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  
  // Nunito (amigável e arredondada)
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  
  // Open Sans (clássica e legível)
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold
};

export const Fonts = {
  // Roboto (atual)
  MontserratRegular: "Montserrat_400Regular",
  MontserratBold: "Montserrat_700Bold",
  RobotoRegular: "Roboto_400Regular",
  RobotoMedium: "Roboto_500Medium",
  Roboto_600SemiBold: "Roboto_600SemiBold",
  Roboto_700Bold: "Roboto_700Bold",
  
  // Inter (moderna e legível)
  InterLight: "Inter_300Light",
  InterRegular: "Inter_400Regular",
  InterMedium: "Inter_500Medium",
  InterSemiBold: "Inter_600SemiBold",
  InterBold: "Inter_700Bold",
  
  // Poppins (elegante e moderna)
  PoppinsLight: "Poppins_300Light",
  PoppinsRegular: "Poppins_400Regular",
  PoppinsMedium: "Poppins_500Medium",
  PoppinsSemiBold: "Poppins_600SemiBold",
  PoppinsBold: "Poppins_700Bold",
  
  // Nunito (amigável e arredondada)
  NunitoLight: "Nunito_300Light",
  NunitoRegular: "Nunito_400Regular",
  NunitoMedium: "Nunito_500Medium",
  NunitoSemiBold: "Nunito_600SemiBold",
  NunitoBold: "Nunito_700Bold",
  
  // Open Sans (clássica e legível)
  OpenSansLight: "OpenSans_300Light",
  OpenSansRegular: "OpenSans_400Regular",
  OpenSansMedium: "OpenSans_500Medium",
  OpenSansSemiBold: "OpenSans_600SemiBold",
  OpenSansBold: "OpenSans_700Bold"
};

// Sistema de tipografia centralizado
export const Typography = {
  // Headers
  header: {
    fontFamily: Fonts.Roboto_700Bold,
    fontSize: 28,
    lineHeight: 36
  },
  title: {
    fontFamily: Fonts.Roboto_700Bold,
    fontSize: 20,
    lineHeight: 28
  },
  subtitle: {
    fontFamily: Fonts.Roboto_600SemiBold,
    fontSize: 16,
    lineHeight: 24
  },
  
  // Body text
  body: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 16,
    lineHeight: 24
  },
  bodySmall: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 14,
    lineHeight: 20
  },
  caption: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 12,
    lineHeight: 16
  },
  
  // Inputs
  input: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 16,
    lineHeight: 24
  },
  inputSmall: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 13,
    lineHeight: 20
  },
  inputLarge: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 18,
    lineHeight: 26
  },
  
  // Buttons
  button: {
    fontFamily: Fonts.Roboto_600SemiBold,
    fontSize: 16,
    lineHeight: 24
  },
  buttonSmall: {
    fontFamily: Fonts.Roboto_600SemiBold,
    fontSize: 14,
    lineHeight: 20
  },
  
  // Labels
  label: {
    fontFamily: Fonts.Roboto_600SemiBold,
    fontSize: 15,
    lineHeight: 22
  },
  
  // Dropdown
  dropdown: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 16,
    lineHeight: 24
  },
  dropdownSelected: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 16,
    lineHeight: 24
  }
};

// Temas de tipografia alternativos
export const TypographyThemes = {
  // Tema Inter (moderno e legível)
  inter: {
    header: { fontFamily: Fonts.InterBold, fontSize: 28, lineHeight: 36 },
    title: { fontFamily: Fonts.InterBold, fontSize: 20, lineHeight: 28 },
    subtitle: { fontFamily: Fonts.InterSemiBold, fontSize: 16, lineHeight: 24 },
    body: { fontFamily: Fonts.InterRegular, fontSize: 16, lineHeight: 24 },
    bodySmall: { fontFamily: Fonts.InterRegular, fontSize: 14, lineHeight: 20 },
    caption: { fontFamily: Fonts.InterRegular, fontSize: 12, lineHeight: 16 },
    input: { fontFamily: Fonts.InterRegular, fontSize: 16, lineHeight: 24 },
    button: { fontFamily: Fonts.InterSemiBold, fontSize: 16, lineHeight: 24 },
    label: { fontFamily: Fonts.InterSemiBold, fontSize: 15, lineHeight: 22 }
  },
  
  // Tema Poppins (elegante e moderna)
  poppins: {
    header: { fontFamily: Fonts.PoppinsBold, fontSize: 28, lineHeight: 36 },
    title: { fontFamily: Fonts.PoppinsBold, fontSize: 20, lineHeight: 28 },
    subtitle: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 16, lineHeight: 24 },
    body: { fontFamily: Fonts.PoppinsRegular, fontSize: 16, lineHeight: 24 },
    bodySmall: { fontFamily: Fonts.PoppinsRegular, fontSize: 14, lineHeight: 20 },
    caption: { fontFamily: Fonts.PoppinsRegular, fontSize: 12, lineHeight: 16 },
    input: { fontFamily: Fonts.PoppinsRegular, fontSize: 16, lineHeight: 24 },
    button: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 16, lineHeight: 24 },
    label: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 15, lineHeight: 22 }
  },
  
  // Tema Nunito (amigável e arredondada)
  nunito: {
    header: { fontFamily: Fonts.NunitoBold, fontSize: 28, lineHeight: 36 },
    title: { fontFamily: Fonts.NunitoBold, fontSize: 20, lineHeight: 28 },
    subtitle: { fontFamily: Fonts.NunitoSemiBold, fontSize: 16, lineHeight: 24 },
    body: { fontFamily: Fonts.NunitoRegular, fontSize: 16, lineHeight: 24 },
    bodySmall: { fontFamily: Fonts.NunitoRegular, fontSize: 14, lineHeight: 20 },
    caption: { fontFamily: Fonts.NunitoRegular, fontSize: 12, lineHeight: 16 },
    input: { fontFamily: Fonts.NunitoRegular, fontSize: 16, lineHeight: 24 },
    button: { fontFamily: Fonts.NunitoSemiBold, fontSize: 16, lineHeight: 24 },
    label: { fontFamily: Fonts.NunitoSemiBold, fontSize: 15, lineHeight: 22 }
  },
  
  // Tema Open Sans (clássica e legível)
  openSans: {
    header: { fontFamily: Fonts.OpenSansBold, fontSize: 28, lineHeight: 36 },
    title: { fontFamily: Fonts.OpenSansBold, fontSize: 20, lineHeight: 28 },
    subtitle: { fontFamily: Fonts.OpenSansSemiBold, fontSize: 16, lineHeight: 24 },
    body: { fontFamily: Fonts.OpenSansRegular, fontSize: 16, lineHeight: 24 },
    bodySmall: { fontFamily: Fonts.OpenSansRegular, fontSize: 14, lineHeight: 20 },
    caption: { fontFamily: Fonts.OpenSansRegular, fontSize: 12, lineHeight: 16 },
    input: { fontFamily: Fonts.OpenSansRegular, fontSize: 16, lineHeight: 24 },
    button: { fontFamily: Fonts.OpenSansSemiBold, fontSize: 16, lineHeight: 24 },
    label: { fontFamily: Fonts.OpenSansSemiBold, fontSize: 15, lineHeight: 22 }
  }
};

// Função helper para modificar fontSize
export const createTypography = (base: any, fontSize?: number) => {
  if (!fontSize) return base;
  
  return {
    ...base,
    fontSize,
    lineHeight: fontSize * 1.5, // Mantém proporção do lineHeight
  };
};

export default FontsToLoad;
