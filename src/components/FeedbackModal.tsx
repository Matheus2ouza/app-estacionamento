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
}

const FeedbackModal = ({ visible, message, isSuccess = false, onClose }: FeedbackModalProps) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: Colors.success,
  },
  errorBackground: {
    backgroundColor: Colors.error,
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
