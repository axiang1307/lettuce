import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

import { EventCard } from './event-card';
import { HomeLogo } from './home-logo';
import { SearchBar } from './search-bar';
const imgProfile2 = 'https://www.figma.com/api/mcp/asset/294a0030-7ae0-4bdd-ad95-c18f46b6134d';
const imgProfile4 = 'https://www.figma.com/api/mcp/asset/760d2f16-ead7-4e62-8017-273cf0eb4bf1';
const imgProfile = 'https://www.figma.com/api/mcp/asset/01b3f278-3258-4e2e-8892-7bb473cee84b';
const imgProfile1 = 'https://www.figma.com/api/mcp/asset/294a0030-7ae0-4bdd-ad95-c18f46b6134d';
const imgProfile3 = 'https://www.figma.com/api/mcp/asset/c69a1979-3217-43b3-869b-e4009cdb6e01';
const imgProfile5 = 'https://www.figma.com/api/mcp/asset/b9a95cba-39be-43ce-bad6-86f3cd9c6c11';

const imgCardImage = 'https://www.figma.com/api/mcp/asset/f938f660-0338-4841-a352-35c99be2b4ff';
const imgCardImage1 = 'https://www.figma.com/api/mcp/asset/6df2dfd0-9302-4a59-960e-f18d4f797e45';
const imgCardImage2 = 'https://www.figma.com/api/mcp/asset/80a5723a-b863-4676-9b39-fca1a9167dd5';
const imgCardImage3 = 'https://www.figma.com/api/mcp/asset/d8b0be7e-8ed8-4d01-9b17-a098e033ca72';
const imgCardImage4 = 'https://www.figma.com/api/mcp/asset/ec69c636-25ce-474e-b5fa-4041c93c88b3';

export function HomePage() {
  const upcomingCards: Array<{
    imageUrl: string;
    title: string;
    details: string[];
    statusLabel?: string;
    ctaLabel: string;
    participants: { avatars: string[]; moreCount?: number };
  }> = [
    {
      imageUrl: imgCardImage,
      title: "Lana's Birthday Party",
      details: ['Texas Roadhouse', 'Sunday, 12/07 - 1pm', 'PARTY!!'],
      ctaLabel: 'Remind',
      participants: { avatars: [imgProfile, imgProfile2, imgProfile4], moreCount: 2 },
    },
    {
      imageUrl: imgCardImage1,
      title: 'Picnic at the Arb',
      details: ['Nichols Arboretum', 'TBD', 'Picnicking'],
      statusLabel: 'Planning',
      ctaLabel: 'Vote',
      participants: { avatars: [imgProfile2, imgProfile4], moreCount: 0 },
    },
  ];

  const catchupCards: Array<{
    imageUrl: string;
    title: string;
    details: string[];
    statusLabel?: string;
    ctaLabel: string;
    participants: { avatars: string[]; moreCount?: number };
  }> = [
    {
      imageUrl: imgCardImage2,
      title: 'The 3 Goons',
      details: ['Sunday, 11/01', 'With @Sydney @Will'],
      statusLabel: '1 mo. ago',
      ctaLabel: 'Schedule Meetup',
      participants: { avatars: [imgProfile2, imgProfile4], moreCount: 0 },
    },
    {
      imageUrl: imgCardImage3,
      title: 'Boba Date',
      details: ['Friday, 10/17', 'With @Angie'],
      statusLabel: '1.5 mo. ago',
      ctaLabel: 'Schedule Meetup',
      participants: { avatars: [imgProfile, imgProfile1], moreCount: 0 },
    },
    {
      imageUrl: imgCardImage4,
      title: 'Tea Time',
      details: ['Sunday, 10/05', 'With @Emily @Jane'],
      statusLabel: '2 mo. ago',
      ctaLabel: 'Schedule Meetup',
      participants: { avatars: [imgProfile5, imgProfile1, imgProfile3], moreCount: 0 },
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <HomeLogo />
      </View>

      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Joy!</Text>
        <SearchBar />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        <View style={styles.upcomingList}>
          {upcomingCards.map((card) => (
            <EventCard
              key={card.title}
              variant="upcoming"
              imageUrl={card.imageUrl}
              title={card.title}
              details={card.details}
              statusLabel={card.statusLabel}
              ctaLabel={card.ctaLabel}
              participants={card.participants}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>It’s been a while. Catch up?</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catchupRow}>
          {catchupCards.map((card) => (
            <EventCard
              key={card.title}
              variant="catchup"
              imageUrl={card.imageUrl}
              title={card.title}
              details={card.details}
              statusLabel={card.statusLabel}
              ctaLabel={card.ctaLabel}
              participants={card.participants}
            />
          ))}
        </ScrollView>
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
});

