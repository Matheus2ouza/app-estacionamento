import React, { createContext, useContext, useState, useEffect } from "react";
import { cashApi } from "@/src/api/cashService";

// Tipo refletindo exatamente o enum do backend + estado especial frontend
type CashStatusState = "OPEN" | "CLOSED" | "NOT_CREATED" | null;

type CashContextType = {
  openCashId: string | null;
  cashStatus: CashStatusState;
  getStatusCash: () => Promise<void>;
  openCash: (
    initialValue: number
  ) => Promise<{ success: boolean; message: string }>;
  closeCash: (
    id: string,
    finalValue: number
  ) => Promise<{ success: boolean; message: string }>;
  reopenCash: (
    cashId: string,
  ) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  error: string | null;
};

const CashContext = createContext<CashContextType | undefined>(undefined);

export const CashProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openCashId, setOpenCashId] = useState<string | null>(null);
  const [cashStatus, setCashStatus] = useState<CashStatusState>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusCash = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.statusCash();

      console.log("[CashContext] Status do caixa:", response);
      // Caixa encontrado - fazemos type guard para garantir que o status é válido
      if (response.success && response.cash) {
        setOpenCashId(response.cash.id);

        // Validação segura do status
        if (
          response.cash.status === "OPEN" ||
          response.cash.status === "CLOSED"
        ) {
          setCashStatus(response.cash.status);
        } else {
          console.warn(`Status inesperado do caixa: ${response.cash.status}`);
          setCashStatus(null);
          setError("Status do caixa inválido");
        }
      }
      // Caixa não encontrado (404)
      else if (response.status === 404) {
        setCashStatus("NOT_CREATED");
        setOpenCashId(null);
      }
      // Outros erros
      else {
        setError(response.message || "Erro ao verificar status do caixa");
      }
    } catch (err: any) {
      console.error("[CashContext] Erro ao buscar status:", err);

      if (err.response?.status === 404) {
        setCashStatus("NOT_CREATED");
        setOpenCashId(null);
      } else {
        setError("Falha na conexão com o servidor");
      }
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
      const response = await cashApi.openCash(initialValue);

      if (response.success && response.cash) {
        setOpenCashId(response.cash.id);
        setCashStatus("OPEN");
        return {
          success: true,
          message: "Caixa aberto com sucesso.",
        };
      } else {
        return {
          success: false,
          message: response.message || "Não foi possível abrir o caixa.",
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
        message: "O valor final deve ser maior que zero",
      };
    }

    setLoading(true);
    try {
      const response = await cashApi.closeCash(id, finalValue);

      if (response.success) {
        setCashStatus("CLOSED");
        return {
          success: true,
          message: response.message || "Caixa fechado com sucesso",
        };
      } else {
        return {
          success: false,
          message: response.message || "Não foi possível fechar o caixa",
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
      console.log("CHAMANDO O REOPEN CASH")

      const response = await cashApi.reopenCash(cashId);

      if (response.success && response.cash) {
        setOpenCashId(response.cash.id);
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
    throw new Error("useCash must be used within a CashProvider");
  }
  return context;
};
