// src/context/CashContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { cashApi } from '@/src/api/cashService';
import { clearCashStatus, getCashStatus, saveCashStatus, updateCashStatus } from './cashStorage';

type CashContextType = {
  openCashId: string | null;
  cashStatus: string | null;
  getStatusCash: () => Promise<void>;
  openCash: (initialValue: number) => Promise<{ success: boolean; message: string }>;
  closeCash: (id: string, finalValue: number) => Promise<{ success: boolean; message: string }>;
  reopenCash: (cashId: string) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  error: string | null;
};

const CashContext = createContext<CashContextType | undefined>(undefined);

export const CashProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [openCashId, setOpenCashId] = useState<string | null>(null);
  const [cashStatus, setCashStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusCash = async (): Promise<void> => {
    setLoading(true);
    try {
      const localStatus = await getCashStatus();
      
      if (localStatus?.cash) {
        setOpenCashId(localStatus.cash.id);
        setCashStatus(localStatus.cash.status);
        return;
      }

      const response = await cashApi.statusCash();

      if (response.success && response.cash) {
        await saveCashStatus(response.cash);
        setOpenCashId(response.cash.id);
        setCashStatus(response.cash.status);
      }
    } catch (err: any) {
      console.error("[CashContext] Erro ao buscar status do caixa:", err);
      setError("Erro ao buscar status do caixa");
      setOpenCashId(null);
      await clearCashStatus();
    } finally {
      setLoading(false);
    }
  };

  const openCash = async (
    initialValue: number
  ): Promise<{ success: boolean; message: string }> => {
    if (initialValue <= 0) {
      return {
        success: false,
        message: "O valor inicial do caixa deve ser maior que zero.",
      };
    }

    setLoading(true);
    try {
      const cash = await cashApi.openCash(initialValue);

      if (cash.success && cash.cash) {
        setOpenCashId(cash.cash.id);
        await saveCashStatus(cash.cash);
        return {
          success: true,
          message: "Caixa aberto com sucesso.",
        };
      } else {
        return {
          success: false,
          message: cash.message || "Não foi possível abrir o caixa.",
        };
      }
    } catch (err) {
      console.error("[CashContext] Erro ao abrir caixa:", err);
      return {
        success: false,
        message: "Erro ao tentar abrir o caixa.",
      };
    } finally {
      setLoading(false);
    }
  };

  const closeCash = async (
    id: string,
    finalValue: number
  ): Promise<{ success: boolean; message: string }> => {
    if (finalValue <= 0) {
      return {
        success: false,
        message: "O valor final tem que ser um numero maior que zero",
      };
    }

    setLoading(true);
    try {
      const response = await cashApi.closeCash(id, finalValue);

      if (response.success) {
        await updateCashStatus("CLOSED");
        return {
          success: true,
          message: response.message || "Caixa fechado com sucesso",
        };
      } else {
        return {
          success: false,
          message: response.message || "Não foi possivel fechar o caixa",
        };
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erro ao tentar fechar o caixa";

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  const reopenCash = async (
    cashId: string
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const response = await cashApi.reopenCash(cashId);

      if (response.success && response.cash) {
        setOpenCashId(response.cash.id);
        await saveCashStatus(response.cash);
        setCashStatus("OPEN");
        return {
          success: true,
          message: response.message || "Caixa reaberto com sucesso.",
        };
      } else {
        return {
          success: false,
          message: response.message || "Não foi possível reabrir o caixa.",
        };
      }
    } catch (err) {
      console.error("[CashContext] Erro ao reabrir caixa:", err);
      return {
        success: false,
        message: "Erro ao tentar reabrir o caixa.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Carrega o status do caixa quando o provider é montado
  useEffect(() => {
    getStatusCash();
  }, []);

  return (
    <CashContext.Provider
      value={{
        openCashId,
        cashStatus,
        getStatusCash,
        openCash,
        closeCash,
        reopenCash,
        loading,
        error,
      }}
    >
      {children}
    </CashContext.Provider>
  );
};

export const useCash = (): CashContextType => {
  const context = useContext(CashContext);
  if (!context) {
    throw new Error('useCash must be used within a CashProvider');
  }
  return context;
};