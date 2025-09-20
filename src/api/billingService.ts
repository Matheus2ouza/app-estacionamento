import { BillingMethod, BillingMethodListResponse, BillingMethodResponse } from "@/types/billingMethodTypes/billingMethod";
import axiosInstance from "./axiosInstance";


export const billingApi = {
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