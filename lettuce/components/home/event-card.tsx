import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';

import { ParticipantsProfiles } from './participants-profiles';

export type EventCardProps = {
  variant: 'upcoming' | 'catchup';
  imageUrl: string | ImageSourcePropType;
  title: string;
  details: string[];
  statusLabel?: string;
  ctaLabel: string;
  participants: {
    avatars: Array<string | ImageSourcePropType>;
    moreCount?: number;
  };
  /** Opens event detail when user taps the card (image + main content). */
  onPress?: () => void;
  /** PLACEHOLDER: Remind / Vote / Schedule — wire actions later; does not navigate to detail */
  onCtaPress?: () => void;
};

export function EventCard({
  variant,
  imageUrl,
  title,
  details,
  statusLabel,
  ctaLabel,
  participants,
  onPress,
  onCtaPress,
}: EventCardProps) {
  const imageSource = typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardBase,
        variant === 'upcoming' ? styles.cardUpcoming : styles.cardCatchup,
        pressed && { opacity: 0.96 },
      ]}>
      <View style={[styles.imageWrap, variant === 'upcoming' ? styles.imageUpcoming : styles.imageCatchup]}>
        <Image source={imageSource} style={styles.image} contentFit="cover" />
        <View style={styles.imageShade} />

        {statusLabel && (
          <View style={[styles.statusPill, variant === 'catchup' ? styles.statusPillCatchup : styles.statusPillUpcoming]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        )}

        <View
          style={[
            styles.participantsOverlay,
            variant === 'upcoming' ? styles.participantsOverlayUpcoming : styles.participantsOverlayCatchup,
          ]}>
          <ParticipantsProfiles avatars={participants.avatars} moreCount={participants.moreCount ?? 0} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={variant === 'upcoming' ? styles.detailsAndCtaRow : styles.detailsOnly}>
          <View style={styles.details}>
            {details.map((line, idx) => (
              <Text key={`${line}-${idx}`} style={styles.detailText} numberOfLines={1}>
                {line}
              </Text>
            ))}
          </View>

          {variant === 'upcoming' && (
            <Pressable
              onPress={onCtaPress ?? (() => undefined)}
              style={({ pressed }) => [styles.ctaButton, styles.ctaUpcoming, pressed && { opacity: 0.95 }]}>
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </Pressable>
          )}
        </View>

        {variant === 'catchup' && (
          <Pressable
            onPress={onCtaPress ?? (() => undefined)}
            style={({ pressed }) => [styles.ctaButton, styles.ctaCatchup, pressed && { opacity: 0.95 }]}>
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cecece',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardUpcoming: {
    width: '100%',
    height: 280,
  },
  cardCatchup: {
    width: 256,
    height: 240,
  },
  imageWrap: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  imageUpcoming: {
    height: 140,
  },
  imageCatchup: {
    height: 130,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  statusPill: {
    position: 'absolute',
    top: 16,
    backgroundColor: 'rgba(255,255,255,0.80)',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillUpcoming: {
    right: 24,
  },
  statusPillCatchup: {
    left: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#131313',
  },
  participantsOverlay: {
    position: 'absolute',
    bottom: 16,
  },
  participantsOverlayUpcoming: {
    right: 24,
  },
  participantsOverlayCatchup: {
    left: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
    gap: 4,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: '#131313',
    marginBottom: 2,
  },
  detailsAndCtaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailsOnly: {
    // catchup: details first, CTA full-width below
    marginBottom: 12,
  },
  details: {
    flex: 1,
  },
  detailText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '400',
    color: '#373737',
  },
  ctaButton: {
    backgroundColor: '#9cad50',
    borderColor: '#9cad50',
    borderWidth: 2,
    height: 36,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaUpcoming: {
    paddingHorizontal: 16,
  },
  ctaCatchup: {
    width: '100%',
    paddingHorizontal: 16,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

