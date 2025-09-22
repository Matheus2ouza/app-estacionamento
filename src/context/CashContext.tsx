import { cashApi } from "@/api/cashService";
import { ParkingApi } from "@/api/parkingService";
import { useAuth } from "@/context/AuthContext";
import { cash, CashData } from "@/types/cashTypes/cash";
import { CapacityParkingResponse } from "@/types/parkingTypes/parking";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type CashStatus = "not_created" | "open" | "closed";

interface CashContextType {
  // Estados do caixa
  loading: boolean;
  error: string | null;
  success: boolean;
  cashStatus: CashStatus;
  cashData: cash | null;
  cashDetails: CashData | null;
  parkingDetails: CapacityParkingResponse | null;

  // Função central de status
  updateCashStatus: () => Promise<void>;

  // Funções de dados
  fetchCashDetails: (cashId?: string) => Promise<CashData | null>;
  fetchParkingDetails: (
    cashId?: string,
  ) => Promise<CapacityParkingResponse | null>;

  // Funções de controle do caixa
  openCash: (initialValue: number) => Promise<{ success: boolean; message: string; cashId?: string }>;
  closeCash: (cashId?: string) => Promise<{ success: boolean; message: string }>;
  reopenCash: (cashId?: string) => Promise<{ success: boolean; message: string; cashId?: string }>;
  updateInitialValue: (cashId: string, initialValue: number) => Promise<{ success: boolean; message: string }>;
}

const CashContext = createContext<CashContextType | undefined>(undefined);

interface CashProviderProps {
  children: ReactNode;
}

export function CashProvider({ children }: CashProviderProps) {
  const { isAuthenticated, role } = useAuth();

  // Estados do caixa
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [cashStatus, setCashStatus] = useState<CashStatus>("not_created");
  const [cashData, setCashData] = useState<cash | null>(null);
  const [cashDetails, setCashDetails] = useState<CashData | null>(null);
  const [parkingDetails, setParkingDetails] =
    useState<CapacityParkingResponse | null>(null);

  // Logs para monitorar mudanças de estado
  useEffect(() => {
    console.log("🔍 [CashContext] Estado cashStatus mudou para:", cashStatus);
  }, [cashStatus]);

  useEffect(() => {
    console.log(
      "🔍 [CashContext] Estado cashData mudou:",
      cashData ? `ID: ${cashData.id}, Status: ${cashData.status}` : "null",
    );
  }, [cashData]);

  useEffect(() => {
    console.log(
      "🔍 [CashContext] Estado cashDetails mudou:",
      cashDetails ? "dados carregados" : "null",
    );
  }, [cashDetails]);

  useEffect(() => {
    console.log(
      "🔍 [CashContext] Estado parkingDetails mudou:",
      parkingDetails ? "dados carregados" : "null",
    );
  }, [parkingDetails]);

  // Função central que sempre busca o status do caixa
  const updateCashStatus = async (): Promise<void> => {
    console.log(
      "🔍 [CashContext] updateCashStatus: Atualizando status do caixa",
    );
    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.statusCash();
      console.log(
        "🔍 [CashContext] updateCashStatus: Resposta da API:",
        response,
      );

      if (!response.success || !response.cash) {
        console.log(
          "❌ [CashContext] updateCashStatus: Nenhum caixa encontrado",
        );
        setCashStatus("not_created");
        setCashData(null);
        setCashDetails(null);
        setParkingDetails(null);
        return;
      }

      const cash = response.cash;
      console.log(
        "🔍 [CashContext] updateCashStatus: Caixa encontrado, status:",
        cash.status,
        "ID:",
        cash.id,
      );

      setCashData(cash);

      if (cash.status === "OPEN") {
        setCashStatus("open");
        setSuccess(true);
        console.log("✅ [CashContext] updateCashStatus: Caixa aberto");
      } else {
        setCashStatus("closed");
        setParkingDetails(null); // Limpar dados do estacionamento quando fechado
        console.log("🔒 [CashContext] updateCashStatus: Caixa fechado");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao buscar status do caixa";
      console.error(
        "❌ [CashContext] updateCashStatus: Erro:",
        errorMessage,
        err,
      );
      setError(errorMessage);
      setCashStatus("not_created");
      setCashData(null);
      setCashDetails(null);
      setParkingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar detalhes do caixa
  const fetchCashDetails = async (
    cashId?: string,
  ): Promise<CashData | null> => {
    const idToUse = cashId || cashData?.id;
    console.log(
      "🔍 [CashContext] fetchCashDetails: Buscando detalhes do caixa para ID:",
      idToUse,
    );

    if (!idToUse) {
      console.log(
        "❌ [CashContext] fetchCashDetails: ID do caixa não disponível",
      );
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.detailsCash(idToUse);
      console.log(
        "🔍 [CashContext] fetchCashDetails: Resposta da API:",
        response,
      );

      if (response.success && response.data) {
        setCashDetails(response.data);
        setSuccess(true);
        console.log(
          "✅ [CashContext] fetchCashDetails: Detalhes do caixa atualizados",
        );
        return response.data;
      } else {
        const errorMsg = response.message || "Erro ao buscar detalhes do caixa";
        console.error(
          "❌ [CashContext] fetchCashDetails: Erro na resposta:",
          errorMsg,
        );
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao buscar detalhes do caixa";
      console.error(
        "❌ [CashContext] fetchCashDetails: Erro:",
        errorMessage,
        err,
      );
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar detalhes do estacionamento
  const fetchParkingDetails = async (
    cashId?: string,
  ): Promise<CapacityParkingResponse | null> => {
    const idToUse = cashId || cashData?.id;
    console.log(
      "🔍 [CashContext] fetchParkingDetails: Buscando dados do estacionamento para ID:",
      idToUse,
    );

    if (!idToUse) {
      console.log(
        "❌ [CashContext] fetchParkingDetails: ID do caixa não disponível",
      );
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response: CapacityParkingResponse =
        await ParkingApi.getCapacityParking(idToUse);
      console.log(
        "🔍 [CashContext] fetchParkingDetails: Resposta da API:",
        response,
      );

      if (response.success && response.data) {
        setParkingDetails(response);
        setSuccess(true);
        console.log(
          "✅ [CashContext] fetchParkingDetails: Dados do estacionamento atualizados",
        );
        return response;
      } else {
        const errorMsg =
          response.message || "Erro ao buscar detalhes do estacionamento";
        console.error(
          "❌ [CashContext] fetchParkingDetails: Erro na resposta:",
          errorMsg,
        );
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao buscar detalhes do estacionamento";
      console.error(
        "❌ [CashContext] fetchParkingDetails: Erro:",
        errorMessage,
        err,
      );
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir caixa
  const openCash = async (initialValue: number): Promise<{ success: boolean; message: string; cashId?: string }> => {
    console.log("🔍 [CashContext] openCash: Abrindo caixa com valor inicial:", initialValue);
    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.openCash(initialValue);
      console.log("🔍 [CashContext] openCash: Resposta da API:", response);

      if (response.success && response.cash) {
        setCashData(response.cash);
        setCashStatus("open");
        setSuccess(true);
        console.log("✅ [CashContext] openCash: Caixa aberto com sucesso");
        return { 
          success: true, 
          message: response.message || "Caixa aberto com sucesso",
          cashId: response.cash.id
        };
      } else {
        const errorMsg = response.message || "Erro ao abrir caixa";
        console.error("❌ [CashContext] openCash: Erro na resposta:", errorMsg);
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao abrir caixa";
      console.error("❌ [CashContext] openCash: Erro:", errorMessage, err);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar caixa
  const closeCash = async (cashId?: string): Promise<{ success: boolean; message: string }> => {
    const idToUse = cashId || cashData?.id;
    console.log("🔍 [CashContext] closeCash: Fechando caixa com ID:", idToUse);
    
    if (!idToUse) {
      const errorMsg = "ID do caixa não disponível";
      console.error("❌ [CashContext] closeCash:", errorMsg);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.closeCash(idToUse);
      console.log("🔍 [CashContext] closeCash: Resposta da API:", response);

      if (response.success) {
        setCashStatus("closed");
        setSuccess(true);
        console.log("✅ [CashContext] closeCash: Caixa fechado com sucesso");
        return { success: true, message: response.message || "Caixa fechado com sucesso" };
      } else {
        const errorMsg = response.message || "Erro ao fechar caixa";
        console.error("❌ [CashContext] closeCash: Erro na resposta:", errorMsg);
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fechar caixa";
      console.error("❌ [CashContext] closeCash: Erro:", errorMessage, err);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para reabrir caixa
  const reopenCash = async (cashId?: string): Promise<{ success: boolean; message: string; cashId?: string }> => {
    const idToUse = cashId || cashData?.id;
    console.log("🔍 [CashContext] reopenCash: Reabrindo caixa com ID:", idToUse);
    
    if (!idToUse) {
      const errorMsg = "ID do caixa não disponível";
      console.error("❌ [CashContext] reopenCash:", errorMsg);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.reOpenCash(idToUse);
      console.log("🔍 [CashContext] reopenCash: Resposta da API:", response);

      if (response.success && response.cash) {
        setCashData(response.cash);
        setCashStatus("open");
        setSuccess(true);
        console.log("✅ [CashContext] reopenCash: Caixa reaberto com sucesso");
        return { 
          success: true, 
          message: response.message || "Caixa reaberto com sucesso",
          cashId: response.cash.id
        };
      } else {
        const errorMsg = response.message || "Erro ao reabrir caixa";
        console.error("❌ [CashContext] reopenCash: Erro na resposta:", errorMsg);
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao reabrir caixa";
      console.error("❌ [CashContext] reopenCash: Erro:", errorMessage, err);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar valor inicial
  const updateInitialValue = async (cashId: string, initialValue: number): Promise<{ success: boolean; message: string }> => {
    console.log("🔍 [CashContext] updateInitialValue: Atualizando valor inicial:", initialValue, "para caixa:", cashId);
    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.updateInitialValue(cashId, initialValue);
      console.log("🔍 [CashContext] updateInitialValue: Resposta da API:", response);

      if (response.success) {
        setSuccess(true);
        console.log("✅ [CashContext] updateInitialValue: Valor inicial atualizado com sucesso");
        return { success: true, message: response.message || "Valor inicial atualizado com sucesso" };
      } else {
        const errorMsg = response.message || "Erro ao atualizar valor inicial";
        console.error("❌ [CashContext] updateInitialValue: Erro na resposta:", errorMsg);
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar valor inicial";
      console.error("❌ [CashContext] updateInitialValue: Erro:", errorMessage, err);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar status do caixa quando o usuário fizer login
  useEffect(() => {
    console.log(
      "🔍 [CashContext] useEffect isAuthenticated: Mudança na autenticação:",
      isAuthenticated,
    );

    if (isAuthenticated) {
      console.log(
        "✅ [CashContext] useEffect isAuthenticated: Usuário autenticado, buscando status do caixa",
      );
      updateCashStatus();
    } else {
      console.log(
        "❌ [CashContext] useEffect isAuthenticated: Usuário não autenticado, limpando dados",
      );
      // Limpar dados quando não autenticado
      setCashStatus("not_created");
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

    // Função central de status
    updateCashStatus,

    // Funções de dados
    fetchCashDetails,
    fetchParkingDetails,

    // Funções de controle do caixa
    openCash,
    closeCash,
    reopenCash,
    updateInitialValue,
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
    throw new Error("useCashContext deve ser usado dentro de um CashProvider");
  }

  return context;
}
