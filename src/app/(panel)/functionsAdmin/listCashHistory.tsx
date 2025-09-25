import CashHistoryDetailsModal from "@/components/CashHistoryDetailsModal";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import Colors, { generateRandomColor } from "@/constants/Colors";
import { useCashHistory } from "@/hooks/cash/useCashHistory";
import { styles } from "@/styles/functions/listCashHistoryStyle";
import { ListHistoryCash } from "@/types/cashTypes/cash";
import { formatDateTime } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Helpers compartilhados
const formatCurrency = (value: number | string | undefined | null) => {
  if (value === undefined || value === null) return "R$ 0,00";
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) return "R$ 0,00";
  return `R$ ${numericValue.toFixed(2).replace(".", ",")}`;
};



const sortOptions = [
  { key: "lucro", label: "Lucro", icon: "cash" },
  { key: "data", label: "Data", icon: "calendar" },
  { key: "operador", label: "Operador", icon: "person" },
];

export default function ListCashHistory() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("data");
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error, fetchAllCashHistory } = useCashHistory();
  const [data, setData] = useState<ListHistoryCash[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [selectedCash, setSelectedCash] = useState<ListHistoryCash | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      const result = await fetchAllCashHistory(9);
      if (result) {
        setData(result.items);
        setHasMore(result.hasNextPage);
        setNextCursor(result.nextCursor);
      }
    };
    load();
  }, [fetchAllCashHistory]);

  const handleSortChange = (sortKey: string | string[]) => {
    if (typeof sortKey === "string") {
      setSortBy(sortKey);
    }
  };

  // Filtra conforme o campo selecionado em sortBy
  const filteredData = useMemo(() => {
    if (!search) return data;
    const query = search.toLowerCase();

    return data.filter((item) => {
      if (sortBy === 'operador') {
        return (item.operator || '').toLowerCase().includes(query);
      }

      if (sortBy === 'data') {
        const raw = (item.openingDate || '').toLowerCase();
        const formatted = formatDateTime(item.openingDate).toLowerCase();
        return raw.includes(query) || formatted.includes(query);
      }

      // sortBy === 'lucro'
      const profit = item.profit ?? 0;
      const profitCurrency = formatCurrency(profit).replace(/r\$|\s/gi, '').toLowerCase(); // ex: 123,45
      const profitDot = (typeof profit === 'number' ? profit.toFixed(2) : String(profit)).toLowerCase(); // ex: 123.45
      const queryDot = query.replace(/,/g, '.');
      return (
        profitCurrency.includes(query) ||
        profitCurrency.replace(/,/g, '.').includes(queryDot) ||
        profitDot.includes(queryDot)
      );
    });
  }, [data, search, sortBy]);

  // Dados ordenados conforme seleção
  const sortedData = useMemo(() => {
    const copy = [...filteredData];
    return copy.sort((a, b) => {
      switch (sortBy) {
        case "lucro":
          return (b.profit ?? 0) - (a.profit ?? 0);
        case "operador":
          return (a.operator || "").localeCompare(b.operator || "");
        case "data":
        default:
          return new Date(b.openingDate).getTime() - new Date(a.openingDate).getTime();
      }
    });
  }, [filteredData, sortBy]);

  const transactionColors = useMemo(() => {
    const colors: { [key: string]: string } = {};
    data.forEach((item, index) => {
      const key = `${item.id}-${index}`;
      colors[key] = generateRandomColor();
    });
    return colors;
  }, [data]);

  const getBorderColor = useCallback((id: string, index: number) => {
    const key = `${id}-${index}`;
    return transactionColors[key] || Colors.blue.primary;
  }, [transactionColors]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || !nextCursor) return;
    const result = await fetchAllCashHistory(9, nextCursor);
    if (result) {
      setData(prev => [...prev, ...result.items]);
      setHasMore(result.hasNextPage);
      setNextCursor(result.nextCursor);
    }
  }, [hasMore, nextCursor, fetchAllCashHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const result = await fetchAllCashHistory(9);
      if (result) {
        setData(result.items);
        setHasMore(result.hasNextPage);
        setNextCursor(result.nextCursor);
      }
    } finally {
      setRefreshing(false);
    }
  }, [fetchAllCashHistory]);

  

  if (loading && data.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Histórico dos Caixas" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.blue.primary} />
          <Text style={styles.loadingText}>Carregando históricos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Histórico dos Caixas" />
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle" size={48} color={Colors.red[500]} />
          <Text style={styles.emptyStateText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Histórico dos Caixas" />
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
        <View style={styles.historyContainer}>
          {data.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text"
                size={48}
                color={Colors.gray[400]}
              />
              <Text style={styles.emptyStateText}>
                Nenhum histórico encontrado
              </Text>
            </View>
          ) : (
            sortedData.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.historyCard,
                  { borderLeftColor: getBorderColor(item.id, index) },
                ]}
              >
                <View style={styles.historyCardHeader}>
                  <Text
                    style={[
                      styles.historyType,
                      { backgroundColor: Colors.blue[500] },
                    ]}
                  >
                    CAIXA
                  </Text>
                  <Text style={styles.historyAmount}>
                    {sortBy === 'lucro' && formatCurrency(item.profit)}
                    {sortBy === 'operador' && (item.operator || 'N/A')}
                    {(sortBy === 'data') && formatDateTime(item.openingDate)}
                  </Text>
                </View>

                <View style={styles.historyDetails}>
                  <View style={styles.historyDetailRow}>
                    <Text style={styles.historyDetailLabel}>Operador:</Text>
                    <Text style={styles.historyDetailValue}>
                      {item.operator || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.historyDetailRow}>
                    <Text style={styles.historyDetailLabel}>Abertura:</Text>
                    <Text style={styles.historyDetailValue}>
                      {formatDateTime(item.openingDate)}
                    </Text>
                  </View>
                  <View style={styles.historyDetailRow}>
                    <Text style={styles.historyDetailLabel}>Fechamento:</Text>
                    <Text style={styles.historyDetailValue}>
                      {formatDateTime(item.closingDate)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => {
                    setSelectedCash(item);
                    setDetailsVisible(true);
                  }}
                >
                  <Text style={styles.viewDetailsButtonText}>Ver Detalhes</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {hasMore && (
          <View style={styles.loadMoreContainer}>
            <TouchableOpacity
              onPress={handleLoadMore}
              style={[styles.loadMoreButton, loading && styles.loadMoreButtonDisabled]}
              disabled={loading}
            >
              <Ionicons
                name={loading ? 'hourglass' : 'chevron-down'}
                size={16}
                color={loading ? Colors.gray[400] : Colors.white}
              />
              <Text style={[styles.loadMoreButtonText, loading && styles.loadMoreButtonTextDisabled]}>
                {loading ? "Carregando..." : "Carregar Mais"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal de Detalhes do Caixa */}
      {detailsVisible && selectedCash && (
        <CashHistoryDetailsModal
          visible={detailsVisible}
          onClose={() => setDetailsVisible(false)}
          cash={selectedCash}
        />
      )}
    </View>
  );
}