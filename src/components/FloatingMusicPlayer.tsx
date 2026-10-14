import React from 'react';
import { Volume2, VolumeX, Share2, Mail, Sparkles } from 'lucide-react';

interface FloatingMusicPlayerProps {
  isPlaying: boolean;
  onToggleMusic: () => void;
  debutanteName: string;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  isPlaying,
  onToggleMusic,
  debutanteName,
}) => {
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Você está convidado para a festa de 15 Anos de ${debutanteName}! ✨ Acesse o convite digital: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <aside aria-label="Controles flutuantes do convite" className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-none">
      {/* Share Button */}
      <button
        onClick={handleShareWhatsApp}
        aria-label="Compartilhar convite pelo WhatsApp"
        title="Compartilhar convite pelo WhatsApp"
        className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 hover:bg-[#25D366] text-[#82758D] hover:text-white shadow-md border border-[#B9B5C4]/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {/* Main Music Button */}
      <button
        onClick={onToggleMusic}
        aria-label={isPlaying ? 'Pausar música ambiente' : 'Tocar música ambiente'}
        title={isPlaying ? 'Pausar música ambiente' : 'Tocar música ambiente'}
        className={`pointer-events-auto flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full shadow-lg border transition-all duration-300 hover:scale-105 ${
          isPlaying
            ? 'bg-[#C9B4D9] text-[#4A3B56] border-[#B9B5C4]'
            : 'bg-white/95 text-[#82758D] border-[#B9B5C4]/40 hover:bg-[#FAF7F8]'
        }`}
      >
        {isPlaying ? (
          <>
            <div className="relative w-4 h-4 flex items-center justify-center">
              <span className="absolute w-full h-full rounded-full bg-white/60 animate-ping opacity-75" />
              <Volume2 className="w-4 h-4 text-[#4A3B56]" />
            </div>
            <span className="text-xs font-semibold tracking-wide">Música Ativa</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-[#A49AAA]" />
            <span className="text-xs font-medium">Tocar Música</span>
          </>
        )}
      </button>
    </aside>
  );
};
