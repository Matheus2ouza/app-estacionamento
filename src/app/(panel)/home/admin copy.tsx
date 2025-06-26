import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { styles } from "@/src/styles/home/adminHomeStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
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
          onPress={() => {
            router.push("/Functions/exitRegister");
          }}
        >
          <View style={styles.buttonExit}>
            <Entypo name="log-out" size={45} color={Colors.white} />
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            router.push("/Functions/patio");
          }}
        >
          <View style={styles.buttonPatio}>
            <FontAwesome name="product-hunt" size={45} color={Colors.white} />
          </View>
        </Pressable>
        <Pressable
          onPress={() =>{
            router.push("/FunctionsAdmin/dashboard")
          }}
        >
          <View style={styles.buttonDashboard}>
            <Ionicons name="bar-chart" size={45} color={Colors.white} />
          </View>
        </Pressable>
      </LinearGradient>
      </View>
    </View>
  );
}
