import { cashApi } from "@/src/api/cashService";
import { getCashStatus, saveCashStatus } from "@/src/context/cashStorage";
import { useState } from "react";

const useCashService = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatusCash = async () => {
    console.log("[useCashService] getStatusCash iniciado");
    setLoading(true);
    setError(null);

    try {
      const localStatus = await getCashStatus();
      console.log("[useCashService] Status local do caixa:", localStatus);

      if (localStatus === true) {
        console.log("[useCashService] Usando status local como TRUE");
        setIsOpen(true);
      } else {
        console.log("[useCashService] Status local é falso ou nulo, consultando API");
        const response = await cashApi.statusCash();
        console.log("[useCashService] Resposta da API statusCash:", response);
        setIsOpen(response.isOpen);
        await saveCashStatus(response.isOpen);
        console.log("[useCashService] Status salvo localmente:", response.isOpen);
      }
    } catch (err: any) {
      console.error("[useCashService] Erro ao buscar status do caixa:", err);
      setError("Erro ao verificar o status do caixa");
      setIsOpen(null);
    } finally {
      setLoading(false);
      console.log("[useCashService] getStatusCash finalizado");
    }
  };

  const postOpenCash = async (initialValue: number) => {
    console.log("[useCashService] postOpenCash iniciado com valor:", initialValue);
    setLoading(true);
    setError(null);

    try {
      const response = await cashApi.openCash(initialValue);
      console.log("[useCashService] Resposta da API openCash:", response);
      setIsOpen(response.isOpen);
      await saveCashStatus(response.isOpen);
      console.log("[useCashService] Status salvo localmente após abrir caixa:", response.isOpen);
    } catch (err: any) {
      console.error("[useCashService] Erro ao abrir o caixa:", err);
      setError("Erro ao abrir o caixa");
      setIsOpen(false);
      await saveCashStatus(false);
      console.log("[useCashService] Status salvo localmente como false após erro");
    } finally {
      setLoading(false);
      console.log("[useCashService] postOpenCash finalizado");
    }
  };

  return {
    getStatusCash,
    postOpenCash,
    loading,
    isOpen,
    error,
  };
};

export default useCashService;
