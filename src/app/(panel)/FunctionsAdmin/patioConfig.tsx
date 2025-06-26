import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import Separator from "@/src/components/Separator";
import { usePatioConfig } from "@/src/hooks/parkingLot/usePatioConfig";
import { styles } from "@/src/styles/functions/patioConfigStyle";
import { Text, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function PatioConfig() {
  const { spots, handleChange, handleSave } = usePatioConfig();

  return (
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

        <View style={styles.inputRow}>
          <Text style={styles.label}>Vagas Carros Grandes</Text>
          <TextInput
            keyboardType="numeric"
            value={spots.largeCar}
            onChangeText={(text) => handleChange("largeCar", text)}
            placeholder="0"
            style={styles.numericInput}
          />
        </View>
      </View>
          <View style={styles.button}>
            <PrimaryButton
              title="Salvar"
              style={styles.primaryButton}
              onPress={handleSave}
            />
          </View>
    </View>
  );
}
