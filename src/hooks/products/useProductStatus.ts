import { ProductApi } from "@/api/productsService";
import { ProductRegisterResponse } from "@/types/productsTypes/products";
import { useState } from "react";

export function useProductStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleProductStatus = async (productId: string, currentMode: boolean): Promise<ProductRegisterResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      // Se o produto está ativo (mode: true), desativamos (mode: false)
      // Se o produto está inativo (mode: false), ativamos (mode: true)
      const newMode = currentMode ? "false" : "true";
      
      console.log(`🔄 [useProductStatus] Alterando status do produto ${productId}: ${currentMode ? 'ativo' : 'inativo'} → ${newMode === "true" ? 'ativo' : 'inativo'}`);
      
      const response = await ProductApi.updateModeProduct(newMode, productId);
      
      if (response.success) {
        console.log(`✅ [useProductStatus] Status do produto alterado com sucesso: ${response.message}`);
        return response;
      } else {
        throw new Error(response.message || "Erro ao alterar status do produto");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao alterar status do produto";
      console.error("❌ [useProductStatus] Erro:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    toggleProductStatus,
  };
}
