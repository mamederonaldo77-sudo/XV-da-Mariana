import React from 'react';
import { CornerFlourish, DebutanteCrown, SoftHeart } from './Ornaments';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';

interface HeaderProps {
  debutanteName: string;
  pageTitle: string;
  heroSubheading: string;
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenAdmin: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  debutanteName,
  pageTitle,
  heroSubheading,
  activePage,
  onNavigate,
  onOpenAdmin,
  isPlayingMusic,
  onToggleMusic,
}) => {
  const navItems: { id: PageRoute; label: string; isPrimary?: boolean }[] = [
    { id: 'inicio', label: 'Início' },
    { id: 'meus-15-anos', label: 'Meus 15 Anos' },
    { id: 'nossa-promessa', label: 'Nossa Promessa' },
    { id: 'presentes', label: 'Presentes' },
    { id: 'recados', label: 'Recados' },
    { id: 'fotos', label: 'Fotos' },
    { id: 'confirmar-presenca', label: 'Confirmar Presença', isPrimary: true },
  ];

  const handleClick = (e: React.MouseEvent, page: PageRoute) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <header className="relative w-full pt-6 pb-4 px-3 sm:px-6 bg-gradient-to-b from-[#F8F5F6] via-[#FAF7F8] to-[#F8F5F6] border-b border-[#B9B5C4]/20 shadow-xs">
      {/* Corner Floral Ornaments */}
      <CornerFlourish position="top-left" className="w-14 h-14 sm:w-20 sm:h-20 text-[#C9B4D9]" />
      <CornerFlourish position="top-right" className="w-14 h-14 sm:w-20 sm:h-20 text-[#C9B4D9]" />

      {/* Top utility bar (music & subtle admin access) */}
      <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-[#A49AAA] mb-3 px-2">
        <button
          onClick={onToggleMusic}
          aria-label={isPlayingMusic ? 'Pausar música' : 'Ouvir música ambiente'}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7DDEB]/50 hover:bg-[#E7DDEB] text-[#82758D] text-xs font-medium transition-colors border border-[#B9B5C4]/30"
          title="Música ambiente para celebração"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#C9B4D9] animate-pulse" />
              <span>Música Ligada</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#A49AAA]" />
              <span>Ouvir Música</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenAdmin}
          className="text-xs text-[#A49AAA] hover:text-[#82758D] transition-colors underline-offset-4 hover:underline flex items-center gap-1"
          title="Acesso da Anfitriã para gerenciar o convite"
        >
          <Sparkles className="w-3 h-3 text-[#C9B4D9]" />
          <span>Painel</span>
        </button>
      </div>

      {/* Center Branding & Title */}
      <div className="relative text-center max-w-xl mx-auto py-2">
        {/* Crown Icon */}
        <div className="flex justify-center mb-1">
          <DebutanteCrown className="w-7 h-7 text-[#B9B5C4] drop-shadow-xs" />
        </div>

        {/* Cursive Subtitle "Meus 15 Anos" */}
        <div className="flex items-center justify-center gap-2 text-[#82758D]">
          <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]/80" />
          <p className="font-cursive text-2xl sm:text-3xl text-[#82758D] tracking-wide">
            {heroSubheading}
          </p>
          <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]/80" />
        </div>

        {/* Main Name "XV da Mari" and Full Name */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-semibold tracking-wide text-[#5D5068] mt-1">
          {pageTitle}
        </h1>
        <p className="text-sm sm:text-base font-serif-luxury tracking-widest uppercase text-[#A49AAA] mt-0.5">
          {debutanteName}
        </p>

        {/* Small subtle silver hairline divider */}
        <div className="w-24 h-0.5 mx-auto mt-2 bg-gradient-to-r from-transparent via-[#C9B4D9] to-transparent" />
      </div>

      {/* Navigation Menu */}
      <nav
        aria-label="Menu principal de navegação do convite"
        className="max-w-4xl mx-auto mt-4 px-2"
      >
        {/* Mobile: 2 to 3 columns grid; Desktop: centered flex wrap */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-center items-center gap-2 sm:gap-2.5">
          {navItems.map((item, idx) => {
            const isActive = activePage === item.id;
            const isLast = idx === navItems.length - 1;

            return (
              <a
                key={item.id}
                href={`#/${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`
                  relative text-center text-xs sm:text-sm font-medium py-2 px-3.5 rounded-full transition-all duration-300 border whitespace-nowrap
                  ${isLast ? 'col-span-2 sm:col-span-1 md:col-span-auto' : ''}
                  ${
                    isActive
                      ? 'bg-[#C9B4D9] text-[#3D2E47] font-semibold border-[#A49AAA] shadow-sm scale-102 ring-2 ring-[#C9B4D9]/40'
                      : item.isPrimary
                      ? 'bg-[#E7DDEB] text-[#5D5068] hover:bg-[#ded1e4] border-[#B9B5C4]/50'
                      : 'bg-[#E7DDEB]/50 text-[#82758D] hover:bg-[#E7DDEB] hover:text-[#5D5068] border-[#B9B5C4]/30'
                  }
                `}
              >
                {isActive && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3D2E47] mr-1.5 align-middle" />
                )}
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
