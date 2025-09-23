import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { styles } from '@/styles/functions/cash/settingStyles';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

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
}

export default function SettingsCash() {
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
      id: "config-metas",
      title: "Configurar metas",
      description: "Definir metas de faturamento e acompanhamento",
      icon: { name: "bar-chart-outline", library: "Ionicons" },
      onPress: () => router.push("/(panel)/functionsAdmin/goalsConfiguration"),
      adminOnly: true,
    },
    {
      id: "gerenciar-caixa",
      title: "Gerenciar caixa",
      description: "Gerenciar caixa atual",
      icon: { name: "settings", library: "MaterialIcons" },
      onPress: () => router.push("/(panel)/functionsAdmin/CashSettings"),
      adminOnly: true,
    },
    {
      id: "historico-caixa",
      title: "Historico dos caixas",
      description: "Historico dos caixas passados",
      icon: { name: "list-ol", library: "FontAwesome" },
      onPress: () => router.push("/(panel)/functionsAdmin/listCashHistory"),
      adminOnly: true,
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
        ]}
        onPress={option.onPress}
      >
        <View style={styles.optionLeft}>
          <View style={[
            styles.optionIcon,
          ]}>
            {renderIcon(
              option.icon,
              Colors.blue[600],
              20
            )}
          </View>
          <View style={styles.optionContent}>
            <Text style={[
              styles.optionLabel,
            ]}>
              {option.title}
            </Text>
            <Text style={[
              styles.optionDescription,
            ]}>
              {option.description}
            </Text>
          </View>
        </View>
        <View style={styles.optionArrow}>
          <AntDesign
            name="right"
            size={16}
            color={Colors.gray[500]}
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