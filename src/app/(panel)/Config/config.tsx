import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { styles } from "@/src/styles/config/ConfigStyle";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Config() {
    const { handleLogout } = useLogout();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Configurações" />

      <View style={styles.options}>

        <Pressable onPress={() => {
          router.push("/Functions/history")
        }}>
          <View style={styles.optionsRow}>
            <Text style={styles.label}>Histórico</Text>
            <AntDesign
              name="right"
              size={24}
              color={Colors.blueLogo}
              style={{ transform: [{ scaleY: 1.5 }] }}
            />
          </View>
        </Pressable>
        <View style={styles.separator} />

        <Pressable>
          <View style={styles.optionsRow}>
            <Text style={styles.label}>Despesas</Text>
            <AntDesign
              name="right"
              size={24}
              color={Colors.blueLogo}
              style={{ transform: [{ scaleY: 1.5 }] }}
            />
          </View>
        </Pressable>
        <View style={styles.separator} />

        <Pressable onPress={handleLogout}>
          <View style={styles.optionsRow}>
            <Text style={styles.label}>Sair</Text>
            <AntDesign
              name="right"
              size={24}
              color={Colors.blueLogo}
              style={{ transform: [{ scaleY: 1.5 }] }}
            />
          </View>
        </Pressable>
        <View style={styles.separator} />

      </View>
    </SafeAreaView>
  );
}
