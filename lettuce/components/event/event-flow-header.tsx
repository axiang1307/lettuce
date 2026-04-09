import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import type { HomeFeedEvent } from '@/data/home-feed';

import { ParticipantsProfiles } from '../home/participants-profiles';

type EventFlowHeaderProps = {
  event: HomeFeedEvent;
  title?: string;
  subtitle?: string;
  onBack: () => void;
  showImage?: boolean;
  showTitle?: boolean;
  showParticipants?: boolean;
  topInset?: number;
  fullBleed?: boolean;
};

export function EventFlowHeader({
  event,
  title,
  subtitle,
  onBack,
  showImage = true,
  showTitle = true,
  showParticipants = true,
  topInset = 0,
  fullBleed = false,
}: EventFlowHeaderProps) {
  const heroSource: ImageSourcePropType =
    typeof event.imageUrl === 'string' ? { uri: event.imageUrl } : event.imageUrl;

  return (
    <View style={[styles.wrap, fullBleed && styles.fullBleedWrap]}>
      {showImage ? (
        <View style={styles.heroWrap}>
          <Image source={heroSource} style={styles.hero} contentFit="cover" />
        </View>
      ) : null}

      <View
        style={[
          styles.topRow,
          { top: 12 + topInset },
          !showImage && styles.topRowNoImage,
          !showImage && { marginTop: topInset },
        ]}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
          <MaterialIcons name="arrow-back" size={30} color="#131313" />
        </Pressable>
      </View>

      {showTitle || showParticipants ? (
        <View style={[styles.content, !showImage && styles.contentNoImage]}>
          {showTitle ? <Text style={styles.title}>{title ?? event.title}</Text> : null}
          {showTitle && subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {showParticipants ? (
            <ParticipantsProfiles avatars={event.participants.avatars} moreCount={event.participants.moreCount ?? 0} />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  fullBleedWrap: {
    marginHorizontal: -16,
  },
  heroWrap: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ scale: 1.18 }],
  },
  topRow: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  topRowNoImage: {
    position: 'relative',
    top: 0,
    left: 0,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  content: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
    gap: 10,
  },
  contentNoImage: {
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  title: {
    fontSize: 42 / 1.387,
    lineHeight: 41,
    fontWeight: '600',
    color: '#131313',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 27,
    color: '#878787',
  },
  pressed: {
    opacity: 0.92,
  },
});
