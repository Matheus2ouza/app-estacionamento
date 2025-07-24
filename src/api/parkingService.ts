import { configurationsSetupVacancies, dataParking } from "../types/parking";
import axiosInstance from "./axiosInstance";

export const ParkingApi = {
  configParking: async (data: dataParking) => {
    const response = await axiosInstance.post('/vehicles/configParking', data);
    return response.data
  },
  getConfigParking: async (): Promise<configurationsSetupVacancies> => {
    const response = await axiosInstance.get('/vehicles/configParking')
    return response.data
  }
}