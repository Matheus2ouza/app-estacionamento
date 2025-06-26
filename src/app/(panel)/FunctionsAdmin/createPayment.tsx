import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { METHODS } from "@/src/constants/BillingMethods";
import { usePaymentConfig } from "@/src/hooks/cash/usePaymentConfig";
import { styles } from "@/src/styles/functions/createPaymentStyle";
import { BillingMethod } from "@/src/types/cash";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";

const VEHICLE_TYPES = [
  { key: "car", label: "Carro" },
  { key: "motorcycle", label: "Moto" },
  { key: "largeCar", label: "Carro Grande" },
];

export default function CreatePayment() {
  const [methodValue, setMethodValue] = useState<string | undefined>("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const { buildConfig, saveConfig, restoreConfig } = usePaymentConfig();

  useEffect(() => {
    restoreConfig(setMethodValue, setInputValues)
  }, []);

  const selectedMethod: BillingMethod | undefined = METHODS.find(
    (method) => method.value === methodValue
  );

  const extraInput = selectedMethod?.extraInput ?? null;

  const handleInputChange = (
    vehicleKey: string,
    inputKey: string,
    value: string
  ) => {
    setInputValues((prev) => ({
      ...prev,
      [`${vehicleKey}_${inputKey}`]: value,
    }));
  };

  const handleSave = () => {
    if (!selectedMethod) return;

    const config = buildConfig(selectedMethod, inputValues);
    saveConfig(config);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <Header title="Forma de Cobrança e Preços" titleStyle={styles.header} />

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.dropdownWrapper}>
            <DropDown
              label="Método de cobrança"
              mode="outlined"
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={methodValue}
              setValue={setMethodValue}
              list={METHODS}
              inputProps={{
                style: { backgroundColor: "white" },
                outlineColor: "#ccc",
                activeOutlineColor: "#ccc",
              }}
            />
          </View>

          {selectedMethod && (
            <View style={styles.inputsWrapper}>
              <Text style={styles.description}>
                {selectedMethod.description}
              </Text>
              <View style={styles.separator} />

              <View style={styles.extraInputWrapper}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.extraInputLabel}>Tolerância</Text>

                  <TextInput
                    keyboardType="numeric"
                    value={inputValues["global_tolerancia"] || ""}
                    onChangeText={(text) =>
                      handleInputChange("global", "tolerancia", text)
                    }
                    placeholder={selectedMethod.tolerance.placeholder}
                    style={styles.toleranceInput}
                  />

                  <Text style={styles.extraInputLabel}>minuto(s)</Text>
                </View>

                {extraInput && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.extraInputLabel}>
                      {extraInput.label}
                    </Text>

                    <TextInput
                      keyboardType="numeric"
                      value={inputValues[`global_${extraInput.key}`] || ""}
                      onChangeText={(text) =>
                        handleInputChange("global", extraInput.key, text)
                      }
                      placeholder={extraInput.placeholder}
                      style={styles.toleranceInput}
                    />
                  </View>
                )}
              </View>

              {VEHICLE_TYPES.map((vehicle) => (
                <View key={vehicle.key} style={styles.vehicleSection}>
                  <View style={styles.separator} />
                  <Text style={styles.vehicleLabel}>{vehicle.label}</Text>
                  <View style={styles.inputRow}>
                    {selectedMethod.inputs.map((input) => (
                      <View key={input.key} style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>{input.label}</Text>
                        <TextInput
                          mode="flat"
                          placeholder={input.placeholder}
                          value={
                            inputValues[`${vehicle.key}_${input.key}`] || ""
                          }
                          onChangeText={(text) =>
                            handleInputChange(vehicle.key, input.key, text)
                          }
                          keyboardType="numeric"
                          style={styles.input}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
        <View style={styles.button}>
          <PrimaryButton
            title="Salvar"
            style={styles.primaryButton}
            onPress={handleSave}
          />
        </View>
    </KeyboardAvoidingView>
  );
}
