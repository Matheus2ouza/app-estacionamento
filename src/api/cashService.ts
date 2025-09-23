import { cashResponse, detailsResponse, generalDetailsResponse, historyCashResponse, ListCashHistoryAllResponse } from "../types/cashTypes/cash";
import axiosInstance from "./axiosInstance";

export const cashApi = {
  statusCash: async (): Promise<cashResponse> => {
    const response = await axiosInstance.get("/cash/status");
    return response.data;
  },

  openCash: async (initialValue: number): Promise<cashResponse> => {
    const response = await axiosInstance.post("/cash/open", {initialValue});
    return response.data
  },
  
  reOpenCash: async (cashId: string): Promise<cashResponse> => {
    const response = await axiosInstance.post(`/cash/${cashId}/reopen`);
    return response.data;
  },

  closeCash: async (cashId: string ): Promise<cashResponse> => {
    const response = await axiosInstance.post(`/cash/${cashId}/close`);
    return response.data
  },

  updateInitialValue: async (cashId: string, initialValue: number): Promise<cashResponse> => {
    const response = await axiosInstance.put(`/cash/${cashId}`, { initialValue });
    return response.data;
  },

  detailsCash: async (cashId: string): Promise<detailsResponse> => {
    const response = await axiosInstance.get(`/cash/${cashId}/data`);
    return response.data;
  },

  historyCash: async (cashId: string): Promise<historyCashResponse> => {
    const response = await axiosInstance.get(`/cash/${cashId}/history`);
    return response.data;
  },

  generalHistoryCash: async (limit: number = 5, cursor?: string): Promise<any> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) {
      params.append('cursor', cursor);
    }
    
    const response = await axiosInstance.get(`/cash/history?${params.toString()}`);
    return response.data;
  },

  generalHistoryCashPhoto: async (transactionId: string, type: 'vehicle' | 'product'): Promise<any> => {
    const response = await axiosInstance.get(`/cash/history/${transactionId}/photo?type=${type}`);
    return response.data;
  },

  generalDetailsCash: async (cashId: string): Promise<generalDetailsResponse> => {
    const response = await axiosInstance.get(`/cash/${cashId}/general`);
    return response.data;
  },

  deleteTransaction: async (
    cashId: string, 
    transactionId: string, 
    type: 'vehicle' | 'product' | 'expense', 
    permanent?: boolean
  ): Promise<any> => {
    const params = new URLSearchParams();
    params.append('type', type);
    if (permanent !== undefined) {
      params.append('permanent', permanent.toString());
    }
    
    const response = await axiosInstance.delete(`/cash/${cashId}/${transactionId}?${params.toString()}`);
    return response.data;
  },

  listCashHistory: async(limit: number = 5, cursor?: string): Promise<ListCashHistoryAllResponse> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await axiosInstance.get(`/cash/history-all?${params.toString()}`);
    return response.data
  }
};
