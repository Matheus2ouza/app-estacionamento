import { VehicleApi } from "@/src/api/vehicleFlowService";
import { useState } from "react";

export const useFetchVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vehicle, setVehicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [entryTime, setEntryTime] = useState<Date | null>(null);

  // Função para formatar horas e minutos em UTC (HH:mm)
  const formatTimeUTC = (date: Date): string => {
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const parseDateTime = (str: string): Date | null => {
    try {
      const parsed = new Date(str);
      if (isNaN(parsed.getTime())) return null;

      // Subtrai 3 horas para ajustar do UTC para Belém (UTC-3)
      parsed.setHours(parsed.getHours() - 3);
      return parsed;
    } catch {
      return null;
    }
  };

  const fetchVehicle = async (id: string, plate: string) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    setVehicle(null);
    setEntryTime(null);

    try {
      const response = await VehicleApi.getUniquevehicle(id, plate);
      console.log(response);

      if (response.success) {
        const car = response.car;

        let timeInPatio = "";
        let formattedEntryTime = "";

        if (car.entry_time) {
          console.log(car.entry_time);
          const entry = parseDateTime(car.entry_time);
          if (entry) {
            setEntryTime(entry);

            // Calcula tempo no pátio em HH:mm:ss
            const now = new Date();
            const diffMs = now.getTime() - entry.getTime();
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor(
              (diffMs % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
            const pad = (n: number) => n.toString().padStart(2, "0");
            timeInPatio = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

            // Formata hora de entrada em UTC (HH:mm)
            formattedEntryTime = formatTimeUTC(entry);
          } else {
            console.warn("Data de entrada inválida:", car.entry_time);
          }
        }

        const fullVehicle = {
          ...car,
          timeInPatio,
          formattedEntryTime,
        };

        setVehicle(fullVehicle);
        setSuccess(true);
        return fullVehicle;
      } else {
        setError(response.message || "Erro ao buscar veículo.");
        return null;
      }
    } catch (err: any) {
      console.error("Erro na requisição:", err);
      setError(err?.response?.data?.message || "Erro inesperado.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchVehicle,
    loading,
    success,
    vehicle,
    error,
    entryTime,
  };
};
