import {
  Product,
  Response,
  OpenFoodFactsResponse,
  OpenFoodFactsProduct,
  ResponseProduct,
  RegisterPayment,
  RegisterPaymentResponse,
} from "../types/products";
import axiosInstance from "./axiosInstance";

export const ProductApi = {
  listProducts: async (): Promise<Response> => {
    const response = await axiosInstance.get<Response>(
      "/products/list-products"
    );
    return response.data;
  },

  createProduct: async (data: Product): Promise<Response> => {
    const response = await axiosInstance.post<Response>(
      "/products/create-product",
      data
    );
    return response.data;
  },

  getProductByBarcode: async (
    barcode: string
  ): Promise<OpenFoodFactsProduct | null> => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      const data: OpenFoodFactsResponse = await response.json();

      if (data.status === 1 && data.product) {
        return data.product;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar produto externo:", error);
      return null;
    }
  },

  getProductByBarcodeFromAnotherSource: async (
    barcode: string
  ): Promise<OpenFoodFactsProduct | null> => {
    // implementação de outra API
    try {
      const response = await fetch(`https://outra.api.com/product/${barcode}`);
      const data = await response.json();

      if (data && data.product) {
        return data.product;
      }
      return null;
    } catch (error) {
      console.error("Erro API alternativa:", error);
      return null;
    }
  },

  fetchProducts: async (barcode: string): Promise<ResponseProduct> => {
    const response = await axiosInstance.get(`/products/fetch-product/${barcode}`);
    return response.data
  },

  registerPayment: async(data: RegisterPayment): Promise<RegisterPaymentResponse> => {
    const response = await axiosInstance.post(`/products/register-payment`, data)
    return response.data
  }
};
