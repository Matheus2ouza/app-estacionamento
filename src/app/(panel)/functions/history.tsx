import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import Separator from "@/components/Separator";
import TransactionDetailsModal from "@/components/TransactionDetailsModal";
import Colors, { generateRandomColor } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import useHistory from "@/hooks/history/useHistory";
import { styles } from "@/styles/functions/historyStyles";
import {
  HistoryCashRegister,
  OutgoingExpense,
  ProductTransaction,
  VehicleTransaction,
} from "@/types/historyTypes/history";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const sortOptions = [
  { key: "valor", label: "Valor", icon: "cash" },
  { key: "data", label: "Data", icon: "calendar" },
  { key: "operador", label: "Operador", icon: "person" },
  { key: "tipo", label: "Tipo", icon: "list" },
];

export default function History() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("valor");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { role } = useAuth();
  const { loading, error, data, hasMore, fetchHistory, loadMore, refresh } =
    useHistory();

  // Carregar dados iniciais
  useEffect(() => {
    fetchHistory(9);
  }, [fetchHistory]);

  const handleSortChange = (sortKey: string | string[]) => {
    if (typeof sortKey === "string") {
      setSortBy(sortKey);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  // Processar todas as transações de todos os caixas
  const allTransactions = useMemo(() => {
    if (!data?.cashRegisters) return [];

    const transactions: any[] = [];

    data.cashRegisters.forEach((cashRegister: HistoryCashRegister) => {
      // Adicionar transações de veículos
      cashRegister.vehicleTransaction.forEach(
        (transaction: VehicleTransaction) => {
          transactions.push({
            type: "vehicle",
            data: transaction,
            cashRegisterId: cashRegister.id,
            cashRegisterDate: cashRegister.openingDate,
          });
        }
      );

      // Adicionar transações de produtos
      cashRegister.productTransaction.forEach(
        (transaction: ProductTransaction) => {
          transactions.push({
            type: "product",
            data: transaction,
            cashRegisterId: cashRegister.id,
            cashRegisterDate: cashRegister.openingDate,
          });
        }
      );

      // Adicionar despesas
      cashRegister.outgoingExpense.forEach((expense: OutgoingExpense) => {
        transactions.push({
          type: "expense",
          data: expense,
          cashRegisterId: cashRegister.id,
          cashRegisterDate: cashRegister.openingDate,
        });
      });
    });

    // Ordenar por data da transação (mais recente primeiro)
    return transactions.sort((a, b) => {
      const dateA = new Date(a.data.transactionDate).getTime();
      const dateB = new Date(b.data.transactionDate).getTime();
      return dateB - dateA;
    });
  }, [data]);

  // Gera cores aleatórias para cada transação
  const transactionColors = useMemo(() => {
    const colors: { [key: string]: string } = {};
    allTransactions.forEach((transaction, index) => {
      const key = `${transaction.type}-${index}`;
      colors[key] = generateRandomColor();
    });
    return colors;
  }, [allTransactions]);

  const getTransactionBorderColor = useCallback(
    (type: string, index: number) => {
      const key = `${type}-${index}`;
      return transactionColors[key] || Colors.blue.primary;
    },
    [transactionColors]
  );

  // Filtrar e ordenar transações
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;
    console.log("aqui começa o all");
    console.log(JSON.stringify(allTransactions, null, 2));

    // Aplicar filtro de busca se houver
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = allTransactions.filter((transaction) => {
        // Busca em todos os campos relevantes independente do filtro
        const plateMatch =
          transaction.type === "vehicle" &&
          transaction.data.vehicleEntries?.plate
            ?.toLowerCase()
            .includes(searchTerm);

        const dateMatch = transaction.data.transactionDate
          ?.toLowerCase()
          .includes(searchTerm);

        const operatorMatch = transaction.data.operator
          ?.toLowerCase()
          .includes(searchTerm);

        const productMatch =
          transaction.type === "product" &&
          transaction.data.saleItems?.some((item: any) =>
            item.productName?.toLowerCase().includes(searchTerm)
          );

        const expenseMatch =
          transaction.type === "expense" &&
          transaction.data.description?.toLowerCase().includes(searchTerm);

        return (
          plateMatch ||
          dateMatch ||
          operatorMatch ||
          productMatch ||
          expenseMatch
        );
      });
    }

    // Aplicar ordenação baseada no sortBy
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "data":
          const dateA = new Date(a.data.transactionDate).getTime();
          const dateB = new Date(b.data.transactionDate).getTime();
          return dateB - dateA; // Mais recente primeiro
        case "operador":
          const operatorA = a.data.operator?.toLowerCase() || "";
          const operatorB = b.data.operator?.toLowerCase() || "";
          return operatorA.localeCompare(operatorB);
        case "valor":
          const amountA = a.data.finalAmount || a.data.amount || 0;
          const amountB = b.data.finalAmount || b.data.amount || 0;
          return amountB - amountA; // Maior valor primeiro
        case "tipo":
          const typeOrder = { vehicle: 1, product: 2, expense: 3 };
          const orderA = typeOrder[a.type as keyof typeof typeOrder] || 999;
          const orderB = typeOrder[b.type as keyof typeof typeOrder] || 999;
          return orderA - orderB;
        default:
          // Ordenação padrão por data (mais recente primeiro)
          const defaultDateA = new Date(a.data.transactionDate).getTime();
          const defaultDateB = new Date(b.data.transactionDate).getTime();
          return defaultDateB - defaultDateA;
      }
    });
  }, [allTransactions, search, sortBy]);

  const formatCurrency = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) {
      return "R$ 0,00";
    }

    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
      return "R$ 0,00";
    }

    return `R$ ${numericValue.toFixed(2).replace(".", ",")}`;
  };

  const formatDateTime = (dateString: string | undefined | null) => {
    if (!dateString) {
      return "N/A";
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Função para truncar texto
  const truncateText = (
    text: string | undefined | null,
    maxLength: number = 15
  ) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderTransactionCard = (transaction: any, index: number) => {
    const borderColor = getTransactionBorderColor(transaction.type, index);

    const getTransactionInfo = () => {
      switch (transaction.type) {
        case "vehicle":
          return {
            type: "VEÍCULO",
            color: Colors.blue[500],
            mainData: transaction.data.vehicleEntries?.plate || "N/A",
            mainLabel: "Placa:",
            secondaryData: formatDateTime(transaction.data.transactionDate),
            secondaryLabel: "Data:",
            amount: transaction.data.finalAmount || 0,
          };
        case "product":
          const saleItems = transaction.data.saleItems || [];
          const productCount = saleItems.length;
          const productDisplay =
            productCount > 1
              ? `${productCount} produtos`
              : saleItems[0]?.productName || "Produto";

          return {
            type: "PRODUTO",
            color: Colors.green[500],
            mainData: truncateText(productDisplay),
            mainLabel: "Produto:",
            secondaryData: formatDateTime(transaction.data.transactionDate),
            secondaryLabel: "Data:",
            amount: transaction.data.finalAmount || 0,
          };
        case "expense":
          return {
            type: "DESPESA",
            color: Colors.red[500],
            mainData: truncateText(transaction.data.description || "Despesa"),
            mainLabel: "Descrição:",
            secondaryData: formatDateTime(transaction.data.transactionDate),
            secondaryLabel: "Data:",
            amount: transaction.data.amount || 0,
          };
        default:
          return {
            type: "TRANSAÇÃO",
            color: Colors.gray[500],
            mainData: "N/A",
            mainLabel: "Tipo:",
            secondaryData: "N/A",
            secondaryLabel: "Data:",
            amount: 0,
          };
      }
    };

    const info = getTransactionInfo();
    const canViewValues = data?.userPermissions?.canViewValues || false;

    // Função para obter o valor em destaque baseado na ordenação
    const getHighlightValue = () => {
      switch (sortBy) {
        case "valor":
          return canViewValues ? formatCurrency(info.amount) : "***";
        case "operador":
          return transaction.data.operator || "N/A";
        case "data":
          return formatDateTime(transaction.data.transactionDate);
        default:
          return canViewValues ? formatCurrency(info.amount) : "***";
      }
    };

    return (
      <View
        key={`${transaction.type}-${index}`}
        style={[styles.historyCard, { borderLeftColor: borderColor }]}
      >
        <View style={styles.historyCardHeader}>
          <Text style={[styles.historyType, { backgroundColor: info.color }]}>
            {info.type}
          </Text>
          <Text style={styles.historyAmount}>{getHighlightValue()}</Text>
        </View>

        <View style={styles.historyDetails}>
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>{info.mainLabel}</Text>
            <Text style={styles.historyDetailValue}>{info.mainData}</Text>
          </View>
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>{info.secondaryLabel}</Text>
            <Text style={styles.historyDetailValue}>{info.secondaryData}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.operatorText}>
            Operador: {transaction.data.operator || "N/A"}
          </Text>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => {
              setSelectedTransaction(transaction);
              setShowDetailsModal(true);
            }}
          >
            <Text style={styles.viewDetailsButtonText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleLoadMore = async () => {
    if (hasMore && !loading) {
      await loadMore();
    }
  };

  const renderLoadMoreButton = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.loadMoreContainer}>
        <Pressable
          style={[
            styles.loadMoreButton,
            loading && styles.loadMoreButtonDisabled,
          ]}
          onPress={handleLoadMore}
          disabled={loading}
        >
          <Ionicons
            name={loading ? "hourglass" : "chevron-down"}
            size={16}
            color={loading ? Colors.gray[400] : Colors.white}
          />
          <Text
            style={[
              styles.loadMoreButtonText,
              loading && styles.loadMoreButtonTextDisabled,
            ]}
          >
            {loading ? "Carregando..." : "Carregar Mais"}
          </Text>
        </Pressable>
      </View>
    );
  };

  if (loading && !data) {
    return (
      <View style={styles.container}>
        <Header title="Histórico" />
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
        <Header title="Histórico" />
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle" size={48} color={Colors.red[500]} />
          <Text style={styles.emptyStateText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Histórico" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.blue.primary]}
            tintColor={Colors.blue.primary}
            title="Atualizando..."
            titleColor={Colors.gray[600]}
          />
        }
      >
        {/* Seção de busca e filtro */}
        <SearchInput
          searchQuery={search}
          onSearchChange={setSearch}
          placeholder="Buscar por..."
          sortOptions={sortOptions}
          selectedSort={sortBy}
          onSortChange={handleSortChange}
          showSortOptions={true}
          multipleSelection={false}
        />

        <Separator marginTop={10} style={{ width: "90%" }} />

        {/* Histórico */}
        <View style={styles.historyContainer}>
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text"
                size={48}
                color={Colors.gray[400]}
              />
              <Text style={styles.emptyStateText}>
                {search
                  ? `Nenhuma transação encontrada para "${search}"`
                  : "Nenhuma transação encontrada"}
              </Text>
            </View>
          ) : (
            filteredTransactions.map((transaction, index) =>
              renderTransactionCard(transaction, index)
            )
          )}
        </View>

        {/* Botão Carregar Mais */}
        {renderLoadMoreButton()}
      </ScrollView>

      {/* Modal de Detalhes */}
      <TransactionDetailsModal
        visible={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        transaction={selectedTransaction}
        showDeleteButton={false}
      />
    </View>
  );
}
