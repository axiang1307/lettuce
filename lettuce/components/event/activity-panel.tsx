import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { ActivityCard, HomeFeedEvent } from '@/data/home-feed';

type ActivityPanelProps = {
  event: HomeFeedEvent;
};

function ActivityCardItem({ item, cta }: { item: ActivityCard; cta: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={item.imageUrl} style={styles.cardImage} contentFit="cover" />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        <View style={styles.ctaWrap}>
          <Text style={styles.ctaText}>{cta}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function ActivitySection({ title, data, cta }: { title: string; data: ActivityCard[]; cta: string }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialIcons name="arrow-forward" size={22} color="#131313" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {data.map((item) => (
          <ActivityCardItem key={item.id} item={item} cta={cta} />
        ))}
      </ScrollView>
    </View>
  );
}

export function ActivityPanel({ event }: ActivityPanelProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.searchShell}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#878787"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <MaterialIcons name="search" size={24} color="#878787" />
      </View>

      <ActivitySection title="Popular" data={event.activity.popular} cta="Add to Event" />
      <ActivitySection title="Previously" data={event.activity.previous} cta="Add to Event" />
      <ActivitySection title="Saved" data={event.activity.saved} cta="Add to Event" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 24,
  },
  searchShell: {
    minHeight: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 27,
    color: '#131313',
    paddingVertical: 10,
    paddingRight: 8,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 32 / 1.58,
    lineHeight: 29.61,
    fontWeight: '600',
    color: '#131313',
  },
  row: {
    gap: 16,
    paddingRight: 16,
  },
  card: {
    width: 188,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cecece',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 88,
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  cardTitle: {
    fontSize: 32 / 1.58,
    lineHeight: 26.3,
    fontWeight: '600',
    color: '#131313',
  },
  cardSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#878787',
  },
  ctaWrap: {
    marginTop: 8,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#9cad50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.95,
  },
});
