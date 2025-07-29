import { VehicleApi } from "@/src/api/vehicleFlowService";
import { useState } from "react";
import { EntryData } from "@/src/types/vehicleFlow";

const useRegisterVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerVehicle = async (data: EntryData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!data.plate.trim()) {
        throw new Error("Por favor, insira a placa do veículo.");
      }

      const plateRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/i;
      if (!plateRegex.test(data.plate)) {
        throw new Error("Placa inválida. Formato esperado: ABC1234 ou ABC1D23");
      }

      const validCategories = ["carro", "moto"] as const;
      if (!validCategories.includes(data.category as any)) {
        throw new Error(
          "Categoria inválida. Escolha entre: Carro, Carro Grande ou Moto."
        );
      }

      if (!data.category) {
        throw new Error("Por favor, selecione a categoria do veículo.");
      }

      const response = await VehicleApi.registerEntry(data);

      if (response.success) {
        setSuccess(true);
        return {
          success: true,
          message: response.message,
          pdfBase64: response.ticket || null,
          hasTicket: !!response.ticket,
        };
      } else {
        throw new Error(response.message || "Erro ao registrar entrada.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao registrar a entrada. Tente novamente.";

      console.error("Erro no registerVehicle:", errorMessage);
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        hasTicket: false,
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
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
};

export default useRegisterVehicle;
