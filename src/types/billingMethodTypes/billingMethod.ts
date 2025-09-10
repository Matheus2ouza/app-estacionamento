export const categoryMethod = [
  'POR_HORA',
  'POR_MINUTO',
  'VALOR_FIXO'
] as const;

export type CategoryType = typeof categoryMethod[number];

export type BillingMethod = {
  title: string;
  category?: CategoryType;
  tolerance: number;
  time?: string;
  carroValue: number;
  motoValue: number;
}

export type BillingMethodResponse = {
  success: boolean;
  message: string;
  data?: BillingMethod;
}

export type BillingMethodListResponse = {
  success: boolean;
  message: string;
  methods?: BillingMethodList[];
}

export type BillingMethodList = {
  id: string;
  title: string;
  category: CategoryType;
  isActive: boolean;
  tolerance: number;
  time?: string;
  timeMinutes?: number;
  carroValue: number;
  motoValue: number;
}

export const changeOptions = [
  {
    label: 'Por Hora',
    value: 'POR_HORA',
    description: 'O valor a ser cobrado é calculado com base no número de horas completas em que o veículo permanece estacionado. Não é permitido horas fracionadas, somente horas cheias.',
    typeTime: 'em horas'
  },
  {
    label: 'Por Minuto',
    value: 'POR_MINUTO',
    description: 'O valor é calculado de acordo com a quantidade exata de minutos que forem configurados. É aceito até 59 minutos.',
    typeTime: 'em minutos'
  },
  {
    label: 'Valor Fixo',
    value: 'VALOR_FIXO',
    description: 'Independente do tempo de permanência, é cobrado um valor fixo único. Normalmente utilizado para períodos específicos, como diária ou eventos.',
    typeTime: 'deactivated'
  },
]