export interface RegisterVehicleData {
  plate: string;
  category: string;
  photo?: string;
  observation?: string | null;
  billingMethod?: string;
}

export interface RegisterVehicleResponse {
  success: boolean;
  message?: string;
  ticket?: string;
  error?: string;
}