import { ProductApi } from "@/api/productsService";
import { duplicateReceipt, ProductPayment, ProductPaymentResponse } from "@/types/productsTypes/products";
import { useState } from "react";

const useRegisterProductSale = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const registerProductSale = async (data: ProductPayment) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      console.log("🛒 [useRegisterProductSale] Iniciando registro da venda:", data);
      
      const response: ProductPaymentResponse = await ProductApi.registerProductPayment(data);
      
      if (response.success) {
        setSuccess(true);
        setMessage(response.message || "Venda registrada com sucesso!");
        console.log("🛒 [useRegisterProductSale] Venda registrada:", response);
        
        return {
          success: true,
          data: response,
          transactionId: response.transactionId,
          receipt: response.receipt
        };
      } else {
        setSuccess(false);
        setMessage(response.message || "Erro ao registrar a venda.");
        console.log("🛒 [useRegisterProductSale] Erro na resposta:", response);
        
        return {
          success: false,
          data: null,
          error: response.message
        };
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao registrar a venda.";

      console.error("🛒 [useRegisterProductSale] Erro:", err);
      setError(errorMessage);
      setSuccess(false);
      setMessage(errorMessage);
      
      return {
        success: false,
        data: null,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const duplicateReceipt = async (id: string) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      console.log('chamando a api')
      console.log('o id:', id)
      const response: duplicateReceipt = await ProductApi.duplicateReceipt(id);
      console.log(response)

      if(response.success) {
        setSuccess(true);
        return {
          success: true,
          data: response.data,
        };
      } else {
        setError(response.message || "Erro ao gerar a segunda vida do comprovante.");
        return {
          success: false,
          message: response.message || "Erro ao gerar a segunda vida do comprovante.",
          data: null,
        };
      }
    } catch (error: any) {
      console.log(error)
      const errorMessage = error?.response?.data?.message || "Erro ao gerar a segunda vida do comprovante.";
      setError(errorMessage);
      setMessage(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    } finally {
      setLoading(false);
    }
  }

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setMessage(null);
  };

  return {
    registerProductSale,
    duplicateReceipt,
    loading,
    error,
    success,
    message,
    resetState
  };
};

export default useRegisterProductSale;
