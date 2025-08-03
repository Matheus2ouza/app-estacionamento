// Tipo para um item de produto vendido
export type SaleItem = {
  product_name: string;
};

// Tipo para transação de produto
export type ProductTransaction = {
  id: string;
  type: 'product';
  operator: string;
  transaction_date: Date | string;
  final_amount: number | string;
  method: string;
  items: SaleItem[];
};

// Tipo para transação de veículo
export type VehicleTransaction = {
  id: string;
  type: 'vehicle';
  plate: string;
  operator: string;
  transaction_date: Date | string;
  final_amount: number | string;
  method: string;
};

// Tipo para a resposta completa da API
export type CashHistoryResponse = {
  success: boolean;
  message: string;
  data?: {
    vehicles: VehicleTransaction[];
    products: ProductTransaction[];
  };
};

// Tipo para os dados combinados (pode ser usado para renderizar a lista)
export type Transaction = VehicleTransaction | ProductTransaction;