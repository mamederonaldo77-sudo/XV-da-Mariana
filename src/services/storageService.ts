import { SiteConfig, GuestMessage, RsvpEntry } from '../types';
import { DEFAULT_IMAGE_PATHS, resolveImageUrl } from '../assets/imagesMap';
import { mediaDb } from './mediaDb';

export const DEFAULT_CONFIG: SiteConfig = {
  debutanteName: 'Mariana',
  pageTitle: 'XV Mari',
  heroSubheading: 'Meus 15 Anos',
  partyTitle: 'Minha Festa de 15 Anos',
  partyDateIso: '2026-11-13T20:00:00-03:00',
  displayDate: '13 de novembro de 2026',
  displayTime: 'Às 20 horas',

  // Local - campos em branco a serem preenchidos pela família
  venueName: '',
  venueAddress: '',
  venueCity: '',
  venueMapsUrl: '',

  // WhatsApp - em branco a ser preenchido pela família
  whatsappNumber: '',

  aboutTitle: 'Sobre mim',
  aboutText: `Meu nome é Mariana e estou vivendo uma fase muito especial da minha vida. Completar 15 anos é celebrar minhas histórias, meus sonhos, minha família e todas as pessoas que fazem parte da minha caminhada.\n\nQuero compartilhar esse momento tão importante com pessoas especiais e guardar para sempre as lembranças desse dia.\n\nSerá uma alegria ter você comigo nessa celebração!`,
  aboutImageUrl: 'public/images/gal-5.jpeg',

  // Nossa Promessa
  promiseTitle: 'Nossa Promessa',
  promiseText: 'Prometo guardar no coração cada sorriso, cada abraço e cada pessoa que caminha comigo. Que este dia seja repleto de amor, gratidão e magia!\n\nCelebrar meus 15 anos é honrar a promessa de espalhar alegria, carinho e nunca esquecer de onde vim e de todos que amo.',

  videoUrl: 'Convite-videomp4.mp4',

  giftsTitle: 'Presentes & Lista de Desejos',
  giftsSubtitle: 'Se desejar me presentear, deixo aqui algumas opções. O mais importante é a sua presença e o seu carinho!',
  pixTitle: 'Contribuição dos Sonhos (Pix)',
  pixMessage: 'Se desejar me presentear de forma voluntária e contribuir com a realização dos sonhos dos meus 15 anos, deixo aqui a opção de Pix. Sua presença e seu carinho são os maiores presentes!',
  pixKey: '21964335354',
  pixQrCodeUrl: '',
  externalGiftListTitle: 'Minha Lista de Presentes',
  externalGiftListDescription: 'Para quem preferir me presentear com algo especial, deixo aqui algumas sugestões com muito carinho:',
  externalGiftListUrl: '',
  externalGiftListButtonText: 'Acessar Lista de Presentes',

  carouselImages: [
    {
      id: 'c1',
      url: 'public/images/car-1.jpeg',
      title: 'Mariana',
      caption: 'XV Mari — Celebrando 15 anos de sonhos e encantos',
      alt: 'Mariana com vestido e tiara delicada',
    },
    {
      id: 'c2',
      url: 'public/images/car-2.jpeg',
      title: 'Jardim Encantado',
      caption: 'Momentos inesquecíveis iluminados pelo luar',
      alt: 'Mariana caminhando no jardim',
    },
    {
      id: 'c3',
      url: 'public/images/car-3.jpeg',
      title: 'A Grande Valsa',
      caption: 'A magia de dançar o início de um novo capítulo',
      alt: 'Mariana dançando com vestido de baile',
    },
    {
      id: 'c4',
      url: 'public/images/car-4.jpeg',
      title: 'Momento Especial',
      caption: 'A alegria de comemorar com quem amamos',
      alt: 'Mariana celebrando seus 15 anos',
    },
  ],

  galleryPhotos: [
    {
      id: 'g1',
      url: 'public/images/gal-1.jpeg',
      title: 'Decoração e Flores',
      category: 'Detalhes',
      alt: 'Mesa de banquete com hortênsias lilás e velas',
    },
    {
      id: 'g2',
      url: 'public/images/gal-2.jpeg',
      title: 'Jardim Iluminado',
      category: 'Ensaio',
      alt: 'Mariana no jardim florido',
    },
    {
      id: 'g3',
      url: 'public/images/gal-3.jpeg',
      title: 'Sobre Mim',
      category: 'Retrato',
      alt: 'Mariana com sorriso meigo',
    },
    {
      id: 'g4',
      url: 'public/images/gal-4.jpeg',
      title: 'Retrato da Debutante',
      category: 'Ensaio',
      alt: 'Retrato clássico com vestido e tiara',
    },
    {
      id: 'g5',
      url: 'public/images/gal-5.jpeg',
      title: 'Salão Real',
      category: 'Celebração',
      alt: 'Mariana no salão de baile',
    },
    {
      id: 'g6',
      url: 'public/images/gal-6.jpeg',
      title: 'Brilho e Detalhes',
      category: 'Detalhes',
      alt: 'Salto prateado e detalhes da comemoração',
    },
  ],

  giftItems: [
    {
      id: 'gift_1',
      title: 'Jóias de prata',
      category: 'Acessórios & Mimos',
      description: 'Vivara ou Pandora',
    },
    {
      id: 'gift_2',
      title: 'Perfumes e cremes',
      category: 'Perfumaria & Beleza',
      description: 'Exceto, Boticário e Natura',
    },
  ],

  // Traje Sugerido
  dressCodeTitle: 'Traje Sugerido',
  dressCodeSubtitle: 'Guia visual e inspirações para celebrar essa data tão inesquecível',
  dressCodeType: 'Passeio Completo',
  dressCodeQuote: '“Uma noite especial merece uma produção à altura.”',
  dressCodeDescription: 'Para celebrar comigo, escolha um visual elegante e festivo. Sugerimos traje passeio completo, com peças bem alinhadas e acabamento sofisticado.',
  dressCodeImageUrl: 'images/guia-traje-sugerido.jpg',
};

const STORAGE_KEYS = {
  CONFIG: 'xv_mari_site_config_v1',
  MESSAGES: 'xv_mari_guest_messages_v1',
  RSVPS: 'xv_mari_rsvp_entries_v1',
  ADMIN_PIN: 'xv_mari_admin_pin_v1',
};

// In-memory cache for synchronous instant access
let cachedConfig: SiteConfig | null = null;

function sanitizeText(val: string): string {
  if (!val) return '';
  return val
    .replace(/Mariana\s+(Resende|Rezende)/gi, 'Mariana')
    .replace(/\b(Resende|Rezende)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export const storageService = {
  // Config
  getConfig(): SiteConfig {
    if (cachedConfig) {
      return cachedConfig;
    }

    if (typeof localStorage === 'undefined') {
      return DEFAULT_CONFIG;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (stored) {
        // Strip out any occurrences of Resende or Rezende from stored data
        const cleanedStored = stored
          .replace(/Mariana\s+(Resende|Rezende)/gi, 'Mariana')
          .replace(/\b(Resende|Rezende)\b/gi, '')
          .replace(/\s{2,}/g, ' ');

        const parsed = JSON.parse(cleanedStored);
        const merged: SiteConfig = { ...DEFAULT_CONFIG, ...parsed };

        // Check if config version needs upgrade to ensure new requested images are loaded
        const configVersion = parsed._configVersion || 1;
        const CURRENT_VERSION = 9;

        // If version is older, ensure the new requested carousel, gallery photos, dress code guide and video are applied
        if (configVersion < CURRENT_VERSION) {
          merged.carouselImages = DEFAULT_CONFIG.carouselImages;
          merged.galleryPhotos = DEFAULT_CONFIG.galleryPhotos;
          merged.aboutImageUrl = 'public/images/gal-5.jpeg';
          merged.dressCodeImageUrl = DEFAULT_CONFIG.dressCodeImageUrl;
          merged.giftItems = DEFAULT_CONFIG.giftItems;
          merged.externalGiftListDescription = DEFAULT_CONFIG.externalGiftListDescription;
          merged.videoUrl = 'Convite-videomp4.mp4';
          merged._configVersion = CURRENT_VERSION;
          try {
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(merged));
          } catch (_) {}
        } else {
          // Ensure carouselImages reflects saved images without losing user uploads
          if (Array.isArray(parsed.carouselImages) && parsed.carouselImages.length >= 4) {
            merged.carouselImages = parsed.carouselImages.map((img: any) => ({
              ...img,
              title: sanitizeText(img.title || ''),
              url: resolveImageUrl(img.url, 'portrait'),
            }));
          } else {
            merged.carouselImages = DEFAULT_CONFIG.carouselImages;
          }

          // Map legacy or path URLs in galleryPhotos
          if (Array.isArray(parsed.galleryPhotos) && parsed.galleryPhotos.length >= 6) {
            merged.galleryPhotos = parsed.galleryPhotos.map((img: any) => ({
              ...img,
              title: sanitizeText(img.title || ''),
              url: resolveImageUrl(img.url, 'portrait'),
            }));
          } else {
            merged.galleryPhotos = DEFAULT_CONFIG.galleryPhotos;
          }

          // Map aboutImageUrl
          merged.aboutImageUrl = resolveImageUrl(parsed.aboutImageUrl || DEFAULT_CONFIG.aboutImageUrl, 'aboutMe');

          // Map dressCodeImageUrl
          merged.dressCodeImageUrl = resolveImageUrl(parsed.dressCodeImageUrl || DEFAULT_CONFIG.dressCodeImageUrl, 'dressCodeGuide');
        }

        if (!merged.videoUrl || merged.videoUrl.trim() === '') {
          merged.videoUrl = 'Convite-videomp4.mp4';
        }

        // Sanitize name and text
        merged.debutanteName = sanitizeText(merged.debutanteName) || 'Mariana';
        if (merged.pageTitle === 'XV da Mari' || !merged.pageTitle) {
          merged.pageTitle = 'XV Mari';
        }
        if (!merged.pixKey || merged.pixKey.trim() === '') {
          merged.pixKey = '21964335354';
        }
        if (!merged.aboutImageUrl || merged.aboutImageUrl.includes('galeria-3')) {
          merged.aboutImageUrl = 'public/images/gal-5.jpeg';
        }
        if (merged.aboutText) {
          merged.aboutText = merged.aboutText
            .replace(/Mariana\s+(Resende|Rezende)/gi, 'Mariana')
            .replace(/\b(Resende|Rezende)\b/gi, '');
        }

        cachedConfig = merged;
        return merged;
      }
    } catch (e) {
      console.warn('Erro ao carregar configurações do localStorage:', e);
    }

    cachedConfig = DEFAULT_CONFIG;
    return DEFAULT_CONFIG;
  },

  async loadConfigAsync(): Promise<SiteConfig> {
    const current = this.getConfig();
    try {
      const idbBackup = await mediaDb.getConfigBackup();
      if (idbBackup && typeof idbBackup === 'object') {
        const idbVersion = (idbBackup as any)._configVersion || 1;
        const baseBackup = idbVersion < 9 ? {
          ...idbBackup,
          carouselImages: DEFAULT_CONFIG.carouselImages,
          galleryPhotos: DEFAULT_CONFIG.galleryPhotos,
          aboutImageUrl: 'public/images/gal-5.jpeg',
          dressCodeImageUrl: DEFAULT_CONFIG.dressCodeImageUrl,
          giftItems: DEFAULT_CONFIG.giftItems,
          externalGiftListDescription: DEFAULT_CONFIG.externalGiftListDescription,
          videoUrl: 'Convite-videomp4.mp4',
          _configVersion: 9,
        } : idbBackup;
        const merged: SiteConfig = { ...DEFAULT_CONFIG, ...current, ...baseBackup };
        cachedConfig = merged;
        try {
          localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(merged));
        } catch (_) {}
        return merged;
      }
    } catch (e) {
      console.warn('Falha ao carregar backup de configurações do IndexedDB:', e);
    }
    return current;
  },

  saveConfig(config: SiteConfig): boolean {
    const sanitized: SiteConfig = {
      ...config,
      debutanteName: sanitizeText(config.debutanteName) || 'Mariana',
      aboutText: (config.aboutText || '')
        .replace(/Mariana\s+(Resende|Rezende)/gi, 'Mariana')
        .replace(/\b(Resende|Rezende)\b/gi, ''),
    };

    // Update memory cache immediately
    cachedConfig = sanitized;

    let savedInLocal = false;
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(sanitized));
      savedInLocal = true;
    } catch (e) {
      console.warn('Aviso: localStorage atingiu o limite ou falhou. Salvando backup no IndexedDB...', e);
    }

    // Always persist to IndexedDB asynchronously as an immutable backup
    mediaDb.saveConfigBackup(sanitized).catch((err) => {
      console.warn('Aviso ao salvar backup no IndexedDB:', err);
    });

    // Notify all active listeners across the app
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('xv_config_saved', { detail: sanitized }));
      } catch (_) {}
    }

    // Return true if saved in either localStorage or cached
    return true;
  },

  resetConfig(): SiteConfig {
    try {
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
      cachedConfig = DEFAULT_CONFIG;
      mediaDb.saveConfigBackup(DEFAULT_CONFIG).catch(() => {});
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  },

  // Recados (Guest Messages)
  getMessages(): GuestMessage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao carregar recados:', e);
    }
    return [];
  },

  saveMessage(msg: Omit<GuestMessage, 'id' | 'createdAt'>): GuestMessage | null {
    try {
      const messages = this.getMessages();
      const newMessage: GuestMessage = {
        ...msg,
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: new Date().toISOString(),
      };
      messages.unshift(newMessage);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      return newMessage;
    } catch (e) {
      console.error('Erro ao gravar mensagem:', e);
      return null;
    }
  },

  deleteMessage(id: string): boolean {
    try {
      const messages = this.getMessages().filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // RSVPs
  getRsvps(): RsvpEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RSVPS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao carregar RSVPs:', e);
    }
    return [];
  },

  saveRsvp(entry: Omit<RsvpEntry, 'id' | 'createdAt'>): RsvpEntry | null {
    try {
      const list = this.getRsvps();
      const newEntry: RsvpEntry = {
        ...entry,
        id: 'rsvp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: new Date().toISOString(),
      };
      list.unshift(newEntry);
      localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(list));
      return newEntry;
    } catch (e) {
      console.error('Erro ao salvar RSVP:', e);
      return null;
    }
  },

  deleteRsvp(id: string): boolean {
    try {
      const list = this.getRsvps().filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  exportCsvRsvps(): boolean {
    try {
      const rsvps = this.getRsvps();
      if (rsvps.length === 0) {
        alert('Nenhuma confirmação de presença registrada ainda.');
        return false;
      }
      const headers = ['Nome do Convidado', 'Telefone', 'Acompanhantes', 'Mensagem/Observações', 'Canal', 'Data/Hora'];
      const rows = rsvps.map((r) => [
        `"${(r.guestName || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${r.guestCount ?? 1}"`,
        `"${(r.notes || '').replace(/"/g, '""')}"`,
        `"${r.confirmedVia === 'whatsapp' ? 'WhatsApp' : 'Site'}"`,
        `"${new Date(r.createdAt).toLocaleString('pt-BR')}"`,
      ]);
      const csvContent =
        '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `confirmacoes_xv_mari_google_sheets_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (e) {
      console.error('Erro ao exportar CSV:', e);
      return false;
    }
  },

  getRsvpsAsTsv(): string {
    const rsvps = this.getRsvps();
    if (rsvps.length === 0) return '';
    const headers = ['Nome do Convidado', 'Telefone', 'Acompanhantes', 'Mensagem/Observações', 'Canal', 'Data/Hora'];
    const rows = rsvps.map((r) => [
      r.guestName || '',
      r.phone || '',
      String(r.guestCount ?? 1),
      r.notes || '',
      r.confirmedVia === 'whatsapp' ? 'WhatsApp' : 'Site',
      new Date(r.createdAt).toLocaleString('pt-BR'),
    ]);
    return [headers.join('\t'), ...rows.map((e) => e.join('\t'))].join('\n');
  },

  // Admin PIN / Password (default "mari15")
  getAdminPin(): string {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || 'mari15';
  },

  setAdminPin(newPin: string): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // Export & Import backup
  exportAllData(): string {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      config: this.getConfig(),
      messages: this.getMessages(),
      rsvps: this.getRsvps(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.config) {
        this.saveConfig(parsed.config);
      }
      if (Array.isArray(parsed.messages)) {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(parsed.messages));
      }
      if (Array.isArray(parsed.rsvps)) {
        localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(parsed.rsvps));
      }
      return true;
    } catch (e) {
      console.error('Falha ao importar dados:', e);
      return false;
    }
  },
};
