import { VehicleApi } from "@/src/api/vehicleFlowService";
import { useState } from "react";

const useEditVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleApiCall = async (apiCall: Promise<any>) => {
    setLoading(true);
    setApiError(null);
    setSuccess(false);

    try {
      const response = await apiCall;

      console.log(response.ticket)
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
      setLoading(false);
    }
  };

  const editVehicle = (id: string, plate: string, category: string) => {
    return handleApiCall(
      VehicleApi.editdataVehicle({
        id,
        plate: plate.toUpperCase(),
        category,
      })
    );
  };

  const deleteVehicle = (id: string) => {
    return handleApiCall(VehicleApi.deleteVehicle({ id }));
  };

  const secondTicket = (id: string) => {
    return handleApiCall(VehicleApi.secondTicket(id));
  };

  const reset = () => {
    setApiError(null);
    setSuccess(false);
  };

  return {
    editVehicle,
    deleteVehicle,
    secondTicket,
    loading,
    error: apiError,
    success,
    reset,
  };
};

export default useEditVehicle;
