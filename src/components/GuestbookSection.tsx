import React, { useState } from 'react';
import { GuestMessage } from '../types';
import { storageService } from '../services/storageService';
import { CornerFlourish, SoftHeart } from './Ornaments';
import { MessageSquareHeart, Send, CheckCircle2, AlertCircle, Heart, User, Mail } from 'lucide-react';

interface GuestbookSectionProps {
  messages: GuestMessage[];
  onMessageAdded: (newMsg: GuestMessage) => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  messages,
  onMessageAdded,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);
    setSuccessStatus(null);

    // Validation
    if (!name.trim()) {
      setErrorStatus('Por favor, informe seu nome.');
      return;
    }
    if (!message.trim()) {
      setErrorStatus('Por favor, escreva sua mensagem de carinho.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Real save via storageService
      const saved = storageService.saveMessage({
        name: name.trim(),
        email: email.trim() || undefined,
        message: message.trim(),
      });

      if (saved) {
        onMessageAdded(saved);
        setName('');
        setEmail('');
        setMessage('');
        setSuccessStatus('Seu recado foi enviado com sucesso e guardado com muito carinho!');
      } else {
        setErrorStatus('Não foi possível salvar seu recado. Por favor, verifique seu navegador.');
      }
    } catch (err) {
      setErrorStatus('Ocorreu um erro ao registrar sua mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="recados"
      className="relative max-w-4xl mx-auto px-3 sm:px-6 py-12"
      aria-label="Livro de recados da debutante"
    >
      {/* Main Card with soft lavender background and ornamental frame */}
      <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-[#E7DDEB]/60 silver-border shadow-xs overflow-hidden">
        <CornerFlourish position="top-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />
        <CornerFlourish position="top-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#C9B4D9]" />

        {/* Heading */}
        <div className="text-center relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-[#82758D] mb-1">
            <MessageSquareHeart className="w-4 h-4 text-[#C9B4D9]" />
            <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase">
              Mural de Afeto
            </span>
            <MessageSquareHeart className="w-4 h-4 text-[#C9B4D9]" />
          </div>

          <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl text-[#5D5068]">
            Envie seu recado
          </h2>

          <p className="font-serif-luxury italic text-base sm:text-lg text-[#82758D] mt-1">
            Sua mensagem vai ser muito especial para mim!
          </p>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="relative z-10 max-w-lg mx-auto mt-8 space-y-4">
          {errorStatus && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorStatus}</span>
            </div>
          )}

          {successStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successStatus}</span>
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#82758D] mb-1.5">
              Seu Nome <span className="text-[#C9B4D9]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A49AAA]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Beatriz Silva"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-[#B9B5C4]/50 focus:border-[#C9B4D9] focus:ring-2 focus:ring-[#C9B4D9]/30 text-sm text-[#5D5068] placeholder:text-[#A49AAA]/60 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* E-mail (opcional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#82758D] mb-1.5">
              Seu E-mail <span className="text-[#A49AAA] font-normal lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A49AAA]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-[#B9B5C4]/50 focus:border-[#C9B4D9] focus:ring-2 focus:ring-[#C9B4D9]/30 text-sm text-[#5D5068] placeholder:text-[#A49AAA]/60 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Mensagem */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#82758D] mb-1.5">
              Sua Mensagem <span className="text-[#C9B4D9]">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva seu recado, votos ou lembrança para Mariana..."
              required
              className="w-full p-3.5 rounded-xl bg-white/90 border border-[#B9B5C4]/50 focus:border-[#C9B4D9] focus:ring-2 focus:ring-[#C9B4D9]/30 text-sm text-[#5D5068] placeholder:text-[#A49AAA]/60 outline-hidden transition-all resize-y"
            />
          </div>

          {/* Botão Enviar recado */}
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#4A3B56] text-sm font-semibold tracking-wide border border-[#B9B5C4] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Enviando...' : 'Enviar recado'}</span>
            </button>
          </div>

          {/* Transparent storage note */}
          <p className="text-[11px] text-[#A49AAA] text-center pt-2 leading-tight">
            As mensagens enviadas ficam armazenadas com segurança no sistema do convite e podem ser lidas pela debutante e pela família.
          </p>
        </form>

        {/* Display of existing messages */}
        {messages && messages.length > 0 && (
          <div className="relative z-10 max-w-2xl mx-auto mt-10 pt-8 border-t border-[#B9B5C4]/30">
            <h3 className="font-serif-luxury text-xl font-bold text-[#5D5068] text-center mb-4 flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-[#C9B4D9] text-[#C9B4D9]" />
              <span>Recados Recebidos ({messages.length})</span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/90 rounded-2xl p-4 shadow-2xs border border-[#B9B5C4]/20"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-serif-luxury text-base font-bold text-[#5D5068]">
                      {item.name}
                    </p>
                    <span className="text-[11px] text-[#A49AAA]">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#82758D] leading-relaxed whitespace-pre-wrap">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
