import { BillingMethod } from "@/src/types/cash";

export const BILLING_METHODS: BillingMethod[] = [
  {
    id: "per_minute",
    name: "Por minuto",
    description: "Cobrança proporcional ao tempo estacionado",
    vehicleSpecific: true,
    tolerance: true,
    inputs: [
      {
        key: "price_per_minute",
        label: "Valor por minuto",
        placeholder: "0.50",
        type: "number"
      }
    ]
  },
  {
    id: "per_hour",
    name: "Por hora",
    description: "Cobrança por hora cheia",
    vehicleSpecific: true,
    tolerance: true,
    inputs: [
      {
        key: "price_per_hour",
        label: "Valor por hora",
        placeholder: "10.00",
        type: "number"
      }
    ]
  },
  {
    id: "fixed_fee",
    name: "Taxa fixa",
    description: "Cobrança única independente do tempo",
    vehicleSpecific: true,
    inputs: [
      {
        key: "fixed_price",
        label: "Valor fixo",
        placeholder: "20.00",
        type: "number"
      }
    ]
  },
  {
    id: "graduated",
    name: "Escalonada",
    description: "Valores diferentes por faixa de tempo",
    vehicleSpecific: true,
    tolerance: true,
    inputs: [
      {
        key: "first_hour",
        label: "Primeira hora",
        placeholder: "10.00",
        type: "number"
      },
      {
        key: "additional_half_hour",
        label: "Meia hora adicional",
        placeholder: "5.00",
        type: "number"
      },
      {
        key: "max_daily",
        label: "Máximo diário",
        placeholder: "50.00",
        type: "number"
      }
    ]
  }
];

// Tipos de veículos
export const VEHICLE_TYPES = [
  { id: "carro", name: "Carro" },
  { id: "moto", name: "Moto" },
];