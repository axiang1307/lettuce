import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingOutlineButton, OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';
import { LettuceLogo } from '@/components/onboarding/LettuceLogo';
import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { Colors, OnboardingFontFamily } from '@/constants/theme';

function formatDisplayPhone(phoneDigits: string) {
  const p = phoneDigits.padEnd(10, 'X').slice(0, 10);
  return `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6, 10)}`;
}

export default function OnboardingVerify() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = (params.phone ?? '').replace(/\D/g, '').slice(0, 10);
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(44);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const displayPhone = useMemo(() => formatDisplayPhone(phone), [phone]);
  const paddedCode = code.padEnd(6, ' ');

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, []);

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
            <OnboardingProgressBar currentStep={1} totalSteps={5} darkLabel />
          </View>
          <Text style={styles.title}>What&apos;s the code?</Text>
          <Text style={styles.subtitle}>We sent a code to {displayPhone}</Text>

          <Pressable style={styles.codeRow} onPress={() => inputRef.current?.focus()}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={`digit-${index}`} style={styles.codeBox}>
                <Text style={styles.codeText}>{paddedCode[index] || ' '}</Text>
              </View>
            ))}
          </Pressable>

          <TextInput
            keyboardType="number-pad"
            value={code}
            onChangeText={(text) => setCode(text.replace(/\D/g, '').slice(0, 6))}
            style={styles.captureInput}
            autoFocus
            ref={inputRef}
            textContentType="oneTimeCode"
            importantForAutofill="yes"
          />

          <Pressable
            disabled={seconds > 0}
            onPress = {async () => {
            const {error} = await supabase.auth.resend({
              phone: '+1' + phone,
              type: 'sms',
            });
            if (error) {
              Alert.alert('Error', error.message);
              return;
            }
            setSeconds(44);
          }
          }>
            {/* upon resend becomes green and udnerlined */}
            <Text style={[styles.caption, seconds === 0 && styles.resendActive]}>
              {seconds > 0
                ? `Didn't get it? Resend in 0:${String(seconds).padStart(2, '0')}`
                : "Didn't get it? Resend"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footerWrap}>
        <OnboardingOutlineButton label="Back" onPress={() => router.back()} />
        <OnboardingPrimaryButton
          label="Continue"
          disabled={code.length !== 6}
          onPress={async () => {
            const { error } = await supabase.auth.verifyOtp({
              phone: '+1' + phone,
              token: code,
              type: 'sms',
            });
            if (error) {
              Alert.alert('Error', error.message);//maybe check on this alert message later bc not good
              return;
            }
            router.push('/onboarding/credentials' as Href);
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
  subtitle: {
    color: Colors.light.onboarding.caption,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    textAlign: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 40,
  },
  codeBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    width: 44,
  },
  codeText: {
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.bodySemibold,
    fontSize: 20,
  },
  captureInput: {
    height: 1,
    left: -9999,
    opacity: 0.01,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  caption: {
    color: Colors.light.onboarding.caption,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 20,
    textAlign: 'center',
  },
  resendActive: {
    color: Colors.light.tint,
    textDecorationLine: 'underline',
  },
  footerWrap: {
    gap: 12,
    marginBottom: 24,
    width: 361,
  },
});
