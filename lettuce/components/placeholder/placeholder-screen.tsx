import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/theme';

type PlaceholderScreenProps = {
  title: string;
  /** Short route or feature id for dev clarity */
  routeNote: string;
  children?: React.ReactNode;
};

/**
 * Standard wrapper for Phase 1 static screens.
 * PLACEHOLDER: swap for real layouts + data hooks later.
 */
export function PlaceholderScreen({ title, routeNote, children }: PlaceholderScreenProps) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{title}</Text>
      {/* PLACEHOLDER: remove the gray banner row when this screen is fully built */}
      <Text style={styles.note}>
        [PLACEHOLDER] Static UI only — {routeNote}
      </Text>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  note: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
});
