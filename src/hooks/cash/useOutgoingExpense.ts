import { registerExpense, ResponseOutgoing } from "@/src/types/cash";
import { cashApi } from "@/src/api/cashService";
import { CashStatus } from "@/src/types/cash";

export const useOutgoingExpense = () => {
  const getExpenses = async (): Promise<ResponseOutgoing & { cashStatus?: CashStatus }> => {
    console.log("====== [useOutgoingExpense] getExpenses: INICIADO ======");

    try {
      console.log("[useOutgoingExpense] Buscando status do caixa...");
      const cashStatus = await cashApi.statusCash();
      console.log("[useOutgoingExpense] Status do caixa recebido:", JSON.stringify(cashStatus));

      const caixaId = cashStatus?.cash?.id;
      const caixaStatus = cashStatus?.cash?.status;

      if (!caixaId || caixaStatus !== "OPEN") {
        const message =
          caixaStatus === "CLOSED"
            ? "Nenhum caixa aberto encontrado"
            : "Caixa não encontrado";

        console.warn("[useOutgoingExpense] Caixa inválido:", message);

        return {
          success: false,
          message,
          data: [],
          cashStatus,
        };
      }

      console.log(`[useOutgoingExpense] Buscando despesas para o caixa ID ${caixaId}...`);
      const response = await cashApi.outgoing(caixaId);

      console.log("[useOutgoingExpense] Resposta da API de despesas:", {
        success: response.success,
        message: response.message,
        dataCount: response.data?.length,
      });

      return {
        success: response.success,
        message: response.message || "",
        data: response.data || [],
        cashStatus,
      };
    } catch (error) {
      console.error("[useOutgoingExpense] ERRO na busca de despesas:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido",
        data: [],
      };
    } finally {
      console.log("====== [useOutgoingExpense] getExpenses: FINALIZADO ======");
    }
  };

  const registerExpense = async (data: registerExpense) => {
    console.log("[registerExpense] Registrando nova despesa:", data);

    try {
      const amount = parseFloat(data.amount.toString().replace(",", "."));

      console.log("[registerExpense] Enviando para API com amount:", amount);
      const response = await cashApi.registerExpense({
        description: data.description,
        amount,
        method: data.method,
        openCashId: data.openCashId,
      });

      console.log("[registerExpense] Resposta da API:", {
        success: response.success,
        message: response.message,
        data: response.data,
      });

      return {
        success: response.success,
        message: response.message || "Despesa registrada com sucesso",
        data: response.data || null,
      };
    } catch (error) {
      console.error("[registerExpense] ERRO ao registrar despesa:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao registrar despesa",
        data: null,
      };
    }
  };

  return { getExpenses, registerExpense, };
};
