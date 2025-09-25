import { Slot } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfigLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../assets/images/splash-icon-blue.png")}
        style={styles.heroImage}
      />
      
      <Slot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: {
    position: "absolute",
    top: 80,
    right: -270,
    width: "130%",
    height: "95%",
    transform: [{ scaleX: -1 }],
    resizeMode: "cover",
    opacity: 0.1,
    zIndex: -1,
  },
});