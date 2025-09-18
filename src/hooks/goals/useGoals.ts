import { DashboardApi } from '@/api/dashboard';
import { CreateGoalData, GoalApiData, GoalFormData, GoalsConfiguration, Period } from '@/types/goalsTypes/goals';
import { parseBrazilianCurrency } from '@/utils/dateUtils';
import { useCallback, useState } from 'react';

export default function useGoals() {
  const [goals, setGoals] = useState<GoalsConfiguration>({
    dailyGoal: null,
    weeklyGoal: null,
    monthlyGoal: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Carregar metas da API
  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await DashboardApi.listGoals();
      
      // A API retorna {data: [...], message: "...", success: true}
      const goalsArray = response.data || [];
      
      // Converter array para GoalsConfiguration
      const goalsConfig: GoalsConfiguration = {
        dailyGoal: null,
        weeklyGoal: null,
        monthlyGoal: null,
      };
      
      goalsArray.forEach((goal: GoalApiData) => {
        const goalData = {
          id: goal.id,
          goalPeriod: goal.goalPeriod,
          goalValue: parseFloat(goal.goalValue),
          isActive: goal.isActive,
          createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
          updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : new Date(),
        };
        
        switch (goal.goalPeriod) {
          case 'DIARIA':
            goalsConfig.dailyGoal = goalData;
            break;
          case 'SEMANAL':
            goalsConfig.weeklyGoal = goalData;
            break;
          case 'MENSAL':
            goalsConfig.monthlyGoal = goalData;
            break;
        }
      });
      
      setGoals(goalsConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar meta
  const saveGoal = useCallback(async (type: 'daily' | 'weekly' | 'monthly', formData: GoalFormData) => {
    setSaving(true);
    setError(null);
    
    try {
      const targetValue = parseFloat(formData.targetValue.replace(/[^\d,]/g, '').replace(',', '.'));
      
      if (isNaN(targetValue) || targetValue <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }

      // Mapear tipo para enum Period
      const periodMap: Record<string, Period> = {
        daily: Period.DIARIA,
        weekly: Period.SEMANAL,
        monthly: Period.MENSAL,
      };

      const createGoalData: CreateGoalData = {
        goalPeriod: periodMap[type],
        goalValue: parseBrazilianCurrency(formData.targetValue).toString(),
        isActive: formData.isActive,
      };

      const result = await DashboardApi.createGoal(createGoalData);
      
      if (result.success) {
        // Recarregar metas após salvar
        await loadGoals();
        // Pequeno delay para renderizar as mudanças na tela
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
      } else {
        throw new Error(result.message || 'Erro ao salvar meta');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar meta');
      return false;
    } finally {
      setSaving(false);
    }
  }, [loadGoals]);

  // Atualizar meta existente (mesmo comportamento que salvar, pois a API cria/atualiza)
  const updateGoal = useCallback(async (type: 'daily' | 'weekly' | 'monthly', formData: GoalFormData) => {
    // Para simplificar, usar a mesma lógica de saveGoal
    return await saveGoal(type, formData);
  }, [saveGoal]);

  // Desativar meta usando rota específica
  const deleteGoal = useCallback(async (type: 'daily' | 'weekly' | 'monthly') => {
    setSaving(true);
    setError(null);
    
    try {
      const periodMap: Record<string, Period> = {
        daily: Period.DIARIA,
        weekly: Period.SEMANAL,
        monthly: Period.MENSAL,
      };

      const result = await DashboardApi.desactivateGoal(periodMap[type]);
      
      if (result.success) {
        await loadGoals();
        // Pequeno delay para renderizar as mudanças na tela
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
      } else {
        throw new Error(result.message || 'Erro ao desativar meta');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desativar meta');
      return false;
    } finally {
      setSaving(false);
    }
  }, [loadGoals]);


  return {
    goals,
    loading,
    error,
    saving,
    loadGoals,
    saveGoal,
    updateGoal,
    deleteGoal,
  };
}
