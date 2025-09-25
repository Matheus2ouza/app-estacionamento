import Colors from '@/constants/Colors';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface CashClosedModalProps {
  visible?: boolean;
  onClose: () => void;
  onOpenCash?: () => void;
}

const CashClosedModal: React.FC<CashClosedModalProps> = ({
  visible = false,
  onClose,
  onOpenCash
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="cash-register"
              size={48}
              color={Colors.red[500]}
            />
          </View>
          
          <Text style={styles.title}>Caixa Fechado</Text>
          
          <Text style={styles.message}>
            O caixa está fechado no momento.{'\n'}
            Você pode continuar usando o sistema, mas pode ser que algumas funções não funcionem corretamente ou não estejam disponíveis.
          </Text>
          
          <View style={styles.buttonsContainer}>
            {onOpenCash && (
              <TouchableOpacity
                style={[styles.button, styles.openCashButton]}
                onPress={onOpenCash}
              >
                <Text style={styles.buttonText}>
                  Abrir Caixa
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>
                Não, obrigado
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay.medium,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.card.background,
    borderRadius: 12,
    padding: 24,
    width: Dimensions.get('window').width - 40,
    maxWidth: 400,
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: Colors.text.primary,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: Colors.button.danger,
  },
  openCashButton: {
    backgroundColor: Colors.button.primary,
  },
  buttonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CashClosedModal;
