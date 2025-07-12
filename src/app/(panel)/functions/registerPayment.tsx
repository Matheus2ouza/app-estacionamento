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
import DropDown from "react-native-paper-dropdown";

const PAYMENT_OPTIONS = [
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "PIX", value: "PIX" },
  { label: "Crédito", value: "Credito" },
  { label: "Débito", value: "Debito" },
];

export default function RegisterPayment() {
  const [paymentType, setPaymentType] = useState<string>();
  const [showDropDown, setShowDropDown] = useState(false);
  const [amount, setAmount] = useState("");

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
              <View style={styles.data}>
                {/* Primeira Coluna */}
                <View style={styles.column}>
                  <View style={styles.dataItem}>
                    <Text style={styles.informationTitle}>Nome</Text>
                    <Text style={styles.informationValue}>Matheus Furtado</Text>
                  </View>

                  <View style={styles.dataItem}>
                    <Text style={styles.informationTitle}>Data Entrada</Text>
                    <Text style={styles.informationValue}>23/06/2025</Text>
                  </View>

                  <View style={styles.dataItem}>
                    <Text style={styles.informationTitle}>Total</Text>
                    <Text style={styles.informationValue}>R$: 25,00</Text>
                  </View>

                  <View style={[styles.dataItem, {marginTop: 5}]}>
                    <Text style={styles.informationTitle}>Valor Pago</Text>
                    <TextInput
                      mode="outlined"
                      placeholder="Digite o valor"
                      keyboardType="numeric"
                      style={[styles.input, {marginTop: 3}]}
                      value={amount}
                      onChangeText={setAmount}
                      outlineColor="#E0E0E0"
                      activeOutlineColor="#3F51B5"
                    />
                  </View>
                </View>

                {/* Segunda Coluna */}
                <View style={styles.column}>
                  <View style={styles.dataItem}>
                    <Text style={styles.informationTitle}>Placa</Text>
                    <Text style={styles.informationValue}>LSN 4L49</Text>
                  </View>

                  <View style={styles.dataItem}>
                    <Text style={styles.informationTitle}>Permanência</Text>
                    <Text style={styles.informationValue}>02:25:16</Text>
                  </View>

                  <View style={styles.dataItem}>
                    <Text style={styles.informationTitle}>Troco</Text>
                    <Text style={styles.informationValue}>R$: 5,00</Text>
                  </View>

                  <View style={styles.dataItem}>
                    <Text style={styles.informationTitle}>Tipo de Pagamento</Text>
                    <DropDown
                      label={"Selecione o tipo"}
                      mode={"outlined"}
                      visible={showDropDown}
                      showDropDown={() => setShowDropDown(true)}
                      onDismiss={() => setShowDropDown(false)}
                      value={paymentType}
                      setValue={setPaymentType}
                      list={PAYMENT_OPTIONS}
                      inputProps={{
                        style: styles.input,
                        outlineColor: "#E0E0E0",
                        activeOutlineColor: "#3F51B5",
                      }}
                      dropDownStyle={styles.dropDown}
                      dropDownItemStyle={styles.dropDownItem}
                      dropDownItemTextStyle={styles.dropDownItemText}
                      dropDownItemSelectedTextStyle={
                        styles.dropDownItemSelectedText
                      }
                      dropDownItemSelectedStyle={styles.dropDownItemSelected}
                    />
                  </View>
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