import { cashApi } from "@/api/cashService";
import { generalDetails, outgoingExpenseDetails, productDetails, vehicleDetails } from "@/types/cashTypes/cash";
import { useState } from "react";

export const useCash = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [data, setData] = useState<{
    generalDetails: generalDetails;
    vehicleDetails: vehicleDetails;
    productDetails: productDetails;
    outgoingExpenseDetails: outgoingExpenseDetails;
  } | null>(null);

  const fetchGeneralDetailsCash = async (cashId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);
    
    try {
      // Tentar primeiro o endpoint general, se falhar, usar o details
      let response: any;
      try {
        response = await cashApi.generalDetailsCash(cashId);
        console.log('🔍 [useCash] fetchGeneralDetailsCash: Resposta da API (general):', response);
      } catch (generalError) {
        console.log('🔍 [useCash] fetchGeneralDetailsCash: Endpoint general falhou, tentando details:', generalError);
        response = await cashApi.detailsCash(cashId);
        console.log('🔍 [useCash] fetchGeneralDetailsCash: Resposta da API (details):', response);
      }
      
      if (response.success && response.data) {
        setSuccess(true);
        setMessage(response.message || 'Detalhes do caixa carregados com sucesso');
        setData(response.data);
        return {
          data: response.data,
        }
      } else {
        setError(response.message || 'Erro ao buscar detalhes do caixa');
        setMessage(response.message || 'Erro ao buscar detalhes do caixa');
        setData(null);
        return null;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao buscar detalhes do caixa');
      setMessage(error instanceof Error ? error.message : 'Erro ao buscar detalhes do caixa');
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };
      
  return {
    loading,
    error,
    success,
    message,
    data,
    fetchGeneralDetailsCash,
  };
};