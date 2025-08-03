import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Switch,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "@/src/constants/Colors";
import Header from "@/src/components/Header";
import { styles } from "@/src/styles/functions/goalsStyle";
import useGoalConfig from "@/src/hooks/dashboard/useGoalConfig";
import FeedbackModal from "@/src/components/FeedbackModal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type FormState = {
  dailyGoal: string;
  vehicleGoal: string;
  productGoal: string;
  notificationsEnabled: boolean;
  goalPeriod: "DIARIA" | "SEMANAL" | "MENSAL";
  enableCategoryGoals: boolean;
  activeDays: {
    domingo: boolean;
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
  };
};

export default function GoalsConfiguration() {
  const { formConfig, loading, error, fetchGoalConfig, saveGoalConfig } =
    useGoalConfig();

  const [localForm, setLocalForm] = useState<FormState>({
    dailyGoal: "",
    vehicleGoal: "",
    productGoal: "",
    notificationsEnabled: false,
    goalPeriod: "DIARIA",
    enableCategoryGoals: false,
    activeDays: {
      domingo: false,
      segunda: false,
      terca: false,
      quarta: false,
      quinta: false,
      sexta: false,
      sabado: false,
    },
  });

  // Estados para o FeedbackModal
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSuccessFeedback, setIsSuccessFeedback] = useState(false);

  // Atualiza o estado local quando as configurações são carregadas
  useEffect(() => {
    if (formConfig) {
      setLocalForm({
        dailyGoal: formConfig.dailyGoal,
        vehicleGoal: formConfig.vehicleGoal,
        productGoal: formConfig.productGoal,
        notificationsEnabled: formConfig.notificationsEnabled,
        goalPeriod: formConfig.goalPeriod,
        enableCategoryGoals: formConfig.enableCategoryGoals,
        activeDays: formConfig.activeDays || {
          domingo: false,
          segunda: false,
          terca: false,
          quarta: false,
          quinta: false,
          sexta: false,
          sabado: false,
        },
      });
    }
  }, [formConfig]);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setLocalForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDay = (day: keyof FormState["activeDays"]) => {
    setLocalForm((prev) => ({
      ...prev,
      activeDays: {
        ...prev.activeDays,
        [day]: !prev.activeDays[day],
      },
    }));
  };

  const handleSave = async () => {
    const result = await saveGoalConfig(localForm);

    if (result.success) {
      setFeedbackMessage(result.message || "Configurações salvas com sucesso!");
      setIsSuccessFeedback(true);
      setFeedbackVisible(true);
    } else {
      setFeedbackMessage(result.error || "Falha ao salvar configurações");
      setIsSuccessFeedback(false);
      setFeedbackVisible(true);
    }
  };

  if (loading && !formConfig) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue.dark} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => fetchGoalConfig()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("@/src/assets/images/splash-icon-blue.png")}
        style={styles.heroImage}
      />
      <Header title="Configuração de Metas" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Seção de Meta Geral */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meta Geral</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Meta de lucro (R$)
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={localForm.dailyGoal}
              onChangeText={(value) => handleChange("dailyGoal", value)}
              placeholder="Ex: 10000"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Período da meta</Text>
            <Picker
              selectedValue={localForm.goalPeriod}
              onValueChange={(value) => handleChange("goalPeriod", value)}
              style={styles.picker}
              dropdownIconColor={Colors.blue.dark}
            >
              <Picker.Item label="Diária" value="DIARIA" />
              <Picker.Item label="Semanal" value="SEMANAL" />
              <Picker.Item label="Mensal" value="MENSAL" />
            </Picker>
          </View>

          {/* Seletor de Dias da Semana */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dias de funcionamento</Text>
            <View style={styles.daysContainer}>
              {[
                { key: "domingo", label: "D", fullLabel: "Dom" },
                { key: "segunda", label: "S", fullLabel: "Seg" },
                { key: "terca", label: "T", fullLabel: "Ter" },
                { key: "quarta", label: "Q", fullLabel: "Qua" },
                { key: "quinta", label: "Q", fullLabel: "Qui" },
                { key: "sexta", label: "S", fullLabel: "Sex" },
                { key: "sabado", label: "S", fullLabel: "Sáb" },
              ].map((day) => {
                const isActive =
                  localForm.activeDays[
                    day.key as keyof FormState["activeDays"]
                  ];
                return (
                  <View key={day.key} style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() =>
                        toggleDay(day.key as keyof FormState["activeDays"])
                      }
                      style={[
                        styles.dayButton,
                        isActive
                          ? styles.dayButtonActive
                          : styles.dayButtonInactive,
                      ]}
                    >
                      <Text style={styles.dayButtonText}>{day.label}</Text>
                      {isActive && (
                        <View style={styles.dayCheckIcon}>
                          <MaterialIcons
                            name="check"
                            size={28}
                            color={Colors.white}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                    <View style={styles.dayLabelContainer}>
                      <Text
                        style={[
                          styles.dayLabel,
                          isActive && styles.dayLabelActive,
                        ]}
                      >
                        {day.fullLabel}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Notificações de progresso</Text>
            <Switch
              value={localForm.notificationsEnabled}
              onValueChange={(value) =>
                handleChange("notificationsEnabled", value)
              }
              thumbColor={Colors.white}
              trackColor={{ false: Colors.gray.light, true: Colors.blue.dark }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Metas por Categoria</Text>
            <Switch
              value={localForm.enableCategoryGoals}
              onValueChange={(value) =>
                handleChange("enableCategoryGoals", value)
              }
              thumbColor={Colors.white}
              trackColor={{ false: Colors.gray.light, true: Colors.blue.dark }}
            />
          </View>

          {localForm.enableCategoryGoals && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Meta diária de veículos</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={localForm.vehicleGoal}
                  onChangeText={(value) => handleChange("vehicleGoal", value)}
                  placeholder="Ex: 5"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Meta diária de produtos</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={localForm.productGoal}
                  onChangeText={(value) => handleChange("productGoal", value)}
                  placeholder="Ex: 20"
                />
              </View>
            </>
          )}
        </View>

        {/* Botão de Salvar */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Salvando..." : "Salvar Configurações"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        isSuccess={isSuccessFeedback}
        onClose={() => setFeedbackVisible(false)}
        shouldGoBack={isSuccessFeedback}
      />
    </View>
  );
}
