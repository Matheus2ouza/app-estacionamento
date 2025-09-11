export type cash = {
  id: string,
  operator: string;
  status: string;
  opening_date: string;
}

export type CashStatus = 'not_created' | 'open' | 'closed';

export type cashResponse = {
  success: boolean;
  message?: string;
  cashStatus: CashStatus;
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

export interface generalDetailsResponse {
  success: boolean;
  message?: string;
  data?: {
    generalDetails: generalDetails;
    vehicleDetails: vehicleDetails;
    productDetails: productDetails;
    outgoingExpenseDetails: outgoingExpenseDetails;
  }
}

export interface generalDetails {
  initialValue: number; // valor inicial do caixa
  finalValue: number; // valor final do caixa
  operator: string; // operador do caixa
  openingDate: string; // data de abertura do caixa
  closingDate: string | null; // data de fechamento do caixa (pode ser null se aberto)
  status: CashStatus; // status do caixa
}

export interface vehicleDetails {
  exitVehicle: number; // valor total de veículos que saíram
  inVehicle: number; // valor total de veículos que entraram
  amountTotal: number; // valor total de veículos
  amountCash: number; // valor total de veículos em dinheiro
  amountCredit: number; // valor total de veículos em crédito
  amountDebit: number; // valor total de veículos em débito
  amountPix: number; // valor total de veículos em pix
}

export interface productDetails {
  amountTotal: number; // valor total de produtos que sairam
  amountSold: number; // valor total de produtos vendidos
  productMostSold: string; // produto mais vendido
  amountSoldInCash: number; // valor total de produtos vendidos em dinheiro
  amountSoldInPix: number; // valor total de produtos vendidos em pix
  amountSoldInDebit: number; // valor total de produtos vendidos em débito
  amountSoldInCredit: number; // valor total de produtos vendidos em crédito
}

export interface outgoingExpenseDetails {
  amountTotal: number; // valor total de despesas
  outputQuantity: number; // quantidade de despesas
  outputMostSold: string; // despesa com maior valor
  outputLast: string; // última despesa
  outputLastAmount: number; // valor da última despesa
  outputCredit: number; // valor total de despesas em crédito
  outputDebit: number; // valor total de despesas em débito
  outputPix: number; // valor total de despesas em pix
  outputCash: number; // valor total de despesas em dinheiro
}