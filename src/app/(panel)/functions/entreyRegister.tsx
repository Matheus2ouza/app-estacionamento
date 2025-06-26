// Componente EntreyRegister (ajustes para controlar o popup)
import Header from "@/src/components/Header";
import PopUp from "@/src/components/PopUp";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { styles } from "@/src/styles/functions/entreyStyle";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function EntreyRegister() {
  const [name, setName] = React.useState("");
  const [plate, setPlate] = React.useState("");
  const [selected, setSelected] = useState<string>("carro");

  // Estados para o popup
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const options = [
    { label: "Carro", value: "carro" },
    { label: "Carro Grande", value: "carro_grande" },
    { label: "Moto", value: "moto" },
  ];

  function handleLogin() {
    const data = {
      name: name,
      plate: plate,
      model: selected
    }

    console.log('dados', data);

    // Abrir popup com mensagem
    setPopupMessage("Registro Salvo");
    setPopupVisible(true);
  }

  function clear() {
    setPopupVisible(false);
    setPopupMessage(null);
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Entrada" />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
        <View>
          <View style={styles.formInputs}>
            <TextInput
              label="Nome"
              value={name}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              onChangeText={setName}
            />

            <TextInput
              label="Placa"
              value={plate}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              onChangeText={setPlate}
            />
          </View>

          <View style={styles.modelOptions}>
            <Text style={styles.optionLabel}>Categoria do Veiculo</Text>

            <View style={styles.modelOptionsRow}>
              {options.map((opt) => {
                const isSelected = selected === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setSelected(opt.value)}
                    style={[
                      styles.modelButton,
                      isSelected && styles.modelButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modelButtonText,
                        isSelected && styles.modelButtonTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton title="Confirmar Entrada" onPress={handleLogin} style={styles.buttonConfirm} />
        </View>
      </View>

      <PopUp visible={popupVisible} message={popupMessage} onClose={clear} />
    </View>
  );
}
