import React, { useState } from 'react';
import { PageBackgroundConfig, NavTab } from '../../types';
import { DEFAULT_PAGE_BACKGROUNDS } from '../../data/defaultBackgrounds';
import { 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface AdminPageBackgroundsManagerProps {
  pageBackgrounds?: PageBackgroundConfig;
  onUpdateBackgrounds: (backgrounds: PageBackgroundConfig) => void;
  onShowFeedback?: (msg: string) => void;
}

const PAGE_DEFINITIONS: { id: NavTab; label: string; description: string }[] = [
  { id: 'accueil', label: "Page d'Accueil", description: "Arrière-plan doux pour la vitrine principale et les piliers d'action" },
  { id: 'actualites', label: "Actualités & Société", description: "Arrière-plan sobre pour les enquêtes, faits de société et plaidoyers" },
  { id: 'blog', label: "Blog & Chemins de Paranges", description: "Ambiance chaleureuse pour les articles cliniques et témoignages" },
  { id: 'forum', label: "Forum des Paranges", description: "Atmosphère feutrée et sécurisante pour les échanges entre parents" },
  { id: 'services', label: "Services & Accompagnement", description: "Arrière-plan rassurant pour l'écoute, les GSP et les boîtes à souvenirs" },
  { id: 'ressources', label: "Ressources & Guides", description: "Texture apaisante pour la bibliothèque de fiches pratiques et audio" },
  { id: 'jardin-virtuel', label: "Jardin Virtuel & Bougies", description: "Ciel étoilé et lumière crépusculaire en hommage aux anges" },
  { id: 'formations', label: "Formations & Maternités", description: "Ambiance médicale humaine pour les soignants et sages-femmes" },
  { id: 'qui-sommes-nous', label: "Qui sommes-nous ?", description: "Arrière-plan institutionnel valorisant la mission fondatrice" },
  { id: 'faire-un-don', label: "Faire un don solidaire", description: "Chaleur humaine et solidarité pour le formulaire de soutien" }
];

const PRESET_BACKGROUND_SUGGESTIONS = [
  {
    name: 'Jardin & Fleurs Blanches (Sérénité)',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1600&q=80'
  },
  {
    name: 'Mains & Soutien Chaleureux',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1600&q=80'
  },
  {
    name: 'Lumière d\'Espoir & Aube Douce',
    url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1600&q=80'
  },
  {
    name: 'Bougie & Étoiles Célestes',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80'
  },
  {
    name: 'Nature Ivoirienne & Verdure',
    url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1600&q=80'
  }
];

export const AdminPageBackgroundsManager: React.FC<AdminPageBackgroundsManagerProps> = ({
  pageBackgrounds,
  onUpdateBackgrounds,
  onShowFeedback
}) => {
  const [backgrounds, setBackgrounds] = useState<PageBackgroundConfig>({
    ...DEFAULT_PAGE_BACKGROUNDS,
    ...(pageBackgrounds || {})
  });

  const handleUrlChange = (tabId: NavTab, newUrl: string) => {
    setBackgrounds(prev => ({
      ...prev,
      [tabId]: newUrl
    }));
  };

  const handleApplyPreset = (tabId: NavTab, presetUrl: string) => {
    setBackgrounds(prev => ({
      ...prev,
      [tabId]: presetUrl
    }));
  };

  const handleSave = () => {
    onUpdateBackgrounds(backgrounds);
    if (onShowFeedback) {
      onShowFeedback('Arrière-plans des pages mis à jour avec succès !');
    }
  };

  const handleResetToDefaults = () => {
    setBackgrounds({ ...DEFAULT_PAGE_BACKGROUNDS });
    onUpdateBackgrounds({ ...DEFAULT_PAGE_BACKGROUNDS });
    if (onShowFeedback) {
      onShowFeedback('Arrière-plans réinitialisés aux valeurs par défaut.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Box */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900">
                Personnalisation des Arrière-Plans des Pages
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Modifiez ou remplacez l'image d'arrière-plan de chaque onglet selon vos préférences visuelles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefaults}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer tous les arrière-plans</span>
            </button>
          </div>
        </div>

        {/* Suggestion presets palette */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Banque d'images suggérées de haute qualité :</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {PRESET_BACKGROUND_SUGGESTIONS.map((preset, idx) => (
              <div 
                key={idx} 
                className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px] flex items-center gap-2 group hover:border-emerald-400 transition-colors"
              >
                <img src={preset.url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                <span className="text-stone-700 truncate font-medium">{preset.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PAGE_DEFINITIONS.map((page) => {
          const currentUrl = backgrounds[page.id] || DEFAULT_PAGE_BACKGROUNDS[page.id] || '';

          return (
            <div 
              key={page.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-stone-900 font-serif-accent text-base">
                      {page.label}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {page.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 uppercase">
                    {page.id}
                  </span>
                </div>

                {/* Live Thumbnail Preview */}
                <div className="relative h-32 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group">
                  {currentUrl ? (
                    <img 
                      src={currentUrl} 
                      alt={page.label} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                      Aucune image définie
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] text-white font-medium truncate">
                      Arrière-plan actif
                    </span>
                  </div>
                </div>

                {/* URL Input & Local File Upload */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-stone-700 block">
                      Image d'arrière-plan :
                    </label>
                    <label className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>Importer un fichier</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) {
                                handleUrlChange(page.id, result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={currentUrl.startsWith('data:image') ? 'Fichier image importé localement (prêt à être enregistré)' : currentUrl}
                    onChange={(e) => handleUrlChange(page.id, e.target.value)}
                    placeholder="https://images.unsplash.com/... ou importer ci-dessus"
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                {/* Quick Presets for this page */}
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-500 font-medium block">
                    Appliquer une suggestion rapide :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_BACKGROUND_SUGGESTIONS.slice(0, 3).map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPreset(page.id, preset.url)}
                        className="px-2 py-1 rounded-lg text-[10px] bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 transition-colors cursor-pointer"
                      >
                        {preset.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
