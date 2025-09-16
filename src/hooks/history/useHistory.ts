import { cashApi } from "@/src/api/cashService";
import { HistoryResponse } from "@/src/types/historyTypes/history";
import { useCallback, useState } from "react";

export default function useHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HistoryResponse['data'] | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  const fetchHistory = useCallback(async (limit: number = 9, cursor?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.generalHistoryCash(limit, cursor);
      
      if (response.success) {
        if (cursor) {
          // Carregando mais dados (pagination)
          setData(prevData => ({
            ...response.data,
            cashRegisters: [...(prevData?.cashRegisters || []), ...response.data.cashRegisters]
          }));
        } else {
          // Primeira carga
          setData(response.data);
        }
        
        setHasMore(response.data.pagination.hasNextPage);
        setNextCursor(response.data.pagination.nextCursor);
      } else {
        setError(response.message || 'Erro ao carregar histórico');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao carregar histórico';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (hasMore && nextCursor && !loading) {
      await fetchHistory(9, nextCursor);
    }
  }, [hasMore, nextCursor, loading, fetchHistory]);

  const refresh = useCallback(async () => {
    setData(null);
    setNextCursor(undefined);
    setHasMore(false);
    await fetchHistory(9);
  }, [fetchHistory]);

  
  return {
    loading,
    error,
    data,
    hasMore,
    nextCursor,
    fetchHistory,
    loadMore,
    refresh,
  };
}