import { HomeLogo } from '@/components/home/home-logo';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { Href, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoggingOutScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const hasStartedLogout = useRef(false);

  useEffect(() => {
    if (hasStartedLogout.current) return;
    hasStartedLogout.current = true;

    const logOut = async () => {
      await signOut();
      router.replace('/onboarding' as Href);
    };

    void logOut();
  }, [router, signOut]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <HomeLogo />
        <ActivityIndicator size="large" color={Colors.light.tint} style={styles.spinner} />
        <Text style={styles.title}>Logging out...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  spinner: {
    marginTop: 32,
  },
  title: {
    color: '#131313',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 16,
  },
});
