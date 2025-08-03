import { registerExpense, ResponseOutgoing } from "@/src/types/cash";
import { cashApi } from "@/src/api/cashService";
import { CashStatus } from "@/src/types/cash";

export const useOutgoingExpense = () => {
  const getExpenses = async (): Promise<ResponseOutgoing & { cashStatus?: CashStatus }> => {
    try {
      const cashStatus = await cashApi.statusCash();

      const caixaId = cashStatus?.cash?.id;
      const caixaStatus = cashStatus?.cash?.status;

      if (!caixaId || caixaStatus !== "OPEN") {
        const message =
          caixaStatus === "CLOSED"
            ? "Nenhum caixa aberto encontrado"
            : "Caixa não encontrado";

        return {
          success: false,
          message,
          data: [],
          cashStatus,
        };
      }

      const response = await cashApi.outgoing(caixaId);

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
    }
  };

  const registerExpense = async (data: registerExpense) => {
    try {
      const amount = parseFloat(data.amount.toString().replace(",", "."));

      const response = await cashApi.registerExpense({
        description: data.description,
        amount,
        method: data.method,
        openCashId: data.openCashId,
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

  return { getExpenses, registerExpense };
};
