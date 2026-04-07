import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="phone" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="name" />
      <Stack.Screen name="calendar-sync" />
      <Stack.Screen name="use-cases" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
}
