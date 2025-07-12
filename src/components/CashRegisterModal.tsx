import { useLogout } from '@/src/hooks/auth/useLogout'; // Importe o hook de logout
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  role: String | null;
  onClose: () => void;
  onOpenCashRegister: (initialValue: string) => void;
};

const CashRegisterModal = ({ visible, role, onClose, onOpenCashRegister }: Props) => {
  const [initialValue, setInitialValue] = useState('');
  const { handleLogout } = useLogout(); // Obtenha a função de logout

  const handleOpenCash = () => {
    if (initialValue.trim()) {
      onOpenCashRegister(initialValue);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={role === 'ADMIN' ? onClose : () => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {role === 'ADMIN' ? (
            <>
              <Text style={styles.title}>Caixa não aberto</Text>
              <Text style={styles.message}>Deseja abrir o caixa?</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Valor inicial do caixa"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={initialValue}
                onChangeText={setInitialValue}
              />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Não abrir</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.confirmButton]} 
                  onPress={handleOpenCash}
                  disabled={!initialValue.trim()}
                >
                  <Text style={styles.buttonText}>Abrir caixa</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Caixa não aberto</Text>
              <Text style={styles.message}>
                Entre em contato com o administrador para que ele possa abrir o caixa.
              </Text>
              
              {/* Botão de logout para não-ADMIN */}
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Sair</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db', // Cor diferente para o botão de logout
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CashRegisterModal;