import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlaceholderScreen } from '@/components/placeholder/placeholder-screen';
import { PLACEHOLDER_USER } from '@/data/placeholders';

/**
 * PLACEHOLDER: Profile header, stats, calendar snapshot, past events.
 */
export default function ProfileTab() {
  return (
    <PlaceholderScreen title="Profile" routeNote="app/(tabs)/profile.tsx">
      <View style={styles.header}>
        <Text style={styles.name}>{PLACEHOLDER_USER.displayName}</Text>
        <Text style={styles.handle}>{PLACEHOLDER_USER.handle}</Text>
        <Text style={styles.stats}>
          [PLACEHOLDER] Friends · Groups · Meetups counts (static: 5 / 2 / 10)
        </Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Your Calendar</Text>
        <Text style={styles.blockBody}>
          [PLACEHOLDER] Mini calendar preview — same data as Calendar tab later.
        </Text>
      </View>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  handle: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 4,
  },
  stats: {
    marginTop: 12,
    fontSize: 14,
    color: '#4b5563',
  },
  block: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  blockTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  blockBody: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
