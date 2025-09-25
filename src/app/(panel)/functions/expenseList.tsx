import ExpenseDetailsModal from "@/components/ExpenseDetailsModal";
import FeedbackModal from "@/components/FeedbackModal";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import Colors, { generateRandomColor } from "@/constants/Colors";
import { useCashContext } from "@/context/CashContext";
import { useExpenses } from "@/hooks/expense/useExpenses";
import { styles } from "@/styles/functions/expense/ListExpenseStyles";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";

export default function ExpenseList() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("description");
  const { cashData, cashStatus } = useCashContext();

  // Funções utilitárias locais para verificar status do caixa
  const isCashClosed = (): boolean => cashStatus === "closed";
  const isCashNotCreated = (): boolean => cashStatus === "not_created";

  // Verificar se a tela deve ser bloqueada
  const isButtomBlocked = isCashNotCreated() || isCashClosed();

  // Funções de callback para os botões do alerta
  const handleBackPress = () => {
    router.back();
  };

  const sortOptions = [
    { key: "description", label: "Descrição", icon: "list" },
    { key: "amount", label: "Valor", icon: "cash" },
    { key: "method", label: "Método", icon: "card" },
    { key: "createdAt", label: "Hora", icon: "time" },
  ];

  // Hook para dados dos gastos
  const {
    expenses,
    loading: expensesLoading,
    error: expensesError,
    success: expensesSuccess,
    message: expensesMessage,
    deleteExpense,
    refreshExpenses,
  } = useExpenses(cashData?.id || "");

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Monitorar sucesso/erro da exclusão
  React.useEffect(() => {
    if (expensesSuccess && expensesMessage) {
      setModalMessage(expensesMessage);
      setModalIsSuccess(true);
      setModalVisible(true);
    }

    if (expensesError) {
      setModalMessage(expensesError);
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  }, [expensesSuccess, expensesError, expensesMessage]);

  // Gera cores aleatórias para cada despesa usando useMemo
  const expenseColors = useMemo(() => {
    const colors: { [key: string]: string } = {};
    expenses.forEach((expense) => {
      colors[expense.id] = generateRandomColor();
    });
    return colors;
  }, [expenses]);

  const getExpenseBorderColor = useCallback(
    (expenseId: string) => {
      return expenseColors[expenseId] || Colors.red[500];
    },
    [expenseColors]
  );

  // Função para formatar hora brasileira
  const formatBrazilianTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Hora inválida";
    }
  };

  // Filtra e ordena os gastos
  const filteredExpenses = useMemo(() => {
    const searchTerm = search.toLowerCase();

    let filtered = expenses.filter((expense) => {
      if (!expense) return false;

      switch (sortBy) {
        case "description":
          return (
            expense.description?.toLowerCase().includes(searchTerm) || false
          );
        case "amount":
          return expense.amount?.toString().includes(searchTerm) || false;
        case "method":
          return expense.method?.toLowerCase().includes(searchTerm) || false;
        case "createdAt":
          return expense.transactionDate
            ? formatBrazilianTime(expense.transactionDate).includes(searchTerm)
            : false;
        default:
          return true;
      }
    });

    // Ordena baseado no campo selecionado
    filtered.sort((a, b) => {
      if (!a || !b) return 0;

      switch (sortBy) {
        case "description":
          return (a.description || "")
            .toLowerCase()
            .localeCompare((b.description || "").toLowerCase());
        case "amount":
          return (b.amount || 0) - (a.amount || 0); // Maior valor primeiro
        case "method":
          return (a.method || "")
            .toLowerCase()
            .localeCompare((b.method || "").toLowerCase());
        case "createdAt":
          const dateA = a.transactionDate
            ? new Date(a.transactionDate).getTime()
            : 0;
          const dateB = b.transactionDate
            ? new Date(b.transactionDate).getTime()
            : 0;
          return dateB - dateA; // Mais recente primeiro
        default:
          return 0;
      }
    });

    return filtered;
  }, [expenses, search, sortBy]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshExpenses();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSortChange = (sortKey: string | string[]) => {
    if (typeof sortKey === "string") {
      setSortBy(sortKey);
    }
  };

  // Função para formatar valor monetário brasileiro
  const formatBrazilianCurrency = (value: number) => {
    if (typeof value !== "number" || isNaN(value)) {
      return "R$ 0,00";
    }
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  // Função para truncar descrição
  const truncateDescription = (description: string, maxLength: number = 15) => {
    if (!description) return "Sem descrição";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  // Função para obter ícone do método de pagamento
  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "dinheiro":
        return "money-bill-wave";
      case "pix":
        return "qrcode";
      case "debito":
      case "credito":
        return "credit-card";
      default:
        return "payment";
    }
  };

  // Fechar modal de feedback
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Função para adicionar despesa
  const handleAddExpense = () => {
    router.push("/functions/expenseRecord");
  };

  // Função para mostrar detalhes da despesa
  const handleShowDetails = (expense: any) => {
    setSelectedExpense(expense);
    setDetailsModalVisible(true);
  };

  // Função para fechar modal de detalhes
  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
    setSelectedExpense(null);
  };

  // Função para editar despesa
  const handleEditExpense = (expense: any) => {
    // Fechar modal de detalhes
    setDetailsModalVisible(false);
    setSelectedExpense(null);

    // Navegar para tela de edição com parâmetros
    router.push({
      pathname: "/functions/expenseRecord",
      params: {
        expenseId: expense.id,
        expenseData: JSON.stringify(expense),
      },
    });
  };

  // Função para excluir despesa
  const handleDeleteExpense = async (expense: any) => {
    try {
      console.log("Excluindo despesa:", expense.id);
      await deleteExpense(expense.id);
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
    }
  };

  const renderExpenseItem = ({ item, index }: { item: any; index: number }) => {
    if (!item) return null;

    // Determina o dado principal baseado na opção selecionada
    const getMainData = () => {
      switch (sortBy) {
        case "description":
          return truncateDescription(item.description || "Sem descrição");
        case "amount":
          return formatBrazilianCurrency(item.amount || 0);
        case "method":
          return item.method || "N/A";
        case "createdAt":
          return formatBrazilianTime(item.transactionDate || "");
        default:
          return truncateDescription(item.description || "Sem descrição");
      }
    };

    const getMainDataLabel = () => {
      switch (sortBy) {
        case "description":
          return "Descrição";
        case "amount":
          return "Valor";
        case "method":
          return "Método";
        case "createdAt":
          return "Hora";
        default:
          return "Descrição";
      }
    };

    return (
      <View
        style={[
          styles.listItem,
          {
            borderLeftColor: getExpenseBorderColor(item.id),
          },
        ]}
      >
        <Text style={styles.itemNumber}>{index + 1}</Text>

        <View style={styles.itemData}>
          <View style={styles.topRow}>
            <View style={styles.mainDataContainer}>
              <Text style={styles.mainDataLabel}>{getMainDataLabel()}</Text>
              <Text style={styles.mainDataValue}>{getMainData()}</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Valor</Text>
              <Text style={styles.amountValue}>
                {formatBrazilianCurrency(item.amount || 0)}
              </Text>
            </View>
          </View>

          <View style={styles.topRow}>
            <View style={styles.methodContainer}>
              <Text style={styles.methodLabel}>Método</Text>
              <Text style={styles.methodValue}>
                {(item.method || "N/A").toUpperCase()}
              </Text>
            </View>

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Hora</Text>
              <Text style={styles.dateValue}>
                {formatBrazilianTime(item.transactionDate || "")}
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.detailsButton}
            onPress={() => handleShowDetails(item)}
          >
            <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
            <FontAwesome name="eye" size={12} color={Colors.white} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Lista de Gastos" />
      <View style={styles.container}>
        {/* Busca */}
        <View style={styles.searchContainer}>
          <SearchInput
            searchQuery={search}
            onSearchChange={setSearch}
            placeholder="Digite para buscar gastos..."
            sortOptions={sortOptions}
            selectedSort={sortBy}
            onSortChange={handleSortChange}
            showSortOptions={true}
            multipleSelection={false}
          />
        </View>

        {/* Lista de Gastos */}
        <View style={styles.listContainer}>
          {expensesLoading && expenses.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.blue.primary} />
              <Text style={styles.loadingText}>Carregando gastos...</Text>
            </View>
          ) : filteredExpenses.length === 0 ? (
            <ScrollView
              contentContainerStyle={styles.emptyStateContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[Colors.blue.primary]}
                  tintColor={Colors.blue.primary}
                />
              }
            >
              <View style={styles.emptyState}>
                <FontAwesome
                  name="file-text-o"
                  size={48}
                  color={Colors.gray.medium}
                />
                <Text style={styles.emptyStateText}>
                  {search
                    ? `Nenhum gasto encontrado para "${search}"`
                    : "Nenhum gasto registrado no momento"}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Puxe para baixo para atualizar
                </Text>
              </View>
            </ScrollView>
          ) : (
            <FlatList
              data={filteredExpenses}
              renderItem={renderExpenseItem}
              keyExtractor={(item: any) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[Colors.blue.primary]}
                  tintColor={Colors.blue.primary}
                />
              }
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              windowSize={5}
              initialNumToRender={5}
              getItemLayout={(data, index) => ({
                length: 120, // Altura aproximada de cada item
                offset: 120 * index,
                index,
              })}
            />
          )}
        </View>
      </View>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <Pressable
          style={[
            styles.fabButton,
            isButtomBlocked ? styles.disabeleButton : styles.enableButton,
          ]}
          onPress={() => {
            if (isButtomBlocked) {
              ToastAndroid.show(
                "Para adiciona uma despesa é preciso que o caixa esteja aberto",
                ToastAndroid.LONG
              );
              return;
            }
            handleAddExpense();
          }}
        >
          <Feather name="plus" size={40} color={Colors.white} />
        </Pressable>
      </View>

      {/* Modal de Detalhes da Despesa */}
      <ExpenseDetailsModal
        visible={detailsModalVisible}
        onClose={handleCloseDetails}
        expense={selectedExpense}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      {/* Modal de Feedback */}
      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        type={modalIsSuccess ? "success" : "error"}
        onClose={handleCloseModal}
      />
    </View>
  );
}
