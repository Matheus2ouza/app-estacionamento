import Colors from '@/src/constants/Colors';
import { TypographyThemes } from '@/src/constants/Fonts';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EditInitialValueModalProps {
  visible: boolean;
  onClose: () => void;
  currentValue: number;
  onSave: (newValue: number) => void;
  loading?: boolean;
}

const EditInitialValueModal: React.FC<EditInitialValueModalProps> = ({
  visible,
  onClose,
  currentValue,
  onSave,
  loading = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  // Converter valor para número
  const parseDisplayValue = (value: string) => {
    if (value === '') return 0;
    const cleanValue = value.replace(',', '.');
    return parseFloat(cleanValue);
  };

  const handleInputChange = (text: string) => {
    // Remove caracteres não numéricos exceto vírgula
    const cleanValue = text.replace(/[^\d,]/g, '');
    setInputValue(cleanValue);
    setError('');
  };

  const handleSave = () => {
    const numericValue = parseDisplayValue(inputValue);
    
    if (numericValue <= 0) {
      setError('Por favor, insira um valor válido');
      return;
    }

    if (numericValue > 999999.99) {
      setError('Valor muito alto. Máximo permitido: R$ 999.999,99');
      return;
    }

    onSave(numericValue);
  };

  const handleClose = () => {
    setInputValue('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="cash-outline" size={24} color={Colors.blue.primary} />
            </View>
            <Text style={styles.title}>Editar Valor Inicial</Text>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <AntDesign name="close" size={20} color={Colors.gray[600]} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.description}>
              Digite o novo valor inicial para o caixa. Este valor será usado como base para calcular o lucro.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Valor Atual</Text>
              <View style={styles.currentValueContainer}>
                <Text style={styles.currentValue}>
                  R$ {currentValue.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Novo Valor</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={[styles.textInput, error && styles.textInputError]}
                  value={inputValue}
                  onChangeText={handleInputChange}
                  placeholder="0,00"
                  keyboardType="numeric"
                  maxLength={10}
                  autoFocus
                />
              </View>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color={Colors.red[500]} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.saveButtonText}>Salvando...</Text>
              ) : (
                <Text style={styles.saveButtonText}>Salvar</Text>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  iconContainer: {
    backgroundColor: Colors.blue[50],
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  title: {
    ...TypographyThemes.nunito.title,
    flex: 1,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  description: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    ...TypographyThemes.nunito.bodySmall,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentValueContainer: {
    backgroundColor: Colors.gray[50],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  currentValue: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySymbol: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.primary,
    fontWeight: '600',
    marginRight: 8,
  },
  textInput: {
    ...TypographyThemes.nunito.body,
    flex: 1,
    color: Colors.text.primary,
    fontSize: 16,
  },
  textInputError: {
    borderColor: Colors.red[500],
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    ...TypographyThemes.nunito.bodySmall,
    color: Colors.red[500],
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray[100],
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  cancelButtonText: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.blue.primary,
  },
  saveButtonText: {
    ...TypographyThemes.nunito.body,
    color: Colors.white,
    fontWeight: '600',
  },
});

export default EditInitialValueModal;
