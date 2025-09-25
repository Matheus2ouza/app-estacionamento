export type cash = {
  id: string,
  operator: string;
  status: string;
  opening_date: string;
  closing_date: string;
}

export type CashStatus = 'not_created' | 'open' | 'closed';

export type cashResponse = {
  success: boolean;
  message?: string;
  cashStatus: CashStatus;
  cash?: cash;
}

export type cashSettingsResponse = {
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

// Tipos para o histórico do caixa
export interface VehicleEntry {
  plate: string;
  category: string;
  entryTime: string;
  exitTime: string | null;
  status: string;
}

export interface VehicleTransaction {
  operator: string;
  vehicleEntries: VehicleEntry[];
  amountReceived: number;
  changeGiven: number;
  discountAmount: number;
  finalAmount: number;
  originalAmount: number;
  method: string;
}

export interface SaleItem {
  productName: string;
  soldQuantity: number;
  unitPrice: number;
}

export interface ProductTransaction {
  operator: string;
  saleItems: SaleItem[];
  amountReceived: number;
  changeGiven: number;
  discountAmount: number;
  finalAmount: number;
  originalAmount: number;
  method: string;
}

export interface OutgoingExpense {
  description: string;
  amount: number;
  transactionDate: string;
  operator: string;
  method: string;
}

export interface CashHistoryCounts {
  vehicleTransactions: number;
  productTransactions: number;
  expenseTransactions: number;
}

export interface CashHistoryData {
  vehicleTransaction: VehicleTransactionHistory[];
  productTransaction: ProductTransactionHistory[];
  outgoingExpense: OutgoingExpenseHistory[];
  counts: CashHistoryCounts;
}

export interface historyCashResponse {
  success: boolean;
  message?: string;
  data?: CashHistoryData;
}


export interface VehicleTransactionHistory {
  id: string;
  operator: string;
  vehicleEntries: VehicleEntry[];
  amountReceived: number;
  changeGiven: number;
  discountAmount: number;
  finalAmount: number;
  originalAmount: number;
  method: string;
}

export interface ProductTransactionHistory {
  id: string;
  operator: string;
  saleItems: SaleItem[];
  amountReceived: number;
  changeGiven: number;
  discountAmount: number;
  finalAmount: number;
  originalAmount: number;
  method: string;
}

export interface OutgoingExpenseHistory {
  id: string;
  description: string;
  amount: number;
  transactionDate: string;
  operator: string;
  method: string;
}

export interface ListCashHistoryAllResponse {
  success: boolean;
  message?: string;
  hasNextPage: boolean,
  nextCursor: string;
  data?: ListHistoryCash[];
}

export type CashStatusHistory = 'OPEN' | 'CLOSED';

export interface ListHistoryCash {
  id: string
  openingDate: string;
  closingDate: string;
  status: CashStatusHistory;
  operator: string;
  profit: number;
  generalSaleTotal: string;
  vehicleEntryTotal: string;
  outgoingExpenseTotal: string;
}