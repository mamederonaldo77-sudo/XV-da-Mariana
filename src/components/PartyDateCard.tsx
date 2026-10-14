import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, CalendarPlus } from 'lucide-react';
import { CornerFlourish, SoftHeart } from './Ornaments';

interface PartyDateCardProps {
  partyTitle: string;
  displayDate: string;
  displayTime: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueMapsUrl: string;
  onOpenAdmin: () => void;
}

export const PartyDateCard: React.FC<PartyDateCardProps> = ({
  partyTitle,
  displayDate,
  displayTime,
  venueName,
  venueAddress,
  venueCity,
  venueMapsUrl,
  onOpenAdmin,
}) => {
  // Generate Google Calendar Link
  const makeGoogleCalendarUrl = () => {
    const title = encodeURIComponent('XV da Mari — 15 Anos de Mariana Resende');
    const details = encodeURIComponent(
      'Comemoração inesquecível dos 15 anos de Mariana Resende!\n' +
      (venueName ? `Local: ${venueName} - ${venueAddress}, ${venueCity}` : 'Local a ser confirmado')
    );
    const location = encodeURIComponent(
      venueName ? `${venueName}, ${venueAddress}, ${venueCity}` : 'Brasil'
    );
    // 2026-11-13T20:00:00 to 2026-11-14T04:00:00 BRT (UTC-3 -> UTC is 23:00 to 07:00)
    const dates = '20261113T230000Z/20261114T070000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const hasVenue = Boolean(venueName && venueName.trim().length > 0);

  return (
    <section
      id="meus-15-anos"
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-4"
      aria-label="Informações da festa de 15 anos"
    >
      <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-[#E7DDEB]/80 silver-border shadow-sm text-center overflow-hidden">
        {/* Subtle Corner Flourishes */}
        <CornerFlourish position="top-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="top-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="bottom-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="bottom-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />

        {/* Section Title */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
            <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
            <span className="font-serif-luxury text-sm tracking-widest uppercase">
              Celebração Inesquecível
            </span>
            <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
          </div>

          <h2 className="font-cursive text-3xl sm:text-4xl md:text-5xl text-[#5D5068] mb-1">
            {partyTitle}
          </h2>

          <p className="font-serif-luxury italic text-base sm:text-lg text-[#82758D] mb-4">
            Será realizada no dia
          </p>

          {/* Date & Time Highlights */}
          <div className="my-5 p-4 sm:p-6 bg-white/70 rounded-2xl border border-[#B9B5C4]/30 max-w-lg mx-auto shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Date */}
              <div className="flex flex-col items-center justify-center p-2 border-b sm:border-b-0 sm:border-r border-[#B9B5C4]/20">
                <div className="w-10 h-10 rounded-full bg-[#E7DDEB] flex items-center justify-center text-[#82758D] mb-2 shadow-2xs">
                  <Calendar className="w-5 h-5 text-[#82758D]" />
                </div>
                <p className="text-xs uppercase tracking-wider text-[#A49AAA] font-medium">Data</p>
                <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#5D5068] mt-0.5">
                  {displayDate}
                </p>
                <p className="text-xs text-[#82758D] mt-0.5">Sexta-feira</p>
              </div>

              {/* Time */}
              <div className="flex flex-col items-center justify-center p-2">
                <div className="w-10 h-10 rounded-full bg-[#E7DDEB] flex items-center justify-center text-[#82758D] mb-2 shadow-2xs">
                  <Clock className="w-5 h-5 text-[#82758D]" />
                </div>
                <p className="text-xs uppercase tracking-wider text-[#A49AAA] font-medium">Horário</p>
                <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#5D5068] mt-0.5">
                  {displayTime}
                </p>
                <p className="text-xs text-[#82758D] mt-0.5">Recepção dos Convidados</p>
              </div>
            </div>
          </div>

          {/* Location Block */}
          <div className="max-w-lg mx-auto mt-4 p-4 rounded-xl bg-white/50 border border-[#B9B5C4]/30 text-left sm:text-center">
            <div className="flex items-start sm:items-center justify-start sm:justify-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[#C9B4D9] shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#82758D]">
                Local da Recepção
              </span>
            </div>

            {hasVenue ? (
              <div className="mt-1">
                <p className="font-serif-luxury text-lg font-semibold text-[#5D5068]">
                  {venueName}
                </p>
                {(venueAddress || venueCity) && (
                  <p className="text-xs sm:text-sm text-[#82758D] mt-0.5">
                    {[venueAddress, venueCity].filter(Boolean).join(' • ')}
                  </p>
                )}
                {venueMapsUrl && (
                  <a
                    href={venueMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#5D5068] hover:text-[#4A3B56] font-medium mt-2 underline underline-offset-4"
                  >
                    <span>Abrir no Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="mt-1 text-xs text-[#82758D]">
                <p className="italic">
                  O local oficial da celebração será configurado e informado em breve pela família.
                </p>
                <button
                  onClick={onOpenAdmin}
                  className="mt-2 text-[11px] text-[#A49AAA] hover:text-[#5D5068] underline underline-offset-2"
                >
                  Configurar local no painel da anfitriã
                </button>
              </div>
            )}
          </div>

          {/* Save to Calendar Button */}
          <div className="mt-5">
            <a
              href={makeGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-[#F8F5F6] text-[#5D5068] text-xs sm:text-sm font-medium border border-[#B9B5C4]/40 shadow-xs transition-colors"
            >
              <CalendarPlus className="w-4 h-4 text-[#C9B4D9]" />
              <span>Salvar data no Google Agenda</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
