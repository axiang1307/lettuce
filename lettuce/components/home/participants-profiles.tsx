import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

export type ParticipantsProfilesProps = {
  avatars: string[];
  moreCount?: number;
  size?: number;
};

export function ParticipantsProfiles({ avatars, moreCount = 0, size = 50 }: ParticipantsProfilesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatars}>
        {avatars.map((uri, idx) => (
          <View
            key={`${uri}-${idx}`}
            style={[
              styles.avatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: idx === 0 ? 0 : -12,
              },
            ]}>
            <Image source={{ uri }} style={styles.avatarImage} contentFit="cover" />
          </View>
        ))}
      </View>

      {moreCount > 0 && (
        <View
          style={[
            styles.moreAvatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}>
          <Text style={styles.moreText}>{`+${moreCount}`}</Text>
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
    marginLeft: -12,
    borderWidth: 1.5,
    borderColor: '#f0f2e3',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#131313',
  },
});

