import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

export default function PasswordReset() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });

  const passwordError = touched.password && password.length < 8 ? 'Password must be at least 8 characters.' : null;
  const confirmError = touched.confirm && confirm !== password ? 'Passwords do not match.' : null;
  const isValid = password.length >= 8 && password === confirm;

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

          <Text style={styles.title}>New password</Text>
          <Text style={styles.subtitle}>Choose a strong password for your account.</Text>

          <View style={styles.formWrap}>
            <View>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput, !!passwordError && styles.inputError]}
                  placeholder="New password"
                  placeholderTextColor={Colors.light.onboarding.disabledText}
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={8}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.light.onboarding.caption}
                  />
                </Pressable>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <View>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput, !!confirmError && styles.inputError]}
                  placeholder="Confirm new password"
                  placeholderTextColor={Colors.light.onboarding.disabledText}
                  secureTextEntry={!showConfirm}
                  textContentType="newPassword"
                  value={confirm}
                  onChangeText={setConfirm}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowConfirm((v) => !v)}
                  hitSlop={8}>
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.light.onboarding.caption}
                  />
                </Pressable>
              </View>
              {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footerWrap}>
        <OnboardingOutlineButton label="Back" onPress={() => router.back()} />
        <OnboardingPrimaryButton
          label="Save password"
          disabled={!isValid}
          onPress={async () => {
            const {error} = await supabase.auth.updateUser({
              password: password,
            });
            if (error) {
              Alert.alert('Error', error.message);
              return;
            }
            router.replace('/(tabs)' as Href);
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
  subtitle: {
    color: Colors.light.onboarding.caption,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    textAlign: 'center',
    width: 292,
  },
  formWrap: {
    gap: 12,
    marginTop: 40,
    width: 361,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
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
  inputError: {
    borderColor: '#D9534F',
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 14,
    top: 0,
  },
  errorText: {
    color: '#D9534F',
    fontFamily: OnboardingFontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  footerWrap: {
    gap: 12,
    marginBottom: 24,
    width: 361,
  },
});
