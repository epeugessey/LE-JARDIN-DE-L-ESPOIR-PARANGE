import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  RotateCcw, 
  ThumbsUp, 
  Share2, 
  ShieldCheck, 
  X, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ParangeFaqItem, 
  FAQ_CATEGORIES, 
  INITIAL_PARANGE_FAQS, 
  getStoredFaqs, 
  saveStoredFaqs 
} from '../data/faqData';

interface DynamicFaqSectionProps {
  isAdminProp?: boolean;
}

export const DynamicFaqSection: React.FC<DynamicFaqSectionProps> = ({ isAdminProp = false }) => {
  const { isEn } = useLanguage();
  const [faqs, setFaqs] = useState<ParangeFaqItem[]>(() => getStoredFaqs());
  const [activeCategory, setActiveCategory] = useState<string>('tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [votedFaqs, setVotedFaqs] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return isAdminProp || sessionStorage.getItem('jde_admin_auth') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminIdInput, setAdminIdInput] = useState<string>('');
  const [adminPassInput, setAdminPassInput] = useState<string>('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // Add / Edit Modal state
  const [editingFaq, setEditingFaq] = useState<ParangeFaqItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formCategory, setFormCategory] = useState<ParangeFaqItem['category']>('deuil_emotions');
  const [formQuestion, setFormQuestion] = useState<string>('');
  const [formQuestionEn, setFormQuestionEn] = useState<string>('');
  const [formAnswer, setFormAnswer] = useState<string>('');
  const [formAnswerEn, setFormAnswerEn] = useState<string>('');
  const [formOrder, setFormOrder] = useState<number>(1);

  useEffect(() => {
    saveStoredFaqs(faqs);
  }, [faqs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    return faqs
      .filter(item => {
        const matchesCategory = activeCategory === 'tous' || item.category === activeCategory;
        const q = searchQuery.toLowerCase().trim();
        if (!q) return matchesCategory;

        const matchesSearch = 
          item.question.toLowerCase().includes(q) ||
          (item.questionEn && item.questionEn.toLowerCase().includes(q)) ||
          item.answer.toLowerCase().includes(q) ||
          (item.answerEn && item.answerEn.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => a.order - b.order);
  }, [faqs, activeCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const handleHelpfulVote = (id: string) => {
    if (votedFaqs[id]) return;
    setFaqs(prev => 
      prev.map(item => 
        item.id === id ? { ...item, helpfulCount: (item.helpfulCount || 0) + 1 } : item
      )
    );
    setVotedFaqs(prev => ({ ...prev, [id]: true }));
    showToast(isEn ? 'Thank you for your feedback!' : 'Merci pour votre retour d\'appréciation !');
  };

  // Open modal to create a new FAQ
  const handleOpenAddModal = () => {
    setEditingFaq(null);
    setFormCategory('deuil_emotions');
    setFormQuestion('');
    setFormQuestionEn('');
    setFormAnswer('');
    setFormAnswerEn('');
    setFormOrder(faqs.length + 1);
    setIsModalOpen(true);
  };

  // Open modal to edit existing FAQ
  const handleOpenEditModal = (item: ParangeFaqItem) => {
    setEditingFaq(item);
    setFormCategory(item.category);
    setFormQuestion(item.question);
    setFormQuestionEn(item.questionEn || '');
    setFormAnswer(item.answer);
    setFormAnswerEn(item.answerEn || '');
    setFormOrder(item.order);
    setIsModalOpen(true);
  };

  // Save new or edited FAQ
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) {
      showToast('Veuillez renseigner au moins la question et la réponse en français.');
      return;
    }

    if (editingFaq) {
      // Update
      setFaqs(prev => 
        prev.map(item => 
          item.id === editingFaq.id 
            ? {
                ...item,
                category: formCategory,
                question: formQuestion.trim(),
                questionEn: formQuestionEn.trim() || undefined,
                answer: formAnswer.trim(),
                answerEn: formAnswerEn.trim() || undefined,
                order: Number(formOrder) || item.order
              }
            : item
        )
      );
      showToast('Question mise à jour avec succès.');
    } else {
      // Add new
      const newFaq: ParangeFaqItem = {
        id: `faq-${Date.now()}`,
        category: formCategory,
        question: formQuestion.trim(),
        questionEn: formQuestionEn.trim() || undefined,
        answer: formAnswer.trim(),
        answerEn: formAnswerEn.trim() || undefined,
        order: Number(formOrder) || (faqs.length + 1),
        helpfulCount: 0,
        createdAt: new Date().toISOString()
      };
      setFaqs(prev => [...prev, newFaq]);
      showToast('Nouvelle question ajoutée à la FAQ.');
    }

    setIsModalOpen(false);
  };

  // Delete FAQ
  const handleDeleteFaq = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette question de la FAQ ?')) {
      setFaqs(prev => prev.filter(item => item.id !== id));
      showToast('Question supprimée.');
    }
  };

  // Reset to default
  const handleResetFaqs = () => {
    if (window.confirm('Réinitialiser toutes les questions par les 7 questions officielles du Jardin de l\'Espoir : Parange ?')) {
      setFaqs(INITIAL_PARANGE_FAQS);
      showToast('FAQ réinitialisée avec succès.');
    }
  };

  // Admin login check
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = adminIdInput.trim().toLowerCase();
    const cleanPass = adminPassInput.trim();
    if ((cleanId === 'jardindelespoir' || cleanId === 'jardindelarenaissance') && cleanPass === 'ELVIVICTO') {
      setIsAdmin(true);
      sessionStorage.setItem('jde_admin_auth', 'true');
      setShowAdminLoginModal(false);
      setAdminAuthError(null);
      showToast('Mode Administrateur activé avec succès.');
    } else {
      setAdminAuthError('Identifiant ou mot de passe incorrect (Attendu : jardindelespoir / ELVIVICTO)');
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-stone-200/80">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>{isEn ? 'Bereaved Parents Dynamic FAQ' : 'Foire Aux Questions Fréquentes des Paranges'}</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 font-serif-accent tracking-tight">
          {isEn ? 'Questions Commonly Asked by Grieving Families' : 'Les Réponses à Vos Interrogations les Plus Intimes'}
        </h2>

        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          {isEn
            ? 'Clear, compassionate and clinical answers written by our bereavement psychologists and peer-helpers to accompany mothers, fathers, and families across Côte d\'Ivoire.'
            : 'Des réponses claires, bienveillantes et cliniques rédigées par nos psychologues et pairs-aidants pour éclairer les mamans, papas et proches éprouvés par la perte d\'un enfant en Côte d\'Ivoire.'}
        </p>

        {/* Admin status pill & toggle */}
        <div className="pt-2 flex items-center justify-center gap-3">
          {isAdmin ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? 'Admin Mode Active' : 'Mode Gestion Admin Actif'}</span>
              <button
                onClick={handleOpenAddModal}
                className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>{isEn ? 'Add Question' : 'Ajouter une question'}</span>
              </button>
              <button
                onClick={handleResetFaqs}
                title="Restaurer les FAQs par défaut"
                className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminLoginModal(true)}
              className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 underline underline-offset-2 cursor-pointer transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>{isEn ? 'Manage FAQ as Administrator' : 'Gérer cette FAQ en tant qu\'administrateur'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 mb-8 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isEn ? "Search among questions and answers (e.g., guilt, remarks, siblings, funeral)..." : "Rechercher une question ou un mot-clé (ex: culpabilité, entourage, fratrie, prénom, couple)..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {FAQ_CATEGORIES.map(cat => {
            const count = cat.id === 'tous' ? faqs.length : faqs.filter(f => f.category === cat.id).length;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected 
                    ? 'bg-emerald-800 text-white shadow-xs scale-102' 
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                }`}
              >
                <span>{isEn ? cat.labelEn : cat.labelFr}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-emerald-950 text-emerald-200' : 'bg-stone-200 text-stone-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion FAQ Items List */}
      <div className="space-y-3.5">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedFaqId === faq.id;
          const displayQuestion = (isEn && faq.questionEn) ? faq.questionEn : faq.question;
          const displayAnswer = (isEn && faq.answerEn) ? faq.answerEn : faq.answer;
          const hasVoted = !!votedFaqs[faq.id];

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded 
                  ? 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-200' 
                  : 'bg-white hover:bg-stone-50/70 border-stone-200/80 shadow-xs'
              }`}
            >
              {/* Question Header */}
              <div 
                onClick={() => toggleExpand(faq.id)}
                className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                    isExpanded ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    Q{faq.order}
                  </div>
                  <div>
                    <h3 className={`text-sm sm:text-base font-bold font-serif-accent transition-colors ${
                      isExpanded ? 'text-emerald-900' : 'text-stone-900'
                    }`}>
                      {displayQuestion}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        {FAQ_CATEGORIES.find(c => c.id === faq.category)?.[isEn ? 'labelEn' : 'labelFr']}
                      </span>
                      {faq.helpfulCount && faq.helpfulCount > 0 ? (
                        <>
                          <span className="text-stone-300">•</span>
                          <span className="text-[11px] text-emerald-700 font-medium">
                            {faq.helpfulCount} {isEn ? 'parents helped' : 'parents aidés'}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Admin actions inside item */}
                  {isAdmin && (
                    <div className="flex items-center gap-1 mr-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenEditModal(faq)}
                        title="Modifier cette question"
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        title="Supprimer cette question"
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                    isExpanded ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Answer Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100 space-y-4 animate-in fade-in">
                  <p className="bg-stone-50/80 p-4 rounded-xl border border-stone-100/80 text-stone-800">
                    {displayAnswer}
                  </p>

                  {/* Feedback toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px]">
                        {isEn ? 'Did this clinical response comfort or guide you?' : 'Cette réponse vous a-t-elle apporté de l\'apaisement ou des repères ?'}
                      </span>
                      <button
                        onClick={() => handleHelpfulVote(faq.id)}
                        disabled={hasVoted}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          hasVoted 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{hasVoted ? (isEn ? 'Helpful ✓' : 'Utile ✓') : (isEn ? 'Yes, helpful' : 'Oui, très utile')}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent(`[Le Jardin de l'Espoir : Parange]\nQuestion : ${displayQuestion}\n\nRéponse : ${displayAnswer}\n\nLigne 24/7 : +225 07 59 87 21 61`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{isEn ? 'Share on WhatsApp' : 'Partager par WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 space-y-3">
            <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-sm text-stone-600 font-medium">
              {isEn ? 'No questions matched your search criteria.' : 'Aucune question ne correspond à votre recherche.'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('tous'); }}
              className="text-xs text-emerald-700 font-bold underline cursor-pointer"
            >
              {isEn ? 'Reset filters' : 'Réinitialiser la recherche'}
            </button>
          </div>
        )}
      </div>

      {/* Admin Quick Login Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Accès Gestionnaire FAQ • Le Jardin de l'Espoir</span>
              </div>
              <button 
                onClick={() => setShowAdminLoginModal(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Connectez-vous pour ajouter, éditer ou réorganiser les questions-réponses destinées aux familles endeuillées.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Identifiant Admin</label>
                <input
                  type="text"
                  value={adminIdInput}
                  onChange={e => setAdminIdInput(e.target.value)}
                  placeholder="Ex: jardindelespoir"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Mot de Passe</label>
                <input
                  type="password"
                  value={adminPassInput}
                  onChange={e => setAdminPassInput(e.target.value)}
                  placeholder="Mot de passe confidentiel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  required
                />
              </div>

              {adminAuthError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  {adminAuthError}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer shadow-xs"
                >
                  Déverrouiller la gestion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add / Edit FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  {editingFaq ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-serif-accent">
                    {editingFaq ? 'Modifier la Question / Réponse' : 'Ajouter une Nouvelle Question à la FAQ'}
                  </h3>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                    Espace Gestion • Le Jardin de l'Espoir : Parange
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Catégorie Thématique
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                  >
                    {FAQ_CATEGORIES.filter(c => c.id !== 'tous').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.labelFr} / {cat.labelEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Numéro d'Ordre d'Affichage
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={e => setFormOrder(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Question (Français) *
                </label>
                <input
                  type="text"
                  value={formQuestion}
                  onChange={e => setFormQuestion(e.target.value)}
                  placeholder="Ex: Comment faire face aux fêtes de famille après la perte d'un bébé ?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Question (Anglais)
                </label>
                <input
                  type="text"
                  value={formQuestionEn}
                  onChange={e => setFormQuestionEn(e.target.value)}
                  placeholder="Ex: How to navigate family gatherings after baby loss?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Réponse Détaillée & Bienveillante (Français) *
                </label>
                <textarea
                  rows={4}
                  value={formAnswer}
                  onChange={e => setFormAnswer(e.target.value)}
                  placeholder="Rédigez la réponse d'écoute clinique et de réconfort..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Réponse Détaillée (Anglais)
                </label>
                <textarea
                  rows={3}
                  value={formAnswerEn}
                  onChange={e => setFormAnswerEn(e.target.value)}
                  placeholder="Detailed answer in English..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer shadow-md"
                >
                  {editingFaq ? 'Enregistrer les modifications' : 'Publier dans la FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
