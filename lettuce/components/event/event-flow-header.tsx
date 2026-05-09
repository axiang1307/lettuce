import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
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
}: EventFlowHeaderProps) {
  const heroSource: ImageSourcePropType =
    typeof event.imageUrl === 'string' ? { uri: event.imageUrl } : event.imageUrl;

  if (!showImage) {
    return (
      <View style={[styles.noImageWrap, { paddingTop: topInset + 8 }]}>
        <Pressable onPress={onBack}>
          <View style={styles.arrow}>
            <Ionicons name="arrow-back" size={30} />
          </View>
        </Pressable>
        {showTitle && <Text style={styles.title}>{title ?? event.title}</Text>}
        {showTitle && subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {showParticipants && (
          <View style={styles.profiles}>
            <ParticipantsProfiles avatars={event.participants.avatars} moreCount={event.participants.moreCount ?? 0} />
          </View>
        )}
      </View>
    );
  }

  return (
    <ImageBackground
      source={heroSource}
      style={[styles.header, { paddingTop: topInset + 8 }]}
      imageStyle={{ transform: [{ scale: 1.18 }, { translateY: 16 }], opacity: 0.55 }}
    >
      <Pressable onPress={onBack}>
        <View style={styles.arrow}>
          <Ionicons name="arrow-back" size={30} />
        </View>
      </Pressable>
      {showTitle && <Text style={styles.title}>{title ?? event.title}</Text>}
      {showParticipants && (
        <View style={styles.profiles}>
          <ParticipantsProfiles avatars={event.participants.avatars} moreCount={event.participants.moreCount ?? 0} />
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    minHeight: 215,
  },
  noImageWrap: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  
  arrow: {
    width: '100%',
    paddingBottom: 6,
  },
  title: {
    fontSize: 28.83,
    fontFamily: 'Montserrat',
    fontWeight: '600',
    lineHeight: 37.48,
    paddingBottom: 16,
    color: '#131313',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 27,
    color: '#878787',
    paddingBottom: 8,
  },
  profiles: {
    paddingBottom: 8,
  },
});
