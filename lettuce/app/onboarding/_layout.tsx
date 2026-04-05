import { Stack } from 'expo-router';

/**
 * PLACEHOLDER: multi-step onboarding — copy and steps will match final product later.
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Lettuce',
        headerBackTitle: 'Back',
      }}>
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="step-2" options={{ title: 'Connect' }} />
      <Stack.Screen name="step-3" options={{ title: 'Almost there' }} />
    </Stack>
  );
}
