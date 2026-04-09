import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, OnboardingFontFamily } from '@/constants/theme';

type OnboardingProgressBarProps = {
  currentStep: number;
  totalSteps?: number;
  darkLabel?: boolean;
};

export function OnboardingProgressBar({
  currentStep,
  totalSteps = 4,
  darkLabel = false,
}: OnboardingProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={`step-${i}`}
            style={[
              styles.segment,
              i === 0 && styles.firstSegment,
              i === totalSteps - 1 && styles.lastSegment,
              i < currentStep && styles.segmentActive,
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, darkLabel && styles.labelDark]}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
  },
  track: {
    backgroundColor: Colors.light.onboarding.progressTrack,
    borderRadius: 16,
    height: 8,
    paddingHorizontal: 2,
    flexDirection: 'row',
    gap: 1,
  },
  segment: {
    flex: 1,
    borderRadius: 16,
    height: 5,
  },
  firstSegment: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  lastSegment: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  segmentActive: {
    backgroundColor: Colors.light.onboarding.progressFill,
  },
  label: {
    color: Colors.light.onboarding.caption,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
  },
  labelDark: {
    color: Colors.light.onboarding.title,
  },
});
