import React, { useState, useEffect } from 'react';
import { GalleryPhoto } from '../types';
import { SoftHeart } from './Ornaments';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GallerySectionProps {
  photos: GalleryPhoto[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ photos }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = () => {
    if (activePhotoIndex !== null && photos.length > 0) {
      setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (activePhotoIndex !== null && photos.length > 0) {
      setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, photos.length]);

  return (
    <section
      id="fotos"
      className="relative max-w-5xl mx-auto px-3 sm:px-6 py-12"
      aria-label="Galeria de fotografias da Mariana"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
          <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
          <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
            Recordações
          </span>
          <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
        </div>
        <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl text-[#5D5068]">
          Nossa Galeria
        </h2>
        <p className="font-serif-luxury italic text-sm sm:text-base text-[#82758D] mt-1">
          Cada momento eternizado em um lindo ensaio
        </p>
      </div>

      {/* Grid: strictly 2 photos per row (2 columns) on both mobile and desktop */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
        {photos.map((photo, index) => (
          <div
            key={photo.id || index}
            onClick={() => openLightbox(index)}
            className="group relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-white p-1.5 sm:p-2 silver-border shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF7F8]">
              <img
                src={photo.url}
                alt={photo.alt || photo.title || 'Foto de Mariana'}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover overlay with title and expand icon */}
              <div className="absolute inset-0 bg-[#4A3B56]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                <Maximize2 className="w-5 h-5 text-white/90 mb-auto ml-auto" />
                {photo.title && (
                  <p className="font-serif-luxury text-xs sm:text-sm font-semibold truncate drop-shadow-xs">
                    {photo.title}
                  </p>
                )}
                {photo.category && (
                  <p className="text-[10px] text-white/80 uppercase tracking-wider">
                    {photo.category}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhotoIndex !== null && photos[activePhotoIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            aria-label="Fechar visualização de imagem"
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[activePhotoIndex].url}
              alt={photos[activePhotoIndex].alt || 'Foto ampliada'}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/20"
            />
            <div className="mt-3 text-center text-white">
              <p className="font-serif-luxury text-base sm:text-lg">
                {photos[activePhotoIndex].title || 'Fotografia de Debutante'}
              </p>
              <p className="text-xs text-white/70">
                {activePhotoIndex + 1} de {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
