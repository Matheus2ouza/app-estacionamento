export interface CashData {
  initialAmount: number;
  cash: number;
  card: number;
  pix: number;
  expenses: number;
  total: number;
}

export interface VehicleValues {
  car?: number;
  motorcycle?: number;
  largeCar?: number;
}

export interface BillingInput {
  key: string;
  label: string;
  placeholder?: string;
  vehicleValues?: VehicleValues;
}

export interface BillingMethod {
  label: string;
  value: string;
  description: string;
  tolerance: {
    key: string;
    placeholder?: string;
  };
  inputs: BillingInput[];

  extraInput: BillingInput | null;
}

export type PaymentConfig = {
  method: string;
  tolerance: number;
  values: {
    [vehicleKey: string]: {
      [inputKey: string]: number;
    };
  };
};