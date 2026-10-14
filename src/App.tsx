/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SiteConfig, GuestMessage, RsvpEntry, PageRoute } from './types';
import { storageService, DEFAULT_CONFIG } from './services/storageService';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { PartyDateCard } from './components/PartyDateCard';
import { CountdownSection } from './components/CountdownSection';
import { AboutMeSection } from './components/AboutMeSection';
import { NossaPromessaSection } from './components/NossaPromessaSection';
import { VideoSection } from './components/VideoSection';
import { GiftsSection } from './components/GiftsSection';
import { GallerySection } from './components/GallerySection';
import { GuestbookSection } from './components/GuestbookSection';
import { RsvpSection } from './components/RsvpSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';

function parseRouteFromHash(): PageRoute {
  const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  const validRoutes: PageRoute[] = [
    'inicio',
    'meus-15-anos',
    'nossa-promessa',
    'presentes',
    'recados',
    'fotos',
    'confirmar-presenca',
  ];
  if (validRoutes.includes(hash as PageRoute)) {
    return hash as PageRoute;
  }
  return 'inicio';
}

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Active page state synchronized with URL hash
  const [currentPage, setCurrentPage] = useState<PageRoute>(parseRouteFromHash);

  // Audio state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Romantic celebration royalty-free piano stream
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((e) => {
        console.warn('Playback prevented:', e);
      });
    }
  };

  // Listen to browser Back/Forward navigation via hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseRouteFromHash();
      setCurrentPage(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Programmatic navigation
  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load persisted data on mount
  useEffect(() => {
    const loadedConfig = storageService.getConfig();
    const loadedMessages = storageService.getMessages();
    const loadedRsvps = storageService.getRsvps();

    setConfig(loadedConfig);
    setMessages(loadedMessages);
    setRsvps(loadedRsvps);
  }, []);

  const handleConfigUpdated = (newConfig: SiteConfig) => {
    setConfig(newConfig);
  };

  const handleMessageAdded = (newMsg: GuestMessage) => {
    setMessages((prev) => [newMsg, ...prev]);
  };

  const handleMessagesUpdated = (newMessages: GuestMessage[]) => {
    setMessages(newMessages);
  };

  const handleRsvpsUpdated = (newRsvps: RsvpEntry[]) => {
    setRsvps(newRsvps);
  };

  const handleRsvpRecorded = () => {
    setRsvps(storageService.getRsvps());
  };

  return (
    <div className="min-h-screen bg-pearlescent text-[#82758D] flex flex-col selection:bg-[#C9B4D9]/40 selection:text-[#5E4E6E] relative">
      {/* Header & Navigation Menu (Available across all pages, highlighting active page) */}
      <Header
        debutanteName={config.debutanteName}
        pageTitle={config.pageTitle}
        heroSubheading={config.heroSubheading}
        activePage={currentPage}
        onNavigate={navigateTo}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
      />

      {/* Main Content: Displays EXCLUSIVELY the selected page */}
      <main className="flex-1 flex flex-col py-2 sm:py-4">
        {/* PAGE 1: Início */}
        {currentPage === 'inicio' && (
          <div key="page-inicio" className="animate-fade-in flex flex-col gap-4">
            {/* Carrossel moldurado de fotos logo abaixo do menu */}
            <HeroCarousel images={config.carouselImages} />

            {/* Cartão da data da festa */}
            <PartyDateCard
              partyTitle={config.partyTitle}
              displayDate={config.displayDate}
              displayTime={config.displayTime}
              venueName={config.venueName}
              venueAddress={config.venueAddress}
              venueCity={config.venueCity}
              venueMapsUrl={config.venueMapsUrl}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />

            {/* Contagem regressiva com destaque ampliado */}
            <CountdownSection
              partyDateIso={config.partyDateIso}
              debutanteName={config.debutanteName}
            />
          </div>
        )}

        {/* PAGE 2: Meus 15 Anos */}
        {currentPage === 'meus-15-anos' && (
          <div key="page-meus-15-anos" className="animate-fade-in flex flex-col gap-4">
            {/* Convite em vídeo no início da página */}
            <VideoSection
              videoUrl={config.videoUrl}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />

            {/* Sobre Mim: História da Mariana e mensagem */}
            <AboutMeSection
              title={config.aboutTitle}
              text={config.aboutText}
              imageUrl={config.aboutImageUrl}
              debutanteName={config.debutanteName}
            />
          </div>
        )}

        {/* PAGE 3: Nossa Promessa - Preservada exatamente como aprovada */}
        {currentPage === 'nossa-promessa' && (
          <div key="page-nossa-promessa" className="animate-fade-in flex flex-col gap-4">
            <NossaPromessaSection
              title={config.promiseTitle}
              text={config.promiseText}
              debutanteName={config.debutanteName}
            />
          </div>
        )}

        {/* PAGE 4: Presentes - Reorganizada com blocos separados para Pix e Lista Externa */}
        {currentPage === 'presentes' && (
          <div key="page-presentes" className="animate-fade-in flex flex-col gap-4">
            <GiftsSection
              title={config.giftsTitle}
              subtitle={config.giftsSubtitle}
              pixTitle={config.pixTitle}
              pixMessage={config.pixMessage}
              pixKey={config.pixKey}
              pixQrCodeUrl={config.pixQrCodeUrl}
              externalGiftListTitle={config.externalGiftListTitle}
              externalGiftListDescription={config.externalGiftListDescription}
              externalGiftListUrl={config.externalGiftListUrl}
              externalGiftListButtonText={config.externalGiftListButtonText}
              giftItems={config.giftItems}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />
          </div>
        )}

        {/* PAGE 5: Recados - Preservada como aprovada */}
        {currentPage === 'recados' && (
          <div key="page-recados" className="animate-fade-in flex flex-col gap-4">
            <GuestbookSection
              messages={messages}
              onMessageAdded={handleMessageAdded}
            />
          </div>
        )}

        {/* PAGE 6: Fotos - 2 fotos por fileira (2 colunas) em todas as telas */}
        {currentPage === 'fotos' && (
          <div key="page-fotos" className="animate-fade-in flex flex-col gap-4">
            <GallerySection photos={config.galleryPhotos} />
          </div>
        )}

        {/* PAGE 7: Confirmar Presença - Preservada intacta */}
        {currentPage === 'confirmar-presenca' && (
          <div key="page-confirmar-presenca" className="animate-fade-in flex flex-col gap-4">
            <RsvpSection
              whatsappNumber={config.whatsappNumber}
              onOpenAdmin={() => setIsAdminOpen(true)}
              onRsvpRecorded={handleRsvpRecorded}
              rsvps={rsvps}
            />
          </div>
        )}
      </main>

      {/* 2.4: Rodapé decorativo preservado exatamente como aprovado */}
      <Footer
        debutanteName={config.debutanteName}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={navigateTo}
        activePage={currentPage}
      />

      {/* Floating Music Controls & WhatsApp Share */}
      <FloatingMusicPlayer
        isPlaying={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        debutanteName={config.debutanteName}
      />

      {/* Host Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onConfigUpdated={handleConfigUpdated}
        messages={messages}
        onMessagesUpdated={handleMessagesUpdated}
        rsvps={rsvps}
        onRsvpsUpdated={handleRsvpsUpdated}
      />
    </div>
  );
}
