import Header from "@/src/components/Header";
import SearchInput from "@/src/components/SearchInput";
import VehicleDetailsModal from "@/src/components/VehicleDetailsModal";
import Colors from "@/src/constants/Colors";
import { useCashContext } from "@/src/context/CashContext";
import { useParkedVehicles, useParking } from "@/src/hooks/parking/useParking";
import { styles } from "@/src/styles/functions/parkingStyle";
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
  View
} from "react-native";

export default function Parking() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("plate");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { cashData } = useCashContext();

  const sortOptions = [
    { key: "plate", label: "Placa", icon: "car" },
    { key: "category", label: "Categoria", icon: "list" },
    { key: "operator", label: "Operador", icon: "person" },
  ];

  // Hooks para dados
  const { getCapacityParking, loading: capacityLoading, error: capacityError } = useParking();
  const { 
    vehicles, 
    loading: vehiclesLoading, 
    error, 
    hasMore, 
    loadInitial, 
    loadMore 
  } = useParkedVehicles(cashData?.id || "");

  const [capacityData, setCapacityData] = useState({
    percentage: 0,
    quantityVehicles: 0,
    capacityMax: 0
  });
  const [capacityErrorState, setCapacityErrorState] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Carrega dados iniciais
  useEffect(() => {
    loadInitial();
    loadCapacityData();
  }, []);

  // Atualiza o tempo a cada segundo para o contador
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadCapacityData = async () => {
    setCapacityErrorState(null);
    const result = await getCapacityParking(cashData?.id || "");

    if (result.success) {
      setCapacityData(result.data);
    } else {
      setCapacityErrorState(result.message || 'Erro ao carregar capacidade do pátio');
    }
  };

  const getBatteryColor = (percentage: number) => {
    if (percentage < 25) return Colors.green[500];
    if (percentage < 50) return Colors.green[400];
    if (percentage < 75) return Colors.yellow[500];
    if (percentage < 90) return Colors.orange[500];
    return Colors.red[500];
  };

  const calculateElapsedTime = (entryTime: string) => {
    try {
      const entry = new Date(entryTime);
      const now = currentTime;
      const diffMs = now.getTime() - entry.getTime();
      
      if (diffMs < 0) return '00:00:00';
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (error) {
      return '00:00:00';
    }
  };

  const handleSortChange = (sortKey: string | string[]) => {
    if (typeof sortKey === 'string') {
      setSortBy(sortKey);
    }
  };

  // Filtra e ordena os veículos
  const filteredVehicles = useMemo(() => {
    const searchTerm = search.toLowerCase();
    
    let filtered = vehicles.filter((vehicle) => {
      switch(sortBy) {
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
      await loadCapacityData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleShowDetails = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDetailsModalVisible(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
    setSelectedVehicle(null);
  };

  const handleEditVehicle = (vehicle: any) => {
    router.push({
      pathname: "/functions/editRegister",
      params: {
        id: vehicle.id,
        plate: vehicle.plate,
        category: vehicle.category,
        observation: vehicle.observation || "",
        billingMethodId: vehicle.billingMethod?.id || "",
        billingMethodTitle: vehicle.billingMethod?.title || "",
        photoType: vehicle.photoType || ""
      }
    });
  };

  const handleDeleteVehicle = async (vehicle: any) => {
    // Recarrega a lista após a operação de delete/activate
    await loadInitial();
    await loadCapacityData();
  };

  const handlePrintVehicle = (vehicle: any) => {
    // TODO: Implementar impressão
    console.log('Imprimir veículo:', vehicle.id);
  };

  const renderVehicleItem = ({ item, index }: { item: any; index: number }) => {
    // Verifica se o veículo está deletado
    const isDeleted = item.deletedAt || item.status === 'DELETED';
    
    // Determina o dado principal baseado na opção selecionada
    const getMainData = () => {
      switch(sortBy) {
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
      switch(sortBy) {
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
      <View style={[
        styles.listItem,
        isDeleted && styles.listItemDeleted
      ]}>
        <Text style={[
          styles.itemNumber,
          isDeleted && styles.itemNumberDeleted
        ]}>
          {index + 1}
        </Text>

        <View style={styles.itemData}>
          <View style={styles.topRow}>
            <View style={styles.mainDataContainer}>
              <Text style={[
                styles.mainDataLabel,
                isDeleted && styles.mainDataLabelDeleted
              ]}>
                {getMainDataLabel()}
              </Text>
              <Text style={[
                styles.mainDataValue,
                isDeleted && styles.mainDataValueDeleted
              ]}>
                {getMainData()}
              </Text>
            </View>

            <View style={styles.timeContainer}>
              <Text style={[
                styles.timeLabel,
                isDeleted && styles.timeLabelDeleted
              ]}>
                {isDeleted ? 'Status' : 'Tempo'}
              </Text>
              <Text style={[
                styles.timeValue,
                isDeleted && styles.timeValueDeleted
              ]}>
                {isDeleted ? 'Desativado' : (item.entryTime ? calculateElapsedTime(item.entryTime) : '00:00:00')}
              </Text>
            </View>
          </View>

          <Pressable 
            style={[
              styles.detailsButton,
              isDeleted && styles.detailsButtonDeleted
            ]}
            onPress={() => handleShowDetails(item)}
          >
            <Text style={[
              styles.detailsButtonText,
              isDeleted && styles.detailsButtonTextDeleted
            ]}>
              Detalhes Completos
            </Text>
            <FontAwesome 
              name="chevron-right" 
              size={12} 
              color={isDeleted ? Colors.gray[500] : Colors.white} 
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderBattery = () => {
    const percentage = capacityData.percentage;
    const batteryColor = getBatteryColor(percentage);
    
    // Se houver erro na capacidade, mostra tela de erro
    if (capacityErrorState) {
      return (
        <View style={styles.batteryContainer}>
          <View style={styles.batteryHeader}>
            <Text style={styles.batteryTitle}>Capacidade do Pátio</Text>
            <FontAwesome 
              name="exclamation-triangle" 
              size={20} 
              color={Colors.red[500]} 
            />
          </View>
          
          <View style={styles.batteryErrorContainer}>
            <FontAwesome 
              name="exclamation-circle" 
              size={48} 
              color={Colors.red[500]} 
            />
            <Text style={styles.batteryErrorText}>
              {capacityErrorState}
            </Text>
            <Pressable 
              style={styles.batteryRetryButton}
              onPress={loadCapacityData}
            >
              <FontAwesome 
                name="refresh" 
                size={16} 
                color={Colors.white} 
              />
              <Text style={styles.batteryRetryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.batteryContainer}>
        <View style={styles.batteryHeader}>
          <Text style={styles.batteryTitle}>Capacidade do Pátio</Text>
          {capacityLoading ? (
            <ActivityIndicator size="small" color={Colors.blue.primary} />
          ) : (
            <Text style={styles.batteryPercentage}>{percentage}%</Text>
          )}
        </View>
        
        <View style={styles.batteryBody}>
          <View style={styles.batteryOuter}>
            {capacityLoading ? (
              <View style={styles.batteryLoading}>
                <ActivityIndicator size="small" color={Colors.blue.primary} />
              </View>
            ) : (
              <View 
                style={[
                  styles.batteryInner,
                  { 
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: batteryColor
                  }
                ]} 
              />
            )}
          </View>
        </View>
        
        <View style={styles.batteryInfo}>
          {capacityLoading ? (
            <Text style={styles.batteryText}>Carregando capacidade...</Text>
          ) : (
            <Text style={styles.batteryText}>
              {capacityData.quantityVehicles} de {capacityData.capacityMax} vagas ocupadas
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Pátio"/>

      <View style={styles.container}>
        {/* Bateria de Capacidade */}
        {renderBattery()}

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
                  refreshing={refreshing}
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
                  {search ? 
                    `Nenhum veículo encontrado para "${search}"` : 
                    "Nenhum veículo no pátio no momento"
                  }
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
              ListFooterComponent={() => {
                if (hasMore && vehicles.length > 0) {
                  return (
                    <View style={styles.loadingMore}>
                      <Pressable 
                        style={[
                          styles.loadMoreButton,
                          loadingMore && styles.loadMoreButtonDisabled
                        ]}
                        onPress={handleLoadMore}
                        disabled={loadingMore}
                      >
                        <FontAwesome 
                          name={loadingMore ? "spinner" : "chevron-down"} 
                          size={16} 
                          color={loadingMore ? Colors.gray[400] : Colors.white} 
                        />
                        <Text style={[
                          styles.loadMoreButtonText,
                          loadingMore && styles.loadMoreButtonTextDisabled
                        ]}>
                          {loadingMore ? 'Carregando...' : 'Carregar Mais'}
                        </Text>
                      </Pressable>
                    </View>
                  );
                }
                
                return null;
              }}
              removeClippedSubviews={true}
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

      {/* Modal de Detalhes */}
      <VehicleDetailsModal
        visible={detailsModalVisible}
        onClose={handleCloseDetails}
        vehicle={selectedVehicle}
        onEdit={handleEditVehicle}
        onDelete={handleDeleteVehicle}
        onPrint={handlePrintVehicle}
      />
    </View>
  );
}