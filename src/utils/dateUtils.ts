
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
