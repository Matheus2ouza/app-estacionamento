// Componente PopUp (sem mudanças exceto tempo do timer)
import Fontisto from '@expo/vector-icons/Fontisto';
import React, { useEffect } from "react";
import { BackHandler, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Colors from '../constants/Colors';

type PopUpProps = {
  message: string | null;
  visible: boolean;
  onClose: () => void;
};

export default function PopUp({ message, visible, onClose }: PopUpProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // fechar após 5 segundos

      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        onClose();
        return true;
      });

      return () => {
        clearTimeout(timer);
        backHandler.remove();
      };
    }
  }, [visible, onClose]);

  if (!message) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.popUp}>
              <View style={styles.popUpIcon}>
                <Fontisto name="like" size={130} color={Colors.white} />
              </View>
              <Text style={styles.popUpMessage}>{message}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  popUp: {
    width: '80%',
    height: "55%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 5
  },
  popUpIcon: {
    width: '70%',
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blueLogo,
    borderRadius: 150
  },
  popUpMessage: {
    marginTop: 10,
    fontFamily: "Montserrat_700Bold",
    fontSize: 25
  }
});
