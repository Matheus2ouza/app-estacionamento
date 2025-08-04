import { useState } from "react";
import { ProductApi } from "@/src/api/productsService";
import { RegisterPayment } from "@/src/types/products";

interface RegisterPaymentResult {
  success: boolean;
  pdfBase64?: string;
  transactionId?: string;
  hasReceipt?: boolean;
  message?: string;
}

export const useRegisterPayment = () => {
  const [error, setError] = useState<string | null>(null);

  const registerPayment = async (
    data: RegisterPayment
  ): Promise<RegisterPaymentResult> => {
    setError(null);

    try {
      console.log(data)
      const response = await ProductApi.registerPayment(data);

      if (response.success) {
        return {
          success: true,
          transactionId: response.transactionId,
          pdfBase64: response.receipt,
          hasReceipt: !!response.receipt,
          message: response.message,
        };
      } else {
        const errorMessage = response.message || "Erro ao registrar pagamento.";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      }
    } catch (err: any) {
      let errorMessage = "Erro inesperado.";
      
      if (err.response) {
        // Erro da API (500, 400, etc)
        errorMessage = err.response.data?.message || 
                      `Erro ${err.response.status}: ${err.response.statusText}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error("Erro na requisição:", err);
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  return {
    registerPayment,
    error,
  };
};