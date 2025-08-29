// MessageModal.tsx
import Colors from '@/src/constants/Colors';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Button {
  text: string;
  onPress: () => void;
}

interface MessageModalProps {
  visible?: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  buttons?: Button[];
  closeButtonText?: string;
}

const MessageModal: React.FC<MessageModalProps> = ({
  visible = false,
  onClose,
  message,
  title,
  buttons = [],
  closeButtonText = 'Fechar'
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
          
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}
          
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, styles.customButton]}
                onPress={button.onPress}
              >
                <Text style={[styles.buttonText, styles.customButtonText]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.closeButtonText]}>
                {closeButtonText}
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
  customButton: {
    backgroundColor: Colors.button.primary,
  },
  buttonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButtonText: {
    color: Colors.text.inverse,
  },
  customButtonText: {
    color: Colors.text.inverse,
  },
});

export default MessageModal;