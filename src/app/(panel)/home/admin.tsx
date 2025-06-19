import Colors from "@/src/constants/Colors";
import { styles } from "@/src/styles/home/adminHomeStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

export default function AdminHome() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
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

        <View style={styles.iconCircle}>
          <AntDesign name="user" size={30} color="#fff" />
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.cashData}>

        </View>

        <View style={styles.statusPatio}>

        </View>
      </View>
    </View>
  );
}
