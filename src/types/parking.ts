export type Spots = {
  car: string;
  motorcycle: string;
  largeCar: string;
};

export interface configurationsSetupVacancies {
  success: boolean;
  message: string;
  config: {
    maxCars: number;
    maxMotorcycles: number;
    maxLargeVehicles: number;
  }
}

export interface dataParking {
  maxCars: number;
  maxMotorcycles: number;
  maxLargeVehicles: number;
}