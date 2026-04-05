import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * PLACEHOLDER LOGIN — no validation, no accounts, no network.
 * Any non-empty tap on "Enter app" proceeds; empty fields are allowed too for quick testing.
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToApp = () => {
    // PLACEHOLDER: replace with real auth + session token later
    router.replace('/(tabs)' as Href);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
      <Text style={styles.hint}>
        [PLACEHOLDER] Fake login — type anything or nothing, then enter the app.
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={({ pressed }) => [styles.primary, pressed && styles.pressed]} onPress={goToApp}>
        <Text style={styles.primaryText}>Enter app</Text>
      </Pressable>

      {/* PLACEHOLDER: forgot password / sign up links */}
      <Text style={styles.footerNote}>[PLACEHOLDER] Forgot password & Sign up links go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
    gap: 12,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: '#fff',
  },
  primary: {
    backgroundColor: '#9cad50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  pressed: { opacity: 0.92 },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  footerNote: {
    marginTop: 24,
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
