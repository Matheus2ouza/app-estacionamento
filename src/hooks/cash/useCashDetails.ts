import { cashApi } from "@/src/api/cashService";
import { ParkingApi } from "@/src/api/parkingService";
import { useState } from "react";

const useCashDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generalCashierData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cashApi.geralCashData(id);
      console.log(response.data)
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || "Erro ao tentar buscar os dados do caixa");
        return null;
      }
    } catch (err: any) {
      console.error("[useCashDetails] Erro:", err);
      setError(err.message || "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const dataToHome = async (id: string) => {
    setError(null)
    try{
      const response = await cashApi.dataCashHome(id)
      return response.data
    } catch (err: any) {
      console.error(`[useCashDetails] Erro: ${err}`);
      setError(err.message || "Erro interno do servidor")
    }
  };

  const parkingToHome = async () => {
    setError(null)
    try{
      const response = await ParkingApi.getParkingData()
      return response.data
    } catch (err: any) {
      console.error(`[useCashDetails] Erro: ${err}`);
      setError(err.message || "Erro interno do servidor")
    }
  }

  return {
    generalCashierData,
    dataToHome,
    parkingToHome,
    loading,
    error,
  };
};

export default useCashDetails;
