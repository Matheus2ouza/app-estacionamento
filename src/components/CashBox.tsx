import Colors from '@/src/constants/Colors';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Separator from './Separator';

interface CashBoxProps {
  cashStatus: 'not_created' | 'open' | 'closed';
  onRefresh: () => void;
  cashData?: {
    "Valor Inicial": number;
    Dinheiro: number;
    Credito: number;
    Debito: number;
    Pix: number;
    Saída: number;
    Total: number;
  };
}

const CashBox: React.FC<CashBoxProps> = ({ cashStatus, onRefresh, cashData }) => {
  const mockCashData = {
    "Valor Inicial": 0,
    Dinheiro: 0,
    Credito: 0,
    Debito: 0,
    Pix: 0,
    Saída: 0,
    Total: 0,
  };

  const renderCashData = () => {
    if (cashStatus === 'not_created') {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            Nenhum dado{'\n'}Crie um caixa
          </Text>
        </View>
      );
    }

    const dataToShow = cashData || mockCashData;
    
    return (
      <View style={styles.cashContent}>
        {Object.entries(dataToShow).map(([label, value]) => (
          <View key={label} style={styles.cashRow}>
            <Text style={styles.cashLabel}>{label}</Text>
            <View style={styles.dottedLine} />
            <Text style={styles.cashValue}>R$ {value.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.cashBox}>
      <View style={styles.BoxHeader}>
        <Text style={styles.title}>Caixa</Text>
        <Pressable onPress={onRefresh}>
          <View style={styles.refreshIcon}>
            <FontAwesome name="refresh" size={24} color={Colors.text.inverse} />
          </View>
        </Pressable>
      </View>

      <Separator style={{ width: "90%" }} />

      {renderCashData()}
    </View>
  );
};

const styles = StyleSheet.create({
  cashBox: {
    height: "37%",
    width: "80%",
    alignItems: "center",
    backgroundColor: Colors.card.background,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  BoxHeader: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 27,
    color: Colors.gray.zincDark,
  },
  refreshIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blue.logo,
  },
  cashContent: {
    width: "90%",
    marginHorizontal: 6,
    flex: 1,
    justifyContent: "space-around",
  },
  cashRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  cashLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  cashValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  dottedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.border.medium,
    marginHorizontal: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default CashBox;
