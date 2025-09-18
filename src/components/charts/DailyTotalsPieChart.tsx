import Colors from '@/constants/Colors';
import { useFont } from '@shopify/react-native-skia';
import React from 'react';
import { Text, View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';

interface DailyTotalsPieChartProps {
  title: string;
  subtitle?: string;
  totals: {
    vehicles: number;
    products: number;
    expenses: number;
  };
}

export default function DailyTotalsPieChart({ title, subtitle, totals }: DailyTotalsPieChartProps) {
  const font = useFont(require('../../assets/fonts/Inter_18pt-Medium.ttf'), 10);

  console.log('🔵 [DailyTotalsPieChart] props.totals:', totals);

  const data = [
    { label: 'Veículos', value: Math.max(0, totals.vehicles || 0), color: Colors.blue[600] },
    { label: 'Produtos', value: Math.max(0, totals.products || 0), color: Colors.purple[600] },
    { label: 'Despesas', value: Math.max(0, totals.expenses || 0), color: Colors.red[600] },
  ];

  const totalSum = data.reduce((acc, d) => acc + d.value, 0);
  const showEmpty = totalSum === 0;
  console.log('🔵 [DailyTotalsPieChart] data:', data, 'totalSum:', totalSum, 'showEmpty:', showEmpty);

  const placeholder = [
    { label: 'Sem dados', value: 1, color: Colors.gray[300] },
  ];

  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: Colors.gray[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: Colors.text.primary,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text style={{ fontSize: 12, color: Colors.text.secondary, marginBottom: 12 }}>
          {subtitle}
        </Text>
      )}

      <View style={{ height: 260 }}>
        <PolarChart
          data={showEmpty ? placeholder : data}
          colorKey={"color"}
          valueKey={"value"}
          labelKey={"label"}
        >
          <Pie.Chart>
            {() => (
              <Pie.Slice />
            )}
          </Pie.Chart>
        </PolarChart>
      </View>

      {/* Legenda */}
      {!showEmpty && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 12 }}>, 
          <Legend color={Colors.blue[600]} label={`Veículos (${formatBRL(totals.vehicles)})`} />
          <Legend color={Colors.purple[600]} label={`Produtos (${formatBRL(totals.products)})`} />
          <Legend color={Colors.red[600]} label={`Despesas (${formatBRL(totals.expenses)})`} />
        </View>
      )}
    </View>
  );
}

function formatBRL(value: number) {
  return `R$ ${Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12, marginBottom: 8 }}>
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color }} />
      <Text style={{ fontSize: 12, color: Colors.text.secondary }}>{label}</Text>
    </View>
  );
}


