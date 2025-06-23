import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { styles } from "@/src/styles/home/adminHomeStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export default function AdminHome() {
  const { role } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[Colors.zinc, Colors.blueLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.brandContainer}>
          <Text style={styles.brandMain}>LEÃO</Text>
          <Text style={styles.brandSub}>Estacionamento</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push("/Config/config");
          }}
        >
          <View style={styles.iconCircle}>
            <AntDesign name="user" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.cashData}>
          <View style={styles.cashDataHeader}>
            <Text style={styles.cashFont}>Caixa</Text>
            <View style={styles.refreshIcon}>
              <FontAwesome name="refresh" size={24} color={Colors.white} />
            </View>
          </View>

          <View style={styles.cashDataBody}>
            <View style={styles.cashDataRow}>
              <Text>Valor Inicial</Text>
              <Text style={styles.values}>R$: 999,99</Text>
            </View>
            <View style={styles.separatorBar} />
            <View style={styles.cashDataRow}>
              <Text>Dinheiro</Text>
              <Text style={styles.values}>R$: 999,99</Text>
            </View>
            <View style={styles.separatorBar} />
            <View style={styles.cashDataRow}>
              <Text>Cartão</Text>
              <Text style={styles.values}>R$: 999,99</Text>
            </View>
            <View style={styles.separatorBar} />
            <View style={styles.cashDataRow}>
              <Text>PIX</Text>
              <Text style={styles.values}>R$: 999,99</Text>
            </View>
            <View style={styles.separatorBar} />
            <View style={styles.cashDataRow}>
              <Text>Saída</Text>
              <Text style={styles.values}>R$: 999,99</Text>
            </View>
            <View style={styles.separatorBar} />
            <View style={styles.cashDataRow}>
              <Text>Total</Text>
              <Text style={styles.values}>R$: 999,99</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusPatio}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusFont}>Vagas</Text>
            <View style={styles.refreshIcon}>
              <FontAwesome name="refresh" size={24} color={Colors.white} />
            </View>
          </View>

          <View style={styles.statusBody}>
            <View style={styles.statusColumnFree}>
              <Text style={styles.statusNumberFree}>99</Text>
              <Text style={styles.statusLabelFree}>livres</Text>
            </View>

            <View style={styles.statusDivider} />

            <View style={styles.statusColumnClose}>
              <Text style={styles.statusNumberClose}>99</Text>
              <Text style={styles.statusLabelClose}>em uso</Text>

              <View style={styles.descriptionCloseRowHorizontal}>
                <View style={styles.iconDescriptionRow}>
                  <MaterialCommunityIcons
                    name="car-hatchback"
                    size={22}
                    color="black"
                  />
                  <Text style={styles.iconText}>99</Text>
                </View>

                <View style={styles.iconDescriptionRow}>
                  <FontAwesome name="motorcycle" size={18} color="black" />
                  <Text style={styles.iconText}>99</Text>
                </View>

                <View style={styles.iconDescriptionRow}>
                  <MaterialCommunityIcons
                    name="car-estate"
                    size={22}
                    color="black"
                  />
                  <Text style={styles.iconText}>99</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <LinearGradient
        colors={[Colors.zinc, Colors.blueLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.bottomBar}
      >
        <Pressable
          onPress={() => {
            router.push("/Functions/entreyRegister");
          }}
        >
          <View style={styles.buttonEntry}>
            <Entypo name="login" size={45} color={Colors.white} />
          </View>
        </Pressable>

        <Pressable
          onPress={() =>{
            router.push("/Functions/exitRegister")
          }}
        >
          <View style={styles.buttonExit}>
            <Entypo name="log-out" size={45} color={Colors.white} />
          </View>
        </Pressable>

        <View style={styles.buttonPatio}>
          <FontAwesome name="product-hunt" size={45} color={Colors.white} />
        </View>

        <View style={styles.buttonDashboard}>
          <Ionicons name="bar-chart" size={45} color={Colors.white} />
        </View>
      </LinearGradient>
    </View>
  );
}
