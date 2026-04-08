import { Image } from 'expo-image';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LettuceLogo } from '@/components/onboarding/LettuceLogo';
import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { Colors, OnboardingFontFamily } from '@/constants/theme';

const IMG_CALENDAR_PAGE = require('@/assets/images/onboarding/welcome-calendar-page.png');
const IMG_EVENT_PAGE = require('@/assets/images/onboarding/welcome-event-page.png');
const IMG_POLL_PAGE = require('@/assets/images/onboarding/welcome-poll-page.png');
const IMG_HOME_PAGE = require('@/assets/images/onboarding/welcome-home-page.png');

export default function OnboardingWelcomeDone() {
  const router = useRouter();
  const { firstName = '' } = useLocalSearchParams<{ firstName?: string }>();
  const displayName = firstName.trim().length > 0 ? firstName.trim() : 'there';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrap}>
        <LettuceLogo />
      </View>
      <View style={styles.progressWrap}>
        <OnboardingProgressBar currentStep={4} totalSteps={4} darkLabel />
      </View>

      <View style={styles.contentWrap}>
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Welcome, {displayName}!</Text>
          <Text style={styles.subtitle}>Let&apos;s get scheduling!</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.stackBackground}>
            <Image source={IMG_EVENT_PAGE} style={styles.floatingTop} contentFit="cover" />
            <Image source={IMG_POLL_PAGE} style={styles.floatingBottom} contentFit="cover" />
            <Image source={IMG_CALENDAR_PAGE} style={styles.floatingCenter} contentFit="cover" />
          </View>
          <Image source={IMG_HOME_PAGE} style={styles.frontPhone} contentFit="cover" />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && styles.pressed]}
          onPress={() => router.replace('/(tabs)' as Href)}>
          <Text style={styles.nextText}>Get started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, alignItems: 'center' },
  logoWrap: { marginTop: 8, width: '100%' },
  progressWrap: { marginTop: 10, width: 300 },
  contentWrap: { alignItems: 'center', gap: 30, marginTop: 48 },
  headerWrap: { alignItems: 'center', gap: 16, width: 370 },
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
  },
  heroWrap: { alignItems: 'center', height: 399, justifyContent: 'center', width: 323 },
  stackBackground: { position: 'absolute', right: 24, top: 10, transform: [{ rotate: '27deg' }] },
  floatingTop: {
    borderRadius: 8,
    height: 150,
    left: 82,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    top: 0,
    width: 74,
  },
  floatingBottom: {
    borderRadius: 8,
    height: 150,
    left: 6,
    position: 'absolute',
    top: 44,
    width: 74,
  },
  floatingCenter: {
    borderRadius: 8,
    height: 150,
    left: 82,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    top: 156,
    width: 74,
  },
  frontPhone: {
    borderRadius: 24,
    height: 279,
    left: 30,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    top: 86,
    width: 138,
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
