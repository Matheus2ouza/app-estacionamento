
export interface Product{
  id?: string
  productName: string
  barcode?: string
  unitPrice: number
  quantity: number
  expirationDate?: string
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