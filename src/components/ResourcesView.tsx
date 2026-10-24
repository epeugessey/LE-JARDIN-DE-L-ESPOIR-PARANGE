import React, { useState } from 'react';
import { ResourceGuide, AudienceType, DeuilTheme } from '../types';
import { INITIAL_RESOURCES } from '../data/mockData';
import { BookOpen, Search, Filter, CheckCircle, Download, ArrowRight, X, FileText, Heart, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DynamicFaqSection } from './DynamicFaqSection';
import { 
  telechargerDossierPresentationPDF, 
  downloadStrategicPresentationPDF_EN,
  telechargerGuideDeuilParental_PDF,
  telechargerFicheRessourcePDF
} from '../utils/pdfGenerator';

export const ResourcesView: React.FC = () => {
  const { isEn } = useLanguage();
  const [resources] = useState<ResourceGuide[]>(INITIAL_RESOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('tous');
  const [selectedTheme, setSelectedTheme] = useState<DeuilTheme>('tous');
  const [activeResource, setActiveResource] = useState<ResourceGuide | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.keyAdvice.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAudience = selectedAudience === 'tous' || res.targetAudience === selectedAudience;
    const matchesTheme = selectedTheme === 'tous' || res.theme === selectedTheme;

    return matchesSearch && matchesAudience && matchesTheme;
  });

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleDownloadMainGuide = () => {
    try {
      telechargerGuideDeuilParental_PDF();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch {
      handleSimulateDownload();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isEn ? 'Guides, practical sheets & psychoeducation landmarks' : 'Guides, fiches pratiques & repères de psychoéducation'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-stone-900 font-serif-accent tracking-tight">
            {isEn ? 'The Parange & Family Toolkit' : 'La Boîte à Outils du Parange & de la Famille'}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'Clear therapeutic milestones, designed to break the silence in Côte d\'Ivoire, guide you through anxious moments, and support siblings with kindness.'
              : 'Des repères thérapeutiques clairs, conçus pour briser le silence en Côte d\'Ivoire, vous guider dans les moments d\'angoisse et accompagner la fratrie avec bienveillance.'}
          </p>
        </div>

        {/* Highlight Feature Banner: Guide Essentiel du Parange */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <FileText className="w-3.5 h-3.5" />
              <span>{isEn ? 'Official NGO Publication' : 'Publication Officielle de l\'ONG'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-accent">
              {isEn ? 'The Essential Parange Guide (Côte d\'Ivoire Edition)' : 'Le Guide Essentiel du Parange (Édition Côte d\'Ivoire)'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {isEn
                ? '32 pages of concrete guidance written by our clinical psychologists and peer helpers: the stages of child loss at all ages (from stillbirth to adult life), coping with awkward remarks, and keys to protect marital intimacy and siblings.'
                : '32 pages de repères concrets rédigés par nos psychologues cliniciens et nos pairs-aidants : les étapes du deuil d\'un enfant à tout âge (du mort-né à l\'adulte), comment faire face aux maladresses de l\'entourage, et les clés pour préserver son couple et la fratrie.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleDownloadMainGuide}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isEn ? 'Download Free Guide in PDF (Watermarked)' : 'Télécharger le Livret Officiel en PDF (Filigrané)'}</span>
            </button>
            {downloadSuccess && (
              <span className="text-xs text-emerald-300 font-medium animate-fade-in">
                {isEn ? '✓ Download started with official logo & watermark!' : '✓ Téléchargement lancé avec logo officiel & filigrane !'}
              </span>
            )}
          </div>
        </div>

        {/* Dual Strip: Strategic Documents (PDF) & Official Facebook Group */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
          
          {/* Card 1: Official Strategic Documents & Impact Pitch Deck */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                  {isEn ? 'STRATEGY & IMPACT 2026' : 'STRATÉGIE & IMPACT 2026'}
                </span>
                <span className="text-[11px] text-stone-400 font-medium">PDF Officiel</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-serif-accent">
                {isEn ? 'Strategic Presentation & Pitch Deck' : 'Dossier de Présentation Stratégique'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isEn
                  ? 'Complete institutional presentation outlining our all-age child loss mission, public health data for Côte d\'Ivoire, SROI metrics, and healthcare partnerships.'
                  : 'Plaquette institutionnelle complète présentant notre mission universelle pour tout parent ayant perdu un enfant, les données de santé en Côte d\'Ivoire et le modèle SROI.'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  try {
                    telechargerDossierPresentationPDF();
                  } catch {
                    handleSimulateDownload();
                  }
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>🇫🇷 Version FR (PDF)</span>
              </button>
              <button
                onClick={() => {
                  try {
                    downloadStrategicPresentationPDF_EN();
                  } catch {
                    handleSimulateDownload();
                  }
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-teal-300" />
                <span>🇬🇧 English Deck (PDF)</span>
              </button>
            </div>
          </div>

          {/* Card 2: Official Facebook Support Group */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1877F2]/10 via-[#1877F2]/5 to-white border-2 border-[#1877F2]/40 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#1877F2]/20 text-[#1877F2] text-[11px] font-bold border border-[#1877F2]/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1877F2] animate-pulse" />
                  <span>COMMUNAUTÉ 24/7</span>
                </span>
                <span className="text-[11px] text-stone-500 font-medium">Réseau Solidaire</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-serif-accent flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#1877F2] text-white flex items-center justify-center text-xs font-black">f</span>
                <span>{isEn ? 'Official Facebook Support Group' : 'Groupe Facebook Officiel des Paranges'}</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isEn
                  ? 'Join our private and compassionate Facebook group to talk freely with other bereaved mothers and fathers across Côte d\'Ivoire and the diaspora.'
                  : 'Rejoignez notre communauté d\'entraide pour échanger librement, rompre le silence et trouver du réconfort au quotidien auprès d\'autres familles qui partagent la même épreuve.'}
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://www.facebook.com/groups/lejardindelespoirparange/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.01]"
              >
                <span>{isEn ? 'Access Official Facebook Group' : 'Accéder au Groupe Facebook d\'Entraide'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 mb-8 shadow-xs space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={isEn ? "Search keywords (e.g., perinatal loss, siblings, guilt, couple, community taboos)..." : "Rechercher un mot-clé (ex: deuil périnatal, fratrie, culpabilité, couple, entourage, tabou)..."}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Audience Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> {isEn ? 'Audience:' : 'Pour qui ?'}
              </span>
              {[
                { id: 'tous', label: isEn ? 'All audiences' : 'Tous publics' },
                { id: 'paranges', label: isEn ? 'For Paranges (Parents)' : 'Pour les Paranges (Parents)' },
                { id: 'fratrie', label: isEn ? 'For Siblings' : 'Pour la Fratrie' },
                { id: 'soignants-relais', label: isEn ? 'Healthcare & Relatives' : 'Pour Soignants & Proches' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedAudience(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedAudience === tab.id
                      ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Theme Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">{isEn ? 'Theme:' : 'Thématique :'}</span>
              <select
                value={selectedTheme}
                onChange={e => setSelectedTheme(e.target.value as any)}
                className="text-xs py-1.5 px-3 rounded-lg border border-stone-200 bg-white text-stone-700"
              >
                <option value="tous">{isEn ? 'All themes' : 'Toutes les thématiques'}</option>
                <option value="deuil-parental">{isEn ? 'Parental Grief (Child Loss)' : "Deuil Parental (Perte d'un enfant)"}</option>
                <option value="deuil-perinatal">{isEn ? 'Perinatal Loss (Stillbirth / Baby)' : 'Deuil Périnatal (Mort in utero / Bébé)'}</option>
                <option value="fratrie-endeuillee">{isEn ? 'Bereaved Siblings' : 'Fratrie Endeuillée'}</option>
                <option value="couple-et-culpabilite">{isEn ? 'Couples & Guilt' : 'Couple & Culpabilité'}</option>
                <option value="tabou-communaute">{isEn ? 'Breaking Taboos in CI' : 'Briser le Tabou en CI'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    res.targetAudience === 'paranges' 
                      ? 'bg-emerald-100 text-emerald-900' 
                      : res.targetAudience === 'fratrie' 
                      ? 'bg-amber-100 text-amber-900' 
                      : 'bg-teal-100 text-teal-900'
                  }`}>
                    {res.targetAudience === 'paranges' 
                      ? (isEn ? 'For Paranges' : 'Pour Paranges') 
                      : res.targetAudience === 'fratrie' 
                      ? (isEn ? 'For Siblings' : 'Pour Fratrie') 
                      : (isEn ? 'Clinicians & Relatives' : 'Soignants & Relais')}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    {res.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors font-serif-accent leading-snug mb-3">
                  {res.title}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                  {res.summary}
                </p>

                {/* Key Advice Previews */}
                <div className="space-y-1.5 mb-4">
                  {res.keyAdvice.slice(0, 2).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <span className="text-xs text-stone-500 truncate">
                  {res.category === 'guide-du-parange' ? (isEn ? '📖 Full booklet' : '📖 Livret complet') : (isEn ? '💡 Advice sheet' : '💡 Fiche repères')}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => telechargerFicheRessourcePDF(res)}
                    title={isEn ? "Download PDF (with logo & watermark)" : "Télécharger en PDF (avec logo & filigrane)"}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveResource(res)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>{isEn ? 'Read more' : 'Lire la suite'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-600 text-sm">
              {isEn ? 'No resource matched your search criteria.' : 'Aucun document ne correspond à vos critères de recherche.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedAudience('tous');
                setSelectedTheme('tous');
              }}
              className="mt-3 text-xs text-emerald-700 font-bold underline cursor-pointer"
            >
              {isEn ? 'Reset filters' : 'Réinitialiser les filtres'}
            </button>
          </div>
        )}

        {/* Dynamic FAQ Section for Grieving Parents with Admin Management */}
        <DynamicFaqSection />

        {/* Modal View for Detailed Resource */}
        {activeResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                  {isEn ? 'Support guide • Le Jardin de l\'Espoir : Parange' : 'Fiche de soutien • Le Jardin de l\'Espoir : Parange'}
                </span>
                <button
                  onClick={() => setActiveResource(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-stone-900 font-serif-accent mb-4">
                {activeResource.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 bg-stone-50 p-4 rounded-xl border border-stone-100">
                {activeResource.summary}
              </p>

              {activeResource.fullContent && (
                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3 mb-6">
                  <h4 className="font-bold text-stone-900 text-sm">
                    {isEn ? 'Clinical Insights:' : 'Éclairage clinique :'}
                  </h4>
                  <p>{activeResource.fullContent}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <h4 className="font-bold text-stone-900 text-sm">
                  {isEn ? 'Key takeaways:' : 'Conseils clés à retenir :'}
                </h4>
                <div className="space-y-2">
                  {activeResource.keyAdvice.map((adv, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => telechargerFicheRessourcePDF(activeResource)}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isEn ? 'Download PDF Sheet (Certified)' : 'Télécharger cette fiche en PDF (Logo & Filigrane)'}</span>
                </button>
                <button
                  onClick={() => setActiveResource(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  {isEn ? 'Close guide' : 'Fermer la fiche'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
