export type Spots = {
  car: string;
  motorcycle: string;
};

export interface ConfigurationsSetupVacancies {
  success: boolean;
  message: string;
  data: {
    maxCars: number;
    maxMotorcycles: number;
  }
}

export interface dataParking {
  maxCars: number;
  maxMotorcycles: number;
}

export interface CapacityParkingResponse {
  success: boolean;
  message: string;
  data: {
    capacityMax: number;
    quantityVehicles: number;
    quantityCars: number;
    quantityMotorcycles: number;
    maxCars: number;
    maxMotorcycles: number;
    percentage: number;
  }
}

// Tipo para cada veículo retornado pela API
export interface ParkedVehicle {
  id: string;
  plate: string;
  entryTime: string;
  category: string;
  billingMethod?: string;
  cashRegisterId?: string;
  operator: string;
  deletedAt?: string;
  description?: string;
  exitTime?: string;
  status: string;
  observation?: string;
  formattedEntryTime: string;
  photoType?: string;
}

// Tipo para a resposta da API de veículos
export interface VehiclesResponse {
  success: boolean;
  message: string;
  data: {
    vehicles: ParkedVehicle[];
    nextCursor?: string;
    hasMore: boolean;
  };
}