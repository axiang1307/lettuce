import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeLogo } from '@/components/home/home-logo';

const IMG = {
  scheduled: require('@/assets/images/figma-home/home-card-1.png'),
  planningOne: require('@/assets/images/figma-home/home-card-2.png'),
  planningTwo: require('@/assets/images/figma-home/home-card-3.png'),
  avatarA: require('@/assets/images/figma-home/home-avatar-default.png'),
  avatarB: require('@/assets/images/figma-home/home-avatar-1.png'),
  avatarC: require('@/assets/images/figma-home/home-avatar-2.png'),
  avatarD: require('@/assets/images/figma-home/home-avatar-3.png'),
  avatarE: require('@/assets/images/figma-home/home-avatar-4.png'),
  avatarF: require('@/assets/images/figma-home/home-avatar-5.png'),
  avatarG: require('@/assets/images/figma-home/home-avatar-6.png'),
  avatarH: require('@/assets/images/figma-profile/profile-p1.png'),
};

type GroupsCardProps = {
  eventId?: string;
  imageUrl: any;
  title: string;
  details: [string, string, string];
  cta: string;
  status?: string;
  avatars: any[];
  plusCount?: number;
  onPress?: () => void;
  onCtaPress?: () => void;
};

function AvatarStack({ avatars, plusCount = 0 }: { avatars: any[]; plusCount?: number }) {
  return (
    <View style={styles.avatarsWrap}>
      <View style={styles.avatars}>
        {avatars.map((source, idx) => (
          <View key={`${idx}`} style={[styles.avatar, idx > 0 && styles.avatarOverlap]}>
            <Image source={source} style={styles.avatarImage} contentFit="cover" />
          </View>
        ))}
      </View>
      {plusCount > 0 ? (
        <View style={styles.plusWrap}>
          <MaterialIcons name="add" size={18} color="#f0f2e3" />
          <Text style={styles.plusText}>{plusCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

function GroupsCard({ imageUrl, title, details, cta, status, avatars, plusCount = 0, onPress, onCtaPress }: GroupsCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.cardImageWrap}>
        <Image source={imageUrl} style={styles.cardImage} contentFit="cover" />
        <View style={styles.imageShade} />
        {status ? (
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        ) : null}
        <View style={styles.avatarOverlay}>
          <AvatarStack avatars={avatars} plusCount={plusCount} />
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.cardBodyRow}>
          <View style={styles.cardDetails}>
            <Text style={styles.cardDetailText}>{details[0]}</Text>
            <Text style={styles.cardDetailText}>{details[1]}</Text>
            <Text style={styles.cardDetailText}>{details[2]}</Text>
          </View>
          <Pressable onPress={onCtaPress} style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
            <Text style={styles.ctaText}>{cta}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function GroupsSearchBar() {
  return (
    <View style={styles.searchShell}>
      <TextInput
        style={styles.searchInput}
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
  const openEvent = (eventId: string, mode?: 'detail' | 'calendar' | 'poll' | 'activity') => {
    router.push({
      pathname: '/event/[eventId]',
      params: { eventId, ...(mode ? { mode } : {}) },
    } as Href);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 10 }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <HomeLogo />
      </View>

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Your Groups</Text>
          <Pressable hitSlop={8}>
            <MaterialIcons name="add" size={32} color="#131313" />
          </Pressable>
        </View>
        <GroupsSearchBar />
      </View>

      <View style={styles.sections}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scheduled</Text>
          <GroupsCard
            eventId="evt-1"
            imageUrl={IMG.scheduled}
            title="Lana's Birthday Party"
            details={['Texas Roadhouse', 'Sunday, 12/07 - 1pm', 'PARTY!!']}
            cta="Remind"
            avatars={[IMG.avatarA, IMG.avatarB, IMG.avatarC, IMG.avatarD]}
            plusCount={2}
            onPress={() => openEvent('evt-1')}
            onCtaPress={() => openEvent('evt-1', 'calendar')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planning</Text>
          <View style={styles.planningList}>
            <GroupsCard
              eventId="evt-2"
              imageUrl={IMG.planningOne}
              title="Picnic at the Arb"
              details={['Nichols Arboretum', 'TBD', 'Picnicking']}
              cta="Vote"
              status="Planning"
              avatars={[IMG.avatarA, IMG.avatarE, IMG.avatarF]}
              onPress={() => openEvent('evt-2')}
              onCtaPress={() => openEvent('evt-2', 'poll')}
            />
            <GroupsCard
              eventId="evt-3"
              imageUrl={IMG.planningTwo}
              title="The Powerpuff Girls"
              details={['TBD', 'Saturday, 12/22', 'TBD']}
              cta="Vote"
              status="Planning"
              avatars={[IMG.avatarA, IMG.avatarG, IMG.avatarH]}
              onPress={() => openEvent('evt-3')}
              onCtaPress={() => openEvent('evt-3', 'poll')}
            />
          </View>
        </View>
      </View>

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
  sections: {
    gap: 40,
  },
  section: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 22.78,
    lineHeight: 29.61,
    fontWeight: '600',
    color: '#3f4620',
  },
  planningList: {
    gap: 16,
  },
  card: {
    width: '100%',
    minHeight: 280,
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
    ...StyleSheet.absoluteFillObject,
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  avatarOverlay: {
    position: 'absolute',
    right: 24,
    bottom: 16,
  },
  statusPill: {
    position: 'absolute',
    top: 16,
    right: 24,
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.80)',
  },
  statusText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#131313',
  },
  avatarsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#f0f2e3',
    overflow: 'hidden',
    backgroundColor: '#f0f2e3',
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  plusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 20.25,
    lineHeight: 26.32,
    fontWeight: '600',
    color: '#f0f2e3',
    textShadowColor: 'rgba(240,242,227,0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
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
    justifyContent: 'space-between',
    minHeight: 82,
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
  bottomPad: {
    height: 24,
  },
  pressed: {
    opacity: 0.95,
  },
});
