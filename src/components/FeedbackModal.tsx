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
  goToRoute?: string; // <- nova prop
}

const FeedbackModal = ({
  visible,
  message,
  isSuccess = false,
  onClose,
  shouldGoBack = false,
  goToRoute,
}: FeedbackModalProps) => {
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (goToRoute) {
          router.replace(goToRoute as never); // redireciona para a rota informada
        } else if (shouldGoBack) {
          router.back(); // comportamento anterior
        } else {
          onClose(); // fecha normalmente
        }
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible, shouldGoBack, goToRoute]);

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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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


/**
 * FeedbackModal é um componente React Native que exibe uma modal para mostrar
 * mensagens de feedback para o usuário, indicando sucesso ou erro.
 * 
 * Funcionalidades:
 * - Aparece quando a prop `visible` é true.
 * - Mostra uma mensagem e um ícone (check ou erro) baseado em `isSuccess`.
 * - Fecha automaticamente após 5 segundos, podendo:
 *    - Redirecionar para uma rota específica (`goToRoute`),
 *    - Voltar para a página anterior (`shouldGoBack`),
 *    - Ou apenas fechar o modal (`onClose`).
 * 
 * Exemplos de uso:
 * 
 * 1) Fechar modal normalmente (sem redirecionar nem voltar):
 * <FeedbackModal
 *   visible={modalVisible}
 *   message="Operação realizada!"
 *   isSuccess={true}
 *   onClose={() => setModalVisible(false)}
 * />
 * 
 * 2) Voltar para a página anterior após fechar:
 * <FeedbackModal
 *   visible={modalVisible}
 *   message="Operação concluída, retornando..."
 *   isSuccess={true}
 *   shouldGoBack={true}
 *   onClose={() => setModalVisible(false)}
 * />
 * 
 * 3) Redirecionar para uma rota específica após fechar:
 * <FeedbackModal
 *   visible={modalVisible}
 *   message="Operação feita! Indo para Home..."
 *   isSuccess={true}
 *   goToRoute="/home"
 *   onClose={() => setModalVisible(false)}
 * />
 */
