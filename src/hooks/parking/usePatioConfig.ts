import { ParkingApi } from "@/src/api/parkingService";
import { Spots } from "@/src/types/parking";
import { useEffect, useState } from "react";

export function usePatioConfig() {
  const [spots, setSpots] = useState<Spots>({
    car: "",
    motorcycle: "",
    largeCar: "",
  });

  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);

  useEffect(() => {
    async function loadSpots() {
      setLoading(true)
      try {
        const response = await ParkingApi.getConfigParking();

        if (!response.success) {
          setModalMessage(response.message || "Erro ao carregar configuração.");
          setModalIsSuccess(false);
          setModalVisible(true);
          return;
        }

        const config = response.config;

        setSpots({
          car: String(config.maxCars),
          motorcycle: String(config.maxMotorcycles),
          largeCar: String(config.maxLargeVehicles),
        });
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Não foi possível carregar as configurações.";
        console.error("Erro ao buscar configuração do pátio:", error);
        setModalMessage(message);
        setModalIsSuccess(false);
        setModalVisible(true);
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

  const handleSave = async () => {
    const { car, motorcycle, largeCar } = spots;

    const carNum = Number(car);
    const motoNum = Number(motorcycle);
    const largeCarNum = Number(largeCar);

    if (
      isNaN(carNum) || carNum < 0 ||
      isNaN(motoNum) || motoNum < 0 ||
      isNaN(largeCarNum) || largeCarNum < 0
    ) {
      setModalMessage("Por favor, insira apenas números válidos e positivos.");
      setModalIsSuccess(false);
      setModalVisible(true);
      return;
    }

    try {
      const response = await ParkingApi.configParking({
        maxCars: carNum,
        maxMotorcycles: motoNum,
        maxLargeVehicles: largeCarNum,
      });

      const success = response.success;
      const message = response.message || (success
        ? "Configuração atualizada com sucesso!"
        : "Erro ao salvar configuração.");

      setModalMessage(message);
      setModalIsSuccess(success);
      setModalVisible(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Não foi possível salvar a configuração.";
      console.error("Erro ao salvar configuração do pátio:", error);
      setModalMessage(message);
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  };

  return {
    spots,
    loading,
    handleChange,
    handleSave,
    modalVisible,
    modalMessage,
    modalIsSuccess,
    closeModal: () => setModalVisible(false),
  };
}
