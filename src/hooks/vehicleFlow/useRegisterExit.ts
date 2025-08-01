import { useState } from "react";
import { ResponseCalculateOutstanding } from "@/src/types/vehicleFlow";
import { VehicleApi } from "@/src/api/vehicleFlowService";
import { ResponseRegisterExit } from "@/src/types/vehicleFlow";

export const useRegisterExit = () => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateAmount = async (category: string, stayDuration: string): Promise<ResponseCalculateOutstanding> => {
    try {
      const response = await VehicleApi.calculateOutstanding({
        category,
        stayDuration
      });
      
      return {
        success: response.success,
        amount: response.amount || 0,
        message: response.message
      };
    } catch (err) {
      setError("Erro ao calcular valor");
      console.error("Calculate error:", err);
      return {
        success: false,
        amount: 0,
        message: "Erro ao calcular valor"
      };
    }
  };

   const registerExit = async (
    exitData: {
      plate: string;
      exit_time: string;
      openCashId: string;
      amount_received: number;
      change_given: number;
      discount_amount: number;
      final_amount: number;
      original_amount: number;
      method: string;
    }
  ): Promise<ResponseRegisterExit> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await VehicleApi.registerExit(exitData);
      return response;
    } catch (err) {
      setError("Erro ao registrar saída do veículo");
      console.error("Register exit error:", err);
      return {
        success: false,
        message: "Erro ao registrar saída do veículo"
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    calculateAmount,
    registerExit,
    isProcessing,
    error
  };
};