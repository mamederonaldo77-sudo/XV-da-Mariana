export type PageRoute =
  | 'inicio'
  | 'meus-15-anos'
  | 'traje-sugerido'
  | 'nossa-promessa'
  | 'presentes'
  | 'recados'
  | 'fotos'
  | 'confirmar-presenca';

export interface CarouselImage {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  alt: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  category?: string;
  alt: string;
}

export interface GiftItem {
  id: string;
  title: string;
  description: string;
  category: string;
  storeUrl?: string;
  pixKey?: string;
}

export interface GuestMessage {
  id: string;
  name: string;
  email?: string;
  message: string;
  createdAt: string;
}

export interface RsvpEntry {
  id: string;
  guestName: string;
  guestCount?: number;
  phone: string;
  notes?: string;
  confirmedVia: 'site' | 'whatsapp';
  createdAt: string;
}

export interface SiteConfig {
  debutanteName: string;
  pageTitle: string;
  heroSubheading: string;
  partyTitle: string;
  partyDateIso: string; // e.g. "2026-11-13T20:00:00-03:00"
  displayDate: string;  // "13 de novembro de 2026"
  displayTime: string;  // "Às 20 horas"
  
  // Local da festa
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueMapsUrl: string;

  // WhatsApp para confirmação
  whatsappNumber: string; // ex: "5511999999999" (apenas números)

  // Sobre Mim
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl: string;

  // Nossa Promessa
  promiseTitle: string;
  promiseText: string;

  // Vídeo
  videoUrl: string; // youtube, vimeo, ou mp4

  // Presentes
  giftsTitle: string;
  giftsSubtitle: string;
  pixTitle: string;
  pixMessage: string;
  pixKey: string;
  pixQrCodeUrl?: string;
  externalGiftListTitle: string;
  externalGiftListDescription: string;
  externalGiftListUrl: string;
  externalGiftListButtonText: string;

  // Listas
  carouselImages: CarouselImage[];
  galleryPhotos: GalleryPhoto[];
  giftItems: GiftItem[];

  // Traje Sugerido
  dressCodeTitle?: string;
  dressCodeSubtitle?: string;
  dressCodeType?: string;
  dressCodeQuote?: string;
  dressCodeDescription?: string;
  dressCodeImageUrl?: string;

  _configVersion?: number;
}
