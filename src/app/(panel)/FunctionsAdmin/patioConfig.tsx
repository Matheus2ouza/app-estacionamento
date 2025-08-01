import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import Separator from "@/src/components/Separator";
import { usePatioConfig } from "@/src/hooks/parking/usePatioConfig";
import { styles } from "@/src/styles/functions/patioConfigStyle";
import { ActivityIndicator, Keyboard, Text, TouchableWithoutFeedback, View, Image } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "@/src/constants/Colors";

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue.logo} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.screenContainer}>
        <Image
          source={require("@/src/assets/images/splash-icon-blue.png")}
          style={styles.heroImage}
        />
        <Header title="Configurações do Pátio" />
        
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Quantidade de vagas</Text>
            <Separator />
            
            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vagas para Carros</Text>
                <TextInput
                  mode="outlined"
                  keyboardType="numeric"
                  value={spots.car}
                  onChangeText={(text) => handleChange("car", text)}
                  placeholder="0"
                  style={styles.input}
                  outlineColor={Colors.gray.light}
                  activeOutlineColor={Colors.blue.logo}
                  theme={{ roundness: 8 }}
                  disabled={loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vagas para Motos</Text>
                <TextInput
                  mode="outlined"
                  keyboardType="numeric"
                  value={spots.motorcycle}
                  onChangeText={(text) => handleChange("motorcycle", text)}
                  placeholder="0"
                  style={styles.input}
                  outlineColor={Colors.gray.light}
                  activeOutlineColor={Colors.blue.logo}
                  theme={{ roundness: 8 }}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title={loading ? "Salvando..." : "Salvar Configurações"}
            style={styles.saveButton}
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