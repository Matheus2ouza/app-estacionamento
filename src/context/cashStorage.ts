import { CashDetails } from '@/src/types/cash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CASH_STATUS_KEY = 'CASH_STATUS';
const EXPIRATION_MINUTES = 20;

type StoredCashStatus = {
  cash: CashDetails | null;
  openedAt: string | null;
};

// Salva os dados do caixa
export const saveCashStatus = async (cash: CashDetails | null) => {
  try {
    const now = new Date();
    const data: StoredCashStatus = {
      cash,
      openedAt: cash ? now.toISOString() : null,
    };
    await AsyncStorage.setItem(CASH_STATUS_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[saveCashStatus] Erro ao salvar status do caixa:', err);
  }
};

export const updateCashStatus = async (newStatus: 'OPEN' | 'CLOSED') => {
  try {
    const current = await getCashStatus();

    if (!current || !current.cash) {
      console.warn('[updateCashStatus] Nenhum caixa encontrado no cache.');
      return;
    }

    const updatedCash = {
      ...current.cash,
      status: newStatus,
    };

    await saveCashStatus(updatedCash);
    console.log(`[updateCashStatus] Status atualizado para ${newStatus}`);
  } catch (err) {
    console.error('[updateCashStatus] Erro ao atualizar status do caixa:', err);
  }
};

// Recupera os dados do caixa, se ainda estiverem válidos
export const getCashStatus = async (): Promise<StoredCashStatus | null> => {
  try {
    const value = await AsyncStorage.getItem(CASH_STATUS_KEY);
    if (!value) return null;

    const parsed: StoredCashStatus = JSON.parse(value);

    if (parsed.openedAt) {
      const openedAt = new Date(parsed.openedAt);
      const now = new Date();
      const diffMinutes = (now.getTime() - openedAt.getTime()) / (1000 * 60);

      if (diffMinutes > EXPIRATION_MINUTES) {
        console.log('[getCashStatus] Cache expirado, limpando...');
        await clearCashStatus();
        return null;
      }
    }

    return parsed;
  } catch (err) {
    console.error('[getCashStatus] Erro ao ler status do caixa:', err);
    return null;
  }
};

// Limpa o cache
export const clearCashStatus = async () => {
  try {
    await AsyncStorage.removeItem(CASH_STATUS_KEY);
  } catch (err) {
    console.error('[clearCashStatus] Erro ao limpar status do caixa:', err);
  }
};
