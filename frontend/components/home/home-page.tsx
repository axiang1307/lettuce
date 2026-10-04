import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { profilesRepo, type Profile } from '@/lib/repositories/profiles';
import { eventsRepo } from '@/lib/repositories/events';
import { groupsRepo } from '@/lib/repositories/groups';

import { Colors } from '@/constants/theme';

import { EventCard } from './event-card';
import { filterFeedCards, sortBySoonest, toFeedCard, type FeedCard } from './feed';
import { HomeLogo } from './home-logo';
import { SearchBar } from './search-bar';

export function HomePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState<FeedCard[] | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadFeed = useCallback(() => {
    // Events only carry group_id, so fetch the caller's groups too and look names up by id.
    Promise.all([eventsRepo.getEvents(), groupsRepo.getGroups()])
      .then(([events, groups]) => {
        const groupNames = new Map(groups.map((g) => [g.id, g.name]));
        setCards(sortBySoonest(events).map((e) => toFeedCard(e, groupNames.get(e.group_id))));
        setFeedError(null);
      })
      .catch((err: Error) => setFeedError(err.message));
  }, []);

  // Refetch on focus: tabs stay mounted, so changes made on other screens (a new event,
  // an edited name) wouldn't show otherwise.
  useFocusEffect(
    useCallback(() => {
      profilesRepo.getMe()
        .then(setProfile)
        .catch(() => {}); // silently fail — greeting just won't show
      loadFeed();
    }, [loadFeed])
  );

  const openEvent = (card: FeedCard) => {
    router.push({
      pathname: '/(tabs)/event/[eventId]',
      params: { eventId: card.id, from: '/(tabs)' },
    } as Href);
  };

  const filtered = useMemo(() => filterFeedCards(cards ?? [], searchQuery), [cards, searchQuery]);
  const upcomingCards = useMemo(() => filtered.filter((c) => c.section === 'upcoming'), [filtered]);
  const catchupCards = useMemo(() => filtered.filter((c) => c.section === 'catchup'), [filtered]);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 10 }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <HomeLogo />
      </View>

      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {firstName}!</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search" />
      </View>

      {feedError && cards === null ? (
        <View style={styles.centered}>
          <Text style={styles.emptyHint}>{feedError}</Text>
          <Pressable onPress={loadFeed} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
            <Text style={styles.linkText}>Try again</Text>
          </Pressable>
        </View>
      ) : cards === null ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.light.tint} />
        </View>
      ) : (
        <View style={styles.cardsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {upcomingCards.length === 0 ? (
              <Text style={styles.emptyHint}>
                {searchQuery.trim() ? 'No upcoming events match your search.' : 'No upcoming events. Plan one from a group on the Groups tab.'}
              </Text>
            ) : (
              <View style={styles.upcomingList}>
                {upcomingCards.map((card) => (
                  <EventCard
                    key={card.id}
                    variant="upcoming"
                    imageUrl={card.imageUrl}
                    title={card.title}
                    details={card.details}
                    statusLabel={card.statusLabel}
                    ctaLabel={card.ctaLabel}
                    participants={{ avatars: [] }}
                    onPress={() => openEvent(card)}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>It’s been a while. Catch up?</Text>

            {catchupCards.length === 0 ? (
              <Text style={styles.emptyHint}>
                {searchQuery.trim() ? 'No past events match your search.' : 'Past events will show up here.'}
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catchupRow}>
                {catchupCards.map((card) => (
                  <EventCard
                    key={card.id}
                    variant="catchup"
                    imageUrl={card.imageUrl}
                    title={card.title}
                    details={card.details}
                    statusLabel={card.statusLabel}
                    ctaLabel={card.ctaLabel}
                    participants={{ avatars: [] }}
                    onPress={() => openEvent(card)}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      )}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 96, // keep content visible above the tab bar
    gap: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  header: {
    gap: 16,
    alignItems: 'center',
  },
  greeting: {
    width: '100%',
    fontSize: 28.83,
    lineHeight: 37.48,
    fontWeight: '600',
    color: '#131313',
  },
  section: {
    gap: 20,
  },
  cardsContainer: {
    gap: 40,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    color: '#3f4620',
  },
  upcomingList: {
    gap: 25,
  },
  catchupRow: {
    gap: 23,
    paddingRight: 16,
  },
  bottomPad: {
    height: 20,
  },
  centered: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
  },
  linkText: {
    color: Colors.light.tint,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 15,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
