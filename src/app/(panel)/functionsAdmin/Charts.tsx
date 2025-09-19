import DailyTotalsPieChart from '@/components/charts/DailyTotalsPieChart';
import ProgressChart from '@/components/charts/ProgressChart';
import TotalsBarGroupChart from '@/components/charts/TotalsBarGroupChart';
import WeeklyProfitChart from '@/components/charts/WeeklyProfitChart';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { styles } from '@/styles/functions/chartsStyles';
import { Period } from '@/types/goalsTypes/goals';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from "react";
import { ScrollView, Text, View } from "react-native";

export default function Charts() {
  const params = useLocalSearchParams();
  
  // Parse dos dados recebidos via parâmetros (dados crus da API)
  const apiData: Record<string, any> = params.apiData ? JSON.parse(params.apiData as string) : {};
  const metas = params.goalsMeta ? JSON.parse(params.goalsMeta as string) : { daily: 0, weekly: 0, monthly: 0 };
  const rawSelectedPeriod = params.selectedPeriod as Period | Period[] | undefined;
  const selectedPeriod: Period | undefined = Array.isArray(rawSelectedPeriod) ? rawSelectedPeriod[0] : rawSelectedPeriod;
  const effectivePeriod: Period = (selectedPeriod && (selectedPeriod === Period.DIARIA || selectedPeriod === Period.SEMANAL || selectedPeriod === Period.MENSAL))
    ? selectedPeriod
    : Period.DIARIA;

  // Debug logs
  console.log("🔵 [Charts] Parâmetros recebidos:", params);
  console.log("🔵 [Charts] apiData:", apiData);
  console.log("🔵 [Charts] selectedPeriod:", selectedPeriod);
  console.log("🔵 [Charts] effectivePeriod:", effectivePeriod);

  // Função para gerar título baseado no período
  const getTitleByPeriod = (period: Period) => {
    switch (period) {
      case Period.DIARIA:
        return "Progresso da Meta Diária";
      case Period.SEMANAL:
        return "Progresso da Meta Semanal";
      case Period.MENSAL:
        return "Progresso da Meta Mensal";
      default:
        return "Progresso da Meta";
    }
  };

  // Função para gerar subtítulo baseado no valor da meta
  const getSubtitleByGoalValue = (goalValue: number) => {
    return `Meta: R$ ${goalValue.toLocaleString('pt-BR')}`;
  };

  // Se não há dados, mostrar mensagem
  const hasAnyData = apiData && (apiData.goalProgress || apiData.weeklyProfit || apiData.totalsBarGroup || apiData.dailyTotals);
  if (!hasAnyData) {
    return (
      <View style={styles.container}>
        <Header title="Gráficos" titleStyle={{ fontSize: 25 }} onBackPress={() => router.replace('/functionsAdmin/cash/ChartsScreen')}/>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nenhum dado encontrado</Text>
          <Text style={styles.emptyDescription}>
            Nenhum dado de gráfico encontrado. Volte e gere os gráficos novamente.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Gráficos" titleStyle={{ fontSize: 25 }} onBackPress={() => router.replace('/functionsAdmin/cash/ChartsScreen')}/>
      
      <ScrollView style={styles.content}>
        <View style={styles.chartsContainer}>
          {apiData.goalProgress && (
            <ProgressChart
              key={`goalProgress-${effectivePeriod}`}
              title={getTitleByPeriod(effectivePeriod)}
              subtitle={getSubtitleByGoalValue(apiData.goalProgress.targetValue || 0)}
              progress={apiData.goalProgress.progress || 0}
              currentValue={apiData.goalProgress.currentValue || 0}
              targetValue={apiData.goalProgress.targetValue || 0}
              progressColor={Colors.blue[600]}
            />
          )}

          {/* Gráfico de Progresso de Totais (Veículos, Produtos, Despesas) */}
          {(() => {
            const totalsGroup = apiData?.totalsBarGroup;
            if (!totalsGroup || !Array.isArray(totalsGroup.dailyTotals)) return null;
            return (
              <TotalsBarGroupChart
                title="Totais por Dia: Veículos, Produtos e Despesas"
                subtitle={`Período: ${effectivePeriod}`}
                dailyTotals={totalsGroup.dailyTotals}
              />
            );
          })()}

          {/* Gráfico de Pizza - Totais do Dia */}
          {(() => {
            const dailyTotals = apiData?.dailyTotals;
            console.log('🔵 [Charts] dailyTotals bruto:', dailyTotals);
            const totals = dailyTotals?.totals;
            console.log('🔵 [Charts] dailyTotals.totals:', totals);
            if (!totals) return null;
            const vehicles = Number(totals?.vehicleEntryTotal) || 0;
            const products = Number(totals?.generalSaleTotal) || 0;
            const expenses = Number(totals?.outgoingExpenseTotal) || 0;
            console.log('🔵 [Charts] valores pizza:', { vehicles, products, expenses });
            return (
              <DailyTotalsPieChart
                title="Distribuição do Dia"
                subtitle={"Veículos x Produtos x Despesas"}
                totals={{ vehicles, products, expenses }}
              />
            );
          })()}

          {/* Gráfico de Lucro Semanal - apenas para período semanal */}
          {(() => {
            const isWeeklyPeriod = effectivePeriod === Period.SEMANAL || effectivePeriod === Period.MENSAL;
            const weekly = apiData.weeklyProfit;
            const hasDailyData = Array.isArray(weekly?.dailyData) && weekly.dailyData.length > 0;
            
            console.log("🔵 [Charts] Condições do gráfico semanal:");
            console.log("🔵 [Charts] isWeeklyPeriod:", isWeeklyPeriod);
            console.log("🔵 [Charts] hasDailyData:", hasDailyData);
            console.log("🔵 [Charts] weekly:", weekly);
            console.log("🔵 [Charts] dailyData:", weekly?.dailyData);
            
            const shouldShow = isWeeklyPeriod && weekly && hasDailyData;
            console.log("🔵 [Charts] shouldShow:", shouldShow);
            
            return shouldShow && (
              <WeeklyProfitChart
                title="Lucro por Dia da Semana"
                subtitle={`Meta Semanal: R$ ${(metas.weekly || 0).toLocaleString('pt-BR')}`}
                weeklyData={weekly?.dailyData || []}
                goalValue={metas.weekly || 0}
                currentDay={weekly?.weeklyGoal?.currentDay || 1}
              />
            );
          })()}
        </View>
      </ScrollView>
    </View>
  );
}