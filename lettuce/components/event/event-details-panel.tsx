import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { HomeFeedEvent } from '@/data/home-feed';

import { ParticipantsProfiles } from '../home/participants-profiles';

type EventDetailsPanelProps = {
  event: HomeFeedEvent;
  onOpenCalendar: () => void;
  onOpenPoll: () => void;
  onOpenActivity: () => void;
};

function DetailAction({
  label,
  status,
  onPress,
  highlighted = false,
}: {
  label: string;
  status?: string;
  onPress: () => void;
  highlighted?: boolean;
}) {
  return (
    <View style={styles.actionWrap}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.action, highlighted && styles.actionHighlighted, pressed && styles.pressed]}>
        <Text style={styles.actionText}>{label}</Text>
        <MaterialIcons name="arrow-forward" size={24} color="#131313" />
      </Pressable>
      {status ? <Text style={[styles.actionStatus, highlighted && styles.actionStatusHighlighted]}>{status}</Text> : null}
    </View>
  );
}

export function EventDetailsPanel({ event, onOpenCalendar, onOpenPoll, onOpenActivity }: EventDetailsPanelProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{event.title}</Text>
        <MaterialIcons name="edit" size={24} color="#131313" />
      </View>

      <View style={styles.meta}>
        {event.details.map((line) => (
          <Text key={line} style={styles.metaText}>
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>3 total</Text>
        <View style={styles.participantsRow}>
          <ParticipantsProfiles
            avatars={event.participants.avatars.slice(0, 3)}
            variant="detailed"
            statusIcons={['confirmed', 'rejected', 'none']}
          />
          <View style={styles.addCircle}>
            <MaterialIcons name="add" size={32} color="#9cad50" />
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Event Details</Text>
      <View style={styles.actionsList}>
        <DetailAction label="Calendar" onPress={onOpenCalendar} />
        <DetailAction label="Poll" status="Vote Pending" onPress={onOpenPoll} highlighted />
        <DetailAction label="Activity" onPress={onOpenActivity} />
      </View>

      <View style={styles.divider} />

      <Pressable onPress={onOpenActivity} style={({ pressed }) => [styles.photoRow, pressed && styles.pressed]}>
        <Text style={styles.sectionTitle}>Photo Album</Text>
        <MaterialIcons name="arrow-forward" size={22} color="#131313" />
      </Pressable>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Pressable style={({ pressed }) => [styles.leaveBtn, pressed && styles.pressed]}>
          <Text style={styles.leaveText}>Leave Event</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 40 / 1.387,
    lineHeight: 37.5,
    fontWeight: '600',
    color: '#131313',
    flex: 1,
    marginRight: 12,
  },
  meta: {
    gap: 8,
  },
  metaText: {
    fontSize: 18,
    lineHeight: 27,
    color: '#131313',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#d7d7d7',
  },
  participantsSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 30 / 1.58,
    lineHeight: 27,
    fontWeight: '600',
    color: '#131313',
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#f0f2e3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e4e4e4',
  },
  actionsList: {
    gap: 10,
  },
  actionWrap: {
    gap: 2,
    minHeight: 74,
  },
  action: {
    borderRadius: 8,
    backgroundColor: '#eaf3f9',
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  actionHighlighted: {
    borderWidth: 2,
    borderColor: '#6096c3',
  },
  actionText: {
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '600',
    color: '#131313',
  },
  actionStatus: {
    fontSize: 12,
    lineHeight: 18,
    color: '#b6cfe3',
  },
  actionStatusHighlighted: {
    color: '#6096c3',
  },
  photoRow: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    alignItems: 'flex-end',
  },
  leaveBtn: {
    height: 36,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#ec5037',
    backgroundColor: '#ec5037',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  leaveText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.95,
  },
});
