import { ExpenseApi } from '@/src/api/expense';
import { Expense, ExpenseData, ExpenseResponse } from '@/src/types/expenseTypes/expense';
import { useEffect, useState } from 'react';

export const useExpenses = (cashId: string) => {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!cashId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await ExpenseApi.getExpenses(cashId);
      console.log("🔍 [useExpenses] fetchExpenses: Resposta da API:", response);
      
      if (response.success) {
        // Converter amount de string para number
        const expensesWithNumberAmount = (response.data || []).map(expense => ({
          ...expense,
          amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount
        }));
        setExpenses(expensesWithNumberAmount);
      } else {
        setError(response.message || 'Erro ao carregar gastos');
      }
    } catch (err) {
      console.error('Erro ao buscar gastos:', err);
      setError('Erro ao carregar gastos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expense: Expense) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response: ExpenseResponse = await ExpenseApi.createExpense(expense, cashId);
      if (response.success) {
        setSuccess(true);
        setMessage(response.message || "Despesa registrada com sucesso.");
        // Recarregar a lista de despesas após criar uma nova
        await fetchExpenses();
      } else {
        setError(response.message || "Erro ao registrar despesa.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao registrar despesa.");
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Erro ao registrar despesa.");
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (expenseId: string, expense: Expense) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response: ExpenseResponse = await ExpenseApi.updateExpense(expenseId, expense, cashId);
      if (response.success) {
        setSuccess(true);
        setMessage(response.message || "Despesa atualizada com sucesso.");
        // Recarregar a lista de despesas após atualizar
        await fetchExpenses();
      } else {
        setError(response.message || "Erro ao atualizar despesa.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao atualizar despesa.");
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Erro ao atualizar despesa.");
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);
    
    try {
      const response: ExpenseResponse = await ExpenseApi.deleteExpense(expenseId, cashId);
      if (response.success) {
        setSuccess(true);
        setMessage(response.message || "Despesa excluída com sucesso.");
        await fetchExpenses();
      } else {
        setError(response.message || "Erro ao excluir despesa.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao excluir despesa.");
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Erro ao excluir despesa.");
    } finally {
      setLoading(false);
    }
  };

  const refreshExpenses = async () => {
    await fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, [cashId]);

  return {
    expenses,
    loading,
    error,
    success,
    message,
    createExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses,
  };
};
