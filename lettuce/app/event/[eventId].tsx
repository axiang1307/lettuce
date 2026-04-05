import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ParticipantsProfiles } from '@/components/home/participants-profiles';
import { Colors } from '@/constants/theme';
import { getHomeEventById } from '@/data/home-feed';

/**
 * Event detail — data from static home feed by id.
 * PLACEHOLDER: load from API by eventId when backend exists.
 */
export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const event = eventId ? getHomeEventById(eventId) : undefined;

  return (
    <>
      <Stack.Screen options={{ title: event?.title ?? 'Event' }} />
      {!event ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>[PLACEHOLDER] No event found for id: {String(eventId)}</Text>
        </View>
      ) : (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Image source={{ uri: event.imageUrl }} style={styles.heroImage} contentFit="cover" />
            <View style={styles.heroShade} />
            <View style={styles.heroBottom}>
              <ParticipantsProfiles avatars={event.participants.avatars} moreCount={event.participants.moreCount ?? 0} />
            </View>
          </View>

          <Text style={styles.kicker}>[PLACEHOLDER] {event.groupName}</Text>
          <Text style={styles.description}>{event.description}</Text>

          <Text style={styles.sectionTitle}>Details</Text>
          {event.detailBullets.map((line) => (
            <Text key={line} style={styles.bullet}>
              • {line}
            </Text>
          ))}

          {/* PLACEHOLDER: Edit event, share, open poll — wired in later */}
          <Text style={styles.footerNote}>
            [PLACEHOLDER] Actions: Remind / Vote / Schedule — not hooked up yet.
          </Text>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  muted: {
    color: '#6b7280',
    textAlign: 'center',
  },
  hero: {
    height: 220,
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroBottom: {
    position: 'absolute',
    left: 20,
    bottom: 16,
  },
  kicker: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9cad50',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131313',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  footerNote: {
    marginTop: 24,
    paddingHorizontal: 20,
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});
