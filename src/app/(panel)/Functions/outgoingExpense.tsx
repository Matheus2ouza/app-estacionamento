import { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { Expense } from "@/src/types/cash";
import { useOutgoingExpense } from "@/src/hooks/cash/useOutgoingExpense";
import { styles } from "@/src/styles/functions/outgoingStyle"

export default function OutgoingExpense() {
  const router = useRouter();
  const hasLoadedRef = useRef(false);
  const { getExpenses } = useOutgoingExpense();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cashStatus, setCashStatus] = useState<"OPEN" | "CLOSED">("CLOSED");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [openCashId, setOpenCashId] = useState<string | null>(null); // Adicionando estado para o ID do caixa

  const isFetchingRef = useRef(false);

  const loadExpenses = useCallback(async (isRefresh = false) => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await getExpenses();

      if (result.cashStatus) {
        const status = result.cashStatus.cash?.status === "OPEN" ? "OPEN" : "CLOSED";
        setCashStatus(status);
        // Atualiza o ID do caixa quando disponível
        setOpenCashId(result.cashStatus.cash?.id || null);
      }

      if (result.success) {
        setExpenses(result.data || []);
      } else {
        setError(result.message || "Erro ao carregar despesas");
      }
    } catch (err) {
      setError("Falha ao conectar com o servidor");
    } finally {
      isFetchingRef.current = false;
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [getExpenses]);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedRef.current) {
        loadExpenses();
        hasLoadedRef.current = true;
      }
    }, [loadExpenses])
  );

  const onRefresh = useCallback(() => {
    loadExpenses(true);
  }, [loadExpenses]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [expenses]);

  const handleAddExpense = () => {
    if (!openCashId) {
      setError("Nenhum caixa aberto encontrado");
      return;
    }

    router.push({
      pathname: "/Functions/createOutgoing",
      params: { cashId: openCashId }
    });
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseContent}>
        <Text style={styles.expenseDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.expenseMeta}>
          <Text style={styles.expenseMethod}>{item.method}</Text>
          <Text style={styles.expenseDate}>
            {new Date(item.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
      <View style={styles.expenseAmountWrapper}>
        <Text style={styles.expenseAmount}>R$ {Number(item.amount).toFixed(2)}</Text>
        <Text style={styles.expenseOperator}>{item.operator}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.screenContainer}>
        <Header title="Despesas" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando despesas...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screenContainer}>
        <Header title="Despesas" />
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => loadExpenses()}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (cashStatus !== "OPEN") {
    return (
      <View style={styles.screenContainer}>
        <Header title="Despesas" />
        <View style={styles.centerContainer}>
          <MaterialIcons name="attach-money" size={48} color={Colors.warning} />
          <Text style={styles.emptyTitle}>
            {cashStatus === "CLOSED" ? "Caixa fechado" : "Status desconhecido"}
          </Text>
          <Text style={styles.emptyText}>
            {cashStatus === "CLOSED" 
              ? "Não é possível registrar despesas com o caixa fechado" 
              : "Não foi possível verificar o status do caixa"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <Header title="Despesas" />
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total de Despesas:</Text>
        <Text style={styles.summaryValue}>R$ {totalExpenses.toFixed(2)}</Text>
      </View>

      {expenses.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="receipt" size={48} color={Colors.gray[500]} />
          <Text style={styles.emptyTitle}>Nenhuma despesa registrada</Text>
          <Text style={styles.emptyText}>
            Toque no botão "+" para adicionar uma nova despesa
          </Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleAddExpense}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}