import { API_URL } from '@/src/config/api';
import axios from 'axios';
import type { DataUser, ListUsers, LoginData, UserData } from '../types/authTypes/auth';
import axiosInstance from './axiosInstance';

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export const AuthApi = {
  loginUser: async (data: LoginData): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/users/`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  listUsers: async(): Promise<ListUsers> => {
    const response = await axiosInstance.get<ListUsers>('/users/');
    return response.data
  },

  registerUser: async(data: DataUser) => {
    const response = await axiosInstance.post('/users/create', data);
    return response.data
  },

  editUser: async(data: UserData) => {
    const response = await axiosInstance.put('/users/update', data);
    return response.data
  },

  deleteUser: async(id: string, password: string) => {
    const response = await axiosInstance.delete(`/users/delete/${id}`, {
      data: { password }
    });
    return response.data
  },
};
