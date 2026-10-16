import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CarouselImage } from '../types';
import { ChevronLeft, ChevronRight, Pause, Play, Image as ImageIcon } from 'lucide-react';
import { CornerFlourish } from './Ornaments';
import { resolveImageUrl, OFFICIAL_IMAGES } from '../assets/imagesMap';

/**
 * Permanent, fixed carousel images stored inside the project files.
 * Guaranteed to display identically for all visitors without using localStorage/IndexedDB.
 */
export const PERMANENT_CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: 'c_giro',
    url: 'public/images/giro1-2.jpeg',
    title: 'Mariana Amorim',
    caption: 'XV Mari — O encanto e a magia de viver este sonho',
    alt: 'Mariana dançando com seu vestido de valsa no salão real',
  },
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
];

interface HeroCarouselProps {
  images?: CarouselImage[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoadedState, setImageLoadedState] = useState<Record<string, boolean>>({});
  const [, setImageErrorState] = useState<Record<string, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check user preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }
  }, []);

  // Permanent, fixed images from the project (zero reliance on browser cache/localStorage)
  const activeImagesList = PERMANENT_CAROUSEL_IMAGES;
  const totalCount = activeImagesList.length;

  // Make sure currentIndex stays within bounds
  useEffect(() => {
    if (totalCount > 0 && currentIndex >= totalCount) {
      setCurrentIndex(0);
    }
  }, [totalCount, currentIndex]);

  // Advance to next image (with loop to first)
  const handleNext = useCallback(() => {
    if (totalCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalCount);
  }, [totalCount]);

  // Move to previous image (with loop to last)
  const handlePrev = useCallback(() => {
    if (totalCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalCount) % totalCount);
  }, [totalCount]);

  // Direct selection of an image via indicators
  const handleSelectIndex = useCallback((index: number) => {
    if (index >= 0 && index < totalCount) {
      setCurrentIndex(index);
    }
  }, [totalCount]);

  // Setup predictable auto-advance timer (4.5-second interval)
  useEffect(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    if (!isPaused && totalCount > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalCount);
      }, 4500);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isPaused, totalCount, currentIndex]);

  // Touch handlers for mobile swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 40) {
      handleNext(); // swiped left -> next
    } else if (diff < -40) {
      handlePrev(); // swiped right -> prev
    }
    touchStartXRef.current = null;
  };

  const handleImageLoad = (id: string) => {
    setImageLoadedState((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageErrorState((prev) => ({ ...prev, [id]: true }));
    const target = e.currentTarget;
    target.onerror = null; // Prevent infinite loops
    if (id === 'c_giro') target.src = OFFICIAL_IMAGES.giro12;
    else if (id === 'c1') target.src = OFFICIAL_IMAGES.carrossel1;
    else if (id === 'c2') target.src = OFFICIAL_IMAGES.carrossel2;
    else if (id === 'c3') target.src = OFFICIAL_IMAGES.carrossel3;
    else if (id === 'c4') target.src = OFFICIAL_IMAGES.carrossel4;
    else target.src = OFFICIAL_IMAGES.giro12;
  };

  return (
    <section
      id="carrossel-principal"
      className="relative max-w-4xl mx-auto px-3 sm:px-6 pt-3 pb-2 w-full"
      aria-label="Carrossel de fotografias da debutante Mariana"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Moldura Clássica Externa: Moldura artística com relevo, borda prateada e cantoneiras */}
      <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-[#FDFBFB] via-[#F8F5F6] to-[#E7DDEB]/60 border-2 border-[#B9B5C4]/60 shadow-xl overflow-hidden">
        
        {/* Cantoneiras ornamentais na moldura externa */}
        <CornerFlourish position="top-left" className="w-10 h-10 sm:w-14 sm:h-14 text-[#C9B4D9] z-20 pointer-events-none" />
        <CornerFlourish position="top-right" className="w-10 h-10 sm:w-14 sm:h-14 text-[#C9B4D9] z-20 pointer-events-none" />
        <CornerFlourish position="bottom-left" className="w-10 h-10 sm:w-14 sm:h-14 text-[#C9B4D9] z-20 pointer-events-none" />
        <CornerFlourish position="bottom-right" className="w-10 h-10 sm:w-14 sm:h-14 text-[#C9B4D9] z-20 pointer-events-none" />

        {/* Moldura Interna (Passe-partout perolado com chanfro prateado) */}
        <div className="relative rounded-2xl p-1.5 sm:p-2 bg-gradient-to-tr from-[#C9B4D9]/40 via-white to-[#E7DDEB]/50 border border-[#B9B5C4]/50 shadow-inner">
          
          {/* Container Principal da Fotografia */}
          <div
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[360px] sm:max-h-[460px] rounded-xl overflow-hidden bg-[#FAF7F8] select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* ESTADO VAZIO DISCRETO */}
            {totalCount === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#FAF7F8] to-[#E7DDEB]/30">
                <div className="w-14 h-14 rounded-full bg-[#E7DDEB] flex items-center justify-center text-[#82758D] mb-3 shadow-2xs">
                  <ImageIcon className="w-7 h-7 text-[#82758D]" />
                </div>
                <h3 className="font-serif-luxury text-lg sm:text-xl font-semibold text-[#5D5068]">
                  Fotografias da Debutante
                </h3>
                <p className="font-serif-luxury italic text-xs sm:text-sm text-[#A49AAA] mt-1 max-w-xs">
                  As fotografias da celebração serão disponibilizadas aqui em breve.
                </p>
              </div>
            ) : (
              /* LISTA DE FOTOGRAFIAS FIXAS E PERMANENTES DO PROJETO */
              activeImagesList.map((img, idx) => {
                const isActive = idx === currentIndex;
                const isLoaded = Boolean(imageLoadedState[img.id || String(idx)]);
                const resolvedSrc = resolveImageUrl(
                  img.url,
                  idx === 0 ? 'giro' : idx === 1 ? 'portrait' : idx === 2 ? 'garden' : idx === 3 ? 'waltz' : 'special'
                );

                return (
                  <div
                    key={img.id || idx}
                    className={`absolute inset-0 ${
                      prefersReducedMotion ? '' : 'transition-opacity duration-700 ease-in-out'
                    } ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                    aria-hidden={!isActive}
                  >
                    {/* Placeholder Shimmer suave enquanto carrega */}
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F8] via-[#E7DDEB]/40 to-[#FAF7F8] animate-pulse" />
                    )}

                    <img
                      src={resolvedSrc}
                      alt={img.alt || img.title || 'Fotografia de Mariana'}
                      onLoad={() => handleImageLoad(img.id || String(idx))}
                      onError={(e) => handleImageError(img.id || String(idx), e)}
                      className={`w-full h-full object-cover object-center ${
                        prefersReducedMotion ? '' : 'transform transition-transform duration-1000 scale-100'
                      }`}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />

                    {/* Legenda com gradiente escuro suave para máxima legibilidade */}
                    {(img.caption || img.title) && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent pt-10 pb-4 px-6 text-center pointer-events-none">
                        {img.title && (
                          <p className="font-serif-luxury text-xs sm:text-sm text-white/80 uppercase tracking-widest font-semibold mb-0.5">
                            {img.title}
                          </p>
                        )}
                        {img.caption && (
                          <p className="font-serif-luxury text-sm sm:text-base text-white/95 tracking-wide drop-shadow-sm font-medium">
                            {img.caption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* CONTROLES DO CARROSSEL */}
            {totalCount > 1 && (
              <>
                {/* Selo Indicador de Posição e Controle de Auto-play */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/45 hover:bg-black/60 text-white backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-sans font-medium transition-colors">
                  <span>
                    {currentIndex + 1} / {totalCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPaused((prev) => !prev)}
                    className="ml-1 p-0.5 rounded-full hover:text-[#C9B4D9] focus:outline-hidden cursor-pointer"
                    aria-label={isPaused ? 'Iniciar reprodução automática' : 'Pausar reprodução automática'}
                    title={isPaused ? 'Retomar reprodução automática' : 'Pausar reprodução automática'}
                  >
                    {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
                  </button>
                </div>

                {/* Botão Anterior */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#4A3B56] hover:text-[#2A1D36] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer border border-[#B9B5C4]/30"
                  aria-label="Ver foto anterior"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Botão Próximo */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#4A3B56] hover:text-[#2A1D36] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer border border-[#B9B5C4]/30"
                  aria-label="Ver próxima foto"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Indicadores de Posição (Bolinhas) */}
        {totalCount > 1 && (
          <div className="flex justify-center items-center gap-2 mt-3 select-none">
            {activeImagesList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectIndex(idx)}
                aria-label={`Ir para a foto ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-[#82758D]'
                    : 'w-2 h-2 bg-[#B9B5C4]/60 hover:bg-[#A49AAA]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
