import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CarouselImage } from '../types';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CornerFlourish, SoftHeart } from './Ornaments';
import { ASSET_IMAGES } from '../assets/imagesMap';

interface HeroCarouselProps {
  images: CarouselImage[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const defaultImagesList: CarouselImage[] = [
    {
      id: 'default-1',
      url: ASSET_IMAGES.portrait,
      title: 'Mariana Resende',
      caption: 'XV da Mari — Celebrando 15 anos de sonhos e encantos',
      alt: 'Mariana Resende Debutante',
    },
    {
      id: 'default-2',
      url: ASSET_IMAGES.garden,
      title: 'Jardim Encantado',
      caption: 'Momentos inesquecíveis iluminados pelo luar',
      alt: 'Mariana no jardim',
    },
    {
      id: 'default-3',
      url: ASSET_IMAGES.waltz,
      title: 'A Grande Valsa',
      caption: 'A magia de dançar o início de um novo capítulo',
      alt: 'Valsa de 15 anos',
    },
  ];

  const rawList = images && Array.isArray(images) && images.length > 0 ? images : defaultImagesList;

  const safeImages = rawList.map((img, idx) => {
    let finalUrl = img.url;
    if (!finalUrl || finalUrl.startsWith('/src/') || finalUrl.includes('mari_carousel_portrait')) {
      finalUrl = idx === 0 ? ASSET_IMAGES.portrait : idx === 1 ? ASSET_IMAGES.garden : ASSET_IMAGES.waltz;
    } else if (finalUrl.includes('mari_carousel_garden')) {
      finalUrl = ASSET_IMAGES.garden;
    } else if (finalUrl.includes('mari_debutante_waltz')) {
      finalUrl = ASSET_IMAGES.waltz;
    }
    return {
      ...img,
      url: finalUrl || ASSET_IMAGES.portrait,
    };
  });

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  // Auto-slide effect (4.5 seconds interval)
  useEffect(() => {
    if (isPaused || safeImages.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, safeImages.length, handleNext]);

  // Touch Swipe Handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (diff > 45) {
      handleNext(); // swiped left
    } else if (diff < -45) {
      handlePrev(); // swiped right
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      id="inicio"
      className="relative max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-2"
      aria-label="Carrossel moldurado de fotos da debutante Mariana Resende"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Moldura Clássica Externa: Moldura artística com relevo, borda prateada e cantoneiras */}
      <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-[#FDFBFB] via-[#F8F5F6] to-[#E7DDEB]/60 border-2 border-[#B9B5C4]/60 shadow-xl overflow-hidden">
        
        {/* Cantoneiras ornamentais na moldura */}
        <CornerFlourish position="top-left" className="w-10 h-10 sm:w-14 sm:h-14 text-[#C9B4D9] z-20 pointer-events-none" />
        <CornerFlourish position="top-right" className="w-10 h-10 sm:w-14 sm:h-14 text-[#C9B4D9] z-20 pointer-events-none" />
        <CornerFlourish position="bottom-left" className="w-10 h-10 sm:w-14 sm:h-14 text-[#C9B4D9] z-20 pointer-events-none" />
        <CornerFlourish position="bottom-right" className="w-10 h-10 sm:w-14 sm:h-14 text-[#C9B4D9] z-20 pointer-events-none" />

        {/* Moldura Interna (Passe-partout perolado com chanfro prateado) */}
        <div className="relative rounded-2xl p-1.5 sm:p-2 bg-gradient-to-tr from-[#C9B4D9]/40 via-white to-[#E7DDEB]/50 border border-[#B9B5C4]/50 shadow-inner">
          
          {/* Container Principal da Fotografia */}
          <div
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[360px] sm:max-h-[480px] rounded-xl overflow-hidden bg-[#FAF7F8] select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {safeImages.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={img.id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={img.url || ASSET_IMAGES.portrait}
                    alt={img.alt || 'Fotografia de Mariana Resende'}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = ASSET_IMAGES.portrait;
                    }}
                    className="w-full h-full object-cover object-center transform transition-transform duration-1000 scale-100"
                    loading="eager"
                  />

                  {/* Legenda com gradiente escuro suave para máxima legibilidade */}
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent pt-10 pb-4 px-6 text-center">
                      <p className="font-serif-luxury text-sm sm:text-base text-white/95 tracking-wide drop-shadow-sm font-medium">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Selo Indicador de Foto e Controle de Auto-play */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-sans font-medium transition-colors">
              <span>
                {currentIndex + 1} / {safeImages.length}
              </span>
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="ml-1 p-0.5 rounded-full hover:text-[#C9B4D9] focus:outline-hidden"
                aria-label={isPaused ? 'Iniciar passagem automática' : 'Pausar passagem automática'}
                title={isPaused ? 'Retomar passagem automática' : 'Pausar'}
              >
                {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
              </button>
            </div>

            {/* Botão Anterior (Manual) */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Foto anterior"
                className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#5D5068] hover:text-[#3D2E47] backdrop-blur-xs flex items-center justify-center transition-all duration-200 border border-[#B9B5C4]/50 shadow-md hover:scale-105 focus:outline-hidden cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Botão Próximo (Manual) */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Próxima foto"
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#5D5068] hover:text-[#3D2E47] backdrop-blur-xs flex items-center justify-center transition-all duration-200 border border-[#B9B5C4]/50 shadow-md hover:scale-105 focus:outline-hidden cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Indicadores Pontilhados (Navegação Manual por Clique) */}
            {safeImages.length > 1 && (
              <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center items-center gap-2 pointer-events-auto">
                {safeImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Ir para a foto ${idx + 1}`}
                    className={`rounded-full transition-all duration-300 focus:outline-hidden cursor-pointer ${
                      idx === currentIndex
                        ? 'w-7 h-2 bg-white shadow-xs'
                        : 'w-2 h-2 bg-white/60 hover:bg-white/90'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
