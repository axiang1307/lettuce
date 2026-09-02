import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, OnboardingFontFamily } from '@/constants/theme';

type LettuceLogoProps = {
  large?: boolean;
};

export function LettuceLogo({ large = false }: LettuceLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={large ? styles.largeIcon : styles.icon}
        contentFit="contain"
      />
      <Text style={[styles.label, large && styles.largeLabel]}>Lettuce</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  largeIcon: {
    width: 155,
    height: 155,
  },
  label: {
    color: Colors.light.tint,
    fontFamily: OnboardingFontFamily.heading,
    fontSize: 28.83,
    lineHeight: 37.48,
  },
  largeLabel: {
    fontSize: 40,
    lineHeight: 48,
  },
});
