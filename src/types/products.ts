export interface Product {
  id: string;
  productName: string;
  barcode: string;
  unitPrice: number;
  quantity: number;
  expirationDate?: string;
}

export interface SaleItem {
  product: Product;
  soldQuantity: number;
}

export interface ResponseProduct {
  success: boolean;
  message: string;
  product: Product;
}

export interface Response {
  success: boolean;
  message: string;
  list?: Product[];
  error: string;
}

export interface OpenFoodFactsProduct {
  product_name: string;
  [key: string]: any;
}

export interface OpenFoodFactsResponse {
  status: number;
  product?: OpenFoodFactsProduct;
}

export interface RegisterPayment {
  paymentMethod: string;
  cashRegisterId: string;
  totalAmount: number;
  discountValue: number;
  finalPrice: number;
  amountReceived: number;
  changeGiven: number;
  saleItems: SaleItem[];
}

export interface RegisterPaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  receipt?: string;
}