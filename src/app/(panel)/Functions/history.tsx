import React, { useState, useMemo } from "react";
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "@/src/components/Header";
import SearchInput from "@/src/components/SearchInput";
import Separator from "@/src/components/Separator";
import Colors from "@/src/constants/Colors";
import { styles } from "@/src/styles/functions/historicalStyle";
import { useHistoricData } from "@/src/hooks/history/useHistory";
import PreviewPDF from "@/src/components/PreviewPDF";
import PhotoViewer from "@/src/components/PhotoViewer";
import { usePdfActions } from "@/src/hooks/vehicleFlow/usePdfActions";

import {
  VehicleTransaction,
  Historic,
  ProductTransaction,
} from "@/src/types/dashboard";
import { Feather, MaterialIcons } from "@expo/vector-icons";

type TimeFilterType = "day" | "week" | "month";

// Funções auxiliares
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatCurrency = (value: string): string => {
  const numberValue = parseFloat(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numberValue);
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Opções para os dropdowns - agora com ícones
const searchOptions = [
  {
    label: "Placa",
    value: "plate",
    icon: () => <Feather name="truck" size={18} color={Colors.blue.dark} />,
  },
  {
    label: "Data",
    value: "date",
    icon: () => <Feather name="calendar" size={18} color={Colors.blue.dark} />,
  },
  {
    label: "Operador",
    value: "operator",
    icon: () => <Feather name="user" size={18} color={Colors.blue.dark} />,
  },
  {
    label: "Tipo",
    value: "type",
    icon: () => <Feather name="filter" size={18} color={Colors.blue.dark} />,
  },
];

const timeFilterOptions = [
  {
    label: "Hoje",
    value: "day",
    icon: () => <Feather name="sun" size={18} color={Colors.blue.dark} />,
  },
  {
    label: "Semana",
    value: "week",
    icon: () => <Feather name="calendar" size={18} color={Colors.blue.dark} />,
  },
  {
    label: "Mês",
    value: "month",
    icon: () => (
      <MaterialIcons name="date-range" size={18} color={Colors.blue.dark} />
    ),
  },
];

interface HistoryProps {
  historicData: Historic;
}

export default function History({ historicData }: HistoryProps) {
  const {
    data,
    loading,
    error,
    refetch,
    filter: timeFilter,
    setFilter: setTimeFilter,
    secondCopyData,
    showSecondCopy,
    secondCopyLoading,
    secondCopyError,
    setSecondCopyError,
    fetchSecondCopy,
    closeSecondCopy,
  } = useHistoricData();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("plate");
  const [refreshing, setRefreshing] = useState(false);

  const [timeOpen, setTimeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { downloadPdf } = usePdfActions();
  const [currentTransaction, setCurrentTransaction] = useState<{
    id: string;
    type: "vehicle" | "product";
  } | null>(null);

  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<{
    base64: string | null;
    type: string | null;
  } | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch(timeFilter);
    setRefreshing(false);
  };

  const handleTimeFilterChange = (value: TimeFilterType | null) => {
    if (value) {
      setTimeFilter(value);
      refetch(value);
      setSearch("");
    }
  };

  // Combine and sort all transactions by date
  const allTransactions = useMemo(() => {
    if (!data?.data) return [];
    return [...data.data.vehicles, ...data.data.products].sort(
      (a, b) =>
        new Date(b.transaction_date).getTime() -
        new Date(a.transaction_date).getTime()
    );
  }, [data]);

  // Atualize a função handleDownload
  const handleDownload = async () => {
    if (!secondCopyData?.receipt || !currentTransaction) return;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const prefix = currentTransaction.type === "vehicle" ? "V" : "P";
    const filename = `COMPROVANTE_${prefix}_${currentTransaction.id}_${dateStr}.pdf`;

    try {
      // Implemente sua função downloadPdf conforme necessário
      await downloadPdf(secondCopyData.receipt, filename);
      console.log("Download feito com sucesso");
    } catch (err) {
      console.error("Erro ao baixar o PDF:", err);
      setSecondCopyError("Erro ao baixar o comprovante");
    }
  };

const handleViewPhoto = (transaction: VehicleTransaction | ProductTransaction) => {
  if (transaction.photo && transaction.photo_type) {
        console.log('Tipo do campo photo:', typeof transaction.photo);
    console.log('Exemplo do conteúdo:', JSON.stringify(transaction.photo).substring(0, 100));
    let base64String: string;
    
    if (typeof transaction.photo === 'object' && !(transaction.photo instanceof Uint8Array)) {
      // Converte o objeto de bytes para Uint8Array
      const bytes = Object.values(transaction.photo);
      const uintArray = new Uint8Array(bytes);
      
      // Converte para base64
      base64String = arrayBufferToBase64(uintArray);
    } 
    // Se já for string base64
    else if (typeof transaction.photo === 'string') {
      base64String = transaction.photo;
    }
    // Se for Uint8Array/Buffer
    else if (transaction.photo instanceof Uint8Array) {
      base64String = arrayBufferToBase64(transaction.photo);
    } else {
      console.error('Formato de foto não reconhecido:', transaction.photo);
      return;
    }

    setCurrentPhoto({
      base64: base64String,
      type: transaction.photo_type,
    });
    setPhotoViewerVisible(true);
  }
};

// Função auxiliar para converter ArrayBuffer/Uint8Array para base64
const arrayBufferToBase64 = (buffer: Uint8Array) => {
  let binary = '';
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
};

  const handleSecondCopyPress = (
    transaction: VehicleTransaction | ProductTransaction
  ) => {
    const type = transaction.type === "vehicle" ? "vehicle" : "product";
    setCurrentTransaction({ id: transaction.id, type });
    fetchSecondCopy(type, transaction.id);
  };

  // Filter transactions based on search and filter
  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return allTransactions;

    const searchTerm = search.toLowerCase().trim();

    return allTransactions.filter((transaction) => {
      switch (filter) {
        case "plate":
          return (
            transaction.type === "vehicle" &&
            transaction.plate.toLowerCase().includes(searchTerm)
          );

        case "date":
          const formattedDate = formatDate(transaction.transaction_date);
          return formattedDate.includes(searchTerm);

        case "operator":
          return transaction.operator.toLowerCase().includes(searchTerm);

        case "type":
          // Busca por "veículo" ou "produto"
          const typeText =
            transaction.type === "vehicle" ? "veículo" : "produto";
          return typeText.includes(searchTerm);

        default:
          return true;
      }
    });
  }, [allTransactions, search, filter]);

  const renderTransactionDetails = (
    transaction: VehicleTransaction | ProductTransaction
  ) => {
    const isVehicle = transaction.type === "vehicle";

    // Define o dado principal baseado no filtro selecionado
    const getMainData = () => {
      switch (filter) {
        case "plate":
          return isVehicle ? transaction.plate : "Venda de Produtos";
        case "date":
          return formatDate(transaction.transaction_date);
        case "operator":
          return transaction.operator;
        case "type":
          return isVehicle ? "VEÍCULO" : "PRODUTO";
        default:
          return isVehicle ? transaction.plate : "Venda de Produtos";
      }
    };

    // Define o ícone principal baseado no filtro selecionado
    const getMainIcon = () => {
      switch (filter) {
        case "plate":
          return <Feather name="truck" size={20} color={Colors.blue.dark} />;
        case "date":
          return <Feather name="calendar" size={20} color={Colors.blue.dark} />;
        case "operator":
          return <Feather name="user" size={20} color={Colors.blue.dark} />;
        case "type":
          return <Feather name="filter" size={20} color={Colors.blue.dark} />;
        default:
          return <Feather name="truck" size={20} color={Colors.blue.dark} />;
      }
    };

    return (
      <View style={styles.transactionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.mainDataContainer}>
            {getMainIcon()}
            <Text style={styles.mainData}>{getMainData()}</Text>
          </View>
          <View style={styles.transactionTypeBadge}>
            <Text style={styles.typeBadgeText}>
              {isVehicle ? "VEÍCULO" : "PRODUTO"}
            </Text>
          </View>
        </View>

        {/* Grid 2x2 para os detalhes */}
        <View style={styles.detailsGrid}>
          {/* Linha 1 */}
          <View style={styles.detailCell}>
            <View style={styles.detailRow}>
              <Feather name="clock" size={16} color={Colors.blue.dark} />
              <Text style={styles.detailText}>
                {formatDate(transaction.transaction_date)}{" "}
                {formatTime(transaction.transaction_date)}
              </Text>
            </View>
          </View>

          <View style={styles.detailCell}>
            <View style={styles.detailRow}>
              <Feather name="dollar-sign" size={16} color={Colors.blue.dark} />
              <Text style={styles.detailText}>
                {formatCurrency(transaction.final_amount)}
              </Text>
            </View>
          </View>

          {/* Linha 2 */}
          <View style={styles.detailCell}>
            <View style={styles.detailRow}>
              <Feather name="user" size={16} color={Colors.blue.dark} />
              <Text style={styles.detailText}>{transaction.operator}</Text>
            </View>
          </View>

          <View style={styles.detailCell}>
            <View style={styles.detailRow}>
              <Feather
                name={isVehicle ? "credit-card" : "package"}
                size={16}
                color={Colors.blue.dark}
              />
              <Text style={styles.detailText}>
                {isVehicle
                  ? transaction.method
                  : `${transaction.items.length} itens`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue.logo} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Histórico" />

      {/* Modal da segunda via */}
      <PreviewPDF
        base64={secondCopyData?.receipt || ""}
        visible={showSecondCopy}
        onClose={() => {
          closeSecondCopy();
          setCurrentTransaction(null);
        }}
        onDownload={handleDownload}
        onNavigateBack={() => {
          closeSecondCopy();
          setCurrentTransaction(null);
        }}
      />

      <PhotoViewer
        visible={photoViewerVisible}
        onClose={() => setPhotoViewerVisible(false)}
        photoBase64={currentPhoto?.base64}
        photoType={currentPhoto?.type}
      />

      {/* Área de Filtros */}
      <View style={styles.filterContainer}>
        <View style={styles.searchRow}>
          <SearchInput
            search={search}
            setSearch={setSearch}
            inputWidth={"100%"}
            placeholder={`Buscar ${searchOptions
              .find((opt) => opt.value === filter)
              ?.label.toLowerCase()}`}
          />
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterDropdown}>
            <DropDownPicker
              open={searchOpen}
              value={filter}
              items={searchOptions}
              setOpen={setSearchOpen}
              setValue={setFilter}
              placeholder="Filtrar por"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              zIndex={3000}
            />
          </View>

          <View style={styles.filterDropdown}>
            <DropDownPicker
              open={timeOpen}
              value={timeFilter}
              items={timeFilterOptions}
              setOpen={setTimeOpen}
              setValue={(callback) => {
                const newValue =
                  typeof callback === "function"
                    ? callback(timeFilter)
                    : callback;
                handleTimeFilterChange(newValue as TimeFilterType);
              }}
              placeholder="Período"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              zIndex={2000}
            />
          </View>
        </View>
      </View>

      {/* Lista de Transações */}
      <ScrollView
        style={styles.transactionsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.blue.logo]}
            tintColor={Colors.blue.logo}
          />
        }
      >
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color={Colors.gray.light} />
            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptySubtext}>Tente ajustar os filtros</Text>
          </View>
        ) : (
          filteredTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionWrapper}>
              {renderTransactionDetails(transaction)}

              <View style={styles.actionButtons}>
                <Pressable
                  onPress={() => handleSecondCopyPress(transaction)}
                  style={styles.secondCopyButton}
                  disabled={secondCopyLoading}
                >
                  {secondCopyLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Feather name="printer" size={20} color="white" />
                      <Text style={styles.buttonText}>2ª VIA</Text>
                    </>
                  )}
                </Pressable>

                {transaction.photo && (
                  <Pressable
                    onPress={() => handleViewPhoto(transaction)}
                    style={styles.photoButton}
                  >
                    <Feather name="image" size={20} color="white" />
                    <Text style={styles.buttonText}>FOTO</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {secondCopyLoading && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color={Colors.blue.logo} />
          <Text style={styles.loadingText}>Carregando comprovante...</Text>
        </View>
      )}

      {/* Erro ao carregar segunda via */}
      {secondCopyError && (
        <View style={styles.errorModal}>
          <Text style={styles.errorModalText}>{secondCopyError}</Text>
          <Pressable
            onPress={() => setSecondCopyError(null)}
            style={styles.errorModalButton}
          >
            <Text style={styles.errorModalButtonText}>OK</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
