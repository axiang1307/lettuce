import { MaterialIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LettuceLogo } from '@/components/onboarding/LettuceLogo';
import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { Colors, OnboardingFontFamily } from '@/constants/theme';

function OptionRow({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.option, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.optionInner}>
        {icon}
        <Text style={styles.optionText}>{label}</Text>
      </View>
    </Pressable>
  );
}

export default function OnboardingCalendarSync() {
  const router = useRouter();
  const { firstName = '' } = useLocalSearchParams<{ firstName?: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrap}>
        <LettuceLogo />
      </View>
      <View style={styles.progressWrap}>
        <OnboardingProgressBar currentStep={4} totalSteps={5} />
      </View>

      <View style={styles.contentWrap}>
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Sync your calendar!</Text>
          <Text style={styles.subtitle}>
            Sync your calendar so we can help you find the best time to meet up!
          </Text>
        </View>

        <View style={styles.optionsWrap}>
          <OptionRow
            label="Google Calendar"
            icon={<MaterialIcons name="calendar-today" size={20} color="#4285F4" />}
            onPress={() => undefined}
          />
          <OptionRow
            label="Outlook Calendar"
            icon={<MaterialIcons name="mail-outline" size={20} color="#0078D4" />}
            onPress={() => undefined}
          />
          <OptionRow label="Manually Add Calendar" onPress={() => undefined} />

          <Pressable
            onPress={() =>
              router.push(
                {
                  pathname: '/onboarding/use-cases',
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
                pathname: '/onboarding/use-cases',
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
  contentWrap: { marginTop: 48, width: 371, gap: 30 },
  headerWrap: { alignItems: 'center', gap: 16 },
  title: {
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.heading,
    fontSize: 28.83,
    lineHeight: 37.48,
    textAlign: 'center',
  },
  subtitle: {
    color: '#373737',
    fontFamily: OnboardingFontFamily.body,
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
    width: 296,
  },
  optionsWrap: { gap: 20, width: '100%' },
  option: {
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
  optionInner: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'center' },
  optionText: {
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 18,
    lineHeight: 27,
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
