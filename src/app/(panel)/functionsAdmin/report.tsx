import CashRegisterDetailsModal from "@/components/CashRegisterDetailsModal";
import Header from "@/components/Header";
import PDFViewer from "@/components/PDFViewer";
import Colors from "@/constants/Colors";
import { styles } from "@/styles/functions/reportStyle";
import { CashRegister, ReportData } from "@/types/dashboard/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function Report() {
  const router = useRouter();
  const { reportData, pdfData, pdfFilename } = useLocalSearchParams<{
    reportData: string;
    pdfData: string;
    pdfFilename: string;
  }>();

  console.log("🔵 [Report] Parâmetros recebidos:", { reportData, pdfData, pdfFilename });
  console.log("🔵 [Report] reportData existe:", !!reportData);
  console.log("🔵 [Report] reportData tipo:", typeof reportData);
  console.log("🔵 [Report] reportData length:", reportData?.length);
  console.log("🔵 [Report] reportData primeiros 100 chars:", reportData?.substring(0, 100));
  console.log("🔵 [Report] pdfData existe:", !!pdfData);
  console.log("🔵 [Report] pdfData length:", pdfData?.length);
  console.log("🔵 [Report] pdfFilename:", pdfFilename);

  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [showCashRegisterModal, setShowCashRegisterModal] = useState(false);
  const [selectedCashRegister, setSelectedCashRegister] = useState<CashRegister | null>(null);
  const [selectedCashRegisterIndex, setSelectedCashRegisterIndex] = useState<number>(0);

  // Parse dos dados do relatório
  let report: ReportData['report'] | null = null;
  try {
    if (reportData) {
      console.log("🔵 [Report] Tentando fazer parse do JSON...");
      report = JSON.parse(reportData);
      console.log("🟢 [Report] Parse bem-sucedido!");
      console.log("🟢 [Report] Report type:", report?.type);
      console.log("🟢 [Report] Report summary existe:", !!report?.summary);
      console.log("🟢 [Report] Report cashRegisters length:", report?.cashRegisters?.length);
      
      // As URLs de gráfico já chegam corretamente codificadas; não decodificar aqui
    } else {
      console.log("🔴 [Report] reportData é null/undefined");
    }
  } catch (error) {
    console.error('🔴 [Report] Erro ao fazer parse dos dados do relatório:', error);
    console.log('🔴 [Report] Dados recebidos:', reportData);
    console.log('🔴 [Report] Tipo dos dados:', typeof reportData);
    console.log('🔴 [Report] Primeiros 200 chars:', reportData?.substring(0, 200));
  }
  
  const pdfBase64 = pdfData || "";

  if (!report) {
    return (
      <View style={styles.container}>
        <Header title="Relatório" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.red[500]} />
          <Text style={styles.errorText}>Erro ao carregar dados do relatório</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handlePdfView = () => {
    if (!pdfBase64) {
      Alert.alert("Erro", "PDF não disponível para visualização");
      return;
    }
    
    setIsPdfLoading(true);
    setTimeout(() => {
      setShowPdfViewer(true);
      setIsPdfLoading(false);
    }, 500);
  };

  const handlePdfClose = () => {
    setShowPdfViewer(false);
    setTimeout(() => {
      setIsPdfLoading(false);
    }, 300);
  };

  const handlePdfSuccess = (message: string) => {
    Alert.alert("Sucesso", message);
  };

  const handlePdfError = (error: string) => {
    Alert.alert("Erro", error);
  };

  const handleCashRegisterDetails = (cashRegister: CashRegister, index: number) => {
    setSelectedCashRegister(cashRegister);
    setSelectedCashRegisterIndex(index);
    setShowCashRegisterModal(true);
  };

  const handleCloseCashRegisterModal = () => {
    setShowCashRegisterModal(false);
    setSelectedCashRegister(null);
    setSelectedCashRegisterIndex(0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format('DD/MM/YYYY HH:mm');
  };

  const getReportTypeLabel = (type: string) => {
    const types = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
      full: 'Completo'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <View style={styles.container}>
      <Header title="Relatório" />
      
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header do Relatório */}
        <View style={styles.reportHeader}>
          <View style={styles.reportHeaderContent}>
            <View style={styles.reportIconContainer}>
              <Ionicons name="document-text" size={32} color={Colors.blue.primary} />
            </View>
            <View style={styles.reportHeaderText}>
              <Text style={styles.reportTitle}>Relatório {getReportTypeLabel(report.type)}</Text>
              <Text style={styles.reportSubtitle}>
                {report.period.startDate && report.period.endDate
                  ? `${moment(report.period.startDate).format('DD/MM/YYYY')} - ${moment(report.period.endDate).format('DD/MM/YYYY')}`
                  : 'Período não especificado'
                }
              </Text>
            </View>
          </View>
          
          {pdfBase64 && (
            <Pressable style={styles.pdfButton} onPress={handlePdfView}>
              <Ionicons name="document-outline" size={20} color={Colors.white} />
              <Text style={styles.pdfButtonText}>Visualizar PDF</Text>
            </Pressable>
          )}
        </View>

        {/* Resumo Executivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Executivo</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Ionicons name="business" size={24} color={Colors.blue.primary} />
              <Text style={styles.summaryLabel}>Caixas</Text>
              <Text style={styles.summaryValue}>{report.summary.totalCashRegisters}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Ionicons name="cash" size={24} color={Colors.green[500]} />
              <Text style={styles.summaryLabel}>Valor Total</Text>
              <Text style={styles.summaryValue}>{formatCurrency(report.summary.totals.finalValue)}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Ionicons name="trending-up" size={24} color={Colors.purple[500]} />
              <Text style={styles.summaryLabel}>Lucro</Text>
              <Text style={styles.summaryValue}>{formatCurrency(report.summary.totals.finalValue - report.summary.totals.initialValue)}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Ionicons name="car-outline" size={24} color={Colors.blue[600]} />
              <Text style={styles.summaryLabel}>Veículos</Text>
              <Text style={styles.summaryValue}>{formatCurrency(report.summary.totals.vehicleEntryTotal)}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Ionicons name="bag-outline" size={24} color={Colors.green[500]} />
              <Text style={styles.summaryLabel}>Produtos</Text>
              <Text style={styles.summaryValue}>{formatCurrency(report.summary.totals.generalSaleTotal)}</Text>
            </View>

            <View style={styles.summaryCard}>
              <Ionicons name="arrow-down" size={24} color={Colors.red[500]} />
              <Text style={styles.summaryLabel}>Despesas</Text>
              <Text style={styles.summaryValue}>{formatCurrency(report.summary.totals.outgoingExpenseTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Transações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transações</Text>
          <View style={styles.transactionsGrid}>
            <View style={styles.transactionCard}>
              <Ionicons name="car-outline" size={20} color={Colors.blue.primary} />
              <Text style={styles.transactionLabel}>Veículos</Text>
              <Text style={styles.transactionValue}>{report.summary.totals.vehicleTransactions}</Text>
            </View>
            
            <View style={styles.transactionCard}>
              <Ionicons name="bag-outline" size={20} color={Colors.green[500]} />
              <Text style={styles.transactionLabel}>Produtos</Text>
              <Text style={styles.transactionValue}>{report.summary.totals.productTransactions}</Text>
            </View>
            
            <View style={styles.transactionCard}>
              <Ionicons name="receipt-outline" size={20} color={Colors.orange[500]} />
              <Text style={styles.transactionLabel}>Despesas</Text>
              <Text style={styles.transactionValue}>{report.summary.totals.outgoingExpenses}</Text>
            </View>
          </View>
        </View>

        {/* Análise de Tempo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise de Tempo</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Ionicons name="time" size={24} color={Colors.blue[600]} />
              <Text style={styles.summaryLabel}>Tempo Total</Text>
              <Text style={styles.summaryValue}>
                {report.summary.timeAnalysis.totalOpenTime.hours}h {report.summary.timeAnalysis.totalOpenTime.minutes}min
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Ionicons name="timer" size={24} color={Colors.purple[500]} />
              <Text style={styles.summaryLabel}>Tempo Médio</Text>
              <Text style={styles.summaryValue}>
                {report.summary.timeAnalysis.averageOpenTime.hours}h {report.summary.timeAnalysis.averageOpenTime.minutes}min
              </Text>
            </View>
          </View>
        </View>

        {/* Gráficos */}
        {Object.keys(report.charts).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gráficos</Text>
            <View style={styles.chartsContainer}>
              {report.charts.revenueGrowth && (
                <View style={styles.chartCard}>
                  <View style={styles.chartHeader}>
                    <Ionicons name="trending-up" size={20} color={Colors.green[500]} />
                    <Text style={styles.chartTitle}>Análise da Receita</Text>
                  </View>
                  <Image 
                    source={{ uri: report.charts.revenueGrowth.chartUrl }} 
                    style={styles.chartImage}
                    resizeMode="contain"
                  />
                </View>
              )}
              
              {report.charts.bestProducts && (
                <View style={styles.chartCard}>
                  <View style={styles.chartHeader}>
                    <Ionicons name="bar-chart" size={20} color={Colors.blue[500]} />
                    <Text style={styles.chartTitle}>Produtos Mais Vendidos</Text>
                  </View>
                  <Image 
                    source={{ uri: report.charts.bestProducts.chartUrl }} 
                    style={styles.chartImage}
                    resizeMode="contain"
                  />
                </View>
              )}
              
              {report.charts.expensesBreakdown && (
                <View style={styles.chartCard}>
                  <View style={styles.chartHeader}>
                    <Ionicons name="pie-chart" size={20} color={Colors.orange[500]} />
                    <Text style={styles.chartTitle}>Balanço de Transações</Text>
                  </View>
                  <Image 
                    source={{ uri: report.charts.expensesBreakdown.chartUrl }} 
                    style={styles.chartImage}
                    resizeMode="contain"
                  />
                </View>
              )}
              
              {report.charts.hourlyAnalysis && (
                <View style={styles.chartCard}>
                  <View style={styles.chartHeader}>
                    <Ionicons name="analytics" size={20} color={Colors.purple[500]} />
                    <Text style={styles.chartTitle}>Análise por Movimentos</Text>
                  </View>
                  <Image 
                    source={{ uri: report.charts.hourlyAnalysis.chartUrl }} 
                    style={styles.chartImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {/* Resumo dos Caixas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caixas</Text>
          {report.cashRegisters.map((cashRegister, index) => (
            <View key={cashRegister.id} style={styles.cashRegisterSummaryCard}>
              <View style={styles.cashRegisterSummaryHeader}>
                <View style={styles.cashRegisterSummaryInfo}>
                  <Text style={styles.cashRegisterSummaryTitle}>Caixa #{index + 1}</Text>
                  <Text style={styles.cashRegisterSummaryOperator}>{cashRegister.operator}</Text>
                  <Text style={styles.cashRegisterSummaryDate}>
                    {formatDate(cashRegister.openingDate)}
                  </Text>
                  <Text style={styles.cashRegisterSummaryProfit}>
                    Lucro: {formatCurrency(cashRegister.finalValue - cashRegister.initialValue)}
                  </Text>
                  <Text style={styles.cashRegisterSummaryTime}>
                    Tempo: {cashRegister.openTime.formatted}
                  </Text>
                </View>
                <View style={styles.cashRegisterSummaryStatus}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: cashRegister.status === 'open' ? Colors.green[100] : Colors.red[100] }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: cashRegister.status === 'open' ? Colors.green[700] : Colors.red[700] }
                    ]}>
                      {cashRegister.status === 'open' ? 'Aberto' : 'Fechado'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Pressable 
                style={styles.detailsButton}
                onPress={() => handleCashRegisterDetails(cashRegister, index)}
              >
                <Ionicons name="eye-outline" size={16} color={Colors.blue.primary} />
                <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* PDF Viewer */}
      <PDFViewer
        base64={pdfBase64}
        visible={showPdfViewer && !isPdfLoading}
        onClose={handlePdfClose}
        filename={pdfFilename || "relatorio.pdf"}
        onSuccess={handlePdfSuccess}
        onError={handlePdfError}
      />

      {/* Cash Register Details Modal */}
      {selectedCashRegister && (
        <CashRegisterDetailsModal
          visible={showCashRegisterModal}
          onClose={handleCloseCashRegisterModal}
          cashRegister={selectedCashRegister}
          index={selectedCashRegisterIndex}
        />
      )}
    </View>
  );
}
