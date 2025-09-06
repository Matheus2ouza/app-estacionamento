import { cashApi } from "@/src/api/cashService";
import { BillingMethod, BillingMethodListResponse, BillingMethodResponse, CategoryType } from "@/src/types/billingMethod";
import { useState } from "react";

// Tipo para os dados do formulário
type FormData = {
  title: string;
  category: string;
  tolerance: string;
  time?: string;
  carPrice: string;
  motoPrice: string;
};

export function useBillingMethod() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSaveMethod = async (formData: FormData): Promise<BillingMethodResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      // Função para converter valor monetário brasileiro para número
      const convertBrazilianCurrency = (value: string): number => {
        if (!value || value.trim() === '') return 0;
        
        // Remove espaços e caracteres não numéricos exceto vírgula e ponto
        let cleanValue = value.replace(/\s/g, '').replace(/[^\d,.-]/g, '');
        
        // Se tem vírgula, assume formato brasileiro (15,50)
        if (cleanValue.includes(',')) {
          // Substitui vírgula por ponto para parseFloat
          cleanValue = cleanValue.replace(',', '.');
        }
        
        const result = parseFloat(cleanValue);
        return isNaN(result) ? 0 : result;
      };

      if (formData.category === 'VALOR_FIXO') {
        formData.time = undefined;
      }

      // Estruturar os dados conforme o tipo BillingMethod
      const billingMethodData: BillingMethod = {
        title: formData.title,
        category: formData.category as CategoryType,
        tolerance: parseInt(formData.tolerance) || 0,
        time: formData.time,
        carroValue: convertBrazilianCurrency(formData.carPrice),
        motoValue: convertBrazilianCurrency(formData.motoPrice)
      };
      
      const response: BillingMethodResponse = await cashApi.billingSave(billingMethodData);

      setSuccess(true);
      setMessage(response.message || 'Método salvo com sucesso');
      return { 
        success: true, 
        message: response.message || 'Método salvo com sucesso', 
        data: response.data 
      };
      
    } catch (error: any) {
      console.error('Erro capturado:', error);
      
      const errorMessage = error.message || 'Erro ao salvar método de cobrança';
      setSuccess(false);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleGetMethods = async (): Promise<BillingMethodListResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response: BillingMethodListResponse = await cashApi.billingGetMethods();

      setSuccess(true);
      setMessage(response.message || 'Métodos carregados com sucesso');
      return { 
        success: true, 
        message: response.message || 'Métodos carregados com sucesso', 
        methods: response.methods || [] 
      };
      
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao buscar métodos de cobrança';
      setSuccess(false);
      setError(errorMessage);
      return { success: false, message: errorMessage, methods: [] };
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMethod = async (id: string): Promise<BillingMethodResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response: BillingMethodResponse = await cashApi.billingDelete(id);

      setSuccess(true);
      setMessage(response.message || 'Método desativado com sucesso');
      return { 
        success: true, 
        message: response.message || 'Método desativado com sucesso', 
        data: response.data 
      };
      
    } catch (error: any) {
      console.error('Erro ao deletar método:', error);
      
      // O interceptor já formatou a mensagem de erro
      const errorMessage = error.message || 'Erro ao deletar método de cobrança';
      setSuccess(false);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleActivateMethod = async (id: string): Promise<BillingMethodResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);
    
    try {
      const response: BillingMethodResponse = await cashApi.billingActivate(id);
      
      setSuccess(true);
      setMessage(response.message || 'Método ativado com sucesso');
      return { 
        success: true, 
        message: response.message || 'Método ativado com sucesso', 
        data: response.data 
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao ativar método de cobrança';
      setSuccess(false);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMethod = async (updateData: BillingMethod & { id: string }): Promise<BillingMethodResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);
    
    try {
      const response: BillingMethodResponse = await cashApi.billingUpdate(updateData);
      setSuccess(true);
      setMessage(response.message);
      return { success: true, message: response.message, data: response.data };
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao atualizar método de cobrança';
      setSuccess(false);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePutMethod = async (updateData: FormData & { id: string }): Promise<BillingMethodResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);
    
    try {
      
      // Verifica se os dados são válidos
      if (!updateData || !updateData.id) {
        throw new Error('Dados inválidos para atualização');
      }
      
      // Função para converter valor monetário brasileiro para número
      const convertBrazilianCurrency = (value: string): number => {
        if (!value || value.trim() === '') return 0;
        
        // Remove espaços e caracteres não numéricos exceto vírgula e ponto
        let cleanValue = value.replace(/\s/g, '').replace(/[^\d,.-]/g, '');
        
        // Se tem vírgula, assume formato brasileiro (15,50)
        if (cleanValue.includes(',')) {
          // Substitui vírgula por ponto para parseFloat
          cleanValue = cleanValue.replace(',', '.');
        }
        
        const result = parseFloat(cleanValue);
        return isNaN(result) ? 0 : result;
      };

      // Estruturar os dados conforme o tipo BillingMethod
      const billingMethodData: BillingMethod = {
        title: updateData.title || '',
        category: updateData.category as CategoryType,
        tolerance: parseInt(updateData.tolerance),
        time: updateData.time,
        carroValue: convertBrazilianCurrency(updateData.carPrice),
        motoValue: convertBrazilianCurrency(updateData.motoPrice)
      };

      const response: BillingMethodResponse = await cashApi.billingUpdatePut({
        ...billingMethodData,
        id: updateData.id
      });

      setSuccess(true);
      setMessage(response.message || 'Método atualizado com sucesso');
      return { 
        success: true, 
        message: response.message || 'Método atualizado com sucesso', 
        data: response.data 
      };
      
    } catch (error: any) {
      console.error('Erro ao atualizar método:', error);
      
      const errorMessage = error.message || 'Erro ao atualizar método de cobrança';
      setSuccess(false);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    message,
    handleSaveMethod,
    handleGetMethods,
    handleDeleteMethod,
    handleActivateMethod,
    handleUpdateMethod,
    handleUpdatePutMethod
  };
}