import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityPanel } from '@/components/event/activity-panel';
import { CalendarPanel } from '@/components/event/calendar-panel';
import { EventDetailsPanel } from '@/components/event/event-details-panel';
import { EventFlowHeader } from '@/components/event/event-flow-header';
import { PollPanel } from '@/components/event/poll-panel';
import { Colors } from '@/constants/theme';
import { getHomeEventById, type EventFlowMode } from '@/data/home-feed';

/**
 * Event flow route — toggles detail, calendar, poll, and activity states from one screen.
 * PLACEHOLDER: move to backend-driven state in future slices.
 */
export default function EventDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { eventId, mode } = useLocalSearchParams<{ eventId: string; mode?: string }>();
  const event = eventId ? getHomeEventById(eventId) : undefined;
  const initialMode = useMemo<EventFlowMode>(() => {
    if (mode === 'calendar' || mode === 'poll' || mode === 'activity') {
      return mode;
    }
    return 'detail';
  }, [mode]);
  const [flowMode, setFlowMode] = useState<EventFlowMode>(initialMode);

  const titleByMode = {
    detail: event?.title ?? 'Event',
    calendar: `${event?.title ?? 'Event'} Calendar`,
    poll: 'Poll',
    activity: 'Activity',
  };

  const subtitleByMode = {
    detail: undefined,
    calendar: undefined,
    poll: event?.title ?? '',
    activity: event?.title ?? '',
  };

  const handleBack = () => {
    if (flowMode !== 'detail') {
      setFlowMode('detail');
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/groups');
  };

  return (
    <>
      <Stack.Screen options={{ title: event?.title ?? 'Event', headerShown: false }} />
      {!event ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>No event found for id: {String(eventId)}</Text>
        </View>
      ) : (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <EventFlowHeader
            event={event}
            title={titleByMode[flowMode]}
            subtitle={subtitleByMode[flowMode]}
            onBack={handleBack}
            showImage={flowMode !== 'activity' && flowMode !== 'poll'} 
            showTitle={flowMode !== 'detail'}
            showParticipants={flowMode !== 'detail' && flowMode !== 'activity'}
            topInset={Math.max(insets.top - 6, 0)}
            fullBleed
          />

          {flowMode === 'detail' ? (
            <EventDetailsPanel
              event={event}
              onOpenCalendar={() => setFlowMode('calendar')}
              onOpenPoll={() => setFlowMode('poll')}
              onOpenActivity={() => setFlowMode('activity')}
            />
          ) : null}

          {flowMode === 'calendar' ? (
            <CalendarPanel
              event={event}
              onSendToPoll={() => {
                setFlowMode('poll');
              }}
            />
          ) : null}

          {flowMode === 'poll' ? (
            <PollPanel
              event={event}
              onSendToCalendar={() => {
                setFlowMode('calendar');
              }}
            />
          ) : null}

          {flowMode === 'activity' ? <ActivityPanel event={event} /> : null}
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
    paddingBottom: 44,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
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
