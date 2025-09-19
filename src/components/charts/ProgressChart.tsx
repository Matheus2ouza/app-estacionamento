import Colors from '@/constants/Colors';
import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ProgressChartProps {
  title: string;
  subtitle?: string;
  progress: number; // 0 a 100
  currentValue: number;
  targetValue: number;
  currentValueLabel?: string;
  targetValueLabel?: string;
  progressLabel?: string;
  size?: number;
  progressColor?: string;
  backgroundColor?: string;
}

export default function ProgressChart({
  title,
  subtitle,
  progress,
  currentValue,
  targetValue,
  currentValueLabel = 'ATUAL',
  targetValueLabel = 'META',
  progressLabel = 'PROGRESSO',
  size = 200,
  progressColor = Colors.blue[600],
  backgroundColor = Colors.gray[200],
}: ProgressChartProps) {
  // Garantir que o progresso esteja entre 0 e 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const radius = (size - 40) / 2;
  const centerX = size / 2;
  const centerY = size / 2 + 10;
  
  // Calcular o ângulo do progresso (0 a 180 graus para semicírculo)
  const progressAngle = (clampedProgress / 100) * 180;
  
  // Converter ângulo para radianos
  const progressRadians = (progressAngle * Math.PI) / 180;
  
  // Calcular coordenadas do ponto final do arco
  const endX = centerX + radius * Math.cos(Math.PI - progressRadians);
  const endY = centerY - radius * Math.sin(Math.PI - progressRadians);
  
  // Criar o path do arco
  const largeArcFlag = progressAngle > 180 ? 1 : 0;
  const pathData = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

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

      <View style={{ alignItems: 'center', height: size * 0.5, justifyContent: 'center' }}>
        <Svg width={size} height={size * 0.7}>
          {/* Círculo de fundo (semicírculo) */}
          <Path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            stroke={backgroundColor}
            strokeWidth={24}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Arco de progresso */}
          {clampedProgress > 0 && (
            <Path
              d={pathData}
              stroke={progressColor}
              strokeWidth={24}
              fill="none"
              strokeLinecap="round"
            />
          )}
        </Svg>
      </View>

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
            {currentValueLabel}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text.primary }}>
            R$ {currentValue.toLocaleString('pt-BR')}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: Colors.text.secondary, marginBottom: 4 }}>
            {targetValueLabel}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text.primary }}>
            R$ {targetValue.toLocaleString('pt-BR')}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: Colors.text.secondary, marginBottom: 4 }}>
            {progressLabel}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: progressColor }}>
            {clampedProgress}%
          </Text>
        </View>
      </View>
    </View>
  );
}
