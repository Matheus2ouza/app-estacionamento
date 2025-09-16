import FeedbackModal from '@/src/components/FeedbackModal';
import Header from '@/src/components/Header';
import Colors from '@/src/constants/Colors';
import useGoals from '@/src/hooks/goals/useGoals';
import { styles } from '@/src/styles/functions/goalsConfigurationStyles';
import { GoalFormData, GoalType } from '@/src/types/goalsTypes/goals';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const goalTypes: GoalType[] = [
  {
    key: 'daily',
    label: 'Meta Diária',
    description: 'Valor a ser atingido por dia',
    icon: 'today',
    iconFamily: 'Ionicons',
    period: 'por dia',
  },
  {
    key: 'weekly',
    label: 'Meta Semanal',
    description: 'Valor a ser atingido por semana',
    icon: 'date-range',
    iconFamily: 'MaterialIcons',
    period: 'por semana',
  },
  {
    key: 'monthly',
    label: 'Meta Mensal',
    description: 'Valor a ser atingido por mês',
    icon: 'calendar',
    iconFamily: 'AntDesign',
    period: 'por mês',
  },
];

export default function GoalsConfiguration() {
  const { goals, loading, error, saving, saveGoal, updateGoal } = useGoals();
  const [formData, setFormData] = useState<Record<string, GoalFormData>>({});
  const [focusedInputs, setFocusedInputs] = useState<Record<string, boolean>>({});

  // Estados para feedback modal
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackVisible(false);
  };

  // Função para renderizar ícone baseado na família
  const renderIcon = (iconFamily: string, iconName: string, size: number, color: string) => {
    switch (iconFamily) {
      case 'FontAwesome':
        return <FontAwesome name={iconName as any} size={size} color={color} />;
      case 'Ionicons':
        return <Ionicons name={iconName as any} size={size} color={color} />;
      case 'MaterialIcons':
        return <MaterialIcons name={iconName as any} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={iconName as any} size={size} color={color} />;
      case 'AntDesign':
        return <AntDesign name={iconName as any} size={size} color={color} />;
      case 'Feather':
        return <Feather name={iconName as any} size={size} color={color} />;
      case 'SimpleLineIcons':
        return <SimpleLineIcons name={iconName as any} size={size} color={color} />;
      case 'Entypo':
        return <Entypo name={iconName as any} size={size} color={color} />;
      default:
        return <FontAwesome name="question" size={size} color={color} />;
    }
  };

  // Inicializar dados do formulário
  useEffect(() => {
    const initialFormData: Record<string, GoalFormData> = {};
    
    goalTypes.forEach(goalType => {
      const goal = goals[`${goalType.key}Goal` as keyof typeof goals];
      initialFormData[goalType.key] = {
        targetValue: goal ? goal.targetValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) : '',
        isActive: goal ? goal.isActive : false,
      };
    });
    
    setFormData(initialFormData);
  }, [goals]);

  // Formatar valor monetário
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    
    const formattedValue = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return formattedValue;
  };

  // Atualizar valor do input
  const updateValue = (goalType: string, value: string) => {
    const formattedValue = formatCurrency(value);
    setFormData(prev => ({
      ...prev,
      [goalType]: {
        ...prev[goalType],
        targetValue: formattedValue,
      },
    }));
  };

  // Toggle ativo/inativo
  const toggleActive = (goalType: string) => {
    setFormData(prev => ({
      ...prev,
      [goalType]: {
        ...prev[goalType],
        isActive: !prev[goalType].isActive,
      },
    }));
  };

  // Salvar meta
  const handleSaveGoal = async (goalType: string) => {
    const data = formData[goalType];
    if (!data.targetValue || parseFloat(data.targetValue.replace(/[^\d,]/g, '').replace(',', '.')) <= 0) {
      showFeedback('Por favor, insira um valor válido para a meta.', 'error');
      return;
    }

    const success = goals[`${goalType}Goal` as keyof typeof goals]
      ? await updateGoal(goalType as 'daily' | 'weekly' | 'monthly', data)
      : await saveGoal(goalType as 'daily' | 'weekly' | 'monthly', data);

    if (success) {
      showFeedback('Meta salva com sucesso!', 'success');
    } else {
      showFeedback('Erro ao salvar meta. Tente novamente.', 'error');
    }
  };

  // Renderizar toggle
  const renderToggle = (goalType: string, isActive: boolean) => (
    <TouchableOpacity
      style={[styles.toggle, isActive && styles.toggleActive]}
      onPress={() => toggleActive(goalType)}
    >
      <View style={[styles.toggleThumb, isActive && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );

  // Renderizar card de meta
  const renderGoalCard = (goalType: GoalType) => {
    const data = formData[goalType.key];
    const isFocused = focusedInputs[goalType.key];
    
    if (!data) return null;

    return (
      <View key={goalType.key} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalIcon}>
            {renderIcon(goalType.iconFamily, goalType.icon, 20, Colors.blue[600])}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.goalTitle}>{goalType.label}</Text>
            <Text style={styles.goalDescription}>{goalType.description}</Text>
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Meta ativa</Text>
          {renderToggle(goalType.key, data.isActive)}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Valor da meta ({goalType.period})</Text>
          <View style={styles.currencyInput}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={[
                styles.currencyInputField,
                isFocused && styles.currencyInputFocused,
              ]}
              value={data.targetValue}
              onChangeText={(value) => updateValue(goalType.key, value)}
              onFocus={() => setFocusedInputs(prev => ({ ...prev, [goalType.key]: true }))}
              onBlur={() => setFocusedInputs(prev => ({ ...prev, [goalType.key]: false }))}
              placeholder="0,00"
              keyboardType="numeric"
              editable={data.isActive}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!data.isActive || saving) && styles.saveButtonDisabled,
          ]}
          onPress={() => handleSaveGoal(goalType.key)}
          disabled={!data.isActive || saving}
        >
          <Text style={[
            styles.saveButtonText,
            (!data.isActive || saving) && styles.saveButtonTextDisabled,
          ]}>
            Salvar Meta
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Configurações de Metas" />
        <Spinner
          visible={loading}
          textContent="Carregando metas..."
          textStyle={{
            color: Colors.text.primary,
            fontSize: 16,
            fontWeight: '500'
          }}
          color={Colors.blue.logo}
          overlayColor={Colors.overlay.medium}
          size="large"
          animation="fade"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Configurações de Metas" />
      
      <Spinner
        visible={saving}
        textContent="Salvando meta..."
        textStyle={{
          color: Colors.text.primary,
          fontSize: 16,
          fontWeight: '500'
        }}
        color={Colors.blue.logo}
        overlayColor={Colors.overlay.medium}
        size="large"
        animation="fade"
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconContainer}>
              <FontAwesome name="lightbulb-o" size={20} color="white" />
            </View>
            <Text style={styles.infoTitle}>Dica</Text>
          </View>
          <Text style={styles.infoText}>
            Configure metas realistas baseadas no histórico do seu negócio. 
            Metas muito altas podem desmotivar, enquanto metas muito baixas não incentivam o crescimento.
          </Text>
        </View>

        {error && (
          <View style={[styles.infoCard, { backgroundColor: Colors.red[500], borderColor: Colors.red[600] }]}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <FontAwesome name="exclamation-triangle" size={20} color="white" />
              </View>
              <Text style={styles.infoTitle}>Erro</Text>
            </View>
            <Text style={styles.infoText}>{error}</Text>
          </View>
        )}

        <View style={styles.goalsContainer}>
          {goalTypes.map(renderGoalCard)}
        </View>
      </ScrollView>

      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={handleFeedbackClose}
        dismissible={true}
        timeClose={3000}
      />
    </View>
  );
}