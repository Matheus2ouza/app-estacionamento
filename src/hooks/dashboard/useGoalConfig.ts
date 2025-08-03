import { useState, useEffect } from 'react';
import { dashboardApi } from '@/src/api/dashboardService';
import { GoalConfig, ResponseGoalConfig } from '@/src/types/dashboard';

// Tipo para o estado local do formulário
interface FormGoalConfig {
  dailyGoal: string;
  vehicleGoal: string;
  productGoal: string;
  notificationsEnabled: boolean;
  goalPeriod: "DIARIA" | "SEMANAL" | "MENSAL";
  enableCategoryGoals: boolean;
  activeDays: {
    domingo: boolean;
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
  };
}

const useGoalConfig = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formConfig, setFormConfig] = useState<FormGoalConfig>({
    dailyGoal: '0',
    vehicleGoal: '0',
    productGoal: '0',
    notificationsEnabled: false,
    goalPeriod: 'DIARIA',
    enableCategoryGoals: false,
    activeDays: {
      domingo: false,
      segunda: false,
      terca: false,
      quarta: false,
      quinta: false,
      sexta: false,
      sabado: false,
    },
  });

  const [apiConfig, setApiConfig] = useState<GoalConfig | null>(null);

  // Converte de week_start_day e week_end_day para activeDays
  const convertDaysToActiveDays = (startDay: number, endDay: number): FormGoalConfig['activeDays'] => {
    const daysOrder = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const activeDays: FormGoalConfig['activeDays'] = {
      domingo: false,
      segunda: false,
      terca: false,
      quarta: false,
      quinta: false,
      sexta: false,
      sabado: false,
    };

    // Se startDay > endDay, significa que a semana "vira" (ex: sexta a segunda)
    if (startDay <= endDay) {
      for (let i = startDay; i <= endDay; i++) {
        activeDays[daysOrder[i] as keyof FormGoalConfig['activeDays']] = true;
      }
    } else {
      for (let i = startDay; i < 7; i++) {
        activeDays[daysOrder[i] as keyof FormGoalConfig['activeDays']] = true;
      }
      for (let i = 0; i <= endDay; i++) {
        activeDays[daysOrder[i] as keyof FormGoalConfig['activeDays']] = true;
      }
    }

    return activeDays;
  };

  // Converte de activeDays para week_start_day e week_end_day
  const convertActiveDaysToRange = (activeDays: FormGoalConfig['activeDays']) => {
    const daysOrder = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const activeDaysArray = daysOrder.map(day => activeDays[day as keyof typeof activeDays]);
    
    // Encontra o primeiro dia ativo
    const firstActiveIndex = activeDaysArray.findIndex(active => active);
    // Encontra o último dia ativo
    const lastActiveIndex = activeDaysArray.lastIndexOf(true);

    return {
      week_start_day: firstActiveIndex,
      week_end_day: lastActiveIndex
    };
  };


  // Carrega as configurações ao inicializar
  const fetchGoalConfig = async () => {
    try {
      setLoading(true);
      const response: ResponseGoalConfig = await dashboardApi.GoalConfig();
      
      if (response.success && response.config) {
        setApiConfig(response.config);
        
        // Converte os dias do banco para o formato activeDays
        const activeDays = convertDaysToActiveDays(
          response.config.week_start_day,
          response.config.week_end_day
        );

        setFormConfig({
          dailyGoal: response.config.daily_goal_value.toString(),
          vehicleGoal: response.config.vehicle_goal_quantity.toString(),
          productGoal: response.config.product_goal_quantity.toString(),
          notificationsEnabled: response.config.notifications_enabled,
          goalPeriod: response.config.goal_period,
          enableCategoryGoals: response.config.category_goals_active,
          activeDays,
        });
      }
      setError(null);
    } catch (err) {
      setError('Erro ao carregar configurações');
      console.error('Failed to fetch goal config:', err);
    } finally {
      setLoading(false);
    }
  };

  // Salva as configurações
  const saveGoalConfig = async (formData: FormGoalConfig) => {
    try {
      setLoading(true);
      
      // Converte activeDays para week_start_day e week_end_day
      const { week_start_day, week_end_day } = convertActiveDaysToRange(formData.activeDays);

      // Converte para o formato da API
      const data: GoalConfig = {
        daily_goal_value: Number(formData.dailyGoal),
        vehicle_goal_quantity: Number(formData.vehicleGoal),
        product_goal_quantity: Number(formData.productGoal),
        goal_period: formData.goalPeriod,
        notifications_enabled: formData.notificationsEnabled,
        category_goals_active: formData.enableCategoryGoals,
        week_start_day,
        week_end_day,
      };

      const response: ResponseGoalConfig = await dashboardApi.saveGoalConfig(data);
      
      if (response.success && response.config) {
        setApiConfig(response.config);
        // Atualiza o formulário com os dados retornados
        const activeDays = convertDaysToActiveDays(
          response.config.week_start_day,
          response.config.week_end_day
        );

        setFormConfig({
          dailyGoal: response.config.daily_goal_value.toString(),
          vehicleGoal: response.config.vehicle_goal_quantity.toString(),
          productGoal: response.config.product_goal_quantity.toString(),
          notificationsEnabled: response.config.notifications_enabled,
          goalPeriod: response.config.goal_period,
          enableCategoryGoals: response.config.category_goals_active,
          activeDays,
        });
      }
      
      return { 
        success: response.success, 
        message: response.success ? 'Configurações salvas com sucesso!' : 'Falha ao salvar configurações',
        data: response.config 
      };
    } catch (err) {
      console.error('Failed to save goal config:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao salvar configurações' 
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalConfig();
  }, []);

  return {
    formConfig,
    apiConfig,
    loading,
    error,
    fetchGoalConfig,
    saveGoalConfig,
  };
};

export default useGoalConfig;