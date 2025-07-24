import React, { useEffect, useRef } from "react";
import {
  View,
  Modal,
  Animated,
  StyleSheet,
  Easing,
  Text,
} from "react-native";
import Colors from "../constants/Colors";

interface LoadingSpinnerProps {
  visible: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ visible, text }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, []);

  const spinInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const bars = Array.from({ length: 12 });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {text && <Text style={styles.text}>{text}</Text>}
          <Animated.View
            style={[styles.spinner, { transform: [{ rotate: spinInterpolate }] }]}
          >
            {bars.map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180; // 360 / 12 = 30 graus
              const x = Math.sin(angle) * 20;
              const y = -Math.cos(angle) * 20;
              return (
                <View
                  key={i}
                  style={[
                    styles.bar,
                    {
                      opacity: (i + 1) / bars.length,
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: `${i * 30}deg` },
                      ],
                    },
                  ]}
                />
              );
            })}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 12,
    width: '70%',
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.blueLogo,
    textTransform: 'uppercase',
    marginBottom: 20,
    textAlign: "center",
  },
  spinner: {
    width: 50,
    height: 50,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    position: "absolute",
    width: 6,
    height: 18,
    borderRadius: 3,
    backgroundColor: "#0078D7",
  },
});

export default LoadingSpinner;
