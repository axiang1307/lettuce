import type { ImageSourcePropType } from 'react-native';

/**
 * One image: a bundled asset (require(...)) or { uri }. React Native 0.88's ImageSourcePropType also
 * allows a readonly array of sources, which expo-image's `source` doesn't accept; this app never uses
 * arrays, so dropping that case keeps the type valid for both RN components and expo-image.
 */
export type ImageAsset = Exclude<ImageSourcePropType, readonly unknown[]>;
