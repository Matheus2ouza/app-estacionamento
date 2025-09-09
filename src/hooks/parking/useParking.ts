import { ParkingApi } from "@/src/api/parkingService";
import { CapacityParkingResponse, ParkedVehicle } from "@/src/types/parking";
import { useState } from "react";

export function useParking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const getCapacityParking = async (cashId: string): Promise<CapacityParkingResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await ParkingApi.getCapacityParking(cashId);
      setSuccess(true);
      setMessage(response.message || 'Capacidade do pátio carregada com sucesso');
      return { 
        success: true, 
        message: response.message || 'Capacidade do pátio carregada com sucesso', 
        data: response.data 
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao buscar capacidade do pátio';
      setSuccess(false);
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        data: {
          capacityMax: 0,
          quantityVehicles: 0,
          maxCars: 0,
          maxMotorcycles: 0,
          percentage: 0
        }
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    message,
    getCapacityParking
  };
}

export function useParkedVehicles(cashId: string, limit: number = 5) {
  const [vehicles, setVehicles] = useState<ParkedVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadInitial = async () => {
    setLoading(true);
    setError(null);
    setVehicles([]);
    setNextCursor(null);
    setHasMore(true);

    try {
      const response = await ParkingApi.getParkedVehicles(cashId, undefined, limit);

      if (response.success) {
        setVehicles(response.data.vehicles);
        setNextCursor(response.data.nextCursor || null);
        setHasMore(response.data.hasMore);
      } else {
        setError(response.message || 'Erro ao carregar veículos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextCursor || loading || !hasMore) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ParkingApi.getParkedVehicles(cashId, nextCursor, limit);
      
      if (response.success) {
        setVehicles(prev => {
          const newVehicles = [...prev, ...response.data.vehicles];
          return newVehicles;
        });
        setNextCursor(response.data.nextCursor || null);
        setHasMore(response.data.hasMore);
      } else {
        setError(response.message || 'Erro ao carregar mais veículos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar mais veículos');
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicles,
    loading,
    error,
    nextCursor,
    hasMore,
    loadInitial,
    loadMore
  };
}