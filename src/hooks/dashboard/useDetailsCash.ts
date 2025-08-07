import { useState, useEffect, useCallback } from "react";
import { dashboardApi } from "@/src/api/dashboardService";
import { ResponseDetailsCash } from "@/src/types/dashboard";

export const useDetailsCash = (id: string) => {
  const [data, setData] = useState<ResponseDetailsCash | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.geralDetailsCash(id);
      console.log(response);
      setData(response);
      setError(null);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro inesperado. Tente novamente mais tarde.");
      }
      console.log("❌ Erro detalhado:", JSON.stringify(err.response?.data, null, 2));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  return { 
    data, 
    loading, 
    error,
    refetch: fetchData // Adiciona a função de recarregar os dados
  };
};