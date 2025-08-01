import {
  ResponseCashHome,
  CashStatus,
  ResponseGeralCashData,
  PaymentConfigApiPayload,
  ResponseOutgoing,
  registerExpense
} from "@/src/types/cash";
import {
  BillingMethodsResponse,
  ActiveBillingMethodApiResponse,
  SavePaymentResponse
} from "@/src/types/payment";
import axiosInstance from "./axiosInstance";

export const cashApi = {
  statusCash: async (): Promise<CashStatus> => {
    const response = await axiosInstance.get("/cash/status");
    return response.data;
  },

  openCash: async (initialValue: number): Promise<CashStatus> => {
    const response = await axiosInstance.post("/cash/open-cash", {
      initialValue,
    });
    return response.data;
  },

  closeCash: async (id: string, finalValue: number): Promise<CashStatus> => {
    const response = await axiosInstance.post(`/cash/close-cash/${id}`, {
      finalValue,
    });
    return response.data;
  },

  geralCashData: async (id: string): Promise<ResponseGeralCashData> => {
    const response = await axiosInstance.get(`/cash/general-cash-data/${id}`);
    return response.data;
  },

  dataCashHome: async (id: string): Promise<ResponseCashHome> => {
    const response = await axiosInstance.get(`/cash/cash-data/${id}`);
    return response.data;
  },

  /**
   * Obtém todos os métodos de cobrança com suas regras
   */
  getBillingMethods: async (): Promise<BillingMethodsResponse> => {
    const response = await axiosInstance.get("/vehicles/billing-method");
    return response.data;
  },

  /**
   * Obtém o método de cobrança ativo com suas regras
   */
  getBillingMethodsActive: async (): Promise<ActiveBillingMethodApiResponse> => {
    const response = await axiosInstance.get("/vehicles/billing-method-active");
    return response.data;
  },

  /**
   * Salva a configuração de pagamento
   */
  methodSave: async (payload: PaymentConfigApiPayload) => {
    const response = await axiosInstance.post('/vehicles/save-payment-config', payload);
    return response.data;
  },

  /**
   * Obtém os dados das despezas
   */
  outgoing: async(id: string): Promise<ResponseOutgoing> => {
    const response = await axiosInstance.get(`/cash/outgoing-expense/${id}`)
    return response.data
  },

  /**
   * Registra as despezas
   */
  registerExpense: async(data: registerExpense): Promise<ResponseOutgoing> => {
    const response = await axiosInstance.post(`/cash/outgoing-expense-register`, data);
    return response.data
  }
};
