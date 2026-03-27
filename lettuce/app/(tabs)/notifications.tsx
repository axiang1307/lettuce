import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlaceholderScreen } from '@/components/placeholder/placeholder-screen';

/**
 * PLACEHOLDER: Notification list from design — wire to push/in-app later.
 */
export default function NotificationsTab() {
  return (
    <PlaceholderScreen title="Notifications" routeNote="app/(tabs)/notifications.tsx">
      <Text style={styles.empty}>No notifications yet.</Text>
      <View style={styles.hint}>
        <Text style={styles.hintText}>
          When friends invite you to events or groups, they will show up here.
        </Text>
      </View>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  hint: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  hintText: {
    fontSize: 14,
    color: '#9e9e9e',
    lineHeight: 21,
  },
});
