import { ProductApi } from "@/src/api/productsService";
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

  const searchByBarcode = async (barcode: string): Promise<BarcodeSearchResult> => {
    if (!barcode || barcode.trim() === '') {
      return {
        success: false,
        message: 'Código de barras não pode estar vazio'
      };
    }

    setLoading(true);
    setError(null);

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
        message: 'Produto não encontrado nas bases de dados'
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

  return {
    searchByBarcode,
    loading,
    error
  };
}

export default useBarcodeSearch;
