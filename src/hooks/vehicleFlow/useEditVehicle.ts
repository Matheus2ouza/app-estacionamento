// useEditVehicle.ts
import { VehicleApi } from "@/src/api/vehicleFlowService";
import { useState } from "react";

const useEditVehicle = () => {
  // Estados de loading individuais para cada ação
  const [loadingStates, setLoadingStates] = useState({
    edit: false,
    delete: false,
    secondTicket: false,
    reactivate: false
  });
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleApiCall = async (apiCall: Promise<any>, action: keyof typeof loadingStates) => {
    setLoadingStates(prev => ({ ...prev, [action]: true }));
    setApiError(null);
    setSuccess(false);

    try {
      const response = await apiCall;

      if (response.success) {
        setSuccess(true);
        return response;
      } else {
        throw new Error(response.message || "Erro na operação.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro inesperado. Tente novamente mais tarde";

      setApiError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, [action]: false }));
    }
  };

  const editVehicle = (id: string, plate: string, category: string) => {
    return handleApiCall(
      VehicleApi.editdataVehicle({
        id,
        plate: plate.toUpperCase(),
        category,
      }),
      'edit'
    );
  };

  const deleteVehicle = (id: string) => {
    return handleApiCall(VehicleApi.deleteVehicle({ id }), 'delete');
  };

  const secondTicket = (id: string) => {
    return handleApiCall(VehicleApi.secondTicket(id), 'secondTicket');
  };

  const reactivateVehicle = (id: string, plate: string) => {
    return handleApiCall(VehicleApi.reactivateVehicle({id, plate}), 'reactivate')
  }

  const reset = () => {
    setApiError(null);
    setSuccess(false);
  };

  return {
    editVehicle,
    deleteVehicle,
    secondTicket,
    reactivateVehicle,
    loadingStates, // Retornamos o objeto com todos os estados
    error: apiError,
    success,
    reset,
  };
};

export default useEditVehicle;