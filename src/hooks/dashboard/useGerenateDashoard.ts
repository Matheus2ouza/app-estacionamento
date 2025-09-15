import { useState } from "react";
import { DashboardApi } from "../../api/dashboard";
import { GenerateDashboardData } from "../../types/dashboard/dashboard";

export function useGeranateDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const generateDashboard = async (data: GenerateDashboardData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setMessage(null);

      console.log("🔵 [useGerenateDashboard] Dados enviados para API:", data);
      console.log("🔵 [useGerenateDashboard] Tipo dos dados:", typeof data);
      console.log("🔵 [useGerenateDashboard] Dados serializados:", JSON.stringify(data, null, 2));

      const response = await DashboardApi.generateDashboard(data);
      
      console.log("🟢 [useGerenateDashboard] Resposta da API:", response);
      console.log("🟢 [useGerenateDashboard] Success:", response.success);
      console.log("🟢 [useGerenateDashboard] Message:", response.message);
      console.log("🟢 [useGerenateDashboard] Data existe:", !!response.data);
      
      if (response.data) {
        console.log("🟢 [useGerenateDashboard] Data.report existe:", !!response.data.report);
        console.log("🟢 [useGerenateDashboard] Data.pdf existe:", !!response.data.pdf);
        if (response.data.report) {
          console.log("🟢 [useGerenateDashboard] Report type:", response.data.report.type);
          console.log("🟢 [useGerenateDashboard] Report summary existe:", !!response.data.report.summary);
          console.log("🟢 [useGerenateDashboard] Report cashRegisters length:", response.data.report.cashRegisters?.length);
        }
      }
      
      if (response.success) {
        setSuccess(true);
        setMessage(response.message || "Relatório gerado com sucesso!");
        console.log("🟢 [useGerenateDashboard] Retornando dados:", response.data);
        return response.data;
      } else {
        setError(response.message || "Erro ao gerar relatório");
        console.log("🔴 [useGerenateDashboard] Erro na resposta:", response.message);
        return null;
      }
    } catch (err) {
      setError("Erro ao gerar relatório. Tente novamente.");
      console.error("🔴 [useGerenateDashboard] Erro ao gerar relatório:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    message,
    generateDashboard,
  };
}