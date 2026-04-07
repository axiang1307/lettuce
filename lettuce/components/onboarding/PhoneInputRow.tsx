import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, OnboardingFontFamily } from '@/constants/theme';

type PhoneInputRowProps = {
  digits: string;
  onChangeDigits: (digits: string) => void;
};

function formatPhone(digits: string) {
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  if (digits.length <= 3) return a;
  if (digits.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

export function PhoneInputRow({ digits, onChangeDigits }: PhoneInputRowProps) {
  const value = formatPhone(digits);

  return (
    <View style={styles.card}>
      <Text style={styles.leading}>🇺🇸 +1 </Text>
      <TextInput
        keyboardType="phone-pad"
        value={value}
        onChangeText={(text) => onChangeDigits(text.replace(/\D/g, '').slice(0, 10))}
        placeholder="Phone number"
        placeholderTextColor={Colors.light.onboarding.disabledText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  leading: {
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    lineHeight: 21,
  },
  input: {
    color: Colors.light.onboarding.title,
    flex: 1,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    paddingVertical: 0,
  },
});
