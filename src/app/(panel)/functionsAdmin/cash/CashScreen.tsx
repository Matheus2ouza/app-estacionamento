import CashAvailabilityAlert from '@/src/components/CashAvailabilityAlert';
import Header from '@/src/components/Header';
import Colors, { generateRandomColor } from '@/src/constants/Colors';
import { useCashContext } from '@/src/context/CashContext';
import { useCash } from '@/src/hooks/cash/useCash';
import { styles } from '@/src/styles/functions/cash/cashStyles';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function CashIndex() {
  const {
    cashStatus,
    cashData,
    isCashOpen,
    isCashClosed,
    isCashNotCreated,
    refreshAllData,
  } = useCashContext();

  // Hook useCash - fonte principal de dados
  const cashHook = useCash();

  const [refreshing, setRefreshing] = useState(false);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(true);
  
  // Refs estáveis para evitar loops e dependências mutáveis no useFocusEffect
  const refreshAllDataRef = useRef(refreshAllData);
  refreshAllDataRef.current = refreshAllData;
  const cashDataRef = useRef(cashData);
  cashDataRef.current = cashData;
  const cashStatusRef = useRef(cashStatus);
  cashStatusRef.current = cashStatus;
  
  // Cores das bordas para cada card
  const [cardBorderColors] = useState({
    vehicles: generateRandomColor(),
    products: generateRandomColor(),
    expenses: generateRandomColor(),
  });
  
  // Animações para cada card
  const [animations] = useState({
    vehicles: new Animated.Value(0),
    products: new Animated.Value(0),
    expenses: new Animated.Value(0),
  });

  // Função para formatar data/hora
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para obter status do caixa
  const getCashStatusInfo = () => {
    if (isCashOpen()) {
      return {
        text: 'ABERTO',
        style: styles.statusOpen,
        textStyle: styles.statusTextOpen,
        icon: 'check-circle',
      };
    } else if (isCashClosed()) {
      return {
        text: 'FECHADO',
        style: styles.statusClosed,
        textStyle: styles.statusTextClosed,
        icon: 'lock',
      };
    } else {
      return {
        text: 'NÃO CRIADO',
        style: styles.statusNotCreated,
        textStyle: styles.statusTextNotCreated,
        icon: 'error',
      };
    }
  };

  // Buscar dados quando a tela recebe foco: contexto + detalhes reais (sem exigir pull-to-refresh)
  useFocusEffect(
    useCallback(() => {
      console.log('🔍 [CashScreen] useFocusEffect: Tela em foco, atualizando dados...');
      let cancelled = false;
      (async () => {
        // Atualiza status/dados do contexto
        await refreshAllDataRef.current();
        if (cancelled) return;

        // Após atualizar o contexto, buscar detalhes reais se houver caixa válido
        const status = cashStatusRef.current;
        const ctxCash = cashDataRef.current;
        if ((status === 'open' || status === 'closed') && ctxCash?.id) {
          try {
            await cashHook.fetchGeneralDetailsCash(ctxCash.id);
          } catch (err) {
            console.log('❌ [CashScreen] useFocusEffect: Erro ao buscar detalhes reais:', err);
          }
        }
      })();
      return () => {
        cancelled = true;
        console.log('🔍 [CashScreen] useFocusEffect: Cleanup - tela perdeu foco');
      };
    }, [])
  );

  // Função para refresh
  const onRefresh = async () => {
    console.log('🔄 [CashScreen] onRefresh: Iniciando refresh manual');
    setRefreshing(true);
    
    try {
      console.log('🔄 [CashScreen] onRefresh: Status atual do contexto:', cashStatus);
      console.log('🔄 [CashScreen] onRefresh: CashData do contexto:', cashData ? 'Presente' : 'Ausente');
      
      if ((cashStatus === 'open' || cashStatus === 'closed') && cashData?.id) {
        console.log('🔄 [CashScreen] onRefresh: Status válido, chamando hook useCash...');
        console.log('🔄 [CashScreen] onRefresh: CashId:', cashData.id);
        
        const generalDetails = await cashHook.fetchGeneralDetailsCash(cashData.id);
        
        if (generalDetails) {
          console.log('✅ [CashScreen] onRefresh: Detalhes gerais obtidos com sucesso');
        } else {
          console.log('❌ [CashScreen] onRefresh: Falha ao obter detalhes gerais');
        }
      } else {
        console.log('🔄 [CashScreen] onRefresh: Status não válido, pulando busca de detalhes');
        console.log('🔄 [CashScreen] onRefresh: Status:', cashStatus, 'CashId:', cashData?.id);
      }
    } catch (error) {
      console.error('❌ [CashScreen] onRefresh: Erro ao atualizar dados:', error);
    } finally {
      setRefreshing(false);
      console.log('🔄 [CashScreen] onRefresh: Refresh finalizado');
    }
  };

  // Função para tentar novamente
  const handleRetry = async () => {
    console.log('🔄 [CashScreen] handleRetry: Iniciando retry');
    
    try {
      console.log('🔄 [CashScreen] handleRetry: Status atual do contexto:', cashStatus);
      console.log('🔄 [CashScreen] handleRetry: CashData do contexto:', cashData ? 'Presente' : 'Ausente');
      
      if ((cashStatus === 'open' || cashStatus === 'closed') && cashData?.id) {
        console.log('🔄 [CashScreen] handleRetry: Status válido, chamando hook useCash...');
        console.log('🔄 [CashScreen] handleRetry: CashId:', cashData.id);
        
        const generalDetails = await cashHook.fetchGeneralDetailsCash(cashData.id);
        
        if (generalDetails) {
          console.log('✅ [CashScreen] handleRetry: Detalhes gerais obtidos com sucesso');
        } else {
          console.log('❌ [CashScreen] handleRetry: Falha ao obter detalhes gerais');
        }
      } else {
        console.log('🔄 [CashScreen] handleRetry: Status não válido, pulando busca de detalhes');
        console.log('🔄 [CashScreen] handleRetry: Status:', cashStatus, 'CashId:', cashData?.id);
      }
    } catch (error) {
      console.error('❌ [CashScreen] handleRetry: Erro ao tentar novamente:', error);
    }
  };

  // Função para alternar expansão do card com animação
  const toggleCardExpansion = (cardType: string) => {
    const isExpanding = !expandedCards.includes(cardType);
    const animationValue = animations[cardType as keyof typeof animations];
    
    // Animação suave
    Animated.timing(animationValue, {
      toValue: isExpanding ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setExpandedCards(prev => {
      if (prev.includes(cardType)) {
        // Remove o card se já estiver expandido
        return prev.filter(card => card !== cardType);
      } else {
        // Adiciona o card se não estiver expandido
        return [...prev, cardType];
      }
    });
  };

  // Log do status atual do caixa
  console.log('🔍 [CashScreen] Render: Status atual do caixa:', cashStatus);
  console.log('🔍 [CashScreen] Render: CashData (contexto):', cashData ? 'Presente' : 'Ausente');
  console.log('🔍 [CashScreen] Render: CashHook loading:', cashHook.loading);
  console.log('🔍 [CashScreen] Render: CashHook error:', cashHook.error);
  console.log('🔍 [CashScreen] Render: CashHook success:', cashHook.success);

  // Bloqueio/aviso conforme status do caixa
  if (isCashNotCreated()) {
    return (
      <View style={styles.container}>
        <Header title="Caixa" />
        <CashAvailabilityAlert
          mode="blocking"
          cashStatus={cashStatus}
          style={{ alignSelf: 'center', width: '92%' }}
        />
      </View>
    );
  }

  // Não retornar antecipadamente quando estiver FECHADO; mostraremos um modal sobreposto

  if (cashHook.loading && !cashData) {
    console.log('🔍 [CashScreen] Render: Mostrando tela de loading');
    return (
      <View style={styles.container}>
        <Header title="Caixa" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.blue.logo} />
          <Text style={styles.loadingText}>Carregando dados do caixa...</Text>
        </View>
      </View>
    );
  }

  if (cashHook.error && !cashData) {
    console.log('🔍 [CashScreen] Render: Mostrando tela de erro:', cashHook.error);
    return (
      <View style={styles.container}>
        <Header title="Caixa" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{cashHook.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusInfo = getCashStatusInfo();
  console.log('🔍 [CashScreen] Render: StatusInfo:', statusInfo);

  // Usar apenas dados reais do hook
  const displayCashDetails = cashHook.data ? {
    initialValue: cashHook.data.generalDetails.initialValue,
    totalCash: cashHook.data.vehicleDetails.amountCash + cashHook.data.productDetails.amountSoldInCash + cashHook.data.outgoingExpenseDetails.outputCash,
    totalCredit: cashHook.data.vehicleDetails.amountCredit + cashHook.data.productDetails.amountSoldInCredit + cashHook.data.outgoingExpenseDetails.outputCredit,
    totalDebit: cashHook.data.vehicleDetails.amountDebit + cashHook.data.productDetails.amountSoldInDebit + cashHook.data.outgoingExpenseDetails.outputDebit,
    totalPix: cashHook.data.vehicleDetails.amountPix + cashHook.data.productDetails.amountSoldInPix + cashHook.data.outgoingExpenseDetails.outputPix,
    outgoingExpenseTotal: cashHook.data.outgoingExpenseDetails.amountTotal,
    finalValue: cashHook.data.generalDetails.finalValue,
  } : {
    initialValue: 0,
    totalCash: 0,
    totalCredit: 0,
    totalDebit: 0,
    totalPix: 0,
    outgoingExpenseTotal: 0,
    finalValue: 0,
  };
  
  const displayCashData = cashData; // Dados básicos do caixa vêm do contexto
  
  console.log('🔍 [CashScreen] Render: Usando dados reais:', cashHook.data ? 'Sim' : 'Não');
  console.log('🔍 [CashScreen] Render: CashData (contexto) real:', cashData ? 'Sim' : 'Não');

  return (
    <View style={styles.container}>
      <Image
        source={require("@/src/assets/images/splash-icon-blue.png")}
        style={styles.heroImage}
      />
      <Header title="Caixa" />

      {/* Modal de aviso quando o caixa está FECHADO */}
      <Modal visible={showWarning && isCashClosed()} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 16 }}>
          <CashAvailabilityAlert
            mode="warning"
            cashStatus={cashStatus}
            style={{ alignSelf: 'center', width: '92%' }}
            onClosePress={() => setShowWarning(false)}
          />
        </View>
      </Modal>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Card principal com informações do caixa */}
        <View style={styles.mainInfoCard}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainInfoTitle}>Informações do Caixa</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor Inicial:</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(displayCashDetails.initialValue)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hora de Abertura:</Text>
            <Text style={styles.infoValue}>
              {displayCashData?.opening_date ? formatDateTime(displayCashData.opening_date) : 'N/A'}
            </Text>
          </View>

          {isCashClosed() && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hora de Fechamento:</Text>
              <Text style={styles.infoValue}>
                {displayCashData?.closing_date ? formatDateTime(displayCashData.closing_date) : 'N/A'}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor Total:</Text>
            <Text style={[styles.infoValue, { color: Colors.icon.success, fontSize: 16 }]}>
              {formatCurrency(displayCashDetails.finalValue)}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, statusInfo.style]}>
              <MaterialIcons 
                name={statusInfo.icon as any} 
                size={22} 
                color={statusInfo.textStyle.color} 
              />
              <Text style={[styles.statusText, statusInfo.textStyle]}>
                {statusInfo.text}
              </Text>
            </View>
          </View>
        </View>

        {/* Minicards para veículos, produtos e despesas */}
        <View style={styles.miniCardsContainer}>
          {/* Card de Veículos */}
          <Animated.View style={[
            styles.miniCard, 
            styles.vehiclesCard,
            expandedCards.includes('vehicles') && styles.expandedCard,
            {
              borderLeftColor: cardBorderColors.vehicles,
              transform: [{
                scale: animations.vehicles.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                })
              }],
              opacity: animations.vehicles.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1],
              })
            }
          ]}>
            <View style={styles.miniCardHeader}>
              <Text style={[
                styles.miniCardTitle,
                expandedCards.includes('vehicles') && styles.expandedCardTitle
              ]}>Veículos</Text>
              <TouchableOpacity 
                style={styles.miniExpandButton}
                onPress={() => toggleCardExpansion('vehicles')}
              >
                <Entypo 
                  name={expandedCards.includes('vehicles') ? "resize-100" : "resize-full-screen"} 
                  size={expandedCards.includes('vehicles') ? 24 : 18} 
                  color={Colors.text.primary} 
                />
              </TouchableOpacity>
            </View>
            <Text style={[
              styles.miniCardValue,
              expandedCards.includes('vehicles') && styles.expandedCardValue
            ]}>
              {formatCurrency(cashHook.data?.vehicleDetails.amountTotal || 0)}
            </Text>
            {!expandedCards.includes('vehicles') && (
              <Text style={styles.miniCardQuantity}>
                {cashHook.data?.vehicleDetails.exitVehicle || 0} veículos
              </Text>
            )}
            
            {expandedCards.includes('vehicles') && (
              <Animated.View style={[
                styles.expandedDetails,
                {
                  opacity: animations.vehicles,
                  transform: [{
                    translateY: animations.vehicles.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    })
                  }]
                }
              ]}>
                <Text style={styles.detailTitle}>Detalhes dos Veículos</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Veículos que Saíram</Text>
                  <Text style={styles.detailValue}>{cashHook.data?.vehicleDetails.exitVehicle || 0}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Veículos no Pátio</Text>
                  <Text style={styles.detailValue}>{cashHook.data?.vehicleDetails.inVehicle || 0}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Entrada em Dinheiro</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.vehicleDetails.amountCash || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Entrada em PIX</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.vehicleDetails.amountPix || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Entrada em Crédito</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.vehicleDetails.amountCredit || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Entrada em Débito</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.vehicleDetails.amountDebit || 0)}</Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* Card de Produtos */}
          <Animated.View style={[
            styles.miniCard, 
            styles.productsCard,
            expandedCards.includes('products') && styles.expandedCard,
            {
              borderLeftColor: cardBorderColors.products,
              transform: [{
                scale: animations.products.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                })
              }],
              opacity: animations.products.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1],
              })
            }
          ]}>
            <View style={styles.miniCardHeader}>
              <Text style={[
                styles.miniCardTitle,
                expandedCards.includes('products') && styles.expandedCardTitle
              ]}>Produtos</Text>
              <TouchableOpacity 
                style={styles.miniExpandButton}
                onPress={() => toggleCardExpansion('products')}
              >
                <Entypo 
                  name={expandedCards.includes('products') ? "resize-100" : "resize-full-screen"} 
                  size={expandedCards.includes('products') ? 24 : 18} 
                  color={Colors.text.primary} 
                />
              </TouchableOpacity>
            </View>
            <Text style={[
              styles.miniCardValue,
              expandedCards.includes('products') && styles.expandedCardValue
            ]}>
              {formatCurrency(cashHook.data?.productDetails.amountTotal || 0)}
            </Text>
            {!expandedCards.includes('products') && (
              <Text style={styles.miniCardQuantity}>
                {cashHook.data?.productDetails.amountSold || 0} produtos
              </Text>
            )}
            
            {expandedCards.includes('products') && (
              <Animated.View style={[
                styles.expandedDetails,
                {
                  opacity: animations.products,
                  transform: [{
                    translateY: animations.products.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    })
                  }]
                }
              ]}>
                <Text style={styles.detailTitle}>Detalhes dos Produtos</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantidade Vendida</Text>
                  <Text style={styles.detailValue}>{cashHook.data?.productDetails.amountSold || 0} itens</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Produto Mais Vendido</Text>
                  <Text style={styles.detailValue}>{cashHook.data?.productDetails.productMostSold || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Entrada em Dinheiro</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.productDetails.amountSoldInCash || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Entrada em PIX</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.productDetails.amountSoldInPix || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Entrada em Débito</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.productDetails.amountSoldInDebit || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Entrada em Crédito</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.productDetails.amountSoldInCredit || 0)}</Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* Card de Despesas */}
          <Animated.View style={[
            styles.miniCard, 
            styles.expensesCard,
            expandedCards.includes('expenses') && styles.expandedCard,
            {
              borderLeftColor: cardBorderColors.expenses,
              transform: [{
                scale: animations.expenses.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                })
              }],
              opacity: animations.expenses.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1],
              })
            }
          ]}>
            <View style={styles.miniCardHeader}>
              <Text style={[
                styles.miniCardTitle,
                expandedCards.includes('expenses') && styles.expandedCardTitle
              ]}>Despesas</Text>
              <TouchableOpacity 
                style={styles.miniExpandButton}
                onPress={() => toggleCardExpansion('expenses')}
              >
                <Entypo 
                  name={expandedCards.includes('expenses') ? "resize-100" : "resize-full-screen"} 
                  size={expandedCards.includes('expenses') ? 24 : 18} 
                  color={Colors.text.primary} 
                />
              </TouchableOpacity>
            </View>
            <Text style={[
              styles.miniCardValue,
              expandedCards.includes('expenses') && styles.expandedCardValue
            ]}>
              {formatCurrency(cashHook.data?.outgoingExpenseDetails.amountTotal || 0)}
            </Text>
            {!expandedCards.includes('expenses') && (
              <Text style={styles.miniCardQuantity}>
                {cashHook.data?.outgoingExpenseDetails.outputQuantity || 0} saídas
              </Text>
            )}
            
            {expandedCards.includes('expenses') && (
              <Animated.View style={[
                styles.expandedDetails,
                {
                  opacity: animations.expenses,
                  transform: [{
                    translateY: animations.expenses.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    })
                  }]
                }
              ]}>
                <Text style={styles.detailTitle}>Detalhes das Despesas</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantidade de Saídas</Text>
                  <Text style={styles.detailValue}>{cashHook.data?.outgoingExpenseDetails.outputQuantity || 0}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Maior Saída</Text>
                  <Text style={styles.detailValue}>{cashHook.data?.outgoingExpenseDetails.outputMostSold || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRowFull}>
                  <Text style={styles.detailLabel}>Última Saída</Text>
                  <Text style={styles.detailValue}>{cashHook.data?.outgoingExpenseDetails.outputLast || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Valor da Última Saída</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.outgoingExpenseDetails.outputLastAmount || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Saída em Crédito</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.outgoingExpenseDetails.outputCredit || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Saída em Débito</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.outgoingExpenseDetails.outputDebit || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Saída em PIX</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.outgoingExpenseDetails.outputPix || 0)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Saída em Dinheiro</Text>
                  <Text style={styles.detailValue}>{formatCurrency(cashHook.data?.outgoingExpenseDetails.outputCash || 0)}</Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}