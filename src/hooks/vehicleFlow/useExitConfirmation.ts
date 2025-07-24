import { useMemo } from 'react';

interface ExitData {
  id: string;
  plate: string;
  category: string;
  time: string; // Pode ser "10/07/2025 16:58:39" ou "2025-07-10T19:58:39.747Z"
  entryTime: string; // Ex: "16:58"
}

interface CalculatedExitData {
  exitDate: string;
  exitTime: string;
  stayDuration: string;
  formattedStayDuration: string;
}

const parseDateTimeFlexible = (str: string): Date | null => {
  // Detecta se é ISO
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str)) {
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  // Formato "dd/MM/yyyy HH:mm:ss"
  const [datePart, timePart] = str.split(" ");
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  // Corrige para UTC assumindo que a entrada estava em UTC-3 (Belém)
  return new Date(Date.UTC(year, month - 1, day, hour + 3, minute, second));
};

export const useExitConfirmation = (initialData: ExitData | null) => {
  return useMemo(() => {
    if (!initialData?.time) return null;

    try {
      const exitMoment = new Date();
      const entryDate = parseDateTimeFlexible(initialData.time);

      if (!entryDate || isNaN(entryDate.getTime())) {
        console.error('Invalid entry date:', initialData.time);
        return null;
      }

      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const calculateDuration = (start: Date, end: Date) => {
        const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
        const hours = Math.floor(diffInSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((diffInSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (diffInSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };

      const exitData: CalculatedExitData = {
        exitDate: formatDate(exitMoment),
        exitTime: formatTime(exitMoment),
        stayDuration: Math.floor((exitMoment.getTime() - entryDate.getTime()) / 1000).toString(),
        formattedStayDuration: calculateDuration(entryDate, exitMoment),
      };

      return {
        ...initialData,
        formattedEntryTime: initialData.entryTime,
        ...exitData,
      };
    } catch (error) {
      console.error('Error calculating exit data:', error);
      return null;
    }
  }, [initialData]);
};
