import axiosInstance from "./axiosInstance";
import {
  GoalConfig,
  ResponseGoalConfig,
  ResponseHistoric,
  ResponseSecondCopy,
  ResponseDetailsCash,
} from "../types/dashboard";


export const dashboardApi = {
  history: async (
    filter: "day" | "week" | "month" = "day"
  ): Promise<ResponseHistoric> => {
    const response = await axiosInstance.get("/dashboard/historic", {
      params: { filter },
    });
    return response.data;
  },

  historyByCash: async (id: string): Promise<ResponseHistoric> => {
    const response = await axiosInstance.get(
      `/dashboard/historic-by-cash/${id}`
    );
    return response.data;
  },

  secondCopy: async (
    type: "product" | "vehicle",
    id: string
  ): Promise<ResponseSecondCopy> => {
    const response = await axiosInstance.get(`/dashboard/second-copy/${id}`, {
      params: { type },
    });
    return response.data;
  },

  photoProof: async (
    type: "product" | "vehicle",
    id: string
  ): Promise<ResponseSecondCopy> => {
    const response = await axiosInstance.get(`/dashboard/photo-proof/${id}`, {
      params: { type },
    });
    return response.data;
  },

  GoalConfig: async (): Promise<ResponseGoalConfig> => {
    const response = await axiosInstance.get(`/dashboard/goalConfig`);
    return response.data;
  },

  saveGoalConfig: async (data: GoalConfig): Promise<ResponseGoalConfig> => {
    const response = await axiosInstance.post(
      `/dashboard/saveGoalConfig`,
      data
    );
    return response.data;
  },

  geralDetailsCash: async (id: string): Promise<ResponseDetailsCash> => {
    const response = await axiosInstance.get(
      `/dashboard/general-details/${id}`
    );
    return response.data;
  },
};
