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
  isSuccess?: boolean;
  onClose: () => void;
  dismissible?: boolean;
  // Props para navegação automática
  onBackPress?: () => void;
  autoNavigateOnSuccess?: boolean;
  autoNavigateOnError?: boolean;
  navigateDelay?: number;
  timeClose?: number;
}

const FeedbackModal = ({ 
  visible, 
  message, 
  isSuccess = false, 
  onClose, 
  dismissible = true,
  onBackPress,
  autoNavigateOnSuccess = false,
  autoNavigateOnError = false,
  navigateDelay = 2000,
  timeClose = 5000
}: FeedbackModalProps) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, timeClose);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Efeito para navegação automática
  useEffect(() => {
    if (visible && onBackPress) {
      const shouldNavigate = (isSuccess && autoNavigateOnSuccess) || (!isSuccess && autoNavigateOnError);
      
      if (shouldNavigate) {
        const timer = setTimeout(() => {
          onBackPress();
          onClose();
        }, navigateDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, isSuccess, autoNavigateOnSuccess, autoNavigateOnError, onBackPress, navigateDelay, onClose]);

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
                isSuccess ? styles.successBackground : styles.errorBackground
              ]}>
                <MaterialIcons
                  name={isSuccess ? "check-circle" : "error"}
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
            isSuccess ? styles.successBackground : styles.errorBackground
          ]}>
            <MaterialIcons
              name={isSuccess ? "check-circle" : "error"}
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
  successBackground: {
    backgroundColor: Colors.status.success,
  },
  errorBackground: {
    backgroundColor: Colors.status.error,
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