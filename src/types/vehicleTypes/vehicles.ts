export interface RegisterVehicleData {
  plate: string;
  category: string;
  photo?: string;
  observation?: string | null;
  billingMethod?: string;
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

export interface photoData {
  photo: string;
  photoType: string;
}

export interface DeleteVehicleResponse {
  success: boolean;
  message?: string;
}