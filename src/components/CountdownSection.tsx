import React, { useState, useEffect } from 'react';
import { SoftHeart, SilverDivider, CornerFlourish, DebutanteCrown } from './Ornaments';
import { Sparkles, Calendar } from 'lucide-react';

interface CountdownSectionProps {
  partyDateIso: string;
  debutanteName: string;
}

interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  partyDateIso,
  debutanteName,
}) => {
  const calculateTime = (): TimeRemaining => {
    const target = new Date(partyDateIso).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        totalMs: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isCompleted: true,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      totalMs: difference,
      days,
      hours,
      minutes,
      seconds,
      isCompleted: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [partyDateIso]);

  return (
    <section
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-10 text-center"
      aria-label="Contagem regressiva para a festa de 15 anos"
    >
      <div className="relative max-w-3xl mx-auto rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-white/90 via-[#FAF7F8]/95 to-[#E7DDEB]/40 silver-border shadow-md overflow-hidden">
        {/* Corner Flourishes */}
        <CornerFlourish position="top-left" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="top-right" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C9B4D9]" />

        {/* Small Tiara & Cursive Title "Faltam" */}
        <div className="relative z-10">
          <div className="flex justify-center mb-1">
            <DebutanteCrown className="w-7 h-7 text-[#B9B5C4]" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <SoftHeart className="w-4 h-4 text-[#C9B4D9]" />
            <h2 className="font-cursive text-5xl sm:text-6xl md:text-7xl text-[#5D5068] tracking-wide">
              Faltam
            </h2>
            <SoftHeart className="w-4 h-4 text-[#C9B4D9]" />
          </div>

          <p className="font-serif-luxury italic text-base sm:text-xl text-[#82758D] mb-8">
            Para o momento mais esperado dos meus 15 anos
          </p>

          {timeLeft.isCompleted ? (
            /* Celebratory message when date arrives */
            <div className="p-8 rounded-2xl bg-[#E7DDEB]/90 silver-border max-w-md mx-auto shadow-sm">
              <Sparkles className="w-10 h-10 text-[#C9B4D9] mx-auto mb-3 animate-bounce" />
              <h3 className="font-serif-luxury text-3xl font-bold text-[#5D5068]">
                O Grande Dia Chegou!
              </h3>
              <p className="text-sm sm:text-base text-[#82758D] mt-2 leading-relaxed">
                Estamos celebrando com muita alegria e emoção os 15 anos de {debutanteName}!
              </p>
            </div>
          ) : (
            /* 4 Grand Timer Indicators - High Visual Presence */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-w-2xl mx-auto">
              {/* Dias */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-7 rounded-2xl bg-white/95 border border-[#B9B5C4]/40 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-[#4A3B56] tabular-nums tracking-tight">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#82758D] mt-2">
                  Dias
                </span>
              </div>

              {/* Horas */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-7 rounded-2xl bg-white/95 border border-[#B9B5C4]/40 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-[#4A3B56] tabular-nums tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#82758D] mt-2">
                  Horas
                </span>
              </div>

              {/* Minutos */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-7 rounded-2xl bg-white/95 border border-[#B9B5C4]/40 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-[#4A3B56] tabular-nums tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#82758D] mt-2">
                  Minutos
                </span>
              </div>

              {/* Segundos */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-7 rounded-2xl bg-gradient-to-b from-white to-[#FAF7F8] border border-[#C9B4D9] shadow-sm hover:shadow-md transition-shadow">
                <span className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-[#9D7EAE] tabular-nums tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#9D7EAE] mt-2">
                  Segundos
                </span>
              </div>
            </div>
          )}

          <SilverDivider className="mt-8 mb-2" />
        </div>
      </div>
    </section>
  );
};
