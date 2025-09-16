export interface Goal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  targetValue: number;
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
}
