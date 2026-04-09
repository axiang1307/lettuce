import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LettuceLogo } from '@/components/onboarding/LettuceLogo';
import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { Colors, OnboardingFontFamily } from '@/constants/theme';

const OPTIONS = [
  'Schedule hangouts with friends',
  'Schedule group events',
  'Schedule virtual meetings',
  'Other',
];

export default function OnboardingUseCases() {
  const router = useRouter();
  const { firstName = '' } = useLocalSearchParams<{ firstName?: string }>();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (value: string) =>
    setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrap}>
        <LettuceLogo />
      </View>
      <View style={styles.progressWrap}>
        <OnboardingProgressBar currentStep={4} totalSteps={4} />
      </View>

      <View style={styles.contentWrap}>
        <View style={styles.headerWrap}>
          <Text style={styles.title}>
            What are you using <Text style={styles.highlight}>Lettuce</Text> for?
          </Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        <View style={styles.optionsWrap}>
          {OPTIONS.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <Pressable
                key={option}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionSelected,
                  pressed && styles.pressed,
                ]}
                onPress={() => toggle(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}

          <Pressable
            onPress={() =>
              router.push(
                {
                  pathname: '/onboarding/welcome',
                  params: { firstName },
                } as Href
              )
            }>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && styles.pressed]}
          onPress={() =>
            router.push(
              {
                pathname: '/onboarding/welcome',
                params: { firstName },
              } as Href
            )
          }>
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, alignItems: 'center' },
  logoWrap: { marginTop: 8, width: '100%' },
  progressWrap: { marginTop: 10, width: 300 },
  contentWrap: { marginTop: 48, width: 370, gap: 30 },
  headerWrap: { alignItems: 'center', gap: 16 },
  title: {
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.heading,
    fontSize: 28.83,
    lineHeight: 37.48,
    textAlign: 'center',
    width: '100%',
  },
  highlight: { color: Colors.light.tint },
  subtitle: {
    color: '#373737',
    fontFamily: OnboardingFontFamily.body,
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
  },
  optionsWrap: { gap: 24, width: '100%' },
  option: {
    alignItems: 'center',
    backgroundColor: '#eaf3f9',
    borderRadius: 8,
    minHeight: 62,
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  optionSelected: {
    backgroundColor: '#d8e8f4',
  },
  optionText: {
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
  },
  skip: {
    alignSelf: 'flex-end',
    color: Colors.light.onboarding.caption,
    fontFamily: OnboardingFontFamily.bodySemibold,
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 18,
    width: 370,
  },
  backBtn: {
    borderColor: Colors.light.tint,
    borderRadius: 32,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  nextBtn: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
    borderRadius: 32,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  backText: {
    color: Colors.light.tint,
    fontFamily: OnboardingFontFamily.bodySemibold,
    fontSize: 16,
    lineHeight: 24,
  },
  nextText: {
    color: '#fff',
    fontFamily: OnboardingFontFamily.bodySemibold,
    fontSize: 16,
    lineHeight: 24,
  },
  pressed: { opacity: 0.92 },
});
