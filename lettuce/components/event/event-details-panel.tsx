import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { HomeFeedEvent } from '@/data/home-feed';

import { ParticipantsProfiles } from '../home/participants-profiles';

type StatusIconKind = 'confirmed' | 'rejected' | 'none';

type EventDetailsPanelProps = {
  event: HomeFeedEvent;
  onBack: () => void;
  onOpenCalendar: () => void;
  onOpenPoll: () => void;
  onOpenActivity: () => void;
};

function DetailAction({
  label,
  status,
  onPress,
  highlighted = false,
}: {
  label: string;
  status?: string;
  onPress: () => void;
  highlighted?: boolean;
}) {
  return (
    <View style={styles.actionWrap}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.action,
          highlighted && styles.actionHighlighted,
          pressed && styles.pressed,
        ]}>
        <Text style={styles.actionText}>{label}</Text>
        <MaterialIcons name="arrow-forward" size={22} color="#131313" />
      </Pressable>
      <Text
        style={[
          styles.actionStatus,
          highlighted ? styles.actionStatusHighlighted : styles.actionStatusHidden,
        ]}>
        {status ?? 'Alert'}
      </Text>
    </View>
  );
}

export function EventDetailsPanel({
  event,
  onBack,
  onOpenCalendar,
  onOpenPoll,
  onOpenActivity,
}: EventDetailsPanelProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const HERO_HEIGHT = screenHeight * 0.34;
  const CARD_OVERLAP = HERO_HEIGHT * 0.33;
  const totalParticipants =
    event.participants.avatars.length + (event.participants.moreCount ?? 0);
  const visibleAvatars = event.participants.avatars.slice(0, 3);
  const statusIcons: StatusIconKind[] = (['confirmed', 'rejected', 'none'] as const).slice(
    0,
    visibleAvatars.length,
  ) as StatusIconKind[];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <ImageBackground
          source={event.imageUrl}
          resizeMode="cover"
          style={[styles.heroWrap, { width: screenWidth, height: HERO_HEIGHT, paddingBottom: CARD_OVERLAP + 24 }]}>
          <View style={styles.heroOverlay} pointerEvents="none" />

          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={[styles.backBtn, { top: Math.max(insets.top, 12) }]}>
            <Ionicons name="arrow-back" size={30} color="#131313" />
          </Pressable>

          {event.statusLabel ? (
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{event.statusLabel}</Text>
            </View>
          ) : null}
        </ImageBackground>

        <View style={[styles.card, { width: screenWidth, marginTop: -CARD_OVERLAP }]}>
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <Text style={styles.heading} numberOfLines={2}>
                {event.title}
              </Text>
              <Pressable hitSlop={8}>
                <MaterialIcons name="edit" size={26} color="#1d1d1d" />
              </Pressable>
            </View>

            <View style={styles.metaList}>
              {event.details.map((line) => (
                <Text key={line} style={styles.metaText}>
                  {line}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.participantsSection}>
            <Text style={styles.sectionLabel}>{`${totalParticipants} total`}</Text>
            <View style={styles.participantsRow}>
              <ParticipantsProfiles
                avatars={visibleAvatars}
                variant="detailed"
                statusIcons={statusIcons}
              />
              <Pressable style={styles.addCircle} hitSlop={6}>
                <MaterialIcons name="add" size={32} color="#9cad50" />
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionsSection}>
            <Text style={styles.sectionLabel}>Event Details</Text>
            <View style={styles.actionsList}>
              <DetailAction label="Calendar" onPress={onOpenCalendar} />
              <DetailAction
                label="Poll"
                status="Vote Pending"
                onPress={onOpenPoll}
                highlighted
              />
              <DetailAction label="Activity" onPress={onOpenActivity} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.photoRow}>
            <Text style={styles.sectionLabel}>Photo Album</Text>
            <MaterialIcons name="arrow-forward" size={22} color="#131313" />
          </View>

          <View style={styles.divider} />

          <View style={styles.footer}>
            <Pressable style={({ pressed }) => [styles.leaveBtn, pressed && styles.pressed]}>
              <Text style={styles.leaveText}>Leave Event</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    paddingBottom: 0,
  },
  heroWrap: {
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backBtn: {
    position: 'absolute',
    left: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    alignSelf: 'flex-start',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#131313',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  headerSection: {
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heading: {
    flex: 1,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 28.83,
    lineHeight: 37.48,
    fontWeight: '600',
    color: '#131313',
  },
  metaList: {
    gap: 8,
  },
  metaText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 18,
    lineHeight: 27,
    color: '#131313',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#d7d7d7',
  },
  sectionLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#131313',
  },
  participantsSection: {
    gap: 8,
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  addCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#f0f2e3',
    backgroundColor: '#e4e4e4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsSection: {
    gap: 16,
  },
  actionsList: {
    gap: 4,
  },
  actionWrap: {
    gap: 2,
  },
  action: {
    borderRadius: 8,
    backgroundColor: '#eaf3f9',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  actionHighlighted: {
    borderWidth: 2,
    borderColor: '#6096c3',
  },
  actionText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '600',
    color: '#131313',
  },
  actionStatus: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  actionStatusHighlighted: {
    color: '#6096c3',
  },
  actionStatusHidden: {
    color: '#b6cfe3',
    opacity: 0,
  },
  photoRow: {
    minHeight: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    alignItems: 'flex-end',
  },
  leaveBtn: {
    height: 36,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#ec5037',
    backgroundColor: '#ec5037',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  leaveText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.92,
  },
});
