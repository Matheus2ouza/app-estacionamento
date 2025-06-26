import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { styles } from "@/src/styles/functions/registerPayment";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Provider as PaperProvider, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

const PAYMENT_OPTIONS = [
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "PIX", value: "PIX" },
  { label: "Crédito", value: "Credito" },
  { label: "Débito", value: "Debito" },
];

export default function RegisterPayment() {
  const [gender, setGender] = useState<string>();

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <Header title="Pagamento" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={[styles.data, { zIndex: 500 }]}>
                <View style={styles.dataColumn}>
                  <Text style={styles.informationTitle}>Nome</Text>
                  <Text style={styles.informationValue}>Matheus Furtado</Text>
                </View>

                <View style={styles.dataColumn}>
                  <Text style={styles.informationTitle}>Placa</Text>
                  <Text style={styles.informationValue}>LSN 4L49</Text>
                </View>

                <View style={styles.dataColumn}>
                  <Text style={styles.informationTitle}>Data Entrada</Text>
                  <Text style={styles.informationValue}>23/06/2025</Text>
                </View>

                <View style={styles.dataColumn}>
                  <Text style={styles.informationTitle}>Permanência</Text>
                  <Text style={styles.informationValue}>02:25:16</Text>
                </View>

                <View style={styles.dataColumn}>
                  <Text style={styles.informationTitle}>Total</Text>
                  <Text style={styles.informationValue}>R$: 25,00</Text>
                </View>

                <View style={styles.dataColumn}>
                  <Text style={styles.informationTitle}>Troco</Text>
                  <Text style={styles.informationValue}>R$: 5,00</Text>
                </View>

                <View style={styles.dataColumn}>
                  <Text style={styles.informationTitle}>Valor Pago</Text>
                  <TextInput
                    mode="flat"
                    placeholder="Digite o valor"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                <View style={styles.dataColumn}>
                  <Text style={styles.informationTitle}>
                    Tipos de Pagamento
                  </Text>
                  <Dropdown
                    mode="outlined"
                    options={PAYMENT_OPTIONS}
                    value={gender}
                    onSelect={setGender}
                    hideMenuHeader={true}
                    menuContentStyle={styles.menu}
                  />
                </View>
              </View>
              <PrimaryButton
                title="Registrar Pagamento"
                onPress={() => router.push}
                style={styles.Button}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </PaperProvider>
  );
}
