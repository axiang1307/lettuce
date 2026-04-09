import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingOutlineButton, OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';
import { LettuceLogo } from '@/components/onboarding/LettuceLogo';
import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { PhoneInputRow } from '@/components/onboarding/PhoneInputRow';
import { Colors, OnboardingFontFamily } from '@/constants/theme';

export default function OnboardingPhone() {
  const router = useRouter();
  const [phoneDigits, setPhoneDigits] = useState('');
  const isValid = phoneDigits.length === 10;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.keyboardContainer}>
        <ScrollView
          alwaysBounceVertical
          bounces
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoWrap}>
            <LettuceLogo />
          </View>

          <View style={styles.progressWrap}>
            <OnboardingProgressBar currentStep={1} totalSteps={4} />
          </View>

          <Text style={styles.title}>What&apos;s your number?</Text>

          <View style={styles.formWrap}>
            <PhoneInputRow digits={phoneDigits} onChangeDigits={setPhoneDigits} />
            <Text style={styles.caption}>
              We use your phone number for identity verification to make sure you are not a bot.
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footerWrap}>
        <OnboardingOutlineButton label="Back" onPress={() => router.back()} />
        <OnboardingPrimaryButton
          label="Continue"
          disabled={!isValid}
          onPress={() =>
            router.push(
              {
                pathname: '/onboarding/verify',
                params: { phone: phoneDigits },
              } as Href
            )
          }
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
  },
  logoWrap: {
    marginTop: 20,
    width: '100%',
  },
  progressWrap: {
    marginTop: 24,
    width: 300,
  },
  title: {
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.heading,
    fontSize: 28.83,
    lineHeight: 37.48,
    marginTop: 53,
    textAlign: 'center',
  },
  formWrap: {
    alignItems: 'center',
    gap: 16,
    marginTop: 48,
    width: 361,
  },
  caption: {
    color: Colors.light.onboarding.caption,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    width: 292,
  },
  footerWrap: {
    gap: 12,
    marginBottom: 24,
    width: 361,
  },
});
