import { Stack } from 'expo-router';

export default function EventDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
        headerTintColor: '#131313',
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    />
  );
}
