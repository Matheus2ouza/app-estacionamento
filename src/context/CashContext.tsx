import { CashStatus, useCash } from '@/src/hooks/cash/useCash';
import { cash } from '@/src/types/cashTypes/cash';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';

interface CashContextType {
  loading: boolean;
  error: string | null;
  success: boolean;
  cashStatus: CashStatus;
  cashData: cash | null;
  fetchStatus: () => Promise<CashStatus>;
  openCash: (initialValue: number) => Promise<[boolean, string]>;
  reOpenCash: (cashId: string) => Promise<[boolean, string]>;
  closeCash: (cashId: string, finalValue: number) => Promise<[boolean, string]>;
  detailsParking: (cashId: string) => Promise<any>;
  refreshCashStatus: () => Promise<CashStatus>;
  clearError: () => void;
  clearSuccess: () => void;
}

const CashContext = createContext<CashContextType | undefined>(undefined);

interface CashProviderProps {
  children: ReactNode;
}

export function CashProvider({ children }: CashProviderProps) {
  const cashHook = useCash();

  // Buscar status do caixa quando o contexto for montado
  useEffect(() => {
    cashHook.fetchStatus();
  }, []);

  const cashContextValue: CashContextType = {
    ...cashHook,
    cashData: cashHook.cashData ?? null,
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
