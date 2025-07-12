import { Product, Response } from "../types/products";
import axiosInstance from "./axiosInstance";

export const ProductApi = {
  listProducts: async (): Promise<Response> => {
    const response = await axiosInstance.get<Response>('/products/list-products');
    return response.data
  },

  createProduct: async (data: Product): Promise<Response> => {
    const response =  await axiosInstance.post<Response>('products/create-product', data);
    return response.data
  }
}
