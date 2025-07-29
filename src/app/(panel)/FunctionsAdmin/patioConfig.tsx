import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import Separator from "@/src/components/Separator";
import { usePatioConfig } from "@/src/hooks/parking/usePatioConfig";
import { styles } from "@/src/styles/functions/patioConfigStyle";
import { ActivityIndicator, Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function PatioConfig() {
  const {
    spots,
    loading,
    handleChange,
    handleSave,
    modalVisible,
    modalMessage,
    modalIsSuccess,
    closeModal,
  } = usePatioConfig();

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <Header title="Configurações do Pátio" titleStyle={styles.header} />

        <View style={styles.container}>
          <Text style={styles.title}>Quantidade de vagas</Text>
          <Separator />

          <View style={styles.inputRow}>
            <Text style={styles.label}>Vagas Carros</Text>
            <TextInput
              keyboardType="numeric"
              value={spots.car}
              onChangeText={(text) => handleChange("car", text)}
              placeholder="0"
              style={styles.numericInput}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Vagas Motos</Text>
            <TextInput
              keyboardType="numeric"
              value={spots.motorcycle}
              onChangeText={(text) => handleChange("motorcycle", text)}
              placeholder="0"
              style={styles.numericInput}
            />
          </View>
        </View>

        <View style={styles.button}>
          <PrimaryButton
            title={loading ? "Atualizando.." : "Salvar"}
            style={styles.primaryButton}
            onPress={handleSave}
            disabled={loading}
          />
        </View>

        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          isSuccess={modalIsSuccess}
          onClose={closeModal}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

