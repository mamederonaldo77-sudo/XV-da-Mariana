import React, { useState } from 'react';
import { CornerFlourish, SoftHeart } from './Ornaments';
import { storageService } from '../services/storageService';
import { CheckCircle2, User, Phone, Sparkles } from 'lucide-react';
import { RsvpEntry } from '../types';

interface RsvpSectionProps {
  whatsappNumber?: string;
  onOpenAdmin: () => void;
  onRsvpRecorded?: () => void;
  rsvps?: RsvpEntry[];
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  onRsvpRecorded,
}) => {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Simple auto-formatting for Brazilian phone numbers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 6) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    }
    setGuestPhone(val);
  };

  const handleConfirmPresence = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessInfo(null);

    const trimmedName = guestName.trim();
    const trimmedPhone = guestPhone.trim();

    if (!trimmedName) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }

    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (!trimmedPhone || digitsOnly.length < 8) {
      setErrorMsg('Por favor, informe um telefone válido com DDD (item obrigatório).');
      return;
    }

    // Save to page database (localStorage)
    const saved = storageService.saveRsvp({
      guestName: trimmedName,
      phone: trimmedPhone,
      guestCount: 1,
      confirmedVia: 'site',
    });

    if (saved) {
      setSuccessInfo(
        `Presença confirmada com sucesso para ${trimmedName}! Que alegria imensa ter você conosco no XV da Mari! 💜`
      );
      setGuestName('');
      setGuestPhone('');
      if (onRsvpRecorded) {
        onRsvpRecorded();
      }
    } else {
      setErrorMsg('Ocorreu um erro ao registrar sua confirmação. Por favor, tente novamente.');
    }
  };

  return (
    <section
      id="confirmar-presenca"
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-12"
      aria-label="Confirmação de presença"
    >
      <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-[#E7DDEB]/80 silver-border shadow-sm overflow-hidden text-center">
        <CornerFlourish position="top-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="top-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="bottom-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="bottom-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />

        {/* Heading */}
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
            <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
            <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
              RSVP
            </span>
            <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
          </div>

          <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl text-[#5D5068]">
            Confirme sua Presença
          </h2>

          <p className="font-serif-luxury italic text-base sm:text-lg text-[#82758D] mt-2 leading-relaxed">
            Estou preparando tudo com muito carinho. Confirme sua presença para celebrar esse momento comigo!
          </p>
        </div>

        {/* RSVP Form */}
        <form
          onSubmit={handleConfirmPresence}
          className="relative z-10 max-w-md mx-auto mt-7 space-y-4 text-left"
        >
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
              {errorMsg}
            </div>
          )}

          {successInfo && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{successInfo}</div>
            </div>
          )}

          {/* Nome do Convidado */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#82758D] mb-1.5">
              Nome do Convidado <span className="text-[#82758D] font-bold">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A49AAA]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Silva"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/95 border border-[#B9B5C4]/50 focus:border-[#C9B4D9] focus:ring-2 focus:ring-[#C9B4D9]/30 text-sm text-[#5D5068] placeholder:text-[#A49AAA]/60 outline-hidden transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Telefone (Obrigatório) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#82758D] mb-1.5">
              Telefone <span className="text-[#82758D] font-bold">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A49AAA]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={guestPhone}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/95 border border-[#B9B5C4]/50 focus:border-[#C9B4D9] focus:ring-2 focus:ring-[#C9B4D9]/30 text-sm text-[#5D5068] placeholder:text-[#A49AAA]/60 outline-hidden transition-all shadow-2xs font-sans"
              />
            </div>
            <p className="text-[11px] text-[#82758D] mt-1 pl-1">
              Informe com DDD para receber novidades e atualizações sobre a festa.
            </p>
          </div>

          {/* Botão estilizado: Confirmar Presença (seguindo a paleta lilás/lavanda/prata) */}
          <div className="pt-3 text-center">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-2.5 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#C9B4D9] via-[#d7c4e5] to-[#C9B4D9] hover:from-[#bfa5d1] hover:to-[#bfa5d1] text-[#4A3B56] text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 border border-white/60 active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#5D5068]" />
              <span>Confirmar Presença</span>
              <CheckCircle2 className="w-4 h-4 text-[#5D5068]" />
            </button>
          </div>

          <p className="text-[11px] text-[#82758D] text-center pt-1 italic font-serif-luxury">
            Sua confirmação será registrada diretamente no livro de presenças da Mariana.
          </p>
        </form>
      </div>
    </section>
  );
};
