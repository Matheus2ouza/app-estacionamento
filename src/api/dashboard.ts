import { GenerateDashboardData, responseDashboard } from "../types/dashboard/dashboard";
import { CreateGoalData, GoalApiResponse, GoalApiResponseSimple, Period } from "../types/goalsTypes/goals";
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

    const url = `/dashboard/reports?${params.toString()}`;
    const response = await axiosInstance.get(url);
    
    return response.data;
  },

  listGoals: async (): Promise<GoalApiResponse> => {
    const response = await axiosInstance.get('/dashboard/goals');
    return response.data;
  },

  createGoal: async (data: CreateGoalData): Promise<GoalApiResponseSimple> => {
    const params = new URLSearchParams();
    params.append('goalPeriod', data.goalPeriod);
    params.append('goalValue', data.goalValue);
    params.append('isActive', data.isActive ? 'true' : 'false');
    
    const response = await axiosInstance.post('/dashboard/goals', null, { params });
    return response.data;
  },

  desactivateGoal: async (goalPeriod: Period): Promise<GoalApiResponseSimple> => {
    const params = new URLSearchParams();
    params.append('goalPeriod', goalPeriod);
    const response = await axiosInstance.put('/dashboard/goals', null, { params });
    return response.data;
  },

  getCharts: async (goalPeriod: Period, charts: string[]): Promise<any> => {
    const params = new URLSearchParams();
    params.append('goalPeriod', goalPeriod);
    params.append('charts', charts.join(','));
    
    const response = await axiosInstance.get(`/dashboard/goals/charts?${params.toString()}`);
    return response.data;
  },
}