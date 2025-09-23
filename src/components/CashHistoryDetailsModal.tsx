import Colors from '@/constants/Colors';
import { TypographyThemes } from '@/constants/Fonts';
import { ListHistoryCash } from '@/types/cashTypes/cash';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  cash: ListHistoryCash;
};

const formatCurrency = (value: number | string | undefined | null) => {
  if (value === undefined || value === null) return 'R$ 0,00';
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return 'R$ 0,00';
  return `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
};

const formatDateTime = (dateString: string | undefined | null) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data inválida';
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function CashHistoryDetailsModal({ visible, onClose, cash }: Props) {
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <Image source={require('../assets/images/splash-icon-blue.png')} style={styles.backgroundImage} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detalhes do Caixa</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.mainCard}>
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Lucro</Text>
              <Text style={[styles.amountValue, { color: Colors.green[600] }]}>{formatCurrency(cash.profit)}</Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <FontAwesome name="user" size={20} color={Colors.purple[500]} />
              <Text style={styles.detailsTitle}>Operação</Text>
            </View>
            <View style={styles.detailsInfo}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Operador:</Text>
                <Text style={styles.detailValue}>{cash.operator || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={styles.detailValue}>{cash.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <FontAwesome name="clock-o" size={20} color={Colors.blue[500]} />
              <Text style={styles.detailsTitle}>Período</Text>
            </View>
            <View style={styles.detailsInfo}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Abertura:</Text>
                <Text style={styles.detailValue}>{formatDateTime(cash.openingDate)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fechamento:</Text>
                <Text style={styles.detailValue}>{formatDateTime(cash.closingDate)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.valuesCard}>
            <View style={styles.valuesHeader}>
              <FontAwesome name="calculator" size={20} color={Colors.orange[500]} />
              <Text style={styles.valuesTitle}>Totais</Text>
            </View>
            <View style={styles.valuesInfo}>
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Total Geral:</Text>
                <Text style={styles.valueValue}>{formatCurrency(cash.generalSaleTotal)}</Text>
              </View>
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Entradas de Veículos:</Text>
                <Text style={styles.valueValue}>{formatCurrency(cash.vehicleEntryTotal)}</Text>
              </View>
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Despesas:</Text>
                <Text style={styles.valueValue}>{formatCurrency(cash.outgoingExpenseTotal)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    right: -200,
    width: '150%',
    height: '100%',
    transform: [{ scaleX: -1 }],
    resizeMode: 'cover',
    opacity: 0.08,
    zIndex: -1,
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
  mainCard: {
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  amountSection: {
    alignItems: 'center',
  },
  amountLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  amountValue: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 32,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  detailsTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  detailsInfo: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 8,
  },
  detailLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  valuesCard: {
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  valuesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  valuesTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  valuesInfo: {
    gap: 12,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 8,
  },
  valueLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  valueValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
});


