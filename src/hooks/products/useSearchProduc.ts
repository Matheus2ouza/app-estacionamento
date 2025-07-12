import { ProductApi } from "@/src/api/productsService";
import { useState } from "react";

const useSearchProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const productsList = await ProductApi.listProducts();

      if (productsList.success) {
        return {
          success: true,
          list: productsList.list || [],
        };
      } else {
        throw new Error(productsList.error || "Erro ao buscar produtos");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao buscar os produtos.";

      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        list: [],
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    searchProducts,
    loading,
    error,
  };
};

export default useSearchProducts;