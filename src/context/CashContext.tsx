import { cashApi } from '@/src/api/cashService';
import { ParkingApi } from '@/src/api/parkingService';
import { useAuth } from '@/src/context/AuthContext';
import { cash, CashData } from '@/src/types/cashTypes/cash';
import { CapacityParkingResponse } from '@/src/types/parkingTypes/parking';
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
    console.log('🔍 [CashContext] fetchCashStatus: Iniciando busca do status');
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.statusCash();
      console.log('🔍 [CashContext] fetchCashStatus: Resposta da API:', response);

      if (!response.success) {
        console.log('🔍 [CashContext] fetchCashStatus: Caixa não foi criado');
        setCashStatus('not_created');
        setCashData(null);
        setCashDetails(null);
        setParkingDetails(null);
        return { status: 'not_created' };
      }

      if (response.cash) {
        if (response.cash.status === 'OPEN') {
          console.log('🔍 [CashContext] fetchCashStatus: Caixa está aberto, ID:', response.cash.id);
          setCashStatus('open');
          setCashData(response.cash);
          setSuccess(true);
          return { status: 'open', cashId: response.cash.id };
        } else {
          console.log('🔍 [CashContext] fetchCashStatus: Caixa está fechado, ID:', response.cash.id);
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
      console.log('🔍 [CashContext] fetchCashStatus: Finalizando busca do status');
    }
  };

  // Função para buscar detalhes do caixa
  const fetchCashDetails = async (cashId?: string): Promise<CashData | null> => {
    const idToUse = cashId || cashData?.id;
    if (!idToUse) {
      console.log('❌ [CashContext] fetchCashDetails: ID do caixa não disponível');
      return null;
    }

    console.log('🔍 [CashContext] fetchCashDetails: Buscando detalhes do caixa, ID:', idToUse);
    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.detailsCash(idToUse);
      console.log('🔍 [CashContext] fetchCashDetails: Resposta da API:', response);

      if (response.success && response.data) {
        console.log('✅ [CashContext] fetchCashDetails: Detalhes obtidos com sucesso');
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
      console.log('🔍 [CashContext] fetchCashDetails: Finalizando busca de detalhes');
    }
  };

  // Função para buscar detalhes do estacionamento
  const fetchParkingDetails = async (cashId?: string): Promise<CapacityParkingResponse | null> => {
    const idToUse = cashId || cashData?.id;
    if (!idToUse) {
      console.log('❌ [CashContext] fetchParkingDetails: ID do caixa não disponível');
      return null;
    }

    console.log('🔍 [CashContext] fetchParkingDetails: Buscando detalhes do estacionamento, ID:', idToUse);
    setLoading(true);
    setError(null);

    try {
      const response: CapacityParkingResponse = await ParkingApi.getCapacityParking(idToUse);
      console.log('🔍 [CashContext] fetchParkingDetails: Resposta da API:', response);

      if (response.success && response.data) {
        console.log('✅ [CashContext] fetchParkingDetails: Detalhes obtidos com sucesso');
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
      console.log('🔍 [CashContext] fetchParkingDetails: Finalizando busca de detalhes');
    }
  };

  // Função para atualizar todos os dados
  const refreshAllData = useCallback(async (): Promise<void> => {
    console.log('🔍 [CashContext] refreshAllData: Atualizando todos os dados');
    
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
    console.log('🔍 [CashContext] openCash: Abrindo caixa com valor:', initialValue);
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.openCash(initialValue);
      console.log('🔍 [CashContext] openCash: Resposta da API:', response);

      if (response.success && response.cash?.status === 'OPEN') {
        console.log('✅ [CashContext] openCash: Caixa aberto com sucesso');
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
    console.log('🔍 [CashContext] reOpenCash: Reabrindo caixa, ID:', cashId);
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.reOpenCash(cashId);
      console.log('🔍 [CashContext] reOpenCash: Resposta da API:', response);

      if (response.success && response.cash?.status === 'OPEN') {
        console.log('✅ [CashContext] reOpenCash: Caixa reaberto com sucesso');
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
    console.log('🔍 [CashContext] closeCash: Fechando caixa, ID:', cashId);
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.closeCash(cashId);
      console.log('🔍 [CashContext] closeCash: Resposta da API:', response);
      // Tratar sucesso baseado no campo success, independentemente do status retornado
      if (response.success) {
        console.log('✅ [CashContext] closeCash: Caixa fechado com sucesso');
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
    console.log('🔍 [CashContext] updateInitialValue: Atualizando valor inicial, ID:', cashId, 'Valor:', initialValue);
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cashApi.updateInitialValue(cashId, initialValue);
      console.log('🔍 [CashContext] updateInitialValue: Resposta da API:', response);

      if (response.success) {
        console.log('✅ [CashContext] updateInitialValue: Valor inicial atualizado com sucesso');
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
      console.log('🔍 [CashContext] useEffect: Usuário autenticado, buscando status do caixa');
      fetchCashStatus();
    } else {
      console.log('🔍 [CashContext] useEffect: Usuário não autenticado, limpando dados do caixa');
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
