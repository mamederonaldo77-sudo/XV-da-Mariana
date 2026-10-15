import React from 'react';
import { CornerFlourish, DebutanteCrown, SoftHeart } from './Ornaments';
import { Lock } from 'lucide-react';
import { PageRoute } from '../types';

interface FooterProps {
  debutanteName: string;
  onOpenAdmin: () => void;
  onNavigate?: (page: PageRoute) => void;
  activePage?: PageRoute;
}

export const Footer: React.FC<FooterProps> = ({
  debutanteName,
  onOpenAdmin,
  onNavigate,
  activePage,
}) => {
  const navLinks: { id: PageRoute; label: string }[] = [
    { id: 'inicio', label: 'Início' },
    { id: 'meus-15-anos', label: 'Meus 15 Anos' },
    { id: 'nossa-promessa', label: 'Nossa Promessa' },
    { id: 'presentes', label: 'Presentes' },
    { id: 'recados', label: 'Recados' },
    { id: 'fotos', label: 'Fotos' },
    { id: 'confirmar-presenca', label: 'Confirmar Presença' },
  ];

  return (
    <footer className="relative w-full pt-10 pb-8 px-4 bg-[#F8F5F6] border-t border-[#B9B5C4]/30 overflow-hidden text-center mt-auto">
      {/* Corner Flourishes */}
      <CornerFlourish position="bottom-left" className="w-14 h-14 sm:w-20 sm:h-20 text-[#C9B4D9]" />
      <CornerFlourish position="bottom-right" className="w-14 h-14 sm:w-20 sm:h-20 text-[#C9B4D9]" />

      <div className="relative z-10 max-w-xl mx-auto space-y-4">
        {/* Crown & Heart */}
        <div className="flex justify-center items-center gap-2">
          <DebutanteCrown className="w-6 h-6 text-[#B9B5C4]" />
        </div>

        {/* Phrase 1: "Com muito amor, Mariana" */}
        <p className="font-cursive text-3xl sm:text-4xl text-[#5D5068]">
          Com muito amor, {debutanteName}
        </p>

        {/* Silver ornamental line */}
        <div className="w-36 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#C9B4D9] to-transparent" />

        {/* Phrase 2: "Meus 15 anos — 13.11.2026" */}
        <p className="font-serif-luxury tracking-widest uppercase text-xs sm:text-sm text-[#82758D] font-medium">
          Meus 15 anos — 13.11.2026
        </p>

        {/* Quick Page Links at bottom */}
        {onNavigate && (
          <div className="pt-2 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-[#82758D]">
            {navLinks.map((link, idx) => (
              <React.Fragment key={link.id}>
                <button
                  onClick={() => onNavigate(link.id)}
                  className={`hover:text-[#4A3B56] transition-colors cursor-pointer ${
                    activePage === link.id
                      ? 'text-[#4A3B56] font-semibold underline underline-offset-4'
                      : 'text-[#A49AAA]'
                  }`}
                >
                  {link.label}
                </button>
                {idx < navLinks.length - 1 && (
                  <span className="text-[#B9B5C4]/60" aria-hidden="true">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <p className="text-xs text-[#A49AAA] max-w-sm mx-auto pt-1">
          Sua presença tornará esse dia ainda mais brilhante e memorável.
        </p>

        {/* Discreet Host Admin Access */}
        <div className="pt-4">
          <button
            onClick={onOpenAdmin}
            aria-label="Acesso ao Painel da Anfitriã"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#A49AAA] hover:text-[#5D5068] transition-colors py-1 px-3 rounded-full hover:bg-white/60 border border-transparent hover:border-[#B9B5C4]/30 cursor-pointer"
          >
            <Lock className="w-3 h-3 text-[#C9B4D9]" />
            <span>Área da Debutante / Painel Administrativo</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
