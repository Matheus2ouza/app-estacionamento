import { useState, useEffect } from 'react';
import { dashboardApi } from '@/src/api/dashboardService';
import { ResponseDetailsCash } from '@/src/types/dashboard';

export const useDetailsCash = (id: string) => {
  const [data, setData] = useState<ResponseDetailsCash | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.geralDetailsCash(id);
        setData(response);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar os detalhes do caixa');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  return { data, loading, error };
};