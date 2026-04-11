import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingOutlineButton, OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';
import { LettuceLogo } from '@/components/onboarding/LettuceLogo';
import { Colors, OnboardingFontFamily } from '@/constants/theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResetEmail() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const isValid = EMAIL_RE.test(email.trim());

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

          <Text style={styles.title}>Password Reset</Text>

          <View style={styles.formWrap}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.light.onboarding.disabledText}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.caption}>
              Enter the email address associated with your account and we'll send you a reset code.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footerWrap}>
        <OnboardingOutlineButton label="Back" onPress={() => router.back()} />
        <OnboardingPrimaryButton
          label="Continue"
          disabled={!isValid}
          onPress={async () => {

            const {error} = await supabase.auth.resetPasswordForEmail(email);
            if (error) {
              Alert.alert('Error', error.message);
              return;
            }
            router.push({
              pathname: '/verify_pass_reset',
              params: { email } } as Href
            );


          }}
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
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
  },
  logoWrap: {
    marginTop: 20,
    width: '100%',
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
    width: '100%',
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
