export interface EntryData {
  plate: string;
  category: string,
  operatorId: string | null;
}

export interface EditData {
  id?: string;
  plate?: string;
  category?: string;
}

export interface Car {
  id: number,
  plate?: string;
  entryTime?: string;
  operator?: string;
  category?: string
}

export interface RegisterVehicleResponse {
  success?: boolean;
  message: string;
  ticket?: string,
  vehicleId?: string;
  entryTime?: string;
  error?: string;
}

export interface deleteVehicleResponse {
  success?: boolean;
  message: string;
}

export interface VehicleResponse {
  success: boolean;
  message: string;
  car: Car;
}

export interface ParkedVehiclesResponse {
  success: boolean;
  message: string,
  data: Car[];
}

export interface SecondticketResponse {
  success: boolean;
  message: string;
  ticket?: string;
}