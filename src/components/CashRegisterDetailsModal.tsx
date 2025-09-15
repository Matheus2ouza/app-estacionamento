import Colors from '@/src/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TypographyThemes } from '../constants/Fonts';
import { CashRegister } from '../types/dashboard/dashboard';

interface CashRegisterDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  cashRegister: CashRegister;
  index: number;
}

export default function CashRegisterDetailsModal({
  visible,
  onClose,
  cashRegister,
  index,
}: CashRegisterDetailsModalProps) {
  if (!cashRegister) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detalhes do Caixa #{index + 1}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Informações Básicas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Operador:</Text>
              <Text style={styles.infoValue}>{cashRegister.operator}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: cashRegister.status === 'open' ? Colors.green[100] : Colors.red[100] }
                ]}>
                  <FontAwesome
                    name={cashRegister.status === 'open' ? 'check-circle' : 'times-circle'}
                    size={14}
                    color={cashRegister.status === 'open' ? Colors.green[600] : Colors.red[600]}
                  />
                  <Text style={[
                    styles.statusText,
                    { color: cashRegister.status === 'open' ? Colors.green[600] : Colors.red[600] }
                  ]}>
                    {cashRegister.status === 'open' ? 'Aberto' : 'Fechado'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>{cashRegister.id}</Text>
            </View>
          </View>

          {/* Informações de Período */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Período de Funcionamento</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data/Hora de Abertura:</Text>
              <Text style={styles.infoValue}>{formatDate(cashRegister.openingDate)}</Text>
            </View>

            {cashRegister.closingDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data/Hora de Fechamento:</Text>
                <Text style={styles.infoValue}>{formatDate(cashRegister.closingDate)}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tempo de Funcionamento:</Text>
              <Text style={[styles.infoValue, styles.timeValue]}>
                {cashRegister.openTime.formatted}
              </Text>
            </View>
          </View>

          {/* Valores Financeiros */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Valores Financeiros</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor Inicial:</Text>
              <Text style={[styles.infoValue, styles.currencyValue]}>
                {formatCurrency(cashRegister.initialValue)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor Final:</Text>
              <Text style={[styles.infoValue, styles.currencyValue]}>
                {formatCurrency(cashRegister.finalValue)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vendas Gerais:</Text>
              <Text style={[styles.infoValue, styles.currencyValue, styles.positiveValue]}>
                {formatCurrency(cashRegister.generalSaleTotal)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Entradas de Veículos:</Text>
              <Text style={[styles.infoValue, styles.currencyValue, styles.positiveValue]}>
                {formatCurrency(cashRegister.vehicleEntryTotal)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Despesas:</Text>
              <Text style={[styles.infoValue, styles.currencyValue, styles.negativeValue]}>
                {formatCurrency(cashRegister.outgoingExpenseTotal)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Lucro:</Text>
              <Text style={[styles.infoValue, styles.currencyValue, styles.positiveValue]}>
                {formatCurrency(cashRegister.finalValue - cashRegister.initialValue)}
              </Text>
            </View>
          </View>

          {/* Resumo de Transações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo de Transações</Text>
            
            <View style={styles.transactionSummary}>
              <View style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="car-outline" size={20} color={Colors.blue.primary} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionLabel}>Veículos</Text>
                  <Text style={styles.transactionValue}>
                    {typeof cashRegister.transactions.vehicle === 'number' 
                      ? cashRegister.transactions.vehicle 
                      : cashRegister.transactions.vehicle.length
                    }
                  </Text>
                </View>
              </View>

              <View style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="bag-outline" size={20} color={Colors.green[500]} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionLabel}>Produtos</Text>
                  <Text style={styles.transactionValue}>
                    {typeof cashRegister.transactions.product === 'number' 
                      ? cashRegister.transactions.product 
                      : cashRegister.transactions.product.length
                    }
                  </Text>
                </View>
              </View>

              <View style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="receipt-outline" size={20} color={Colors.orange[500]} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionLabel}>Despesas</Text>
                  <Text style={styles.transactionValue}>
                    {typeof cashRegister.transactions.outgoing === 'number' 
                      ? cashRegister.transactions.outgoing 
                      : cashRegister.transactions.outgoing.length
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Transações Detalhadas de Veículos */}
          {typeof cashRegister.transactions.vehicle === 'object' && 
           Array.isArray(cashRegister.transactions.vehicle) && 
           cashRegister.transactions.vehicle.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transações de Veículos</Text>
              {cashRegister.transactions.vehicle.map((transaction, txIndex) => (
                <View key={transaction.id} style={styles.detailedTransaction}>
                  <View style={styles.transactionHeader}>
                    <Text style={styles.transactionId}>#{txIndex + 1}</Text>
                    <Text style={styles.transactionDate}>{formatDate(transaction.transactionDate)}</Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Placa:</Text>
                      <Text style={styles.transactionDetailValue}>{transaction.vehicle.plate}</Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Categoria:</Text>
                      <Text style={styles.transactionDetailValue}>{transaction.vehicle.category}</Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Valor Original:</Text>
                      <Text style={styles.transactionDetailValue}>
                        {formatCurrency(transaction.originalAmount)}
                      </Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Desconto:</Text>
                      <Text style={styles.transactionDetailValue}>
                        {formatCurrency(transaction.discountAmount)}
                      </Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Valor Final:</Text>
                      <Text style={[styles.transactionDetailValue, styles.currencyValue, styles.positiveValue]}>
                        {formatCurrency(transaction.finalAmount)}
                      </Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Método:</Text>
                      <Text style={styles.transactionDetailValue}>{transaction.method}</Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Valor Recebido:</Text>
                      <Text style={styles.transactionDetailValue}>
                        {formatCurrency(transaction.amountReceived)}
                      </Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Troco:</Text>
                      <Text style={styles.transactionDetailValue}>
                        {formatCurrency(transaction.changeGiven)}
                      </Text>
                    </View>
                    {transaction.vehicle.entryTime && (
                      <View style={styles.transactionDetailRow}>
                        <Text style={styles.transactionDetailLabel}>Hora de Entrada:</Text>
                        <Text style={styles.transactionDetailValue}>
                          {formatDate(transaction.vehicle.entryTime)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Transações Detalhadas de Produtos */}
          {typeof cashRegister.transactions.product === 'object' && 
           Array.isArray(cashRegister.transactions.product) && 
           cashRegister.transactions.product.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transações de Produtos</Text>
              {cashRegister.transactions.product.map((transaction, txIndex) => (
                <View key={transaction.id} style={styles.detailedTransaction}>
                  <View style={styles.transactionHeader}>
                    <Text style={styles.transactionId}>#{txIndex + 1}</Text>
                    <Text style={styles.transactionDate}>{formatDate(transaction.transactionDate)}</Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Valor Original:</Text>
                      <Text style={styles.transactionDetailValue}>
                        {formatCurrency(transaction.originalAmount)}
                      </Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Desconto:</Text>
                      <Text style={styles.transactionDetailValue}>
                        {formatCurrency(transaction.discountAmount)}
                      </Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Valor Final:</Text>
                      <Text style={[styles.transactionDetailValue, styles.currencyValue, styles.positiveValue]}>
                        {formatCurrency(transaction.finalAmount)}
                      </Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Método:</Text>
                      <Text style={styles.transactionDetailValue}>{transaction.method}</Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Valor Recebido:</Text>
                      <Text style={styles.transactionDetailValue}>
                        {formatCurrency(transaction.amountReceived)}
                      </Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Troco:</Text>
                      <Text style={styles.transactionDetailValue}>
                        {formatCurrency(transaction.changeGiven)}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Itens da Venda */}
                  {transaction.items && transaction.items.length > 0 && (
                    <View style={styles.itemsSection}>
                      <Text style={styles.itemsTitle}>Itens Vendidos:</Text>
                      {transaction.items.map((item, itemIndex) => (
                        <View key={itemIndex} style={styles.itemRow}>
                          <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.productName}</Text>
                            <Text style={styles.itemQuantity}>Qtd: {item.soldQuantity}</Text>
                          </View>
                          <Text style={styles.itemPrice}>
                            {formatCurrency(item.unitPrice * item.soldQuantity)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Transações Detalhadas de Despesas */}
          {typeof cashRegister.transactions.outgoing === 'object' && 
           Array.isArray(cashRegister.transactions.outgoing) && 
           cashRegister.transactions.outgoing.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Despesas</Text>
              {cashRegister.transactions.outgoing.map((expense, txIndex) => (
                <View key={expense.id} style={styles.detailedTransaction}>
                  <View style={styles.transactionHeader}>
                    <Text style={styles.transactionId}>#{txIndex + 1}</Text>
                    <Text style={styles.transactionDate}>{formatDate(expense.transactionDate)}</Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Descrição:</Text>
                      <Text style={styles.transactionDetailValue}>{expense.description}</Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Valor:</Text>
                      <Text style={[styles.transactionDetailValue, styles.currencyValue, styles.negativeValue]}>
                        {formatCurrency(expense.amount)}
                      </Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Método:</Text>
                      <Text style={styles.transactionDetailValue}>{expense.method}</Text>
                    </View>
                    <View style={styles.transactionDetailRow}>
                      <Text style={styles.transactionDetailLabel}>Operador:</Text>
                      <Text style={styles.transactionDetailValue}>{expense.operator}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  headerTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeButton: {
    backgroundColor: Colors.red[500],
    width: 32,
    height: 32,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    paddingLeft: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  infoLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    marginRight: 12,
  },
  infoValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  currencyValue: {
    fontWeight: '600',
  },
  positiveValue: {
    color: Colors.green[600],
  },
  negativeValue: {
    color: Colors.red[600],
  },
  timeValue: {
    color: Colors.blue[600],
    fontWeight: '600',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    fontWeight: '600',
  },
  transactionSummary: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  transactionValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  detailedTransaction: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  transactionId: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.blue.primary,
    backgroundColor: Colors.blue[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transactionDate: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  transactionDetails: {
    gap: 6,
  },
  transactionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDetailLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 13,
    color: Colors.text.secondary,
    flex: 1,
  },
  transactionDetailValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 13,
    color: Colors.text.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  itemsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  itemsTitle: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...TypographyThemes.nunito.body,
    fontSize: 13,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  itemQuantity: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  itemPrice: {
    ...TypographyThemes.nunito.body,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.green[600],
  },
});
