const Colors = {
  // ===== CORES BASE =====
  white: "#ffffff",
  black: "#000000",
  backgroundQrCode: "#f1f4f5",
  transparent: "transparent",
  whiteSemiTransparent: "rgba(255, 255, 255, 0.9)",
  whiteSemiTransparent2: "rgba(255, 255, 255, 0.8)",
  // ===== PALETA PRINCIPAL - AZUL =====
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
    // Cores específicas do app
    logo: "#003153",
    light: "#005B96",
    dark: "#002244",
    primary: "#1C274C",
    secondary: "#005B96",
  },

  // ===== PALETA CINZA =====
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
    // Cores específicas do app
    light: "#e1e1e1",
    medium: "#d1d5db",
    dark: "#616161",
    zinc: "#1C274C",
    zincDark: "#27272a",
    zincLight: "#e4e4e7",
  },

  // ===== PALETA VERMELHO =====
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
    // Cores específicas do app
    error: "#F44336",
    dark: "#b71c1c",
  },

  // ===== PALETA VERDE =====
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
    // Cores específicas do app
    success: "#4CAF50",
    dark: "#1e7e34",
    button: "#3AEE26",
  },

  // ===== PALETA AMARELO =====
  yellow: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
    // Cor específica do app
    warning: "#ffc107",
  },

  // ===== PALETA LARANJA =====
  orange: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407",
    // Cor específica do app
    button: "#FFA500",
  },

  // ===== PALETA ROXO =====
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },

  // ===== PALETA ROSA =====
  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724",
  },

  // ===== PALETA TEAL =====
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
    950: "#042f2e",
  },

  // ===== CORES DE BOTÕES =====
  button: {
    primary: "#0080D9",
    secondary: "#6b7280",
    success: "#3AEE26",
    danger: "#FF2727",
    warning: "#FFA500",
    info: "#005B96",
    light: "#f3f4f6",
    dark: "#1f2937",
  },

  // ===== CORES DE ESTADO =====
  status: {
    success: "#4CAF50",
    error: "#F44336",
    warning: "#ffc107",
    info: "#005B96",
    loading: "#6b7280",
  },

  // ===== CORES DE TEXTO =====
  text: {
    primary: "#1C274C",
    secondary: "#6b7280",
    tertiary: "#9ca3af",
    inverse: "#ffffff",
    disabled: "#d1d5db",
    link: "#005B96",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#ffc107",
  },

  // ===== CORES DE FUNDO =====
  background: {
    primary: "#ffffff",
    secondary: "#f9fafb",
    tertiary: "#f3f4f6",
    quaternary: "#f2f2f2",
    dark: "#1f2937",
    overlay: "rgba(0, 0, 0, 0.5)",
    modal: "rgba(0, 0, 0, 0.3)",
  },

  // ===== CORES DE BORDA =====
  border: {
    light: "#e5e7eb",
    medium: "#d1d5db",
    dark: "#9ca3af",
    focus: "#005B96",
    error: "#F44336",
    success: "#4CAF50",
    alpha: "rgb(209, 213, 219, 0.1)",
  },

  // ===== CORES DE SOMBRA =====
  shadow: {
    light: "rgba(0, 0, 0, 0.1)",
    medium: "rgba(0, 0, 0, 0.2)",
    dark: "rgba(0, 0, 0, 0.3)",
    colored: "rgba(0, 91, 150, 0.2)",
  },

  // ===== CORES DE GRADIENTE =====
  gradient: {
    primary: ["#1C274C", "#005B96"],
    secondary: ["#6b7280", "#9ca3af"],
    success: ["#4CAF50", "#22c55e"],
    error: ["#F44336", "#dc2626"],
    warning: ["#ffc107", "#f59e0b"],
  },

  // ===== CORES DE ÍCONES =====
  icon: {
    primary: "#1C274C",
    secondary: "#6b7280",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#ffc107",
    info: "#005B96",
    light: "#ffffff",
    dark: "#1f2937",
  },

  // ===== CORES DE CARD =====
  card: {
    background: "#ffffff",
    border: "#e5e7eb",
    shadow: "rgba(0, 0, 0, 0.1)",
    header: "#f9fafb",
  },

  // ===== CORES DE INPUT =====
  input: {
    background: "#ffffff",
    border: "#d1d5db",
    borderFocus: "#005B96",
    borderError: "#F44336",
    placeholder: "#9ca3af",
    text: "#1f2937",
  },

  // ===== CORES DE TABELA =====
  table: {
    header: "#f9fafb",
    row: "#ffffff",
    rowAlternate: "#f9fafb",
    border: "#e5e7eb",
    text: "#1f2937",
  },

  // ===== CORES DE NAVEGAÇÃO =====
  navigation: {
    background: "#ffffff",
    border: "#e5e7eb",
    active: "#005B96",
    inactive: "#6b7280",
    badge: "#F44336",
  },

  // ===== CORES DE TOAST =====
  toast: {
    success: {
      background: "#f0fdf4",
      border: "#bbf7d0",
      text: "#166534",
      icon: "#22c55e",
    },
    error: {
      background: "#fef2f2",
      border: "#fecaca",
      text: "#991b1b",
      icon: "#ef4444",
    },
    warning: {
      background: "#fffbeb",
      border: "#fde68a",
      text: "#92400e",
      icon: "#f59e0b",
    },
    info: {
      background: "#eff6ff",
      border: "#bfdbfe",
      text: "#1e40af",
      icon: "#3b82f6",
    },
  },

  // ===== CORES DE PROGRESS =====
  progress: {
    background: "#e5e7eb",
    fill: "#005B96",
    success: "#4CAF50",
    warning: "#ffc107",
    error: "#F44336",
  },

  // ===== CORES DE RATING =====
  rating: {
    filled: "#ffc107",
    empty: "#e5e7eb",
    hover: "#f59e0b",
  },

  // ===== CORES DE SWITCH =====
  switch: {
    on: "#005B96",
    off: "#d1d5db",
    thumb: "#ffffff",
  },

  // ===== CORES DE CHECKBOX/RADIO =====
  checkbox: {
    checked: "#005B96",
    unchecked: "#d1d5db",
    disabled: "#e5e7eb",
  },

  // ===== CORES DE SLIDER =====
  slider: {
    track: "#e5e7eb",
    thumb: "#005B96",
    active: "#005B96",
    inactive: "#d1d5db",
  },

  // ===== CORES DE PAGINAÇÃO =====
  pagination: {
    active: "#005B96",
    inactive: "#d1d5db",
    text: "#1f2937",
    border: "#e5e7eb",
  },

  // ===== CORES DE MENU =====
  menu: {
    background: "#ffffff",
    item: "#ffffff",
    itemHover: "#f9fafb",
    itemActive: "#eff6ff",
    border: "#e5e7eb",
    text: "#1f2937",
    textActive: "#005B96",
  },

  // ===== CORES DE DROPDOWN =====
  dropdown: {
    background: "#ffffff",
    border: "#d1d5db",
    item: "#ffffff",
    itemHover: "#f9fafb",
    itemSelected: "#eff6ff",
    text: "#1f2937",
    textSelected: "#005B96",
  },

  // ===== CORES DE TOOLTIP =====
  tooltip: {
    background: "#1f2937",
    text: "#ffffff",
    border: "#374151",
  },

  // ===== CORES DE BADGE =====
  badge: {
    primary: "#eff6ff",
    secondary: "#f3f4f6",
    success: "#f0fdf4",
    error: "#fef2f2",
    warning: "#fffbeb",
    text: {
      primary: "#1e40af",
      secondary: "#374151",
      success: "#166534",
      error: "#991b1b",
      warning: "#92400e",
    },
  },

  // ===== CORES DE AVATAR =====
  avatar: {
    background: "#f3f4f6",
    border: "#e5e7eb",
    text: "#6b7280",
  },

  // ===== CORES DE DIVIDER =====
  divider: {
    light: "#f3f4f6",
    medium: "#e5e7eb",
    dark: "#d1d5db",
  },

  // ===== CORES DE OVERLAY =====
  overlay: {
    light: "rgba(0, 0, 0, 0.1)",
    medium: "rgba(0, 0, 0, 0.3)",
    dark: "rgba(0, 0, 0, 0.5)",
    colored: "rgba(0, 91, 150, 0.2)",
  },

  // ===== CORES DE ANIMAÇÃO =====
  animation: {
    shimmer: {
      start: "#f6f7f8",
      end: "#edeef1",
    },
    pulse: {
      start: "rgba(0, 91, 150, 0.1)",
      end: "rgba(0, 91, 150, 0.3)",
    },
  },

  // ===== CORES DE TEMA ESCURO =====
  dark: {
    background: {
      primary: "#111827",
      secondary: "#1f2937",
      tertiary: "#374151",
    },
    text: {
      primary: "#f9fafb",
      secondary: "#d1d5db",
      tertiary: "#9ca3af",
    },
    border: {
      light: "#374151",
      medium: "#4b5563",
      dark: "#6b7280",
    },
    card: {
      background: "#1f2937",
      border: "#374151",
    },
    input: {
      background: "#374151",
      border: "#4b5563",
      text: "#f9fafb",
    },
  },
};

// Função para gerar cores hexadecimais aleatórias (excluindo preto e branco)
export const generateRandomColor = (): string => {
  // Gerar valores RGB aleatórios
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  // Verificar se a cor é muito escura (próxima do preto) ou muito clara (próxima do branco)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Se for muito escura (brightness < 50) ou muito clara (brightness > 200), gerar novamente
  if (brightness < 50 || brightness > 200) {
    return generateRandomColor(); // Recursão para gerar uma nova cor
  }
  
  // Converter para hexadecimal
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export default Colors;
