import { ProductApi } from "@/api/productsService";
import { Product, ProductRegisterResponse } from "@/types/productsTypes/products";
import { useState } from "react";

const useRegisterProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const registerProduct = async (data: Product) => {
    setLoading(true);
    setError(null);

    try {
      const register: ProductRegisterResponse = await ProductApi.createProduct(data);
      if (register.success) {
        setSuccess(true);
        setMessage(register.message || "Produto registrado com sucesso.");
        return {
          data: register.data,
        };
      } else {
        setSuccess(false);
        setMessage(register.message || "Erro ao registrar o produto.");
        return {
          data: null,
        };
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao registrar o produto.";

      setError(errorMessage || "Erro ao registrar o produto.");
      setSuccess(false);
      setMessage(errorMessage || "Erro ao registrar o produto.");
      return {
        success: false,
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    registerProduct,
    loading,
    error,
    success,
    message,
  };
};

export default useRegisterProduct;