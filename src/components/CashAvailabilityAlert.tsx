import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { CashStatus } from '@/types/cashTypes/cash';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
 

export type AlertMode = 'blocking' | 'warning';

interface CashAvailabilityAlertProps {
  mode: AlertMode;
  cashStatus: CashStatus;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
  iconStyle?: TextStyle;
  onClosePress?: () => void; // Apenas para warning mode
  overlay?: boolean; // Renderiza centralizado acima de tudo
}

const CashAvailabilityAlert: React.FC<CashAvailabilityAlertProps> = ({
  mode,
  cashStatus,
  style,
  titleStyle,
  messageStyle,
  iconStyle,
  onClosePress,
  overlay = false,
}) => {
  // Funções internas para os botões
  const handleBackPress = () => {
    router.back();
  };

  const handleOpenCashPress = () => {
    router.push('/functionsAdmin/CashSettings');
  };

  // Configuração fixa baseada apenas no modo
  const getAlertConfig = () => {
    if (mode === 'blocking') {
      return {
        icon: 'closecircleo',
        iconColor: Colors.red[500],
        bgColor: Colors.red[50],
        borderColor: Colors.red[200],
        glowColor: Colors.red[100],
        title: 'Acesso Restrito',
        message: 'Esta funcionalidade requer um caixa aberto.',
        iconLibrary: 'AntDesign' as const,
      };
    }
    // warning
    return {
      icon: 'exclamationcircleo',
      iconColor: Colors.blue[500],
      bgColor: Colors.blue[50],
      borderColor: Colors.blue[200],
      glowColor: Colors.blue[100],
      title: 'Aviso',
      message: 'O caixa já foi fechado. Você pode continuar usando o sistema normalmente, mas recomendamos abrir o caixa novamente para não ocorrer erros inesperados.',
    };
  };

  const config = getAlertConfig();
  const screenWidth = Dimensions.get('window').width;

  // Sem animações

  // Renderizar ícone
  const renderIcon = () => {
    return (
      <View style={[styles.iconContainer]}>
        <View style={[styles.iconBackground, { backgroundColor: config.glowColor }]}>
          <AntDesign
            name={config.icon as any}
            size={28}
            color={config.iconColor}
            style={iconStyle}
          />
        </View>
      </View>
    );
  };

  const Card = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          maxWidth: screenWidth - 32,
        },
        style,
      ]}
    >
      {/* Cabeçalho com ícone e título */}
      <View style={styles.header}>
        {renderIcon()}
        <View style={[styles.headerContent]}>
          <Text style={[styles.title, { color: config.iconColor }, titleStyle]}>
            {config.title}
          </Text>
        </View>
      </View>
      
      {/* Conteúdo principal */}
      <View style={[styles.mainContent]}>
        <Text style={[styles.message, messageStyle]}>
          {config.message}
        </Text>
      </View>

      {/* Botões de ação */}
      {mode === 'warning' ? (
        <View style={[styles.buttonsContainer, { justifyContent: 'center' }]}>
          <TouchableOpacity
            style={[styles.button, styles.closeButton, { backgroundColor: config.iconColor }]}
            onPress={() => onClosePress && onClosePress()}
          >
            <Text style={[styles.buttonText, styles.closeButtonText]}>OK</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.buttonsContainer, { justifyContent: 'center' }] }>
          <TouchableOpacity
            style={[styles.button, styles.backButton, { borderColor: config.iconColor }]}
            onPress={handleBackPress}
          >
            <AntDesign name="arrowleft" size={16} color={config.iconColor} />
            <Text style={[styles.buttonText, { color: config.iconColor }] }>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: config.iconColor },
            ]}
            onPress={handleOpenCashPress}
          >
            <AntDesign name="setting" size={16} color={Colors.white} />
            <Text style={[styles.buttonText, styles.primaryButtonText]}>Abrir o caixa</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (!overlay) {
    return Card;
  }

  return (
    <View style={styles.overlayRoot} pointerEvents="box-none">
      <View style={styles.overlayBackdrop} />
      <View style={styles.overlayCenter} pointerEvents="box-none">
        {Card}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  overlayRoot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  overlayBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  overlayCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  mainContent: {
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.Roboto_700Bold,
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 4,
  },
  message: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
    gap: 8,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  closeButton: {
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 5,
  },
  primaryButton: {
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 5,
  },
  buttonText: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  closeButtonText: {
    color: Colors.white,
  },
  primaryButtonText: {
    color: Colors.white,
  },
});

export default CashAvailabilityAlert;