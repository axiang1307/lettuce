import { Href, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import React, { useMemo, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';
import { LettuceLogo } from '@/components/onboarding/LettuceLogo';
import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { Colors, OnboardingFontFamily } from '@/constants/theme';

export default function OnboardingName() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isValid = useMemo(() => firstName.trim().length > 0 && lastName.trim().length > 0, [firstName, lastName]);

  const handleContinue = async () => {
    if (!isValid || isSaving) return;

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const fullName = `${trimmedFirstName} ${trimmedLastName}`;

    setIsSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsSaving(false);
      Alert.alert('Error', userError?.message ?? 'Please sign in again before continuing.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          full_name: fullName,
        },
        { onConflict: 'id' }
      );

    setIsSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    router.push(
      {
        pathname: '/onboarding/calendar-sync',
        params: { firstName: trimmedFirstName },
      } as Href
    );
  };

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
            <OnboardingProgressBar currentStep={3} totalSteps={5} darkLabel />
          </View>
          <Text style={styles.title}>What&apos;s your name?</Text>

          <View style={styles.formWrap}>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor={Colors.light.onboarding.disabledText}
              style={styles.input}
            />
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor={Colors.light.onboarding.disabledText}
              style={styles.input}
            />
          </View>

          <Text style={styles.caption}>
            We show your first name and the initial of your last name to your friends on Lettuce.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonWrap}>
        <OnboardingPrimaryButton
          label="Continue"
          disabled={!isValid || isSaving}
          onPress={handleContinue}
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
    gap: 12,
    marginTop: 40,
    width: 361,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    height: 40,
    lineHeight: 21,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  caption: {
    color: Colors.light.onboarding.caption,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
    textAlign: 'center',
    width: 292,
  },
  buttonWrap: {
    marginTop: 'auto',
    marginBottom: 36,
    width: 300,
  },
});
