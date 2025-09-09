import { VehicleApi } from "@/src/api/vehicleFlowService";
import { useState } from "react";

const useEditVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const secondTicket = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await VehicleApi.secondTicket(id);

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Ticket gerado com sucesso.");
        return {
          success: true,
          message: response.message || "Ticket gerado com sucesso.",
          ticket: response.ticket,
        };
      } else {
        setError(response.message || "Erro ao gerar ticket.");
        return {
          success: false,
          message: response.message || "Erro ao gerar ticket.",
          ticket: null,
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao gerar ticket.";
      setError(errorMessage);
      setMessage(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }

  const deleteVehicle = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await VehicleApi.deactivateVehicle(id);

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Veículo deletado com sucesso.");
        return {
          success: true,
          message: response.message || "Veículo deletado com sucesso.",
        };
      } else {
        setError(response.message || "Erro ao deletar veículo.");
        return {
          success: false,
          message: response.message || "Erro ao deletar veículo.",
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao deletar veículo.";
      setError(errorMessage);
      setMessage(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }

  const activateVehicle = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await VehicleApi.activateVehicle(id);

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Veículo reativado com sucesso.");
        return {
          success: true,
          message: response.message || "Veículo reativado com sucesso.",
        };
      } else {
        setError(response.message || "Erro ao reativar veículo.");
        return {
          success: false,
          message: response.message || "Erro ao reativar veículo.",
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao reativar veículo.";
      setError(errorMessage);
      setMessage(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }

  const editVehicle = async (id: string, plate: string, category: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await VehicleApi.editVehicle(id, plate, category);

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Veículo atualizado com sucesso.");
        return {
          success: true,
          message: response.message || "Veículo atualizado com sucesso.",
        };
      } else {
        setError(response.message || "Erro ao atualizar veículo.");
        return {
          success: false,
          message: response.message || "Erro ao atualizar veículo.",
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao atualizar veículo.";
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
    loading,
    error,
    success,
    message,
    secondTicket,
    deleteVehicle,
    activateVehicle,
    editVehicle,
  };
};

export default useEditVehicle;
