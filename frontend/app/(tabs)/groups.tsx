import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cardImageFor } from '@/components/home/card-images';
import { HomeLogo } from '@/components/home/home-logo';
import { groupsRepo, type Group } from '@/lib/repositories/groups';

function GroupCard({ group, onPlanEvent }: { group: Group; onPlanEvent: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardImageWrap}>
        <Image source={cardImageFor(group.id)} style={styles.cardImage} contentFit="cover" />
        <View style={styles.imageShade} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {group.name}
        </Text>
        <View style={styles.cardBodyRow}>
          <View style={styles.cardDetails}>
            <Text style={styles.cardDetailText} numberOfLines={2}>
              {group.description ?? 'No description'}
            </Text>
          </View>
          <Pressable onPress={onPlanEvent} style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
            <Text style={styles.ctaText}>Plan Event</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function GroupsSearchBar({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) {
  return (
    <View style={styles.searchShell}>
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search"
        placeholderTextColor="#878787"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <MaterialIcons name="search" size={26} color="#878787" />
    </View>
  );
}

export default function GroupsTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadGroups = useCallback(() => {
    groupsRepo.getGroups()
      .then((mine) => {
        setGroups(mine);
        setLoadError(null);
      })
      .catch((err: Error) => setLoadError(err.message));
  }, []);

  // Refetch on focus so a group created on the create-group screen shows up on return.
  useFocusEffect(loadGroups);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!groups || !q) return groups ?? [];
    return groups.filter((g) => `${g.name} ${g.description ?? ''}`.toLowerCase().includes(q));
  }, [groups, searchQuery]);

  const goCreateGroup = () => router.push('/create-group' as Href);
  const planEvent = (groupId: string) =>
    router.push({ pathname: '/create-event', params: { groupId } } as Href);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 10 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <HomeLogo />
      </View>

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Your Groups</Text>
          <Pressable hitSlop={8} onPress={goCreateGroup}>
            <MaterialIcons name="add" size={32} color="#131313" />
          </Pressable>
        </View>
        <GroupsSearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      {loadError && groups === null ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>{loadError}</Text>
          <Pressable onPress={loadGroups} style={({ pressed }) => [pressed && styles.pressed]}>
            <Text style={styles.linkText}>Try again</Text>
          </Pressable>
        </View>
      ) : groups === null ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#9cad50" />
        </View>
      ) : groups.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You&apos;re not in any groups yet.</Text>
          <Pressable onPress={goCreateGroup} style={({ pressed }) => [pressed && styles.pressed]}>
            <Text style={styles.linkText}>Create a group</Text>
          </Pressable>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No groups match your search.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filtered.map((group) => (
            <GroupCard key={group.id} group={group} onPlanEvent={() => planEvent(group.id)} />
          ))}
        </View>
      )}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 88,
    gap: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  header: {
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 40 / 1.387,
    lineHeight: 37.48,
    fontWeight: '600',
    color: '#131313',
  },
  searchShell: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    minHeight: 50,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 27,
    color: '#131313',
    paddingVertical: 11,
    paddingRight: 8,
  },
  list: {
    gap: 16,
  },
  card: {
    width: '100%',
    minHeight: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cecece',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardImageWrap: {
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    ...StyleSheet.absoluteFill,
  },
  imageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 2,
  },
  cardTitle: {
    fontSize: 32 / 1.58,
    lineHeight: 26.33,
    fontWeight: '600',
    color: '#131313',
  },
  cardBodyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardDetails: {
    flex: 1,
    minHeight: 54,
  },
  cardDetailText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '400',
    color: '#373737',
  },
  cta: {
    height: 36,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#9cad50',
    backgroundColor: '#9cad50',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  centered: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#878787',
    textAlign: 'center',
  },
  linkText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#9cad50',
  },
  bottomPad: {
    height: 24,
  },
  pressed: {
    opacity: 0.95,
  },
});
