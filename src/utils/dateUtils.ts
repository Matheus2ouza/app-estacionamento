
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
