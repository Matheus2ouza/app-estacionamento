import { cashApi } from '@/api/cashService';
import { ParkingApi } from '@/api/parkingService';
import { useAuth } from '@/context/AuthContext';
import { cash, CashData } from '@/types/cashTypes/cash';
import { CapacityParkingResponse } from '@/types/parkingTypes/parking';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export type CashStatus = 'not_created' | 'open' | 'closed';

interface CashContextType {
  // Estados do caixa
  loading: boolean;
  error: string | null;
  success: boolean;
  cashStatus: CashStatus;
  cashData: cash | null;
  cashDetails: CashData | null;
  parkingDetails: CapacityParkingResponse | null;
  
  // Funções de controle do caixa
  fetchCashStatus: () => Promise<{ status: CashStatus; cashId?: string }>;
  openCash: (initialValue: number) => Promise<[boolean, string]>;
  reOpenCash: (cashId: string) => Promise<[boolean, string]>;
  closeCash: (cashId: string) => Promise<[boolean, string]>;
  updateInitialValue: (cashId: string, initialValue: number) => Promise<[boolean, string]>;
  
  // Funções de dados
  fetchCashDetails: (cashId?: string) => Promise<CashData | null>;
  fetchParkingDetails: (cashId?: string) => Promise<CapacityParkingResponse | null>;
  refreshAllData: () => Promise<void>;
  
  // Utilitários
  clearError: () => void;
  clearSuccess: () => void;
  isCashOpen: () => boolean;
  isCashClosed: () => boolean;
  isCashNotCreated: () => boolean;
}

const CashContext = createContext<CashContextType | undefined>(undefined);

interface CashProviderProps {
  children: ReactNode;
}

export function CashProvider({ children }: CashProviderProps) {
  const { isAuthenticated } = useAuth();
  
  // Estados do caixa
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [cashStatus, setCashStatus] = useState<CashStatus>('not_created');
  const [cashData, setCashData] = useState<cash | null>(null);
  const [cashDetails, setCashDetails] = useState<CashData | null>(null);
  const [parkingDetails, setParkingDetails] = useState<CapacityParkingResponse | null>(null);

  // Função para buscar status do caixa
  const fetchCashStatus = async (): Promise<{ status: CashStatus; cashId?: string }> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.statusCash();

      if (!response.success) {
        setCashStatus('not_created');
        setCashData(null);
        setCashDetails(null);
        setParkingDetails(null);
        return { status: 'not_created' };
      }

      if (response.cash) {
        if (response.cash.status === 'OPEN') {
          setCashStatus('open');
          setCashData(response.cash);
          setSuccess(true);
          return { status: 'open', cashId: response.cash.id };
        } else {
          setCashStatus('closed');
          setCashData(response.cash);
          setParkingDetails(null); // Limpar dados do estacionamento quando fechado
          return { status: 'closed', cashId: response.cash.id };
        }
      }

      // Fallback: Caixa não foi criado
      setCashStatus('not_created');
      setCashData(null);
      setCashDetails(null);
      setParkingDetails(null);
      return { status: 'not_created' };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar status do caixa';
      console.error('❌ [CashContext] fetchCashStatus: Erro:', errorMessage, err);
      setError(errorMessage);
      setCashStatus('not_created');
      setCashData(null);
      setCashDetails(null);
      setParkingDetails(null);
      return { status: 'not_created' };
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar detalhes do caixa
  const fetchCashDetails = async (cashId?: string): Promise<CashData | null> => {
    const idToUse = cashId || cashData?.id;
    if (!idToUse) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.detailsCash(idToUse);

      if (response.success && response.data) {
        setCashDetails(response.data);
        setSuccess(true);
        return response.data;
      } else {
        const errorMsg = response.message || 'Erro ao buscar detalhes do caixa';
        console.error('❌ [CashContext] fetchCashDetails: Erro na resposta:', errorMsg);
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar detalhes do caixa';
      console.error('❌ [CashContext] fetchCashDetails: Erro:', errorMessage, err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar detalhes do estacionamento
  const fetchParkingDetails = async (cashId?: string): Promise<CapacityParkingResponse | null> => {
    const idToUse = cashId || cashData?.id;
    if (!idToUse) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response: CapacityParkingResponse = await ParkingApi.getCapacityParking(idToUse);

      if (response.success && response.data) {
        setParkingDetails(response);
        setSuccess(true);
        return response;
      } else {
        const errorMsg = response.message || 'Erro ao buscar detalhes do estacionamento';
        console.error('❌ [CashContext] fetchParkingDetails: Erro na resposta:', errorMsg);
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar detalhes do estacionamento';
      console.error('❌ [CashContext] fetchParkingDetails: Erro:', errorMessage, err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar todos os dados
  const refreshAllData = useCallback(async (): Promise<void> => {
    
    // Primeiro busca o status
    const { status, cashId } = await fetchCashStatus();
    
    // Pequeno atraso apenas se necessário
    await new Promise(resolve => setTimeout(resolve, 60));
    
    // Se o caixa existe, busca os detalhes usando o ID retornado
    if ((status === 'open' || status === 'closed') && cashId) {
      // Executar em paralelo para reduzir latência
      if (status === 'open') {
        await Promise.all([
          fetchCashDetails(cashId),
          fetchParkingDetails(cashId),
        ]);
      } else {
        await fetchCashDetails(cashId);
      }
    }
  }, []);

  // Função para abrir caixa
  const openCash = async (initialValue: number): Promise<[boolean, string]> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.openCash(initialValue);

      if (response.success && response.cash?.status === 'OPEN') {
        setSuccess(true);
        setCashStatus('open');
        setCashData(response.cash);
        
        // Atualizar todo o estado (status, detalhes e estacionamento)
        await refreshAllData();
        
        return [true, response.message || 'Caixa aberto com sucesso!'];
      } else {
        const errorMsg = response.message || 'Erro ao abrir caixa';
        console.error('❌ [CashContext] openCash: Erro:', errorMsg);
        setError(errorMsg);
        return [false, errorMsg];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao abrir caixa';
      console.error('❌ [CashContext] openCash: Erro:', errorMessage, err);
      setError(errorMessage);
      return [false, errorMessage];
    } finally {
      setLoading(false);
    }
  };

  // Função para reabrir caixa
  const reOpenCash = async (cashId: string): Promise<[boolean, string]> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.reOpenCash(cashId);

      if (response.success && response.cash?.status === 'OPEN') {
        setSuccess(true);
        setCashStatus('open');
        setCashData(response.cash);
        
        // Atualizar todo o estado (status, detalhes e estacionamento)
        await refreshAllData();
        
        return [true, response.message || 'Caixa reaberto com sucesso!'];
      } else {
        const errorMsg = response.message || 'Erro ao reabrir caixa';
        console.error('❌ [CashContext] reOpenCash: Erro:', errorMsg);
        setError(errorMsg);
        return [false, errorMsg];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reabrir caixa';
      console.error('❌ [CashContext] reOpenCash: Erro:', errorMessage, err);
      setError(errorMessage);
      return [false, errorMessage];
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar caixa
  const closeCash = async (cashId: string): Promise<[boolean, string]> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.closeCash(cashId);
      // Tratar sucesso baseado no campo success, independentemente do status retornado
      if (response.success) {
        setSuccess(true);
        setCashStatus('closed');
        if (response.cash) {
          setCashData(response.cash);
        }
        setParkingDetails(null); // Limpar dados do estacionamento

        // Atualizar todo o estado do contexto após fechamento
        await refreshAllData();

        return [true, response.message || 'Caixa fechado com sucesso!'];
      }

      // Caso a API não sinalize sucesso
      const errorMsg = response.message || 'Erro ao fechar caixa';
      console.error('❌ [CashContext] closeCash: Erro:', errorMsg);
      setError(errorMsg);
      return [false, errorMsg];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fechar caixa';
      console.error('❌ [CashContext] closeCash: Erro:', errorMessage, err);
      setError(errorMessage);
      return [false, errorMessage];
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar valor inicial
  const updateInitialValue = async (cashId: string, initialValue: number): Promise<[boolean, string]> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.updateInitialValue(cashId, initialValue);

      if (response.success) {
        setSuccess(true);
        
        // Atualizar dados do caixa se retornado
        if (response.cash) {
          setCashData(response.cash);
        }
        
        // Atualizar todo o estado
        await refreshAllData();
        
        return [true, response.message || 'Valor inicial atualizado com sucesso!'];
      } else {
        const errorMsg = response.message || 'Erro ao atualizar valor inicial';
        console.error('❌ [CashContext] updateInitialValue: Erro:', errorMsg);
        setError(errorMsg);
        return [false, errorMsg];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar valor inicial';
      console.error('❌ [CashContext] updateInitialValue: Erro:', errorMessage, err);
      setError(errorMessage);
      return [false, errorMessage];
    } finally {
      setLoading(false);
    }
  };

  // Funções utilitárias
  const isCashOpen = (): boolean => cashStatus === 'open';
  const isCashClosed = (): boolean => cashStatus === 'closed';
  const isCashNotCreated = (): boolean => cashStatus === 'not_created';

  const clearError = (): void => setError(null);
  const clearSuccess = (): void => setSuccess(false);

  // Buscar status do caixa quando o usuário fizer login
  useEffect(() => {
    if (isAuthenticated) {
      fetchCashStatus();
    } else {
      // Limpar dados quando não autenticado
      setCashStatus('not_created');
      setCashData(null);
      setCashDetails(null);
      setParkingDetails(null);
      setError(null);
      setSuccess(false);
    }
  }, [isAuthenticated]);

  const cashContextValue: CashContextType = {
    // Estados
    loading,
    error,
    success,
    cashStatus,
    cashData,
    cashDetails,
    parkingDetails,
    
    // Funções de controle
    fetchCashStatus,
    openCash,
    reOpenCash,
    closeCash,
    updateInitialValue,
    
    // Funções de dados
    fetchCashDetails,
    fetchParkingDetails,
    refreshAllData,
    
    // Utilitários
    clearError,
    clearSuccess,
    isCashOpen,
    isCashClosed,
    isCashNotCreated,
  };

  return (
    <CashContext.Provider value={cashContextValue}>
      {children}
    </CashContext.Provider>
  );
}

export function useCashContext(): CashContextType {
  const context = useContext(CashContext);
  
  if (context === undefined) {
    throw new Error('useCashContext deve ser usado dentro de um CashProvider');
  }
  
  return context;
}
