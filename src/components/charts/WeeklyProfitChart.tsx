import Colors from '@/constants/Colors';
import { DailyProfitData } from '@/types/goalsTypes/goals';
import { Circle, Rect, Text as SkiaText, useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { Text, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { CartesianChart, Line, useChartPressState } from "victory-native";

interface WeeklyProfitChartProps {
  title: string;
  subtitle?: string;
  weeklyData: DailyProfitData[];
  goalValue: number;
  currentDay: number; // 1-7 (segunda = 1, domingo = 7)
}


function ToolTip({ x, y, dayName, profit, font }: { 
  x: SharedValue<number>; 
  y: SharedValue<number>;
  dayName: string;
  profit: number;
  font: any;
}) {
  // Posicionar o tooltip sempre dentro da área do gráfico
  const tooltipWidth = 80;
  const tooltipHeight = 30;
  const margin = 10;
  
  // Calcular posição X (centralizar no ponto)
  let tooltipX = x.value - (tooltipWidth / 2);
  
  // Ajustar se sair da borda esquerda
  if (tooltipX < margin) {
    tooltipX = margin;
  }
  
  // Ajustar se sair da borda direita (assumindo largura do gráfico ~300px)
  if (tooltipX + tooltipWidth > 300 - margin) {
    tooltipX = 300 - tooltipWidth - margin;
  }
  
  // Posicionar acima do ponto, mas não muito alto
  const tooltipY = Math.max(margin, y.value - tooltipHeight - 10);
  
  return (
    <>
      <Circle cx={x} cy={y} r={6} color={Colors.blue[600]} />
      {/* Fundo do tooltip */}
      <Rect
        x={tooltipX}
        y={tooltipY}
        width={tooltipWidth}
        height={tooltipHeight}
        color={Colors.gray[800]}
      />
      {/* Texto do dia */}
      <SkiaText
        x={tooltipX + 5}
        y={tooltipY + 10}
        text={dayName}
        font={font}
        color={Colors.white}
      />
      {/* Texto do valor */}
      <SkiaText
        x={tooltipX + 5}
        y={tooltipY + 24}
        text={`R$ ${profit.toFixed(2)}`}
        font={font}
        color={Colors.white}
      />
    </>
  );
}

export default function WeeklyProfitChart({
  title,
  subtitle,
  weeklyData,
  goalValue,
  currentDay
}: WeeklyProfitChartProps) {
  // Filtrar apenas os dias já passados (incluindo o dia atual)
  const pastDaysData = weeklyData.filter(day => day.dayNumber <= currentDay);
  
  // Garantir que tenhamos os 7 dias no eixo X (Seg=1 ... Dom=7)
  const dayNamesFull: Record<number, string> = {
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
    6: 'Sábado',
    7: 'Domingo',
  };
  const dataByDayNumber = new Map(weeklyData.map(d => [d.dayNumber, d] as const));

  // Preparar dados para o gráfico com todos os dias (lucro nulo para dias sem dados)
  const chartData = Array.from({ length: 7 }, (_, i) => i + 1).map((dayNumber) => {
    const found = dataByDayNumber.get(dayNumber);
    return {
      day: dayNumber,
      profit: found && dayNumber <= currentDay ? found.profit : null,
      dayName: found?.dayName ?? dayNamesFull[dayNumber],
    };
  });

  // Configurar domínio do eixo Y para ir até a meta total da semana
  const maxYValue = Math.max(goalValue, ...weeklyData.map(d => Math.abs(d.profit)));
  const yDomain: [number, number] = [0, maxYValue * 1.1]; // 10% de margem acima da meta total
  
  // Configurar domínio do eixo X para mostrar de segunda (1) a domingo (7)
  const xDomain: [number, number] = [1, 7];

  const font = useFont(require('@/src/assets/fonts/Inter_18pt-Medium.ttf'), 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { profit: 0 } });

  return (
    <View style={{
      backgroundColor: Colors.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      shadowColor: Colors.gray[900],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
      }}>
        {title}
      </Text>
      
      {subtitle && (
        <Text style={{
          fontSize: 12,
          color: Colors.text.secondary,
          marginBottom: 12,
        }}>
          {subtitle}
        </Text>
      )}

      <View style={{ height: 250, marginBottom: 12 }}>
        <CartesianChart
          data={chartData}
          xKey="day"
          yKeys={["profit"]}
          domain={{ x: xDomain, y: yDomain }}
          axisOptions={{
            font,
            formatXLabel: (value) => {
              const dayNames = ['', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
              return dayNames[value] || '';
            },
            formatYLabel: (value) => `R$ ${(value || 0).toFixed(0)}`,
          }}
          chartPressState={state}
        >
          {({ points }) => (
            <>
              {/* Linha de lucro - para no dia atual */}
              <Line 
                points={points.profit} 
                color={Colors.blue[500]} 
                strokeWidth={3}
              />
              
              {/* Tooltip quando pressionado */}
              {isActive && (() => {
                const dayIndex = Math.round(state.x.value.value) - 1;
                const dayData = chartData[dayIndex];
                if (dayData && dayIndex >= 0 && dayIndex < 7 && dayIndex < currentDay) {
                  return (
                    <ToolTip 
                      x={state.x.position} 
                      y={state.y.profit.position}
                      dayName={dayData.dayName}
                      profit={dayData.profit ?? 0}
                      font={font}
                    />
                  );
                }
                return null;
              })()}
            </>
          )}
        </CartesianChart>
      </View>

      {/* Campo informativo */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-around',
        paddingTop: 12,
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: Colors.text.secondary, marginBottom: 4 }}>
            LUCRO ATUAL
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text.primary }}>
            R$ {pastDaysData.reduce((sum, day) => sum + day.profit, 0).toLocaleString('pt-BR')}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: Colors.text.secondary, marginBottom: 4 }}>
            META SEMANAL
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text.primary }}>
            R$ {goalValue.toLocaleString('pt-BR')}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: Colors.text.secondary, marginBottom: 4 }}>
            PROGRESSO
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.blue[600] }}>
            {((pastDaysData.reduce((sum, day) => sum + day.profit, 0) / goalValue) * 100).toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}