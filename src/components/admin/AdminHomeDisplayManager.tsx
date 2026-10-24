import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Layers, 
  Type, 
  MessageSquareQuote, 
  ShieldAlert, 
  Calendar, 
  Heart, 
  Flower2, 
  HelpCircle, 
  Mail, 
  TrendingUp, 
  BookOpen
} from 'lucide-react';
import { HomeDisplayConfig, PlatformConfig } from '../../types';
import { DEFAULT_HOME_DISPLAY_CONFIG } from '../../data/newsData';

interface AdminHomeDisplayManagerProps {
  platformConfig?: PlatformConfig;
  onUpdatePlatformConfig?: (newConfig: PlatformConfig) => void;
  onShowFeedback?: (msg: string) => void;
}

export const AdminHomeDisplayManager: React.FC<AdminHomeDisplayManagerProps> = ({
  platformConfig,
  onUpdatePlatformConfig,
  onShowFeedback
}) => {
  const currentConfig: HomeDisplayConfig = platformConfig?.homeDisplayConfig || DEFAULT_HOME_DISPLAY_CONFIG;
  const [config, setConfig] = useState<HomeDisplayConfig>(currentConfig);
  const [activeSubTab, setActiveSubTab] = useState<'sections' | 'texts' | 'president'>('sections');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const notifyToast = (msg: string) => {
    setSaveToast(msg);
    if (onShowFeedback) onShowFeedback(msg);
    setTimeout(() => setSaveToast(null), 4000);
  };

  const handleToggleSection = (key: keyof HomeDisplayConfig['sectionVisibility']) => {
    const updated: HomeDisplayConfig = {
      ...config,
      sectionVisibility: {
        ...config.sectionVisibility,
        [key]: !config.sectionVisibility[key]
      }
    };
    setConfig(updated);
    persistConfig(updated);
  };

  const handleToggleAll = (visible: boolean) => {
    const updatedVisibility = Object.keys(config.sectionVisibility).reduce((acc, curr) => {
      acc[curr as keyof HomeDisplayConfig['sectionVisibility']] = visible;
      return acc;
    }, {} as HomeDisplayConfig['sectionVisibility']);

    const updated: HomeDisplayConfig = {
      ...config,
      sectionVisibility: updatedVisibility
    };
    setConfig(updated);
    persistConfig(updated);
    notifyToast(visible ? "Toutes les sections sont désormais visibles sur l'accueil." : "Toutes les sections secondaires ont été masquées.");
  };

  const persistConfig = (updated: HomeDisplayConfig) => {
    try {
      localStorage.setItem('jde_home_display_config', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('jde_config_updated', { detail: updated }));
    } catch (e) {
      console.warn("Storage save error", e);
    }

    if (platformConfig && onUpdatePlatformConfig) {
      const newPlatformConfig: PlatformConfig = {
        ...platformConfig,
        homeDisplayConfig: updated
      };
      onUpdatePlatformConfig(newPlatformConfig);
      try {
        localStorage.setItem('jde_platform_config', JSON.stringify(newPlatformConfig));
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleSaveTextChanges = (e: React.FormEvent) => {
    e.preventDefault();
    persistConfig(config);
    notifyToast("Textes et éléments de la page d'accueil enregistrés avec succès !");
  };

  const handleResetToDefault = () => {
    setConfig(DEFAULT_HOME_DISPLAY_CONFIG);
    persistConfig(DEFAULT_HOME_DISPLAY_CONFIG);
    notifyToast("Affichage d'accueil réinitialisé avec les valeurs officielles de l'ONG.");
  };

  const sectionDefinitions: {
    key: keyof HomeDisplayConfig['sectionVisibility'];
    title: string;
    description: string;
    icon: React.ReactNode;
    tag: string;
  }[] = [
    {
      key: 'showHero',
      title: 'Bandeau Hero Principal',
      description: 'Grand titre d’accueil, sous-titre officiel, logo ONG et boutons d’action rapide.',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      tag: 'Principal'
    },
    {
      key: 'showPromoBanner',
      title: 'Carrousel de Bannières Promotionnelles & Événements',
      description: 'Bannières défilantes personnalisables pour les alertes spéciales et campagnes nationales.',
      icon: <Layers className="w-4 h-4 text-emerald-500" />,
      tag: 'Dynamique'
    },
    {
      key: 'showHelplineBar',
      title: 'Barre de Permanence Téléphonique 7j/7',
      description: 'Numéros d’urgence en direct (+225 07 59 87 21 61 / 05 75 23 93 12) et bouton d’appel.',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
      tag: 'Urgence'
    },
    {
      key: 'showRealtimeCounters',
      title: 'Compteurs d’Impact & Bilan Dynamique en Direct',
      description: 'Total familles accompagnées, kits distribués, séances GSP et appels d’urgence synchronisés.',
      icon: <TrendingUp className="w-4 h-4 text-teal-500" />,
      tag: 'Impact'
    },
    {
      key: 'showPillars',
      title: 'Les 4 Piliers Fondateurs de l’ONG',
      description: 'Groupes de Soutien GSP, Soutien Fratrie, Boîtes Souvenirs Maternité et Formations Pro.',
      icon: <LayoutTemplate className="w-4 h-4 text-emerald-600" />,
      tag: 'Essentiel'
    },
    {
      key: 'showInclusivityBanner',
      title: 'Bandeau Fondateur d’Inclusivité Universelle (Tout Âge)',
      description: 'Rappel que l’ONG accueille les parents d’enfants mort-nés comme ceux décédés à un âge avancé.',
      icon: <Heart className="w-4 h-4 text-amber-600" />,
      tag: 'Vision'
    },
    {
      key: 'showEmotionalJournalBanner',
      title: 'Bandeau Carnet Émotionnel & Météo Intérieure',
      description: 'Présentation de l’outil de bien-être privé avec courbe des émotions et suivi intime.',
      icon: <BookOpen className="w-4 h-4 text-teal-600" />,
      tag: 'Bien-Être'
    },
    {
      key: 'showUpcomingEvents',
      title: 'Calendrier Interactif & Agenda des Rencontres',
      description: 'Liste et calendrier des prochains groupes de parole, ateliers fratries et cérémonies du souvenir.',
      icon: <Calendar className="w-4 h-4 text-emerald-600" />,
      tag: 'Événements'
    },
    {
      key: 'showImpactStats',
      title: 'Chiffres Clés & Statistiques Nationales',
      description: 'Mises en valeur chiffrées des actions menées à Abidjan et en Côte d’Ivoire.',
      icon: <Sliders className="w-4 h-4 text-blue-500" />,
      tag: 'Données'
    },
    {
      key: 'showVirtualGardenTeaser',
      title: 'Aperçu du Jardin Virtuel de la Mémoire',
      description: 'Section invitant les familles à planter une fleur éternelle et allumer une bougie pour leur ange.',
      icon: <Flower2 className="w-4 h-4 text-pink-500" />,
      tag: 'Hommage'
    },
    {
      key: 'showRecentNews',
      title: 'Articles Récentes & Actualités Terrain',
      description: 'Les dernières parutions médicales, reportages en maternité et plaidoyers officiels.',
      icon: <Type className="w-4 h-4 text-indigo-500" />,
      tag: 'Presse'
    },
    {
      key: 'showTestimonials',
      title: 'Carrousel des Récits & Témoignages Paranges',
      description: 'Partages authentiques de mères, pères et fratries réconfortés par notre communauté.',
      icon: <MessageSquareQuote className="w-4 h-4 text-amber-500" />,
      tag: 'Paroles'
    },
    {
      key: 'showCommunityBanner',
      title: 'Bandeau d’Appel à l’Aide Fraternelle',
      description: 'Invitation bienveillante à ne pas rester seul(e) avec bouton de consultation prioritaire.',
      icon: <HelpCircle className="w-4 h-4 text-rose-500" />,
      tag: 'Contact'
    },
    {
      key: 'showFaq',
      title: 'Foire Aux Questions des Parents Endeuillés (FAQ)',
      description: 'Questions fréquentes avec réponses médicales, administratives et psychologiques.',
      icon: <HelpCircle className="w-4 h-4 text-emerald-600" />,
      tag: 'Ressources'
    },
    {
      key: 'showNewsletter',
      title: 'Section Lettre d’Information & Nouvelles Mensuelles',
      description: 'Formulaire d’inscription pour recevoir les dates de rencontres et avancées de l’ONG.',
      icon: <Mail className="w-4 h-4 text-stone-600" />,
      tag: 'Abonnement'
    }
  ];

  const visibleCount = Object.values(config.sectionVisibility).filter(Boolean).length;
  const totalSectionsCount = sectionDefinitions.length;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Toast Feedback */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{saveToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Contrôle Total de la Page d'Accueil</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white">
            Gestion Intégrale de l'Affichage Accueil
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            Activez, masquez et personnalisez chaque bloc de la page d'accueil en direct. Adaptez les messages clés, les titres du Hero et le mot de la présidence pour répondre aux priorités de l'ONG.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Rétablir les textes et agencements par défaut"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>Rétablir Défaut</span>
          </button>

          <button
            onClick={() => handleToggleAll(true)}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Afficher toutes les sections"
          >
            <Eye className="w-4 h-4 text-emerald-300" />
            <span>Tout Afficher ({totalSectionsCount})</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('sections')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'sections'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Visibilité des Blocs ({visibleCount}/{totalSectionsCount} actifs)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('texts')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'texts'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Titres, Slogans & Boutons Hero</span>
        </button>

        <button
          onClick={() => setActiveSubTab('president')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'president'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Mot de la Présidence / Direction</span>
        </button>
      </div>

      {/* TAB 1: VISIBILITY TOGGLE GRID */}
      {activeSubTab === 'sections' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Contrôle granulaire :</strong> Cliquez sur le commutateur de chaque section pour l'activer ou la masquer instantanément pour tous les visiteurs du site. Les modifications sont sauvegardées automatiquement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectionDefinitions.map((sec) => {
              const isVisible = config.sectionVisibility[sec.key];
              return (
                <div
                  key={sec.key}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    isVisible
                      ? 'bg-white border-stone-200/90 shadow-sm hover:shadow-md'
                      : 'bg-stone-100/70 border-dashed border-stone-300 opacity-65'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl ${isVisible ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-200 text-stone-500'}`}>
                          {sec.icon}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {sec.tag}
                        </span>
                      </div>

                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {isVisible ? 'Visible' : 'Masqué'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-stone-900 font-serif-accent">
                        {sec.title}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        {sec.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleSection(sec.key)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isVisible
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                      }`}
                    >
                      {isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Masquer ce bloc</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                          <span>Activer ce bloc</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TEXTS & SLOGANS */}
      {activeSubTab === 'texts' && (
        <form onSubmit={handleSaveTextChanges} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-serif-accent text-stone-900">
              Personnalisation des Textes & Slogans du Hero
            </h3>
            <p className="text-xs text-stone-500">
              Adaptez le message principal d’accueil, les badges d’en-tête et les libellés des boutons d’appel à l’action.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Badge d'accueil supérieur (au-dessus du logo)
              </label>
              <input
                type="text"
                value={config.heroBadge || ''}
                onChange={(e) => setConfig({ ...config, heroBadge: e.target.value })}
                placeholder="Ex: Refuge National & Écoute Fraternelle • Côte d'Ivoire"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Grand Titre d'Accueil (H1)
              </label>
              <textarea
                rows={2}
                value={config.heroTitle || ''}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                placeholder="Ex: Briser le silence. Honorer chaque petit ange. Reconstruire l'espoir."
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-serif-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Sous-titre explicatif & Vision clinique
              </label>
              <textarea
                rows={3}
                value={config.heroSubtitle || ''}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                placeholder="Ex: Premier sanctuaire spécialisé en Côte d'Ivoire dédié à TOUTES les personnes endeuillées..."
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                  Bouton d'action principal (CTA 1)
                </label>
                <input
                  type="text"
                  value={config.heroPrimaryBtnText || ''}
                  onChange={(e) => setConfig({ ...config, heroPrimaryBtnText: e.target.value })}
                  placeholder="Ex: Rejoindre un Groupe GSP"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                  Bouton d'action secondaire (CTA 2)
                </label>
                <input
                  type="text"
                  value={config.heroSecondaryBtnText || ''}
                  onChange={(e) => setConfig({ ...config, heroSecondaryBtnText: e.target.value })}
                  placeholder="Ex: Découvrir nos Piliers"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Message d'Alerte de la Ligne d'Urgence (Bandeau vert)
              </label>
              <input
                type="text"
                value={config.emergencyAlertNotice || ''}
                onChange={(e) => setConfig({ ...config, emergencyAlertNotice: e.target.value })}
                placeholder="Ex: Permanence téléphonique d'urgence active 7j/7 de 8h à 20h. Écoute gratuite..."
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les textes d'accueil</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PRESIDENT'S EDITORIAL MESSAGE */}
      {activeSubTab === 'president' && (
        <form onSubmit={handleSaveTextChanges} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-serif-accent text-stone-900">
              Mot de la Présidence / Direction de l'ONG
            </h3>
            <p className="text-xs text-stone-500">
              Rédigez l'éditorial officiel de la présidente pour accueillir les familles endeuillées et affirmer les valeurs de compassion et d'excellence de l'ONG.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Titre de l'éditorial
              </label>
              <input
                type="text"
                value={config.presidentMessageTitle || ''}
                onChange={(e) => setConfig({ ...config, presidentMessageTitle: e.target.value })}
                placeholder="Ex: Le Mot de la Direction : Une main tendue sans jugement"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-serif-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Corps du message (Texte complet)
              </label>
              <textarea
                rows={5}
                value={config.presidentMessageContent || ''}
                onChange={(e) => setConfig({ ...config, presidentMessageContent: e.target.value })}
                placeholder="Rédigez le message de bienvenue et de compassion pour les familles ivoiriennes..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Signature & Fonction de l'auteur
              </label>
              <input
                type="text"
                value={config.presidentAuthor || ''}
                onChange={(e) => setConfig({ ...config, presidentAuthor: e.target.value })}
                placeholder="Ex: Mme Élodie Peugessey — Présidente Fondatrice & Référente Parange"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="mt-6 p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-full">
              Aperçu en direct
            </span>
            <h4 className="font-bold text-base font-serif-accent text-stone-900">
              {config.presidentMessageTitle || "Titre de l'éditorial"}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 italic leading-relaxed">
              « {config.presidentMessageContent || "Message en cours de rédaction..."} »
            </p>
            <div className="text-xs font-semibold text-emerald-900 pt-1">
              — {config.presidentAuthor || "Direction de l'ONG"}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer le mot de la présidence</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
