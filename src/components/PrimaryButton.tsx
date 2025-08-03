import { PrimaryButtonProps } from "@/src/types/components";
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from "@/src/constants/Colors";

export function PrimaryButton({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false,
  loading = false,
  loadingType,
  icon, // Nova prop para o ícone
  iconPosition = 'left' // Padrão: ícone à esquerda
}: PrimaryButtonProps) {
  const isDisabled = typeof disabled === 'boolean' 
    ? disabled 
    : (loadingType && typeof disabled === 'object' 
      ? disabled[loadingType] 
      : false);

  const isLoading = loading || (loadingType && typeof disabled === 'object' 
    ? disabled[loadingType] 
    : false);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.white} />
          <Text style={[styles.buttonText, textStyle, styles.loadingText]}>
            {title}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        <Text style={[styles.buttonText, textStyle]}>
          {title}
        </Text>
        {icon && iconPosition === 'right' && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button, 
        style, 
        (isDisabled || isLoading) && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={isDisabled || isLoading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.blue.logo,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    backgroundColor: Colors.gray[400],
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    opacity: 0.8,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});