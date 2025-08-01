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
    console.log("[useCreatePayment] Iniciando loadMethods");
    setLoading((prev) => ({ ...prev, isLoading: true }));
    setError(null);

    try {
      console.log("[useCreatePayment] Chamando cashApi.getBillingMethods()");
      const response = await cashApi.getBillingMethods();
      console.log("[useCreatePayment] Resposta completa da API:", response);

      if (!response) {
        throw new Error("Resposta da API inválida");
      }

      // Corrigido: Acessa response.data primeiro
      const { success, data: methods = [], message } = response;

      console.log("[useCreatePayment] Dados processados:", {
        success,
        methods,
        message,
        responseData: response.data, // Log adicional para debug
      });

      if (success) {
        if (!Array.isArray(methods)) {
          console.error("[useCreatePayment] Métodos não é um array:", methods);
          throw new Error(
            "Formato de dados inválido: métodos deve ser um array"
          );
        }

        const formattedMethods = methods.map((m) => {
          console.log(`[useCreatePayment] Processando método`, m);
          return {
            id: m.id,
            name: m.name,
            description: m.description,
            tolerance: m.tolerance,
            is_active: m.is_active || false, // Adiciona valor padrão
            billing_rule: Array.isArray(m.billing_rule) ? m.billing_rule : [],
          };
        });

        console.log("[useCreatePayment] Métodos formatados:", formattedMethods);
        setMethods(formattedMethods);

        if (formattedMethods.length === 0) {
          console.warn("[useCreatePayment] Nenhum método retornado pela API");
        }

        return formattedMethods;
      }
      throw new Error(message || "Falha ao carregar métodos de cobrança");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      console.error("[useCreatePayment] Erro ao carregar métodos:", {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(errorMessage);
      throw err;
    } finally {
      console.log("[useCreatePayment] Finalizando loadMethods");
      setLoading((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Carrega o método ativo
  const loadActiveMethod = useCallback(async () => {
    console.log("[useCreatePayment] Iniciando loadActiveMethod");
    setLoading((prev) => ({ ...prev, isLoading: true }));
    setError(null);

    try {
      console.log(
        "[useCreatePayment] Chamando cashApi.getBillingMethodsActive()"
      );
      const response = await cashApi.getBillingMethodsActive();
      console.log(
        "[useCreatePayment] Resposta completa da API (ativo):",
        response
      );

      if (!response) {
        throw new Error("Resposta da API inválida");
      }

      // Mantém o acesso a response.data que já estava correto
      const { success, data, message } = response;

      if (success && data) {
        console.log("[useCreatePayment] Método ativo encontrado:", {
          method: data.method,
          rulesCount: data.rules?.length || 0,
          fullData: data, // Log adicional
        });

        if (data.rules && !Array.isArray(data.rules)) {
          console.error(
            "[useCreatePayment] Regras do método ativo não são um array:",
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
      console.error("[useCreatePayment] Erro ao carregar método ativo:", {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(errorMessage);
      throw err;
    } finally {
      console.log("[useCreatePayment] Finalizando loadActiveMethod");
      setLoading((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Inicializa os dados
  const initializeData = useCallback(async () => {
    console.log("[useCreatePayment] Iniciando initializeData");
    try {
      console.log("[useCreatePayment] Carregando métodos e método ativo...");
      const [loadedMethods, activeMethodData] = await Promise.all([
        loadMethods(),
        loadActiveMethod(),
      ]);

      console.log("[useCreatePayment] Dados carregados:", {
        methodsCount: loadedMethods.length,
        activeMethod: activeMethodData
          ? activeMethodData.method.name
          : "Nenhum",
      });

      // Se existir método ativo mas não estiver na lista de métodos, adiciona
      if (
        activeMethodData &&
        !loadedMethods.some((m) => m.id === activeMethodData.method.id)
      ) {
        console.log(
          "[useCreatePayment] Adicionando método ativo à lista de métodos"
        );
        setMethods((prev) => [
          ...prev,
          {
            ...activeMethodData.method,
            is_active: true, // Garante que está ativo
            billing_rule: activeMethodData.rules || [],
          },
        ]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Falha ao carregar configurações";
      console.error("[useCreatePayment] Erro na inicialização:", {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });
      showModal(errorMessage, false);
    }
  }, [loadMethods, loadActiveMethod]);

  // Seleciona um método de cobrança
  const selectMethod = useCallback((method: BillingMethodWithRules) => {
    console.log(
      "[useCreatePayment] Selecionando método:",
      method.id,
      method.name
    );
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
      methodName: method.name, // Garanta que methodName está sendo setado
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
      console.log(
        `[useCreatePayment] Atualizando regra ${vehicleType}.${field} para ${value}`
      );

      // Atualiza o valor de exibição
      setDisplayValues((prev) => ({
        ...prev,
        [`${vehicleType}_${field}`]: value,
      }));

      // Converte para número quando for preço
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

    // Se já tiver um valor de exibição, retorna ele
    if (displayValues[key] !== undefined) {
      return displayValues[key];
    }

    // Caso contrário, formata o valor numérico
    return field === "price" ? formatCurrency(value) : value.toString();
  };
  // Atualiza a tolerância
  const updateTolerance = useCallback((minutes: number) => {
    console.log(
      `[useCreatePayment] Atualizando tolerância para ${minutes} minutos`
    );
    setPaymentConfig((prev) => {
      if (!prev) return null;
      return { ...prev, toleranceMinutes: minutes };
    });
  }, []);

  // Mostra modal de feedback
  const showModal = useCallback((message: string, isSuccess: boolean) => {
    console.log(
      `[useCreatePayment] Mostrando modal: ${message} (sucesso: ${isSuccess})`
    );
    setModalState({
      visible: true,
      message,
      isSuccess,
    });
  }, []);

  // Fecha modal
  const closeModal = useCallback(() => {
    console.log("[useCreatePayment] Fechando modal");
    setModalState((prev) => ({ ...prev, visible: false }));
  }, []);

  // Função para converter string para VehicleCategory
  const toVehicleCategory = (value: string): VehicleCategory => {
    const lowerValue = value.toLowerCase();
    console.log(`[useCreatePayment] Convertendo ${value} para VehicleCategory`);
    if (lowerValue === VehicleCategory.CARRO) return VehicleCategory.CARRO;
    if (lowerValue === VehicleCategory.MOTO) return VehicleCategory.MOTO;
    console.warn(
      `[useCreatePayment] Tipo de veículo desconhecido: ${value}, usando CARRO como padrão`
    );
    return VehicleCategory.CARRO;
  };

  const handleSave = useCallback(async () => {
    console.log("[useCreatePayment] Iniciando handleSave");
    if (!paymentConfig) {
      console.error("[useCreatePayment] Nenhuma configuração para salvar");
      return;
    }

    setLoading((prev) => ({ ...prev, isSaving: true }));
    setError(null);

    try {
      console.log("[useCreatePayment] Preparando payload:", paymentConfig);

      // Formata as regras conforme esperado pelo backend
      const rules = Object.entries(paymentConfig.rules).map(
        ([vehicleType, rule]) => {
          console.log(
            `[useCreatePayment] Processando regra para ${vehicleType}:`,
            rule
          );
          return {
            vehicle_type: vehicleType.toLowerCase() as VehicleCategory, // Aqui está a correção
            price: rule.price,
            base_time_minutes: rule.base_time_minutes,
          };
        }
      );

      const payload = {
        methodId: paymentConfig.methodName,
        toleranceMinutes: paymentConfig.toleranceMinutes,
        rules,
      };

      console.log("[useCreatePayment] Payload final:", payload);

      console.log("[useCreatePayment] Chamando cashApi.methodSave()");
      const { success, message } = await cashApi.methodSave(payload);

      console.log("[useCreatePayment] Resposta da API:", { success, message });

      if (!success) {
        throw new Error(message || "Falha ao salvar configuração");
      }

      showModal("Configuração salva com sucesso!", true);
      console.log("[useCreatePayment] Recarregando método ativo...");
      await loadActiveMethod();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao salvar configuração";
      console.error("[useCreatePayment] Erro ao salvar:", errorMessage);
      showModal(errorMessage, false);
    } finally {
      console.log("[useCreatePayment] Finalizando handleSave");
      setLoading((prev) => ({ ...prev, isSaving: false }));
    }
  }, [paymentConfig, loadActiveMethod]);

  // Efeito para inicialização
  useEffect(() => {
    console.log("[useCreatePayment] Efeito de inicialização");
    initializeData();
  }, [initializeData]);

  // Efeito para tratamento de erros
  useEffect(() => {
    if (error) {
      console.log("[useCreatePayment] Erro detectado:", error);
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
