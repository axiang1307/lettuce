import { LettuceLogo } from '@/components/onboarding/LettuceLogo';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { Href, Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

/**
 * App entry: sends users into the onboarding → login → tabs flow.
 *
 * PLACEHOLDER DEV SHORTCUT: flip to `true` to jump straight to main tabs while building UI
 * (no persistence — cold start always runs this file).
 */
const SKIP_ONBOARDING_AND_LOGIN = false;

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LettuceLogo large />
        <ActivityIndicator
          size="large"
          color={Colors.light.tint}
          style={styles.spinner}
        />
      </View>
    );
  }

  if (SKIP_ONBOARDING_AND_LOGIN || session) {
    return <Redirect href={'/(tabs)' as Href} />;
  }

  return <Redirect href={'/onboarding' as Href} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  spinner: {
    marginTop: 32,
  },
});
