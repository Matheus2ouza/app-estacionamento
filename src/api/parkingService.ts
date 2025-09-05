import { ConfigurationsSetupVacancies, dataParking } from "../types/parking";
import axiosInstance from "./axiosInstance";

export const ParkingApi = {
  configParking: async (data: dataParking): Promise<ConfigurationsSetupVacancies> => {
    const response = await axiosInstance.post('/parking/config', data);
    return response.data
  },
  getConfigParking: async (): Promise<ConfigurationsSetupVacancies> => {
    const response = await axiosInstance.get('/parking/config')
    return response.data
  }
}