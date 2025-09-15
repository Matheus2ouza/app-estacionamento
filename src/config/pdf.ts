export const MAX_PDF_RENDER_MB: number = Number(
  // Variáveis EXPO_PUBLIC_* ficam disponíveis no runtime do app Expo
  (process.env.EXPO_PUBLIC_MAX_PDF_RENDER_MB as string) || 10
);

export const getMaxPdfBytesToRender = (): number => Math.max(1, MAX_PDF_RENDER_MB) * 1024 * 1024;


