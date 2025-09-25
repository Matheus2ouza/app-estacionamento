import { ProductApi } from "@/api/productsService";
import { useProductCache } from "@/context/ProductCacheContext";
import { BarcodeSearchResponse } from "@/types/productsTypes/products";
import { useState } from "react";

interface BarcodeSearchResult {
  success: boolean;
  data?: {
    name?: string;
  };
  message?: string;
}

export function useBarcodeSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const { searchProductByBarcode } = useProductCache();

  const searchByBarcode = async (barcode: string): Promise<BarcodeSearchResult> => {
    if (!barcode || barcode.trim() === '') {
      return {
        success: false,
        message: 'Código de barras não pode estar vazio'
      };
    }

    setLoading(true);
    setError(null);

    console.log('🔍 Busca externa:', barcode);
    try {
      // Primeiro, tentar OpenFoodFacts (API principal)
      try {
        const offData = await ProductApi.lookupByBarcodeOFF(barcode);
        
        if (offData.status === 1 && offData.product) {
          const product = offData.product;
          
          return {
            success: true,
            data: {
              name: product.product_name || product.product_name_en
            }
          };
        }
      } catch (offError) {
        // Se OpenFoodFacts falhar, continuar para UPCitemDB
      }

      // Se OpenFoodFacts não encontrou, tentar UPCitemDB
      try {
        const upcData = await ProductApi.lookupByBarcodeUPC(barcode);
        
        if (upcData.items && upcData.items.length > 0) {
          const item = upcData.items[0];
          
          return {
            success: true,
            data: {
              name: item.title || item.description
            }
          };
        }
      } catch (upcError) {
        // Se UPCitemDB também falhar, continuar
      }

      // Se não encontrou em nenhuma API
      return {
        success: false,
        message: 'Produto não encontrado nas bases de dados, Preencha manualmente os campos.'
      };

    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao buscar produto';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const searchByBarcodeInDatabase = async (barcode: string): Promise<BarcodeSearchResponse> => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // Usar o cache unificado para buscar o produto
      const result = await searchProductByBarcode(barcode);
      
      if (result.success) {
        setSuccess(true);
        setMessage(result.message || "Produto encontrado na base de dados.");
        console.log('🔍 DB: Produto encontrado', result.data?.productName);
      } else {
        setError(result.message || "Erro ao buscar produto na base de dados.");
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao buscar produto na base de dados.";
      setError(errorMessage);
      setSuccess(false);
      setMessage(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        data: undefined,
      };
    } finally {
      setLoading(false);
    }
  }

  return {
    searchByBarcode,
    searchByBarcodeInDatabase,
    loading,
    error,
    success,
    message,
  };
}

export default useBarcodeSearch;
