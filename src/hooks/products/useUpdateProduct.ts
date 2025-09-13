import { ProductApi } from '@/src/api/productsService';
import { Product } from '@/src/types/productsTypes/products';
import { useState } from 'react';

interface UpdateProductData {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  barcode?: string;
  expirationDate?: string;
  isActive?: boolean;
}

interface UpdateProductResponse {
  success: boolean;
  message: string;
  data?: Product;
}

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = async (productData: UpdateProductData): Promise<UpdateProductResponse> => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔄 [useUpdateProduct] Iniciando atualização do produto:", productData);
      
      const response = await ProductApi.updateProduct(productData);
      
      console.log("✅ [useUpdateProduct] Produto atualizado com sucesso:", response);
      
      return {
        success: true,
        message: "Produto atualizado com sucesso!",
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ [useUpdateProduct] Erro ao atualizar produto:", error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Erro ao atualizar produto. Tente novamente.";
      
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProduct,
    loading,
    error
  };
};
