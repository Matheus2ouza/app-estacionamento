import React from 'react';
import { Modal, StyleSheet, View, Text } from 'react-native';
import Colors from "@/src/constants/Colors";
import { PrimaryButton } from "@/src/components/PrimaryButton";

type CashAlertType = 'info' | 'block';

interface CashAlertModalProps {
  visible: boolean;
  type: CashAlertType;
  onClose: () => void;
  onConfirm?: () => void; // Opcional para o tipo 'info'
}

const CashAlertModal: React.FC<CashAlertModalProps> = ({
  visible,
  type,
  onClose,
  onConfirm,
}) => {
  const isBlocking = type === 'block';
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.title, isBlocking && styles.blockTitle]}>
              {isBlocking ? 'Acesso Bloqueado' : 'Caixa Fechado'}
            </Text>
            
            <Text style={styles.message}>
              {isBlocking 
                ? 'Este recurso necessita que o caixa esteja aberto.'
                : 'O caixa ainda não foi criado ou já foi fechado. Pode ser que alguns recursos não funcionem como esperado.'}
            </Text>
            
            <View style={styles.buttonContainer}>
              {isBlocking ? (
                <PrimaryButton
                  title="Voltar"
                  onPress={onClose}
                  style={styles.singleButton}
                />
              ) : (
                <>
                  {onConfirm && (
                    <PrimaryButton
                      title="Abrir Caixa"
                      onPress={onConfirm}
                      style={styles.actionButton}
                    />
                  )}
                  <PrimaryButton
                    title="OK"
                    onPress={onClose}
                    style={[styles.singleButton, !onConfirm && styles.standaloneButton]}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.red[600],
    textAlign: 'center',
  },
  blockTitle: {
    color: Colors.orange[500],
  },
  message: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 24,
    color: Colors.gray.zinc,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  singleButton: {
    width: 100,
  },
  standaloneButton: {
    alignSelf: 'flex-end',
  },
  actionButton: {
    marginRight: 10,
    width: 120,
  },
});

export default CashAlertModal;