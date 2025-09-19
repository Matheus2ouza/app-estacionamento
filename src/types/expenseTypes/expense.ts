export interface Expense {
  cashId: string;
  description: string;
  amount: number;
  method: string;
}

export interface ExpenseResponse {
  success: boolean;
  message: string;
}

export interface ExpenseData {
  id: string;
  description: string;
  amount: number;
  method: string;
  transactionDate: string;
  cashId: string;
}

export interface ExpenseListResponse {
  success: boolean;
  data: ExpenseData[];
  message?: string;
}