import Colors from '@/src/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface FeedbackModalProps {
  visible: boolean;
  message: string;
  isSuccess?: boolean;
  onClose: () => void;
  shouldGoBack?: boolean;
}

const FeedbackModal = ({
  visible,
  message,
  isSuccess = false,
  onClose,
  shouldGoBack = false,
}: FeedbackModalProps) => {
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (shouldGoBack) {
          router.back();
        } else {
          onClose();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible, shouldGoBack]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            isSuccess ? styles.successBackground : styles.errorBackground,
          ]}
        >
          <MaterialIcons
            name={isSuccess ? 'check-circle' : 'error'}
            size={40}
            color="white"
          />
          <Text style={styles.modalText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray.alpha,
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
