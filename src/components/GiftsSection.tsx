import React, { useState } from 'react';
import { GiftItem } from '../types';
import { Gift, QrCode, ExternalLink, Copy, Check, Sparkles, Heart, HelpCircle } from 'lucide-react';
import { SoftHeart, CornerFlourish, SilverDivider } from './Ornaments';

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

  const handleCopyPix = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const hasPix = Boolean(pixKey && pixKey.trim().length > 0);
  const hasExternalList = Boolean(externalGiftListUrl && externalGiftListUrl.trim().length > 0);

  // Generate dynamic QR Code for PIX key if no custom image was uploaded
  const qrCodeSrc = pixQrCodeUrl && pixQrCodeUrl.trim().length > 0
    ? pixQrCodeUrl
    : hasPix
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(pixKey)}`
    : '';

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
        
        {/* BLOCK 1: Contribuição Voluntária via Pix */}
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
            {hasPix ? (
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-white/95 border border-[#B9B5C4]/40 max-w-md mx-auto shadow-2xs">
                {/* QR Code if available */}
                {qrCodeSrc && (
                  <div className="flex flex-col items-center mb-4">
                    <div className="p-2.5 rounded-xl bg-white border border-[#B9B5C4]/30 shadow-2xs">
                      <img
                        src={qrCodeSrc}
                        alt="QR Code Pix"
                        referrerPolicy="no-referrer"
                        className="w-36 h-36 object-contain"
                      />
                    </div>
                    <span className="text-[11px] text-[#A49AAA] mt-2">
                      Aponte a câmera do seu banco para o QR Code
                    </span>
                  </div>
                )}

                {/* Pix Key Display & Copy Button */}
                <div className="text-left">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#82758D] mb-1">
                    Chave Pix
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F8] border border-[#B9B5C4]/40">
                    <span className="text-xs sm:text-sm font-mono text-[#5D5068] truncate flex-1 select-all">
                      {pixKey}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyPix(pixKey)}
                    className="mt-3 w-full py-2.5 px-4 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#3D2E47] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    {copiedKey === pixKey ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span className="text-emerald-800 font-bold">Chave Pix Copiada com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#3D2E47]" />
                        <span>Copiar Chave Pix</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Clean Placeholder when PIX is not set yet */
              <div className="mt-6 p-6 rounded-2xl bg-white/80 border border-[#B9B5C4]/40 max-w-md mx-auto text-center shadow-2xs">
                <p className="text-xs text-[#82758D] leading-relaxed">
                  A chave Pix para contribuição voluntária pode ser configurada pela família no painel administrativo.
                </p>
                <button
                  onClick={onOpenAdmin}
                  className="mt-3 text-xs text-[#82758D] hover:text-[#4A3B56] underline underline-offset-4 cursor-pointer"
                >
                  Cadastrar Chave Pix no Painel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BLOCK 2: Opção "Minha Lista de Presentes" */}
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
                'Para quem preferir escolher um presente especial, preparei uma lista em uma loja parceira com muito carinho.'}
            </p>

            {/* Button / External Link */}
            {hasExternalList ? (
              <div className="mt-6">
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
                <p className="text-[11px] text-[#A49AAA] mt-2">
                  Você será direcionado para o site da loja parceira.
                </p>
              </div>
            ) : (
              /* Clean Placeholder when link is not set yet */
              <div className="mt-6 p-6 rounded-2xl bg-white/80 border border-[#B9B5C4]/40 max-w-md mx-auto text-center shadow-2xs">
                <p className="text-xs text-[#82758D] leading-relaxed">
                  O link da lista externa de presentes pode ser cadastrado pela família diretamente no painel administrativo.
                </p>
                <button
                  onClick={onOpenAdmin}
                  className="mt-3 text-xs text-[#82758D] hover:text-[#4A3B56] underline underline-offset-4 cursor-pointer"
                >
                  Cadastrar Link da Lista no Painel
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
