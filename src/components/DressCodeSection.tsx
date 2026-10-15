import React, { useState } from 'react';
import { Sparkles, Download, Maximize2, X, Check, Printer, AlertCircle, Shirt, Sparkle, Heart, Palette } from 'lucide-react';
import { CornerFlourish, DebutanteCrown, SoftHeart, SilverDivider } from './Ornaments';
import { resolveImageUrl } from '../assets/imagesMap';

interface DressCodeSectionProps {
  debutanteName?: string;
  imageUrl?: string;
}

export const DressCodeSection: React.FC<DressCodeSectionProps> = ({
  debutanteName = 'Mariana',
  imageUrl,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Resolved URL of the dress code guide card
  const guideSrc = resolveImageUrl(imageUrl || 'images/guia-traje-sugerido.jpg', 'dressCodeGuide');

  // Direct download of the guide card image
  const handleDownloadImage = () => {
    try {
      const link = document.createElement('a');
      link.href = guideSrc;
      link.download = 'Guia de Traje Sugerido XV Mari.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      handlePrint();
    }
  };

  // Printable poster fallback
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Guia de Traje Sugerido - XV Mari</title>
          <style>
            body { margin: 0; padding: 20px; font-family: serif; display: flex; justify-content: center; background: #FAF7F8; }
            .container { max-width: 520px; width: 100%; text-align: center; }
            img { width: 100%; height: auto; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${guideSrc}" alt="Guia de Traje Sugerido - XV Mari" />
            <div style="margin-top: 16px; padding: 14px; border: 1.5px solid #E8C5D8; border-radius: 12px; background: #FAF2F6; color: #542B3F; font-size: 14px; font-family: sans-serif;">
              <strong>Atenção ao Dress Code:</strong> Evitar usar cores: <strong>Prata, Lilás e Rosé</strong> (cores exclusivas da debutante).
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <section
      id="traje-sugerido"
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-12"
      aria-label="Traje Sugerido para a festa de 15 anos"
    >
      {/* Header Intro */}
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
          <Sparkles className="w-4 h-4 text-[#C9B4D9]" />
          <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
            Dress Code Exclusivo
          </span>
          <Sparkles className="w-4 h-4 text-[#C9B4D9]" />
        </div>

        <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl text-[#5D5068]">
          Traje Sugerido
        </h2>

        <p className="font-serif-luxury italic text-base sm:text-lg text-[#82758D] mt-2 leading-relaxed">
          Guia visual e inspirações para celebrar essa data tão inesquecível
        </p>

        <div className="w-24 h-0.5 mx-auto mt-4 bg-gradient-to-r from-transparent via-[#C9B4D9] to-transparent" />
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Card Frame with fine ornamental frame */}
        <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#FAF7F8] via-white to-[#F6F2F7] p-3 sm:p-5 shadow-xl border-2 border-[#C9B4D9]/60 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Corner flourish ornaments */}
          <CornerFlourish position="top-left" className="w-10 h-10 text-[#C9B4D9] opacity-80" />
          <CornerFlourish position="top-right" className="w-10 h-10 text-[#C9B4D9] opacity-80" />
          <CornerFlourish position="bottom-left" className="w-10 h-10 text-[#C9B4D9] opacity-80" />
          <CornerFlourish position="bottom-right" className="w-10 h-10 text-[#C9B4D9] opacity-80" />

          {/* Inner subtle border line */}
          <div className="absolute inset-2 sm:inset-2.5 rounded-2xl border border-[#D8C7E5]/50 pointer-events-none" />

          {/* Guide Poster Image */}
          <div
            className="relative z-10 cursor-pointer group overflow-hidden rounded-2xl"
            onClick={() => setIsZoomOpen(true)}
            title="Clique para ampliar o Guia de Traje"
          >
            <img
              src={guideSrc}
              alt="Guia de Traje Sugerido - XV Mari Mariana"
              className="w-full h-auto rounded-2xl object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-[#5D5068] text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Maximize2 className="w-3.5 h-3.5 text-[#5D5068]" />
                Clique para ampliar
              </span>
            </div>
          </div>
        </div>

        {/* Card Action Buttons: Fullscreen & Download */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
          <button
            onClick={() => setIsZoomOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F8] border border-[#C9B4D9] text-xs font-semibold text-[#5D5068] shadow-2xs transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#5D5068]" />
            <span>Ver em Tela Cheia</span>
          </button>

          <button
            onClick={handleDownloadImage}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#3D2E47] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-800" />
                <span className="text-emerald-900 font-bold">Guia Baixado!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#3D2E47]" />
                <span>Salvar Imagem do Guia</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F8] border border-[#C9B4D9] text-xs font-semibold text-[#5D5068] shadow-2xs transition-colors cursor-pointer"
            title="Imprimir Guia de Traje"
          >
            <Printer className="w-3.5 h-3.5 text-[#5D5068]" />
            <span>Imprimir</span>
          </button>
        </div>

        {/* Style & Details Highlights Cards */}
        <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Para Elas */}
          <div className="p-4 rounded-2xl bg-white/90 border border-[#E7DDEB] shadow-2xs">
            <div className="flex items-center gap-2 mb-2 text-[#5D5068] font-semibold text-xs tracking-wider uppercase">
              <Sparkle className="w-3.5 h-3.5 text-[#C9B4D9]" />
              <span>Para as Convidadas</span>
            </div>
            <p className="text-xs text-[#4A3B56] leading-relaxed">
              Vestidos longos elegantes ou produções sociais sofisticadas. Tons como ameixa, rosa antigo e champanhe harmonizam perfeitamente com a noite.
            </p>
          </div>

          {/* Para Eles */}
          <div className="p-4 rounded-2xl bg-white/90 border border-[#E7DDEB] shadow-2xs">
            <div className="flex items-center gap-2 mb-2 text-[#5D5068] font-semibold text-xs tracking-wider uppercase">
              <Shirt className="w-3.5 h-3.5 text-[#C9B4D9]" />
              <span>Para os Convidados</span>
            </div>
            <p className="text-xs text-[#4A3B56] leading-relaxed">
              Terno ou costume alinhado acompanhado de camisa social e sapato. Cores clássicas como azul-marinho, cinza e bege são muito bem-vindas.
            </p>
          </div>
        </div>

        {/* Color guidelines / reserved colors notice */}
        <div className="w-full mt-3 p-4 rounded-2xl bg-gradient-to-r from-[#FAF0F4] via-[#F8EEF5] to-[#FAF0F4] border-2 border-[#E5BED3] shadow-xs text-center">
          <div className="inline-flex items-center justify-center gap-1.5 text-[#863D5D] font-bold text-xs uppercase tracking-wider mb-1.5">
            <Palette className="w-4 h-4 text-[#C16D8F]" />
            <span>Cores Reservadas para a Debutante</span>
          </div>

          <p className="text-sm sm:text-base font-bold text-[#542B3F]">
            Evitar usar cores: <span className="text-[#8B2E58] bg-[#FCE8F0] px-2 py-0.5 rounded-md border border-[#F2C0D4]">Prata, Lilás e Rosé</span>
          </p>

          <p className="text-xs text-[#7D5369] mt-1.5 max-w-sm mx-auto">
            Essas tonalidades são de uso exclusivo da debutante Mariana para este dia tão inesquecível.
          </p>

          {/* Color swatch badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D5CED8] text-[11px] font-semibold text-[#4A4350] shadow-2xs">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#9CA3AF] via-[#E5E7EB] to-[#CBD5E1] border border-gray-400" />
              Prata
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D8C7E5] text-[11px] font-semibold text-[#5B3E6A] shadow-2xs">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#BCA0CE] via-[#D8C7E5] to-[#EDE4F3] border border-[#BCA0CE]" />
              Lilás
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E9C2CE] text-[11px] font-semibold text-[#733B53] shadow-2xs">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#DB899D] via-[#F2CAD4] to-[#FCEEF1] border border-[#DB899D]" />
              Rosé
            </span>
          </div>
        </div>

        {/* Gentle Notice */}
        <div className="w-full mt-3 p-3 rounded-2xl bg-[#FAF5F8] border border-[#E7DDEB] flex items-center justify-center gap-2 text-xs text-[#64748B] text-center">
          <AlertCircle className="w-4 h-4 text-[#A49AAA] shrink-0" />
          <span>Jeans, bermudas e roupas muito informais não combinam com a ocasião.</span>
        </div>

        {/* Thank You Footer */}
        <div className="text-center mt-6">
          <p className="font-cursive text-2xl sm:text-3xl text-[#5D5068]">
            Obrigada por fazer parte desse momento!
          </p>
          <div className="flex justify-center mt-2">
            <SoftHeart className="w-4 h-4 text-[#C9B4D9]" />
          </div>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-lg w-full max-h-[95vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-3 -right-3 z-10 p-2.5 rounded-full bg-white text-[#5D5068] hover:bg-[#FAF7F8] shadow-lg transition-transform hover:scale-105 cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Image */}
            <div className="overflow-auto max-h-[80vh] rounded-2xl shadow-2xl border-2 border-white/40">
              <img
                src={guideSrc}
                alt="Guia de Traje Sugerido XV Mari"
                className="w-auto h-auto max-h-[80vh] max-w-full object-contain"
              />
            </div>

            {/* In-modal notice */}
            <div className="w-full mt-2.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-pink-200 text-xs font-semibold text-center border border-white/20">
              ✨ Evitar usar cores: <strong>Prata, Lilás e Rosé</strong>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleDownloadImage}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-[#3D2E47] text-xs font-semibold shadow-md cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#3D2E47]" />
                <span>Baixar Guia</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs shadow-md cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-white" />
                <span>Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
