import { CapacityParkingResponse, ConfigurationsSetupVacancies, dataParking, VehiclesResponse } from "../types/parking";
import axiosInstance from "./axiosInstance";

export const ParkingApi = {
  configParking: async (data: dataParking): Promise<ConfigurationsSetupVacancies> => {
    const response = await axiosInstance.post('/parking/config', data);
    return response.data
  },
  getConfigParking: async (): Promise<ConfigurationsSetupVacancies> => {
    const response = await axiosInstance.get('/parking/config')
    return response.data
  },

  getCapacityParking: async (cashId: string): Promise<CapacityParkingResponse> => {
    const response = await axiosInstance.get(`/parking/capacity/${cashId}`)
    return response.data
  },

  getParkedVehicles: async (cashId: string, cursor?: string, limit: number = 5): Promise<VehiclesResponse> => {
    const url = cursor 
      ? `vehicles/entries/${cashId}?cursor=${cursor}&limit=${limit}`
      : `vehicles/entries/${cashId}?limit=${limit}`;
    
    const response = await axiosInstance.get<VehiclesResponse>(url);
    return response.data;
  },
}