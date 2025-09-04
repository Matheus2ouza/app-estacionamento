import { ParkingApi } from "@/src/api/parkingService";
import { Spots } from "@/src/types/parking";
import { useEffect, useState } from "react";

export function usePatioConfig() {
  const [spots, setSpots] = useState<Spots>({
    car: "",
    motorcycle: "",
  });

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSpots() {
      setLoading(true)
      try {
        const response = await ParkingApi.getConfigParking();

        if (!response.success) {
          console.error("Erro ao carregar configuração:", response.message);
          return;
        }

        const config = response.config;

        setSpots({
          car: String(config.maxCars),
          motorcycle: String(config.maxMotorcycles),
        });
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Não foi possível carregar as configurações.";
        console.error("Erro ao buscar configuração do pátio:", message);
      } finally {
        setLoading(false)
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

  const handleSave = async (): Promise<{ success: boolean; message: string }> => {
    const { car, motorcycle } = spots;

    const carNum = Number(car);
    const motoNum = Number(motorcycle);

    if (
      isNaN(carNum) || carNum < 0 ||
      isNaN(motoNum) || motoNum < 0
    ) {
      return {
        success: false,
        message: "Por favor, insira apenas números válidos e positivos."
      };
    }

    try {
      const response = await ParkingApi.configParking({
        maxCars: carNum,
        maxMotorcycles: motoNum,
      });

      const success = response.success;
      const message = response.message || (success
        ? "Configuração atualizada com sucesso!"
        : "Erro ao salvar configuração.");

      return { success, message };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Não foi possível salvar a configuração.";
      console.error("Erro ao salvar configuração do pátio:", message);
      return { success: false, message };
    }
  };

  return {
    spots,
    loading,
    handleChange,
    handleSave,
  };
}
