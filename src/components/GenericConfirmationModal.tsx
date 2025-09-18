import Colors from '@/constants/Colors';
import { TypographyThemes } from '@/constants/Fonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { Animated, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface GenericConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  details?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonStyle?: 'primary' | 'danger' | 'success';
}

export default function GenericConfirmationModal({
  visible,
  title,
  message,
  details,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  confirmButtonStyle = 'primary'
}: GenericConfirmationModalProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  const toggleDetails = () => {
    const toValue = detailsExpanded ? 0 : 1;
    
    Animated.timing(animationValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setDetailsExpanded(!detailsExpanded);
  };

  const getConfirmButtonStyle = () => {
    switch (confirmButtonStyle) {
      case 'danger':
        return styles.confirmButtonDanger;
      case 'success':
        return styles.confirmButtonSuccess;
      default:
        return styles.confirmButtonPrimary;
    }
  };

  const getConfirmButtonTextStyle = () => {
    switch (confirmButtonStyle) {
      case 'danger':
        return styles.confirmButtonTextDanger;
      case 'success':
        return styles.confirmButtonTextSuccess;
      default:
        return styles.confirmButtonTextPrimary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>
            
            {/* Detalhes expansíveis (opcional) */}
            {details && (
              <View style={styles.detailsContainer}>
                <TouchableOpacity 
                  style={styles.detailsHeader} 
                  onPress={toggleDetails}
                  activeOpacity={0.7}
                >
                  <Text style={styles.detailsTitle}>Detalhes</Text>
                  <Ionicons 
                    name={detailsExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={Colors.blue.primary} 
                  />
                </TouchableOpacity>
                
                <Animated.View 
                  style={[
                    styles.detailsContent,
                    {
                      maxHeight: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 200], // Altura máxima dos detalhes
                      }),
                      opacity: animationValue,
                    }
                  ]}
                >
                  <ScrollView 
                    style={styles.detailsScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.detailsText}>{details}</Text>
                  </ScrollView>
                </Animated.View>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.confirmButton, getConfirmButtonStyle()]} 
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={[styles.confirmButtonText, getConfirmButtonTextStyle()]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '100%' as any,
    maxWidth: 400,
    maxHeight: '80%' as any,
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
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    ...TypographyThemes.poppins.title,
    color: Colors.text.primary,
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
    paddingBottom: 16,
  },
  message: {
    ...TypographyThemes.openSans.body,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  detailsContainer: {
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    overflow: 'hidden' as const,
  },
  detailsHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.gray[50],
  },
  detailsTitle: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.blue.primary,
    fontWeight: '600' as const,
  },
  detailsContent: {
    overflow: 'hidden' as const,
  },
  detailsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  detailsText: {
    ...TypographyThemes.nunito.bodySmall,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  cancelButtonText: {
    ...TypographyThemes.openSans.button,
    color: Colors.text.secondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  confirmButtonPrimary: {
    backgroundColor: Colors.blue.primary,
  },
  confirmButtonDanger: {
    backgroundColor: Colors.red[500],
  },
  confirmButtonSuccess: {
    backgroundColor: Colors.green[500],
  },
  confirmButtonText: {
    ...TypographyThemes.openSans.button,
    color: Colors.white,
    fontWeight: '600' as const,
  },
  confirmButtonTextPrimary: {
    color: Colors.white,
  },
  confirmButtonTextDanger: {
    color: Colors.white,
  },
  confirmButtonTextSuccess: {
    color: Colors.white,
  },
};
