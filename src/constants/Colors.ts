export default {
  white: "#ffffff",
  black: "#000000",

  // Tons de azul (escala completa)
  blue: {
    50: "#E3F2FD",
    100: "#BBDEFB",
    200: "#90CAF9",
    300: "#64B5F6",
    400: "#42A5F5",
    500: "#2196F3", // Azul primário
    600: "#1E88E5",
    700: "#1976D2",
    800: "#1565C0",
    900: "#0D47A1",
    logo: "#003153", // Mantendo sua cor específica
    light: "#005B96",
    dark: "#002244",
    accent: "#2962FF",
    extraLight: "#E6F2FF",
  },

  // Tons de cinza (escala completa)
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    darker: "#121212",
    light: "#e1e1e1",
    medium: "#d1d5db",
    dark: "#6b7280",
    zinc: "#1C274C",
    zincDark: "#27272a",
    zincLight: "#e4e4e7",
    extraLight: "#F5F5F5",
    alpha: "rgb(209, 213, 219, 0.6)",
    lightGray: "#f0f0f0",
  },

  // Tons de vermelho (escala completa)
  red: {
    50: "#FFEBEE",
    100: "#FFCDD2",
    200: "#EF9A9A",
    300: "#E57373",
    400: "#EF5350",
    500: "#F44336", // Vermelho primário
    600: "#E53935",
    700: "#D32F2F",
    800: "#C62828",
    900: "#B71C1C",
    accent: "#FF1744",
    error: "#F44336", // Alias para 500
  },

  // Tons de verde (escala completa)
  green: {
    50: "#E8F5E9",
    100: "#C8E6C9",
    200: "#A5D6A7",
    300: "#81C784",
    400: "#66BB6A",
    500: "#4CAF50", // Verde primário
    600: "#43A047",
    700: "#388E3C",
    800: "#2E7D32",
    900: "#1B5E20",
    light: "#3AEE26",
    dark: "#1e7e34",
    success: "#4CAF50", // Alias para 500
    accent: "#00E676",
    successLight: "#E8F5E9",
    successDark: "#1B5E20",
  },

  // Tons de amarelo/laranja (escala completa)
  yellow: {
    50: "#FFFDE7",
    100: "#FFF9C4",
    200: "#FFF59D",
    300: "#FFF176",
    400: "#FFEE58",
    500: "#FFEB3B", // Amarelo primário
    600: "#FDD835",
    700: "#FBC02D",
    800: "#F9A825",
    900: "#F57F17",
    accent: "#FFD600",
  },

  orange: {
    50: "#FFF3E0",
    100: "#FFE0B2",
    200: "#FFCC80",
    300: "#FFB74D",
    400: "#FFA726",
    500: "#FF9800", // Laranja primário
    600: "#FB8C00",
    700: "#F57C00",
    800: "#EF6C00",
    900: "#E65100",
    accent: "#FF6D00",
    alert: "#FF3A20",
    button: "#FFA500", // Mantendo botão específico
  },

  // Tons de roxo
  purple: {
    50: "#F3E5F5",
    100: "#E1BEE7",
    200: "#CE93D8",
    300: "#BA68C8",
    400: "#AB47BC",
    500: "#9C27B0", // Roxo primário
    600: "#8E24AA",
    700: "#7B1FA2",
    800: "#6A1B9A",
    900: "#4A148C",
    accent: "#E040FB",
  },

  // Cores funcionais
  primary: "#2196F3", // = blue[500]
  secondary: "#FF9800", // = orange[500]
  error: "#F44336", // = red[500]
  warning: "#FFC107", // = yellow[500]
  success: "#4CAF50", // = green[500]
  info: "#00ACC1",

  button: {
    green: "#66BB6A",
    red: "#F44336",
    blue: "#42A5F5",
    purple: "#9C27B0", // Adicionando roxo aos botões
  },

  // Cores de texto
  text: {
    primary: "#1C274C", // Cor escura para texto principal
    secondary: "#6b7280", // Cor média para texto secundário
    disabled: "#9E9E9E", // = gray[500]
    inverted: "#FFFFFF",
    // Adicionando aliases diretos para facilitar o acesso
    textPrimary: "#1C274C", // Mesmo que text.primary
    textSecondary: "#6b7280", // Mesmo que text.secondary
  },

  // Cores de fundo
  background: "#ffffff",
  surface: "#FFFFFF",
  elevation: "#FAFAFA",

  // Sombras (adicionando uma paleta de sombras consistentes)
  // Sombras como objetos
  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    button: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    floating: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
  },

  lightGray: "#f0f0f0",
};