import { useState, useEffect, useCallback } from 'react';
import { VehicleTransaction, ProductTransaction } from '@/src/types/dashboard';
import { dashboardApi } from '@/src/api/dashboardService';

interface ResponseHistoric {
  success: boolean;
  message: string;
  data?: {
    vehicles: VehicleTransaction[];
    products: ProductTransaction[];
  };
}

export default function useCashHistory(cashId: string) {
  const [data, setData] = useState<{
    vehicles: VehicleTransaction[];
    products: ProductTransaction[];
  }>({ vehicles: [], products: [] });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCashHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardApi.historyByCash(cashId);
      if (response.success && response.data) {
        setData({
          vehicles: response.data.vehicles || [],
          products: response.data.products || []
        });
      } else {
        setError(response.message || 'Erro ao buscar histórico');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro ao buscar histórico:', err);
    } finally {
      setLoading(false);
    }
  }, [cashId]);

  useEffect(() => {
    if (cashId) {
      fetchCashHistory();
    }
  }, [cashId, fetchCashHistory]);

  return { 
    data, 
    loading, 
    error,
    refresh: fetchCashHistory
  };
}