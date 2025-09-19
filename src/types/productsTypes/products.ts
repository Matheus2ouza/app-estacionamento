
export interface Product{
  id?: string
  productName: string
  barcode?: string
  unitPrice: number
  quantity: number
  expirationDate?: string
  isActive?: boolean
}

// Interface para resposta paginada
export interface Responselist {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    nextCursor?: string;
    hasMore: boolean;
  };
}

export interface ProductRegisterResponse {
  success: boolean;
  message: string;
  data?: Product;
}

export interface BarcodeSearchResponse {
  success: boolean;
  message: string;
  data?: Product
}

export interface ProductPayment {
  cashId: string;
  saleData: saleData;
  method: string;
  amountReceived: number;
  changeGiven: number;
  discountAmount: number;
  finalAmount: number;
  originalAmount: number;
  photo: string | null;
}

export interface saleData {
  products: Product[];
  totalAmount: number;
  totalItems: number;
  timestamp: string;
}

export interface ProductPaymentResponse {
  success: boolean;
  message: string;
  transactionId: string;
  receipt: string;
}