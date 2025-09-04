import { SecondaryButtonProps } from "@/src/types/components";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export function SecondaryButton({ title, onPress, style, disabled }: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '60%',
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    borderColor: '#8a8a8a',
    opacity: 0.5,
  },
  buttonText: {
    color: '#1C274C',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
