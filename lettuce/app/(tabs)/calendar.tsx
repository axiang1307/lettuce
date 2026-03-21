import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlaceholderScreen } from '@/components/placeholder/placeholder-screen';

/**
 * PLACEHOLDER: Month grid + availability overlay + “Picnic at the Arb” style calendar.
 */
export default function CalendarTab() {
  return (
    <PlaceholderScreen title="Calendar" routeNote="app/(tabs)/calendar.tsx">
      <View style={styles.mock}>
        <Text style={styles.mockLabel}>[PLACEHOLDER] Month header</Text>
        <Text style={styles.h2}>December 2025</Text>
      </View>
      <View style={styles.mock}>
        <Text style={styles.mockLabel}>[PLACEHOLDER] Time grid / AI slots</Text>
        <Text style={styles.body}>
          Static grid will go here. Synced free/busy + suggested slots are not implemented.
        </Text>
      </View>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  mock: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  mockLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9cad50',
    marginBottom: 8,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  body: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
});
