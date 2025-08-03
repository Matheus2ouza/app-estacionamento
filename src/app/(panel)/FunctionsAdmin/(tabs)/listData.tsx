import React, { useState, useMemo, useEffect } from "react";
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "@/src/components/Header";
import SearchInput from "@/src/components/SearchInput";
import Separator from "@/src/components/Separator";
import Colors from "@/src/constants/Colors";
import { styles } from "@/src/styles/functions/listDataStyle";
import useCashService from "@/src/hooks/cash/useCashStatus";
import useCashHistory from "@/src/hooks/cash/useCashHistory";
import { Feather } from "@expo/vector-icons";
import { Transaction } from "@/src/types/historic";

const formatDate = (dateInput: string | Date): string => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatCurrency = (value: string | number): string => {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numberValue);
};

const formatTime = (dateInput: string | Date): string => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

export default function ListData() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("plate");
  const [searchOpen, setSearchOpen] = useState(false);

  const { cashStatus, getStatusCash, openCashId } = useCashService();
  const [cashStatusLoaded, setCashStatusLoaded] = useState(false);

  const { data, loading, error, refresh } = useCashHistory(openCashId || "");

  useEffect(() => {
    const checkCashStatus = async () => {
      await getStatusCash();
      setCashStatusLoaded(true);
    };
    checkCashStatus();
  }, []);

  const allTransactions = useMemo(() => {
    return [...data.vehicles, ...data.products].sort(
      (a, b) =>
        new Date(b.transaction_date).getTime() -
        new Date(a.transaction_date).getTime()
    );
  }, [data]);

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return allTransactions;

    const searchTerm = search.toLowerCase().trim();

    return allTransactions.filter((transaction) => {
      switch (filter) {
        case "plate":
          return (
            transaction.type === "vehicle" &&
            transaction.plate?.toLowerCase().includes(searchTerm)
          );
        case "date":
          return formatDate(transaction.transaction_date).includes(searchTerm);
        case "operator":
          return transaction.operator.toLowerCase().includes(searchTerm);
        case "type":
          return transaction.type === "vehicle"
            ? "veículo".includes(searchTerm)
            : "produto".includes(searchTerm);
        default:
          return true;
      }
    });
  }, [allTransactions, search, filter]);

  const renderTransactionDetails = (transaction: Transaction) => {
    const isVehicle = transaction.type === "vehicle";

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

        <View style={styles.detailsGrid}>
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

          {!isVehicle && (
            <View style={styles.productListContainer}>
              <View style={styles.productSectionHeader}>
                <Feather name="shopping-cart" size={16} color={Colors.blue.dark} />
                <Text style={styles.productSectionTitle}>Produtos vendidos</Text>
              </View>
              <View>
                {transaction.items.map((item, index) => (
                  <View key={index} style={styles.productItem}>
                    <Text style={styles.productBullet}>•</Text>
                    <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                      {item.product_name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (!cashStatusLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue.logo} />
      </View>
    );
  }

  if (cashStatus === "CLOSED") {
    return (
      <View style={styles.container}>
        <Header title="Lista de Dados" />
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color={Colors.red[500]} />
          <Text style={styles.errorText}>Caixa Fechado</Text>
          <Text style={styles.emptySubtext}>
            Para acessar esta funcionalidade, o caixa deve estar aberto
          </Text>
          <Pressable
            onPress={() => router.push("/FunctionsAdmin/cashPanel")}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Abrir Caixa</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading && !data.vehicles.length && !data.products.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue.logo} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-triangle" size={48} color={Colors.orange[500]} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={refresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Lista de Dados" />

      <View style={styles.searchContainer}>
        <SearchInput
          search={search}
          setSearch={setSearch}
          inputWidth={"100%"}
          placeholder={`Buscar ${searchOptions
            .find((opt) => opt.value === filter)
            ?.label.toLowerCase()}`}
        />

        <View style={styles.dropdownWrapper}>
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
            zIndex={1000}
          />
        </View>
      </View>

      <Separator marginTop={10} style={{ width: "90%" }} />

      <ScrollView
        style={styles.body}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[Colors.blue.logo]}
          />
        }
      >
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={Colors.gray.light} />
            <Text style={styles.emptyText}>
              {search
                ? "Nenhum resultado encontrado"
                : "Nenhuma transação registrada"}
            </Text>
            <Text style={styles.emptySubtext}>
              {search
                ? "Tente ajustar sua busca"
                : "Quando houver transações, elas aparecerão aqui"}
            </Text>
          </View>
        ) : (
          filteredTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionWrapper}>
              {renderTransactionDetails(transaction)}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
