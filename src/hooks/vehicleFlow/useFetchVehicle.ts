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

  // Função para parsear a string "dd/MM/yyyy HH:mm:ss" em Date corrigido para UTC
  const parseDateTime = (str: string): Date | null => {
    const [datePart, timePart] = str.split(" ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Como a string vem no fuso de Belém (UTC-3), adicionamos 3 horas para armazenar em UTC
    return new Date(Date.UTC(year, month - 1, day, hours + 3, minutes, seconds));
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

        if (car.entryTime) {
          const entry = parseDateTime(car.entryTime);
          if (entry) {
            setEntryTime(entry);

            // Calcula tempo no pátio em HH:mm:ss
            const now = new Date();
            const diffMs = now.getTime() - entry.getTime();
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
            const pad = (n: number) => n.toString().padStart(2, "0");
            timeInPatio = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

            // Formata hora de entrada em UTC (HH:mm)
            formattedEntryTime = formatTimeUTC(entry);
          } else {
            console.warn("Data de entrada inválida:", car.entryTime);
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
