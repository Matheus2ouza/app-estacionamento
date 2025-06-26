import { PATIO_SPOTS } from "@/src/config/storage";
import { Spots } from "@/src/types/parking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";


export function usePatioConfig() {
  const [spots, setSpots] = useState<Spots>({
    car: "",
    motorcycle: "",
    largeCar: "",
  });

  // Carrega os dados do AsyncStorage quando o hook monta
  useEffect(() => {
    async function loadSpots() {
      try {
        const jsonValue = await AsyncStorage.getItem(PATIO_SPOTS);
        if (jsonValue != null) {
          const savedSpots: Spots = JSON.parse(jsonValue);
          setSpots(savedSpots);
        }
      } catch (e) {
        console.error("Erro ao carregar vagas do AsyncStorage:", e);
      }
    }
    loadSpots();
  }, []);

  const handleChange = (key: keyof Spots, value: string) => {
    setSpots((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    const { car, motorcycle, largeCar } = spots;

    // Verificação de campos vazios
    if (!car.trim() || !motorcycle.trim() || !largeCar.trim()) {
      Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
      return;
    }

    // Validação numérica
    const carNum = Number(car);
    const motoNum = Number(motorcycle);
    const largeCarNum = Number(largeCar);

    if (
      isNaN(carNum) || carNum < 0 ||
      isNaN(motoNum) || motoNum < 0 ||
      isNaN(largeCarNum) || largeCarNum < 0
    ) {
      Alert.alert("Erro", "Por favor, insira apenas números válidos e positivos.");
      return;
    }

    try {
      const jsonValue = JSON.stringify(spots);
      await AsyncStorage.setItem(PATIO_SPOTS, jsonValue);
      Alert.alert("Sucesso", "Suas configurações foram salvas.");
    } catch (e) {
      console.error("Erro ao salvar vagas no AsyncStorage:", e);
      Alert.alert("Erro", "Não foi possível salvar as configurações.");
    }
  };

  return {
    spots,
    handleChange,
    handleSave,
  };
}
