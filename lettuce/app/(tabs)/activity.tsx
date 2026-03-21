import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlaceholderScreen } from '@/components/placeholder/placeholder-screen';
import { PLACEHOLDER_ACTIVITY_POPULAR } from '@/data/placeholders';

/**
 * PLACEHOLDER: Popular / Previously / Saved rails from Figma.
 */
export default function ActivityTab() {
  return (
    <PlaceholderScreen title="Activity" routeNote="app/(tabs)/activity.tsx">
      <Text style={styles.sectionLabel}>[PLACEHOLDER] Popular</Text>
      {PLACEHOLDER_ACTIVITY_POPULAR.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowSub}>{item.subtitle}</Text>
        </View>
      ))}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>[PLACEHOLDER] Previously</Text>
      <Text style={styles.empty}>[PLACEHOLDER] No static rows yet</Text>
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>[PLACEHOLDER] Saved</Text>
      <Text style={styles.empty}>[PLACEHOLDER] No static rows yet</Text>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  row: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  rowTitle: { fontSize: 16, fontWeight: '600', color: '#111' },
  rowSub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  empty: { fontSize: 14, color: '#9ca3af', fontStyle: 'italic' },
});
