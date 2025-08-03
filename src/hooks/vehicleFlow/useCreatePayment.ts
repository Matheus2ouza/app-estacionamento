import { useState, useCallback, useEffect } from "react";
import {
  BillingMethodWithRules,
  ActiveBillingMethodResponse,
  PaymentConfigApiPayload,
  VehicleCategory,
} from "@/src/types/payment";
import { cashApi } from "@/src/api/cashService";

const VEHICLE_TYPES = [
  { id: VehicleCategory.CARRO, name: "Carro" },
  { id: VehicleCategory.MOTO, name: "Moto" },
];

type VehicleRule = {
  price: number;
  base_time_minutes: number;
};

type PaymentConfigState = {
  methodId: string;
  methodName: string;
  toleranceMinutes: number;
  rules: Record<string, VehicleRule>;
};

export const useCreatePayment = () => {
  // Estados principais
  const [methods, setMethods] = useState<BillingMethodWithRules[]>([]);
  const [activeMethod, setActiveMethod] =
    useState<ActiveBillingMethodResponse | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfigState | null>(
    null
  );
  const [loading, setLoading] = useState({
    isLoading: false,
    isSaving: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [displayValues, setDisplayValues] = useState<Record<string, string>>(
    {}
  );

  // Estados do modal de feedback
  const [modalState, setModalState] = useState({
    visible: false,
    message: "",
    isSuccess: false,
  });

  // Carrega todos os métodos de cobrança
  const loadMethods = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isLoading: true }));
    setError(null);

    try {
      const response = await cashApi.getBillingMethods();

      if (!response) {
        throw new Error("Resposta da API inválida");
      }

      const { success, data: methods = [], message } = response;

      if (success) {
        if (!Array.isArray(methods)) {
          console.error("Métodos não é um array:", methods);
          throw new Error(
            "Formato de dados inválido: métodos deve ser um array"
          );
        }

        const formattedMethods = methods.map((m) => ({
          id: m.id,
          name: m.name,
          description: m.description,
          tolerance: m.tolerance,
          is_active: m.is_active || false,
          billing_rule: Array.isArray(m.billing_rule) ? m.billing_rule : [],
        }));

        setMethods(formattedMethods);
        return formattedMethods;
      }
      throw new Error(message || "Falha ao carregar métodos de cobrança");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Erro ao carregar métodos:", {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Carrega o método ativo
  const loadActiveMethod = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isLoading: true }));
    setError(null);

    try {
      const response = await cashApi.getBillingMethodsActive();

      if (!response) {
        throw new Error("Resposta da API inválida");
      }

      const { success, data, message } = response;

      if (success && data) {
        if (data.rules && !Array.isArray(data.rules)) {
          console.error(
            "Regras do método ativo não são um array:",
            data.rules
          );
          data.rules = [];
        }

        setActiveMethod(data);
        return data;
      }
      throw new Error(message || "Nenhum método ativo encontrado");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar método ativo";
      console.error("Erro ao carregar método ativo:", {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Inicializa os dados
  const initializeData = useCallback(async () => {
    try {
      const [loadedMethods, activeMethodData] = await Promise.all([
        loadMethods(),
        loadActiveMethod(),
      ]);

      if (
        activeMethodData &&
        !loadedMethods.some((m) => m.id === activeMethodData.method.id)
      ) {
        setMethods((prev) => [
          ...prev,
          {
            ...activeMethodData.method,
            is_active: true,
            billing_rule: activeMethodData.rules || [],
          },
        ]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Falha ao carregar configurações";
      console.error("Erro na inicialização:", {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });
      showModal(errorMessage, false);
    }
  }, [loadMethods, loadActiveMethod]);

  // Seleciona um método de cobrança
  const selectMethod = useCallback((method: BillingMethodWithRules) => {
    const baseTime = method.name.includes("Hora") ? 60 : 30;

    const rules = VEHICLE_TYPES.reduce((acc, vehicle) => {
      const existingRule = (method.billing_rule || []).find(
        (r) => r?.vehicle_type?.toLowerCase() === vehicle.id.toLowerCase()
      );

      acc[vehicle.id] = {
        price: existingRule?.price || 0,
        base_time_minutes: existingRule?.base_time_minutes || baseTime,
      };

      return acc;
    }, {} as Record<string, VehicleRule>);

    setPaymentConfig({
      methodId: method.id,
      methodName: method.name,
      toleranceMinutes: method.tolerance || 0,
      rules,
    });
  }, []);

  // Converte de string (formato brasileiro) para número
  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^0-9,]/g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  };

  // Converte de número para string (formato brasileiro)
  const formatCurrency = (value: number): string => {
    return value.toFixed(2).replace(".", ",");
  };

  const updateRule = useCallback(
    (vehicleType: string, field: keyof VehicleRule, value: string) => {
      setDisplayValues((prev) => ({
        ...prev,
        [`${vehicleType}_${field}`]: value,
      }));

      const numericValue =
        field === "price"
          ? parseCurrency(value)
          : Number(value.replace(/\D/g, "")) || 0;

      setPaymentConfig((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          rules: {
            ...prev.rules,
            [vehicleType]: {
              ...prev.rules[vehicleType],
              [field]: numericValue,
            },
          },
        };
      });
    },
    []
  );

  const getDisplayValue = (
    vehicleType: string,
    field: keyof VehicleRule,
    value: number
  ): string => {
    const key = `${vehicleType}_${field}`;
    if (displayValues[key] !== undefined) {
      return displayValues[key];
    }
    return field === "price" ? formatCurrency(value) : value.toString();
  };

  // Atualiza a tolerância
  const updateTolerance = useCallback((minutes: number) => {
    setPaymentConfig((prev) => {
      if (!prev) return null;
      return { ...prev, toleranceMinutes: minutes };
    });
  }, []);

  // Mostra modal de feedback
  const showModal = useCallback((message: string, isSuccess: boolean) => {
    setModalState({
      visible: true,
      message,
      isSuccess,
    });
  }, []);

  // Fecha modal
  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, visible: false }));
  }, []);

  // Função para converter string para VehicleCategory
  const toVehicleCategory = (value: string): VehicleCategory => {
    const lowerValue = value.toLowerCase();
    if (lowerValue === VehicleCategory.CARRO) return VehicleCategory.CARRO;
    if (lowerValue === VehicleCategory.MOTO) return VehicleCategory.MOTO;
    console.warn(
      `Tipo de veículo desconhecido: ${value}, usando CARRO como padrão`
    );
    return VehicleCategory.CARRO;
  };

  const handleSave = useCallback(async () => {
    if (!paymentConfig) {
      console.error("Nenhuma configuração para salvar");
      return;
    }

    setLoading((prev) => ({ ...prev, isSaving: true }));
    setError(null);

    try {
      const rules = Object.entries(paymentConfig.rules).map(
        ([vehicleType, rule]) => ({
          vehicle_type: vehicleType.toLowerCase() as VehicleCategory,
          price: rule.price,
          base_time_minutes: rule.base_time_minutes,
        })
      );

      const payload = {
        methodId: paymentConfig.methodName,
        toleranceMinutes: paymentConfig.toleranceMinutes,
        rules,
      };

      const { success, message } = await cashApi.methodSave(payload);

      if (!success) {
        throw new Error(message || "Falha ao salvar configuração");
      }

      showModal("Configuração salva com sucesso!", true);
      await loadActiveMethod();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao salvar configuração";
      console.error("Erro ao salvar:", errorMessage);
      showModal(errorMessage, false);
    } finally {
      setLoading((prev) => ({ ...prev, isSaving: false }));
    }
  }, [paymentConfig, loadActiveMethod]);

  // Efeito para inicialização
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Efeito para tratamento de erros
  useEffect(() => {
    if (error) {
      showModal(error, false);
    }
  }, [error]);

  return {
    // Estados
    paymentConfig,
    methods,
    activeMethod,
    isLoading: loading.isLoading,
    isSaving: loading.isSaving,
    modalState,
    vehicleTypes: VEHICLE_TYPES,

    // Métodos
    selectMethod,
    updateRule,
    updateTolerance,
    getDisplayValue,
    handleSave,
    closeModal,
  };
};