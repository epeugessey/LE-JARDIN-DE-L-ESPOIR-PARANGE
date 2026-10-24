import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Newspaper, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  X, 
  ChevronRight,
  ShieldCheck,
  Heart,
  Phone
} from 'lucide-react';

interface NewsViewProps {
  articles?: NewsArticle[];
  onOpenConsultationModal?: () => void;
  onNavigateToAdmin?: () => void;
  setActiveTab?: (tab: any) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({
  articles = [],
  onOpenConsultationModal,
  onNavigateToAdmin,
  setActiveTab
}) => {
  const { isEn } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    { id: 'all', label: isEn ? 'All News' : 'Toutes les actualités' },
    { id: 'sante-maternelle-neonatale', label: isEn ? 'Maternal & Neonatal Health' : 'Santé Maternelle & Néonatale' },
    { id: 'faits-de-societe-traditions', label: isEn ? 'Society & Traditions' : 'Faits de Société & Traditions' },
    { id: 'sante-mentale-perinatale', label: isEn ? 'Perinatal Mental Health' : 'Santé Mentale Périnatale' },
    { id: 'actions-ong', label: isEn ? 'Field Actions NGO' : 'Actions Terrain ONG' },
    { id: 'plaidoyer', label: isEn ? 'Advocacy & Rights' : 'Plaidoyer & Droits' }
  ];

  const safeArticles = Array.isArray(articles) ? articles : [];

  const filteredArticles = safeArticles.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const titleToSearch = (isEn && art.titleEn ? art.titleEn : art.title) || '';
    const summaryToSearch = (isEn && art.summaryEn ? art.summaryEn : art.summary) || '';
    const matchesSearch = 
      titleToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summaryToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.author || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const highlightedArticle = safeArticles.find(a => a.isHighlighted) || safeArticles[0];

  const handleShare = (article: NewsArticle) => {
    const artTitle = isEn && article.titleEn ? article.titleEn : article.title;
    const artSummary = isEn && article.summaryEn ? article.summaryEn : article.summary;
    if (navigator.share) {
      navigator.share({
        title: artTitle,
        text: artSummary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${artTitle} - Le Jardin de l'Espoir : Parange Côte d'Ivoire : ${window.location.href}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with warm background accents */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-8 sm:p-12 mb-12 shadow-xl border border-emerald-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/80 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Newspaper className="w-4 h-4" />
              <span>{isEn ? "Observatory & News • Côte d'Ivoire" : "Observatoire & Actualités • Côte d'Ivoire"}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight font-serif-accent text-white">
              {isEn ? "News & Social Insights in Côte d'Ivoire" : "Actualités & Faits de Société en Côte d'Ivoire"}
            </h1>
            
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              {isEn 
                ? "Field investigations, hospital developments, and sociological analyses on maternal health, perinatal bereavement, and Paranges rights in Côte d'Ivoire."
                : "Analyses, enquêtes de terrain, évolutions hospitalières et éclairages sociologiques sur la santé maternelle, le deuil périnatal et les droits des Paranges en terre ivoirienne."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {isEn ? "Information certified by our clinicians & sociologists" : "Informations certifiées par nos cliniciens & sociologues"}
              </span>
              <span className="bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60 font-semibold tracking-wide text-amber-200">
                COTE D'IVOIRE
              </span>
            </div>
          </div>
        </div>

        {/* Featured Highlighted Article (Hero Card) */}
        {highlightedArticle && (
          <div className="mb-14 bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-auto min-h-[280px]">
                <img 
                  src={highlightedArticle.imageUrl || '/bg-watermark.jpg'} 
                  alt={(isEn && highlightedArticle.titleEn) ? highlightedArticle.titleEn : highlightedArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {isEn ? "Headline in Côte d'Ivoire" : "À la Une en Côte d'Ivoire"}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="font-semibold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {(isEn && highlightedArticle.categoryLabelEn) ? highlightedArticle.categoryLabelEn : highlightedArticle.categoryLabel}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {highlightedArticle.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {(isEn && highlightedArticle.readTimeEn) ? highlightedArticle.readTimeEn : highlightedArticle.readTime}
                    </span>
                  </div>

                  <h2 
                    onClick={() => setActiveArticle(highlightedArticle)}
                    className="text-xl sm:text-3xl font-bold text-stone-900 font-serif-accent hover:text-emerald-800 transition-colors cursor-pointer leading-tight"
                  >
                    {(isEn && highlightedArticle.titleEn) ? highlightedArticle.titleEn : highlightedArticle.title}
                  </h2>

                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {(isEn && highlightedArticle.summaryEn) ? highlightedArticle.summaryEn : highlightedArticle.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {highlightedArticle.tags.map(t => (
                      <span key={t} className="text-[11px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {highlightedArticle.author.charAt(0)}
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-stone-900">{highlightedArticle.author}</div>
                      <div className="text-stone-500">
                        {(isEn && highlightedArticle.authorRoleEn) ? highlightedArticle.authorRoleEn : highlightedArticle.authorRole}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveArticle(highlightedArticle)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    <span>{isEn ? "Read the investigation" : "Lire l'enquête"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-4 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search by theme, hospital, tradition..." : "Rechercher par thème, CHU, tradition..."}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-1 mr-1" />
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500 space-y-3">
            <Newspaper className="w-10 h-10 mx-auto text-stone-300" />
            <div className="text-base font-bold text-stone-700">
              {isEn ? "No articles match your search criteria" : "Aucun article ne correspond à votre recherche"}
            </div>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              {isEn ? "Try another keyword or reset filters to browse all NGO publications." : "Essayez un autre mot-clé ou réinitialisez les filtres pour consulter toutes les publications de l'ONG."}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold"
            >
              {isEn ? "Show all articles" : "Afficher tous les articles"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredArticles.map(article => (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group hover:border-emerald-300"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                    <img 
                      src={article.imageUrl || '/bg-watermark.jpg'} 
                      alt={(isEn && article.titleEn) ? article.titleEn : article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 backdrop-blur-xs text-emerald-900 shadow-2xs">
                        {(isEn && article.categoryLabelEn) ? article.categoryLabelEn : article.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-stone-400">
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <span>{(isEn && article.readTimeEn) ? article.readTimeEn : article.readTime}</span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 font-serif-accent line-clamp-2 group-hover:text-emerald-800 transition-colors leading-snug">
                      {(isEn && article.titleEn) ? article.titleEn : article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                      {(isEn && article.summaryEn) ? article.summaryEn : article.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="text-stone-500 font-medium truncate max-w-[170px]">
                    {isEn ? `By ${article.author}` : `Par ${article.author}`}
                  </div>
                  <span className="font-bold text-emerald-800 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    {isEn ? "Read article →" : "Lire l'article →"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Community Callout & Helpline */}
        <div className="rounded-3xl bg-amber-50 border border-amber-200/80 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {isEn ? "Need someone to talk to or reporting a loss?" : "Une situation de deuil à signaler ou besoin d'écoute ?"}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-accent">
              {isEn ? "Le Jardin de l'Espoir : Parange answers 7/7 to families and siblings" : "Le Jardin de l'Espoir : Parange répond 7j/7 aux parents et fratries"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              {isEn 
                ? "Our support lines and psychologists are available in total confidentiality: +225 07 59 87 21 61 and +225 05 75 23 93 12."
                : "Nos lignes d'écoute et nos psychologues sont à votre disposition en toute confidentialité : +225 07 59 87 21 61 et +225 05 75 23 93 12."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenConsultationModal}
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
            >
              {isEn ? "Request free support" : "Demander un soutien gratuit"}
            </button>
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
              >
                {isEn ? "Editorial Desk & Media Files" : "Espace Rédaction & Fichiers"}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto"
          onClick={() => setActiveArticle(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full my-8 p-6 sm:p-10 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto text-left"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800">
                  {(isEn && activeArticle.categoryLabelEn) ? activeArticle.categoryLabelEn : activeArticle.categoryLabel}
                </span>
                <div className="text-xs text-stone-400 flex items-center gap-2 pt-1">
                  <span>{isEn ? `Published on ${activeArticle.publishedAt}` : `Publié le ${activeArticle.publishedAt}`}</span>
                  <span>•</span>
                  <span>{(isEn && activeArticle.readTimeEn) ? activeArticle.readTimeEn : activeArticle.readTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(activeArticle)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
                  title={isEn ? "Share" : "Partager"}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {copiedLink && (
              <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg text-center font-medium">
                {isEn ? "Article link copied to clipboard!" : "Lien de l'article copié dans le presse-papier !"}
              </div>
            )}

            {/* Title & Image */}
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-accent leading-tight">
              {(isEn && activeArticle.titleEn) ? activeArticle.titleEn : activeArticle.title}
            </h2>

            {activeArticle.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-80 w-full bg-stone-100 shadow-xs">
                <img 
                  src={activeArticle.imageUrl} 
                  alt={(isEn && activeArticle.titleEn) ? activeArticle.titleEn : activeArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Author Byline */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                  {activeArticle.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-stone-900">{activeArticle.author}</div>
                  <div className="text-stone-500">
                    {(isEn && activeArticle.authorRoleEn) ? activeArticle.authorRoleEn : activeArticle.authorRole}
                  </div>
                </div>
              </div>
              {activeArticle.sourceOrContext && (
                <div className="hidden sm:block text-right text-[11px] text-stone-400 max-w-xs italic">
                  {activeArticle.sourceOrContext}
                </div>
              )}
            </div>

            {/* Summary Highlight */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border-l-4 border-emerald-700 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed italic">
              « {(isEn && activeArticle.summaryEn) ? activeArticle.summaryEn : activeArticle.summary} »
            </div>

            {/* Article Content */}
            <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
              {(isEn && activeArticle.contentEn) ? activeArticle.contentEn : activeArticle.content}
            </div>

            {/* Key Takeaways */}
            {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
              <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? "Key Takeaways & NGO Commitments" : "Points clés à retenir & Engagements de l'ONG"}</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-200">
                  {((isEn && activeArticle.keyTakeawaysEn) ? activeArticle.keyTakeawaysEn : activeArticle.keyTakeaways).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              {activeArticle.tags.map(t => (
                <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                  #{t}
                </span>
              ))}
            </div>

            {/* Footer Modal Actions */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-500">
                {isEn ? "Helpline (7/7): " : "Permanence d'écoute : "}<strong>+225 07 59 87 21 61</strong> / <strong>05 75 23 93 12</strong>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => { setActiveArticle(null); onOpenConsultationModal && onOpenConsultationModal(); }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
                >
                  {isEn ? "Get Support" : "Prendre contact"}
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-medium"
                >
                  {isEn ? "Close" : "Fermer"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
