import React from 'react';
import { Gift, Heart, QrCode, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { SoftHeart, CornerFlourish } from './Ornaments';
import { PageRoute } from '../types';

interface HomeGiftsTeaserProps {
  giftsTitle: string;
  giftsSubtitle: string;
  pixTitle: string;
  externalGiftListTitle: string;
  onNavigate: (page: PageRoute) => void;
  hasPixConfigured: boolean;
  hasExternalListConfigured: boolean;
}

export const HomeGiftsTeaser: React.FC<HomeGiftsTeaserProps> = ({
  giftsTitle,
  giftsSubtitle,
  pixTitle,
  externalGiftListTitle,
  onNavigate,
  hasPixConfigured,
  hasExternalListConfigured,
}) => {
  return (
    <section
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-8"
      aria-label="Sugestões de presentes"
    >
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#E7DDEB]/70 via-[#FAF7F8] to-[#E7DDEB]/50 silver-border shadow-sm overflow-hidden text-center">
        <CornerFlourish position="top-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="top-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Header */}
          <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
            <Gift className="w-4 h-4 text-[#C9B4D9]" />
            <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
              Mimos & Sonhos
            </span>
            <Gift className="w-4 h-4 text-[#C9B4D9]" />
          </div>

          <h2 className="font-cursive text-4xl sm:text-5xl text-[#5D5068]">
            {giftsTitle || 'Você pode escolher'}
          </h2>

          <p className="font-serif-luxury italic text-sm sm:text-base text-[#82758D] mt-2 max-w-xl mx-auto leading-relaxed">
            {giftsSubtitle ||
              'Se desejar me presentear, deixo aqui algumas opções. O mais importante é a sua presença e o seu carinho!'}
          </p>

          {/* 2 Feature Cards Teaser */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-left">
            {/* Card 1: Pix */}
            <div className="p-5 rounded-2xl bg-white/90 border border-[#B9B5C4]/30 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#E7DDEB] flex items-center justify-center text-[#5D5068] mb-3">
                  <QrCode className="w-5 h-5 text-[#82758D]" />
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#5D5068]">
                  {pixTitle || 'Contribuição dos Sonhos (Pix)'}
                </h3>
                <p className="text-xs text-[#82758D] mt-1 leading-relaxed">
                  Contribuição carinhosa e voluntária para ajudar na realização dos sonhos dos 15 anos.
                </p>
              </div>
              <button
                onClick={() => onNavigate('presentes')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D5068] hover:text-[#4A3B56] underline underline-offset-4 cursor-pointer"
              >
                <span>Ver detalhes do Pix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Lista de Presentes */}
            <div className="p-5 rounded-2xl bg-white/90 border border-[#B9B5C4]/30 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#E7DDEB] flex items-center justify-center text-[#5D5068] mb-3">
                  <Gift className="w-5 h-5 text-[#82758D]" />
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#5D5068]">
                  {externalGiftListTitle || 'Minha Lista de Presentes'}
                </h3>
                <p className="text-xs text-[#82758D] mt-1 leading-relaxed">
                  Sugestões de mimos e presentes especiais selecionados com todo carinho.
                </p>
              </div>
              <button
                onClick={() => onNavigate('presentes')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D5068] hover:text-[#4A3B56] underline underline-offset-4 cursor-pointer"
              >
                <span>Acessar Lista Completa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Full Gifts Navigation Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('presentes')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#3D2E47] text-xs sm:text-sm font-semibold tracking-wide border border-[#A49AAA] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              <span>Ver Página Completa de Presentes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
