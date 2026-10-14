import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';
import { SoftHeart, CornerFlourish } from './Ornaments';

interface PartyLocationSectionProps {
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueMapsUrl: string;
  onOpenAdmin: () => void;
}

export const PartyLocationSection: React.FC<PartyLocationSectionProps> = ({
  venueName,
  venueAddress,
  venueCity,
  venueMapsUrl,
  onOpenAdmin,
}) => {
  const [copied, setCopied] = useState(false);

  const hasVenue = Boolean(venueName && venueName.trim().length > 0);
  const fullAddress = [venueAddress, venueCity].filter(Boolean).join(', ');

  const mapsLink =
    venueMapsUrl && venueMapsUrl.trim().length > 0
      ? venueMapsUrl
      : fullAddress || venueName
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [venueName, fullAddress].filter(Boolean).join(' ')
        )}`
      : '';

  const handleCopyAddress = () => {
    const textToCopy = [venueName, fullAddress].filter(Boolean).join(' - ');
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-8"
      aria-label="Localização da festa de 15 anos"
    >
      <div className="relative rounded-3xl p-6 sm:p-10 bg-[#E7DDEB]/70 silver-border shadow-sm overflow-hidden text-center">
        <CornerFlourish position="top-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="top-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Header */}
          <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
            <MapPin className="w-4 h-4 text-[#C9B4D9]" />
            <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
              Onde Celebrar
            </span>
            <MapPin className="w-4 h-4 text-[#C9B4D9]" />
          </div>

          <h2 className="font-cursive text-4xl sm:text-5xl text-[#5D5068]">
            Local da Recepção
          </h2>

          <p className="font-serif-luxury italic text-sm sm:text-base text-[#82758D] mt-1 mb-6">
            Venha celebrar conosco essa noite inesquecível
          </p>

          {hasVenue ? (
            <div className="p-6 rounded-2xl bg-white/95 border border-[#B9B5C4]/40 shadow-xs text-left max-w-xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E7DDEB] flex items-center justify-center text-[#5D5068] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-[#82758D]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif-luxury text-xl font-bold text-[#4A3B56]">
                    {venueName}
                  </h3>
                  {fullAddress && (
                    <p className="text-xs sm:text-sm text-[#82758D] mt-1 leading-relaxed">
                      {fullAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons: Open in Maps & Copy Address */}
              <div className="mt-5 pt-4 border-t border-[#B9B5C4]/20 flex flex-wrap gap-2.5">
                {mapsLink && (
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#3D2E47] text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Abrir no Google Maps</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}

                {fullAddress && (
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF7F8] hover:bg-[#E7DDEB] text-[#5D5068] text-xs font-medium border border-[#B9B5C4]/40 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Endereço copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#82758D]" />
                        <span>Copiar Endereço</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Clean placeholder when venue is not yet set by the family */
            <div className="p-6 rounded-2xl bg-white/80 border border-[#B9B5C4]/40 max-w-xl mx-auto text-center shadow-2xs">
              <MapPin className="w-8 h-8 text-[#C9B4D9] mx-auto mb-2" />
              <p className="font-serif-luxury text-base font-semibold text-[#5D5068]">
                Local da celebração a ser informado
              </p>
              <p className="text-xs text-[#82758D] mt-1 max-w-md mx-auto">
                O endereço e as informações de localização da recepção serão disponibilizados pela família em breve.
              </p>
              <button
                onClick={onOpenAdmin}
                className="mt-3 text-xs text-[#82758D] hover:text-[#4A3B56] underline underline-offset-4 cursor-pointer"
              >
                Cadastrar local da festa no painel administrativo
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
