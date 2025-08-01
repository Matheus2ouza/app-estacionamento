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
        console.log("[useCashService] Usando cache local");
        setOpenCashId(localStatus.cash.id);
        setCashStatus(localStatus.cash.status);
        return { status: localStatus.cash.status, cashId: localStatus.cash.id };
      }

      console.log("[useCashService] Buscando status do caixa via API...");
      const response = await cashApi.statusCash();

      if (response.success && response.cash) {
        await saveCashStatus(response.cash);
        setOpenCashId(response.cash.id);
        setCashStatus(response.cash.status);
        console.log("[useCashService] Caixa aberto com ID:", response.cash.id);
        console.log(
          `[useCashStatus] Caixa aberto com status: ${response.cash.status}`
        );
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
      console.log(id);
      console.log(finalValue);
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

  return {
    getStatusCash,
    openCash,
    closeCash,
    openCashId,
    cashStatus,
  };
};

export default useCashService;
