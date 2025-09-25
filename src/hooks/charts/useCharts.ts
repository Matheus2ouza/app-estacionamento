import { DashboardApi } from '@/api/dashboard';
import { ChartResponse, Period } from '@/types/goalsTypes/goals';
import { useCallback, useState } from 'react';

export interface GenerateChartsData {
  selectedPeriod: Period | null;
  selectedCharts: string[];
  goalValue: number;
}

export default function useCharts() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gerar gráficos
  const generateCharts = useCallback(async (data: GenerateChartsData) => {
    setGenerating(true);
    setError(null);
    
    try {
      if (!data.selectedPeriod || data.selectedCharts.length === 0) {
        throw new Error('Selecione um período e pelo menos um gráfico');
      }

      // Chamar a API específica para gráficos
      const response: ChartResponse = await DashboardApi.getCharts(data.selectedPeriod, data.selectedCharts);

      console.log("🟢 [useCharts] Resposta da API:", response);

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar gráficos');
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  return {
    generating,
    error,
    generateCharts,
  };
}
