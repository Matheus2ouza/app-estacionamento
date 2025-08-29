export type cash = {
  id: string,
  operator: string;
  status: string;
  opening_date: string;
}

export type cashResponse = {
  success: boolean;
  message?: string;
  cash?: cash;
}

export type detailsResponse = {
  success: boolean;
  message?: string;
  data?: CashData;
}

export interface CashData {
  initialValue: number;
  totalCash: number;
  totalCredit: number;
  totalDebit: number;
  totalPix: number;
  outgoingExpenseTotal: number;
  finalValue: number;
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