import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaymentConfig, BillingMethod } from "@/src/types/cash";
import { BILLING_METHODS, VEHICLE_TYPES } from "@/src/constants/BillingMethods";

const CONFIG_STORAGE_KEY = "@PaymentConfig";

export const usePaymentConfig = () => {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<BillingMethod | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configuração ao iniciar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await AsyncStorage.getItem(CONFIG_STORAGE_KEY);
        if (savedConfig) {
          const parsedConfig: PaymentConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
          
          // Encontrar método correspondente
          const method = BILLING_METHODS.find(m => m.id === parsedConfig.methodId);
          if (method) setSelectedMethod(method);
        }
      } catch (error) {
        console.error("Failed to load config", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Salvar configuração
  const saveConfig = async (newConfig: PaymentConfig) => {
    try {
      await AsyncStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
      return true;
    } catch (error) {
      console.error("Failed to save config", error);
      return false;
    }
  };

  // Atualizar valor específico
  const updateValue = (
    vehicleType: string,
    inputKey: string,
    value: string | number
  ) => {
    if (!config) return;

    const newConfig = { ...config };
    
    if (!newConfig.values[vehicleType]) {
      newConfig.values[vehicleType] = {};
    }
    
    newConfig.values[vehicleType][inputKey] = value;
    setConfig(newConfig);
  };

  // Atualizar valor global
  const updateGlobalValue = (inputKey: string, value: string | number) => {
    if (!config) return;

    const newConfig = { ...config };
    
    if (!newConfig.globalValues) {
      newConfig.globalValues = {};
    }
    
    newConfig.globalValues[inputKey] = value;
    setConfig(newConfig);
  };

  // Atualizar tolerância
  const updateTolerance = (minutes: number) => {
    if (!config) return;
    
    const newConfig = { ...config };
    newConfig.toleranceMinutes = minutes;
    setConfig(newConfig);
  };

  // Selecionar método
  const selectMethod = (methodId: string) => {
    const method = BILLING_METHODS.find(m => m.id === methodId);
    if (method) {
      setSelectedMethod(method);
      
      // Criar nova configuração se necessário
      if (!config || config.methodId !== methodId) {
        const newConfig: PaymentConfig = {
          methodId: method.id,
          values: {},
          globalValues: {}
        };
        setConfig(newConfig);
      }
    }
  };

  return {
    config,
    selectedMethod,
    isLoading,
    vehicleTypes: VEHICLE_TYPES,
    billingMethods: BILLING_METHODS,
    saveConfig,
    updateValue,
    updateGlobalValue,
    updateTolerance,
    selectMethod
  };
};