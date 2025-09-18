import Colors from '@/constants/Colors';
import { TypographyThemes } from '@/constants/Fonts';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    title: string;
    category: string;
    tolerance: string;
    time?: string;
    carPrice: string;
    motoPrice: string;
  };
  specialCase?: {
    title: string;
    message: string;
    errors: ("title" | "tolerance" | "time" | "carPrice" | "motoPrice")[];
  };
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const { width } = Dimensions.get('window');

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  data,
  specialCase,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}: ConfirmationModalProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Determinar título e mensagem baseado no caso especial ou padrão
  const modalTitle = specialCase?.title || "Confirmar Configurações";
  // Separando a mensagem em três linhas no código, mas sem alterar a exibição na tela
  const modalMessage = specialCase?.message || (
    'Antes de salvar, verifique com atenção os detalhes abaixo. ' +
    'Se algum campo estiver incorreto, o sistema não salvará as configurações. ' +
    'Para corrigir algum campo, clique em "Cancelar" e ajuste as informações. Caso tudo esteja correto, clique em "Confirmar".'
  );

  // Gerar detalhes baseado nos dados
  const generateDetails = () => {
    const details = [
      {
        label: "Título",
        value: data.title || "Não informado"
      },
      {
        label: "Método de Cobrança",
        value: getCategoryLabel(data.category) || "Não selecionado"
      },
      {
        label: "Tolerância",
        value: data.category === 'VALOR_FIXO' ? "Não aplicável" : `${data.tolerance || 0} minutos`,
        warning: specialCase?.errors?.includes("tolerance"),
        isNotApplicable: data.category === 'VALOR_FIXO'
      },
      {
        label: "Tempo de Cobrança",
        value: data.time ? `${data.time} ${getTimeUnit(data.category)}` : "Não aplicável",
        warning: specialCase?.errors?.includes("time"),
        isNotApplicable: !data.time || data.category === 'VALOR_FIXO'
      },
      {
        label: "Preço Carro",
        value: `R$ ${data.carPrice || '0,00'}`,
        warning: specialCase?.errors?.includes("carPrice")
      },
      {
        label: "Preço Moto",
        value: `R$ ${data.motoPrice || '0,00'}`,
        warning: specialCase?.errors?.includes("motoPrice")
      }
    ];

    return details;
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      'POR_HORA': 'Por Hora',
      'POR_MINUTO': 'Por Minuto',
      'VALOR_FIXO': 'Valor Fixo'
    };
    return categoryLabels[category] || category;
  };

  const getTimeUnit = (category: string) => {
    const timeUnits: { [key: string]: string } = {
      'POR_HORA': 'em horas',
      'POR_MINUTO': 'em minutos',
      'VALOR_FIXO': 'deactivated'
    };
    return timeUnits[category] === 'deactivated' ? 'minutos' : timeUnits[category] || 'minutos';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{modalTitle}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.message}>{modalMessage}</Text>

            {generateDetails().length > 0 && (
              <TouchableOpacity
                style={styles.detailsToggle}
                onPress={() => setShowDetails(!showDetails)}
                activeOpacity={0.7}
              >
                <Text style={styles.detailsToggleText}>
                  {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
                </Text>
                <MaterialIcons
                  name={showDetails ? 'expand-less' : 'expand-more'}
                  size={20}
                  color={Colors.blue.primary}
                />
              </TouchableOpacity>
            )}

            {showDetails && generateDetails().length > 0 && (
              <View style={styles.detailsContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {generateDetails().map((detail: any, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.detailItem,
                        detail.highlight && styles.detailItemHighlight,
                        detail.warning && styles.detailItemWarning,
                      ]}
                    >
                      <Text
                        style={[
                          styles.detailLabel,
                          detail.highlight && styles.detailLabelHighlight,
                          detail.warning && styles.detailLabelWarning,
                        ]}
                      >
                        {detail.label}
                      </Text>
                      <Text
                        style={[
                          styles.detailValue,
                          detail.highlight && styles.detailValueHighlight,
                          detail.warning && styles.detailValueWarning,
                          detail.isNotApplicable && styles.detailValueNotApplicable,
                        ]}
                      >
                        {detail.value}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, loading && styles.confirmButtonDisabled]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Confirmando...' : confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  title: {
    ...TypographyThemes.poppins.title, // Poppins para título do modal - elegante
    fontSize: 18,
    color: Colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  message: {
    ...TypographyThemes.nunito.bodySmall, // Nunito para mensagem - amigável
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: 16,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.blue.light,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsToggleText: {
    ...TypographyThemes.inter.subtitle, // Inter para toggle de detalhes - moderna
    color: Colors.white,
  },
  detailsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    borderRadius: 8,
    backgroundColor: Colors.gray.light,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.medium,
  },
  detailItemHighlight: {
    backgroundColor: Colors.blue.light,
    borderBottomColor: Colors.blue.primary,
  },
  detailItemWarning: {
    backgroundColor: Colors.red[100],
    borderBottomColor: Colors.red[500],
  },
  detailLabel: {
    ...TypographyThemes.inter.subtitle, // Inter para labels de detalhes - moderna
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  detailLabelHighlight: {
    color: Colors.blue.primary,
    fontWeight: '600',
  },
  detailLabelWarning: {
    color: Colors.red[500],
    fontWeight: '600',
  },
  detailValue: {
    ...TypographyThemes.openSans.bodySmall, // Open Sans para valores - legível
    color: Colors.text.secondary,
    textAlign: 'right',
  },
  detailValueHighlight: {
    color: Colors.blue.primary,
    fontWeight: '600',
  },
  detailValueWarning: {
    color: Colors.red[500],
    fontWeight: '600',
  },
  detailValueNotApplicable: {
    color: Colors.orange[500],
    fontStyle: 'italic',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray.light,
  },
  cancelButtonText: {
    ...TypographyThemes.openSans.button, // Open Sans para botão cancelar - legível
    color: Colors.text.primary,
  },
  confirmButton: {
    backgroundColor: Colors.blue.primary,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.gray.medium,
  },
  confirmButtonText: {
    ...TypographyThemes.poppins.button, // Poppins para botão confirmar - elegante
    color: Colors.white,
  },
});
