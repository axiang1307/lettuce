import { DMSans_400Regular, DMSans_600SemiBold, useFonts as useDmSansFonts } from '@expo-google-fonts/dm-sans';
import { Montserrat_600SemiBold, useFonts as useMontserratFonts } from '@expo-google-fonts/montserrat';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/lib/auth-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

void SplashScreen.preventAutoHideAsync();

// function SessionGuard() { //for keeping users logged in when app is closed but not signed out
//                           //the signout is not active yet so sessiongaurd will never be null once logged in
//   const { session, loading } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     if (loading) return;
//     const inTabs = segments[0] === '(tabs)';
//     if (session && !inTabs) {
//       router.replace('/(tabs)' as Href);
//     }
//   }, [session, loading, segments]);

//   return null;
// }

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dmSansLoaded] = useDmSansFonts({
    DMSans_400Regular,
    DMSans_600SemiBold,
  });
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    if (dmSansLoaded && montserratLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [dmSansLoaded, montserratLoaded]);

  if (!dmSansLoaded || !montserratLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          {/* <SessionGuard /> */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="event" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
