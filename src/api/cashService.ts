import { ResponseCashHome, CashStatus, ResponseGeralCashData, BillingMethodWithRules, ActiveBillingRuleWithMethod } from '@/src/types/cash';
import axiosInstance from "./axiosInstance";

export const cashApi = {
  statusCash: async (): Promise<CashStatus> => {
    const response = await axiosInstance.get("/cash/status");
    return response.data;
  },

  openCash: async (initialValue: number): Promise<CashStatus> => {
    const response = await axiosInstance.post("/cash/open-cash", {initialValue});
    return response.data
  },

  closeCash: async (id: string, finalValue: number): Promise<CashStatus> => {
    const response = await axiosInstance.post(`/cash/close-cash/${id}`, {finalValue});
    return response.data
  },

  geralCashData: async (id: string): Promise<ResponseGeralCashData> => {
    const response = await axiosInstance.get(`/cash/general-cash-data/${id}`);
    return response.data
  },

  dataCashHome: async (id: string): Promise<ResponseCashHome> => {
    const response = await axiosInstance.get(`/cash/cash-data/${id}`);
    return response.data
  },

    // Retorna todos os métodos de cobrança com suas regras
  getBillingMethods: async (): Promise<{ success: boolean; methods: BillingMethodWithRules[] }> => {
    const response = await axiosInstance.get("/cash/billing-method");
    return response.data;
  },

  // Retorna somente as regras ativas com os métodos
  getBillingMethodsActive: async (): Promise<{ success: boolean; data: ActiveBillingRuleWithMethod[] }> => {
    const response = await axiosInstance.get("/cash/billing-method-active");
    return response.data;
  }
};