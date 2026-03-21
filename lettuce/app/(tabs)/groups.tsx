import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlaceholderScreen } from '@/components/placeholder/placeholder-screen';
import { PLACEHOLDER_GROUPS } from '@/data/placeholders';

/**
 * PLACEHOLDER: Groups list + scheduled/planning sections from design.
 */
export default function GroupsTab() {
  return (
    <PlaceholderScreen title="Your Groups" routeNote="app/(tabs)/groups.tsx">
      {PLACEHOLDER_GROUPS.map((g) => (
        <View key={g.id} style={styles.card}>
          <Text style={styles.cardTitle}>{g.name}</Text>
          <Text style={styles.cardMeta}>
            [PLACEHOLDER] {g.memberIds.length} members — IDs: {g.memberIds.join(', ')}
          </Text>
        </View>
      ))}
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  cardMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6,
  },
});
