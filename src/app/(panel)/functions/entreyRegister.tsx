import FeedbackModal from "@/src/components/FeedbackModal";
import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import useRegisterVehicle from "@/src/hooks/vehicleFlow/useRegisterEntry";
import { styles } from "@/src/styles/functions/entreyStyle";
import React, { useEffect, useState } from "react";
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function EntreyRegister() {
  const [plate, setPlate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "carro" | "moto" | "carroGrande"
  >("carro");
  const { registerVehicle, loading, error, success, reset } =
    useRegisterVehicle();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(false);

  const handleRegister = async () => {
    const result = await registerVehicle(plate, selectedCategory);

    setModalMessage(result.message);
    setModalIsSuccess(result.success);
    setModalVisible(true);

    if (result.success) {
      setPlate("");
    }
  };

  useEffect(() => {
    if (error || success) reset();
  }, [plate]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <Header title="Entrada" />
        <View style={styles.container}>
          <View style={styles.formInputs}>
            <TextInput
              label="Placa"
              value={plate}
              style={styles.input}
              mode="outlined"
              autoCapitalize="characters"
              onChangeText={setPlate}
            />
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>Categoria do Veículo</Text>

              <View style={styles.categoryButtons}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === "carro" && styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory("carro")}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === "carro" &&
                        styles.categoryButtonTextSelected,
                    ]}
                  >
                    Carro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === "carroGrande" &&
                      styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory("carroGrande")}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === "carroGrande" &&
                        styles.categoryButtonTextSelected,
                    ]}
                  >
                    Carro Grande
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === "moto" &&
                      styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory("moto")}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === "moto" &&
                        styles.categoryButtonTextSelected,
                    ]}
                  >
                    Moto
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={loading ? "Registrando..." :"Confirmar Entrada"}
              onPress={handleRegister}
              style={styles.buttonConfirm}
            />
          </View>
        </View>

        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          isSuccess={modalIsSuccess}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
