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

  editingProducts: async (data: Product): Promise<Response> => {
    const response = await axiosInstance.post<Response>(
      "/products/edit-product",
      data
    );
    return response.data;
  },

  deletingProducts: async (id: string, barcode: string): Promise<Response> => {
    const response = await axiosInstance.post<Response>(
      `/products/delete-product/${id}/${barcode}`
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
    const response = await axiosInstance.get(
      `/products/fetch-product/${barcode}`
    );
    return response.data;
  },

  registerPayment: async (
    data: RegisterPayment & { receiptImage?: string }
  ): Promise<RegisterPaymentResponse> => {
    const formData = new FormData();

    // Campos primitivos
    formData.append("paymentMethod", data.paymentMethod);
    formData.append("cashRegisterId", data.cashRegisterId);
    formData.append("totalAmount", String(data.totalAmount));
    formData.append("discountValue", String(data.discountValue));
    formData.append("finalPrice", String(data.finalPrice));
    formData.append("amountReceived", String(data.amountReceived));
    formData.append("changeGiven", String(data.changeGiven));

    // Lista de itens (serializando em JSON string)
    formData.append("saleItems", JSON.stringify(data.saleItems));

    // Comprovante (se houver)
    if (data.receiptImage) {
      formData.append("receiptImage", {
        uri: data.receiptImage,
        name: "comprovante.jpg",
        type: "image/jpeg",
      } as any);
    }

    // Requisição
    const response = await axiosInstance.post(
      `/products/register-payment`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};
