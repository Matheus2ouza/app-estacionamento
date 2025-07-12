import { ProductApi } from "@/src/api/productsService";
import { Product } from "@/src/types/products";
import { useState } from "react";

const useRegisterProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerProduct = async (data: Product) => {
    setLoading(true);
    setError(null);

    try {
      const register = await ProductApi.createProduct(data);
      if (register.success) {
        return {
          success: true,
          message: register.message,
        };
      } else {
        throw new Error("Erro ao tentar registrar o produto.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao registrar o produto.";

      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    registerProduct,
    loading,
    error,
  };
};

export default useRegisterProduct;