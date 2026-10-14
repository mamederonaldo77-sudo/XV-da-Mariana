import React from 'react';
import { Film, PlayCircle } from 'lucide-react';
import { SoftHeart } from './Ornaments';

interface VideoSectionProps {
  videoUrl: string;
  onOpenAdmin: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videoUrl, onOpenAdmin }) => {
  const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const isVimeo = videoUrl && videoUrl.includes('vimeo.com');

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
  };

  return (
    <section
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-8"
      aria-label="Vídeo-convite de 15 anos"
    >
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
          <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
          <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
            Momento Especial
          </span>
          <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
        </div>
        <h2 className="font-cursive text-3xl sm:text-4xl md:text-5xl text-[#5D5068]">
          Nosso Convite em Vídeo
        </h2>
      </div>

      <div className="max-w-2xl mx-auto">
        {videoUrl && videoUrl.trim() !== '' ? (
          <div className="relative rounded-2xl overflow-hidden silver-border bg-black aspect-video shadow-md">
            {isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl(videoUrl)}
                title="Vídeo-convite Mariana Resende"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isVimeo ? (
              <iframe
                src={getVimeoEmbedUrl(videoUrl)}
                title="Vídeo-convite Mariana Resende"
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl}
                controls
                playsInline
                className="w-full h-full object-contain"
              >
                Seu navegador não suporta a reprodução deste vídeo.
              </video>
            )}
          </div>
        ) : (
          /* When no video is registered: discreet area with required message */
          <div className="p-8 sm:p-10 rounded-2xl bg-white/60 silver-border text-center shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#E7DDEB]/70 flex items-center justify-center text-[#82758D] mx-auto mb-3">
              <Film className="w-6 h-6 text-[#82758D]" />
            </div>
            <p className="font-serif-luxury italic text-base sm:text-lg text-[#82758D]">
              Nosso convite em vídeo estará disponível em breve
            </p>
            <p className="text-xs text-[#A49AAA] mt-1 max-w-sm mx-auto">
              Estamos preparando uma mensagem em vídeo repleta de carinho e emoção para você.
            </p>
            <button
              onClick={onOpenAdmin}
              className="mt-4 text-[11px] text-[#A49AAA] hover:text-[#5D5068] underline underline-offset-2"
            >
              Adicionar link de vídeo no painel
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
