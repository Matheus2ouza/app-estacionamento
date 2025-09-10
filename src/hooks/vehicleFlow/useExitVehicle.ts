import { VehicleApi } from "@/src/api/vehicleFlowService";
import { CalculateExitResponse } from "@/src/types/vehicleTypes/vehicles";
import { useState } from "react";

export const useExitVehicle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const calculateExit = async (id: string, plate: string) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response: CalculateExitResponse = await VehicleApi.calculateExit(id, plate)
      console.log("🚀 [useExitVehicle] Resposta da API:", response);

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Veículo encontrado com sucesso.");
        setError(null);
        return {
          data: response.amount,
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
    calculateExit,
    loading,
    success,
    error,
    message,
  };
};
