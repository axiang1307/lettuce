import { Href, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { filterHomeEventsByQuery, HOME_FEED_EVENTS, type HomeFeedEvent } from '@/data/home-feed';

import { EventCard } from './event-card';
import { HomeLogo } from './home-logo';
import { SearchBar } from './search-bar';

export function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(
    () => filterHomeEventsByQuery(HOME_FEED_EVENTS, searchQuery),
    [searchQuery],
  );

  const upcomingCards = useMemo(
    () => filtered.filter((e) => e.section === 'upcoming'),
    [filtered],
  );
  const catchupCards = useMemo(
    () => filtered.filter((e) => e.section === 'catchup'),
    [filtered],
  );

  const openEvent = (event: HomeFeedEvent) => {
    router.push(`/event/${event.id}` as Href);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <HomeLogo />
      </View>

      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Joy!</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search events, places, people…" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        {upcomingCards.length === 0 ? (
          <Text style={styles.emptyHint}>
            {searchQuery.trim() ? 'No upcoming events match your search.' : 'No upcoming events.'}
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
                participants={card.participants}
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
            {searchQuery.trim() ? 'No catch-up events match your search.' : 'No catch-up suggestions.'}
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
                participants={card.participants}
                onPress={() => openEvent(card)}
              />
            ))}
          </ScrollView>
        )}
      </View>

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
    paddingTop: 0,
    paddingBottom: 96, // keep content visible above the tab bar
    gap: 24,
  },
  logoContainer: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  header: {
    gap: 16,
    alignItems: 'center',
  },
  greeting: {
    width: '100%',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '600',
    color: '#131313',
  },
  section: {
    gap: 20,
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
  emptyHint: {
    fontSize: 15,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
