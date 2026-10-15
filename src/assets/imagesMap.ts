import { EMBEDDED_IMAGES } from './embeddedImages';

export const DEFAULT_IMAGE_PATHS = {
  portrait: '/images/mari_carousel_portrait_1791932736276.jpg',
  garden: '/images/mari_carousel_garden_1791932737591.jpg',
  waltz: '/images/mari_debutante_waltz_1791932756499.jpg',
  aboutMe: '/images/mari_about_me_1791932737518.jpg',
  decor: '/images/mari_gallery_decor_1791932737328.jpg',
  shoes: '/images/mari_gallery_shoes_1791932738574.jpg',
};

export const ASSET_IMAGES = EMBEDDED_IMAGES;

/**
 * Normalizes any image URL (relative, public, legacy, data URI, or external HTTP)
 * into a valid, working image URL.
 */
export function resolveImageUrl(url: string | undefined | null, fallbackKey: keyof typeof DEFAULT_IMAGE_PATHS = 'portrait'): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return DEFAULT_IMAGE_PATHS[fallbackKey];
  }

  const trimmed = url.trim();

  // If already a Data URL or external HTTP/HTTPS URL, return as-is
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Normalize legacy or /public/ prefixes
  if (trimmed.startsWith('/public/images/')) {
    return trimmed.replace('/public/images/', '/images/');
  }
  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/images/');
  }

  // Match known photo identifiers
  if (trimmed.includes('mari_carousel_portrait')) return DEFAULT_IMAGE_PATHS.portrait;
  if (trimmed.includes('mari_carousel_garden')) return DEFAULT_IMAGE_PATHS.garden;
  if (trimmed.includes('mari_debutante_waltz')) return DEFAULT_IMAGE_PATHS.waltz;
  if (trimmed.includes('mari_about_me')) return DEFAULT_IMAGE_PATHS.aboutMe;
  if (trimmed.includes('mari_gallery_decor')) return DEFAULT_IMAGE_PATHS.decor;
  if (trimmed.includes('mari_gallery_shoes')) return DEFAULT_IMAGE_PATHS.shoes;

  return trimmed;
}

