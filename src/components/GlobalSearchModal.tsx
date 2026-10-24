import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  GraduationCap, 
  Download, 
  Sparkles, 
  Calendar,
  ChevronRight,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { NavTab, NewsArticle, BlogPost, UploadedDocument, EventItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab, extraId?: string) => void;
  articles?: NewsArticle[];
  blogPosts?: BlogPost[];
  documents?: UploadedDocument[];
  events?: EventItem[];
}

interface SearchResultItem {
  id: string;
  type: 'article' | 'blog' | 'document' | 'service' | 'event' | 'training';
  title: string;
  subtitle: string;
  badge: string;
  targetTab: NavTab;
  extraId?: string;
  dateOrSize?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  articles = [],
  blogPosts = [],
  documents = [],
  events = []
}) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'articles' | 'blog' | 'documents' | 'events' | 'services'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Static services and resources to index
  const indexedServices: SearchResultItem[] = useMemo(() => [
    {
      id: 'srv-gsp',
      type: 'service',
      title: 'Groupes de Soutien aux Paranges (GSP)',
      subtitle: 'Cercles de parole mensuels en présentiel (Abidjan) et en visioconférence pour parents endeuillés.',
      badge: 'Accompagnement',
      targetTab: 'services'
    },
    {
      id: 'srv-hotline',
      type: 'service',
      title: 'Ligne d\'Écoute Solidaire 7j/7',
      subtitle: 'Permanence d\'urgence confidentielle avec psychologues et pairs-aidants en Côte d\'Ivoire.',
      badge: 'Urgence',
      targetTab: 'services'
    },
    {
      id: 'srv-kits',
      type: 'service',
      title: 'Kits & Boîtes de Mémoire en Maternité',
      subtitle: 'Boîtes sacrées remises aux parents pour conserver les souvenirs de leur bébé (bracelet, empreintes).',
      badge: 'Maternité',
      targetTab: 'services'
    },
    {
      id: 'srv-fratrie',
      type: 'service',
      title: 'Accompagnement de la Fratrie Endeuillée',
      subtitle: 'Ateliers créatifs, contes thérapeutiques et médiation pour les frères et sœurs endeuillés.',
      badge: 'Fratrie',
      targetTab: 'services'
    },
    {
      id: 'srv-garden',
      type: 'service',
      title: 'Jardin Virtuel du Souvenir',
      subtitle: 'Déposez une fleur, allumez une bougie symbolique et honorez la mémoire de votre ange.',
      badge: 'Commémoration',
      targetTab: 'jardin-virtuel'
    },
    {
      id: 'srv-training',
      type: 'training',
      title: 'Formations pour Professionnels de Santé (Maternités & CHU)',
      subtitle: 'Modules de formation pour sages-femmes, gynécologues et infirmiers sur l\'humanisation du deuil.',
      badge: 'Formation Pro',
      targetTab: 'formations'
    }
  ], []);

  // Compute filtered search results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];
    const safeArticles = Array.isArray(articles) ? articles : [];
    const safeBlogPosts = Array.isArray(blogPosts) ? blogPosts : [];
    const safeDocuments = Array.isArray(documents) ? documents : [];
    const safeEvents = Array.isArray(events) ? events : [];

    // 1. Articles News
    safeArticles.forEach((art) => {
      if (
        (art.title || '').toLowerCase().includes(q) ||
        (art.summary || '').toLowerCase().includes(q) ||
        (art.tags || []).some(t => (t || '').toLowerCase().includes(q)) ||
        (art.categoryLabel || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: art.id,
          type: 'article',
          title: art.title,
          subtitle: art.summary,
          badge: art.categoryLabel || 'Actualité CI',
          targetTab: 'actualites',
          extraId: art.id,
          dateOrSize: art.publishedAt
        });
      }
    });

    // 2. Blog Posts
    safeBlogPosts.forEach((post) => {
      if (
        (post.title || '').toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q) ||
        (post.tags || []).some(t => (t || '').toLowerCase().includes(q)) ||
        (post.categoryLabel || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: post.id,
          type: 'blog',
          title: post.title,
          subtitle: post.excerpt,
          badge: post.categoryLabel || 'Blog & Cheminement',
          targetTab: 'blog',
          extraId: post.id,
          dateOrSize: post.readTime
        });
      }
    });

    // 3. Uploaded Documents & Toolkits
    safeDocuments.forEach((doc) => {
      if (
        (doc.name || '').toLowerCase().includes(q) ||
        (doc.description && doc.description.toLowerCase().includes(q)) ||
        (doc.category || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: doc.id,
          type: 'document',
          title: doc.name,
          subtitle: doc.description || `Document officiel disponible au téléchargement (${doc.category})`,
          badge: `${(doc.fileType || 'PDF').toUpperCase()} • ${doc.category}`,
          targetTab: 'ressources',
          extraId: doc.id,
          dateOrSize: doc.size
        });
      }
    });

    // 4. Events & Calendar
    safeEvents.forEach((evt) => {
      if (
        (evt.title || '').toLowerCase().includes(q) ||
        (evt.description || '').toLowerCase().includes(q) ||
        (evt.location || '').toLowerCase().includes(q) ||
        (evt.typeLabel || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: evt.id,
          type: 'event',
          title: evt.title,
          subtitle: `${evt.date} • ${evt.time} — ${evt.location}`,
          badge: evt.typeLabel,
          targetTab: 'accueil',
          extraId: evt.id,
          dateOrSize: evt.isOnline ? 'En ligne' : 'Présentiel'
        });
      }
    });

    // 5. Services
    indexedServices.forEach((srv) => {
      if (
        srv.title.toLowerCase().includes(q) ||
        srv.subtitle.toLowerCase().includes(q) ||
        srv.badge.toLowerCase().includes(q)
      ) {
        results.push(srv);
      }
    });

    // Apply category filter
    if (activeCategory === 'articles') return results.filter(r => r.type === 'article');
    if (activeCategory === 'blog') return results.filter(r => r.type === 'blog');
    if (activeCategory === 'documents') return results.filter(r => r.type === 'document');
    if (activeCategory === 'events') return results.filter(r => r.type === 'event');
    if (activeCategory === 'services') return results.filter(r => r.type === 'service' || r.type === 'training');

    return results;
  }, [query, activeCategory, articles, blogPosts, documents, events, indexedServices]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative p-4 sm:p-5 border-b border-stone-100 flex items-center gap-3 bg-gradient-to-r from-emerald-50/50 via-amber-50/30 to-white">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'fr' ? "Rechercher un article, document, guide, groupe de parole..." : "Search articles, documents, guides, support groups..."}
            className="w-full bg-transparent border-none text-stone-900 placeholder:text-stone-400 font-medium text-base sm:text-lg focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
              title="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer shrink-0"
          >
            {language === 'fr' ? 'Fermer (Échap)' : 'Close (Esc)'}
          </button>
        </div>

        {/* Category Filters Pills */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-stone-50/70 border-b border-stone-100 overflow-x-auto text-xs">
          <span className="text-stone-400 font-medium shrink-0">Filtrer par :</span>
          {[
            { id: 'all', label: language === 'fr' ? 'Tous' : 'All' },
            { id: 'articles', label: language === 'fr' ? 'Actualités' : 'News' },
            { id: 'blog', label: language === 'fr' ? 'Blog & Chemins' : 'Blog' },
            { id: 'documents', label: language === 'fr' ? 'Documents & Outils' : 'Documents' },
            { id: 'events', label: language === 'fr' ? 'Événements & Groupes' : 'Events' },
            { id: 'services', label: language === 'fr' ? 'Services' : 'Services' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200/80 border border-stone-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {query.trim() === '' ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-stone-800 font-serif-accent">
                  {language === 'fr' ? 'Que recherchez-vous au Jardin de l\'Espoir : Parange ?' : 'What are you looking for in Le Jardin de l\'Espoir : Parange?'}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {language === 'fr'
                    ? 'Tapez un mot-clé (ex: "groupe de parole", "père", "fratrie", "kit", "droit", "guide", "bougie").'
                    : 'Type a keyword (e.g., "support group", "father", "siblings", "kit", "guide").'}
                </p>
              </div>

              {/* Suggestions chips */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {[
                  'Groupe de parole',
                  'Papas paranges',
                  'Kit de mémoire',
                  'Fratrie endeuillée',
                  'Législation Côte d\'Ivoire',
                  'Jardin virtuel',
                  'Dr Marie-Hélène Kouadio'
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-600 text-xs transition-colors cursor-pointer border border-stone-200/80"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <HelpCircle className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-semibold text-stone-700">
                {language === 'fr' 
                  ? `Aucun résultat pour « ${query} »` 
                  : `No results found for "${query}"`}
              </p>
              <p className="text-xs text-stone-400">
                {language === 'fr' 
                  ? 'Essayez avec des termes plus généraux ou parcourez nos onglets thématiques.' 
                  : 'Try broader keywords or browse our navigation sections.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-stone-400 px-2 pb-1 flex justify-between items-center">
                <span>{searchResults.length} {language === 'fr' ? 'résultats trouvés' : 'results found'}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Cliquez pour accéder directement</span>
              </div>

              {searchResults.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    onNavigate(item.targetTab, item.extraId);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-300 transition-all cursor-pointer group flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.type === 'article' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                        item.type === 'blog' ? 'bg-teal-100 text-teal-900 border border-teal-200' :
                        item.type === 'document' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                        item.type === 'event' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                        'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {item.type === 'article' && <FileText className="w-3 h-3" />}
                        {item.type === 'blog' && <BookOpen className="w-3 h-3" />}
                        {item.type === 'document' && <Download className="w-3 h-3" />}
                        {item.type === 'event' && <Calendar className="w-3 h-3" />}
                        {item.type === 'service' && <HelpCircle className="w-3 h-3" />}
                        {item.type === 'training' && <GraduationCap className="w-3 h-3" />}
                        <span>{item.badge}</span>
                      </span>

                      {item.dateOrSize && (
                        <span className="text-[11px] text-stone-400">
                          • {item.dateOrSize}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-emerald-700 text-stone-400 group-hover:text-white flex items-center justify-center shrink-0 border border-stone-200 group-hover:border-emerald-700 transition-colors shadow-2xs self-center">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Quick Access */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2 px-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Accompagnement gratuit, confidentiel & sans jugement en Côte d'Ivoire</span>
          </div>
          <button
            onClick={() => {
              onNavigate('services');
              onClose();
            }}
            className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Voir tous nos services</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
