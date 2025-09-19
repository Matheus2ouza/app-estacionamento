export enum Period {
  DIARIA = 'DIARIA',
  SEMANAL = 'SEMANAL',
  MENSAL = 'MENSAL'
}

export interface Goal {
  id: string;
  goalPeriod: Period;
  goalValue: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalsConfiguration {
  dailyGoal: Goal | null;
  weeklyGoal: Goal | null;
  monthlyGoal: Goal | null;
}

export interface GoalFormData {
  targetValue: string;
  isActive: boolean;
}

export interface GoalType {
  key: 'daily' | 'weekly' | 'monthly';
  label: string;
  description: string;
  icon: string;
  iconFamily: 'FontAwesome' | 'Ionicons' | 'MaterialIcons' | 'FontAwesome5' | 'AntDesign' | 'Feather' | 'SimpleLineIcons' | 'Entypo';
  period: string;
  periodEnum: Period;
}

export interface CreateGoalData {
  goalPeriod: Period;
  goalValue: string;
  isActive: boolean;
}

// Tipos para resposta da API
export interface GoalApiResponse {
  data: GoalApiData[];
  message: string;
  success: boolean;
}

export interface GoalApiData {
  id: string;
  goalPeriod: Period;
  goalValue: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalApiResponseSimple {
  success: boolean;
  message?: string;
}

// Tipos para dados dos gráficos
export interface ChartResponse {
  success: boolean;
  data: Record<string, ChartInfo>;
  message?: string;
}

export interface ChartInfo {
  currentValue: number;
  progress: number;
  targetValue: number;
}

export type ChartType = 'goalProgress' | 'weeklyProfit';

export interface ChartData {
  period: Period;
  goalValue: number;
  currentValue: number;
  progress: number;
  dailyData?: DailyProfitData[];
  currentDay?: number;
  type: ChartType;
}

// Tipos para gráfico de lucro semanal
export interface WeeklyProfitData {
  period: Period;
  goalValue: number;
  currentValue: number;
  progress: number;
  dailyProfits: DailyProfitData[];
  currentDay: number;
}

export interface DailyProfitData {
  dayNumber: number; // 1-7 (segunda = 1, domingo = 7)
  dayName: string;
  profit: number;
}
