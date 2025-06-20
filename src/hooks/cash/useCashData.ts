import { getCashData } from "@/src/api/cashService";
import { CashData } from "@/src/types/cash";
import { useEffect, useState } from "react";

export function useCashData() {
  const [data, setData] = useState<CashData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchCashData() {
    setLoading(true);
    setError(null);

    try {
      const data = await getCashData();
      setData(data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar dados do caixa");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCashData();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchCashData,
  };
}
