import { cashApi } from "@/src/api/cashService";
import {
  clearCashStatus,
  getCashStatus,
  saveCashStatus,
  updateCashStatus,
} from "@/src/context/cashStorage";
import { useState } from "react";

const useCashService = () => {
  const [openCashId, setOpenCashId] = useState<string | null>(null);
  const [cashStatus, setCashStatus] = useState<string | null>("OPEN");

  const getStatusCash = async (): Promise<{
    status: string | null;
    cashId: string | null;
  }> => {
    clearCashStatus();
    try {
      const localStatus = await getCashStatus();

      if (localStatus?.cash) {
        setOpenCashId(localStatus.cash.id);
        setCashStatus(localStatus.cash.status);
        return { status: localStatus.cash.status, cashId: localStatus.cash.id };
      }

      const response = await cashApi.statusCash();

      if (response.success && response.cash) {
        await saveCashStatus(response.cash);
        setOpenCashId(response.cash.id);
        setCashStatus(response.cash.status);

        return { status: response.cash.status, cashId: response.cash.id };
      }

      return { status: null, cashId: null };
    } catch (err: any) {
      console.error("[useCashService] Erro ao buscar status do caixa:", err);
      setOpenCashId(null);
      await clearCashStatus();
      return { status: null, cashId: null };
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
      console.error("[useCashService] Erro ao abrir caixa:", err);
      return {
        success: false,
        message: "Erro ao tentar abrir o caixa.",
      };
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
    }
  };

  const reopenCash = async (
    cashId: string
  ): Promise<{ success: boolean; message: string }> => {
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
      console.error("[useCashService] Erro ao reabrir caixa:", err);
      return {
        success: false,
        message: "Erro ao tentar reabrir o caixa.",
      };
    }
  };

  return {
    getStatusCash,
    openCash,
    closeCash,
    reopenCash,
    openCashId,
    cashStatus,
  };
};

export default useCashService;
