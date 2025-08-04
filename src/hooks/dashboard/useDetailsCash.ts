import { useState, useEffect } from "react";
import { dashboardApi } from "@/src/api/dashboardService";
import { ResponseDetailsCash } from "@/src/types/dashboard";

export const useDetailsCash = (id: string) => {
  const [data, setData] = useState<ResponseDetailsCash | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.geralDetailsCash(id);
        console.log(response);
        setData(response);
        setError(null);
      } catch (err: any) {
        if (err.response?.data?.message) {
          setError(err.response.data.message); // mostra mensagem do backend
        } else {
          setError("Erro inesperado. Tente novamente mais tarde.");
        }
        
        console.log("❌ Erro detalhado:", JSON.stringify(err.response?.data, null, 2));

      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  return { data, loading, error };
};
