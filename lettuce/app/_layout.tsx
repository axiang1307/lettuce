import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts as useDmSansFonts, DMSans_400Regular, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';
import { useFonts as useMontserratFonts, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

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
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" options={{ headerShown: true, title: 'Log in' }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="event" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
