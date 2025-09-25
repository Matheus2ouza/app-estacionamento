import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import useCharts from '@/hooks/charts/useCharts';
import useGoals from '@/hooks/goals/useGoals';
import { styles } from '@/styles/functions/cash/chartsStyles';
import { Period } from '@/types/goalsTypes/goals';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from "expo-router";
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const chartTypes = [
  {
    id: 'goalProgress',
    title: 'Progresso da Meta',
    description: 'Mostra o progresso atual em relação à meta definida',
    icon: 'line-chart',
    available: true,
  },
  {
    id: 'weeklyProfit',
    title: 'Lucro por Dia da Semana',
    description: 'Mostra o lucro do caixa por dia útil (segunda a sexta)',
    icon: 'bar-chart',
    available: true,
  },
  {
    id: 'totalsBarGroup',
    title: 'Totais: Veículos, Produtos e Despesas',
    description: 'Exibe o total de valores por categoria (veículos, produtos, despesas)',
    icon: 'bar-chart',
    available: true,
  },
  {
    id: 'dailyTotals',
    title: 'Totais do Dia (Pizza)',
    description: 'Mostra a distribuição do dia entre veículos, produtos e despesas',
    icon: 'pie-chart',
    available: true,
  },
];

const periodLabels = {
  [Period.DIARIA]: 'Diário',
  [Period.SEMANAL]: 'Semanal',
  [Period.MENSAL]: 'Mensal',
};

export default function ChartsScreen() {
  const { goals, loadGoals, loading: loadingGoals } = useGoals();
  const { generating, error, generateCharts } = useCharts();
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(Period.DIARIA);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  // Carregar metas ao entrar em foco
  useFocusEffect(
    React.useCallback(() => {
      loadGoals();
    }, [loadGoals])
  );

  // Obter períodos disponíveis (apenas os que têm metas ativas)
  const availablePeriods = Object.entries(goals)
    .filter(([_, goal]) => goal && goal.isActive)
    .map(([key, goal]) => {
      // Mapear corretamente as chaves para os enums
      switch (key) {
        case 'dailyGoal':
          return Period.DIARIA;
        case 'weeklyGoal':
          return Period.SEMANAL;
        case 'monthlyGoal':
          return Period.MENSAL;
        default:
          return null;
      }
    })
    .filter((period): period is Period => period !== null);

  // Selecionar período
  const handleSelectPeriod = (period: Period) => {
    setSelectedPeriod(period);
    setSelectedCharts([]); // Limpar gráficos selecionados ao mudar período
  };

  // Toggle seleção de gráfico
  const toggleChartSelection = (chartId: string) => {
    setSelectedCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  // Gerar gráficos
  const handleGenerateCharts = async () => {
    console.log("🔵 [ChartsScreen] handleGenerateCharts chamado");
    console.log("🔵 [ChartsScreen] selectedPeriod:", selectedPeriod);
    console.log("🔵 [ChartsScreen] selectedCharts:", selectedCharts);
    console.log("🔵 [ChartsScreen] goals:", goals);

    if (!selectedPeriod || selectedCharts.length === 0) {
      console.log("🔴 [ChartsScreen] Validação falhou - período ou gráficos não selecionados");
      return;
    }

    // Mapear corretamente o período para a chave da meta
    let goalKey: keyof typeof goals;
    switch (selectedPeriod) {
      case Period.DIARIA:
        goalKey = 'dailyGoal';
        break;
      case Period.SEMANAL:
        goalKey = 'weeklyGoal';
        break;
      case Period.MENSAL:
        goalKey = 'monthlyGoal';
        break;
      default:
        console.log("🔴 [ChartsScreen] Período inválido:", selectedPeriod);
        return;
    }
    
    const goal = goals[goalKey];
    console.log("🔵 [ChartsScreen] goalKey:", goalKey);
    console.log("🔵 [ChartsScreen] goal encontrado:", goal);
    
    if (!goal) {
      console.log("🔴 [ChartsScreen] Meta não encontrada para o período:", selectedPeriod);
      return;
    }

    console.log("🔵 [ChartsScreen] Chamando generateCharts...");
    const result = await generateCharts({
      selectedPeriod,
      selectedCharts,
      goalValue: goal.goalValue,
    });

    console.log("🔵 [ChartsScreen] Resultado da API:", result);

    if (result && result.success) {
      console.log("🟢 [ChartsScreen] Navegando para Charts com dados:", result.data);
      // Navegar para a tela de visualização dos gráficos passando os dados crus
      router.push({
        pathname: '/functionsAdmin/Charts',
        params: {
          apiData: JSON.stringify(result.data),
          selectedPeriod: selectedPeriod,
          goalsMeta: JSON.stringify({
            daily: goals.dailyGoal?.goalValue || 0,
            weekly: goals.weeklyGoal?.goalValue || 0,
            monthly: goals.monthlyGoal?.goalValue || 0,
          })
        }
      });
    } else {
      console.log("🔴 [ChartsScreen] Falha na geração dos gráficos ou dados inválidos");
    }
  };

  // Renderizar card de período
  const renderPeriodCard = (period: Period) => {
    const isSelected = selectedPeriod === period;
    
    return (
      <TouchableOpacity
        key={period}
        style={[
          styles.periodCard,
          isSelected && styles.periodCardSelected
        ]}
        onPress={() => handleSelectPeriod(period)}
      >
        <View style={styles.periodHeader}>
          <FontAwesome 
            name="calendar" 
            size={20} 
            color={isSelected ? Colors.blue[600] : Colors.gray[600]} 
          />
          <Text style={[
            styles.periodTitle,
            isSelected && styles.periodTitleSelected
          ]}>
            {periodLabels[period]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Renderizar card de gráfico
  const renderChartCard = (chart: typeof chartTypes[0]) => {
    const isSelected = selectedCharts.includes(chart.id);
    
    // Validações por tipo: alguns gráficos apenas semanal/mensal
    const isWeeklyProfitChart = chart.id === 'weeklyProfit';
    const isTotalsBarGroupChart = chart.id === 'totalsBarGroup';
    const onlyWeeklyOrMonthly = isWeeklyProfitChart || isTotalsBarGroupChart;
    const isWeeklyMonthlyValid = selectedPeriod === Period.SEMANAL || selectedPeriod === Period.MENSAL;
    const isDisabled = !chart.available || (onlyWeeklyOrMonthly && !isWeeklyMonthlyValid);
    
    return (
      <TouchableOpacity
        key={chart.id}
        style={[
          styles.chartCard,
          isSelected && styles.chartCardSelected,
          isDisabled && styles.chartCardDisabled
        ]}
        onPress={() => !isDisabled && toggleChartSelection(chart.id)}
        disabled={isDisabled}
      >
        <View style={styles.chartHeader}>
          <FontAwesome 
            name={chart.icon as any} 
            size={24} 
            color={isDisabled ? Colors.gray[400] : isSelected ? Colors.blue[600] : Colors.gray[600]} 
          />
          <View style={styles.chartInfo}>
            <Text style={[
              styles.chartTitle,
              isSelected && styles.chartTitleSelected,
              isDisabled && styles.chartTitleDisabled
            ]}>
              {chart.title}
            </Text>
            <Text style={[
              styles.chartDescription,
              isDisabled && styles.chartDescriptionDisabled
            ]}>
              {chart.description}
            </Text>
          </View>
        </View>
        
        {(!chart.available || (onlyWeeklyOrMonthly && !isWeeklyMonthlyValid && selectedPeriod)) && (
          <View style={styles.chartBadgeContainer}>
            {!chart.available && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Em breve</Text>
              </View>
            )}
            {onlyWeeklyOrMonthly && !isWeeklyMonthlyValid && selectedPeriod && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Apenas semanal/mensal</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Se não há metas configuradas
  if (availablePeriods.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Gráficos" titleStyle={{ fontSize: 25 }} />
        <View style={styles.emptyState}>
          <FontAwesome name="bar-chart" size={64} color={Colors.gray[400]} />
          <Text style={styles.emptyTitle}>Nenhuma meta configurada</Text>
          <Text style={styles.emptyDescription}>
            Para visualizar gráficos, você precisa primeiro configurar pelo menos uma meta ativa.
          </Text>
          <Text style={styles.emptySubDescription}>
            Vá para "Configurações de Metas" e ative uma meta diária, semanal ou mensal.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Gráficos" titleStyle={{ fontSize: 25 }} />
      
      {(loadingGoals || generating) && (
        <Spinner
          visible={true}
          textContent={loadingGoals ? 'Carregando metas...' : 'Gerando gráficos...'}
          textStyle={{
            color: Colors.text.primary,
            fontSize: 16,
            fontWeight: '500'
          }}
          color={Colors.blue.logo}
          overlayColor={Colors.overlay.medium}
          size="large"
          animation="fade"
        />
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Informativo */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconContainer}>
              <FontAwesome name="bar-chart" size={20} color="white" />
            </View>
            <Text style={styles.infoTitle}>Gráficos e Relatórios</Text>
          </View>
          <Text style={styles.infoText}>
            Selecione um período e os tipos de gráficos que deseja visualizar. 
            Os gráficos são baseados nas metas ativas configuradas e nos dados do sistema.
            Quanto mais graficos forem requeridos, mais tempo será necessário para gerar os gráficos.
          </Text>
        </View>

        {/* Seção de Períodos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Período</Text>
          <View style={styles.periodsContainer}>
            {availablePeriods.map(renderPeriodCard)}
          </View>
        </View>

        {/* Lista de Gráficos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gráficos Disponíveis</Text>
          <Text style={styles.sectionDescription}>
            Selecione os gráficos que deseja gerar
          </Text>
          <View style={styles.chartsContainer}>
            {chartTypes.map(renderChartCard)}
          </View>
        </View>

        {/* Botão de Gerar */}
        <View style={styles.generateSection}>
          <TouchableOpacity 
            style={[
              styles.generateButton,
              (selectedCharts.length === 0 || generating) && styles.generateButtonDisabled
            ]}
            disabled={selectedCharts.length === 0 || generating}
            onPress={() => {
              console.log("🟡 [ChartsScreen] Botão clicado!");
              handleGenerateCharts();
            }}
          >
            <FontAwesome 
              name={generating ? "spinner" : "bar-chart"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.generateButtonText}>
              {generating ? 'Gerando...' : `Gerar Gráficos ${selectedCharts.length > 0 ? `(${selectedCharts.length})` : ''}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}