import AsyncStorage from '@react-native-async-storage/async-storage';


const CASH_STATUS_KEY = 'CASH_STATUS';

export const saveCashStatus = async (isOpen: boolean) => {
  try {
    await AsyncStorage.setItem(CASH_STATUS_KEY, JSON.stringify(isOpen));
  } catch (err) {
    console.error('Erro ao salvar status do caixa:', err);
  }
};

export const getCashStatus = async (): Promise<boolean | null> => {
  try {
    const value = await AsyncStorage.getItem(CASH_STATUS_KEY);
    return value !== null ? JSON.parse(value) : null;
  } catch (err) {
    console.error('Erro ao ler status do caixa:', err);
    return null;
  }
};

export const clearCashStatus = async () => {
  try {
    await AsyncStorage.removeItem(CASH_STATUS_KEY);
  } catch (err) {
    console.error('Erro ao limpar status do caixa:', err);
  }
};
