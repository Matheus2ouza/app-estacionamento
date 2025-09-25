export type ReportType = "daily" | "weekly" | "monthly" | "full";

export type GenerateDashboardData = {
  pdf: boolean;
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
  includeDetails?: boolean;
  generateCharts?: boolean;
  selectedCharts?: string[];
}

// Tipos para as transações
export type VehicleTransaction = {
  id: string;
  operator: string;
  transactionDate: string;
  amountReceived: number;
  changeGiven: number;
  discountAmount: number;
  finalAmount: number;
  originalAmount: number;
  method: string;
  vehicle: {
    plate: string;
    category: string;
    entryTime?: string;
  };
};

export type ProductTransaction = {
  id: string;
  operator: string;
  transactionDate: string;
  amountReceived: number;
  changeGiven: number;
  discountAmount: number;
  finalAmount: number;
  originalAmount: number;
  method: string;
  items: {
    productName: string;
    soldQuantity: number;
    unitPrice: number;
  }[];
};

export type OutgoingExpense = {
  id: string;
  description: string;
  amount: number;
  transactionDate: string;
  operator: string;
  method: string;
};

// Tipos para os gráficos
export type ChartData = {
  chartUrl: string;
  [key: string]: any;
};

export type Charts = {
  revenueGrowth?: ChartData;
  bestProducts?: ChartData;
  expensesBreakdown?: ChartData;
  hourlyAnalysis?: ChartData;
};

// Tipos para o caixa
export type CashRegister = {
  id: string;
  operator: string;
  openingDate: string;
  closingDate: string | null;
  status: string;
  initialValue: number;
  finalValue: number;
  generalSaleTotal: number;
  vehicleEntryTotal: number;
  outgoingExpenseTotal: number;
  openTime: {
    minutes: number;
    formatted: string;
  };
  transactions: {
    vehicle: VehicleTransaction[] | number;
    product: ProductTransaction[] | number;
    outgoing: OutgoingExpense[] | number;
  };
};

// Tipos para análise de tempo
export type TimeAnalysis = {
  totalOpenTime: {
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
  averageOpenTime: {
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
  caixasComTempoCalculado: number;
  caixasSemFechamento: number;
};

// Tipos para o resumo
export type ReportSummary = {
  totalCashRegisters: number;
  totals: {
    initialValue: number;
    finalValue: number;
    generalSaleTotal: number;
    vehicleEntryTotal: number;
    outgoingExpenseTotal: number;
    vehicleTransactions: number;
    productTransactions: number;
    outgoingExpenses: number;
  };
  timeAnalysis: TimeAnalysis;
};

// Tipo principal do relatório
export type ReportData = {
  report: {
    type: string;
    period: {
      startDate: string | null;
      endDate: string | null;
    };
    summary: ReportSummary;
    charts: Charts;
    cashRegisters: CashRegister[];
  };
  pdf: string | null;
};

// Tipo da resposta da API
export type responseDashboard = {
  success: boolean;
  message?: string;
  data?: ReportData;
}

