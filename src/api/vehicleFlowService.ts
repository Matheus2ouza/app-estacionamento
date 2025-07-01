import { EntryData, ParkedVehiclesResponse, RegisterVehicleResponse } from '../types/vehicleFlow';
import axiosInstance from './axiosInstance';


export const VehicleApi = {
  registerEntry: async (data: EntryData): Promise<RegisterVehicleResponse> => {
    const response = await axiosInstance.post<RegisterVehicleResponse>(
      '/vehicles/entries', data);
    return response.data;
  },

  getParked: async (): Promise<ParkedVehiclesResponse> => {
    const response = await axiosInstance.get<ParkedVehiclesResponse>('/vehicles/parked');
    return response.data;
  },
};
