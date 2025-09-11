import { Product, Responselist } from "../types/productsTypes/products";
import axiosInstance from "./axiosInstance";

export const ProductApi = {
  listProducts: async (cursor?: string, limit: number = 10): Promise<Responselist> => {
    const url = cursor 
      ? `/products/list?cursor=${cursor}&limit=${limit}`
      : `/products/list?limit=${limit}`;
    
    const response = await axiosInstance.get<Responselist>(url);
    return response.data;
  },

  createProduct: async (data: Product): Promise<Response> => {
    const response =  await axiosInstance.post('/products/create', data);
    return response.data
  }
}
