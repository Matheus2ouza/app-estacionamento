import { View, StyleSheet, Dimensions } from "react-native";
import Colors from "@/src/constants/Colors";
import Header from "@/src/components/Header";
import { router } from "expo-router";
import Animated, { 
  FadeIn,
  FadeInUp,
  BounceIn,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing
} from "react-native-reanimated";
import { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function GraphicsData() {
  // Animação de pulsação para o ícone
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease })
      ),
      -1,
      true
    );
    
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.ease }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header
        title="Gráficos de Previsão"
        onBackPress={() => router.push("/Config/configAdmin")}
      />
      
      <View style={styles.container}>
        {/* Ícone animado */}
        <Animated.View 
          style={[styles.iconContainer, animatedStyle]}
          entering={BounceIn.duration(1500)}
        >
          <AntDesign name="tool" size={60} color={Colors.blue.dark} />
        </Animated.View>
        
        {/* Título animado */}
        <Animated.Text 
          style={styles.title}
          entering={FadeInUp.duration(800).delay(300)}
        >
          🔧 Em Manutenção
        </Animated.Text>
        
        {/* Mensagens animadas */}
        <Animated.Text 
          style={styles.message}
          entering={FadeInUp.duration(800).delay(500)}
        >
          Estamos trabalhando para melhorar esta funcionalidade.
        </Animated.Text>
        
        <Animated.Text 
          style={styles.message}
          entering={FadeInUp.duration(800).delay(700)}
        >
          Volte em breve para conferir as novidades!
        </Animated.Text>
        
        {/* Barra de progresso animada */}
        <Animated.View 
          style={styles.progressContainer}
          entering={SlideInDown.duration(1000).delay(900)}
        >
          <Animated.View 
            style={[styles.progressBar, useAnimatedStyle(() => ({
              width: withRepeat(
                withTiming(width * 0.6, { duration: 2000 }),
                -1,
                true
              )
            }))]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.white,
  },
  iconContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: Colors.gray[100],
    borderRadius: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.blue.dark,
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.gray.dark,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 24,
    maxWidth: '80%',
  },
  progressContainer: {
    height: 6,
    width: '80%',
    backgroundColor: Colors.gray[200],
    borderRadius: 3,
    marginTop: 40,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.blue.dark,
    borderRadius: 3,
  },
});