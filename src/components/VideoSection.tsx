import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { SoftHeart } from './Ornaments';
import { mediaDb } from '../services/mediaDb';

interface VideoSectionProps {
  videoUrl: string;
  onOpenAdmin: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videoUrl, onOpenAdmin }) => {
  const [resolvedVideoSrc, setResolvedVideoSrc] = useState<string>('');
  const [allSourcesFailed, setAllSourcesFailed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setAllSourcesFailed(false);

    if (!videoUrl || videoUrl.trim() === '') {
      setResolvedVideoSrc('');
      return;
    }

    const trimmed = videoUrl.trim();

    if (trimmed.startsWith('idb:')) {
      mediaDb.getMediaUrl(trimmed).then((blobUrl) => {
        if (isMounted) {
          setResolvedVideoSrc(blobUrl || '');
        }
      });
    } else if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('data:')
    ) {
      setResolvedVideoSrc(trimmed);
    } else {
      // Local file reference like Convite-videomp4.mp4 or videos/Convite-videomp4.mp4
      const cleanPath = trimmed.replace(/^\.?\//, '').replace(/^public\//, '');
      const baseUrl = (import.meta.env.BASE_URL || './').replace(/\/$/, '');
      const resolved = baseUrl === '' || baseUrl === '.' ? `./${cleanPath}` : `${baseUrl}/${cleanPath}`;
      setResolvedVideoSrc(resolved);
    }

    return () => {
      isMounted = false;
    };
  }, [videoUrl]);

  const isYouTube =
    resolvedVideoSrc &&
    (resolvedVideoSrc.includes('youtube.com') || resolvedVideoSrc.includes('youtu.be'));
  const isVimeo = resolvedVideoSrc && resolvedVideoSrc.includes('vimeo.com');

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

  const hasVideo = Boolean(resolvedVideoSrc && resolvedVideoSrc.trim() !== '');

  // Generate robust candidate paths so whichever filename was pushed to GitHub public/ is played
  const baseUrl = (import.meta.env.BASE_URL || './').replace(/\/$/, '');
  const prefix = baseUrl === '' || baseUrl === '.' ? '.' : baseUrl;

  const candidateSources = React.useMemo(() => {
    if (!resolvedVideoSrc || isYouTube || isVimeo || resolvedVideoSrc.startsWith('blob:') || resolvedVideoSrc.startsWith('data:')) {
      return resolvedVideoSrc ? [resolvedVideoSrc] : [];
    }

    const list = [
      resolvedVideoSrc,
      `${prefix}/Convite-videomp4.mp4`,
      `${prefix}/Convite-video.mp4`,
      `${prefix}/videos/Convite-videomp4.mp4`,
      `${prefix}/videos/Convite-video.mp4`,
      `${prefix}/convite-video.mp4`,
      `${prefix}/videos/convite-video.mp4`,
      `${prefix}/Convite.mp4`,
      `${prefix}/videos/Convite.mp4`,
      './Convite-videomp4.mp4',
      './Convite-video.mp4',
      './videos/Convite-videomp4.mp4',
      './videos/Convite-video.mp4',
      '/Convite-videomp4.mp4',
      '/Convite-video.mp4',
      '/videos/Convite-videomp4.mp4',
      '/videos/Convite-video.mp4',
    ];

    return list.filter((v, i, a) => v && a.indexOf(v) === i);
  }, [resolvedVideoSrc, prefix, isYouTube, isVimeo]);

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
        {hasVideo ? (
          <div className="relative rounded-2xl overflow-hidden silver-border bg-black aspect-video shadow-md">
            {isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl(resolvedVideoSrc)}
                title="Vídeo-convite Mariana"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isVimeo ? (
              <iframe
                src={getVimeoEmbedUrl(resolvedVideoSrc)}
                title="Vídeo-convite Mariana"
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : allSourcesFailed ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#2B2333] text-white">
                <Film className="w-8 h-8 text-[#C9B4D9] mb-2" />
                <p className="font-serif-luxury text-base font-semibold text-[#E7DDEB]">
                  Vídeo-Convite
                </p>
                <p className="text-xs text-[#B9B5C4] mt-1 max-w-sm">
                  O arquivo de vídeo está configurado. Se desejar alterá-lo ou fazer upload direto de um novo vídeo, use o botão abaixo.
                </p>
                <button
                  onClick={onOpenAdmin}
                  className="mt-3 px-4 py-2 rounded-full bg-[#C9B4D9] text-[#3D2E47] text-xs font-semibold hover:bg-[#ded1e4] cursor-pointer shadow-md"
                >
                  Gerenciar Vídeo no Painel
                </button>
              </div>
            ) : (
              <video
                key={resolvedVideoSrc}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              >
                {candidateSources.map((srcUrl, idx) => (
                  <source
                    key={srcUrl}
                    src={srcUrl}
                    type="video/mp4"
                    onError={() => {
                      if (idx === candidateSources.length - 1) {
                        setAllSourcesFailed(true);
                      }
                    }}
                  />
                ))}
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
              className="mt-4 text-[11px] text-[#A49AAA] hover:text-[#5D5068] underline underline-offset-2 cursor-pointer"
            >
              Configurar vídeo no painel
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
