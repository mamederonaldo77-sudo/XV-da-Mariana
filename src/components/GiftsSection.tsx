import React, { useState, useEffect } from 'react';
import { GiftItem } from '../types';
import { Gift, QrCode, ExternalLink, Copy, Check, Sparkles, Heart, Gem } from 'lucide-react';
import { CornerFlourish } from './Ornaments';
import { generatePixPayload, generatePixQrCodeDataUrl, normalizePixKey } from '../utils/pixPayload';

interface GiftsSectionProps {
  title: string;
  subtitle: string;
  pixTitle: string;
  pixMessage: string;
  pixKey: string;
  pixQrCodeUrl?: string;
  externalGiftListTitle: string;
  externalGiftListDescription: string;
  externalGiftListUrl: string;
  externalGiftListButtonText: string;
  giftItems?: GiftItem[];
  onOpenAdmin: () => void;
}

export const GiftsSection: React.FC<GiftsSectionProps> = ({
  title,
  subtitle,
  pixTitle,
  pixMessage,
  pixKey,
  pixQrCodeUrl,
  externalGiftListTitle,
  externalGiftListDescription,
  externalGiftListUrl,
  externalGiftListButtonText,
  giftItems = [],
  onOpenAdmin,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Default PIX phone key: 21964335354
  const effectivePixKey = pixKey && pixKey.trim().length > 0 ? pixKey.trim() : '21964335354';

  // Generate official BACEN BR Code EMV payload
  const pixPayload = generatePixPayload(effectivePixKey, 'Mariana', 'Rio de Janeiro');

  // Generate local SVG/Canvas QR Code data URL asynchronously
  useEffect(() => {
    let isMounted = true;
    generatePixQrCodeDataUrl(effectivePixKey, 'Mariana', 'Rio de Janeiro')
      .then((dataUrl) => {
        if (isMounted) {
          setQrCodeDataUrl(dataUrl);
        }
      })
      .catch((err) => {
        console.warn('Erro ao gerar QR Code local:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [effectivePixKey]);

  const handleCopyPix = (key: string) => {
    // For key copy, provide clean phone format
    const cleanKey = key.replace(/\D/g, '') || key;
    navigator.clipboard.writeText(cleanKey);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCopyPayload = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  const hasExternalList = Boolean(externalGiftListUrl && externalGiftListUrl.trim().length > 0);

  // Active QR Code source: custom admin URL if provided, otherwise the locally generated BACEN Data URL
  const qrCodeSrc = pixQrCodeUrl && pixQrCodeUrl.trim().length > 0 ? pixQrCodeUrl : qrCodeDataUrl;

  // Format phone display nicely: (21) 96433-5354
  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, '');
    if (d.length === 11) {
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }
    return val;
  };

  return (
    <section
      id="presentes"
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-10"
      aria-label="Sugestões de presentes e contribuição"
    >
      {/* Section Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
          <Sparkles className="w-4 h-4 text-[#C9B4D9]" />
          <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
            Mimos & Sonhos
          </span>
          <Sparkles className="w-4 h-4 text-[#C9B4D9]" />
        </div>

        <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl text-[#5D5068]">
          {title || 'Você pode escolher'}
        </h2>

        <p className="font-serif-luxury italic text-base sm:text-lg text-[#82758D] mt-2 leading-relaxed">
          {subtitle ||
            'Se desejar me presentear, deixo aqui algumas opções. O mais importante é a sua presença e o seu carinho!'}
        </p>

        <div className="w-24 h-0.5 mx-auto mt-4 bg-gradient-to-r from-transparent via-[#C9B4D9] to-transparent" />
      </div>

      {/* Two Main Spacious, Separated Blocks */}
      <div className="space-y-8 max-w-2xl mx-auto">
        
        {/* BLOCK 1: Contribuição Voluntária via Pix (Functional BACEN QR Code) */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#E7DDEB]/70 via-white to-[#E7DDEB]/50 silver-border shadow-sm overflow-hidden text-center">
          <CornerFlourish position="top-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
          <CornerFlourish position="top-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />

          <div className="relative z-10">
            {/* Pix Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#E7DDEB] flex items-center justify-center text-[#5D5068] mx-auto mb-3 shadow-2xs">
              <QrCode className="w-6 h-6 text-[#5D5068]" />
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#4A3B56]">
              {pixTitle || 'Contribuição dos Sonhos (Pix)'}
            </h3>

            {/* Sensible & Affectionate Message */}
            <p className="text-xs sm:text-sm text-[#82758D] mt-2 max-w-lg mx-auto leading-relaxed">
              {pixMessage ||
                'Se desejar me presentear de forma voluntária e contribuir com a realização dos sonhos dos meus 15 anos, deixo aqui a opção de Pix. Sua presença e seu carinho são os maiores presentes!'}
            </p>

            {/* Pix Details */}
            <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-white/95 border border-[#B9B5C4]/40 max-w-md mx-auto shadow-2xs">
              {/* QR Code Container with Live BACEN BR Code */}
              <div className="flex flex-col items-center mb-4">
                <div className="p-3 rounded-2xl bg-white border border-[#B9B5C4]/40 shadow-sm flex items-center justify-center min-w-[200px] min-h-[200px]">
                  {qrCodeSrc ? (
                    <img
                      src={qrCodeSrc}
                      alt="QR Code Pix - Mariana 15 Anos"
                      className="w-44 h-44 object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-[#82758D]">
                      <QrCode className="w-10 h-10 animate-pulse text-[#C9B4D9] mb-2" />
                      <span className="text-xs">Gerando QR Code Pix...</span>
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-[#82758D] font-medium mt-2.5">
                  Aponte a câmera do aplicativo do seu banco para o QR Code acima
                </span>
              </div>

              {/* Pix Key Display & Copy Buttons */}
              <div className="text-left space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#82758D] mb-1">
                    Chave Pix (Telefone Celular)
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F8] border border-[#B9B5C4]/40">
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#3D2E47] truncate flex-1 select-all">
                      {formatPhone(effectivePixKey)}
                    </span>
                    <span className="text-[10px] text-[#A49AAA] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#E7DDEB]/60">
                      Celular
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyPix(effectivePixKey)}
                    className="w-full py-2.5 px-3 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#3D2E47] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    {copiedKey === effectivePixKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-800 font-bold">Chave Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#3D2E47]" />
                        <span>Copiar Chave Pix</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyPayload}
                    className="w-full py-2.5 px-3 rounded-full bg-[#E7DDEB] hover:bg-[#ded1e4] text-[#5D5068] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer border border-[#B9B5C4]/40"
                    title="Código oficial Copia e Cola para colar diretamente no seu banco"
                  >
                    {copiedPayload ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-800 font-bold">Copia e Cola Copiado!</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-3.5 h-3.5 text-[#5D5068]" />
                        <span>Pix Copia e Cola</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 2: Opção "Minha Lista de Presentes" com as sugestões solicitadas */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-white via-[#FAF7F8] to-[#E7DDEB]/50 silver-border shadow-sm overflow-hidden text-center">
          <CornerFlourish position="top-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
          <CornerFlourish position="top-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />

          <div className="relative z-10">
            {/* Gift List Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#E7DDEB] flex items-center justify-center text-[#5D5068] mx-auto mb-3 shadow-2xs">
              <Gift className="w-6 h-6 text-[#5D5068]" />
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#4A3B56]">
              {externalGiftListTitle || 'Minha Lista de Presentes'}
            </h3>

            <p className="text-xs sm:text-sm text-[#82758D] mt-2 max-w-lg mx-auto leading-relaxed">
              {externalGiftListDescription ||
                'Para quem preferir me presentear com algo especial, deixo aqui algumas sugestões com muito carinho:'}
            </p>

            {/* Sugestões Especiais de Presentes Solicitadas */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
              {/* Sugestão 1: Jóias de prata (Vivara ou Pandora) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#B9B5C4]/40 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E7DDEB] flex items-center justify-center text-[#5D5068] shrink-0 mt-0.5">
                    <Gem className="w-5 h-5 text-[#82758D]" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#4A3B56]">
                      Jóias de prata
                    </h4>
                    <p className="text-xs sm:text-sm text-[#82758D] mt-1 font-medium">
                      Sugestão: <span className="font-semibold text-[#5D5068]">Vivara ou Pandora</span>
                    </p>
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-[#C9B4D9]/30 text-[#4A3B56]">
                      Acessórios & Mimos
                    </span>
                  </div>
                </div>
              </div>

              {/* Sugestão 2: Perfumes e cremes (Exceto, Boticário e Natura) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#B9B5C4]/40 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E7DDEB] flex items-center justify-center text-[#5D5068] shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-[#82758D]" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#4A3B56]">
                      Perfumes e cremes
                    </h4>
                    <p className="text-xs sm:text-sm text-[#82758D] mt-1 font-medium">
                      Preferência: <span className="font-semibold text-[#5D5068]">(Exceto, Boticário e Natura)</span>
                    </p>
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-[#E7DDEB] text-[#5D5068]">
                      Perfumaria & Cuidados
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Custom Items from Admin if any */}
            {giftItems.length > 2 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                {giftItems.slice(2).map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-white/80 border border-[#B9B5C4]/30 shadow-2xs">
                    <h5 className="font-semibold text-xs text-[#5D5068]">{item.title}</h5>
                    <p className="text-[11px] text-[#82758D] mt-0.5">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* External Store Link Button (if registered) */}
            {hasExternalList && (
              <div className="mt-6 pt-4 border-t border-[#B9B5C4]/30">
                <a
                  href={externalGiftListUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#3D2E47] text-sm font-semibold tracking-wide shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-[#3D2E47]" />
                  <span>{externalGiftListButtonText || 'Acessar Lista de Presentes'}</span>
                  <ExternalLink className="w-4 h-4 text-[#3D2E47]" />
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
