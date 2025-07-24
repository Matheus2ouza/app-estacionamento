
export interface CashData {
  initialAmount: number;
  cash: number;
  card: number;
  pix: number;
  expenses: number;
  total: number;
}

// Tipos básicos
export type VehicleType = 'carro' | 'moto';

// Entrada para método de cobrança
export interface BillingInput {
  key: string;
  label: string;
  placeholder: string;
  type?: 'number' | 'text'; // Tipo do input
}

// Método de cobrança
export interface BillingMethod {
  id: string;
  name: string;
  description: string;
  inputs: BillingInput[];
  vehicleSpecific: boolean; // Se os valores são específicos por veículo
  tolerance?: boolean; // Se possui tolerância
}

// Configuração salva
export interface PaymentConfig {
  methodId: string;
  toleranceMinutes?: number;
  values: {
    [vehicleType: string]: { // Valores por tipo de veículo
      [inputKey: string]: number | string;
    };
  };
  globalValues?: { // Valores globais (não específicos por veículo)
    [inputKey: string]: number | string;
  };
}

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
  message?: string
};

export type ResponseGeralCashData = {
  success: boolean;
  message: string;
  data: CashDetails;
  error?: string;
}
