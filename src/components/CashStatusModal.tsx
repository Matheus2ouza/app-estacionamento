import React from 'react';
import { Modal, StyleSheet, View, Text } from 'react-native';
import Colors from "@/src/constants/Colors";
import { PrimaryButton } from "@/src/components/PrimaryButton";

interface CashStatusModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CashStatusModal: React.FC<CashStatusModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Overlay que cobre toda a tela, exceto o header */}
      <View style={styles.overlay}>
        
        {/* Conteúdo do modal */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Caixa Fechado</Text>
            <Text style={styles.message}>
              O caixa ainda não foi criado ou já foi fehcado. 
              Pode ser que alguns recursos não funcionem como esperado.
              Deseja reabrir o caixa?
            </Text>
            
            <View style={styles.buttonGroup}>
              <PrimaryButton
                title="Não"
                onPress={onClose}
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
              />
              <PrimaryButton
                title="Sim"
                onPress={onConfirm}
                style={styles.confirmButton}
              />
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
  message: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 24,
    color: Colors.gray.zinc,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray.zinc,
  },
  cancelButtonText: {
    color: Colors.gray.zinc,
  },
  confirmButton: {
    flex: 1,
  },
});

export default CashStatusModal;