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