export type VehicleTransaction = {
  id: string;
  type: "vehicle";
  plate: string;
  operator: string;
  transaction_date: string; // ou Date, dependendo da conversão no front
  cash_register_id: string;
  original_amount: string;
  discount_amount: string;
  final_amount: string;
  amount_received: string;
  change_given: string;
  method: "DINHEIRO" | "PIX" | "CREDITO" | "DEBITO";
  photo: string | Uint8Array | { [key: string]: number } | null;
  photo_type: string | null;
};

export type ProductItem = {
  product_name: string;
  sold_quantity: number;
  unit_price: string;
};

export type ProductTransaction = {
  id: string;
  type: "product";
  operator: string;
  transaction_date: string; // ou Date
  cash_register_id: string;
  original_amount: string;
  discount_amount: string;
  final_amount: string;
  amount_received: string;
  change_given: string;
  method: "DINHEIRO" | "PIX" | "CREDITO" | "DEBITO";
  photo: string | Uint8Array | { [key: string]: number } | null;
  photo_type: string | null;
  items: ProductItem[];
};

export type Historic = {
  vehicles: VehicleTransaction[];
  products: ProductTransaction[];
};

export type ResponseHistoric = {
  success: boolean;
  message: string;
  data: Historic;
  error?: string;
};

export type ResponseSecondCopy = {
  success: boolean;
  message: string;
  receipt: string;
}


export type GoalConfig = {
  daily_goal_value: number;
  vehicle_goal_quantity: number;
  product_goal_quantity: number;
  goal_period: "DIARIA" | "SEMANAL" | "MENSAL";
  notifications_enabled: boolean;
  category_goals_active: boolean;
  week_start_day: number;
  week_end_day: number
};

export type ResponseGoalConfig = {
  success: boolean;
  config: GoalConfig;
};

export type BasicDataCash = {
  totalCash: string;
  statusCash: string;
  openingTimeCash: string;
  closingTimeCash: string | null;
  operatorCash: string;
  transactionsCash: number;
};

export type PaymentMethodCounts = {
  PIX: number;
  DINHEIRO: number;
  DEBITO: number;
  CREDITO: number;
};

export type CategorySales = {
  CARRO: { quantidade: number; valor: number };
  MOTO: { quantidade: number; valor: number };
  PRODUTOS: { quantidade: number; valor: number };
};

export type GoalProgress = {
  periodo: 'DIARIA' | 'SEMANAL' | 'MENSAL';
  meta: number;
  realizado: number;
  progresso: number;
};

export type GraficoSemanalItem = {
  diaSemana: number; // 0 = domingo, 1 = segunda, ..., 6 = sábado
  valor: number;
};

export type ResponseDetailsCash = {
  success: boolean;
  message: string;
  data: {
    basicDataCash: BasicDataCash;
    paymentMethodCounts: PaymentMethodCounts;
    categorySales: CategorySales;
    goalProgress: GoalProgress;
    graficoSemanal: GraficoSemanalItem[];
  };
  goalConfigs: GoalConfig;
  warnings?: string[];
  error?: string;
};