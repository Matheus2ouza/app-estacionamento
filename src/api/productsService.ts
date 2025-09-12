import axios from "axios"; // usamos axios puro para as APIs externas
import { Product, ProductRegisterResponse, Responselist } from "../types/productsTypes/products";
import axiosInstance from "./axiosInstance";

export const ProductApi = {
  listProducts: async (cursor?: string, limit: number = 10): Promise<Responselist> => {
    const url = cursor 
      ? `/products/list?cursor=${cursor}&limit=${limit}`
      : `/products/list?limit=${limit}`;
    
    const response = await axiosInstance.get<Responselist>(url);
    return response.data;
  },

  createProduct: async (data: Product): Promise<ProductRegisterResponse> => {
    const response = await axiosInstance.post('/products/create', data);
    return response.data;
  },

  // 🔎 Busca produto pelo código de barras (UPC/EAN) usando UPCitemDB
  lookupByBarcodeUPC: async (upc: string): Promise<any> => {
    const response = await axios.post(
      "https://api.upcitemdb.com/prod/trial/lookup",
      { upc },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Accept-Encoding": "gzip, deflate",
        },
      }
    );
    return response.data;
  },

  // 🍎 Busca produto pelo código de barras usando OpenFoodFacts
  lookupByBarcodeOFF: async (barcode: string): Promise<any> => {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    return response.data;
  }
}
