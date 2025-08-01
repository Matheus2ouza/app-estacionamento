import { ProductApi } from "@/src/api/productsService";
import { Product } from "@/src/types/products";
import { useState } from "react";
import { OpenFoodFactsProduct } from "@/src/types/products";

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

  const fetchProductByBarcode = async (
    barcode: string
  ): Promise<OpenFoodFactsProduct | null> => {
    try {
      const product = await ProductApi.getProductByBarcode(barcode);
      if (product) return product;
    } catch (error) {
      console.warn("Erro na API OpenFoodFacts:", error);
    }

    try {
      const product = await ProductApi.getProductByBarcodeFromAnotherSource(
        barcode
      );
      if (product) return product;
    } catch (error) {
      console.warn("Erro na API alternativa:", error);
    }

    return null;
  };

  const editProduct = async (data: Product) => {
    setLoading(true);
    setError(null);

    try {
      const register = await ProductApi.editingProducts(data);
      if (register.success) {
        return {
          success: true,
          message: register.message,
        };
      } else {
        throw new Error("Erro ao tentar editar o produto.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao editar o produto.";

      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string, barcode: string) => {
    setLoading(true);
    setError(null);

    try {
      const register = await ProductApi.deletingProducts(id, barcode);
      if (register.success) {
        return {
          success: true,
          message: register.message,
        };
      } else {
        throw new Error("Erro ao tentar excluir o produto.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao excluir o produto.";

      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }
  return {
    registerProduct,
    fetchProductByBarcode,
    editProduct,
    deleteProduct,
    loading,
    error,
  };
};

export default useRegisterProduct;
