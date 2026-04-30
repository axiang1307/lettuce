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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ gestureEnabled: false }} />
            <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
            <Stack.Screen name="login" options={{ gestureEnabled: false }} />
            <Stack.Screen name="logging-out" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
            <Stack.Screen name="settings" />
            <Stack.Screen name="event" />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
