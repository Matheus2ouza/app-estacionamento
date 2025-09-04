import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { styles } from "@/src/styles/config/ConfigStyle";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Admin() {
  const { handleLogout } = useLogout();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Configurações" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.options}>
          <Pressable
            onPress={() => router.push("/functions/entreyRegister")}
          >
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Entrada</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable
            onPress={() => router.push("/functions/scanExit")}
          >
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Saída</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable onPress={() => router.push("/functions/inventory")}>
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Estoque</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
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
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable>
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Caixa</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable>
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Relatorio</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable
            onPress={() => router.push("/functions/methodPayment")}
          >
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Formas de Pagamento e Preços</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable onPress={() => router.push("/functionsAdmin/patioConfig")}>
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Configurações do Pátio</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable onPress={() => router.push("/functionsAdmin/accountInfo")}>
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Contas</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable onPress={() => router.push("/functions/history")}>
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Histórico</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable onPress={handleLogout}>
            <View style={styles.optionsRow}>
              <Text style={[styles.label, styles.exit]}>Sair</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.red[500]}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
