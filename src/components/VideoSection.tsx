import React, { useState, useEffect, useRef } from 'react';
import { Film, Play } from 'lucide-react';
import { SoftHeart } from './Ornaments';
import { mediaDb } from '../services/mediaDb';
import defaultConviteVideo from '../assets/videos/Convite-videomp4.mp4';
import defaultThumbnail from '../assets/images/video_thumbnail_v1.jpg';

interface VideoSectionProps {
  videoUrl: string;
  onOpenAdmin: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videoUrl, onOpenAdmin }) => {
  const [resolvedVideoSrc, setResolvedVideoSrc] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    setHasError(false);

    if (!videoUrl || videoUrl.trim() === '' || videoUrl === 'Convite-videomp4.mp4' || videoUrl.includes('Convite-video')) {
      // Use the bundled video asset as the primary standard source
      setResolvedVideoSrc(defaultConviteVideo);
      return;
    }

    const trimmed = videoUrl.trim();

    if (trimmed.startsWith('idb:')) {
      mediaDb.getMediaUrl(trimmed).then((blobUrl) => {
        if (isMounted) {
          setResolvedVideoSrc(blobUrl || defaultConviteVideo);
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

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Playback initiation error:', e);
      });
    }
  };

  const activeSrc = resolvedVideoSrc || defaultConviteVideo;

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
        <div className="relative rounded-2xl overflow-hidden silver-border bg-black aspect-video shadow-lg group">
          {isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(activeSrc)}
              title="Vídeo-convite Mariana"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isVimeo ? (
            <iframe
              src={getVimeoEmbedUrl(activeSrc)}
              title="Vídeo-convite Mariana"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : hasError ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#2B2333] text-white">
              <Film className="w-8 h-8 text-[#C9B4D9] mb-2" />
              <p className="font-serif-luxury text-base font-semibold text-[#E7DDEB]">
                Nosso Convite em Vídeo
              </p>
              <p className="text-xs text-[#B9B5C4] mt-1 max-w-sm">
                O arquivo de vídeo Convite-videomp4.mp4 está disponível para visualização.
              </p>
              <button
                onClick={() => setHasError(false)}
                className="mt-3 px-4 py-2 rounded-full bg-[#C9B4D9] text-[#3D2E47] text-xs font-semibold hover:bg-[#ded1e4] cursor-pointer shadow-md"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                key={activeSrc}
                controls
                playsInline
                preload="metadata"
                poster={defaultThumbnail}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                  console.warn('Video failed to load from primary source, trying fallbacks...');
                }}
              >
                <source src={activeSrc} type="video/mp4" />
                <source src="./videos/Convite-videomp4.mp4" type="video/mp4" />
                <source src="./Convite-videomp4.mp4" type="video/mp4" />
                <source src="/videos/Convite-videomp4.mp4" type="video/mp4" />
                <source src="/Convite-videomp4.mp4" type="video/mp4" />
                Seu navegador não suporta a reprodução deste vídeo.
              </video>

              {/* Big Play Button Overlay before video starts */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={handleManualPlay}
                  aria-label="Assistir ao vídeo convite"
                  className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border-2 border-white/80 transition-all duration-300 transform hover:scale-110 shadow-2xl cursor-pointer z-10"
                >
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 text-[#E7DDEB] ml-1 fill-current" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Subtitle / note below video */}
        <p className="text-center text-xs text-[#A49AAA] mt-2.5 font-light">
          Assista ao convite em vídeo especial de 15 anos da Mariana.
        </p>
      </div>
    </section>
  );
};
