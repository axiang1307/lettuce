import { HomeLogo } from '@/components/home/home-logo';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace('/onboarding' as Href);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 10 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
          <HomeLogo />
        </View>

        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
            hitSlop={12}>
            <MaterialIcons name="arrow-back" size={24} color="#131313" />
          </Pressable>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.backButton} />
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.85 }]}>
          <MaterialIcons name="logout" size={20} color="#D9534F" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
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
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 88,
    gap: 24,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: '#131313',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  cardCaption: {
    fontSize: 14,
    lineHeight: 21,
    color: '#9e9e9e',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#D9534F',
    backgroundColor: '#ffffff',
  },
  logoutText: {
    color: '#D9534F',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
});
