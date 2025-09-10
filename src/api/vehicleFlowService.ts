import { DeleteVehicleResponse, RegisterVehicleData, ScanVehicleResponse, UpdateVehicleData, UpdateVehicleResponse, VehiclePhotoResponse, VehicleResponse } from '../types/vehicleTypes/vehicles';
import axiosInstance from './axiosInstance';


export const VehicleApi = {
  registerEntry: async (data: RegisterVehicleData, photo: string): Promise<VehicleResponse> => {
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
    
    const response = await axiosInstance.post<VehicleResponse>(
      '/vehicles/entries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return response.data;
  },

  vehiclePhoto: async (vehicleId: string): Promise<VehiclePhotoResponse> => {
    try {
      const response = await axiosInstance.get(`/vehicles/${vehicleId}/photo`);
      
      if (response.data && typeof response.data === 'object') {
        if (response.data.success === false) {
          return {
            success: false,
            message: response.data.message || 'Erro ao carregar foto'
          };
        }
        
        if (response.data.success === true && response.data.data) {
          return {
            success: true,
            data: {
              photo: response.data.data.photo,
              photoType: response.data.data.photoType || 'image/jpeg'
            },
            message: 'Foto carregada com sucesso'
          };
        }
      }
      
      return {
        success: false,
        message: 'Formato de resposta não reconhecido'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar foto do veículo'
      };
    }
  },

  secondTicket: async (id: string): Promise<VehicleResponse> => {
    const response = await axiosInstance.get(`/vehicles/entries/${id}/duplicate`);
    return response.data;
  },

  deactivateVehicle: async (id: string): Promise<DeleteVehicleResponse> => {
    const response = await axiosInstance.patch(`/vehicles/entries/${id}/deactivate`);
    return response.data;
  },

  activateVehicle: async (id: string): Promise<DeleteVehicleResponse> => {
    const response = await axiosInstance.patch(`/vehicles/entries/${id}/activate`);
    return response.data;
  },

  updateVehicle: async (id: string, data: UpdateVehicleData): Promise<UpdateVehicleResponse> => {
    const response = await axiosInstance.put(`/vehicles/entries/${id}`, data);
    return response.data;
  },

  updateVehiclePhoto: async (id: string, photo: string): Promise<VehiclePhotoResponse> => {
    const formData = new FormData();
    
    if (photo) {
      formData.append('photo', {
        uri: photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);
    }
    
    const response = await axiosInstance.put(`/vehicles/entries/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteVehiclePhoto: async (id: string): Promise<VehiclePhotoResponse> => {
    const response = await axiosInstance.delete(`/vehicles/entries/${id}/photo`);
    return response.data;
  },

  fetchVehicle: async (id: string, plate: string): Promise<ScanVehicleResponse> => {
    const response = await axiosInstance.get(`/vehicles/entries/${id}/${plate}`);
    return response.data;
  },
};
