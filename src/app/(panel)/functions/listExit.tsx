import CashAvailabilityAlert from "@/components/CashAvailabilityAlert";
import FeedbackModal from "@/components/FeedbackModal";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import Colors from "@/constants/Colors";
import { useCashContext } from "@/context/CashContext";
import { useParkedVehicles } from "@/hooks/parking/useParking";
import { useFetchVehicle } from "@/hooks/vehicleFlow/useFetchVehicle";
import { styles } from "@/styles/functions/listExitStyle";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ListExit() {
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("plate");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { cashData, cashStatus } = useCashContext();

  // Funções utilitárias locais para verificar status do caixa
  const isCashClosed = (): boolean => cashStatus === "closed";
  const isCashNotCreated = (): boolean => cashStatus === "not_created";

  // Verificar se a tela deve ser bloqueada
  const isScreenBlocked = isCashNotCreated() || isCashClosed();

  // Funções de callback para os botões do alerta
  const handleBackPress = () => {
    router.back();
  };

  const sortOptions = [
    { key: "plate", label: "Placa", icon: "car" },
    { key: "category", label: "Categoria", icon: "list" },
    { key: "operator", label: "Operador", icon: "person" },
  ];

  // Hook para dados dos veículos
  const {
    vehicles,
    loading: vehiclesLoading,
    error: vehiclesError,
    hasMore,
    loadInitial,
    loadMore,
  } = useParkedVehicles(cashData?.id || "");

  const { fetchVehicle, loading, success, error, message } = useFetchVehicle();

  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalIsSuccess, setModalIsSuccess] = useState<boolean>(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [loadingVehicleId, setLoadingVehicleId] = useState<string | null>(null);

  // Carrega dados iniciais
  useEffect(() => {
    loadInitial();
  }, []);

  // Atualiza o tempo a cada segundo para o contador
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitorar mudanças no hook useFetchVehicle
  useEffect(() => {
    if (success && message && vehicleData) {
      setModalMessage(message);
      setModalIsSuccess(true);
      setModalVisible(true);
      setLoadingVehicleId(null); // Limpar loading específico
      // Navegar para a tela de informações do veículo com os dados reais
      router.push({
        pathname: "/functions/informationExit",
        params: {
          vehicleData: JSON.stringify(vehicleData),
        },
      });
    }

    if (error) {
      setModalMessage(error);
      setModalIsSuccess(false);
      setModalVisible(true);
      setLoadingVehicleId(null); // Limpar loading específico
    }
  }, [success, error, message, vehicleData]);

  const calculateElapsedTime = (entryTime: string) => {
    try {
      const entry = new Date(entryTime);
      const now = currentTime;
      const diffMs = now.getTime() - entry.getTime();

      if (diffMs < 0) return "00:00:00";

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } catch (error) {
      return "00:00:00";
    }
  };

  const handleSortChange = (sortKey: string | string[]) => {
    if (typeof sortKey === "string") {
      setSortBy(sortKey);
    }
  };

  // Filtra e ordena os veículos
  const filteredVehicles = useMemo(() => {
    const searchTerm = search.toLowerCase();

    let filtered = vehicles.filter((vehicle) => {
      switch (sortBy) {
        case "plate":
          return vehicle.plate.toLowerCase().includes(searchTerm);
        case "category":
          return vehicle.category.toLowerCase().includes(searchTerm);
        case "operator":
          return vehicle.operator.toLowerCase().includes(searchTerm);
        default:
          return true;
      }
    });

    // Ordena alfabeticamente pelo campo selecionado
    filtered.sort((a, b) => {
      const fieldA = String(a[sortBy as keyof typeof a]).toLowerCase();
      const fieldB = String(b[sortBy as keyof typeof b]).toLowerCase();
      return fieldA.localeCompare(fieldB);
    });

    return filtered;
  }, [vehicles, search, sortBy]);

  const handleLoadMore = async () => {
    if (hasMore && !vehiclesLoading && !loadingMore) {
      setLoadingMore(true);
      try {
        await loadMore();
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInitial();
    } finally {
      setRefreshing(false);
    }
  };

  // Função para registrar saída do veículo
  const handleRegisterExit = async (vehicle: any) => {
    try {
      console.log("Registrando saída do veículo:", vehicle.id, vehicle.plate);
      setLoadingVehicleId(vehicle.id); // Definir loading específico para este veículo

      const result = await fetchVehicle(vehicle.id, vehicle.plate);

      if (result?.data) {
        // Armazenar dados do veículo para passar como parâmetro
        setVehicleData(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar veículo:", error);
      setLoadingVehicleId(null); // Limpar loading em caso de erro
      setModalMessage("Erro ao buscar dados do veículo");
      setModalIsSuccess(false);
      setModalVisible(true);
    }
  };

  // Fechar modal de feedback
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderVehicleItem = ({ item, index }: { item: any; index: number }) => {
    // Verifica se o veículo está deletado
    const isDeleted = item.deletedAt || item.status === "DELETED";

    // Determina o dado principal baseado na opção selecionada
    const getMainData = () => {
      switch (sortBy) {
        case "plate":
          return item.plate;
        case "category":
          return item.category;
        case "operator":
          return item.operator;
        default:
          return item.plate;
      }
    };

    const getMainDataLabel = () => {
      switch (sortBy) {
        case "plate":
          return "Placa";
        case "category":
          return "Categoria";
        case "operator":
          return "Operador";
        default:
          return "Placa";
      }
    };

    return (
      <View style={[styles.listItem, isDeleted && styles.listItemDeleted]}>
        <Text
          style={[styles.itemNumber, isDeleted && styles.itemNumberDeleted]}
        >
          {index + 1}
        </Text>

        <View style={styles.itemData}>
          <View style={styles.topRow}>
            <View style={styles.mainDataContainer}>
              <Text
                style={[
                  styles.mainDataLabel,
                  isDeleted && styles.mainDataLabelDeleted,
                ]}
              >
                {getMainDataLabel()}
              </Text>
              <Text
                style={[
                  styles.mainDataValue,
                  isDeleted && styles.mainDataValueDeleted,
                ]}
              >
                {getMainData()}
              </Text>
            </View>

            <View style={styles.timeContainer}>
              <Text
                style={[styles.timeLabel, isDeleted && styles.timeLabelDeleted]}
              >
                {isDeleted ? "Status" : "Tempo"}
              </Text>
              <Text
                style={[styles.timeValue, isDeleted && styles.timeValueDeleted]}
              >
                {isDeleted
                  ? "Desativado"
                  : item.entryTime
                  ? calculateElapsedTime(item.entryTime)
                  : "00:00:00"}
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.detailsButton,
              isDeleted && styles.detailsButtonDeleted,
            ]}
            onPress={() => handleRegisterExit(item)}
            disabled={
              Boolean(isDeleted) || Boolean(loadingVehicleId === item.id)
            }
          >
            <Text
              style={[
                styles.detailsButtonText,
                isDeleted && styles.detailsButtonTextDeleted,
              ]}
            >
              {loadingVehicleId === item.id
                ? "Carregando..."
                : "Registrar Saída"}
            </Text>
            <FontAwesome
              name={loadingVehicleId === item.id ? "spinner" : "sign-out"}
              size={12}
              color={isDeleted ? Colors.gray[500] : Colors.white}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Saída de Veículos" />

      {/* ALERTA DE TELA BLOQUEADA */}
      {isScreenBlocked ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
        >
          <CashAvailabilityAlert
            mode="blocking"
            cashStatus={cashStatus}
            style={{
              marginHorizontal: 0,
              marginVertical: 0,
            }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          {/* Busca */}
          <View style={styles.searchContainer}>
            <SearchInput
              searchQuery={search}
              onSearchChange={setSearch}
              placeholder="Digite para buscar veículos..."
              sortOptions={sortOptions}
              selectedSort={sortBy}
              onSortChange={handleSortChange}
              showSortOptions={true}
              multipleSelection={false}
            />
          </View>

          {/* Lista de Veículos */}
          <View style={styles.listContainer}>
            {vehiclesLoading && vehicles.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.blue.primary} />
                <Text style={styles.loadingText}>Carregando veículos...</Text>
              </View>
            ) : filteredVehicles.length === 0 ? (
              <ScrollView
                contentContainerStyle={styles.emptyStateContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={Boolean(refreshing)}
                    onRefresh={handleRefresh}
                    colors={[Colors.blue.primary]}
                    tintColor={Colors.blue.primary}
                  />
                }
              >
                <View style={styles.emptyState}>
                  <FontAwesome
                    name="car"
                    size={48}
                    color={Colors.gray.medium}
                  />
                  <Text style={styles.emptyStateText}>
                    {search
                      ? `Nenhum veículo encontrado para "${search}"`
                      : "Nenhum veículo no pátio no momento"}
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    Puxe para baixo para atualizar
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <FlatList
                data={filteredVehicles}
                renderItem={renderVehicleItem}
                keyExtractor={(item: any) => item.id}
                showsVerticalScrollIndicator={Boolean(false)}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl
                    refreshing={Boolean(refreshing)}
                    onRefresh={handleRefresh}
                    colors={[Colors.blue.primary]}
                    tintColor={Colors.blue.primary}
                  />
                }
                ListFooterComponent={() => {
                  if (hasMore && vehicles.length > 0) {
                    return (
                      <View style={styles.loadingMore}>
                        <Pressable
                          style={[
                            styles.loadMoreButton,
                            loadingMore && styles.loadMoreButtonDisabled,
                          ]}
                          onPress={handleLoadMore}
                          disabled={Boolean(loadingMore)}
                        >
                          <FontAwesome
                            name={loadingMore ? "spinner" : "chevron-down"}
                            size={16}
                            color={
                              loadingMore ? Colors.gray[400] : Colors.white
                            }
                          />
                          <Text
                            style={[
                              styles.loadMoreButtonText,
                              loadingMore && styles.loadMoreButtonTextDisabled,
                            ]}
                          >
                            {loadingMore ? "Carregando..." : "Carregar Mais"}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  }

                  return null;
                }}
                removeClippedSubviews={Boolean(true)}
                maxToRenderPerBatch={5}
                windowSize={5}
                initialNumToRender={5}
                getItemLayout={(data, index) => ({
                  length: 100, // Altura aproximada de cada item
                  offset: 100 * index,
                  index,
                })}
              />
            )}
          </View>
        </View>
      )}

      {/* Modal de Feedback */}
      <FeedbackModal
        visible={Boolean(modalVisible)}
        message={String(modalMessage)}
        type={Boolean(modalIsSuccess) ? "success" : "error"}
        onClose={handleCloseModal}
      />
    </View>
  );
}
