import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * PLACEHOLDER: Welcome step — marketing copy and illustration TBD.
 */
export default function OnboardingWelcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* PLACEHOLDER: final hero headline from design */}
      <Text style={styles.lead}>Plan hangouts without the chaos.</Text>
      <Text style={styles.placeholderTag}>[PLACEHOLDER] Onboarding step 1 of 3</Text>
      <Pressable
        style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        onPress={() => router.push('/onboarding/step-2' as Href)}>
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
    gap: 20,
    backgroundColor: Colors.light.background,
  },
  lead: {
    fontSize: 26,
    fontWeight: '700',
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
    marginTop: 12,
  },
  pressed: { opacity: 0.92 },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
