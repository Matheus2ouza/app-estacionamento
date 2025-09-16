import { cashApi } from '@/src/api/cashService';
import { CashHistoryData } from '@/src/types/cashTypes/cash';
import { useCallback, useRef, useState } from 'react';

export const useCashHistory = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CashHistoryData | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const isLoadingRef = useRef<boolean>(false);

  const fetchCashHistory = useCallback(async (cashId: string): Promise<CashHistoryData | null> => {
    // Evitar chamadas desnecessárias se já está carregando
    if (isLoadingRef.current) {
      console.log('⏳ [useCashHistory] fetchCashHistory: Já está carregando, ignorando chamada');
      return null;
    }

    console.log('🔍 [useCashHistory] fetchCashHistory: Buscando histórico do caixa, ID:', cashId);
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.historyCash(cashId);
      console.log('🔍 [useCashHistory] fetchCashHistory: Resposta da API:', response);

      if (response.success && response.data) {
        console.log('✅ [useCashHistory] fetchCashHistory: Histórico obtido com sucesso');
        setData(response.data);
        return response.data;
      } else {
        const errorMsg = response.message || 'Erro ao buscar histórico do caixa';
        console.error('❌ [useCashHistory] fetchCashHistory: Erro na resposta:', errorMsg);
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar histórico do caixa';
      console.error('❌ [useCashHistory] fetchCashHistory: Erro:', errorMessage, err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  const deleteTransaction = useCallback(async (
    cashId: string,
    transactionId: string, 
    type: 'vehicle' | 'product' | 'expense', 
    permanent?: boolean
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);
    
    try {
      const response = await cashApi.deleteTransaction(cashId, transactionId, type, permanent);
      if (response.success) {
        setSuccess(true);
        setMessage(response.message || "Transação excluída com sucesso.");
      } else {
        setError(response.message || "Erro ao excluir transação.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao excluir transação.");
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Erro ao excluir transação.");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    data,
    success,
    message,
    fetchCashHistory,
    clearError,
    deleteTransaction,
  };
};
