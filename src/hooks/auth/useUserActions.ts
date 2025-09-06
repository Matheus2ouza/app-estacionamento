import { AuthApi } from '@/src/api/userService';
import type { UserData } from '@/src/types/auth';
import { useState } from 'react';

export function useUserActions() {
  const [loadingEdit, setloadingEdit] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);
  const [loadingVerifyPassword, setLoadingVerifyPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleError = (err: any, fallbackMessage: string) => {

    if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
      const messages = err.response.data.details.map((e: any) => e.msg).join('\n');
      setError(messages);
    } else {
      setError(err.response?.data?.message || fallbackMessage);
    }
  };

  const editUser = async (data: UserData) => {
    setloadingEdit(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: any = {
        id: data.id,
        username: data.username,
        role: data.role,
      };

      // Só inclui password se foi fornecido (não é string vazia)
      if (data.password && data.password.trim() !== '') {
        payload.password = data.password;
      }

      await AuthApi.editUser(payload);
      setSuccess(true);
    } catch (err: any) {
      handleError(err, 'Erro ao editar usuário.');
    } finally {
      setloadingEdit(false);
    }
  };

  const deleteUser = async (id: string, password: string) => {
    setloadingDelete(true);
    setError(null);
    setSuccess(false);

    try {
      await AuthApi.deleteUser(id, password);
      setSuccess(true);
    } catch (err: any) {
      handleError(err, 'Erro ao excluir usuário.');
      // Re-lança o erro para que o componente possa capturar e limpar a senha
      throw err;
    } finally {
      setloadingDelete(false);
    }
  };

  return { 
    editUser, 
    deleteUser,
    loadingEdit, 
    loadingDelete, 
    loadingVerifyPassword,
    error, 
    success 
  };
}
