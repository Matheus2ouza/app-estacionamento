import axios from "axios"; // usamos axios puro para as APIs externas
import { BarcodeSearchResponse, Product, ProductPayment, ProductPaymentResponse, ProductRegisterResponse, Responselist } from "../types/productsTypes/products";
import axiosInstance from "./axiosInstance";

export const ProductApi = {
  listProducts: async (cursor?: string, limit: number = 10): Promise<Responselist> => {
    const url = cursor 
      ? `/products/list?cursor=${cursor}&limit=${limit}`
      : `/products/list?limit=${limit}`;
    
    const response = await axiosInstance.get<Responselist>(url);
    return response.data;
  },

  lookupByBarcode: async (barcode: string): Promise<BarcodeSearchResponse> => {
    const response = await axiosInstance.get(`/products/lookup?barcode=${barcode}`);
    return response.data;
  },

  createProduct: async (data: Product): Promise<ProductRegisterResponse> => {
    const response = await axiosInstance.post('/products/create', data);
    return response.data;
  },

  updateModeProduct: async (mode: string, productId: string): Promise<ProductRegisterResponse> => {
    const response = await axiosInstance.patch(`/products/${productId}?mode=${mode}`);
    return response.data;
  },

  updateProduct: async (data: Product): Promise<ProductRegisterResponse> => {
    const response = await axiosInstance.put(`/products/${data.id}/update`, data);
    return response.data;
  },

  registerProductPayment: async (data: ProductPayment): Promise<ProductPaymentResponse> => {
    const formData = new FormData();

    formData.append('method', data.method);
    formData.append('amountReceived', data.amountReceived.toString());
    formData.append('changeGiven', data.changeGiven.toString());
    formData.append('discountAmount', data.discountAmount.toString());
    formData.append('finalAmount', data.finalAmount.toString());
    formData.append('originalAmount', data.originalAmount.toString());
    formData.append('saleData', JSON.stringify(data.saleData));
    
    if (data.photo) {
      formData.append('photo', {
        uri: data.photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);
    }

    const response = await axiosInstance.post(`/products/payment/${data.cashId}/confirm`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
