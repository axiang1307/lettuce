// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SFSymbol, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { type ColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SFSymbol, ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  /** Tab bar — see app/(tabs)/_layout.tsx */
  'person.3.fill': 'groups',
  'bell.fill': 'notifications',
  calendar: 'calendar-today',
  'star.fill': 'star',
  'person.crop.circle': 'account-circle',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: ColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Color goes through `style`: MaterialIcons' own `color` prop only takes strings, while tab bar icons get
  // a ColorValue (React Native 0.88 types), and a Text style accepts that.
  return <MaterialIcons size={size} name={MAPPING[name]} style={[{ color }, style]} />;
}
