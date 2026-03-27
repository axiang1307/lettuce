import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeLogo } from '@/components/home/home-logo';

const IMG = {
  scheduled: 'https://www.figma.com/api/mcp/asset/f04c86f9-8174-4cdf-8f74-8aebfe078395',
  planningOne: 'https://www.figma.com/api/mcp/asset/76bbe910-c16a-4324-9466-8b10a0c4f1f6',
  planningTwo: 'https://www.figma.com/api/mcp/asset/74d0587f-ac7b-4fe3-aea3-554ef21e7f18',
  avatarA: 'https://www.figma.com/api/mcp/asset/2569aaa3-cb50-48f9-9099-5f9ce10d4ca0',
  avatarB: 'https://www.figma.com/api/mcp/asset/7a6c0e14-5c4b-414f-9c55-dda99cc6e8ac',
  avatarC: 'https://www.figma.com/api/mcp/asset/9ae9a8b5-976a-4e65-a2d3-3574623bfc38',
  avatarD: 'https://www.figma.com/api/mcp/asset/ddffebc8-8492-4a6f-a52f-e2d5ec9e352e',
  avatarE: 'https://www.figma.com/api/mcp/asset/bc8135b1-8475-43e0-aa4c-e0573d14538c',
  avatarF: 'https://www.figma.com/api/mcp/asset/b169d0a6-5643-436d-bd5c-28e50c1689c9',
  avatarG: 'https://www.figma.com/api/mcp/asset/16a3318b-a6cb-422d-957a-b4977160ca3b',
  avatarH: 'https://www.figma.com/api/mcp/asset/3d2cd4f5-beb1-48d3-94f9-70702f64b922',
};

type GroupsCardProps = {
  imageUrl: string;
  title: string;
  details: [string, string, string];
  cta: string;
  status?: string;
  avatars: string[];
  plusCount?: number;
};

function AvatarStack({ avatars, plusCount = 0 }: { avatars: string[]; plusCount?: number }) {
  return (
    <View style={styles.avatarsWrap}>
      <View style={styles.avatars}>
        {avatars.map((uri, idx) => (
          <View key={`${uri}-${idx}`} style={[styles.avatar, idx > 0 && styles.avatarOverlap]}>
            <Image source={{ uri }} style={styles.avatarImage} contentFit="cover" />
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

function GroupsCard({ imageUrl, title, details, cta, status, avatars, plusCount = 0 }: GroupsCardProps) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.cardImage} contentFit="cover" />
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
          <Pressable style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
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
  const insets = useSafeAreaInsets();

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
            imageUrl={IMG.scheduled}
            title="Lana's Birthday Party"
            details={['Texas Roadhouse', 'Sunday, 12/07 - 1pm', 'PARTY!!']}
            cta="Remind"
            avatars={[IMG.avatarA, IMG.avatarB, IMG.avatarC, IMG.avatarD]}
            plusCount={2}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planning</Text>
          <View style={styles.planningList}>
            <GroupsCard
              imageUrl={IMG.planningOne}
              title="Picnic at the Arb"
              details={['Nichols Arboretum', 'TBD', 'Picnicking']}
              cta="Vote"
              status="Planning"
              avatars={[IMG.avatarA, IMG.avatarE, IMG.avatarF]}
            />
            <GroupsCard
              imageUrl={IMG.planningTwo}
              title="The Powerpuff Girls"
              details={['TBD', 'Saturday, 12/22', 'TBD']}
              cta="Vote"
              status="Planning"
              avatars={[IMG.avatarA, IMG.avatarG, IMG.avatarH]}
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
