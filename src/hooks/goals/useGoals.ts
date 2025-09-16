import { Goal, GoalFormData, GoalsConfiguration } from '@/src/types/goalsTypes/goals';
import { useCallback, useEffect, useState } from 'react';

export default function useGoals() {
  const [goals, setGoals] = useState<GoalsConfiguration>({
    dailyGoal: null,
    weeklyGoal: null,
    monthlyGoal: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Carregar metas do storage local (simulado)
  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados simulados - em produção viria do storage/API
      const mockGoals: GoalsConfiguration = {
        dailyGoal: {
          id: 'daily-1',
          type: 'daily',
          targetValue: 1000,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        weeklyGoal: {
          id: 'weekly-1',
          type: 'weekly',
          targetValue: 7000,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        monthlyGoal: {
          id: 'monthly-1',
          type: 'monthly',
          targetValue: 30000,
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      setGoals(mockGoals);
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
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const targetValue = parseFloat(formData.targetValue.replace(/[^\d,]/g, '').replace(',', '.'));
      
      if (isNaN(targetValue) || targetValue <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      
      const newGoal: Goal = {
        id: `${type}-${Date.now()}`,
        type,
        targetValue,
        isActive: formData.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setGoals(prev => ({
        ...prev,
        [`${type}Goal`]: newGoal,
      }));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar meta');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Atualizar meta existente
  const updateGoal = useCallback(async (type: 'daily' | 'weekly' | 'monthly', formData: GoalFormData) => {
    setSaving(true);
    setError(null);
    
    try {
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const targetValue = parseFloat(formData.targetValue.replace(/[^\d,]/g, '').replace(',', '.'));
      
      if (isNaN(targetValue) || targetValue <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      
      const currentGoal = goals[`${type}Goal` as keyof GoalsConfiguration];
      if (!currentGoal) {
        throw new Error('Meta não encontrada');
      }
      
      const updatedGoal: Goal = {
        ...currentGoal,
        targetValue,
        isActive: formData.isActive,
        updatedAt: new Date(),
      };
      
      setGoals(prev => ({
        ...prev,
        [`${type}Goal`]: updatedGoal,
      }));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar meta');
      return false;
    } finally {
      setSaving(false);
    }
  }, [goals]);

  // Deletar meta
  const deleteGoal = useCallback(async (type: 'daily' | 'weekly' | 'monthly') => {
    setSaving(true);
    setError(null);
    
    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGoals(prev => ({
        ...prev,
        [`${type}Goal`]: null,
      }));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar meta');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Carregar metas ao inicializar
  useEffect(() => {
    loadGoals();
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
