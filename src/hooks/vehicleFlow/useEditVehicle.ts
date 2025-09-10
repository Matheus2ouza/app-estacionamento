import { VehicleApi } from "@/src/api/vehicleFlowService";
import { UpdateVehicleData, UpdateVehicleResponse } from "@/src/types/vehicleTypes/vehicles";
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

  const updateVehicle = async (id: string, data: UpdateVehicleData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response: UpdateVehicleResponse = await VehicleApi.updateVehicle(id, data);

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Veículo atualizado com sucesso.");
        return {
          success: true,
          message: response.message || "Veículo atualizado com sucesso.",
          ticket: response.ticket,
        };
      } else {
        setError(response.message || "Erro ao atualizar veículo.");
        return {
          success: false,
          message: response.message || "Erro ao atualizar veículo.",
          ticket: null,
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao atualizar veículo.";
      setError(errorMessage);
      setMessage(errorMessage);
      return {
        success: false,
        message: errorMessage,
        ticket: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateVehiclePhoto = async (id: string, photo: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await VehicleApi.updateVehiclePhoto(id, photo);

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Foto do veículo atualizada com sucesso.");
        return {
          success: true,
          message: response.message || "Foto do veículo atualizada com sucesso.",
        };
      } else {
        setError(response.message || "Erro ao atualizar foto do veículo.");
        return {
          success: false,
          message: response.message || "Erro ao atualizar foto do veículo.",
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao atualizar foto do veículo.";
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

  const deleteVehiclePhoto = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await VehicleApi.deleteVehiclePhoto(id);

      if(response.success) {
        setSuccess(true);
        setMessage(response.message || "Foto do veículo deletada com sucesso.");
        return {
          success: true,
          message: response.message || "Foto do veículo deletada com sucesso.",
        };
      } else {
        setError(response.message || "Erro ao deletar foto do veículo.");
        return {
          success: false,
          message: response.message || "Erro ao deletar foto do veículo.",
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao deletar foto do veículo.";
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
    updateVehicle,
    updateVehiclePhoto,
    deleteVehiclePhoto,
  };
};

export default useEditVehicle;
