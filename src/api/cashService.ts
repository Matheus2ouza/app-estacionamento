import { CashStatus, ResponseGeralCashData } from "../types/cash";
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
  }
};