import { PAYMENT_CONFIG } from "@/src/config/storage"; // importa a chave específica
import { METHODS } from "@/src/constants/BillingMethods";
import { BillingMethod, PaymentConfig } from "@/src/types/cash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const VEHICLE_TYPES = [
  { key: "car", label: "Carro" },
  { key: "motorcycle", label: "Moto" },
  { key: "largeCar", label: "Carro Grande" },
];

export function usePaymentConfig() {
  const [config, setConfig] = useState<PaymentConfig | null>(null);

  const buildConfig = (
    selectedMethod: BillingMethod,
    inputValues: Record<string, string>
  ): PaymentConfig => {
    const tolerance = parseFloat(inputValues["global_tolerancia"]);
    const values: PaymentConfig["values"] = {};

    VEHICLE_TYPES.forEach((vehicle) => {
      values[vehicle.key] = {};

      selectedMethod.inputs.forEach((input) => {
        const key = `${vehicle.key}_${input.key}`;
        const value = parseFloat(inputValues[key]);
        values[vehicle.key][input.key] = isNaN(value) ? 0 : value;
      });
    });

    if (selectedMethod.extraInput) {
      const extraKey = selectedMethod.extraInput.key;
      const fullKey = `global_${extraKey}`;
      const parsed = parseFloat(inputValues[fullKey]);
      if (!values["global"]) values["global"] = {};
      values["global"][extraKey] = isNaN(parsed) ? 0 : parsed;
    }

    return {
      method: selectedMethod.value,
      tolerance: isNaN(tolerance) ? 0 : tolerance,
      values,
    };
  };

  const saveConfig = async (config: PaymentConfig) => {
    if (!config || typeof config !== "object") {
      console.warn("Configuração inválida. Nada foi salvo.");
      return;
    }

    try {
      const json = JSON.stringify(config);
      if (!json || json === "null") throw new Error("Configuração inválida para salvar.");
      await AsyncStorage.setItem(PAYMENT_CONFIG, json);  // usa a constante
      setConfig(config);
    } catch (err) {
      console.error("Erro ao salvar configuração:", err);
    }
  };

  const loadConfig = async () => {
    try {
      const json = await AsyncStorage.getItem(PAYMENT_CONFIG);  // usa a constante
      if (json) {
        const parsed = JSON.parse(json) as PaymentConfig;
        setConfig(parsed);
        return parsed;
      }
    } catch (err) {
      console.error("Erro ao carregar configuração:", err);
    }
    return null;
  };

  const restoreConfig = async (
    setMethodValue: (Method: string) => void,
    setInputValues: (values: Record<string, string>) => void
  ) => {
    const config = await loadConfig();
    if (!config) return;

    const restoredValues: Record<string, string> = {};

    Object.entries(config.values).forEach(([vehicleKey, inputGroup]) => {
      Object.entries(inputGroup).forEach(([inputKey, value]) => {
        restoredValues[`${vehicleKey}_${inputKey}`] = String(value);
      });
    });

    restoredValues["global_tolerancia"] = String(config.tolerance ?? 0);

    const methodDef = METHODS.find((method) => method.value === config.method);
    if (methodDef?.extraInput) {
      const key = `global_${methodDef.extraInput.key}`;
      const value = config.values["global"]?.[methodDef.extraInput.key];
      if (value !== undefined) {
        restoredValues[key] = String(value);
      }
    }

    setMethodValue(config.method);
    setInputValues(restoredValues);
  };

  return {
    config,
    buildConfig,
    saveConfig,
    loadConfig,
    restoreConfig,
  };
}
