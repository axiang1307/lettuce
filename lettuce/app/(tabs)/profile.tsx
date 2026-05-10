import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeLogo } from '@/components/home/home-logo';

const IMG = {
  me: require('@/assets/images/figma-profile/profile-avatar-default.png'),
  headerBg: require('@/assets/images/figma-profile/profile-header-bg.png'),
  eventOne: require('@/assets/images/figma-profile/profile-event-1.png'),
  eventTwo: require('@/assets/images/figma-profile/profile-event-2.png'),
  p1: require('@/assets/images/figma-profile/profile-p1.png'),
  p2: require('@/assets/images/figma-profile/profile-p2.png'),
  p3: require('@/assets/images/figma-profile/profile-p3.png'),
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DayChip({ day, date, selected = false }: { day: string; date: string; selected?: boolean }) {
  return (
    <View style={styles.dayChip}>
      <Text style={styles.dayText}>{day}</Text>
      <View style={[styles.dateCircle, selected && styles.dateCircleSelected]}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </View>
  );
}

function CalendarItem({ title, place, time }: { title: string; place: string; time: string }) {
  return (
    <View style={styles.calendarItem}>
      <View>
        <Text style={styles.calendarTitle}>{title}</Text>
        <Text style={styles.calendarSubtitle}>{place}</Text>
      </View>
      <Text style={styles.calendarTime}>{time}</Text>
    </View>
  );
}

function PreviousEventCard({
  imageUrl,
  status,
  title,
  lineOne,
  lineTwo,
  avatars,
  onPress,
}: {
  imageUrl: any;
  status: string;
  title: string;
  lineOne: string;
  lineTwo: string;
  avatars: any[];
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.prevCard, pressed && styles.pressed]}>
      <View style={styles.prevImageWrap}>
        <Image source={imageUrl} style={styles.prevImage} contentFit="cover" />
        <View style={styles.prevImageShade} />
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <View style={styles.avatarRow}>
          {avatars.map((source, idx) => (
            <View key={`${idx}`} style={[styles.avatar, idx > 0 && styles.avatarOverlap]}>
              <Image source={source} style={styles.avatarImage} contentFit="cover" />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.prevContent}>
        <Text style={styles.prevTitle}>{title}</Text>
        <Text style={styles.prevLine}>{lineOne}</Text>
        <Text style={styles.prevLine}>{lineTwo}</Text>
        <Pressable style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Text style={styles.ctaText}>Schedule Meetup</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function ProfileTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const openEvent = (eventId: string, mode?: 'detail' | 'calendar' | 'poll' | 'activity') => {
    router.push({
      pathname: '/(tabs)/event/[eventId]',
      params: { eventId, from: '/(tabs)/profile', ...(mode ? { mode } : {}) },
    } as Href);
  };

  return (
    <View style={styles.screen}>
      <Image source={IMG.headerBg} style={styles.headerBg} contentFit="cover" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 10 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
          <HomeLogo />
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.profileAvatarWrap}>
            <Image source={IMG.me} style={styles.profileAvatar} contentFit="cover" />
          </View>
          <Text style={styles.name}>Joy Huang</Text>
          <Text style={styles.handle}>@joyash</Text>
          <View style={styles.statsRow}>
            <Stat value="5" label="Friends" />
            <Stat value="2" label="Groups" />
            <Stat value="10" label="Meetups" />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Calendar:</Text>
            <MaterialIcons name="arrow-forward" size={22} color="#131313" />
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.dayRow}>
              <DayChip day="S" date="30" selected />
              <DayChip day="M" date="1" />
              <DayChip day="T" date="2" />
              <DayChip day="W" date="3" />
              <DayChip day="T" date="4" />
              <DayChip day="F" date="5" />
              <DayChip day="S" date="6" />
            </View>

            <View style={styles.calendarList}>
              <Pressable onPress={() => openEvent('evt-1', 'calendar')} style={({ pressed }) => [pressed && styles.pressed]}>
                <CalendarItem title="Sunday Brunch" place="Tous Les Jours" time="8AM" />
              </Pressable>
              <Pressable onPress={() => openEvent('evt-2', 'calendar')} style={({ pressed }) => [pressed && styles.pressed]}>
                <CalendarItem title="3B Girls" place="Dinner @ Fritas" time="6PM" />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Previous Events</Text>
            <MaterialIcons name="arrow-forward" size={22} color="#131313" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.prevRow}>
            <PreviousEventCard
              imageUrl={IMG.eventOne}
              status="1 mo. ago"
              title="The 3 Goons"
              lineOne="Sunday, 11/01"
              lineTwo="With @Chris @Luke"
              avatars={[IMG.me, IMG.p1, IMG.p2]}
              onPress={() => openEvent('evt-3')}
            />
            <PreviousEventCard
              imageUrl={IMG.eventTwo}
              status="1.5 mo. ago"
              title="Boba Date"
              lineOne="Friday, 10/17"
              lineTwo="With @Angie"
              avatars={[IMG.me, IMG.p3]}
              onPress={() => openEvent('evt-4')}
            />
          </ScrollView>
        </View>

        <Pressable
          style={({ pressed }) => [styles.sectionHeader, pressed && styles.pressed]}
          onPress={() => router.push('/settings' as Href)}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <MaterialIcons name="arrow-forward" size={22} color="#131313" />
        </Pressable>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerBg: {
    position: 'absolute',
    top: -138,
    left: 0,
    right: 0,
    height: 315,
  },
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 88,
    gap: 30,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  profileHeader: {
    alignItems: 'center',
    gap: 6,
  },
  profileAvatarWrap: {
    width: 138,
    height: 138,
    borderRadius: 69,
    borderWidth: 1,
    borderColor: '#cecece',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 18,
    lineHeight: 23.4,
    fontWeight: '600',
    color: '#131313',
  },
  handle: {
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '600',
    color: '#9e9e9e',
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    width: 65,
    gap: 5,
  },
  statValue: {
    fontSize: 22.78,
    lineHeight: 29.61,
    fontWeight: '600',
    color: '#131313',
  },
  statLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: '#131313',
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 32 / 1.58,
    lineHeight: 26.33,
    fontWeight: '600',
    color: '#131313',
  },
  calendarCard: {
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    width: 40,
    alignItems: 'center',
    gap: 4,
  },
  dayText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#878787',
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCircleSelected: {
    backgroundColor: '#b6cfe3',
  },
  dateText: {
    fontSize: 18,
    lineHeight: 23.4,
    fontWeight: '600',
    color: '#131313',
  },
  calendarList: {
    gap: 10,
  },
  calendarItem: {
    backgroundColor: '#eaf3f9',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  calendarTitle: {
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '600',
    color: '#131313',
  },
  calendarSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#878787',
  },
  calendarTime: {
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '600',
    color: '#131313',
  },
  prevRow: {
    gap: 23,
    paddingRight: 16,
  },
  prevCard: {
    width: 256,
    borderWidth: 1,
    borderColor: '#cecece',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  prevImageWrap: {
    height: 130,
    position: 'relative',
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  prevImage: {
    ...StyleSheet.absoluteFillObject,
  },
  prevImageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  statusPill: {
    alignSelf: 'flex-start',
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  statusText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#131313',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  prevContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 2,
  },
  prevTitle: {
    fontSize: 20.25,
    lineHeight: 26.33,
    fontWeight: '600',
    color: '#131313',
  },
  prevLine: {
    fontSize: 18,
    lineHeight: 27,
    color: '#373737',
  },
  cta: {
    marginTop: 10,
    height: 36,
    borderRadius: 32,
    backgroundColor: '#9cad50',
    borderWidth: 2,
    borderColor: '#9cad50',
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 12,
  },
  pressed: {
    opacity: 0.95,
  },
});
