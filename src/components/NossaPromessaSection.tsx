import React from 'react';
import { CornerFlourish, SoftHeart, SilverDivider } from './Ornaments';
import { Sparkles, Heart } from 'lucide-react';

interface NossaPromessaSectionProps {
  title: string;
  text: string;
  debutanteName: string;
}

export const NossaPromessaSection: React.FC<NossaPromessaSectionProps> = ({
  title,
  text,
  debutanteName,
}) => {
  const paragraphs = text
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      id="nossa-promessa"
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-10"
      aria-label="Nossa Promessa da Debutante"
    >
      <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-12 bg-gradient-to-br from-[#E7DDEB]/70 via-[#FAF7F8] to-[#E7DDEB]/50 silver-border shadow-xs text-center overflow-hidden">
        {/* Corner Ornaments */}
        <CornerFlourish position="top-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="top-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="bottom-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="bottom-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
            <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
            <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
              Gratidão & Amor
            </span>
            <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
          </div>

          {/* Section Title */}
          <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl text-[#5D5068] mb-4">
            {title || 'Nossa Promessa'}
          </h2>

          <div className="w-20 h-0.5 mx-auto mb-6 bg-gradient-to-r from-transparent via-[#C9B4D9] to-transparent" />

          {/* Content paragraphs */}
          <div className="space-y-4 text-sm sm:text-base md:text-lg font-serif-luxury italic text-[#82758D] leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="relative px-4 sm:px-8">
                “{p}”
              </p>
            ))}
          </div>

          {/* Signature */}
          <div className="pt-6 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#E7DDEB] flex items-center justify-center mb-2 shadow-2xs">
              <Heart className="w-4 h-4 fill-[#C9B4D9] text-[#C9B4D9]" />
            </div>
            <p className="font-cursive text-2xl sm:text-3xl text-[#5D5068]">
              {debutanteName}
            </p>
            <p className="text-[11px] font-serif-luxury uppercase tracking-widest text-[#A49AAA] mt-0.5">
              15 Anos de Sonhos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
