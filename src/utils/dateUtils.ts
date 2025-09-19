
export const adjustEntryTime = (entryTime: string | Date): Date => {
  return new Date(entryTime);
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
};

export const formatDateToMMYYYY = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "";
  
  try {
    const date = new Date(isoDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
};

export const parseMMYYYYToDate = (mmYYYY: string): Date => {
  if (!mmYYYY) return new Date();
  
  try {
    const [month, year] = mmYYYY.split('/');
    if (month && year) {
      // Criar data no primeiro dia do mês
      return new Date(parseInt(year), parseInt(month) - 1, 1);
    }
    return new Date();
  } catch (error) {
    console.error("Erro ao converter data MM/AAAA:", error);
    return new Date();
  }
};

// Funções para conversão de valores monetários
export const formatToBrazilianCurrency = (value: number): string => {
  return value.toFixed(2).replace('.', ',');
};

export const parseBrazilianCurrency = (value: string): number => {
  // Remove tudo exceto números, vírgula e ponto
  const cleanValue = value.replace(/[^\d,]/g, '');
  // Substitui vírgula por ponto para conversão
  const numericValue = cleanValue.replace(',', '.');
  return parseFloat(numericValue) || 0;
};
