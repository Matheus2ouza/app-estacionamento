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