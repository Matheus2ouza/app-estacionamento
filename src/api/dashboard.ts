import { GenerateDashboardData, responseDashboard } from "../types/dashboard/dashboard";
import axiosInstance from "./axiosInstance";

export const DashboardApi = {
  generateDashboard: async (data: GenerateDashboardData): Promise<responseDashboard> => {
    const params = new URLSearchParams();
    
    // Adicionar parâmetros obrigatórios
    params.append('pdf', data.pdf.toString());
    
    // Adicionar parâmetros opcionais
    if (data.reportType) {
      params.append('type', data.reportType);
    }
    
    if (data.startDate) {
      params.append('startDate', data.startDate);
    }
    
    if (data.endDate) {
      params.append('endDate', data.endDate);
    }
    
    if (data.includeDetails !== undefined) {
      params.append('details', data.includeDetails.toString());
    }
    
    if (data.selectedCharts && data.selectedCharts.length > 0) {
      params.append('charts', data.selectedCharts.join(','));
    }

    const response = await axiosInstance.get(`/dashboard/reports?${params.toString()}`);
    return response.data;
  }
}