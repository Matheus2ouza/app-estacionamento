import Colors from '@/src/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface FeedbackModalProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  dismissible?: boolean;
  // Props para navegação automática
  onBackPress?: () => void;
  autoNavigateOnSuccess?: boolean;
  navigateDelay?: number;
  timeClose?: number;
}

const FeedbackModal = ({ 
  visible, 
  message, 
  type = 'info', 
  onClose, 
  dismissible = true,
  onBackPress,
  autoNavigateOnSuccess = false,
  navigateDelay = 2000,
  timeClose
}: FeedbackModalProps) => {
  // Determina o tempo de fechamento baseado no tipo
  const getTimeClose = () => {
    if (timeClose) return timeClose;
    
    switch (type) {
      case 'success': return 3000;
      case 'error': return 5000;
      case 'warning': return 4000;
      case 'info': return 4000;
      default: return 4000;
    }
  };

  // Determina se deve navegar automaticamente
  const shouldAutoNavigate = type === 'success' && autoNavigateOnSuccess;

  // Determina o ícone baseado no tipo
  const getIcon = () => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  // Determina a cor de fundo baseada no tipo
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return Colors.status.success;
      case 'error': return Colors.status.error;
      case 'warning': return Colors.orange[500];
      case 'info': return Colors.blue.primary;
      default: return Colors.blue.primary;
    }
  };

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, getTimeClose());

      return () => clearTimeout(timer);
    }
  }, [visible, type]);

  // Efeito para navegação automática
  useEffect(() => {
    if (visible && onBackPress && shouldAutoNavigate) {
      const timer = setTimeout(() => {
        onBackPress();
        onClose();
      }, navigateDelay);

      return () => clearTimeout(timer);
    }
  }, [visible, shouldAutoNavigate, onBackPress, navigateDelay, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* TouchableWithoutFeedback só funciona se dismissible for true */}
      {dismissible ? (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[
                styles.modalView,
                { backgroundColor: getBackgroundColor() }
              ]}>
                <MaterialIcons
                  name={getIcon() as any}
                  size={40}
                  color="white"
                />
                <Text style={styles.modalText}>{message}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.centeredView}>
          <View style={[
            styles.modalView,
            { backgroundColor: getBackgroundColor() }
          ]}>
            <MaterialIcons
              name={getIcon() as any}
              size={40}
              color="white"
            />
            <Text style={styles.modalText}>{message}</Text>
          </View>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginVertical: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedbackModal;