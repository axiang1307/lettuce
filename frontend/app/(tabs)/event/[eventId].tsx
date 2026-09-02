import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityPanel } from '@/components/event/activity-panel';
import { CalendarPanel } from '@/components/event/calendar-panel';
import { EventDetailsPanel } from '@/components/event/event-details-panel';
import { PollPanel } from '@/components/event/poll-panel';
import { Colors } from '@/constants/theme';
import { getHomeEventById, type EventFlowMode } from '@/data/home-feed';

export default function EventDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { eventId, mode, from } = useLocalSearchParams<{ eventId: string; mode?: string; from?: string }>();
  const event = eventId ? getHomeEventById(eventId) : undefined;
  const initialMode = useMemo<EventFlowMode>(() => {
    if (mode === 'calendar' || mode === 'poll' || mode === 'activity') return mode;
    return 'detail';
  }, [mode]);
  const [flowMode, setFlowMode] = useState<EventFlowMode>(initialMode);

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
