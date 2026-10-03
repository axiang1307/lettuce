import { useColorScheme as useRNColorScheme } from 'react-native';

// RN 0.86 can report 'unspecified'; the app only has light and dark themes.
export function useColorScheme() {
  return useRNColorScheme() === 'dark' ? 'dark' : 'light';
}
