import { BillingMethod, BillingMethodListResponse, BillingMethodResponse } from "../types/billingMethodTypes/billingMethod";
import { cashResponse, detailsResponse } from "../types/cashTypes/cash";
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
    const response = await axiosInstance.post(`/cash/reopen-cash/${cashId}`);
    return response.data;
  },

  closeCash: async (cashId: string, finalValue: number): Promise<cashResponse> => {
    const response = await axiosInstance.post(`/cash/${cashId}/close`, finalValue);
    return response.data
  },

  detailsCash: async (cashId: string): Promise<detailsResponse> => {
    const response = await axiosInstance.get(`/cash/${cashId}/data`);
    return response.data;
  },

  billingSave: async (data: BillingMethod): Promise<BillingMethodResponse> => {
    const response = await axiosInstance.post('/cash/billing-method', data);
    return response.data;
  },

  billingGetMethods: async (): Promise<BillingMethodListResponse> => {
    const response = await axiosInstance.get('/cash/billing-method');
    return response.data;
  },

  billingDelete: async (id: string): Promise<BillingMethodResponse> => {
    const response = await axiosInstance.delete(`/cash/billing-method/${id}`);
    return response.data;
  },

  billingActivate: async (id: string): Promise<BillingMethodResponse> => {
    const response = await axiosInstance.patch(`/cash/billing-method/${id}`);
    return response.data;
  },

  billingUpdate: async (data: BillingMethod & { id: string }): Promise<BillingMethodResponse> => {
    const { id, ...updateData } = data;
    const response = await axiosInstance.put(`/cash/billing-method/${id}`, updateData);
    return response.data;
  },

  billingUpdatePut: async (data: BillingMethod & { id: string }): Promise<BillingMethodResponse> => {
    const { id, ...updateData } = data;
    const response = await axiosInstance.put(`/cash/billing-method/${id}`, updateData);
    return response.data;
  },
};
