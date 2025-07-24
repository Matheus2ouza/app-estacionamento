// src/api/axiosInstance.ts
import axios from 'axios';
import { API_URL } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_URL
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    console.log('[Axios] Token definido via setAuthToken:', token);
  } else {
    console.log('[Axios] Token removido via setAuthToken');
  }
}

// Interceptor para adicionar o token a cada requisição
axiosInstance.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log('[Axios] Token injetado na requisição:', authToken);
    } else {
      console.log('[Axios] Nenhum token disponível para injetar');
    }

    return config;
  },
  (error) => {
    console.error('[Axios] Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
