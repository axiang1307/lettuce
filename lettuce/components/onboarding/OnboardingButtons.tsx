import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { Colors, OnboardingFontFamily } from '@/constants/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function OnboardingPrimaryButton({ label, onPress, disabled = false, style }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        disabled ? styles.buttonDisabled : styles.buttonPrimary,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text style={[styles.labelBase, disabled ? styles.disabledLabel : styles.primaryLabel]}>{label}</Text>
    </Pressable>
  );
}

export function OnboardingOutlineButton({ label, onPress, style }: Omit<ButtonProps, 'disabled'>) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.buttonBase, styles.buttonOutline, pressed && styles.pressed, style]}>
      <Text style={[styles.labelBase, styles.outlineLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    alignItems: 'center',
    borderRadius: 32,
    borderWidth: 2,
    height: 48,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  buttonOutline: {
    backgroundColor: '#fff',
    borderColor: Colors.light.tint,
  },
  buttonDisabled: {
    backgroundColor: Colors.light.onboarding.disabledSurface,
    borderColor: Colors.light.onboarding.disabledSurface,
    opacity: 0.6,
  },
  labelBase: {
    fontFamily: OnboardingFontFamily.bodySemibold,
    fontSize: 18,
    lineHeight: 27,
  },
  primaryLabel: {
    color: '#fff',
  },
  outlineLabel: {
    color: Colors.light.tint,
  },
  disabledLabel: {
    color: Colors.light.onboarding.disabledText,
  },
  pressed: {
    opacity: 0.92,
  },
});
