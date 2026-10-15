import React, { useState, useEffect } from 'react';
import { SiteConfig, GuestMessage, RsvpEntry, CarouselImage, GalleryPhoto, GiftItem } from '../types';
import { storageService, DEFAULT_CONFIG } from '../services/storageService';
import { resolveImageUrl } from '../assets/imagesMap';
import { mediaDb } from '../services/mediaDb';
import { optimizeImageFile } from '../utils/imageOptimizer';
import {
  X, Lock, KeyRound, Save, CheckCircle, Trash2, Plus, Edit2, Upload,
  Download, RefreshCw, Eye, MessageSquare, Users, Gift, Image as ImageIcon,
  Film, MapPin, Calendar, Phone, Sparkles, ExternalLink, HelpCircle,
  ArrowUp, ArrowDown, QrCode, Play, Loader2
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onConfigUpdated: (newConfig: SiteConfig) => void;
  messages: GuestMessage[];
  onMessagesUpdated: (newMessages: GuestMessage[]) => void;
  rsvps: RsvpEntry[];
  onRsvpsUpdated: (newRsvps: RsvpEntry[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
  messages,
  onMessagesUpdated,
  rsvps,
  onRsvpsUpdated,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'geral' | 'textos' | 'carrossel' | 'galeria' | 'presentes' | 'recados' | 'rsvps' | 'backup'
  >('geral');

  // Working copy of configuration
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Video upload and preview states
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] = useState<string>('');
  const [previewVideoBlobUrl, setPreviewVideoBlobUrl] = useState<string>('');

  // Image processing state
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Synchronize formData with incoming config whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData(config);
    }
  }, [isOpen, config]);

  // Synchronize video preview blob URL when videoUrl changes
  useEffect(() => {
    let active = true;
    if (formData.videoUrl?.startsWith('idb:')) {
      mediaDb.getMediaUrl(formData.videoUrl).then((url) => {
        if (active) setPreviewVideoBlobUrl(url || '');
      });
    } else {
      setPreviewVideoBlobUrl(formData.videoUrl || '');
    }
    return () => {
      active = false;
    };
  }, [formData.videoUrl]);

  // Auto-save any form modifications after 1.2s of inactivity (prevent text loss)
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      storageService.saveConfig(formData);
      onConfigUpdated(formData);
    }, 1200);
    return () => clearTimeout(timer);
  }, [formData, isAuthenticated]);

  // New item modal/states
  const [newCarouselUrl, setNewCarouselUrl] = useState('');
  const [newCarouselTitle, setNewCarouselTitle] = useState('');
  const [newCarouselCaption, setNewCarouselCaption] = useState('');

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('Ensaio');

  const [newGiftTitle, setNewGiftTitle] = useState('');
  const [newGiftCategory, setNewGiftCategory] = useState('Mimo');
  const [newGiftDesc, setNewGiftDesc] = useState('');
  const [newGiftStoreUrl, setNewGiftStoreUrl] = useState('');
  const [newGiftPix, setNewGiftPix] = useState('');

  // Change PIN state
  const [newPin, setNewPin] = useState('');
  const [pinChangedMsg, setPinChangedMsg] = useState('');

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = storageService.getAdminPin();
    if (pinInput.trim() === storedPin || pinInput.trim() === 'mari15') {
      setIsAuthenticated(true);
      setAuthError('');
      setFormData(config);
    } else {
      setAuthError('Senha incorreta. A senha padrão inicial é "mari15".');
    }
  };

  // Save Config Changes immediately and rigidly
  const handleSaveConfig = () => {
    const success = storageService.saveConfig(formData);
    if (success) {
      onConfigUpdated(formData);
      setSaveStatus('✅ Todas as alterações foram salvas com sucesso no navegador!');
      setTimeout(() => setSaveStatus(null), 3500);
    } else {
      setSaveStatus('Aviso: alterações gravadas no cache local.');
    }
  };

  // Helper for Local Image Upload (automatically compresses to web-ready JPEG)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (optimizedUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const optimizedUrl = await optimizeImageFile(file, 1400, 1400, 0.82);
      callback(optimizedUrl);
      setSaveStatus('Foto processada e pronta para ser salva.');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (err) {
      console.error('Erro ao otimizar imagem:', err);
      alert('Não foi possível processar a imagem. Tente outro arquivo de imagem.');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  // Direct Video File Upload Handler
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
      alert('O arquivo selecionado possui mais de 200MB. Selecione um vídeo de até 200MB ou utilize link do YouTube.');
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadStatus('Carregando e salvando vídeo no navegador... aguarde');

    try {
      const idbKey = await mediaDb.saveMedia('invitation_video_' + Date.now(), file);
      const updated = {
        ...formData,
        videoUrl: idbKey,
      };
      setFormData(updated);
      storageService.saveConfig(updated);
      onConfigUpdated(updated);
      setSaveStatus('✅ Vídeo do convite gravado e salvo com sucesso!');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err) {
      console.error('Erro ao salvar vídeo:', err);
      alert('Erro ao gravar o arquivo de vídeo. Tente novamente.');
    } finally {
      setIsUploadingVideo(false);
      setVideoUploadStatus('');
      e.target.value = '';
    }
  };

  const handleRemoveVideo = async () => {
    if (formData.videoUrl?.startsWith('idb:')) {
      await mediaDb.deleteMedia(formData.videoUrl);
    }
    const updated = {
      ...formData,
      videoUrl: '',
    };
    setFormData(updated);
    storageService.saveConfig(updated);
    onConfigUpdated(updated);
    setPreviewVideoBlobUrl('');
    setSaveStatus('Vídeo do convite removido.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Carousel handlers (immediate permanent save)
  const handleAddCarouselImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarouselUrl.trim()) return;

    const newImg: CarouselImage = {
      id: 'car_' + Date.now(),
      url: newCarouselUrl.trim(),
      title: newCarouselTitle.trim() || undefined,
      caption: newCarouselCaption.trim() || undefined,
      alt: newCarouselTitle.trim() || 'Foto de Mariana',
    };

    const updated = {
      ...formData,
      carouselImages: [...formData.carouselImages, newImg],
    };
    setFormData(updated);
    storageService.saveConfig(updated);
    onConfigUpdated(updated);

    setNewCarouselUrl('');
    setNewCarouselTitle('');
    setNewCarouselCaption('');
    setSaveStatus('✅ Foto adicionada ao carrossel e salva com sucesso!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleRemoveCarouselImage = (id: string) => {
    const updated = {
      ...formData,
      carouselImages: formData.carouselImages.filter((img) => img.id !== id),
    };
    setFormData(updated);
    storageService.saveConfig(updated);
    onConfigUpdated(updated);
    setSaveStatus('Foto removida do carrossel.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleMoveCarouselImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.carouselImages.length) return;
    const newItems = [...formData.carouselImages];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    const updated = { ...formData, carouselImages: newItems };
    setFormData(updated);
    storageService.saveConfig(updated);
    onConfigUpdated(updated);
  };

  // Gallery handlers (immediate permanent save)
  const handleAddGalleryPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;

    const newPhoto: GalleryPhoto = {
      id: 'gal_' + Date.now(),
      url: newGalleryUrl.trim(),
      title: newGalleryTitle.trim() || 'Mariana',
      category: newGalleryCategory.trim() || 'Ensaio',
      alt: newGalleryTitle.trim() || 'Foto da Galeria',
    };

    const updated = {
      ...formData,
      galleryPhotos: [...formData.galleryPhotos, newPhoto],
    };
    setFormData(updated);
    storageService.saveConfig(updated);
    onConfigUpdated(updated);

    setNewGalleryUrl('');
    setNewGalleryTitle('');
    setSaveStatus('✅ Foto adicionada à galeria e salva com sucesso!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleRemoveGalleryPhoto = (id: string) => {
    const updated = {
      ...formData,
      galleryPhotos: formData.galleryPhotos.filter((p) => p.id !== id),
    };
    setFormData(updated);
    storageService.saveConfig(updated);
    onConfigUpdated(updated);
    setSaveStatus('Foto removida da galeria.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleMoveGalleryPhoto = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.galleryPhotos.length) return;
    const newItems = [...formData.galleryPhotos];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    const updated = { ...formData, galleryPhotos: newItems };
    setFormData(updated);
    storageService.saveConfig(updated);
    onConfigUpdated(updated);
  };

  // Gifts handlers
  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftTitle.trim()) return;

    const newGift: GiftItem = {
      id: 'gift_' + Date.now(),
      title: newGiftTitle.trim(),
      category: newGiftCategory.trim() || 'Presente',
      description: newGiftDesc.trim(),
      storeUrl: newGiftStoreUrl.trim() || undefined,
      pixKey: newGiftPix.trim() || undefined,
    };

    const updated = {
      ...formData,
      giftItems: [...formData.giftItems, newGift],
    };
    setFormData(updated);
    storageService.saveConfig(updated);
    onConfigUpdated(updated);

    setNewGiftTitle('');
    setNewGiftDesc('');
    setNewGiftStoreUrl('');
    setNewGiftPix('');
  };

  const handleRemoveGift = (id: string) => {
    const updated = {
      ...formData,
      giftItems: formData.giftItems.filter((g) => g.id !== id),
    };
    setFormData(updated);
    storageService.saveConfig(updated);
    onConfigUpdated(updated);
  };

  // Messages handlers
  const handleDeleteMessage = (id: string) => {
    if (!confirm('Deseja realmente remover esta mensagem do mural?')) return;
    storageService.deleteMessage(id);
    const updated = messages.filter((m) => m.id !== id);
    onMessagesUpdated(updated);
  };

  // RSVP handlers
  const handleDeleteRsvp = (id: string) => {
    if (!confirm('Deseja realmente excluir esta confirmação?')) return;
    storageService.deleteRsvp(id);
    const updated = rsvps.filter((r) => r.id !== id);
    onRsvpsUpdated(updated);
  };

  // Export CSV of RSVPs
  const handleExportRsvpCsv = () => {
    storageService.exportCsvRsvps();
  };

  // Change Admin PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setPinChangedMsg('A senha deve conter ao menos 4 dígitos.');
      return;
    }
    storageService.setAdminPin(newPin.trim());
    setPinChangedMsg('Senha atualizada com sucesso!');
    setNewPin('');
    setTimeout(() => setPinChangedMsg(''), 3000);
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (confirm('Atenção: deseja restaurar todos os dados e textos originais da celebração?')) {
      const reset = storageService.resetConfig();
      setFormData(reset);
      onConfigUpdated(reset);
      setSaveStatus('Configurações restauradas com sucesso!');
    }
  };

  // Close with immediate persistence
  const handleClose = () => {
    if (isAuthenticated) {
      storageService.saveConfig(formData);
      onConfigUpdated(formData);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#B9B5C4]/40 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#C9B4D9] via-[#d6c4e4] to-[#C9B4D9] text-[#4A3B56] flex items-center justify-between border-b border-[#B9B5C4]/40 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <div>
              <h2 className="font-serif-luxury font-bold text-lg leading-tight">
                Painel da Debutante & Família
              </h2>
              <p className="text-xs text-[#5D5068]">
                Gerencie todos os detalhes do XV da Mari
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fechar painel"
            className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/80 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-full bg-[#E7DDEB] flex items-center justify-center text-[#82758D] mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-[#82758D]" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#5D5068]">
              Acesso Protegido
            </h3>
            <p className="text-xs sm:text-sm text-[#82758D] mt-1 mb-6">
              Digite a senha de acesso para gerenciar o convite.
              <br />
              <span className="text-[11px] text-[#A49AAA]">
                (Senha padrão inicial: <strong className="text-[#5D5068]">mari15</strong>)
              </span>
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {authError}
                </p>
              )}
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Senha de acesso"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-[#B9B5C4] text-center text-base tracking-widest text-[#5D5068] focus:border-[#C9B4D9] focus:ring-2 focus:ring-[#C9B4D9]/30 outline-hidden"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#4A3B56] font-semibold text-sm transition-colors shadow-xs"
              >
                Entrar no Painel
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto px-4 py-2.5 bg-[#FAF7F8] border-b border-[#B9B5C4]/30 shrink-0 text-xs font-medium text-[#82758D]">
              <button
                onClick={() => setActiveTab('geral')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'geral' ? 'bg-[#C9B4D9] text-[#4A3B56] font-semibold' : 'hover:bg-[#E7DDEB]/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Geral & Local</span>
              </button>
              <button
                onClick={() => setActiveTab('textos')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'textos' ? 'bg-[#C9B4D9] text-[#4A3B56] font-semibold' : 'hover:bg-[#E7DDEB]/50'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Textos & Vídeo</span>
              </button>
              <button
                onClick={() => setActiveTab('carrossel')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'carrossel' ? 'bg-[#C9B4D9] text-[#4A3B56] font-semibold' : 'hover:bg-[#E7DDEB]/50'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Carrossel ({formData.carouselImages.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('galeria')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'galeria' ? 'bg-[#C9B4D9] text-[#4A3B56] font-semibold' : 'hover:bg-[#E7DDEB]/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Galeria ({formData.galleryPhotos.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('presentes')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'presentes' ? 'bg-[#C9B4D9] text-[#4A3B56] font-semibold' : 'hover:bg-[#E7DDEB]/50'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Presentes ({formData.giftItems.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('recados')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'recados' ? 'bg-[#C9B4D9] text-[#4A3B56] font-semibold' : 'hover:bg-[#E7DDEB]/50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Recados ({messages.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('rsvps')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'rsvps' ? 'bg-[#C9B4D9] text-[#4A3B56] font-semibold' : 'hover:bg-[#E7DDEB]/50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Presenças ({rsvps.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'backup' ? 'bg-[#C9B4D9] text-[#4A3B56] font-semibold' : 'hover:bg-[#E7DDEB]/50'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Segurança</span>
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#5D5068]">
              {saveStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{saveStatus}</span>
                </div>
              )}

              {/* TAB 1: Geral & Local */}
              {activeTab === 'geral' && (
                <div className="space-y-5">
                  <h3 className="font-serif-luxury text-xl font-bold border-b pb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#C9B4D9]" />
                    <span>Dados Principais do Evento & Localização</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#82758D] mb-1">
                        Nome da Debutante
                      </label>
                      <input
                        type="text"
                        value={formData.debutanteName}
                        onChange={(e) => setFormData({ ...formData, debutanteName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#82758D] mb-1">
                        Título do Convite
                      </label>
                      <input
                        type="text"
                        value={formData.pageTitle}
                        onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#82758D] mb-1">
                        Data Exibida
                      </label>
                      <input
                        type="text"
                        value={formData.displayDate}
                        onChange={(e) => setFormData({ ...formData, displayDate: e.target.value })}
                        placeholder="13 de novembro de 2026"
                        className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#82758D] mb-1">
                        Horário Exibido
                      </label>
                      <input
                        type="text"
                        value={formData.displayTime}
                        onChange={(e) => setFormData({ ...formData, displayTime: e.target.value })}
                        placeholder="Às 20 horas"
                        className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Configuração do WhatsApp */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F8] border border-[#B9B5C4]/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#25D366]" />
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5D5068]">
                        WhatsApp da Família para Confirmação de Presença
                      </label>
                    </div>
                    <p className="text-xs text-[#82758D]">
                      Informe o número com DDD (somente dígitos, ex: <strong>11999998888</strong>). Se omitir o código do país, o prefixo 55 (Brasil) será aplicado automaticamente.
                    </p>
                    <input
                      type="text"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      placeholder="Ex: 11987654321"
                      className="w-full max-w-sm px-3.5 py-2 rounded-xl border border-[#B9B5C4] text-sm focus:border-[#C9B4D9] outline-hidden bg-white"
                    />
                  </div>

                  {/* Local da Festa */}
                  <div className="p-4 rounded-2xl bg-[#E7DDEB]/40 border border-[#B9B5C4]/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C9B4D9]" />
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5D5068]">
                        Local da Recepção & Festa
                      </label>
                    </div>
                    <p className="text-xs text-[#82758D]">
                      Os campos abaixo permitem que a família configure o local exato assim que estiver contratado.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Nome do Espaço / Salão
                        </label>
                        <input
                          type="text"
                          value={formData.venueName}
                          onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                          placeholder="Ex: Espaço Villa Real"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Cidade / Bairro
                        </label>
                        <input
                          type="text"
                          value={formData.venueCity}
                          onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                          placeholder="Ex: São Paulo - SP"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Endereço Completo
                        </label>
                        <input
                          type="text"
                          value={formData.venueAddress}
                          onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                          placeholder="Ex: Av. das Rosas, 1500 - Jardim Primavera"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Link do Google Maps
                        </label>
                        <input
                          type="url"
                          value={formData.venueMapsUrl}
                          onChange={(e) => setFormData({ ...formData, venueMapsUrl: e.target.value })}
                          placeholder="https://maps.google.com/?q=..."
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveConfig}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#4A3B56] font-semibold text-sm transition-colors shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações Gerais</span>
                  </button>
                </div>
              )}

              {/* TAB 2: Textos & Vídeo */}
              {activeTab === 'textos' && (
                <div className="space-y-5">
                  <h3 className="font-serif-luxury text-xl font-bold border-b pb-2 flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-[#C9B4D9]" />
                    <span>Seção "Sobre Mim" & Vídeo-Convite</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#82758D] mb-1">
                      Título da Seção Sobre Mim
                    </label>
                    <input
                      type="text"
                      value={formData.aboutTitle}
                      onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#82758D] mb-1">
                      Texto da Mariana (parágrafos separados por linha)
                    </label>
                    <textarea
                      rows={5}
                      value={formData.aboutText}
                      onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#82758D] mb-1">
                      Foto da Mariana (Seção Sobre Mim)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={formData.aboutImageUrl}
                        onChange={(e) => setFormData({ ...formData, aboutImageUrl: e.target.value })}
                        placeholder="URL da imagem ou faça upload"
                        className="flex-1 px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden"
                      />
                      <label className="px-3.5 py-2 rounded-xl bg-[#E7DDEB] hover:bg-[#ded1e4] text-[#5D5068] text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (base64) =>
                              setFormData({ ...formData, aboutImageUrl: base64 })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  {/* Nossa Promessa */}
                  <div className="p-4 rounded-2xl bg-[#E7DDEB]/40 border border-[#B9B5C4]/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9B4D9]" />
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5D5068]">
                        Seção "Nossa Promessa"
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                        Título da Promessa
                      </label>
                      <input
                        type="text"
                        value={formData.promiseTitle}
                        onChange={(e) => setFormData({ ...formData, promiseTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                        Texto da Promessa (parágrafos separados por linha)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.promiseText}
                        onChange={(e) => setFormData({ ...formData, promiseText: e.target.value })}
                        className="w-full p-3 rounded-xl border border-[#B9B5C4]/60 text-sm focus:border-[#C9B4D9] outline-hidden leading-relaxed bg-white"
                      />
                    </div>
                  </div>

                  {/* Vídeo Convite com Upload Direto */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F8] border border-[#B9B5C4]/50 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-[#C9B4D9]" />
                        <label className="text-xs font-bold uppercase tracking-wider text-[#5D5068]">
                          Vídeo do Convite
                        </label>
                      </div>
                      {formData.videoUrl && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                          Vídeo Cadastrado
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#82758D] leading-relaxed">
                      Faça o <strong>upload direto do arquivo de vídeo</strong> do seu dispositivo ou, se preferir, informe um link do YouTube ou Vimeo.
                    </p>

                    {/* Opção 1: Upload Direto */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#B9B5C4]/40 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#5D5068] flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#C9B4D9]" />
                          Upload Direto de Vídeo (.mp4, .webm, .mov)
                        </span>
                        {isUploadingVideo && (
                          <span className="text-xs text-[#82758D] flex items-center gap-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9B4D9]" />
                            {videoUploadStatus || 'Enviando...'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <label className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                          isUploadingVideo
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#4A3B56]'
                        }`}>
                          <Upload className="w-4 h-4" />
                          <span>{formData.videoUrl ? 'Substituir Arquivo de Vídeo' : 'Selecionar Arquivo de Vídeo'}</span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/ogg,video/*"
                            disabled={isUploadingVideo}
                            className="hidden"
                            onChange={handleVideoFileUpload}
                          />
                        </label>

                        {formData.videoUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveVideo}
                            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors flex items-center gap-1 border border-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remover Vídeo</span>
                          </button>
                        )}
                      </div>

                      {/* Video Preview if present */}
                      {previewVideoBlobUrl && (
                        <div className="mt-3 pt-3 border-t border-[#B9B5C4]/30">
                          <p className="text-[11px] font-semibold text-[#82758D] mb-1.5 flex items-center gap-1">
                            <Play className="w-3 h-3 text-[#C9B4D9]" />
                            Pré-visualização do Vídeo Cadastrado:
                          </p>
                          <div className="relative rounded-xl overflow-hidden bg-black max-w-md aspect-video shadow-xs">
                            {previewVideoBlobUrl.includes('youtube.com') || previewVideoBlobUrl.includes('youtu.be') ? (
                              <div className="w-full h-full flex items-center justify-center text-white/80 text-xs p-4 text-center">
                                Link do YouTube configurado: {previewVideoBlobUrl}
                              </div>
                            ) : (
                              <video
                                src={previewVideoBlobUrl}
                                controls
                                playsInline
                                className="w-full h-full object-contain"
                              >
                                Seu navegador não suporta este formato de vídeo.
                              </video>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Opção 2: Link de Vídeo Externo */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                        Ou insira link de vídeo externo (YouTube, Vimeo ou link MP4):
                      </label>
                      <input
                        type="url"
                        value={formData.videoUrl?.startsWith('idb:') ? '' : (formData.videoUrl || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, videoUrl: val });
                          storageService.saveConfig({ ...formData, videoUrl: val });
                          onConfigUpdated({ ...formData, videoUrl: val });
                        }}
                        placeholder="https://www.youtube.com/watch?v=... ou deixe vazio se fez upload"
                        className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4] text-sm focus:border-[#C9B4D9] outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveConfig}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#4A3B56] font-semibold text-sm transition-colors shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Textos</span>
                  </button>
                </div>
              )}

              {/* TAB 3: Carrossel */}
              {activeTab === 'carrossel' && (
                <div className="space-y-6">
                  <h3 className="font-serif-luxury text-xl font-bold border-b pb-2 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#C9B4D9]" />
                    <span>Fotos do Carrossel de Destaque</span>
                  </h3>

                  {/* Add form */}
                  <form onSubmit={handleAddCarouselImage} className="p-4 rounded-2xl bg-[#FAF7F8] border border-[#B9B5C4]/40 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#82758D]">
                      Adicionar Nova Foto ao Carrossel
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={newCarouselUrl}
                          onChange={(e) => setNewCarouselUrl(e.target.value)}
                          placeholder="URL da Imagem (ou use o botão ao lado)"
                          className="flex-1 px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                        <label className="px-3.5 py-2 rounded-xl bg-[#E7DDEB] hover:bg-[#ded1e4] text-[#5D5068] text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Local</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (base64) => setNewCarouselUrl(base64))
                            }
                          />
                        </label>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={newCarouselTitle}
                          onChange={(e) => setNewCarouselTitle(e.target.value)}
                          placeholder="Título (opcional)"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={newCarouselCaption}
                          onChange={(e) => setNewCarouselCaption(e.target.value)}
                          placeholder="Legenda da foto (opcional)"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!newCarouselUrl.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#4A3B56] text-xs font-semibold disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Inserir no Carrossel</span>
                    </button>
                  </form>

                  {/* Existing Carousel Images */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#82758D]">
                      Fotos Atuais ({formData.carouselImages.length}):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {formData.carouselImages.map((img, idx) => (
                        <div
                          key={img.id}
                          className="relative rounded-xl overflow-hidden border border-[#B9B5C4]/40 bg-white shadow-2xs group"
                        >
                          <img
                            src={resolveImageUrl(img.url, idx === 1 ? 'garden' : idx === 2 ? 'waltz' : 'portrait')}
                            alt={img.alt || 'Foto do carrossel'}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-2 text-xs">
                            <p className="font-semibold truncate">{img.title || 'Sem título'}</p>
                            <p className="text-[#A49AAA] truncate">{img.caption || 'Sem legenda'}</p>
                          </div>
                          
                          {/* Reorder and Delete controls */}
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                onClick={() => handleMoveCarouselImage(idx, 'up')}
                                className="w-6 h-6 rounded-full bg-white/95 hover:bg-white text-[#5D5068] flex items-center justify-center transition-colors shadow-xs"
                                title="Mover para cima / esquerda"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {idx < formData.carouselImages.length - 1 && (
                              <button
                                onClick={() => handleMoveCarouselImage(idx, 'down')}
                                className="w-6 h-6 rounded-full bg-white/95 hover:bg-white text-[#5D5068] flex items-center justify-center transition-colors shadow-xs"
                                title="Mover para baixo / direita"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => handleRemoveCarouselImage(img.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center transition-colors shadow-xs"
                            title="Remover foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {formData.carouselImages.length > 0 && (
                      <div className="pt-3">
                        <button
                          type="button"
                          onClick={handleSaveConfig}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#4A3B56] font-semibold text-sm transition-colors shadow-xs cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar Fotos do Carrossel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Galeria */}
              {activeTab === 'galeria' && (
                <div className="space-y-6">
                  <h3 className="font-serif-luxury text-xl font-bold border-b pb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C9B4D9]" />
                    <span>Fotos da Seção "Nossa Galeria"</span>
                  </h3>

                  {/* Add form */}
                  <form onSubmit={handleAddGalleryPhoto} className="p-4 rounded-2xl bg-[#FAF7F8] border border-[#B9B5C4]/40 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#82758D]">
                      Adicionar Nova Foto à Galeria
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-3 flex items-center gap-2">
                        <input
                          type="text"
                          value={newGalleryUrl}
                          onChange={(e) => setNewGalleryUrl(e.target.value)}
                          placeholder="URL da Imagem"
                          className="flex-1 px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                        <label className="px-3.5 py-2 rounded-xl bg-[#E7DDEB] hover:bg-[#ded1e4] text-[#5D5068] text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Local</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (base64) => setNewGalleryUrl(base64))
                            }
                          />
                        </label>
                      </div>

                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={newGalleryTitle}
                          onChange={(e) => setNewGalleryTitle(e.target.value)}
                          placeholder="Título da foto (ex: Ensaio no Jardim)"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                      </div>

                      <div>
                        <select
                          value={newGalleryCategory}
                          onChange={(e) => setNewGalleryCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        >
                          <option value="Ensaio">Ensaio</option>
                          <option value="Retrato">Retrato</option>
                          <option value="Celebração">Celebração</option>
                          <option value="Detalhes">Detalhes</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!newGalleryUrl.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#4A3B56] text-xs font-semibold disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar à Galeria</span>
                    </button>
                  </form>

                  {/* Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.galleryPhotos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="relative rounded-xl overflow-hidden border border-[#B9B5C4]/40 bg-white group shadow-2xs"
                      >
                        <img
                          src={resolveImageUrl(photo.url)}
                          alt={photo.alt || 'Foto da galeria'}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="p-2 text-xs">
                          <p className="font-semibold truncate">{photo.title}</p>
                          <p className="text-[10px] text-[#A49AAA] uppercase tracking-wider">
                            {photo.category}
                          </p>
                        </div>

                        {/* Reorder controls */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              onClick={() => handleMoveGalleryPhoto(idx, 'up')}
                              className="w-6 h-6 rounded-full bg-white/95 hover:bg-white text-[#5D5068] flex items-center justify-center transition-colors shadow-xs"
                              title="Mover para cima / anterior"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < formData.galleryPhotos.length - 1 && (
                            <button
                              onClick={() => handleMoveGalleryPhoto(idx, 'down')}
                              className="w-6 h-6 rounded-full bg-white/95 hover:bg-white text-[#5D5068] flex items-center justify-center transition-colors shadow-xs"
                              title="Mover para baixo / próxima"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemoveGalleryPhoto(photo.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center transition-colors shadow-xs"
                          title="Remover foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Presentes */}
              {activeTab === 'presentes' && (
                <div className="space-y-6">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-2">
                      <Gift className="w-5 h-5 text-[#C9B4D9]" />
                      <span>Configurações da Página de Presentes</span>
                    </h3>
                    <button
                      onClick={handleSaveConfig}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#3D2E47] text-xs font-semibold shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar Presentes</span>
                    </button>
                  </div>

                  {/* 1. Opção Contribuição via Pix */}
                  <div className="p-4 rounded-2xl bg-[#E7DDEB]/40 border border-[#B9B5C4]/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#5D5068]" />
                      <label className="text-xs font-bold uppercase tracking-wider text-[#4A3B56]">
                        1. Opção: Contribuição via Pix (Voluntária)
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Título do Bloco Pix
                        </label>
                        <input
                          type="text"
                          value={formData.pixTitle}
                          onChange={(e) => setFormData({ ...formData, pixTitle: e.target.value })}
                          placeholder="Ex: Contribuição dos Sonhos (Pix)"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Chave Pix da Família
                        </label>
                        <input
                          type="text"
                          value={formData.pixKey}
                          onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                          placeholder="CPF, e-mail, telefone ou chave aleatória"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Mensagem Carinhosa (Opcional)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.pixMessage}
                          onChange={(e) => setFormData({ ...formData, pixMessage: e.target.value })}
                          placeholder="Mensagem delicada sem pressionar os convidados..."
                          className="w-full p-2.5 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden leading-relaxed"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Imagem do QR Code Pix (opcional - se vazio, um QR code é gerado automaticamente com a chave)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.pixQrCodeUrl || ''}
                            onChange={(e) => setFormData({ ...formData, pixQrCodeUrl: e.target.value })}
                            placeholder="URL da imagem ou faça upload"
                            className="flex-1 px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                          />
                          <label className="px-3 py-2 rounded-xl bg-[#E7DDEB] hover:bg-[#ded1e4] text-[#5D5068] text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload QR Code</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, (base64) =>
                                  setFormData({ ...formData, pixQrCodeUrl: base64 })
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Opção Minha Lista de Presentes */}
                  <div className="p-4 rounded-2xl bg-white border border-[#B9B5C4]/40 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#5D5068]" />
                      <label className="text-xs font-bold uppercase tracking-wider text-[#4A3B56]">
                        2. Opção: Minha Lista de Presentes (Loja Externa)
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Título do Bloco da Lista
                        </label>
                        <input
                          type="text"
                          value={formData.externalGiftListTitle}
                          onChange={(e) =>
                            setFormData({ ...formData, externalGiftListTitle: e.target.value })
                          }
                          placeholder="Minha Lista de Presentes"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Texto do Botão
                        </label>
                        <input
                          type="text"
                          value={formData.externalGiftListButtonText}
                          onChange={(e) =>
                            setFormData({ ...formData, externalGiftListButtonText: e.target.value })
                          }
                          placeholder="Acessar Lista de Presentes"
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Descrição
                        </label>
                        <input
                          type="text"
                          value={formData.externalGiftListDescription}
                          onChange={(e) =>
                            setFormData({ ...formData, externalGiftListDescription: e.target.value })
                          }
                          placeholder="Para quem preferir escolher um presente especial..."
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#82758D] mb-1">
                          Link Externo da Lista (URL completa)
                        </label>
                        <input
                          type="url"
                          value={formData.externalGiftListUrl}
                          onChange={(e) =>
                            setFormData({ ...formData, externalGiftListUrl: e.target.value })
                          }
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* List */}
                  <div className="space-y-2">
                    {formData.giftItems.length === 0 ? (
                      <p className="text-xs text-[#A49AAA] italic">
                        Nenhum presente cadastrado no momento. Cadastre acima para exibir na seção de presentes.
                      </p>
                    ) : (
                      formData.giftItems.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#B9B5C4]/30"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{g.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7DDEB] text-[#5D5068]">
                                {g.category}
                              </span>
                            </div>
                            <p className="text-xs text-[#82758D] mt-0.5">{g.description}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveGift(g.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir presente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: Recados */}
              {activeTab === 'recados' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#C9B4D9]" />
                      <span>Recados dos Convidados ({messages.length})</span>
                    </h3>
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#A49AAA]">
                      Nenhum recado recebido ainda. Quando os convidados enviarem pelo site, aparecerão aqui.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 rounded-xl bg-white border border-[#B9B5C4]/30 shadow-2xs flex items-start justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#5D5068]">{m.name}</span>
                              {m.email && (
                                <span className="text-xs text-[#A49AAA]">({m.email})</span>
                              )}
                              <span className="text-[10px] text-[#A49AAA]">
                                • {new Date(m.createdAt).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#82758D] mt-1 whitespace-pre-wrap">
                              {m.message}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                            title="Remover recado"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: Confirmações de Presença (RSVP) */}
              {activeTab === 'rsvps' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2 flex-wrap gap-2">
                    <div>
                      <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#C9B4D9]" />
                        <span>Confirmações de Presença ({rsvps.length})</span>
                      </h3>
                      <p className="text-xs text-[#82758D]">
                        Total de convidados confirmados:{' '}
                        <strong>
                          {rsvps.length} pessoas
                        </strong>
                      </p>
                    </div>

                    <button
                      onClick={handleExportRsvpCsv}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F8] border border-[#B9B5C4] text-xs font-semibold text-[#5D5068] shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>

                  {rsvps.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#A49AAA]">
                      Nenhuma confirmação registrada ainda. As confirmações feitas pelo formulário ficam arquivadas aqui e podem ser baixadas a qualquer momento.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#B9B5C4]/30 text-[#82758D]">
                            <th className="py-2 px-3">Convidado</th>
                            <th className="py-2 px-3">Telefone</th>
                            <th className="py-2 px-3">Data</th>
                            <th className="py-2 px-3 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#B9B5C4]/20">
                          {rsvps.map((r) => (
                            <tr key={r.id} className="hover:bg-white/60">
                              <td className="py-2 px-3 font-semibold text-[#5D5068]">
                                {r.guestName}
                              </td>
                              <td className="py-2 px-3 text-[#82758D] font-mono">{r.phone || '—'}</td>
                              <td className="py-2 px-3 text-[#A49AAA]">
                                {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="py-2 px-3 text-right">
                                <button
                                  onClick={() => handleDeleteRsvp(r.id)}
                                  className="text-rose-600 hover:text-rose-800 p-1"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: Segurança & Backup */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <h3 className="font-serif-luxury text-xl font-bold border-b pb-2 flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#C9B4D9]" />
                    <span>Segurança da Senha e Backup dos Dados</span>
                  </h3>

                  {/* Alterar Senha */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F8] border border-[#B9B5C4]/40 max-w-md">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#82758D] mb-2">
                      Alterar Senha de Acesso do Painel
                    </p>
                    {pinChangedMsg && (
                      <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg mb-2">
                        {pinChangedMsg}
                      </p>
                    )}
                    <form onSubmit={handleChangePin} className="space-y-3">
                      <input
                        type="password"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="Nova senha (mínimo 4 caracteres)"
                        className="w-full px-3 py-2 rounded-xl border border-[#B9B5C4]/60 text-sm bg-white outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#C9B4D9] hover:bg-[#bfa5d1] text-[#4A3B56] text-xs font-semibold"
                      >
                        Salvar Nova Senha
                      </button>
                    </form>
                  </div>

                  {/* Backup JSON */}
                  <div className="p-4 rounded-2xl bg-white border border-[#B9B5C4]/40 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#82758D]">
                      Backup & Exportação Completa
                    </p>
                    <p className="text-xs text-[#82758D]">
                      Faça o download do arquivo JSON com todas as configurações, mensagens recebidas e presenças para guardar como recordação ou transferir.
                    </p>
                    <button
                      onClick={() => {
                        const jsonStr = storageService.exportAllData();
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `backup_xv_mari_${new Date().toISOString().slice(0, 10)}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E7DDEB] hover:bg-[#ded1e4] text-[#5D5068] text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar Arquivo de Backup (JSON)</span>
                    </button>
                  </div>

                  {/* Restaurar Padrão */}
                  <div className="pt-4 border-t border-rose-100">
                    <button
                      onClick={handleResetToDefault}
                      className="text-xs text-rose-600 hover:text-rose-800 underline underline-offset-2 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restaurar dados de demonstração originais</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
