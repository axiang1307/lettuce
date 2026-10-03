import { Href, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingOutlineButton, OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';
import { Colors, OnboardingFontFamily } from '@/constants/theme';

export default function OnboardingLanding() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContent}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.hero}
          contentFit="contain"
        />
        <Text style={styles.brand}>Lettuce</Text>
      </View>
      <Text style={styles.tagline}>Plan your next meet up</Text>
      <View style={styles.ctaContainer}>
        <OnboardingPrimaryButton label="Log in" onPress={() => router.push('/login' as Href)} />
        <OnboardingOutlineButton
          label="Create Account"
          onPress={() => router.push('/onboarding/phone' as Href)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  logoContent: {
    alignItems: 'center',
    gap: 24,
    paddingTop: 96,
    width: '100%',
  },
  hero: {
    height: 155,
    width: 155,
  },
  tagline: {
    color: Colors.light.onboarding.caption,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 18,
    lineHeight: 27,
    marginTop: 4,
  },
  brand: {
    color: Colors.light.tint,
    fontFamily: OnboardingFontFamily.heading,
    fontSize: 28.83,
    lineHeight: 37.48,
  },
  ctaContainer: {
    gap: 16,
    marginTop: 'auto',
    paddingBottom: 72,
    paddingHorizontal: 32,
    width: '100%',
  },
});
