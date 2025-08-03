import { ParkingApi } from '@/src/api/parkingService';
import { VehicleApi } from '@/src/api/vehicleFlowService';
import { formatTime } from '@/src/utils/dateUtils';
import { useEffect, useState } from 'react';

interface Car {
  id: number,
  plate: string;
  entryTime: string;
  operator: string;
  category: string;
}

interface CarWithElapsedTime extends Car {
  elapsedTime: string;
  formattedEntryTime: string;
}

interface ParkingConfig {
  maxCars: number;
  maxMotorcycles: number;
}

const useParking = () => {
  const [cars, setCars] = useState<CarWithElapsedTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [parkingCapacity, setParkingCapacity] = useState<number | null>(null);

  // Função para calcular tempo decorrido
  const calculateElapsedTime = (entryTime: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - entryTime.getTime()) / 1000);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Buscar configuração do pátio
  const fetchParkingConfig = async () => {
    try {
      const configData = await ParkingApi.getConfigParking();
      if (configData.success) {
        const config: ParkingConfig = configData.config;
        const totalCapacity =
          config.maxCars + config.maxMotorcycles;
        setParkingCapacity(totalCapacity);
      }
    } catch (error) {
      console.error('Erro ao buscar configuração do pátio:', error);
    }
  };

  // Buscar veículos do pátio
  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await VehicleApi.getParkedExit();
      console.log(data)

      if (data.success) {
        const carsWithElapsedTime = data.data.map((car: Car) => {
          const parsedEntryTime = new Date(car.entryTime);

          return {
            ...car,
            elapsedTime: calculateElapsedTime(parsedEntryTime),
            formattedEntryTime: formatTime(parsedEntryTime),
          };
        });

        setCars(carsWithElapsedTime);
      }
    } catch (error) {
      console.error('Erro ao buscar carros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza contadores a cada segundo
  useEffect(() => {
    if (cars.length === 0) return;

    const interval = setInterval(() => {
      setCars(prevCars =>
        prevCars.map(car => {
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
