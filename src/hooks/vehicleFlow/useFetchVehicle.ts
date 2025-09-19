import { VehicleApi } from "@/api/vehicleFlowService";
import { ScanVehicleResponse } from "@/types/vehicleTypes/vehicles";
import { useState } from "react";

export const useFetchVehicle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchVehicle = async (id: string, plate: string) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response: ScanVehicleResponse = await VehicleApi.fetchVehicle(id, plate)

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Veículo encontrado com sucesso.");
        setError(null);
        return {
          data: response.data,
        }
      } else {
        setSuccess(false);
        setError(response.message || "Erro ao buscar veículo.");
        setMessage(response.message || "Erro ao buscar veículo.");
      }
    } catch (error: any) {
      setSuccess(false);
      setError(error.message || "Erro ao buscar veículo.");
      setMessage(error.message || "Erro ao buscar veículo.");
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchVehicle,
    loading,
    success,
    error,
    message,
  };
};
