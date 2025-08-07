export enum VehicleCategory {
  CARRO = "carro",
  MOTO = "moto"
}

export interface BillingMethod {
  id: string;
  name: string;
  description: string;
  tolerance: number | null;
  is_active: boolean; // Removido o opcional para consistência
  created_at?: string;
  updated_at?: string;
}

export interface BillingRule {
  id: string;
  price: number;
  base_time_minutes: number;
  vehicle_type: VehicleCategory;
  billing_method_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface BillingMethodWithRules extends BillingMethod {
  billing_rule?: BillingRule[];
}

export interface ActiveBillingMethodResponse {
  method: BillingMethod;
  rules: BillingRule[];
}

export interface PaymentConfigApiPayload {
  methodId: string; // Na verdade é o name do método
  toleranceMinutes: number;
  rules: Array<{
    vehicle_type: string; // 'carro' ou 'moto' em lowercase
    price: number;
    base_time_minutes: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface BillingMethodsResponse extends ApiResponse<BillingMethodWithRules[]> {
  methods: BillingMethodWithRules[];
}

export interface ActiveBillingMethodApiResponse extends ApiResponse<ActiveBillingMethodResponse> {}
export interface SavePaymentResponse extends ApiResponse<{ method: string; rules: BillingRule[] }> {}