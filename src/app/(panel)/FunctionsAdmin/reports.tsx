import Header from "@/src/components/Header";
import { View, Text, StyleSheet } from "react-native";
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  BounceIn,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence
} from "react-native-reanimated";
import { useEffect } from "react";
import Colors from "@/src/constants/Colors";

export default function Reports() {
  // Animação de pulsação para o ícone
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease })
      ),
      -1, // Repetir infinitamente
      true // Reverter a animação
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header title="Relatórios" />
      
      <View style={styles.container}>
        {/* Card animado com entrada suave */}
        <Animated.View 
          style={[styles.card, styles.shadow]}
          entering={FadeIn.duration(800)}
        >
          <Animated.Text 
            style={styles.cardTitle}
            entering={FadeInDown.duration(1000).delay(200)}
          >
            Relatórios Financeiros
          </Animated.Text>
          
          <Animated.View 
            style={[styles.iconContainer, animatedStyle]}
            entering={BounceIn.duration(1500).delay(400)}
          >
            <Text style={styles.icon}>📊</Text>
          </Animated.View>
          
          <Animated.Text 
            style={styles.cardText}
            entering={FadeInUp.duration(1000).delay(600)}
          >
            Em breve você terá acesso a relatórios completos e análises detalhadas.
          </Animated.Text>
        </Animated.View>
        
        {/* Mensagem animada */}
        <Animated.Text 
          style={styles.comingSoon}
          entering={SlideInDown.duration(1200).delay(800)}
        >
          Novidades em desenvolvimento!
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  shadow: {
    shadowColor: Colors.gray.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.blue.dark,
    marginBottom: 16,
  },
  iconContainer: {
    marginVertical: 20,
  },
  icon: {
    fontSize: 60,
  },
  cardText: {
    fontSize: 16,
    color: Colors.gray.dark,
    textAlign: 'center',
    lineHeight: 24,
  },
  comingSoon: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blue.dark,
    textAlign: 'center',
  },
});