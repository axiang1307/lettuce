import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingOutlineButton, OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';
import { LettuceLogo } from '@/components/onboarding/LettuceLogo';
import { Colors, OnboardingFontFamily } from '@/constants/theme';

/**
 * PLACEHOLDER LOGIN — no validation, no accounts, no network.
 * Any non-empty tap on "Enter app" proceeds; empty fields are allowed too for quick testing.
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToApp = () => {
    // PLACEHOLDER: replace with real auth + session token later
    router.replace('/(tabs)' as Href);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrap}>
        <LettuceLogo />
      </View>

      <View style={styles.contentWrap}>
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Log in</Text>
          <Text style={styles.subtitle}>Welcome back! Enter your details to continue.</Text>
        </View>

        <View style={styles.formWrap}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.light.onboarding.disabledText}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.light.onboarding.disabledText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable onPress={() => undefined}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </Pressable>
      </View>

      <View style={styles.footerWrap}>
        <OnboardingOutlineButton label="Back" onPress={() => router.back()} />
        <OnboardingPrimaryButton label="Enter app" onPress={goToApp} />
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
  logoWrap: {
    marginTop: 8,
    width: '100%',
  },
  contentWrap: {
    marginTop: 64,
    width: 361,
  },
  headerWrap: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  title: {
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.heading,
    fontSize: 28.83,
    lineHeight: 37.48,
  },
  subtitle: {
    color: '#373737',
    fontFamily: OnboardingFontFamily.body,
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
  },
  formWrap: {
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    height: 48,
    lineHeight: 21,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  forgot: {
    alignSelf: 'flex-end',
    color: Colors.light.onboarding.caption,
    fontFamily: OnboardingFontFamily.bodySemibold,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  footerWrap: {
    gap: 12,
    marginBottom: 24,
    marginTop: 'auto',
    width: 361,
  },
});
