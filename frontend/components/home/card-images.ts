import type { ImageSourcePropType } from 'react-native';

// Events and groups have no images yet, so cards use a bundled placeholder.
// Picking by id keeps each card's image stable between renders and refetches.
const CARD_IMAGES: ImageSourcePropType[] = [
  require('@/assets/images/figma-home/home-card-1.png'),
  require('@/assets/images/figma-home/home-card-2.png'),
  require('@/assets/images/figma-home/home-card-3.png'),
  require('@/assets/images/figma-home/home-card-4.png'),
  require('@/assets/images/figma-home/home-card-5.png'),
];

export function cardImageFor(id: string): ImageSourcePropType {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return CARD_IMAGES[Math.abs(hash) % CARD_IMAGES.length];
}
