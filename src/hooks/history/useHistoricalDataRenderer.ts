import { FilterOption } from "@/src/components/FilterByField";
import { useMemo } from "react";

export type HistoricalItem = {
  placa: string;
  entrada: string;
  saida: string;
  permanencia: string;
  valor: string;
};

export function useHistoryDataRenderer(
  data: HistoricalItem[],
  filter: FilterOption
) {
  return useMemo(() => {
    return data.map((item) => {
      const mainData = filter === "placa" ? item.placa : `Entrada ${item.entrada}`;
      const secondaryData = filter === "placa"
        ? [
            `Entrada ${item.entrada}`,
            `Saida ${item.saida}`,
            `Permanencia ${item.permanencia}`,
            `R$: ${item.valor}`,
          ]
        : [
            item.placa,
            `Saida ${item.saida}`,
            `Permanencia ${item.permanencia}`,
            `R$: ${item.valor}`,
          ];

      return { mainData, secondaryData };
    });
  }, [data, filter]);
}
