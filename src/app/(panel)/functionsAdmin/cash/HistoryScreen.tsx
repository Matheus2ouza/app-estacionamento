import FeedbackModal from '@/src/components/FeedbackModal';
import Header from '@/src/components/Header';
import TransactionDetailsModal from '@/src/components/TransactionDetailsModal';
import Colors, { generateRandomColor } from '@/src/constants/Colors';
import { useCashContext } from '@/src/context/CashContext';
import { useCashHistory } from '@/src/hooks/cash/useCashHistory';
import { styles } from '@/src/styles/functions/cash/historyStyles';
import { OutgoingExpenseHistory, ProductTransactionHistory, VehicleTransactionHistory } from '@/src/types/cashTypes/cash';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryScreen() {
  const { cashData } = useCashContext();
  const { loading, error, data, fetchCashHistory, deleteTransaction, success, message } = useCashHistory();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  // Estados para feedback
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  
  // Ref para controlar se já processamos o sucesso da exclusão
  const hasProcessedSuccess = useRef(false);

  // Carregar histórico quando a tela entrar em foco
  useFocusEffect(
    useCallback(() => {
      if (cashData?.id) {
        fetchCashHistory(cashData.id);
      }
    }, [cashData?.id, fetchCashHistory])
  );

  // Monitorar sucesso/erro da exclusão
  React.useEffect(() => {
    if (success && message && !hasProcessedSuccess.current) {
      hasProcessedSuccess.current = true;
      setModalMessage(message);
      setModalIsSuccess(true);
      setModalVisible(true);
      // Recarregar o histórico automaticamente apenas uma vez
      if (cashData?.id) {
        fetchCashHistory(cashData.id);
      }
    }
    
    if (error) {
      setModalMessage(error);
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  }, [success, error, message, cashData?.id, fetchCashHistory]);

  // Reset do ref quando success muda para false
  React.useEffect(() => {
    if (!success) {
      hasProcessedSuccess.current = false;
    }
  }, [success]);

  // Processar dados das transações
  const allTransactions = useMemo(() => {
    if (!data) return [];
    
    return [
      ...data.vehicleTransaction.map((t, i) => ({ type: 'vehicle', data: t, index: i })),
      ...data.productTransaction.map((t, i) => ({ type: 'product', data: t, index: i })),
      ...data.outgoingExpense.map((t, i) => ({ type: 'expense', data: t, index: i })),
    ].sort((a, b) => {
      // Ordenar por data (mais recente primeiro)
      const getDate = (transaction: any) => {
        if (transaction.type === 'vehicle') {
          // Corrigir para lidar com vehicleEntries como objeto ou array
          let vehicle;
          if (Array.isArray(transaction.data.vehicleEntries)) {
            vehicle = transaction.data.vehicleEntries[0];
          } else {
            vehicle = transaction.data.vehicleEntries;
          }
          return new Date(vehicle?.entryTime || 0);
        } else if (transaction.type === 'product') {
          return new Date(); // Produtos não têm data específica na estrutura fornecida
        } else if (transaction.type === 'expense') {
          return new Date(transaction.data.transactionDate);
        }
        return new Date(0);
      };
      
      return getDate(b).getTime() - getDate(a).getTime();
    });
  }, [data]);

  // Gera cores aleatórias para cada transação usando useMemo
  const transactionColors = useMemo(() => {
    const colors: {[key: string]: string} = {};
    allTransactions.forEach((transaction, index) => {
      const key = `${transaction.type}-${index}`;
      colors[key] = generateRandomColor();
    });
    return colors;
  }, [allTransactions]);

  const getTransactionBorderColor = useCallback((type: string, index: number) => {
    const key = `${type}-${index}`;
    return transactionColors[key] || Colors.blue.primary;
  }, [transactionColors]);

  const formatCurrency = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) {
      return 'R$ 0,00';
    }
    
    // Converter string para number se necessário
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numericValue)) {
      return 'R$ 0,00';
    }
    
    return `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
  };

  // Função para truncar texto
  const truncateText = (text: string | undefined | null, maxLength: number = 15) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getMethodColor = (method: string | undefined | null) => {
    if (!method) {
      return Colors.gray[500];
    }
    switch (method.toLowerCase()) {
      case 'dinheiro':
      case 'cash':
        return Colors.green[500];
      case 'cartão':
      case 'credit':
        return Colors.blue[500];
      case 'débito':
      case 'debit':
        return Colors.orange[500];
      case 'pix':
        return Colors.purple[500];
      default:
        return Colors.gray[500];
    }
  };

  const handleDeleteTransaction = async (transaction: any) => {
    try {
      console.log('🔍 [HistoryScreen] Excluindo transação:', transaction);
      console.log('🔍 [HistoryScreen] Transaction ID:', transaction.data.id);
      
      if (!cashData?.id) {
        console.error('CashId não encontrado');
        return;
      }

      if (!transaction.data.id) {
        console.error('❌ [HistoryScreen] ID da transação não encontrado');
        return;
      }

      // Determinar o ID da transação e parâmetros
      const transactionId = transaction.data.id;
      let permanent: boolean | undefined;

      if (transaction.type === 'vehicle') {
        // Para veículos, verificar se é exclusão permanente
        permanent = transaction.data.permanent || false;
      }

      console.log('✅ [HistoryScreen] Chamando API com:', {
        cashId: cashData.id,
        transactionId,
        type: transaction.type,
        permanent
      });

      // Chamar a API de exclusão
      await deleteTransaction(cashData.id, transactionId, transaction.type, permanent);
      
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  const renderCounterCard = (number: number, label: string, icon: string) => (
    <View style={styles.counterCard}>
      <MaterialIcons name={icon as any} size={24} color={Colors.blue.primary} />
      <Text style={styles.counterNumber}>{number}</Text>
      <Text style={styles.counterLabel}>{label}</Text>
    </View>
  );

  const renderVehicleTransaction = (transaction: VehicleTransactionHistory, index: number) => {
    // Corrigir vehicleEntries que pode vir como objeto ou array
    let vehicle;
    if (Array.isArray(transaction.vehicleEntries)) {
      vehicle = transaction.vehicleEntries[0];
    } else {
      // Se for objeto, usar diretamente
      vehicle = transaction.vehicleEntries;
    }
    
    const borderColor = getTransactionBorderColor('vehicle', index);
    
    return (
      <View key={`vehicle-${index}`} style={[
        styles.historyCard,
        { borderLeftColor: borderColor }
      ]}>
        <View style={styles.historyCardHeader}>
          <Text style={[styles.historyType, { backgroundColor: Colors.blue[500] }]}>
            VEÍCULO
          </Text>
          <Text style={styles.historyAmount}>{formatCurrency(transaction.finalAmount)}</Text>
        </View>
        
        <View style={styles.historyDetails}>
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>Placa:</Text>
            <Text style={styles.historyDetailValue}>{vehicle?.plate || 'N/A'}</Text>
          </View>
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>Método:</Text>
            <Text style={[styles.historyDetailValue, { color: getMethodColor(transaction.method) }]}>
              {transaction.method ? transaction.method.toUpperCase() : 'N/A'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => {
            setSelectedTransaction({ type: 'vehicle', data: transaction });
            setShowDetailsModal(true);
          }}
        >
          <Text style={styles.viewDetailsButtonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProductTransaction = (transaction: ProductTransactionHistory, index: number) => {
    
    const borderColor = getTransactionBorderColor('product', index);
    const saleItems = transaction.saleItems || [];
    const productCount = saleItems.length;
    const productDisplay = productCount > 1 
      ? `${productCount} produtos` 
      : saleItems[0]?.productName || 'Produto';
    
    return (
      <View key={`product-${index}`} style={[
        styles.historyCard,
        { borderLeftColor: borderColor }
      ]}>
        <View style={styles.historyCardHeader}>
          <Text style={[styles.historyType, { backgroundColor: Colors.green[500] }]}>
            PRODUTO
          </Text>
          <Text style={styles.historyAmount}>{formatCurrency(transaction.finalAmount)}</Text>
        </View>
        
        <View style={styles.historyDetails}>
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>Produto:</Text>
            <Text style={styles.historyDetailValue}>{truncateText(productDisplay)}</Text>
          </View>
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>Método:</Text>
            <Text style={[styles.historyDetailValue, { color: getMethodColor(transaction.method) }]}>
              {transaction.method ? transaction.method.toUpperCase() : 'N/A'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => {
            setSelectedTransaction({ type: 'product', data: transaction });
            setShowDetailsModal(true);
          }}
        >
          <Text style={styles.viewDetailsButtonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderExpenseTransaction = (expense: OutgoingExpenseHistory, index: number) => {
    
    const borderColor = getTransactionBorderColor('expense', index);
    
    return (
      <View key={`expense-${index}`} style={[
        styles.historyCard,
        { borderLeftColor: borderColor }
      ]}>
        <View style={styles.historyCardHeader}>
          <Text style={[styles.historyType, { backgroundColor: Colors.red[500] }]}>
            DESPESA
          </Text>
          <Text style={styles.historyAmount}>{formatCurrency(expense.amount)}</Text>
        </View>
        
        <View style={styles.historyDetails}>
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>Descrição:</Text>
            <Text style={styles.historyDetailValue}>{truncateText(expense.description)}</Text>
          </View>
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>Método:</Text>
            <Text style={[styles.historyDetailValue, { color: getMethodColor(expense.method) }]}>
              {expense.method ? expense.method.toUpperCase() : 'N/A'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => {
            setSelectedTransaction({ type: 'expense', data: expense });
            setShowDetailsModal(true);
          }}
        >
          <Text style={styles.viewDetailsButtonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Histórico do Caixa" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.blue.primary} />
          <Text style={styles.loadingText}>Carregando histórico...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Histórico do Caixa" />
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle" size={48} color={Colors.red[500]} />
          <Text style={styles.emptyStateText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Header title="Histórico do Caixa" />
        <View style={styles.emptyState}>
          <Ionicons name="document-text" size={48} color={Colors.gray[400]} />
          <Text style={styles.emptyStateText}>Nenhum histórico encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Histórico do Caixa" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Contadores */}
        <View style={styles.countersContainer}>
          <Text style={styles.countersTitle}>Resumo das Transações</Text>
          <View style={styles.countersGrid}>
            {renderCounterCard(
              data.counts.vehicleTransactions,
              'Veículos',
              'directions-car'
            )}
            {renderCounterCard(
              data.counts.productTransactions,
              'Produtos',
              'shopping-cart'
            )}
            {renderCounterCard(
              data.counts.expenseTransactions,
              'Despesas',
              'receipt'
            )}
          </View>
        </View>

        {/* Histórico */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico Completo</Text>
          
          {allTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text" size={48} color={Colors.gray[400]} />
              <Text style={styles.emptyStateText}>Nenhuma transação encontrada</Text>
            </View>
          ) : (
            allTransactions.map((transaction) => {
              if (transaction.type === 'vehicle') {
                return renderVehicleTransaction(transaction.data as VehicleTransactionHistory, transaction.index);
              } else if (transaction.type === 'product') {
                return renderProductTransaction(transaction.data as ProductTransactionHistory, transaction.index);
              } else if (transaction.type === 'expense') {
                return renderExpenseTransaction(transaction.data as OutgoingExpenseHistory, transaction.index);
              }
              return null;
            })
          )}
        </View>
      </ScrollView>

      {/* Modal de detalhes */}
      <TransactionDetailsModal
        visible={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        transaction={selectedTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Modal de feedback */}
      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        type={modalIsSuccess ? 'success' : 'error'}
        onClose={() => setModalVisible(false)}
        dismissible={true}
        autoNavigateOnSuccess={false}
        navigateDelay={2000}
      />
    </View>
  );
}