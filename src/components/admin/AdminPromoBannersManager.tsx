import React, { useState } from 'react';
import { PromoBanner, PromoBannerConfig, NavTab } from '../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Eye, 
  Play, 
  Image as ImageIcon, 
  Video, 
  Clock, 
  Layout, 
  Save, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Info
} from 'lucide-react';

interface AdminPromoBannersManagerProps {
  config: PromoBannerConfig;
  onUpdateConfig: (config: PromoBannerConfig) => void;
  onShowFeedback?: (msg: string) => void;
}

const PRESET_EVENT_IMAGES = [
  {
    name: 'Caravane Solidaire & Mobilisation',
    url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1400&q=80'
  },
  {
    name: 'Cercle de Parole & Douceur',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1400&q=80'
  },
  {
    name: 'Hommage & Bougies du Souvenir',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=80'
  },
  {
    name: 'Maternités & Soignants Engagés',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=80'
  }
];

export const AdminPromoBannersManager: React.FC<AdminPromoBannersManagerProps> = ({
  config,
  onUpdateConfig,
  onShowFeedback
}) => {
  const [localConfig, setLocalConfig] = useState<PromoBannerConfig>({ ...config });
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Form for new/edited banner
  const [bannerForm, setBannerForm] = useState<Omit<PromoBanner, 'id'>>({
    title: '',
    subtitle: '',
    badge: 'Événement Spécial',
    mediaType: 'image',
    mediaUrl: PRESET_EVENT_IMAGES[0].url,
    ctaText: "Découvrir l'événement",
    ctaActionTab: 'services',
    ctaExternalUrl: '',
    active: true,
    order: 1,
    bgColor: 'from-stone-950/95 via-stone-900/80 to-emerald-950/70'
  });

  const handleSaveGlobalSettings = (newSettings: Partial<PromoBannerConfig>) => {
    const updated = { ...localConfig, ...newSettings };
    setLocalConfig(updated);
    onUpdateConfig(updated);
    if (onShowFeedback) onShowFeedback('Paramètres du carrousel publicitaire mis à jour avec succès !');
  };

  const handleToggleBannerActive = (bannerId: string) => {
    const updatedBanners = localConfig.banners.map(b => 
      b.id === bannerId ? { ...b, active: !b.active } : b
    );
    const updated = { ...localConfig, banners: updatedBanners };
    setLocalConfig(updated);
    onUpdateConfig(updated);
  };

  const handleDeleteBanner = (bannerId: string) => {
    const updatedBanners = localConfig.banners.filter(b => b.id !== bannerId);
    const updated = { ...localConfig, banners: updatedBanners };
    setLocalConfig(updated);
    onUpdateConfig(updated);
    if (onShowFeedback) onShowFeedback('Bannière supprimée.');
  };

  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localConfig.banners.length) return;
    
    const newBanners = [...localConfig.banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    const updated = { ...localConfig, banners: newBanners };
    setLocalConfig(updated);
    onUpdateConfig(updated);
  };

  const handleStartEdit = (banner: PromoBanner) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      mediaType: banner.mediaType,
      mediaUrl: banner.mediaUrl,
      ctaText: banner.ctaText || '',
      ctaActionTab: banner.ctaActionTab,
      ctaExternalUrl: banner.ctaExternalUrl || '',
      active: banner.active,
      order: banner.order || 1,
      bgColor: banner.bgColor || 'from-stone-950/95 via-stone-900/80 to-emerald-950/70'
    });
    setIsAddingBanner(true);
  };

  const handleSubmitBannerForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title.trim() || !bannerForm.mediaUrl.trim()) return;

    let updatedBanners: PromoBanner[];

    if (editingBannerId) {
      updatedBanners = localConfig.banners.map(b => 
        b.id === editingBannerId ? { ...b, ...bannerForm } : b
      );
      if (onShowFeedback) onShowFeedback(`Bannière « ${bannerForm.title} » modifiée avec succès !`);
    } else {
      const newBanner: PromoBanner = {
        id: `banner-${Date.now()}`,
        ...bannerForm,
        order: localConfig.banners.length + 1
      };
      updatedBanners = [...localConfig.banners, newBanner];
      if (onShowFeedback) onShowFeedback(`Nouvelle bannière publicitaire ajoutée au carrousel !`);
    }

    const updated = { ...localConfig, banners: updatedBanners };
    setLocalConfig(updated);
    onUpdateConfig(updated);

    // Reset
    setIsAddingBanner(false);
    setEditingBannerId(null);
    setBannerForm({
      title: '',
      subtitle: '',
      badge: 'Événement Spécial',
      mediaType: 'image',
      mediaUrl: PRESET_EVENT_IMAGES[0].url,
      ctaText: "Découvrir l'événement",
      ctaActionTab: 'services',
      ctaExternalUrl: '',
      active: true,
      order: 1,
      bgColor: 'from-stone-950/95 via-stone-900/80 to-emerald-950/70'
    });
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900">
                Bannières Publicitaires & Événements (Carrousel)
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Diffusez vos temps forts (conférences, caravanes santé, hommages) avec photos ou vidéos.
              </p>
            </div>
          </div>

          {/* Master Enable/Disable Toggle */}
          <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
            <span className="text-xs font-bold text-stone-700">
              Afficher le carrousel :
            </span>
            <button
              type="button"
              onClick={() => handleSaveGlobalSettings({ enabled: !localConfig.enabled })}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                localConfig.enabled
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-200 text-stone-600'
              }`}
            >
              {localConfig.enabled ? '✓ Activé' : '✕ Désactivé'}
            </button>
          </div>
        </div>

        {/* Global Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          {/* 1. Emplacement */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Emplacement sur la plateforme</span>
            </label>
            <select
              value={localConfig.displayPlacement}
              onChange={(e) => handleSaveGlobalSettings({ displayPlacement: e.target.value as any })}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="accueil">Page d'Accueil uniquement (Recommandé)</option>
              <option value="header">En-tête de toutes les pages</option>
              <option value="all">Sur toutes les pages</option>
            </select>
          </div>

          {/* 2. Durée d'affichage */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Temps d'affichage par bannière</span>
            </label>
            <select
              value={localConfig.autoplayDurationSeconds}
              onChange={(e) => handleSaveGlobalSettings({ autoplayDurationSeconds: Number(e.target.value) })}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              <option value={4}>Rapide (4 secondes)</option>
              <option value={7}>Standard (7 secondes - Recommandé)</option>
              <option value={10}>Posé (10 secondes)</option>
              <option value={15}>Long (15 secondes pour vidéo)</option>
            </select>
          </div>

          {/* 3. Bouton d'ajout */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setEditingBannerId(null);
                setIsAddingBanner(!isAddingBanner);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingBanner ? 'Fermer le formulaire' : 'Ajouter une bannière'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* FORM: Add or Edit Banner */}
      {isAddingBanner && (
        <form onSubmit={handleSubmitBannerForm} className="bg-emerald-50/50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <h3 className="font-bold text-stone-900 font-serif-accent text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <span>{editingBannerId ? 'Modifier la bannière publicitaire' : 'Créer une nouvelle bannière publicitaire'}</span>
            </h3>
            <span className="text-xs text-emerald-800 font-medium">
              Médias : Image ou Vidéo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Titre percutant de l'événement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Caravane Nationale d'Écoute Solidaire 2026"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Sous-titre explicatif ou dates
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2 semaines de consultations gratuites et de cercles de soutien en Côte d'Ivoire."
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Badge en en-tête
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Événement en cours"
                    value={bannerForm.badge || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Dégradé & Ambiance
                  </label>
                  <select
                    value={bannerForm.bgColor || 'from-stone-950/95 via-stone-900/80 to-emerald-950/70'}
                    onChange={(e) => setBannerForm({ ...bannerForm, bgColor: e.target.value })}
                    className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="from-stone-950/95 via-stone-900/80 to-emerald-950/70">Vert Émeraude & Nuit</option>
                    <option value="from-stone-950/95 via-stone-900/85 to-amber-950/70">Doré / Ambre & Chaleur</option>
                    <option value="from-stone-950/95 via-stone-900/85 to-teal-950/70">Bleu Canard & Sérénité</option>
                    <option value="from-stone-950/95 via-stone-900/85 to-rose-950/70">Rose Délicat & Douceur</option>
                  </select>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Libellé du bouton (CTA)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rejoindre l'événement"
                    value={bannerForm.ctaText}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Onglet cible
                  </label>
                  <select
                    value={bannerForm.ctaActionTab || 'services'}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaActionTab: e.target.value as NavTab })}
                    className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="accueil">Accueil</option>
                    <option value="services">Services & Groupes</option>
                    <option value="actualites">Actualités</option>
                    <option value="blog">Blog</option>
                    <option value="forum">Forum Paranges</option>
                    <option value="jardin-virtuel">Jardin Virtuel</option>
                    <option value="formations">Formations</option>
                    <option value="faire-un-don">Faire un don</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Ou Lien externe (optionnel, prioritaire si renseigné)
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/... ou https://youtube.com/..."
                  value={bannerForm.ctaExternalUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaExternalUrl: e.target.value })}
                  className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Right Column: Media (Image or Video) */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Type d'élément à afficher *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, mediaType: 'image' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all ${
                      bannerForm.mediaType === 'image'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Image / Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, mediaType: 'video' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all ${
                      bannerForm.mediaType === 'video'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Vidéo (MP4 / WebM)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  URL de l'élément (Image ou Vidéo) *
                </label>
                <input
                  type="text"
                  required
                  placeholder={bannerForm.mediaType === 'video' ? "https://.../video.mp4" : "https://images.unsplash.com/..."}
                  value={bannerForm.mediaUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, mediaUrl: e.target.value })}
                  className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Suggestions d'images prédéfinies */}
              {bannerForm.mediaType === 'image' && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-stone-600 block">
                    Images d'événements suggérées :
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_EVENT_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, mediaUrl: preset.url })}
                        className="text-left p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-400 text-[10px] text-stone-800 truncate transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <img src={preset.url} alt="" className="w-6 h-6 rounded-md object-cover shrink-0" referrerPolicy="no-referrer" />
                        <span className="truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Mini Preview */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-semibold text-stone-600 block">
                  Prévisualisation du média :
                </span>
                <div className="relative h-32 rounded-2xl overflow-hidden bg-stone-900 border border-stone-300">
                  {bannerForm.mediaType === 'video' ? (
                    <video
                      src={bannerForm.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      autoPlay
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={bannerForm.mediaUrl}
                      alt="Prévisualisation"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 p-3 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      {bannerForm.badge || 'Aperçu'}
                    </span>
                    <h5 className="text-xs font-bold truncate">{bannerForm.title || 'Votre titre ici'}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAddingBanner(false);
                setEditingBannerId(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingBannerId ? 'Mettre à jour la bannière' : 'Enregistrer cette bannière'}</span>
            </button>
          </div>
        </form>
      )}

      {/* LIST OF EXISTING BANNERS */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-stone-900 font-serif-accent flex items-center justify-between">
          <span>Bannières du carrousel ({localConfig.banners.length})</span>
          <span className="text-xs text-stone-500 font-normal">
            {localConfig.banners.filter(b => b.active).length} active(s) en diffusion
          </span>
        </h3>

        {localConfig.banners.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
            Aucune bannière configurée pour l'instant. Cliquez sur « Ajouter une bannière » pour lancer votre première promotion.
          </div>
        ) : (
          <div className="space-y-3">
            {localConfig.banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  banner.active ? 'bg-white border-stone-300 shadow-xs' : 'bg-stone-50/80 border-stone-200 opacity-60'
                }`}
              >
                {/* Media thumbnail and Title */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-200">
                    {banner.mediaType === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center text-white bg-stone-800">
                        <Video className="w-6 h-6 text-amber-400" />
                      </div>
                    ) : (
                      <img
                        src={banner.mediaUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                      {banner.mediaType === 'video' ? 'Vidéo' : 'Photo'}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950">
                        {banner.badge || 'Événement'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        banner.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {banner.active ? 'En diffusion' : 'En pause'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 truncate font-serif-accent">
                      {banner.title}
                    </h4>
                    {banner.subtitle && (
                      <p className="text-xs text-stone-500 truncate max-w-md">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Reorder Up/Down */}
                  <div className="flex items-center bg-stone-100 rounded-lg p-1">
                    <button
                      onClick={() => handleMoveBanner(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                      title="Monter"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveBanner(index, 'down')}
                      disabled={index === localConfig.banners.length - 1}
                      className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                      title="Descendre"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleBannerActive(banner.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      banner.active
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {banner.active ? 'Mettre en pause' : 'Activer'}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleStartEdit(banner)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Modifier
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Supprimer la bannière"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
