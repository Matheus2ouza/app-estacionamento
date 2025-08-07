import { useState, useEffect, useCallback } from "react";
import { ActiveBillingMethodResponse } from "@/src/types/payment";
import { cashApi } from "@/src/api/cashService";

export const useActivePaymentMethod = () => {
  const [activeMethod, setActiveMethod] = useState<ActiveBillingMethodResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActiveMethod = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await cashApi.getBillingMethodsActive();
      
      if (response.success) {
        console.log(response.data)
        setActiveMethod(response.data || null);
        return response.data;
      }
      
      throw new Error(response.message || "Nenhum método ativo encontrado");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar método ativo";
      setError(errorMessage);
      setActiveMethod(null);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActiveMethod();
  }, [loadActiveMethod]);

  const formatCurrency = useCallback((value: number | undefined) => {
    return value?.toFixed(2).replace(".", ",") ?? "0,00";
  }, []);

  const formatMinutes = useCallback((minutes: number | undefined) => {
    return minutes?.toString() ?? "0";
  }, []);

  return {
    activeMethod,
    isLoading,
    error,
    formatCurrency,
    formatMinutes,
    refresh: loadActiveMethod,
  };
};