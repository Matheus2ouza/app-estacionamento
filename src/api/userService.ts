// src/services/AuthApi.ts
import { API_URL } from '@/src/config/api';
import axios from 'axios';
import type { DataUser, ListUsers, LoginData, UserData } from '../types/auth';
import axiosInstance from './axiosInstance';

interface LoginResponse {
  token: string;
}

export const AuthApi = {
  loginUser: async (data: LoginData): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/login`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response)
    return response.data;
  },

  userList: async(): Promise<ListUsers> => {
    const response = await axiosInstance.get<ListUsers>('/auth/listUsers');
    return response.data
  },

  userRegister: async(data: DataUser) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data
  },

  editUser: async(data: UserData) => {
    const response = await axiosInstance.post('/auth/edit', data);
    return response.data
  },

  deleteUser: async(id: { id:string } ) => {
    const response = await axiosInstance.post('/auth/deleteUser', id);
    return response.data
  }
};
