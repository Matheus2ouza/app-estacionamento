export interface EntryData {
  plate: string;
  category: string;
  observation?: string | null;
  photo?: string | null
}

export interface EditData {
  id?: string;
  plate?: string;
  category?: string;
}

export interface Car {
  id: number,
  plate: string;
  status: string;
  entry_time: string;
  operator: string;
  category: string
  description: string;
}

export interface CarWithElapsedTime extends Car {
  elapsedTime: string;
  formattedEntryTime: string;
}

export interface ParkingConfig {
  maxCars: number;
  maxMotorcycles: number;
  maxLargeVehicles: number;
}

export interface RegisterVehicleResponse {
  success?: boolean;
  message: string;
  ticket?: string,
  vehicleId?: string;
  entryTime?: string;
  error?: string;
}

export interface Response {
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