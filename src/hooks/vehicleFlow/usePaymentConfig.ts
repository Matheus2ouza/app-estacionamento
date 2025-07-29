import { useState, useCallback } from "react";
import {
  PaymentConfig,
  BillingMethod,
  VehicleCategory,
  BillingMethodWithRules,
  ActiveBillingRuleWithMethod,
} from "@/src/types/cash";
import { cashApi } from "@/src/api/cashService";

// Tipos de veículo baseados no enum do Prisma
const VEHICLE_TYPES = [
  { id: VehicleCategory.CARRO, name: "Carro" },
  { id: VehicleCategory.MOTO, name: "Moto" },
];

export const usePaymentConfig = () => {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [selectedMethod, setSelectedMethod] =
    useState<BillingMethodWithRules | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingMethods, setBillingMethods] = useState<
    BillingMethodWithRules[]
  >([]);
  const [activeMethods, setActiveMethods] = useState<
    ActiveBillingRuleWithMethod[]
  >([]);

  // Carrega todos os métodos de cobrança
  const loadBillingMethods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cashApi.getBillingMethods();
      console.log("API Response:", response); // Para debug

      if (response.success) {
        // Ajustado para usar response.methods conforme o log mostra
        const methods = (response.methods as BillingMethodWithRules[]).map(
          (method) => ({
            ...method,
            // Garantindo que temos um ID (usando name como fallback)
            id: method.id || method.name,
            // Garantindo que billing_rule seja um array
            billing_rule: method.billing_rule || [],
          })
        );

        setBillingMethods(methods);
        return methods;
      }
      throw new Error("Failed to load billing methods");
    } catch (error) {
      console.error("Failed to load billing methods", error);
      setError("Falha ao carregar métodos de cobrança");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carrega apenas os métodos ativos
  const loadActiveBillingMethods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cashApi.getBillingMethodsActive();
      console.log(response);
      if (response.success) {
        setActiveMethods(response.data);
        return response.data;
      }
      throw new Error("Failed to load active billing methods");
    } catch (error) {
      console.error("Failed to load active billing methods", error);
      setError("Falha ao carregar métodos de cobrança ativos");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Seleciona um método de cobrança
  const selectMethod = useCallback((method: BillingMethodWithRules) => {
    setSelectedMethod(method);

    // Define o tempo base baseado no tipo de método
    const baseTime = method.name.includes("Hora") ? 60 : 30;

    // Inicializa as regras baseadas no método selecionado
    const initialRules: Partial<
      Record<
        VehicleCategory,
        {
          price: number;
          base_time_minutes: number;
        }
      >
    > = {};

    // Verifica se existem regras e itera sobre elas
    if (method.billing_rule && method.billing_rule.length > 0) {
      method.billing_rule.forEach(
        (rule: {
          vehicle_type: VehicleCategory;
          price: number;
          base_time_minutes: number;
        }) => {
          initialRules[rule.vehicle_type] = {
            price: rule.price,
            base_time_minutes: baseTime, // Usa o valor fixo
          };
        }
      );
    } else {
      // Se não houver regras, inicializa com valores padrão para todos os tipos de veículo
      VEHICLE_TYPES.forEach((vehicle) => {
        initialRules[vehicle.id] = {
          price: 0,
          base_time_minutes: baseTime, // Usa o valor fixo
        };
      });
    }

    setConfig({
      methodId: method.id || method.name,
      toleranceMinutes: method.tolerance || 0,
      rules: initialRules,
    });
  }, []);

  const selectMethodById = useCallback(
    (methodId: string) => {
      const method = billingMethods.find((m) => m.id === methodId);
      if (method) {
        selectMethod(method);
      }
    },
    [billingMethods, selectMethod]
  );

  // Atualiza uma regra para um tipo de veículo
  const updateRule = useCallback(
    (
      vehicleType: VehicleCategory,
      field: "price", // Removido "base_time_minutes"
      value: number
    ) => {
      setConfig((prev) => {
        if (!prev) return null;

        const currentRule = prev.rules[vehicleType] || {
          price: 0,
          base_time_minutes: selectedMethod?.name.includes("Hora") ? 60 : 30,
        };

        return {
          ...prev,
          rules: {
            ...prev.rules,
            [vehicleType]: {
              ...currentRule,
              [field]: value,
            },
          },
        };
      });
    },
    [selectedMethod]
  );

  // Atualiza a tolerância
  const updateTolerance = useCallback((minutes: number) => {
    setConfig((prev) => {
      if (!prev) return null;
      return { ...prev, toleranceMinutes: minutes };
    });
  }, []);

  // Salva a configuração
  const saveConfig = useCallback(async (newConfig: PaymentConfig) => {
    setIsSaving(true);
    setError(null);
    try {
      // Implemente a chamada API para salvar a configuração
      // const response = await cashApi.savePaymentConfig(newConfig);
      // if (!response.success) throw new Error(response.message);

      setConfig(newConfig);
      return true;
    } catch (error) {
      console.error("Failed to save config", error);
      setError("Falha ao salvar configuração");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    // Estado
    config,
    selectedMethod,
    billingMethods,
    activeMethods,
    isLoading,
    isSaving,
    error,
    vehicleTypes: VEHICLE_TYPES,

    // Métodos
    loadBillingMethods,
    loadActiveBillingMethods,
    selectMethod,
    selectMethodById,
    updateRule,
    updateTolerance,
    saveConfig,
  };
};
