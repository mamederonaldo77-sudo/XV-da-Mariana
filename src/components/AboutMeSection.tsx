import React from 'react';
import { SoftHeart } from './Ornaments';
import { Heart } from 'lucide-react';

interface AboutMeSectionProps {
  title: string;
  text: string;
  imageUrl: string;
  debutanteName: string;
}

export const AboutMeSection: React.FC<AboutMeSectionProps> = ({
  title,
  text,
  imageUrl,
  debutanteName,
}) => {
  // Split paragraphs by newlines
  const paragraphs = text
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      id="sobre-mim"
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-10"
      aria-label="Sobre a debutante"
    >
      <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-white/70 silver-border shadow-xs">
        {/* Subtle heading badge */}
        <div className="text-center md:text-left mb-6">
          <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
            <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
            <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
              Minha Mensagem
            </span>
            <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
          </div>

          <h2 className="font-cursive text-3xl sm:text-4xl md:text-5xl text-[#5D5068]">
            {title}
          </h2>
        </div>

        {/* 2-column layout: Text on left, Photo on right (stacked on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Text on left */}
          <div className="md:col-span-7 space-y-4 text-sm sm:text-base leading-relaxed text-[#82758D]">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="font-serif-luxury text-base sm:text-lg leading-relaxed">
                {p}
              </p>
            ))}

            <div className="pt-2 flex items-center gap-3">
              <div className="h-0.5 w-12 bg-[#C9B4D9]" />
              <p className="font-cursive text-2xl sm:text-3xl text-[#5D5068]">
                {debutanteName}
              </p>
            </div>
          </div>

          {/* Photo on right */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group max-w-xs w-full">
              {/* Lilac and silver decorative frame */}
              <div className="absolute -inset-1.5 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#C9B4D9] via-[#E7DDEB] to-[#B9B5C4] opacity-80 blur-xs group-hover:opacity-100 transition-opacity" />

              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#C9B4D9] shadow-sm aspect-[4/3] sm:aspect-[4/5] bg-[#F8F5F6]">
                <img
                  src={imageUrl || '/src/assets/images/mari_about_me_1791932737518.jpg'}
                  alt={`Fotografia de ${debutanteName}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Ornamental heart at bottom-right corner */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 border border-[#C9B4D9] flex items-center justify-center shadow-xs">
                  <Heart className="w-4 h-4 fill-[#C9B4D9] text-[#82758D]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
