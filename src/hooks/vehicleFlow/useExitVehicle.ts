import { VehicleApi } from "@/api/vehicleFlowService";
import { CalculateExitResponse, duplicateReceipt, RegisterExitData, RegisterExitResponse } from "@/types/vehicleTypes/vehicles";
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

  const registerExit = async (data: RegisterExitData) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response: RegisterExitResponse = await VehicleApi.registerExit(data);

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Saída registrada com sucesso.");
        return {
          success: true,
          message: response.message || "Saída registrada com sucesso.",
          data: response.data,
        };
      } else {
        setError(response.message || "Erro ao registrar saída.");
        return {
          success: false,
          message: response.message || "Erro ao registrar saída.",
          data: null,
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao registrar saída.";
      setError(errorMessage);
      setMessage(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const duplicateReceipt = async (id: string) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      console.log('chamando a api')
      console.log('o id:', id)
      const response: duplicateReceipt = await VehicleApi.duplicateReceipt(id);


      if(response.success) {
        setSuccess(true);
        return {
          success: true,
          data: response.data,
        };
      } else {
        setError(response.message || "Erro ao gerar a segunda vida do comprovante.");
        return {
          success: false,
          message: response.message || "Erro ao gerar a segunda vida do comprovante.",
          data: null,
        };
      }
    } catch (error: any) {
      console.log(error)
      const errorMessage = error?.response?.data?.message || "Erro ao gerar a segunda vida do comprovante.";
      setError(errorMessage);
      setMessage(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    } finally {
      setLoading(false);
    }
  }

  return {
    calculateExit,
    registerExit,
    duplicateReceipt,
    loading,
    success,
    error,
    message,
  };
};
