import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { styles } from "@/src/styles/config/ConfigStyle";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface OptionItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  adminOnly?: boolean;
  isExit?: boolean;
}

export default function Admin() {
  const { handleLogout } = useLogout();
  const { hasAdminPermission } = useAuth();

  const options: OptionItem[] = [
    {
      id: "entrada",
      title: "Registrar entrada",
      description: "Registrar entrada de veículos",
      icon: "car-outline",
      onPress: () => router.push("/functions/entreyRegister"),
    },
    {
      id: "saida-scan",
      title: "Registrar saída",
      description: "Registrar saída de veículos com leitor de código de barras",
      icon: "exit-outline",
      onPress: () => router.push("/functions/scanExit"),
    },
    {
      id: "saida-manual",
      title: "Registrar saída manualmente",
      description: "Registrar saída de veículos manualmente",
      icon: "exit-outline",
      onPress: () => router.push("/functions/listExit"),
    },
    {
      id: "parking",
      title: "Estacionamento",
      description: "Visualizar veículos no estacionamento e capacidade",
      icon: "grid-outline",
      onPress: () => router.push("/functions/parking"),
    },
    {
      id: "estoque",
      title: "Estoque",
      description: "Visualizar e registrar produtos",
      icon: "cube-outline",
      onPress: () => router.push("/functions/inventory"),
    },
    {
      id: "despesas",
      title: "Despesas",
      description: "Visualizar e registrar despesas",
      icon: "receipt-outline",
      onPress: () => {router.push("/functions/expenseRecord")},
    },
    {
      id: "caixa",
      title: "Caixa",
      description: "Gerenciar operações de caixa e financeiro",
      icon: "wallet-outline",
      onPress: () => router.push("/(panel)/functionsAdmin/cash/CashScreen"),
      adminOnly: true,
    },
    {
      id: "relatorio",
      title: "Relatório",
      description: "Visualizar relatórios e estatísticas de entradas e saídas de veículos e produtos",
      icon: "bar-chart-outline",
      onPress: () => {},
      adminOnly: true,
    },
    {
      id: "pagamentos",
      title: "Formas de Cobrança",
      description: "Configurar métodos de cobrança",
      icon: "card-outline",
      onPress: () => router.push("/functions/methodPayment"),
    },
    {
      id: "config-parking",
      title: "Configurações do Estacionamento",
      description: "Configurar vagas",
      icon: "settings-outline",
      onPress: () => router.push("/functionsAdmin/parkingConfig"),
    },
    {
      id: "contas",
      title: "Contas",
      description: "Criar e gerenciar usuários e permissões",
      icon: "people-outline",
      onPress: () => router.push("/functionsAdmin/accountInfo"),
      adminOnly: true,
    },
    {
      id: "historico",
      title: "Histórico",
      description: "Visualizar histórico de entradas e saídas de veículos e produtos",
      icon: "time-outline",
      onPress: () => router.push("/functions/history"),
    },
    {
      id: "sair",
      title: "Sair",
      description: "Fazer logout do app",
      icon: "log-out-outline",
      onPress: handleLogout,
      isExit: true,
    },
  ];

  const renderOption = (option: OptionItem) => {
    if (option.adminOnly && !hasAdminPermission()) {
      return null;
    }

    return (
      <Pressable
        key={option.id}
        style={[
          styles.optionCard,
          option.isExit && styles.exitCard,
        ]}
        onPress={option.onPress}
      >
        <View style={styles.optionLeft}>
          <View style={[
            styles.optionIcon,
            option.isExit && styles.exitIcon,
          ]}>
            <Ionicons
              name={option.icon}
              size={20}
              color={option.isExit ? Colors.red[600] : Colors.blue[600]}
            />
          </View>
          <View style={styles.optionContent}>
            <Text style={[
              styles.optionLabel,
              option.isExit && styles.exitLabel,
            ]}>
              {option.title}
            </Text>
            <Text style={[
              styles.optionDescription,
              option.isExit && styles.exitDescription,
            ]}>
              {option.description}
            </Text>
          </View>
        </View>
        <View style={styles.optionArrow}>
          <AntDesign
            name="right"
            size={16}
            color={option.isExit ? Colors.red[500] : Colors.gray[500]}
            style={{ transform: [{ scaleY: 1.5 }] }}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <Header title="Configurações" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.options}>
          {options.map(renderOption)}
        </View>
      </ScrollView>
    </>
  );
}
