import Header from "@/src/components/Header";
import PDFViewer from "@/src/components/PDFViewer";
import Colors from "@/src/constants/Colors";
import { useGeranateDashboard } from "@/src/hooks/dashboard/useGerenateDashoard";
import { styles } from "@/src/styles/functions/dashboardStyle";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

export default function Dashboard() {
  const dateLimit = '2025-08-04'
  const { loading, error, success, message, generateDashboard } = useGeranateDashboard();
  const router = useRouter();
  
  const [reportType, setReportType] = useState<
    "daily" | "weekly" | "monthly" | "full" | null
  >(null);
  const [includeDetails, setIncludeDetails] = useState(false);
  const [generateCharts, setGenerateCharts] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [customPeriod, setCustomPeriod] = useState(false);
  const [generatePdf, setGeneratePdf] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>(
    {}
  );
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [endDateMarkedDates, setEndDateMarkedDates] = useState<{ [key: string]: any }>({});
  const [startDateMarkedDates, setStartDateMarkedDates] = useState<{ [key: string]: any }>({});
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>("relatorio.pdf");
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const reportTypes = [
    { 
      key: "daily",
      label: "Diário",
      icon: "calendar-outline",
    },
    {
      key: "weekly",
      label: "Semanal",
      icon: "calendar-outline",
    },
    {
      key: "monthly",
      label: "Mensal",
      icon: "calendar-outline",
    },
    {
      key: "full",
      label: "Completo",
      icon: "calendar-outline",
    },
  ];

  const availableCharts = [
    { key: "revenueGrowth", label: "Análise da Receita", icon: "trending-up" },
    { key: "bestProducts", label: "Produtos Mais Vendidos", icon: "bar-chart" },
    { key: "expensesBreakdown", label: "Balanço de Transações", icon: "pie-chart" },
    { key: "hourlyAnalysis", label: "Análise por Movimentos", icon: "analytics" },
  ];

  // Função para calcular datas padrão baseadas no tipo de relatório
  const getDefaultDates = (
    type: "daily" | "weekly" | "monthly" | "full" | null
  ) => {
    const today = new Date();
    
    switch (type) {
      case "daily":
        return { startDate: today, endDate: today };
      case "weekly":
        // Semana = 5 dias úteis a partir de hoje
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 4); // 5 dias incluindo hoje
        return { startDate: today, endDate: weekEnd };
      case "monthly":
        // Mês = mês completo atual
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { startDate: monthStart, endDate: monthEnd };
      case "full":
        // Completo = desde o início do ano até hoje
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return { startDate: yearStart, endDate: today };
      default:
        return { startDate: null, endDate: null };
    }
  };

  // Função para obter as datas que serão usadas no relatório
  const getReportDates = () => {
    if (customPeriod) {
      return { startDate, endDate };
    } else {
      return getDefaultDates(reportType);
    }
  };

  const handleChartToggle = (chartKey: string) => {
    setSelectedCharts((prev) =>
      prev.includes(chartKey) 
        ? prev.filter((key) => key !== chartKey)
        : [...prev, chartKey]
    );
  };

  const handleReportTypeChange = (
    type: "daily" | "weekly" | "monthly" | "full"
  ) => {
    // Se o tipo já está selecionado, deseleciona (permite desclicar)
    if (reportType === type) {
      setReportType(null);
    } else {
    setReportType(type);
    }
    // Limpar as datas quando mudar o tipo de relatório
    setStartDate(null);
    setEndDate(null);
  };

  const handleCustomPeriodChange = (value: boolean) => {
    setCustomPeriod(value);
    if (!value) {
      // Limpar as datas quando desativar período customizado
      setStartDate(null);
      setEndDate(null);
      setEndDateMarkedDates({});
      setStartDateMarkedDates({});
    }
  };

  const handleStartDatePress = () => {
    console.log('🔵 [handleStartDatePress] Abrindo calendário da data inicial');
    console.log('🔵 [handleStartDatePress] startDate atual:', startDate);
    console.log('🔵 [handleStartDatePress] endDate atual:', endDate);
    
    setTempDate(startDate);
    // Limpar seleção visual para permitir nova seleção
    setSelectedDates({});
    
    // Marcar a data final no calendário da data inicial (se existir)
    if (endDate) {
      const endDateStr = moment(endDate).format('YYYY-MM-DD');
      console.log('🔵 [handleStartDatePress] Marcando data final no calendário inicial:', endDateStr);
      setStartDateMarkedDates({
        [endDateStr]: {
          selected: true,
          selectedColor: Colors.red[500],
          selectedTextColor: Colors.white,
          customStyles: {
            container: {
              backgroundColor: Colors.red[500],
              borderRadius: 20,
              borderWidth: 3,
              borderColor: Colors.red[700],
              elevation: 5,
              shadowColor: Colors.red[500],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            text: {
              color: Colors.white,
              fontWeight: 'bold',
              fontSize: 18,
            },
          },
        },
      });
    } else {
      console.log('🔵 [handleStartDatePress] Nenhuma data final para marcar');
      setStartDateMarkedDates({});
    }
    
    setShowStartDatePicker(true);
  };

  const handleEndDatePress = () => {
    console.log('🟠 [handleEndDatePress] Abrindo calendário da data final');
    console.log('🟠 [handleEndDatePress] startDate atual:', startDate);
    console.log('🟠 [handleEndDatePress] endDate atual:', endDate);
    
    setTempDate(endDate);
    // Limpar seleção visual para permitir nova seleção
    setSelectedDates({});
    
    // Marcar a data inicial no calendário da data final (se existir)
    if (startDate) {
      const startDateStr = moment(startDate).format('YYYY-MM-DD');
      console.log('🟠 [handleEndDatePress] Marcando data inicial no calendário final:', startDateStr);
      setEndDateMarkedDates({
        [startDateStr]: {
          selected: true,
          selectedColor: Colors.orange[500],
          selectedTextColor: Colors.white,
          customStyles: {
            container: {
              backgroundColor: Colors.orange[500],
              borderRadius: 20,
              borderWidth: 3,
              borderColor: Colors.orange[700],
              elevation: 5,
              shadowColor: Colors.orange[500],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            text: {
              color: Colors.white,
              fontWeight: 'bold',
              fontSize: 18,
            },
          },
        },
      });
    } else {
      console.log('🟠 [handleEndDatePress] Nenhuma data inicial para marcar');
      setEndDateMarkedDates({});
    }
    
    setShowEndDatePicker(true);
  };

  const handleDateSelect = (day: DateData) => {
    const selectedDate = moment(day.dateString).toDate();
    const limitDate = moment(dateLimit).toDate();
    const today = moment().toDate();
    today.setHours(23, 59, 59, 999); // Fim do dia atual

    // Validar se a data selecionada não é anterior à data limite (apenas para data inicial)
    if (showStartDatePicker && selectedDate < limitDate) {
      alert(`A data inicial não pode ser anterior a ${moment(limitDate).format('DD/MM/YYYY')}.`);
      return;
    }

    // Validar se a data selecionada não é anterior à data inicial (apenas para data final)
    if (showEndDatePicker && startDate && selectedDate < startDate) {
      alert(`A data final não pode ser anterior à data inicial (${moment(startDate).format('DD/MM/YYYY')}).`);
      return;
    }

    // Validar se a data selecionada não é posterior à data final (apenas para data inicial)
    if (showStartDatePicker && endDate && selectedDate > endDate) {
      alert(`A data inicial não pode ser posterior à data final (${moment(endDate).format('DD/MM/YYYY')}).`);
      return;
    }

    // Validar se a data selecionada não é futura (maior que hoje)
    if (selectedDate > today) {
      alert("Não é possível selecionar uma data futura.");
      return;
    }

    setTempDate(selectedDate);
        setSelectedDates({
          [day.dateString]: {
            selected: true,
            color: Colors.blue.primary,
      },
    });
  };

  const handleStartDatePickerClose = () => {
    console.log('🔵 [handleStartDatePickerClose] Fechando calendário da data inicial');
    console.log('🔵 [handleStartDatePickerClose] startDateMarkedDates atual:', startDateMarkedDates);
    setShowStartDatePicker(false);
    setSelectedDates({});
    setTempDate(null);
    // Não limpar startDateMarkedDates para manter a marcação da data final
  };

  const handleEndDatePickerClose = () => {
    console.log('🟠 [handleEndDatePickerClose] Fechando calendário da data final');
    console.log('🟠 [handleEndDatePickerClose] endDateMarkedDates atual:', endDateMarkedDates);
    setShowEndDatePicker(false);
    setSelectedDates({});
    setTempDate(null);
    // Não limpar endDateMarkedDates para manter a marcação da data inicial
  };

  const handleStartDateConfirm = () => {
    if (tempDate) {
      const limitDate = moment(dateLimit).toDate();
      const today = moment().toDate();
      today.setHours(23, 59, 59, 999); // Fim do dia atual
      
      // Validar se a data inicial não é anterior à data limite
      if (tempDate < limitDate) {
        alert(`A data inicial não pode ser anterior a ${moment(limitDate).format('DD/MM/YYYY')}.`);
        return;
      }

      // Validar se a data inicial não é futura
      if (tempDate > today) {
        alert("Não é possível selecionar uma data futura.");
        return;
      }

      // Validar se a data inicial não é posterior à data final
      if (endDate && tempDate > endDate) {
        alert(`A data inicial não pode ser posterior à data final (${moment(endDate).format('DD/MM/YYYY')}).`);
        return;
      }

      setStartDate(tempDate);
      
      // Marcar a data inicial no calendário da data final com destaque visual
      const startDateStr = moment(tempDate).format('YYYY-MM-DD');
      console.log('🔵 [handleStartDateConfirm] Marcando data inicial no calendário final:', startDateStr);
      setEndDateMarkedDates({
        [startDateStr]: {
          selected: true,
          selectedColor: Colors.orange[500],
          selectedTextColor: Colors.white,
          customStyles: {
            container: {
              backgroundColor: Colors.orange[500],
              borderRadius: 20,
              borderWidth: 3,
              borderColor: Colors.orange[700],
              elevation: 5,
              shadowColor: Colors.orange[500],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            text: {
              color: Colors.white,
              fontWeight: 'bold',
              fontSize: 18,
            },
          },
        },
        });
      } else {
      alert("Por favor, selecione uma data inicial.");
      return;
    }

    setShowStartDatePicker(false);
    setSelectedDates({});
    setTempDate(null);
  };

  const handleEndDateConfirm = () => {
    if (tempDate) {
      const today = moment().toDate();
      today.setHours(23, 59, 59, 999); // Fim do dia atual

      // Validar se a data final não é anterior à data inicial
      if (startDate && tempDate < startDate) {
        alert("A data final não pode ser anterior à data inicial.");
        return;
      }

      // Validar se a data final não é futura
      if (tempDate > today) {
        alert("Não é possível selecionar uma data futura.");
        return;
      }

      setEndDate(tempDate);
      
      // Atualizar a marcação da data final no calendário da data inicial
      const endDateStr = moment(tempDate).format('YYYY-MM-DD');
      console.log('🟠 [handleEndDateConfirm] Marcando data final no calendário inicial:', endDateStr);
      setStartDateMarkedDates({
        [endDateStr]: {
          selected: true,
          selectedColor: Colors.red[500],
          selectedTextColor: Colors.white,
          customStyles: {
            container: {
              backgroundColor: Colors.red[500],
              borderRadius: 20,
              borderWidth: 3,
              borderColor: Colors.red[700],
              elevation: 5,
              shadowColor: Colors.red[500],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            text: {
              color: Colors.white,
              fontWeight: 'bold',
              fontSize: 18,
            },
          },
        },
      });
    } else {
      alert("Por favor, selecione uma data final.");
      return;
    }

    setShowEndDatePicker(false);
    setSelectedDates({});
    setTempDate(null);
    setEndDateMarkedDates({});
  };

  // Função para verificar se o botão deve estar desabilitado
  const isGenerateButtonDisabled = () => {
    if (customPeriod) {
      // Se período customizado está ativo, verificar se as datas foram preenchidas
      return !startDate || !endDate;
    } else {
      // Se período customizado não está ativo, verificar se há período predefinido selecionado
      return !reportType;
    }
  };

  // Função para verificar se a geração de gráficos deve estar desabilitada
  const isChartsDisabled = () => {
    // Se tipo "diário" está selecionado, desabilitar gráficos
    if (reportType === 'daily') {
      return true;
    }

    // Se período customizado está ativo, verificar se o intervalo é menor que 7 dias
    if (customPeriod && startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
      const daysDifference = end.diff(start, 'days') + 1; // +1 para incluir ambos os dias
      
      if (daysDifference < 7) {
        return true;
      }
    }

    return false;
  };

  const handleGenerateReport = async () => {
    const reportDates = getReportDates();
    
    // Validação: se período customizado está ativo, verificar se as datas foram preenchidas
    if (customPeriod) {
      if (!startDate || !endDate) {
        Alert.alert(
          "Erro",
          "Por favor, selecione as datas inicial e final para o relatório."
        );
          return;
        }
      } else {
      if (!reportType) {
        Alert.alert(
          "Erro",
          "Por favor, selecione um período predefinido ou ative a data personalizada."
        );
          return;
      }
    }

    // Preparar dados para a API
    const reportData: any = {
      pdf: generatePdf,
      includeDetails,
      generateCharts,
      selectedCharts: generateCharts ? selectedCharts : [],
    };

    // Adicionar tipo de relatório ou datas personalizadas
    if (customPeriod) {
      reportData.startDate = moment(reportDates.startDate).format('YYYY-MM-DD');
      reportData.endDate = moment(reportDates.endDate).format('YYYY-MM-DD');
    } else {
      // Mapear tipos para os valores esperados pela API
      const typeMapping = {
        daily: 'daily',
        weekly: 'weekly', 
        monthly: 'monthly',
        full: 'full'
      };
      reportData.reportType = typeMapping[reportType!];
    }

    try {
      const result = await generateDashboard(reportData);
      
      if (success) {
        // Se foi gerado PDF, exibir o visualizador
        if (result?.pdf) {
          setIsPdfLoading(true);
          
          // Gerar nome do arquivo baseado no tipo de relatório e data
          const reportDates = getReportDates();
          const dateStr = customPeriod 
            ? `${moment(reportDates.startDate).format('DD-MM-YYYY')}_${moment(reportDates.endDate).format('DD-MM-YYYY')}`
            : moment().format('DD-MM-YYYY');
          
          const typeStr = customPeriod ? 'personalizado' : (reportType || 'relatorio');
          setPdfFilename(`relatorio_${typeStr}_${dateStr}.pdf`);
          
          // Aguardar um pouco antes de definir os dados e mostrar o PDF
          setTimeout(() => {
            setPdfData(result.pdf);
            setShowPdfViewer(true);
            setIsPdfLoading(false);
          }, 500);
        }
        
        // Navegar para a tela de relatório com os dados
        if (result?.report) {
          console.log("Dados do relatório:", result.report);
          // Passar os dados do relatório para a tela de relatório
          router.push({
            pathname: "/(panel)/functionsAdmin/report",
            params: {
              reportData: JSON.stringify(result.report),
              pdfData: result.pdf || "",
              pdfFilename: pdfFilename
            }
          });
        }
      } else if (error) {
        Alert.alert("Erro", error);
      }
    } catch (err) {
      Alert.alert("Erro", "Erro ao gerar relatório. Tente novamente.");
    }
  };

  // Funções de callback para o PDFViewer
  const handlePdfSuccess = (message: string) => {
    Alert.alert("Sucesso", message);
  };

  const handlePdfError = (error: string) => {
    Alert.alert("Erro", error);
  };

  const handlePdfClose = () => {
    setShowPdfViewer(false);
    // Aguardar um pouco antes de limpar os dados para evitar conflitos
    setTimeout(() => {
      setPdfData(null);
      setIsPdfLoading(false);
    }, 300);
  };

  // Desabilitar gráficos automaticamente quando necessário
  useEffect(() => {
    if (isChartsDisabled()) {
      setGenerateCharts(false);
      setSelectedCharts([]);
    }
  }, [reportType, customPeriod, startDate, endDate]);

  // Limpeza quando o componente for desmontado
  useEffect(() => {
    return () => {
      // Limpar dados grandes da memória
      setPdfData(null);
      setIsPdfLoading(false);
    };
  }, []);

  return (
      <View style={styles.container}>
      <Header title="Dashboard" />
      
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção Informativa */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="information-circle" size={24} color="white" />
            </View>
            <Text style={styles.infoTitle}>Informações sobre Edição</Text>
          </View>
          <Text style={styles.infoDescription}>
            Para gerar o relatório, selecione os parâmetros desejados. Quanto mais detalhado, mais tempo será necessário para gerar o relatório.
          </Text>
        </View>

        {/* Período Predefinido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Período Predefinido</Text>
          <Text style={styles.sectionDescription}>
            Selecione um período predefinido para o relatório, será considerado a data apartir do dia atual, exemplo: se selecionar semanal, será considerado a data apartir do dia atual até 5 dias úteis a partir de hoje.
          </Text>
          <View style={styles.optionsContainer}>
            {reportTypes.map((type) => (
              <Pressable
                key={type.key}
                style={[
                  styles.optionButton,
                  reportType === type.key && styles.optionButtonSelected,
                  customPeriod && styles.optionButtonDisabled,
                ]}
                onPress={() =>
                  !customPeriod && handleReportTypeChange(type.key as any)
                }
                disabled={customPeriod}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                    styles.optionText,
                      reportType === type.key && styles.optionTextSelected,
                      customPeriod && styles.optionTextDisabled,
                    ]}
                  >
                    {type.label}
                  </Text>
                </View>
              </Pressable>
            ))}
        </View>

          {/* Switch para Data Personalizada */}
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={Colors.blue.primary}
              />
              <Text style={styles.switchLabel}>Data Personalizada</Text>
            </View>
            <Switch
              value={customPeriod}
              onValueChange={handleCustomPeriodChange}
              trackColor={{ false: Colors.gray[300], true: Colors.blue.light }}
              thumbColor={customPeriod ? Colors.blue.primary : Colors.gray[400]}
            />
          </View>
        </View>

        {/* Seleção de Datas (quando período customizado está ativo) */}
        {customPeriod && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Período Personalizado</Text>
            <Text style={styles.sectionDescription}>
              Defina o período personalizado para o relatório. Selecione a data
              inicial e final desejadas.
            </Text>
          
                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>Data Inicial</Text>
              <Pressable style={styles.dateButton} onPress={handleStartDatePress}>
                    <Text style={styles.dateButtonText}>
                  {startDate
                    ? moment(startDate).format("DD/MM/YYYY")
                    : "Selecionar data inicial"}
                    </Text>
                    <Ionicons 
                      name="calendar-outline" 
                      size={20} 
                      color={Colors.blue.primary} 
                    />
                  </Pressable>
                </View>

                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>Data Final</Text>
              <Pressable style={styles.dateButton} onPress={handleEndDatePress}>
                    <Text style={styles.dateButtonText}>
                  {endDate
                    ? moment(endDate).format("DD/MM/YYYY")
                    : "Selecionar data final"}
                    </Text>
                    <Ionicons 
                      name="calendar-outline" 
                      size={20} 
                      color={Colors.blue.primary} 
                    />
                  </Pressable>
                </View>
          </View>
        )}

        {/* Gerar PDF */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerar PDF</Text>
          <Text style={styles.sectionDescription}>
            Quando ativado, o relatório será gerado em formato PDF para download.
            Se desativado, os dados serão retornados apenas em formato JSON.
          </Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={Colors.blue.primary}
              />
              <Text style={styles.switchLabel}>Gerar PDF</Text>
            </View>
            <Switch
              value={generatePdf}
              onValueChange={setGeneratePdf}
              trackColor={{ false: Colors.gray[300], true: Colors.blue.light }}
              thumbColor={
                generatePdf ? Colors.blue.primary : Colors.gray[400]
              }
            />
          </View>
        </View>

        {/* Incluir Detalhes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incluir Detalhes</Text>
          <Text style={styles.sectionDescription}>
            Quando ativado, o relatório incluirá informações detalhadas de cada
            transação individual, como lista de produtos, valores específicos e
            métodos de pagamento utilizados.
          </Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons
                name="list-outline"
                size={20}
                color={Colors.blue.primary}
              />
              <Text style={styles.switchLabel}>Incluir Detalhes</Text>
            </View>
            <Switch
              value={includeDetails}
              onValueChange={setIncludeDetails}
              trackColor={{ false: Colors.gray[300], true: Colors.blue.light }}
              thumbColor={
                includeDetails ? Colors.blue.primary : Colors.gray[400]
              }
            />
          </View>
        </View>

        {/* Gerar Gráficos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerar Gráficos</Text>
          <Text style={styles.sectionDescription}>
            {isChartsDisabled() 
              ? "Gráficos não estão disponíveis para períodos diários ou intervalos menores que 7 dias."
              : "Quando ativado, o relatório incluirá gráficos e visualizações dos dados. Você pode escolher quais tipos de gráficos incluir na seção abaixo."
            }
          </Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons
                name="bar-chart-outline"
                size={20}
                color={isChartsDisabled() ? Colors.gray[400] : Colors.blue.primary}
              />
              <Text style={[
                styles.switchLabel,
                isChartsDisabled() && { color: Colors.gray[400] }
              ]}>Gerar Gráficos</Text>
            </View>
            <Switch
              value={generateCharts}
              onValueChange={setGenerateCharts}
              disabled={isChartsDisabled()}
              trackColor={{ 
                false: isChartsDisabled() ? Colors.gray[200] : Colors.gray[300], 
                true: isChartsDisabled() ? Colors.gray[200] : Colors.blue.light 
              }}
              thumbColor={
                isChartsDisabled() 
                  ? Colors.gray[300] 
                  : (generateCharts ? Colors.blue.primary : Colors.gray[400])
              }
            />
          </View>
        </View>

        {/* Seleção de Gráficos */}
        {generateCharts && !isChartsDisabled() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gráficos Disponíveis</Text>
            <Text style={styles.sectionDescription}>
              Selecione um ou mais tipos de gráficos para incluir no relatório.
              Cada gráfico analisa os dados de uma forma específica e será
              gerado com base no período selecionado.
            </Text>
            <View style={styles.chartsContainer}>
              {availableCharts.map((chart) => (
                <Pressable
                  key={chart.key}
                  style={[
                    styles.chartOption,
                    selectedCharts.includes(chart.key) &&
                      styles.chartOptionSelected,
                  ]}
                  onPress={() => handleChartToggle(chart.key)}
                >
                  <MaterialIcons 
                    name={chart.icon as any} 
                    size={24} 
                    color={
                      selectedCharts.includes(chart.key)
                        ? Colors.white
                        : Colors.blue.primary
                    }
                  />
                  <Text
                    style={[
                    styles.chartOptionText,
                      selectedCharts.includes(chart.key) &&
                        styles.chartOptionTextSelected,
                    ]}
                  >
                    {chart.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Botão Gerar Relatório */}
        <View style={styles.generateButtonContainer}>
          <Pressable
            style={[
              styles.generateButton,
              (isGenerateButtonDisabled() || loading) && styles.generateButtonDisabled,
            ]}
            onPress={handleGenerateReport}
            disabled={isGenerateButtonDisabled() || loading}
          >
            <Ionicons
              name={loading ? "hourglass-outline" : "document-text-outline"}
              size={24}
              color={
                (isGenerateButtonDisabled() || loading) ? Colors.gray[500] : Colors.white
              }
            />
            <Text
              style={[
                styles.generateButtonText,
                (isGenerateButtonDisabled() || loading) && styles.generateButtonTextDisabled,
              ]}
            >
              {loading ? "Gerando..." : "Gerar Relatório"}
            </Text>
          </Pressable>
      </View>
      </ScrollView>

      {/* Modal para Data Inicial */}
      <Modal
        visible={showStartDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleStartDatePickerClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Data Inicial</Text>
              <Pressable
                onPress={handleStartDatePickerClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </Pressable>
            </View>

            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                ...selectedDates,
                ...startDateMarkedDates,
              }}
              minDate={dateLimit}
              maxDate={endDate ? moment(endDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
              theme={{
                backgroundColor: Colors.white,
                calendarBackground: Colors.white,
                textSectionTitleColor: Colors.text.primary,
                selectedDayBackgroundColor: Colors.blue.primary,
                selectedDayTextColor: Colors.white,
                todayTextColor: Colors.blue.primary,
                dayTextColor: Colors.text.primary,
                textDisabledColor: Colors.text.tertiary,
                dotColor: Colors.blue.primary,
                selectedDotColor: Colors.white,
                arrowColor: Colors.blue.primary,
                disabledArrowColor: Colors.text.tertiary,
                monthTextColor: Colors.text.primary,
                indicatorColor: Colors.blue.primary,
                textDayFontFamily: "Poppins_400Regular",
                textMonthFontFamily: "Poppins_600SemiBold",
                textDayHeaderFontFamily: "Poppins_500Medium",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              firstDay={1}
              enableSwipeMonths={true}
            />

            <View style={styles.rangeInfo}>
              <Text style={styles.rangeInfoText}>
                {!tempDate
                  ? "Toque em uma data para definir o início"
                  : `Data selecionada: ${moment(tempDate).format("DD/MM/YYYY")}`}
              </Text>
            </View>

            {/* Botões de ação */}
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={handleStartDatePickerClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={handleStartDateConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Data Final */}
      <Modal
        visible={showEndDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleEndDatePickerClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Data Final</Text>
              <Pressable
                onPress={handleEndDatePickerClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </Pressable>
            </View>
            
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                ...selectedDates,
                ...endDateMarkedDates,
              }}
              minDate={startDate ? moment(startDate).format('YYYY-MM-DD') : undefined}
              maxDate={moment().format('YYYY-MM-DD')}
              theme={{
                backgroundColor: Colors.white,
                calendarBackground: Colors.white,
                textSectionTitleColor: Colors.text.primary,
                selectedDayBackgroundColor: Colors.blue.primary,
                selectedDayTextColor: Colors.white,
                todayTextColor: Colors.blue.primary,
                dayTextColor: Colors.text.primary,
                textDisabledColor: Colors.text.tertiary,
                dotColor: Colors.blue.primary,
                selectedDotColor: Colors.white,
                arrowColor: Colors.blue.primary,
                disabledArrowColor: Colors.text.tertiary,
                monthTextColor: Colors.text.primary,
                indicatorColor: Colors.blue.primary,
                textDayFontFamily: "Poppins_400Regular",
                textMonthFontFamily: "Poppins_600SemiBold",
                textDayHeaderFontFamily: "Poppins_500Medium",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              firstDay={1}
              enableSwipeMonths={true}
            />
            
              <View style={styles.rangeInfo}>
                <Text style={styles.rangeInfoText}>
                {!tempDate
                  ? "Toque em uma data para definir o fim"
                  : `Data selecionada: ${moment(tempDate).format("DD/MM/YYYY")}`}
                </Text>
              </View>

            {/* Botões de ação */}
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={handleEndDatePickerClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={handleEndDateConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* PDF Viewer */}
      <PDFViewer
        base64={pdfData || ""}
        visible={showPdfViewer && !isPdfLoading}
        onClose={handlePdfClose}
        filename={pdfFilename}
        onSuccess={handlePdfSuccess}
        onError={handlePdfError}
      />
    </View>
  );
}
