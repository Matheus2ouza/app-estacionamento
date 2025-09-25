import { API_URL } from '@/config/constants';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: API_URL
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

// Interceptor para adicionar o token a cada requisição
axiosInstance.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
axiosInstance.interceptors.response.use(
  (response) => {
    // Se a resposta tem success: false, trata como erro
    if (response.data && response.data.success === false) {
      const error = new Error(response.data.message || 'Erro na requisição');
      (error as any).response = response;
      (error as any).isApiError = true;
      return Promise.reject(error);
    }
    
    return response;
  },
  (error) => {
    // Se é um erro da API (400, 500, etc) e tem mensagem
    if (error.response?.data?.message) {
      const apiError = new Error(error.response.data.message);
      (apiError as any).response = error.response;
      (apiError as any).isApiError = true;
      return Promise.reject(apiError);
    }
    
    // Se é erro de rede ou outro tipo
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      const networkError = new Error('Erro de conexão. Verifique sua internet.');
      (networkError as any).isNetworkError = true;
      return Promise.reject(networkError);
    }
    
    // Erro genérico
    const genericError = new Error(error.message || 'Erro inesperado');
    (genericError as any).response = error.response;
    return Promise.reject(genericError);
  }
);

export default axiosInstance;
