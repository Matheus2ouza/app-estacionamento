import { VehicleApi } from "@/src/api/vehicleFlowService";
import { useAuth } from "@/src/context/AuthContext";
import { useState } from "react";

const useRegisterVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { userId } = useAuth();

  const registerVehicle = async (plate: string, category: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!plate.trim()) {
        throw new Error("Por favor, insira a placa do veículo.");
      }

      const plateRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/i;
      if (!plateRegex.test(plate)) {
        throw new Error("Placa inválida. Formato esperado: ABC1234 ou ABC1D23");
      }

      const validCategories = ["carro", "carroGrande", "moto"] as const;
      if (!validCategories.includes(category as any)) {
        throw new Error(
          "Categoria inválida. Escolha entre: Carro, Carro Grande ou Moto."
        );
      }

      if (!category) {
        throw new Error("Por favor, selecione a categoria do veículo.");
      }

      const payload = {
        plate: plate.toUpperCase().trim(),
        category,
        operatorId: userId,
      };

      const response = await VehicleApi.registerEntry(payload);

      // Trata ambos os cenários de sucesso:
      // 1. Ticket gerado com sucesso
      // 2. Entrada registrada mas ticket falhou (timeout)
      if (response.success) {
        console.log(response.ticket)
        setSuccess(true);
        return {
          success: true,
          message: response.message, // Mensagem original do backend
          pdfBase64: response.ticket || null, // Pode ser null
          hasTicket: !!response.ticket, // Flag para verificação fácil
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
        hasTicket: false
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