import { cashApi } from "@/src/api/cashService";
import { ParkingApi } from "@/src/api/parkingService";
import { CashData, cashResponse } from "@/src/types/cashTypes/cash";
import { CapacityParkingResponse } from "@/src/types/parkingTypes/parking";
import { useState } from "react";

export type CashStatus = 'not_created' | 'open' | 'closed';

export function useCash() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [cashStatus, setCashStatus] = useState<CashStatus>('not_created');
  const [cashData, setCashData] = useState<cashResponse['cash'] | null>(null);
  const [localCashStatus, setLocalCashStatus] = useState<CashStatus>('not_created');

  const fetchStatus = async (): Promise<CashStatus> => {
    console.log('🔍 [useCash] fetchStatus: Iniciando busca do status do caixa');
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.statusCash();
      console.log('🔍 [useCash] fetchStatus: Resposta da API:', response);

      if (!response.success) {
        // Cenário 1: Caixa não foi criado
        console.log('🔍 [useCash] fetchStatus: Caixa não foi criado');
        setCashStatus('not_created');
        setLocalCashStatus('not_created');
        setCashData(null);
        return 'not_created';
      }

      if (response.cash) {
        if (response.cash.status === 'OPEN') {
          // Cenário 2: Caixa foi criado e está com status open
          console.log('🔍 [useCash] fetchStatus: Caixa está aberto, ID:', response.cash.id);
          setCashStatus('open');
          setLocalCashStatus('open');
          setCashData(response.cash);
          setSuccess(true);
          return 'open';
        } else {
          // Cenário 3: Caixa foi criado mas está com status close
          console.log('🔍 [useCash] fetchStatus: Caixa está fechado, ID:', response.cash.id);
          setCashStatus('closed');
          setLocalCashStatus('closed');
          setCashData(response.cash);
          return 'closed';
        }
      }

      // Fallback: Caixa não foi criado
      setCashStatus('not_created');
      setLocalCashStatus('not_created');
      setCashData(null);
      return 'not_created';

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar status do caixa';
      console.error('❌ [useCash] fetchStatus: Erro:', errorMessage, err);
      setError(errorMessage);
      setCashStatus('not_created');
      setLocalCashStatus('not_created');
      setCashData(null);
      return 'not_created';
    } finally {
      setLoading(false);
      console.log('🔍 [useCash] fetchStatus: Finalizando busca do status');
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
        setLocalCashStatus('open');
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
      const response = await cashApi.reOpenCash(cashId);
      if (response.success && response.cash?.status === 'OPEN') {
        setSuccess(true);
        setCashStatus('open');
        setLocalCashStatus('open');
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
        setLocalCashStatus('closed');
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
    console.log('🔍 [useCash] detailsCash: Buscando detalhes do caixa, ID:', cashId);
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.detailsCash(cashId);
      console.log('🔍 [useCash] detailsCash: Resposta da API:', response);

      if (response.success && response.data) {
        console.log('✅ [useCash] detailsCash: Detalhes obtidos com sucesso');
        setSuccess(true);
        return response.data;
      } else {
        const errorMsg = response.message || 'Erro ao buscar detalhes do caixa';
        console.error('❌ [useCash] detailsCash: Erro na resposta:', errorMsg);
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar detalhes do caixa';
      console.error('❌ [useCash] detailsCash: Erro:', errorMessage, err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      console.log('🔍 [useCash] detailsCash: Finalizando busca de detalhes');
    }
  }

  const detailsParking = async (cashId: string): Promise<CapacityParkingResponse | null> => {
    console.log('🔍 [useCash] detailsParking: Buscando detalhes do estacionamento, ID:', cashId);
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response: CapacityParkingResponse = await ParkingApi.getCapacityParking(cashId)
      console.log('🔍 [useCash] detailsParking: Resposta da API:', response);

      if (response.success && response.data) {
        console.log('✅ [useCash] detailsParking: Detalhes obtidos com sucesso');
        setSuccess(true);
        return {
          success: response.success,
          message: response.message,
          data: response.data
        }
      } else {
        const errorMsg = response.message || 'Erro ao buscar detalhes do estacionamento';
        console.error('❌ [useCash] detailsParking: Erro na resposta:', errorMsg);
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar detalhes do estacionamento';
      console.error('❌ [useCash] detailsParking: Erro:', errorMessage, err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      console.log('🔍 [useCash] detailsParking: Finalizando busca de detalhes');
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
    localCashStatus,
    cashData,
    fetchStatus,
    openCash,
    reOpenCash,
    closeCash,
    detailsCash,
    detailsParking,
    refreshCashStatus,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  };
}