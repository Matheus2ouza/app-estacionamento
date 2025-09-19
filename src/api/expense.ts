import { Expense, ExpenseListResponse, ExpenseResponse } from "../types/expenseTypes/expense";
import axiosInstance from "./axiosInstance";

export const ExpenseApi = {
  createExpense: async (data: Expense, cashId: string): Promise<ExpenseResponse> => {
    const response = await axiosInstance.post(`/expense/${cashId}`, data);
    return response.data;
  },

  getExpenses: async (cashId: string): Promise<ExpenseListResponse> => {
    const response = await axiosInstance.get(`/expense/${cashId}`);
    return response.data;
  },

  updateExpense: async (expenseId: string, data: Expense, cashId: string): Promise<ExpenseResponse> => {
    const response = await axiosInstance.patch(`/expense/${cashId}/${expenseId}`, data);
    return response.data;
  },

  deleteExpense: async (expenseId: string, cashId: string): Promise<ExpenseResponse> => {
    const response = await axiosInstance.delete(`/expense/${cashId}/${expenseId}`);
    return response.data;
  },
};