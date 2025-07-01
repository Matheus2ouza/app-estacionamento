export interface EntryData {
  plate: string;
  category: string,
  operatorId: string | null;
}

export interface Car {
  plate: string;
  entryTime: string;
  operator: string;
  category: string
}

export interface RegisterVehicleResponse {
  success?: boolean;
  message: string;
  vehicleId?: string;
  entryTime?: string;
}

export interface ParkedVehiclesResponse {
  success: boolean;
  data: Car[];
}