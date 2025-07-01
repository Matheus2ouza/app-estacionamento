// src/hooks/useRegisterVehicle.ts
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

      // Validação de formato de placa (antigo e Mercosul)
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

      const register = {
        plate: plate,
        category: category,
        operatorId: userId,
      };

      console.log(register);
      const response = await VehicleApi.registerEntry(register);

      if (response.success) {
        setSuccess(true);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Erro ao registrar entrada");
      }
    } catch (err: any) {
      let errorMessage = "Erro ao registrar a entrada. Tente novamente.";

      if (err.response) {
        const data = err.response.data;

        // Se houver campos de erro detalhados, junte as mensagens
        if (data?.fields) {
          const messages = Object.values(data.fields);
          errorMessage = messages.join(" \n ");
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
      return { success: false, message: errorMessage };
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
