export interface RegisterVehicleData {
  plate: string;
  category: string;
  photo?: string;
  observation?: string | null;
  billingMethod?: string;
  cashRegisterId: string;
}

export interface VehicleResponse {
  success: boolean;
  message?: string;
  ticket?: string;
  error?: string;
}

export interface VehiclePhotoResponse {
  success: boolean;
  data?: photoData;
  message?: string;
}

export interface UpdateVehicleData {
  plate: string;
  category: string;
  observation?: string | null;
  billingMethod?: string;
  requiredTicket?: boolean;
}

export interface UpdateVehicleResponse {
  success: boolean;
  message?: string;
  ticket?: string;
}

export interface photoData {
  photo: string;
  photoType: string;
}

export interface DeleteVehicleResponse {
  success: boolean;
  message?: string;
}

export interface VehiclePhotoResponse {
  success: boolean;
  message?: string;
}

export interface ScanVehicleResponse {
  success: boolean;
  message?: string;
  data?: Vehicle;
}

export interface Vehicle {
  id: string;
  plate: string;
  category: string;
  entryTime: string;
  permanenceTime: string;
  observation: string;
  billingMethod: billingMethod;
  photoType: string;
}

export interface billingMethod {
  title: string;
  description: string;
  tolerance: number;
  timeMinutes: number;
  value: number;
}

export interface CalculateExitResponse {
  success: boolean;
  message?: string;
  amount?: number;
}