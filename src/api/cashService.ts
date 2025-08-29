import { cashResponse, detailsResponse } from "../types/cash";
import axiosInstance from "./axiosInstance";

export const cashApi = {
  statusCash: async (): Promise<cashResponse> => {
    const response = await axiosInstance.get("/cash/status");
    return response.data;
  },

  openCash: async (initialValue: number): Promise<cashResponse> => {
    const response = await axiosInstance.post("/cash/open-cash", {initialValue});
    return response.data
  },
  
  reOpenCash: async (cashId: string): Promise<cashResponse> => {
    const response = await axiosInstance.post(`/cash/reopen-cash/${cashId}`);
    return response.data;
  },

  closeCash: async (cashId: string, finalValue: number): Promise<cashResponse> => {
    const response = await axiosInstance.post(`/cash/close-cash/${cashId}`, finalValue);
    return response.data
  },

  detailsCash: async (cashId: string): Promise<detailsResponse> => {
    const response = await axiosInstance.get(`/cash/cash-data/${cashId}`);
    return response.data;
  }
};
