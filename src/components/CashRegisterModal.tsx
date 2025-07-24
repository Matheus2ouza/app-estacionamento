import React, { useState, useEffect } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  mode: 'open' | 'close';
  onClose: () => void;
  onSubmitCashRegister: (value: string) => void;
  initialValue?: string;
};

const CashRegisterModal = ({
  visible,
  mode,
  onClose,
  onSubmitCashRegister,
  initialValue = '',
}: Props) => {
  const [cashValue, setCashValue] = useState('');

  useEffect(() => {
    if (visible) setCashValue(initialValue);
  }, [visible, initialValue]);

  const handleSubmit = () => {
    if (cashValue.trim()) {
      onSubmitCashRegister(cashValue);
    }
  };

  const isOpen = mode === 'open';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {isOpen ? 'Caixa não aberto' : 'Caixa em aberto'}
          </Text>
          <Text style={styles.message}>
            {isOpen ? 'Deseja abrir o caixa?' : 'Deseja fechar o caixa?'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={isOpen ? 'Valor inicial do caixa' : 'Valor final do caixa'}
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={cashValue}
            onChangeText={setCashValue}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, isOpen ? styles.confirmButton : styles.closeButton]}
              onPress={handleSubmit}
              disabled={!cashValue.trim()}
            >
              <Text style={styles.buttonText}>
                {isOpen ? 'Abrir caixa' : 'Fechar caixa'}
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  confirmButton: {
    backgroundColor: '#2ecc71',
  },
  closeButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CashRegisterModal;
