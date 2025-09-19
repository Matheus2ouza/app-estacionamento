import Colors from '@/constants/Colors';
import { LinearGradient, useFont, vec } from '@shopify/react-native-skia';
import React from 'react';
import { Text, View } from 'react-native';
import { BarGroup, CartesianChart } from 'victory-native';

interface DailyTotalItem {
  dayNumber: number;
  dayName: string;
  generalSaleTotal: number;
  vehicleEntryTotal: number;
  outgoingExpenseTotal: number;
}

interface TotalsBarGroupChartProps {
  title: string;
  subtitle?: string;
  dailyTotals: DailyTotalItem[]; // dados brutos vindos da API
}

export default function TotalsBarGroupChart({ title, subtitle, dailyTotals }: TotalsBarGroupChartProps) {
  const font = useFont(require('../../assets/fonts/Inter_18pt-Medium.ttf'), 12);

  const dayNameByNumber: Record<number, string> = {
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
  };

  const groups = (Array.isArray(dailyTotals) ? dailyTotals : [])
    .slice(0, 5)
    .map((d: DailyTotalItem) => ({
      label: d?.dayName || dayNameByNumber[d?.dayNumber] || String(d?.dayNumber || ''),
      vehicles: Math.max(0, Number(d?.vehicleEntryTotal) || 0),
      products: Math.max(0, Number(d?.generalSaleTotal) || 0),
      expenses: Math.max(0, Number(d?.outgoingExpenseTotal) || 0),
    }));

  const rawData = groups.map((g, idx) => ({
    label: g.label,
    vehicles: g.vehicles,
    products: g.products,
    expenses: g.expenses,
  }));

  const maxY = Math.max(
    10,
    ...rawData.map(d => Math.max(d.vehicles, d.products, d.expenses))
  );

  // Valor mínimo visual para barras zeradas, para sempre aparecerem
  const minBarValue = maxY > 0 ? Math.max(1, Math.ceil(maxY * 0.02)) : 1;

  const data = rawData.map(d => ({
    label: d.label,
    vehicles: d.vehicles === 0 ? minBarValue : d.vehicles,
    products: d.products === 0 ? minBarValue : d.products,
    expenses: d.expenses === 0 ? minBarValue : d.expenses,
  }));

  const formatBRL = (value: number) => `R$ ${Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const upperY = maxY <= 100 ? 98 : Math.ceil(maxY * 1.1);

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
        <Text
          style={{
            fontSize: 12,
            color: Colors.text.secondary,
            marginBottom: 12,
          }}
        >
          {subtitle}
        </Text>
      )}

      <View style={{ height: 300 }}>
        <CartesianChart
          data={data}
          xKey="label"
          yKeys={['vehicles', 'products', 'expenses']}
          domain={{ y: [0, upperY] }}
          padding={{ left: 10, right: 10, bottom: 5, top: 15 }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{
            font,
            tickCount: { y: 5, x: Math.min(5, data.length || 1) },
            lineColor: Colors.gray[300],
            labelColor: Colors.text.secondary,
          }}
        >
          {({ points, chartBounds }) => (
            <BarGroup
              chartBounds={chartBounds}
              betweenGroupPadding={0.4}
              withinGroupPadding={0.2}
              roundedCorners={{ topLeft: 8, topRight: 8 }}
            >
              <BarGroup.Bar points={points.vehicles} animate={{ type: 'timing' }}>
                <LinearGradient start={vec(0, 0)} end={vec(0, 540)} colors={[Colors.blue[400], `${Colors.blue[600]}90`]} />
              </BarGroup.Bar>
              <BarGroup.Bar points={points.products} animate={{ type: 'timing' }}>
                <LinearGradient start={vec(0, 0)} end={vec(0, 500)} colors={[Colors.purple[400], `${Colors.purple[600]}90`]} />
              </BarGroup.Bar>
              <BarGroup.Bar points={points.expenses} animate={{ type: 'timing' }}>
                <LinearGradient start={vec(0, 0)} end={vec(0, 500)} colors={[Colors.teal[400], `${Colors.teal[600]}90`]} />
              </BarGroup.Bar>
            </BarGroup>
          )}
        </CartesianChart>
      </View>

      {/* Legendas das séries */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 }}>
        <Legend color={Colors.blue[600]} label="Veículos" />
        <Legend color={Colors.purple[600]} label="Produtos" />
        <Legend color={Colors.red[600]} label="Despesas" />
      </View>

      {/* Tabela simples com os dados em Reais */}
      <View style={{ marginTop: 12, borderWidth: 1, borderColor: Colors.border.light, borderRadius: 8, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', backgroundColor: Colors.card.header }}>
          <Cell text="Dia" isHeader />
          <Cell text="Veículos" isHeader />
          <Cell text="Produtos" isHeader />
          <Cell text="Despesas" isHeader />
        </View>
        {groups.map((g, idx) => (
          <View key={`row-${idx}`} style={{ flexDirection: 'row', backgroundColor: idx % 2 === 0 ? Colors.table.row : Colors.table.rowAlternate }}>
            <Cell text={g.label} />
            <Cell text={formatBRL(rawData[idx]?.vehicles ?? 0)} />
            <Cell text={formatBRL(rawData[idx]?.products ?? 0)} />
            <Cell text={formatBRL(rawData[idx]?.expenses ?? 0)} />
          </View>
        ))}
      </View>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: color }} />
      <Text style={{ fontSize: 12, color: Colors.text.secondary }}>{label}</Text>
    </View>
  );
}

function Cell({ text, isHeader = false }: { text: string; isHeader?: boolean }) {
  return (
    <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: Colors.border.light }}>
      <Text style={{
        fontSize: 12,
        fontWeight: isHeader ? '600' as const : '400' as const,
        color: isHeader ? Colors.text.primary : Colors.text.secondary,
      }}>
        {text}
      </Text>
    </View>
  );
}


