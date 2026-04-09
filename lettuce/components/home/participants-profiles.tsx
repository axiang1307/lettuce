import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';

export type ParticipantsProfilesProps = {
  avatars: Array<string | ImageSourcePropType>;
  moreCount?: number;
  size?: number;
  variant?: 'default' | 'extra' | 'one' | 'detailed';
  statusIcons?: Array<'none' | 'confirmed' | 'rejected'>;
};

function resolveSource(value: string | ImageSourcePropType): ImageSourcePropType {
  if (typeof value === 'string') {
    return { uri: value };
  }
  return value;
}

function StatusIcon({ status }: { status: 'confirmed' | 'rejected' }) {
  return (
    <View style={styles.statusBadge}>
      <Text style={[styles.statusText, status === 'confirmed' ? styles.statusConfirmed : styles.statusRejected]}>
        {status === 'confirmed' ? 'check' : 'close'}
      </Text>
    </View>
  );
}

export function ParticipantsProfiles({
  avatars,
  moreCount = 0,
  size = 50,
  variant = 'default',
  statusIcons = [],
}: ParticipantsProfilesProps) {
  const oneAvatar = variant === 'one' ? avatars.slice(0, 1) : avatars;
  const showExtraCount = variant === 'extra' && moreCount > 0;
  const overlap = variant === 'detailed' ? 0 : 12;

  return (
    <View style={styles.container}>
      <View style={[styles.avatars, variant === 'detailed' && styles.avatarsDetailed]}>
        {oneAvatar.map((src, idx) => (
          <View
            key={`${idx}`}
            style={[
              styles.avatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: idx === 0 ? 0 : -overlap,
              },
            ]}>
            <Image source={resolveSource(src)} style={styles.avatarImage} contentFit="cover" />
            {statusIcons[idx] && statusIcons[idx] !== 'none' ? (
              <StatusIcon status={statusIcons[idx] as 'confirmed' | 'rejected'} />
            ) : null}
          </View>
        ))}
      </View>

      {showExtraCount && (
        <View
          style={[
            styles.moreAvatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}>
          <Text style={styles.morePlus}>+</Text>
          <Text style={styles.moreText}>{`${moreCount}`}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarsDetailed: {
    gap: 4,
    paddingRight: 0,
  },
  avatar: {
    borderWidth: 1.5,
    borderColor: '#f0f2e3',
    overflow: 'hidden',
    backgroundColor: '#f0f2e3',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  moreAvatar: {
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  morePlus: {
    color: '#f0f2e3',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '400',
    marginRight: 1,
  },
  moreText: {
    fontSize: 20.25,
    lineHeight: 26.32,
    fontWeight: '600',
    color: '#f0f2e3',
    textShadowColor: 'rgba(240,242,227,0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  statusBadge: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  statusText: {
    fontFamily: 'Material Icons',
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '400',
  },
  statusConfirmed: {
    color: '#217737',
  },
  statusRejected: {
    color: '#8c2c1d',
  },
});

