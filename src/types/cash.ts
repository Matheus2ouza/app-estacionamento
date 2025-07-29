export interface CashData {
  initialAmount: number;
  cash: number;
  card: number;
  pix: number;
  expenses: number;
  total: number;
}

export enum VehicleCategory {
  CARRO = "CARRO",
  MOTO = "MOTO"
}

export interface BillingInput {
  key: string;
  label: string;
  placeholder: string;
  type?: 'number' | 'text';
}

// Tipagem para o billingMethodService
export type BillingMethodWithRules = {
  id?: string; // Opcional se estiver usando name como fallback
  name: string;
  description: string;
  tolerance: number | null;
  billing_rule?: Array<{
    vehicle_type: VehicleCategory;
    price: number;
    base_time_minutes: number;
  }>;
};

// Tipagem para o methodActiveService
export interface ActiveBillingRuleWithMethod {
  id: string;
  price: number;
  base_time_minutes: number;
  vehicle_type: VehicleCategory;
  billing_method_id: string;
  created_at: string;
  updated_at: string;
  billing_method: {
    id: string;
    name: string;
    description: string;
    tolerance: number | null;
  };
}

// Tipos básicos para métodos e regras
export interface BillingMethod {
  id: string;
  name: string;
  description: string;
  tolerance: number | null;
}

export interface BillingRule {
  id: string;
  price: number;
  base_time_minutes: number;
  vehicle_type: VehicleCategory;
  created_at: string;
  updated_at: string;
  billing_method_id?: string; // Opcional pois nem sempre vem no relacionamento
}

export interface PaymentConfig {
  methodId: string;
  toleranceMinutes?: number;
  rules: {
    [vehicleType in VehicleCategory]?: {
      price: number;
      base_time_minutes: number;
    };
  };
}

// Tipos para o caixa (mantidos conforme estava)
export interface CashDetails {
  id: string;
  openingDate: string;
  closingDate?: string;
  status: string;
  operator: string;
  initialValue: number;
  finalValue: number;
  totalValue: number;
  vehicleEntryTotal: number;
  generalSaleTotal: number;
  outgoingExpenseTotal: number;
}

export type CashStatus = {
  success: boolean;
  cash?: CashDetails | null;
  message?: string;
};

export interface CashHome {
  initialValue: number;
  totalCash: number;
  totalCredit: number;
  totalDebit: number;
  totalPix: number;
  outgoingExpenseTotal: number;
  finalValue: number;
}

export interface ResponseCashHome {
  success: boolean;
  message: string;
  data: CashHome;
}

export type ResponseGeralCashData = {
  success: boolean;
  message: string;
  data: CashDetails;
  error?: string;
};