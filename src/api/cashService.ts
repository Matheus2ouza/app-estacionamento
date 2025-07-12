import axiosInstance from "./axiosInstance";

export const cashApi = {
  statusCash: async (): Promise<{ success: boolean; isOpen: boolean }> => {
    const response = await axiosInstance.get("/cash/status");
    return response.data;
  },

  openCash: async (initialValue: number): Promise<{ success: boolean; isOpen: boolean, message: string }> => {
    const response = await axiosInstance.post("/cash/open-cash", {initialValue});
    return response.data
  }
};
