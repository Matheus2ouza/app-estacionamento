import { configurationsSetupVacancies, dataParking, ResponseVeicleData } from "../types/parking";
import axiosInstance from "./axiosInstance";

export const ParkingApi = {
  configParking: async (data: dataParking) => {
    const response = await axiosInstance.post('/vehicles/configParking', data);
    return response.data
  },
  getConfigParking: async (): Promise<configurationsSetupVacancies> => {
    const response = await axiosInstance.get('/vehicles/configParking')
    return response.data
  },

  getParkingData: async (): Promise<ResponseVeicleData> => {
    const response = await axiosInstance.get('/vehicles/parking-data')
    return response.data
  }
}