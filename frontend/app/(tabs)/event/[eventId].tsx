import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityPanel } from '@/components/event/activity-panel';
import { CalendarPanel } from '@/components/event/calendar-panel';
import { EventDetailsPanel } from '@/components/event/event-details-panel';
import { PollPanel } from '@/components/event/poll-panel';
import { Colors } from '@/constants/theme';
import { toDetailEvent } from '@/components/home/feed';
import { getHomeEventById, type EventFlowMode, type HomeFeedEvent } from '@/data/home-feed';
import { eventsRepo } from '@/lib/repositories/events';
import { groupsRepo } from '@/lib/repositories/groups';

export default function EventDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { eventId, mode, from } = useLocalSearchParams<{ eventId: string; mode?: string; from?: string }>();
  const mockEvent = eventId ? getHomeEventById(eventId) : undefined;
  // Real events: undefined = still loading, null = not found among the caller's events.
  const [realEvent, setRealEvent] = useState<HomeFeedEvent | null | undefined>(undefined);
  const event = mockEvent ?? realEvent ?? undefined;
  const initialMode = useMemo<EventFlowMode>(() => {
    if (mode === 'calendar' || mode === 'poll' || mode === 'activity') return mode;
    return 'detail';
  }, [mode]);
  const [flowMode, setFlowMode] = useState<EventFlowMode>(initialMode);

  // No GET /events/:id yet, so find the event among the caller's events. Only events the
  // caller participates in come back, which doubles as the access check.
  useEffect(() => {
    if (mockEvent || !eventId) return;
    Promise.all([eventsRepo.getEvents(), groupsRepo.getGroups()])
      .then(([events, groups]) => {
        const found = events.find((e) => e.id === eventId);
        const groupName = groups.find((g) => g.id === found?.group_id)?.name;
        setRealEvent(found ? toDetailEvent(found, groupName) : null);
      })
      .catch(() => setRealEvent(null));
  }, [eventId, mockEvent]);

  const handleBack = () => {
    if (flowMode !== 'detail') {
      setFlowMode('detail');
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace((from ?? '/(tabs)') as any);
    }
  };

  if (!event && realEvent === undefined && !mockEvent) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.light.tint} />
        </View>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Stack.Screen options={{ title: 'Event', headerShown: false }} />
        <View style={styles.centered}>
          <Text style={styles.muted}>No event found for id: {String(eventId)}</Text>
        </View>
      </>
    );
  }

  if (flowMode === 'detail') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <EventDetailsPanel
          event={event}
          onBack={handleBack}
          onOpenCalendar={() => setFlowMode('calendar')}
          onOpenPoll={() => setFlowMode('poll')}
          onOpenActivity={() => setFlowMode('activity')}
        />
      </>
    );
  }

  if (flowMode === 'calendar') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <CalendarPanel event={event} onBack={handleBack} onSendToPoll={() => setFlowMode('poll')} />
      </>
    );
  }

  const topPad = Math.max(insets.top - 6, 0);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={[styles.simpleHeader, { paddingTop: topPad + 8 }]}>
          <Pressable onPress={handleBack} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={30} color="#131313" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {flowMode === 'poll' ? 'Poll' : 'Activity'}
          </Text>
          <Text style={styles.headerSubtitle}>{event.title}</Text>
        </View>

        {flowMode === 'poll' ? (
          <PollPanel event={event} onSendToCalendar={() => setFlowMode('calendar')} />
        ) : null}

        {flowMode === 'activity' ? <ActivityPanel event={event} /> : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingBottom: 44,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  simpleHeader: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28.83,
    fontFamily: 'Montserrat',
    fontWeight: '600',
    lineHeight: 37.48,
    color: '#131313',
  },
  headerSubtitle: {
    fontSize: 18,
    lineHeight: 27,
    color: '#878787',
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
});
