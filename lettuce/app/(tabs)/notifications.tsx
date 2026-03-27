import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeLogo } from '@/components/home/home-logo';

const IMG = {
  michelle: 'https://www.figma.com/api/mcp/asset/7e970be5-7b20-4022-a826-5282b8c68381',
};

function NotificationsSearchBar() {
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

function Divider() {
  return <View style={styles.divider} />;
}

function FriendRequestRow() {
  return (
    <Pressable style={({ pressed }) => [styles.friendRow, pressed && styles.pressed]}>
      <View style={styles.friendInfo}>
        <View style={styles.friendAvatar}>
          <Image source={{ uri: IMG.michelle }} style={styles.friendAvatarImage} contentFit="cover" />
        </View>
        <View style={styles.friendText}>
          <Text style={styles.friendName}>Michelle H.</Text>
          <Text style={styles.friendSubtitle}>Wants to be your friend!</Text>
        </View>
      </View>
      <MaterialIcons name="arrow-forward" size={22} color="#131313" />
    </Pressable>
  );
}

function UpdateRow({
  title,
  subtitle,
  time,
  unread,
}: {
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.updateRowWrap, pressed && styles.pressed]}>
      <View style={styles.updateIndicatorWrap}>
        {unread ? <View style={styles.unreadDot} /> : <View style={styles.unreadSpacer} />}
      </View>
      <View style={styles.updateRow}>
        <View style={styles.updateText}>
          <Text style={styles.updateTitle}>{title}</Text>
          <Text style={styles.updateSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.updateRight}>
          <MaterialIcons name="arrow-forward" size={22} color="#131313" />
          <Text style={styles.updateTime}>{time}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function NotificationsTab() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 10 }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <HomeLogo />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Pressable hitSlop={8}>
              <MaterialIcons name="person-add-alt-1" size={30} color="#131313" />
            </Pressable>
          </View>
          <NotificationsSearchBar />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <Divider />
          <FriendRequestRow />
          <Divider />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Updates</Text>
          <Divider />
          <UpdateRow title="Lana’s Birthday Party" subtitle="Will left the party" time="1 day ago" unread />
          <Divider />
          <UpdateRow title="Picnic at the Arb" subtitle="Will joined the party" time="2 days ago" unread={false} />
          <Divider />
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
  content: {
    gap: 24,
  },
  header: {
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28.83,
    lineHeight: 37.48,
    fontWeight: '600',
    color: '#131313',
  },
  searchShell: {
    width: '100%',
    minHeight: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 36 / 1.58,
    lineHeight: 29.61,
    fontWeight: '600',
    color: '#3f4620',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#d7d7d7',
  },
  friendRow: {
    minHeight: 74,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  friendInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 999,
    overflow: 'hidden',
  },
  friendAvatarImage: {
    width: '100%',
    height: '100%',
  },
  friendText: {
    flex: 1,
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 32 / 2,
    lineHeight: 20.8,
    fontWeight: '600',
    color: '#131313',
  },
  friendSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#9e9e9e',
  },
  updateRowWrap: {
    width: '100%',
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  updateIndicatorWrap: {
    width: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: '#6ea2d3',
  },
  unreadSpacer: {
    width: 12,
    height: 12,
  },
  updateRow: {
    flex: 1,
    minHeight: 74,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  updateText: {
    flex: 1,
    justifyContent: 'center',
  },
  updateTitle: {
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '600',
    color: '#131313',
  },
  updateSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: '#878787',
  },
  updateRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  updateTime: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: '#9e9e9e',
  },
  bottomPad: {
    height: 24,
  },
  pressed: {
    opacity: 0.95,
  },
});
