import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * PLACEHOLDER: "Connect calendar / friends" style step — no real integrations yet.
 */
export default function OnboardingStep2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* PLACEHOLDER: explain calendar sync + friend discovery */}
      <Text style={styles.body}>
        Sync calendars and see when your people are free. (Not connected in this build.)
      </Text>
      <Text style={styles.placeholderTag}>[PLACEHOLDER] Onboarding step 2 of 3</Text>
      <Pressable
        style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        onPress={() => router.push('/onboarding/step-3' as Href)}>
        <Text style={styles.primaryText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
    backgroundColor: Colors.light.background,
  },
  body: {
    fontSize: 17,
    lineHeight: 24,
    color: Colors.light.text,
  },
  placeholderTag: {
    fontSize: 14,
    color: '#6b7280',
  },
  primary: {
    backgroundColor: '#9cad50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  pressed: { opacity: 0.92 },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
