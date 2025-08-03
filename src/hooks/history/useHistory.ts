// useHistoricData.ts
import { useState, useEffect } from 'react';
import { dashboardApi } from '@/src/api/dashboardService';
import { ResponseHistoric, ResponseSecondCopy } from '@/src/types/dashboard';

export const useHistoricData = () => {
  const [data, setData] = useState<ResponseHistoric | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"day" | "week" | "month">("day");
  const [secondCopyData, setSecondCopyData] = useState<ResponseSecondCopy | null>(null);
  const [showSecondCopy, setShowSecondCopy] = useState(false);
  const [secondCopyLoading, setSecondCopyLoading] = useState(false);
  const [secondCopyError, setSecondCopyError] = useState<string | null>(null);

  const fetchHistoricData = async (timeFilter: "day" | "week" | "month" = "day") => {
    try {
      setLoading(true);
      const response = await dashboardApi.history(timeFilter);
      setData(response);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar histórico. Tente novamente mais tarde.');
      console.error('Error fetching historic data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSecondCopy = async (type: "product" | "vehicle", id: string) => {
    try {
      setSecondCopyLoading(true);
      setSecondCopyError(null);
      
      const response = await dashboardApi.secondCopy(type, id);

      setSecondCopyData(response);
      setShowSecondCopy(true);
    } catch (err) {
      setSecondCopyError('Erro ao carregar segunda via. Tente novamente.');
      console.error('Error fetching second copy:', err);
    } finally {
      setSecondCopyLoading(false);
    }
  };

  const closeSecondCopy = () => {
    setShowSecondCopy(false);
    setSecondCopyData(null);
  };

  useEffect(() => {
    fetchHistoricData("day");
  }, []);

  const refetch = (timeFilter: "day" | "week" | "month" = "day") => {
    setFilter(timeFilter);
    fetchHistoricData(timeFilter);
  };

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    filter, 
    setFilter,
    secondCopyData,
    showSecondCopy,
    secondCopyLoading,
    secondCopyError,
    setSecondCopyError,
    fetchSecondCopy,
    closeSecondCopy
  };
};