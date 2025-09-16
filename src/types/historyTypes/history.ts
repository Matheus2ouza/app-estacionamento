export interface HistoryCashRegister {
  id: string;
  openingDate: string;
  closingDate: string;
  status: string;
  operator: string;
  initialValue?: number;
  finalValue?: number;
  generalSaleTotal?: number;
  vehicleEntryTotal?: number;
  outgoingExpenseTotal?: number;
  vehicleTransaction: VehicleTransaction[];
  productTransaction: ProductTransaction[];
  outgoingExpense: OutgoingExpense[];
}

export interface VehicleTransaction {
  id: string;
  operator: string;
  transactionDate: string;
  amountReceived?: number;
  changeGiven?: number;
  discountAmount?: number;
  finalAmount?: number;
  originalAmount?: number;
  method: string;
  photoType?: string;
  vehicleEntries: {
    plate: string;
    category: string;
    entryTime: string;
    exitTime: string;
    status: string;
    description: string;
    observation: string;
  };
}

export interface ProductTransaction {
  id: string;
  operator: string;
  transactionDate: string;
  originalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  amountReceived?: number;
  changeGiven?: number;
  method: string;
  photoType?: string;
  saleItems: {
    productName: string;
    soldQuantity: number;
    unitPrice?: number;
    expirationDate: string;
  }[];
}

export interface OutgoingExpense {
  id: string;
  description: string;
  amount?: number;
  transactionDate: string;
  operator: string;
  method: string;
}

export interface HistoryPagination {
  hasNextPage: boolean;
  nextCursor?: string;
  limit: number;
  totalCashRegisters: number;
  totalVehicleTransactions: number;
  totalProductTransactions: number;
  totalExpenses: number;
}

export interface UserPermissions {
  role: string;
  canViewValues: boolean;
  canViewPhotos: boolean;
}

export interface HistoryResponse {
  success: boolean;
  message: string;
  data: {
    cashRegisters: HistoryCashRegister[];
    pagination: HistoryPagination;
    userPermissions: UserPermissions;
  };
}

export interface generalHistoryCashPhotoResponse {
  success: boolean;
  message: string;
  data: {
    photo: string;
  };
}