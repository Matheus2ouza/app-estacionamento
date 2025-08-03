import { ParkingApi } from "@/src/api/parkingService";
import { VehicleApi } from "@/src/api/vehicleFlowService";
import { formatTime } from "@/src/utils/dateUtils";
import { useEffect, useState } from "react";
import {
  Car,
  CarWithElapsedTime,
  ParkingConfig,
} from "@/src/types/vehicleFlow";

const useParking = () => {
  const [cars, setCars] = useState<CarWithElapsedTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [parkingCapacity, setParkingCapacity] = useState<number | null>(null);

  // Função para calcular tempo decorrido
  const calculateElapsedTime = (entryTime: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - entryTime.getTime()) / 1000
    );

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Buscar configuração do pátio
  const fetchParkingConfig = async () => {
    try {
      const configData = await ParkingApi.getConfigParking();
      console.log(configData)
      if (configData.success) {
        const config: ParkingConfig = configData.config;
        const totalCapacity =
          config.maxCars + config.maxMotorcycles;
        setParkingCapacity(totalCapacity);
      }
    } catch (error) {
      console.error("Erro ao buscar configuração do pátio:", error);
    }
  };

  // Buscar veículos do pátio
  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await VehicleApi.getParked();
      console.log(data)
      if (data.success) {
        const carsWithElapsedTime = data.data.map((car: Car) => {
          const parsedEntryTime = new Date(car.entryTime);

          return {
            ...car,
            description: car.description || "",
            elapsedTime: calculateElapsedTime(parsedEntryTime),
            formattedEntryTime: formatTime(parsedEntryTime),
          };
        });

        const sortedCars = carsWithElapsedTime.sort((a, b) => {
          // Definir a prioridade de ordenação
          const priority: Record<string, number> = {
            INSIDE: 1, // Prioridade mais alta (vem primeiro)
            EXITED: 2, // Prioridade média
            DELETED: 3, // Prioridade mais baixa (vem por último)
          };

          // Comparar pelo status primeiro
          const statusA = priority[a.status] || 99;
          const statusB = priority[b.status] || 99;

          if (statusA !== statusB) {
            return statusA - statusB;
          }

          // Se o status for igual, ordenar por horário de entrada (mais antigo primeiro)
          return (
            new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
          );
        });

        setCars(sortedCars);
      }
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza contadores a cada segundo
  useEffect(() => {
    if (cars.length === 0) return;

    const interval = setInterval(() => {
      setCars((prevCars) =>
        prevCars.map((car) => {
          const parsedEntryTime = new Date(car.entryTime);
          return {
            ...car,
            elapsedTime: calculateElapsedTime(parsedEntryTime),
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [cars]);

  // Busca inicial
  useEffect(() => {
    fetchParkingConfig();
    fetchCars();
  }, []);

  const refresh = () => {
    fetchCars();
    fetchParkingConfig();
  };

  // Calcula a porcentagem de ocupação do pátio
  const occupancyPercentage = parkingCapacity
    ? Math.round((cars.length / parkingCapacity) * 100)
    : 0;

  return {
    cars,
    loading,
    refresh,
    occupancyPercentage,
  };
};

export default useParking;
