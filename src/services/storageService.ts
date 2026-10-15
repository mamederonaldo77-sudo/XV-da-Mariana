import { SiteConfig, GuestMessage, RsvpEntry } from '../types';
import { DEFAULT_IMAGE_PATHS, resolveImageUrl } from '../assets/imagesMap';
import { mediaDb } from './mediaDb';

export const DEFAULT_CONFIG: SiteConfig = {
  debutanteName: 'Mariana',
  pageTitle: 'XV da Mari',
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
  aboutImageUrl: DEFAULT_IMAGE_PATHS.aboutMe,

  // Nossa Promessa
  promiseTitle: 'Nossa Promessa',
  promiseText: 'Prometo guardar no coração cada sorriso, cada abraço e cada pessoa que caminha comigo. Que este dia seja repleto de amor, gratidão e magia!\n\nCelebrar meus 15 anos é honrar a promessa de espalhar alegria, carinho e nunca esquecer de onde vim e de todos que amo.',

  videoUrl: '', // Deixar vazio por padrão: "Nosso convite em vídeo estará disponível em breve"

  giftsTitle: 'Presentes & Lista de Desejos',
  giftsSubtitle: 'Se desejar me presentear, deixo aqui algumas opções. O mais importante é a sua presença e o seu carinho!',
  pixTitle: 'Contribuição dos Sonhos (Pix)',
  pixMessage: 'Se desejar me presentear de forma voluntária e contribuir com a realização dos sonhos dos meus 15 anos, deixo aqui a opção de Pix. Sua presença e seu carinho são os maiores presentes!',
  pixKey: '',
  pixQrCodeUrl: '',
  externalGiftListTitle: 'Minha Lista de Presentes',
  externalGiftListDescription: 'Para quem preferir escolher um presente especial, preparei uma lista em uma loja parceira.',
  externalGiftListUrl: '',
  externalGiftListButtonText: 'Acessar Lista de Presentes',

  carouselImages: [
    {
      id: 'c1',
      url: DEFAULT_IMAGE_PATHS.portrait,
      title: 'Mariana',
      caption: 'XV da Mari — Celebrando 15 anos de sonhos e encantos',
      alt: 'Mariana com vestido lilás e tiara delicada',
    },
    {
      id: 'c2',
      url: DEFAULT_IMAGE_PATHS.garden,
      title: 'Jardim Encantado',
      caption: 'Momentos inesquecíveis iluminados pelo luar',
      alt: 'Mariana caminhando no jardim com vestido lilás fluido',
    },
    {
      id: 'c3',
      url: DEFAULT_IMAGE_PATHS.waltz,
      title: 'A Grande Valsa',
      caption: 'A magia de dançar o início de um novo capítulo',
      alt: 'Mariana dançando com vestido de baile lilás brilhante',
    },
  ],

  galleryPhotos: [
    {
      id: 'g1',
      url: DEFAULT_IMAGE_PATHS.portrait,
      title: 'Retrato da Debutante',
      category: 'Ensaio',
      alt: 'Ensaio fotográfico de Mariana com tiara e flores lilás',
    },
    {
      id: 'g2',
      url: DEFAULT_IMAGE_PATHS.garden,
      title: 'Noite Iluminada',
      category: 'Ensaio',
      alt: 'Mariana no jardim iluminado por lanternas',
    },
    {
      id: 'g3',
      url: DEFAULT_IMAGE_PATHS.waltz,
      title: 'Salão Real',
      category: 'Celebração',
      alt: 'Salão de baile com vestido lilás',
    },
    {
      id: 'g4',
      url: DEFAULT_IMAGE_PATHS.aboutMe,
      title: 'Sorriso Espontâneo',
      category: 'Retrato',
      alt: 'Mariana sorrindo com look suave',
    },
    {
      id: 'g5',
      url: DEFAULT_IMAGE_PATHS.decor,
      title: 'Decoração e Flores',
      category: 'Detalhes',
      alt: 'Mesa de banquete com hortênsias lilás e candelabros prateados',
    },
    {
      id: 'g6',
      url: DEFAULT_IMAGE_PATHS.shoes,
      title: 'Brilho e Detalhes',
      category: 'Detalhes',
      alt: 'Salto prateado com brilho, fita lilás e tiara de cristal',
    },
  ],

  giftItems: [
    {
      id: 'gift_1',
      title: 'Mimos para o Quarto',
      category: 'Decoração',
      description: 'Sugestão de mimos e itens decorativos em tons suaves para o meu cantinho.',
    },
    {
      id: 'gift_2',
      title: 'Livraria & Histórias Favoritas',
      category: 'Livros',
      description: 'Livros para a minha coleção e leituras inesquecíveis.',
    },
    {
      id: 'gift_3',
      title: 'Cota para a Valsa dos Sonhos (PIX)',
      category: 'Contribuição',
      description: 'Se desejar contribuir com qualquer valor para a celebração dos meus 15 anos.',
    },
  ],
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

        // Ensure carouselImages reflects saved images without losing user uploads
        if (Array.isArray(parsed.carouselImages)) {
          merged.carouselImages = parsed.carouselImages.map((img: any) => ({
            ...img,
            title: sanitizeText(img.title || ''),
            url: resolveImageUrl(img.url, 'portrait'),
          }));
        } else {
          merged.carouselImages = DEFAULT_CONFIG.carouselImages;
        }

        // Map legacy or path URLs in galleryPhotos
        if (Array.isArray(parsed.galleryPhotos)) {
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

        // Sanitize name and text
        merged.debutanteName = sanitizeText(merged.debutanteName) || 'Mariana';
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
        const merged: SiteConfig = { ...DEFAULT_CONFIG, ...current, ...idbBackup };
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
      const headers = ['Nome do Convidado', 'Telefone', 'Data/Hora da Confirmação'];
      const rows = rsvps.map((r) => [
        `"${r.guestName.replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${new Date(r.createdAt).toLocaleString('pt-BR')}"`,
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `confirmacoes_xv_mari_mariana_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (e) {
      console.error('Erro ao exportar CSV:', e);
      return false;
    }
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
