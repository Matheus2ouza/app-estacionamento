// PrimaryButton.tsx
import { PrimaryButtonProps } from "@/src/types/components";
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

export function PrimaryButton({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false,
  loadingType,
  loadingText
}: PrimaryButtonProps) {
  // Determina se está desabilitado
  const isDisabled = typeof disabled === 'boolean' ? disabled : 
                   (loadingType && typeof disabled === 'object' ? disabled[loadingType] : false);
  
  // Determina se está carregando
  const isLoading = loadingType && typeof disabled === 'object' ? disabled[loadingType] : false;

  return (
    <TouchableOpacity
      style={[styles.button, style, isDisabled && styles.disabledButton]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>
          {loadingText && isLoading ? loadingText : title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '60%',
    height: 50,
    backgroundColor: '#1C274C',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#8a8a8a',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});