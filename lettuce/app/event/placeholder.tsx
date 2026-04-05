import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * Temporary destination for event taps from the home feed until the real detail flow exists.
 */
export default function EventPlaceholderScreen() {
  const { title } = useLocalSearchParams<{ title?: string }>();

  return (
    <>
      <Stack.Screen options={{ title: title ?? 'Event', headerBackTitle: 'Back' }} />
      <View style={styles.screen}>
        <Text style={styles.kicker}>Placeholder</Text>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.body}>
          Full event details, actions, and scheduling will appear on this screen in a later build.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 24,
    paddingTop: 16,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9cad50',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#131313',
    marginBottom: 16,
    lineHeight: 30,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6b7280',
  },
});
