import { deleteVehicleResponse, EditData, EntryData, ParkedVehiclesResponse, RegisterVehicleResponse, SecondticketResponse, VehicleResponse } from '../types/vehicleFlow';
import axiosInstance from './axiosInstance';


export const VehicleApi = {
  registerEntry: async (data: EntryData): Promise<RegisterVehicleResponse> => {
    const response = await axiosInstance.post<RegisterVehicleResponse>(
      '/vehicles/entries', data);
    return response.data;
  },

  editdataVehicle: async (data: EditData): Promise<RegisterVehicleResponse> => {
    const response = await axiosInstance.post<RegisterVehicleResponse>(
      '/vehicles/editVehicle', data);
    return response.data;
  },

  deleteVehicle: async (data:{id: string}): Promise<deleteVehicleResponse> => {
    const response = await axiosInstance.post<deleteVehicleResponse>(
      '/vehicles/deleteVehicle', data);
      return response.data;
  },

  secondTicket: async (id: string): Promise<SecondticketResponse> => {
    const response = await axiosInstance.get(`/vehicles/${id}/ticket`);
    return response.data
  },

  getUniquevehicle: async (id: string, plate: string): Promise<VehicleResponse> => {
    const response =  await axiosInstance.get(`/vehicles/${id}/${plate}/vehicle`);
    return response.data
  },

  getParked: async (): Promise<ParkedVehiclesResponse> => {
    const response = await axiosInstance.get<ParkedVehiclesResponse>('/vehicles/parked');
    return response.data;
  },
};
