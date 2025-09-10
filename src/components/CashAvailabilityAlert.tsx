import Colors from '@/src/constants/Colors';
import { Fonts } from '@/src/constants/Fonts';
import { CashStatus } from '@/src/types/cashTypes/cash';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export type AlertMode = 'blocking' | 'warning';

interface CashAvailabilityAlertProps {
  mode: AlertMode;
  cashStatus: CashStatus;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
  iconStyle?: TextStyle;
  onBackPress?: () => void;
  onClosePress?: () => void;
}

const CashAvailabilityAlert: React.FC<CashAvailabilityAlertProps> = ({
  mode,
  cashStatus,
  style,
  titleStyle,
  messageStyle,
  iconStyle,
  onBackPress,
  onClosePress,
}) => {
  // Shared Values para animações
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);
  const scaleAnim = useSharedValue(0.9);
  const pulseAnim = useSharedValue(1);
  const rotateAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);

  // Configuração do conteúdo baseado no status
  const getAlertConfig = () => {
    const isNotCreated = cashStatus === 'not_created';
    const isClosed = cashStatus === 'closed';

    if (mode === 'blocking') {
      if (isNotCreated) {
        return {
          icon: 'error-circle',
          iconColor: Colors.red[500],
          bgColor: Colors.red[50],
          borderColor: Colors.red[200],
          glowColor: Colors.red[100],
          title: 'Acesso Restrito',
          message: 'Esta funcionalidade requer um caixa ativo.',
          action: 'Crie um caixa para continuar.',
          iconLibrary: 'AntDesign',
        };
      } else if (isClosed) {
        return {
          icon: 'lock',
          iconColor: Colors.orange[500],
          bgColor: Colors.orange[50],
          borderColor: Colors.orange[200],
          glowColor: Colors.orange[100],
          title: 'Caixa Fechado',
          message: 'Esta funcionalidade requer um caixa aberto.',
          action: 'Reabra o caixa para continuar.',
          iconLibrary: 'AntDesign',
        };
      }
    } else if (mode === 'warning') {
      if (isNotCreated) {
        return {
          icon: 'warning',
          iconColor: Colors.yellow[600],
          bgColor: Colors.yellow[50],
          borderColor: Colors.yellow[200],
          glowColor: Colors.yellow[100],
          title: 'Funcionalidade Limitada',
          message: 'Algumas opções podem não estar disponíveis.',
          action: 'Crie um caixa para acesso completo.',
          iconLibrary: 'AntDesign',
        };
      } else if (isClosed) {
        return {
          icon: 'info-circle',
          iconColor: Colors.blue[500],
          bgColor: Colors.blue[50],
          borderColor: Colors.blue[200],
          glowColor: Colors.blue[100],
          title: 'Funcionalidade Limitada',
          message: 'Algumas opções podem não estar disponíveis.',
          action: 'Reabra o caixa para acesso completo.',
          iconLibrary: 'AntDesign',
        };
      }
    }

    return {
      icon: 'info-circle',
      iconColor: Colors.gray[500],
      bgColor: Colors.gray[50],
      borderColor: Colors.gray[200],
      glowColor: Colors.gray[100],
      title: 'Informação',
      message: 'Status não identificado.',
      action: '',
      iconLibrary: 'AntDesign' as const,
    };
  };

  const config = getAlertConfig();
  const screenWidth = Dimensions.get('window').width;

  // Animações de entrada
  useEffect(() => {
    // Animação principal de entrada
    fadeAnim.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    slideAnim.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.back(1.1)),
    });

    scaleAnim.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.05)),
    });

    // Animação de pulso contínua
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Efeito de brilho
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        withTiming(0, { duration: 2000, easing: Easing.linear })
      ),
      -1,
      false
    );
  }, [mode, cashStatus]);

  // Animação de rotação separada
  useEffect(() => {
    rotateAnim.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // Estilos animados
  const containerStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(glowAnim.value, [0, 1], [0.1, 0.3]);
    
    return {
      opacity: fadeAnim.value,
      transform: [
        { translateY: slideAnim.value },
        { scale: scaleAnim.value },
      ],
      shadowOpacity: 0.2 + glowOpacity,
    };
  });

  const iconStyle_animated = useAnimatedStyle(() => ({
    transform: [
      { scale: pulseAnim.value },
      { rotate: `${rotateAnim.value}deg` },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateX: slideAnim.value * 0.3 }],
  }));

  // Renderizar ícone
  const renderIcon = () => {
    return (
      <Animated.View style={[styles.iconContainer, iconStyle_animated]}>
        <View style={[styles.iconBackground, { backgroundColor: config.glowColor }]}>
          {config.iconLibrary === 'MaterialIcons' ? (
            <MaterialIcons
              name={config.icon as any}
              size={28}
              color={config.iconColor}
              style={iconStyle}
            />
          ) : (
            <AntDesign
              name={config.icon as any}
              size={28}
              color={config.iconColor}
              style={iconStyle}
            />
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          maxWidth: screenWidth - 32,
        },
        containerStyle,
        style,
      ]}
    >
      {/* Cabeçalho com ícone e título */}
      <View style={styles.header}>
        {renderIcon()}
        <Animated.View style={[styles.headerContent, textStyle]}>
          <Text style={[styles.title, { color: config.iconColor }, titleStyle]}>
            {config.title}
          </Text>
        </Animated.View>
      </View>
      
      {/* Conteúdo principal */}
      <Animated.View style={[styles.mainContent, textStyle]}>
        <Text style={[styles.message, messageStyle]}>
          {config.message}
        </Text>
        
        {config.action && (
          <View style={styles.actionContainer}>
            <View style={[styles.actionDot, { backgroundColor: config.iconColor }]} />
            <Text style={[styles.actionText, { color: config.iconColor }]}>
              {config.action}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Botões de ação */}
      <View style={styles.buttonsContainer}>
        {mode === 'blocking' && onBackPress && (
          <TouchableOpacity
            style={[styles.button, styles.backButton, { borderColor: config.iconColor }]}
            onPress={onBackPress}
          >
            <AntDesign name="arrowleft" size={16} color={config.iconColor} />
            <Text style={[styles.buttonText, { color: config.iconColor }]}>
              Voltar
            </Text>
          </TouchableOpacity>
        )}
        
        {mode === 'warning' && onClosePress && (
          <TouchableOpacity
            style={[styles.button, styles.closeButton, { backgroundColor: config.iconColor }]}
            onPress={onClosePress}
          >
            <AntDesign name="close" size={16} color={Colors.white} />
            <Text style={[styles.buttonText, styles.closeButtonText]}>
              Fechar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  mainContent: {
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.Roboto_700Bold,
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 8,
  },
  message: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  actionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  actionText: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    flex: 1,
  },
  buttonsContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 140,
    gap: 8,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  closeButton: {
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButtonText: {
    color: Colors.white,
  },
});

export default CashAvailabilityAlert;