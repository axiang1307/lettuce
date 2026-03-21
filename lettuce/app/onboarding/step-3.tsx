import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * PLACEHOLDER: final onboarding screen before the fake login gate.
 */
export default function OnboardingStep3() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* PLACEHOLDER: closing value prop + CTA to create account later */}
      <Text style={styles.body}>
        Vote on times, get reminders, and keep chats in sync. Ready to try it?
      </Text>
      <Text style={styles.placeholderTag}>[PLACEHOLDER] Onboarding step 3 of 3</Text>
      <Pressable
        style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        onPress={() => router.push('/login' as Href)}>
        <Text style={styles.primaryText}>Continue to login</Text>
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
