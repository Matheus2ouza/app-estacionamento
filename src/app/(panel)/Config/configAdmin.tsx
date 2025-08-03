import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { styles } from "@/src/styles/config/ConfigStyle";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfigAdmin() {
  const { handleLogout } = useLogout();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Configurações" onBackPress={() => router.push('/home/admin')}/>
      <Image
        source={require("@/src/assets/images/splash-icon-blue.png")}
        style={styles.heroImage}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.options}>
          <Pressable
            onPress={() => {
              router.push("/Functions/entreyRegister");
            }}
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
            onPress={() => {
              router.push("/Functions/scanExit");
            }}
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

          <Pressable
            onPress={() => {
              router.push("/Functions/inventory");
            }}
          >
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

          <Pressable
            onPress={() => {
              router.push('/Functions/outgoingExpense')
            }}
          >
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

          <Pressable
            onPress={() => {
              router.push("/(panel)/FunctionsAdmin/(tabs)/cashPanel");
            }}
          >
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

          <Pressable
            onPress={() => router.push("/FunctionsAdmin/reports")}
          >
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Relatorios</Text>
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
            onPress={() => router.push("/FunctionsAdmin/methodPayment")}
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

          <Pressable onPress={() => router.push("/FunctionsAdmin/patioConfig")}>
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

          <Pressable onPress={() => router.push("/FunctionsAdmin/accountInfo")}>
            <View style={styles.optionsRow}>
              <Text style={styles.label}>Funcionarios</Text>
              <AntDesign
                name="right"
                size={24}
                color={Colors.blue.logo}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>
          
          <View style={styles.separator} />

          <Pressable onPress={() => router.push("/Functions/history")}>
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
                color={Colors.red[300]}
                style={{ transform: [{ scaleY: 1.5 }] }}
              />
            </View>
          </Pressable>

          <View style={styles.separator} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
