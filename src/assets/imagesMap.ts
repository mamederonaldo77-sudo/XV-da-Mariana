import carrossel1 from './images/carrossel-1.jpeg';
import carrossel2 from './images/carrossel-2.jpeg';
import carrossel3 from './images/carrossel-3.jpeg';
import carrossel4 from './images/carrossel-4.jpeg';
import galeria1 from './images/galeria-1.jpeg';
import galeria2 from './images/galeria-2.jpeg';
import galeria3 from './images/galeria-3.jpeg';
import galeria4 from './images/galeria-4.jpeg';
import galeria5 from './images/galeria-5.jpeg';
import galeria6 from './images/galeria-6.jpeg';
import guiaTrajeImg from './images/guia_traje_mari_1792084852049.jpg';

export const OFFICIAL_IMAGES = {
  carrossel1,
  carrossel2,
  carrossel3,
  carrossel4,
  galeria1,
  galeria2,
  galeria3,
  galeria4,
  galeria5,
  galeria6,
  guiaTrajeImg,
};

export const DEFAULT_IMAGE_PATHS = {
  portrait: carrossel1,
  garden: carrossel2,
  waltz: carrossel3,
  special: carrossel4,
  aboutMe: galeria5,
  decor: galeria1,
  gallery2: galeria2,
  gallery4: galeria4,
  gallery5: galeria5,
  shoes: galeria6,
  dressCodeGuide: guiaTrajeImg,
};

export const ASSET_IMAGES = DEFAULT_IMAGE_PATHS;

/**
 * Normalizes any image URL (relative, public, legacy, data URI, or external HTTP)
 * into a valid, working image URL that works in root, subfolders, and GitHub Pages.
 * All standard photos resolve directly to Vite bundled assets, preventing 404s.
 */
export function resolveImageUrl(
  url: string | undefined | null,
  fallbackKey: keyof typeof DEFAULT_IMAGE_PATHS = 'portrait'
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return DEFAULT_IMAGE_PATHS[fallbackKey] || carrossel1;
  }

  const trimmed = url.trim();

  // If already a Data URL, blob URL or external HTTP/HTTPS URL, return as-is
  if (
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  // If already a Vite-bundled asset path, return as-is
  if (
    trimmed.startsWith('/@fs') ||
    trimmed.startsWith('@fs') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('./assets/')
  ) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();

  // Match 4 carousel images directly to their bundled Vite assets
  if (lower.includes('car-1') || lower.includes('carrossel-1') || lower.includes('mari_carousel_portrait')) return carrossel1;
  if (lower.includes('car-2') || lower.includes('carrossel-2') || lower.includes('mari_carousel_garden')) return carrossel2;
  if (lower.includes('car-3') || lower.includes('carrossel-3') || lower.includes('mari_debutante_waltz')) return carrossel3;
  if (lower.includes('car-4') || lower.includes('carrossel-4')) return carrossel4;

  // Match 6 gallery images directly to their bundled Vite assets
  if (lower.includes('gal-1') || lower.includes('galeria-1') || lower.includes('mari_gallery_decor')) return galeria1;
  if (lower.includes('gal-2') || lower.includes('galeria-2')) return galeria2;
  if (lower.includes('gal-3') || lower.includes('galeria-3') || lower.includes('mari_about_me')) return galeria3;
  if (lower.includes('gal-4') || lower.includes('galeria-4')) return galeria4;
  if (lower.includes('gal-5') || lower.includes('galeria-5')) return galeria5;
  if (lower.includes('gal-6') || lower.includes('galeria-6') || lower.includes('mari_gallery_shoes')) return galeria6;

  // Match dress code guide
  if (lower.includes('guia') || lower.includes('traje')) return guiaTrajeImg;

  // Normalize path relative to BASE_URL
  const cleanPath = trimmed.replace(/^\.?\//, '').replace(/^public\//, '');
  const baseUrl = (import.meta.env.BASE_URL || './').replace(/\/$/, '');
  return baseUrl === '' || baseUrl === '.' ? `./${cleanPath}` : `${baseUrl}/${cleanPath}`;
}
