import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/auth/useLogout";
import { styles } from "@/styles/config/ConfigStyle";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface OptionItem {
  id: string;
  title: string;
  description: string;
  icon: {
    name: string;
    library: 'Ionicons' | 'AntDesign' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Entypo' | 'SimpleLineIcons';
  };
  onPress: () => void;
  adminOnly?: boolean;
  isExit?: boolean;
}

export default function Admin() {
  const { handleLogout } = useLogout();
  const { hasAdminPermission } = useAuth();

  const renderIcon = (icon: OptionItem['icon'], color: string, size: number = 20) => {
    const iconProps = { name: icon.name as any, size, color };
    
    switch (icon.library) {
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      case 'AntDesign':
        return <AntDesign {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons {...iconProps} />;
      case 'Feather':
        return <Feather {...iconProps} />;
      case 'FontAwesome':
        return <FontAwesome {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      case 'Entypo':
        return <Entypo {...iconProps} />;
      case 'SimpleLineIcons':
        return <SimpleLineIcons {...iconProps} />;
      default:
        return <Ionicons name="help-outline" size={size} color={color} />;
    }
  };

  const options: OptionItem[] = [
    {
      id: "entrada",
      title: "Registrar entrada",
      description: "Registrar entrada de veículos",
      icon: { name: "car-outline", library: "Ionicons" },
      onPress: () => router.push("/functions/entreyRegister"),
    },
    {
      id: "saida-scan",
      title: "Registrar saída",
      description: "Registrar saída de veículos com leitor de código de barras",
      icon: { name: "exit-outline", library: "Ionicons" },
      onPress: () => router.push("/functions/scanExit"),
    },
    {
      id: "saida-manual",
      title: "Registrar saída manualmente",
      description: "Registrar saída de veículos manualmente",
      icon: { name: "exit-outline", library: "Ionicons" },
      onPress: () => router.push("/functions/listExit"),
    },
    {
      id: "saida-produto",
      title: "Registrar venda de produto",
      description: "Registrar venda de produtos manualmente",
      icon: { name: "shopping-cart", library: "Feather" },
      onPress: () => router.push("/functions/registerProductSale"),
    },
    {
      id: "parking",
      title: "Estacionamento",
      description: "Visualizar veículos no estacionamento e capacidade",
      icon: { name: "grid-outline", library: "Ionicons" },
      onPress: () => router.push("/functions/parking"),
    },
    {
      id: "estoque",
      title: "Estoque",
      description: "Visualizar e registrar produtos",
      icon: { name: "cube-outline", library: "Ionicons" },
      onPress: () => router.push("/functions/inventory"),
    },
    {
      id: "despesas",
      title: "Despesas",
      description: "Visualizar e registrar despesas",
      icon: { name: "receipt-outline", library: "Ionicons" },
      onPress: () => {router.push("/functions/ListExpense")},
    },
    {
      id: "caixa",
      title: "Caixa",
      description: "Gerenciar operações de caixa e financeiro",
      icon: { name: "wallet-outline", library: "Ionicons" },
      onPress: () => router.push("/(panel)/functionsAdmin/cash/CashScreen"),
      adminOnly: true,
    },
    {
      id: "relatorio",
      title: "Relatório",
      description: "Visualizar relatórios e estatísticas de entradas e saídas de veículos e produtos",
      icon: { name: "bar-chart-outline", library: "Ionicons" },
      onPress: () => router.push("/functionsAdmin/dashboard"),
      adminOnly: true,
    },
    {
      id: "pagamentos",
      title: "Formas de Cobrança",
      description: "Configurar métodos de cobrança",
      icon: { name: "card-outline", library: "Ionicons" },
      onPress: () => router.push("/functions/methodPayment"),
    },
    {
      id: "config-parking",
      title: "Configurações do Estacionamento",
      description: "Configurar vagas",
      icon: { name: "settings-outline", library: "Ionicons" },
      onPress: () => router.push("/functionsAdmin/parkingConfig"),
    },
    {
      id: "contas",
      title: "Contas",
      description: "Criar e gerenciar usuários e permissões",
      icon: { name: "people-outline", library: "Ionicons" },
      onPress: () => router.push("/functionsAdmin/accountInfo"),
      adminOnly: true,
    },
    {
      id: "historico",
      title: "Histórico",
      description: "Visualizar histórico de entradas e saídas de veículos e produtos",
      icon: { name: "time-outline", library: "Ionicons" },
      onPress: () => router.push("/functions/history"),
    },
    {
      id: "sair",
      title: "Sair",
      description: "Fazer logout do app",
      icon: { name: "log-out-outline", library: "Ionicons" },
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
            {renderIcon(
              option.icon,
              option.isExit ? Colors.red[600] : Colors.blue[600],
              20
            )}
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
