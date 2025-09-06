import { deleteVehicleResponse, EditData, ParkedVehiclesResponse, SecondticketResponse, VehicleResponse } from '../types/vehicleFlow';
import { RegisterVehicleData, RegisterVehicleResponse } from '../types/vehicleTypes/vehicles';
import axiosInstance from './axiosInstance';


export const VehicleApi = {
  registerEntry: async (data: RegisterVehicleData, photo: string): Promise<RegisterVehicleResponse> => {
    const formData = new FormData();
    
    // Adicionar os dados do veículo
    formData.append('plate', data.plate);
    formData.append('category', data.category);
    
    if (data.observation) {
      formData.append('observation', data.observation);
    }
    
    if (data.billingMethod) {
      formData.append('billingMethod', data.billingMethod);
    }
    
    if (photo) {
      formData.append('photo', {
        uri: photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);
    }
    
    const response = await axiosInstance.post<RegisterVehicleResponse>(
      '/vehicles/entries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
