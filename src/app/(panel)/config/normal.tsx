import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
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
  isExit?: boolean;
}

export default function Normal() {
  const { handleLogout } = useLogout();

  const options: OptionItem[] = [
    {
      id: "historico",
      title: "Histórico",
      description: "Visualizar histórico de operações",
      icon: "time-outline",
      onPress: () => router.push("/functions/history"),
    },
    {
      id: "pagamentos",
      title: "Formas de Cobrança",
      description: "Visualizar métodos de cobrança",
      icon: "card-outline",
      onPress: () => router.push("/functions/methodPayment"),
    },
    {
      id: "despesas",
      title: "Despesas",
      description: "Visualizar e registrar despesas",
      icon: "receipt-outline",
      onPress: () => {},
    },
    {
      id: "estoque",
      title: "Estoque",
      description: "Visualizar produtos",
      icon: "cube-outline",
      onPress: () => router.push("/functions/inventory"),
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
