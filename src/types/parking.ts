export type Spots = {
  car: string;
  motorcycle: string;
};

export interface configurationsSetupVacancies {
  success: boolean;
  message: string;
  config: {
    maxCars: number;
    maxMotorcycles: number;
  }
}

export interface dataParking {
  maxCars: number;
  maxMotorcycles: number;
}

export interface parkingData {
  carVacancies: number;
  motorcycleVacancies: number;
  totalCarsInside: number;
  totalMotosInside: number;
}

export interface ResponseVeicleData {
  success: boolean;
  message: string;
  data: parkingData
}