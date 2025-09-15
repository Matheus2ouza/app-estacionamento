import { GenerateDashboardData, responseDashboard } from "../types/dashboard/dashboard";
import axiosInstance from "./axiosInstance";

export const DashboardApi = {
  generateDashboard: async (data: GenerateDashboardData): Promise<responseDashboard> => {
    console.log("🔵 [DashboardApi] Dados recebidos:", data);
    console.log("🔵 [DashboardApi] Tipo dos dados:", typeof data);
    
    const params = new URLSearchParams();
    
    // Adicionar parâmetros obrigatórios
    params.append('pdf', data.pdf.toString());
    console.log("🔵 [DashboardApi] PDF adicionado:", data.pdf);
    
    // Adicionar parâmetros opcionais
    if (data.reportType) {
      params.append('type', data.reportType);
      console.log("🔵 [DashboardApi] ReportType adicionado:", data.reportType);
    }
    
    if (data.startDate) {
      params.append('startDate', data.startDate);
      console.log("🔵 [DashboardApi] StartDate adicionado:", data.startDate);
    }
    
    if (data.endDate) {
      params.append('endDate', data.endDate);
      console.log("🔵 [DashboardApi] EndDate adicionado:", data.endDate);
    }
    
    if (data.includeDetails !== undefined) {
      params.append('details', data.includeDetails.toString());
      console.log("🔵 [DashboardApi] IncludeDetails adicionado:", data.includeDetails);
    }
    
    if (data.selectedCharts && data.selectedCharts.length > 0) {
      params.append('charts', data.selectedCharts.join(','));
      console.log("🔵 [DashboardApi] SelectedCharts adicionado:", data.selectedCharts);
    }

    const url = `/dashboard/reports?${params.toString()}`;
    console.log("🔵 [DashboardApi] URL final:", url);
    console.log("🔵 [DashboardApi] Params finais:", params.toString());

    const response = await axiosInstance.get(url);
    
    console.log("🟢 [DashboardApi] Resposta recebida:", response.data);
    console.log("🟢 [DashboardApi] Status da resposta:", response.status);
    
    return response.data;
  }
}