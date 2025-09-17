import FeedbackModal from '@/src/components/FeedbackModal';
import GenericConfirmationModal from '@/src/components/GenericConfirmationModal';
import Header from '@/src/components/Header';
import Colors from '@/src/constants/Colors';
import useGoals from '@/src/hooks/goals/useGoals';
import { styles } from '@/src/styles/functions/goalsConfigurationStyles';
import { GoalFormData, GoalType, Period } from '@/src/types/goalsTypes/goals';
import { formatToBrazilianCurrency, parseBrazilianCurrency } from '@/src/utils/dateUtils';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
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
    periodEnum: Period.DIARIA,
  },
  {
    key: 'weekly',
    label: 'Meta Semanal',
    description: 'Valor a ser atingido por semana',
    icon: 'date-range',
    iconFamily: 'MaterialIcons',
    period: 'por semana',
    periodEnum: Period.SEMANAL,
  },
  {
    key: 'monthly',
    label: 'Meta Mensal',
    description: 'Valor a ser atingido por mês',
    icon: 'calendar',
    iconFamily: 'AntDesign',
    period: 'por mês',
    periodEnum: Period.MENSAL,
  },
];

export default function GoalsConfiguration() {
  const { goals, loading, error, saving, saveGoal, updateGoal, deleteGoal, loadGoals } = useGoals();
  const [formData, setFormData] = useState<Record<string, GoalFormData>>({});
  const [focusedInputs, setFocusedInputs] = useState<Record<string, boolean>>({});
  
  // Refs para animações de cada meta
  const animationRefs = useRef<Record<string, Animated.Value>>({});

  // Estados para feedback modal
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  // Estados para modal de confirmação
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [goalToDeactivate, setGoalToDeactivate] = useState<string | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackVisible(false);
  };

  // Funções para modal de confirmação
  const handleDeactivateGoal = (goalType: string) => {
    setGoalToDeactivate(goalType);
    setConfirmationVisible(true);
  };

  const handleConfirmDeactivate = async () => {
    if (!goalToDeactivate) return;

    const success = await deleteGoal(goalToDeactivate as 'daily' | 'weekly' | 'monthly');

    if (success) {
      showFeedback('Meta desativada com sucesso!', 'success');
    } else {
      showFeedback('Erro ao desativar meta. Tente novamente.', 'error');
    }

    setConfirmationVisible(false);
    setGoalToDeactivate(null);
  };

  const handleCancelDeactivate = () => {
    setConfirmationVisible(false);
    setGoalToDeactivate(null);
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

  // Carregar metas ao entrar em foco
  useFocusEffect(
    React.useCallback(() => {
      loadGoals();
    }, [loadGoals])
  );

  // Inicializar animações
  useEffect(() => {
    goalTypes.forEach(goalType => {
      if (!animationRefs.current[goalType.key]) {
        animationRefs.current[goalType.key] = new Animated.Value(0);
      }
    });
  }, []);

  // Inicializar dados do formulário
  useEffect(() => {
    const initialFormData: Record<string, GoalFormData> = {};
    
    goalTypes.forEach(goalType => {
      const goal = goals[`${goalType.key}Goal` as keyof typeof goals];
      const isActive = goal ? goal.isActive : false;
      
      // Se existe meta no banco, usar os dados dela, senão deixar desativado
      initialFormData[goalType.key] = {
        targetValue: goal && goal.isActive ? formatToBrazilianCurrency(goal.goalValue) : '',
        isActive: isActive, // Só ativo se existe meta no banco
      };
      
      // Configurar animação inicial baseada no estado ativo
      const animationValue = animationRefs.current[goalType.key];
      if (animationValue) {
        animationValue.setValue(isActive ? 1 : 0);
      }
    });
    
    setFormData(initialFormData);
  }, [goals]);

  // Atualizar valor do input
  const updateValue = (goalType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [goalType]: {
        ...prev[goalType],
        targetValue: value,
      },
    }));
  };

  // Toggle ativo/inativo com animação
  const toggleActive = (goalType: string) => {
    const isCurrentlyActive = formData[goalType].isActive;
    const animationValue = animationRefs.current[goalType];
    
    if (!isCurrentlyActive) {
      // Ativando - primeiro muda o estado, depois anima
      setFormData(prev => ({
        ...prev,
        [goalType]: {
          ...prev[goalType],
          isActive: true,
        },
      }));
      
      // Animar para aparecer
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Desativando - primeiro anima, depois muda o estado
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Só muda o estado após a animação terminar
        setFormData(prev => ({
          ...prev,
          [goalType]: {
            ...prev[goalType],
            isActive: false,
          },
        }));
      });
    }
  };

  // Salvar meta
  const handleSaveGoal = async (goalType: string) => {
    const data = formData[goalType];
    const numericValue = parseBrazilianCurrency(data.targetValue);
    
    if (!data.targetValue || numericValue <= 0) {
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
    const goalFromDB = goals[`${goalType.key}Goal` as keyof typeof goals];
    const hasActiveGoalFromDB = goalFromDB && goalFromDB.isActive;
    
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

        <Animated.View
          style={{
            opacity: animationRefs.current[goalType.key] || 0,
            transform: [
              {
                translateY: (animationRefs.current[goalType.key] || new Animated.Value(0)).interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }}
        >
          {data.isActive && (
            <>
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

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    saving && styles.saveButtonDisabled,
                  ]}
                  onPress={() => handleSaveGoal(goalType.key)}
                  disabled={saving}
                >
                  <Text style={[
                    styles.saveButtonText,
                    saving && styles.saveButtonTextDisabled,
                  ]}>
                    Salvar Meta
                  </Text>
                </TouchableOpacity>

                {hasActiveGoalFromDB && (
                  <TouchableOpacity
                    style={[
                      styles.deactivateButton,
                      saving && styles.deactivateButtonDisabled,
                    ]}
                    onPress={() => handleDeactivateGoal(goalType.key)}
                    disabled={saving}
                  >
                    <Text style={[
                      styles.deactivateButtonText,
                      saving && styles.deactivateButtonTextDisabled,
                    ]}>
                      Desativar
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </Animated.View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Configurações de Metas" titleStyle={{ fontSize: 25 }}/>
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
      <Header title="Configurações de Metas" titleStyle={{ fontSize: 25 }}/>
      
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
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          scrollEventThrottle={16}
          decelerationRate="normal"
          overScrollMode="auto"
          nestedScrollEnabled={true}
          keyboardDismissMode="on-drag"
        >
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

        <View style={styles.goalsContainer}>
          {goalTypes.map(renderGoalCard)}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={handleFeedbackClose}
        dismissible={true}
        timeClose={3000}
      />

      <GenericConfirmationModal
        visible={confirmationVisible}
        title="Desativar Meta"
        message="Tem certeza que deseja desativar esta meta?"
        details="Ao desativar, a meta não será mais considerada nos relatórios e análises. Você pode reativá-la a qualquer momento ou trocar o valor."
        confirmText="Desativar"
        cancelText="Cancelar"
        confirmButtonStyle="danger"
        onConfirm={handleConfirmDeactivate}
        onCancel={handleCancelDeactivate}
      />
    </View>
  );
}