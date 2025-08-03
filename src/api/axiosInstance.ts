import axios from 'axios';
import { API_URL } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_URL
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  // logs removidos
}

// Interceptor para adicionar o token a cada requisição
axiosInstance.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
      // logs removidos
    } else {
      // logs removidos
    }

    return config;
  },
  (error) => {
    // logs removidos
    return Promise.reject(error);
  }
);

export default axiosInstance;
