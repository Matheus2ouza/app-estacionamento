import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import { styles } from "@/src/styles/functions/detailsCashStyle";
import Colors from "@/src/constants/Colors";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useDetailsCash } from "@/src/hooks/dashboard/useDetailsCash";
import { useCash } from "@/src/context/CashContext";
import CashAlertModal from "@/src/components/CashAlertModal";

const screenWidth = Dimensions.get("window").width;

const getDiasSemana = (start: number, end: number): number[] => {
  const dias = [];

  if (start <= end) {
    for (let i = start; i <= end; i++) {
      dias.push(i);
    }
  } else {
    for (let i = start; i < 7; i++) {
      dias.push(i);
    }
    for (let i = 0; i <= end; i++) {
      dias.push(i);
    }
  }

  return dias;
};

const getDiaSemanaAbrev = (dia: number): string => {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return dias[dia];
};

const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    OPEN: "ABERTO",
    CLOSE: "FECHADO",
  };
  return statusMap[status] || status;
};

export default function DetailsCash() {
  const { 
    openCashId, 
    cashStatus, 
    getStatusCash, 
    loading: cashLoading,
    error: cashError
  } = useCash();
  
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showValue, setShowValue] = useState(false); // Adicionei esta linha

  // Só busca os dados se o caixa estiver aberto
  const { data, loading, error, refetch } = useDetailsCash(
    cashStatus === "OPEN" ? openCashId || "" : ""
  );

  useEffect(() => {
    getStatusCash();
  }, []);

  // Mostra modal de bloqueio se não houver caixa aberto
  useEffect(() => {
    if (!cashLoading && (!openCashId || cashStatus !== "OPEN")) {
      setShowBlockModal(true);
    }
  }, [cashLoading, openCashId, cashStatus]);

  if (cashLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue.dark} />
      </View>
    );
  }

  // Modal de bloqueio - aparece quando não há caixa aberto
  if (!openCashId || cashStatus !== "OPEN") {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.gray.zinc }}>
        <CashAlertModal
          visible={showBlockModal}
          type="block"
          onClose={() => {
            setShowBlockModal(false);
            router.back();
          }}
        />
      </View>
    );
  }

  if (error || !data?.success) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "Erro ao carregar dados"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    basicDataCash,
    paymentMethodCounts,
    categorySales,
    goalProgress,
    graficoSemanal,
  } = data.data;
  const goalConfigs = data.goalConfigs || null;

  const hasFullData = goalConfigs !== null;

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <LinearGradient
        colors={[Colors.gray.zinc, Colors.blue.light]}
        style={styles.header}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
          <TouchableOpacity
            onPress={() => router.push("/Config/configAdmin")}
            style={{ marginRight: 10, marginTop: -10 }}
          >
            <AntDesign
              name="left"
              size={24}
              color={Colors.white}
              style={{ transform: [{ scaleY: 1.7 }] }}
            />
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <Text style={styles.titleHeader}>Dados do Caixa</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/FunctionsAdmin/goalsConfiguration")}
          style={{ marginTop: 10 }}
        >
          <View style={styles.iconCircle}>
            <Feather name="bar-chart-2" size={26} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.container}>
        {/* Resumo numérico */}
        <View style={styles.summaryContainer}>
          {/* Status do Caixa */}
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Status do Caixa</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      basicDataCash.statusCash === "OPEN"
                        ? Colors.green.dark
                        : Colors.red[500],
                  },
                ]}
              />
              <Text style={[styles.summaryValue, { marginLeft: 5 }]}>
                {translateStatus(basicDataCash.statusCash)}
              </Text>
            </View>
            <Text style={styles.summarySubText}>
              Operador: {basicDataCash.operatorCash}
            </Text>
          </View>

          {/* Horários */}
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Horário de Abertura</Text>
            <Text style={styles.summaryValue}>
              {formatTime(basicDataCash.openingTimeCash)}
            </Text>
            <Text style={styles.summaryLabel}>Horário de Fechamento</Text>
            <Text style={styles.summaryValue}>
              {formatTime(basicDataCash.closingTimeCash)}
            </Text>
          </View>
        </View>

        {/* Resumo financeiro */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total do Dia</Text>
            <Text style={styles.summaryValue}>
              R$ {Number(basicDataCash.totalCash).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Transações</Text>
            <Text style={styles.summaryValue}>
              {basicDataCash.transactionsCash}
            </Text>
          </View>
        </View>

        {hasFullData ? (
          <>
            {/* Gráfico de Linha - Vendas por dia */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Vendas Diárias (R$)</Text>
              <LineChart
                data={{
                  labels: getDiasSemana(
                    goalConfigs.week_start_day,
                    goalConfigs.week_end_day
                  ).map(getDiaSemanaAbrev),
                  datasets: [
                    {
                      data: graficoSemanal.map((item) => item.valor),
                      color: (opacity = 1) => Colors.blue.dark,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={screenWidth - 55}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: Colors.white,
                  backgroundGradientTo: Colors.white,
                  color: (opacity = 1) => Colors.gray.dark,
                  strokeWidth: 3,
                  barPercentage: 0.5,
                  decimalPlaces: 2,
                  propsForLabels: {
                    fontSize: 12,
                  },
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: Colors.white,
                  },
                  fillShadowGradientFromOpacity: 0.1,
                  fillShadowGradientToOpacity: 0.1,
                }}
                bezier
                style={styles.chart}
              />
            </View>

            {/* Gráfico de Barras - Tipos de veículos/produtos */}
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Vendas por Categoria</Text>
                <View style={styles.switchContainer}>
                  <Text
                    style={[
                      styles.switchLabel,
                      !showValue && styles.activeLabel,
                    ]}
                  >
                    Quantidade
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowValue(!showValue)}
                    style={[styles.switch, showValue && styles.switchActive]}
                  >
                    <View
                      style={[
                        styles.switchToggle,
                        showValue && styles.switchToggleActive,
                      ]}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.switchLabel,
                      showValue && styles.activeLabel,
                    ]}
                  >
                    Valor
                  </Text>
                </View>
              </View>
              <BarChart
                data={{
                  labels: ["Carros", "Motos", "Produtos"],
                  datasets: [
                    {
                      data: showValue
                        ? [
                            categorySales.CARRO.valor,
                            categorySales.MOTO.valor,
                            categorySales.PRODUTOS.valor,
                          ]
                        : [
                            categorySales.CARRO.quantidade,
                            categorySales.MOTO.quantidade,
                            categorySales.PRODUTOS.quantidade,
                          ],
                    },
                  ],
                }}
                width={screenWidth - 55}
                height={220}
                yAxisLabel={""}
                yAxisSuffix={showValue ? "" : ""}
                yLabelsOffset={20}
                fromZero
                showBarTops={true}
                chartConfig={{
                  backgroundGradientFrom: Colors.white,
                  backgroundGradientTo: Colors.white,
                  color: (opacity = 1) => Colors.blue.dark,
                  strokeWidth: 1,
                  barPercentage: 0.6,
                  decimalPlaces: showValue ? 2 : 0,
                  propsForLabels: {
                    fontSize: 10,
                    dx: 5,
                  },
                  propsForBackgroundLines: {
                    strokeWidth: 0,
                  },
                  fillShadowGradientOpacity: 0,
                  barRadius: 4,
                  style: {
                    borderRadius: 8,
                  },
                  formatYLabel: (value: any) => {
                    if (showValue) {
                      return `R$ ${Number(value).toFixed(2)}`;
                    }
                    return value;
                  },
                }}
                style={{
                  marginLeft: 10,
                  marginRight: 0,
                }}
                verticalLabelRotation={0}
                withInnerLines={false}
              />
            </View>

            {/* Gráfico de Pizza - Métodos de pagamento */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Métodos de Pagamento (%)</Text>
              <PieChart
                data={[
                  {
                    name: "Dinheiro",
                    population: paymentMethodCounts.DINHEIRO,
                    color: Colors.orange[500],
                    legendFontColor: Colors.gray.dark,
                  },
                  {
                    name: "Débito",
                    population: paymentMethodCounts.DEBITO,
                    color: Colors.green.dark,
                    legendFontColor: Colors.gray.dark,
                  },
                  {
                    name: "Crédito",
                    population: paymentMethodCounts.CREDITO,
                    color: Colors.blue.dark,
                    legendFontColor: Colors.gray.dark,
                  },
                  {
                    name: "PIX",
                    population: paymentMethodCounts.PIX,
                    color: Colors.purple[500],
                    legendFontColor: Colors.gray.dark,
                  },
                ]}
                width={screenWidth - 55}
                height={180}
                chartConfig={{
                  backgroundGradientFrom: Colors.white,
                  backgroundGradientTo: Colors.white,
                  color: (opacity = 1) => Colors.gray.dark,
                  strokeWidth: 3,
                  barPercentage: 0.5,
                  decimalPlaces: 2,
                  propsForLabels: {
                    fontSize: 12,
                  },
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
                absolute
              />
            </View>

            {/* Gráfico de Progresso - Meta diária */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Progresso da Meta Diária</Text>
              <Text style={styles.progressAmount}>
                R$ {Number(goalProgress.realizado).toFixed(2)} / R${" "}
                {Number(goalConfigs.daily_goal_value).toFixed(2)}
              </Text>

              <View style={styles.progressContainer}>
                <ProgressChart
                  data={{
                    data: [goalProgress.progresso / 100],
                  }}
                  width={screenWidth - 55}
                  height={220}
                  chartConfig={{
                    backgroundGradientFrom: Colors.white,
                    backgroundGradientTo: Colors.white,
                    decimalPlaces: 1,
                    color: (opacity = 1, index) => {
                      const progress = goalProgress.progresso / 100;
                      if (progress >= 1)
                        return `rgba(74, 222, 128, ${opacity})`;
                      if (progress >= 0.75)
                        return `rgba(250, 204, 21, ${opacity})`;
                      if (progress >= 0.5)
                        return `rgba(249, 115, 22, ${opacity})`;
                      return `rgba(239, 68, 68, ${opacity})`;
                    },
                    strokeWidth: 16,
                    propsForBackgroundLines: {
                      strokeWidth: 0,
                    },
                    fillShadowGradientOpacity: 0,
                    propsForDots: {
                      r: "0",
                    },
                  }}
                  hideLegend={true}
                  style={styles.progressChart}
                  radius={60}
                  strokeWidth={16}
                />

                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressPercentage}>
                    {Math.round(goalProgress.progresso)}%
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.configWarningContainer}>
            <Text style={styles.configWarningTitle}>
              Configuração Necessária
            </Text>
            <Text style={styles.configWarningText}>
              Para visualizar os gráficos e análises detalhadas, por favor
              configure as metas no sistema.
            </Text>
            <TouchableOpacity
              style={styles.configButton}
              onPress={() => router.push("/FunctionsAdmin/goalsConfiguration")}
            >
              <Text style={styles.configButtonText}>Configurar Metas</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}