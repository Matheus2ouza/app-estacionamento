import { cashApi } from "@/src/api/cashService";
import { CashData, cashResponse } from "@/src/types/cash";
import { useState } from "react";

export type CashStatus = 'not_created' | 'open' | 'closed';

export function useCash() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [cashStatus, setCashStatus] = useState<CashStatus>('not_created');
  const [cashData, setCashData] = useState<cashResponse['cash'] | null>(null);

  const fetchStatus = async (): Promise<CashStatus> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.statusCash();
      console.log(response)

      if (!response.success) {
        // Cenário 1: Caixa não foi criado
        setCashStatus('not_created');
        setCashData(null);
        return 'not_created';
      }

      if (response.cash) {
        if (response.cash.status === 'OPEN') {
          // Cenário 2: Caixa foi criado e está com status open
          setCashStatus('open');
          setCashData(response.cash);
          setSuccess(true);
          return 'open';
        } else {
          // Cenário 3: Caixa foi criado mas está com status close
          setCashStatus('closed');
          setCashData(response.cash);
          return 'closed';
        }
      }

      // Fallback: Caixa não foi criado
      setCashStatus('not_created');
      setCashData(null);
      return 'not_created';

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar status do caixa';
      setError(errorMessage);
      setCashStatus('not_created');
      setCashData(null);
      return 'not_created';
    } finally {
      setLoading(false);
    }
  };

  const openCash = async (initialValue: number): Promise<[boolean, string]> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.openCash(initialValue);

      if (response.success && response.cash?.status === 'OPEN') {
        setSuccess(true);
        setCashStatus('open');
        // Buscar dados atualizados do caixa
        await fetchStatus();
        return [true, response.message || 'Caixa aberto com sucesso!'];
      } else {
        const errorMsg = response.message || 'Erro ao abrir caixa';
        setError(errorMsg);
        return [false, errorMsg];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao abrir caixa';
      setError(errorMessage);
      return [false, errorMessage];
    } finally {
      setLoading(false);
    }
  };

  const reOpenCash = async (cashId: string): Promise<[boolean, string]> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log(cashId)
      const response = await cashApi.reOpenCash(cashId);
      if (response.success && response.cash?.status === 'OPEN') {
        setSuccess(true);
        setCashStatus('open');
        await fetchStatus();
        return [true, response.message || 'Caixa reaberto com sucesso!'];
      } else {
        const errorMsg = response.message || 'Erro ao reabrir caixa';
        setError(errorMsg);
        return [false, errorMsg];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reabrir caixa';
      setError(errorMessage);
      return [false, errorMessage];
    } finally {
      setLoading(false);
    }
  };

  const closeCash = async (cashId: string, finalValue: number): Promise<[boolean, string]> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.closeCash(cashId, finalValue)
      if (response.success && response.cash?.status === 'CLOSED') {
        setSuccess(true);
        setCashStatus('closed');
        await fetchStatus();
        return [true, response.message || 'Caixa fechado com sucesso!'];
      } else {
        const errorMsg = response.message || 'Erro ao fechar caixa';
        setError(errorMsg);
        return [false, errorMsg];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fechar caixa';
      setError(errorMessage);
      return [false, errorMessage];
    } finally {
      setLoading(false);
    }
  }

  const detailsCash = async (cashId: string): Promise<CashData | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.detailsCash(cashId);

      if (response.success && response.data) {
        setSuccess(true);
        return response.data;
      } else {
        const errorMsg = response.message || 'Erro ao buscar detalhes do caixa';
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar detalhes do caixa';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  const refreshCashStatus = async (): Promise<CashStatus> => {
    return await fetchStatus();
  };

  return {
    loading,
    error,
    success,
    cashStatus,
    cashData,
    fetchStatus,
    openCash,
    reOpenCash,
    closeCash,
    detailsCash,
    refreshCashStatus,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  };
}