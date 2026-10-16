import React, { useState } from 'react';
import { DebutanteCrown, SoftHeart, CornerFlourish } from './Ornaments';
import { Sparkles, Music, Mail, Volume2, ArrowDown } from 'lucide-react';

interface InvitationEnvelopeProps {
  debutanteName: string;
  displayDate: string;
  onOpen: () => void;
  isOpen: boolean;
}

export const InvitationEnvelope: React.FC<InvitationEnvelopeProps> = ({
  debutanteName,
  displayDate,
  onOpen,
  isOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 700);
  };

  if (isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#2D2436]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-opacity duration-700 select-none overflow-hidden"
    >
      {/* Decorative floating bokeh particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#C9B4D9]/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#E7DDEB]/25 blur-3xl" />
      </div>

      {/* Main Envelope Container */}
      <div
        className={`relative w-full max-w-lg bg-gradient-to-b from-[#FAF7F8] via-[#F8F5F6] to-[#E7DDEB]/80 rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#C9B4D9]/60 text-center transition-all duration-700 transform ${
          isOpening ? 'scale-105 opacity-0 rotate-1' : 'scale-100 opacity-100'
        }`}
      >
        <CornerFlourish position="top-left" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="top-right" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="bottom-left" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="bottom-right" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C9B4D9]" />

        {/* Crown & Kicker */}
        <div className="relative z-10 flex flex-col items-center">
          <DebutanteCrown className="w-9 h-9 text-[#B9B5C4] mb-2 drop-shadow-xs" />

          <p className="font-serif-luxury tracking-widest uppercase text-xs text-[#82758D] font-medium">
            Convite Especial
          </p>

          <p className="font-cursive text-3xl sm:text-4xl text-[#5D5068] mt-1">
            Meus 15 Anos
          </p>

          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wide text-[#4A3B56] mt-1">
            {debutanteName}
          </h1>

          <div className="w-24 h-0.5 mx-auto my-3 bg-gradient-to-r from-transparent via-[#C9B4D9] to-transparent" />

          <p className="text-xs sm:text-sm text-[#82758D] max-w-xs mx-auto leading-relaxed">
            Você é nosso convidado de honra para celebrar este momento único e inesquecível.
          </p>

          <p className="font-serif-luxury font-semibold text-xs text-[#A49AAA] uppercase tracking-wider mt-2">
            {displayDate}
          </p>

          {/* Virtual Wax Seal Button */}
          <div className="mt-8 relative group">
            {/* Glowing ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#C9B4D9] to-[#E7DDEB] opacity-75 blur-sm group-hover:opacity-100 transition-opacity animate-pulse" />

            <button
              onClick={handleOpenClick}
              className="relative px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C9B4D9] via-[#bf9ece] to-[#C9B4D9] text-[#3D2E47] font-semibold text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 flex items-center gap-2.5 border border-white/60 cursor-pointer"
            >
              <Mail className="w-5 h-5 text-[#3D2E47]" />
              <span>Abrir Convite</span>
              <Sparkles className="w-4 h-4 text-[#3D2E47]" />
            </button>
          </div>

          <p className="text-[11px] text-[#A49AAA] mt-4 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-[#C9B4D9]" />
            <span>Música ambiente iniciará ao abrir</span>
          </p>
        </div>
      </div>
    </div>
  );
};
