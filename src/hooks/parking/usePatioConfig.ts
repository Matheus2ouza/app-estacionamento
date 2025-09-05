import { ParkingApi } from "@/src/api/parkingService";
import { Spots } from "@/src/types/parking";
import { useEffect, useState } from "react";

export function usePatioConfig() {
  const [spots, setSpots] = useState<Spots>({
    car: "",
    motorcycle: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpots() {
      setLoading(true);
      setError(null);
      try {
        const response = await ParkingApi.getConfigParking();

        if (!response.success) {
          const errorMessage = response.message || "Erro ao carregar configuração";
          setError(errorMessage);
          console.error("Erro ao carregar configuração:", errorMessage);
          return;
        }

        const config = response.data;
        console.log(config);

        setSpots({
          car: String(config.maxCars),
          motorcycle: String(config.maxMotorcycles),
        });
        setError(null);
      } catch (error: any) {
        if(error.response?.data.status === 404 || error.response?.status === 404) {
          setSpots({
            car: "0",
            motorcycle: "0",
          })
          setError(null);
          return;
        }
        const message =
          error?.response?.data?.message || "Não foi possível carregar as configurações.";
        setError(message);
        console.error("Erro ao buscar configuração do pátio:", message);
      } finally {
        setLoading(false);
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

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ParkingApi.getConfigParking();

      if (!response.success) {
        const errorMessage = response.message || "Erro ao recarregar configuração";
        setError(errorMessage);
        console.error("Erro ao recarregar configuração:", errorMessage);
        return;
      }

      const config = response.data;
      console.log(config);

      setSpots({
        car: String(config.maxCars),
        motorcycle: String(config.maxMotorcycles),
      });
      setError(null);
    } catch (error: any) {
      if(error.response?.data.status === 404 || error.response?.status === 404) {
        setSpots({
          car: "0",
          motorcycle: "0",
        })
        setError(null);
        return;
      }
      const message =
        error?.response?.data?.message || "Não foi possível recarregar as configurações.";
      setError(message);
      console.error("Erro ao recarregar configuração do pátio:", message);
    } finally {
      setLoading(false);
    }
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
    error,
    handleChange,
    handleSave,
    refreshData,
  };
}
