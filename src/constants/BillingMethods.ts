import { BillingMethod } from "@/src/types/cash";

export const METHODS: BillingMethod[] = [
  {
    label: "Por minutos",
    value: "por_minuto",
    description: "Cobrança de acordo com a quantidade de minutos que o veiculo ficar no estacionamento.",
    tolerance: {
      key: "tolerancia",
      placeholder: "0",
    },
    extraInput:
      {
        key: "tempo_minuto",
        label: "Valor por minuto",
        placeholder: "0"
      },
    inputs: [
      {
        key: "valor_minuto",
        label: "Valor por minuto",
        placeholder: "Ex: 5.00",
      },
    ],
  },
  {
    label: "Por hora",
    value: "por_hora",
    description: "Cobrança por hora cheia.",
    tolerance: {
      key: "tolerancia",
      placeholder: "5",
    },
    extraInput: null,
    inputs: [
      {
        key: "valor_hora",
        label: "Valor por hora",
        placeholder: "Ex: 5.00",
      },
    ],
  },
  {
    label: "Por hora fracionada",
    value: "por_hora_fracionada",
    description: "Cobrança por hora + valor proporcional por fração excedente.",
    tolerance: {
      key: "tolerancia",
      placeholder: "5",
    },
    extraInput: null,
    inputs: [
      {
        key: "fracao_ate_15",
        label: "Até 15min",
        placeholder: "Ex: 5.00",
      },
      {
        key: "fracao_15_30",
        label: "15 a 30min",
        placeholder: "Ex: 15",
      },
      {
        key: "fracao_30_45",
        label: "30 a 45min",
        placeholder: "Ex: 1.50",
      },
      {
        key: "fracao_45_60",
        label: "45 a 60min",
        placeholder: "Ex: 1.50",
      },
    ],
  },
];
