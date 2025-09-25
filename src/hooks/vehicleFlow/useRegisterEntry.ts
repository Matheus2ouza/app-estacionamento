import { VehicleApi } from "@/api/vehicleFlowService";
import { RegisterVehicleData } from "@/types/vehicleTypes/vehicles";
import { useState } from "react";

const useRegisterVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const registerVehicle = async (data: RegisterVehicleData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      if (!data.plate.trim()) {
        throw new Error("Por favor, insira a placa do veículo.");
      }

      const plateRegex = /^[A-Z]{3}[-]?[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i;
      if (!plateRegex.test(data.plate)) {
        throw new Error("Placa inválida. Formato esperado: ABC1234, ABC-1234 ou ABC1D23");
      }

      const validCategories = ["carro", "moto"] as const;
      if (!validCategories.includes(data.category as any)) {
        throw new Error("Categoria inválida. Escolha entre: Carro ou Moto.");
      }

      if (!data.category) {
        throw new Error("Por favor, selecione a categoria do veículo.");
      }

      if (data.observation === "" || data.observation === undefined) {
        data.observation = null;
      }

      const payload: RegisterVehicleData = {
        plate: data.plate.toUpperCase().trim(),
        category: data.category,
        observation: data.observation,
        billingMethod: data.billingMethod,
        cashRegisterId: data.cashRegisterId,
      };

      const response = await VehicleApi.registerEntry(payload, data.photo || "");

      setSuccess(true);
      setMessage(response.message || "Entrada registrada com sucesso.");
      return {
        success: true,
        message: response.message || "Entrada registrada com sucesso.",
        ticket: response.ticket,
      };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao registrar entrada do veículo.";
      setError(errorMessage);
      setMessage(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    registerVehicle,
    loading,
    error,
    success,
    message,
  };
};

export default useRegisterVehicle;
