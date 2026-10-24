import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  ThumbsUp, 
  BookOpen, 
  ArrowUp, 
  ArrowDown,
  Sparkles,
  Layers,
  Globe
} from 'lucide-react';
import { FAQItem, FAQCategory } from '../../types';
import { INITIAL_FAQ_ITEMS, FAQ_CATEGORIES } from '../../data/faqData';

export const AdminFAQManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem('jde_faq_items');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FAQ_ITEMS;
    } catch {
      return INITIAL_FAQ_ITEMS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form states
  const [formQuestion, setFormQuestion] = useState('');
  const [formQuestionEn, setFormQuestionEn] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formAnswerEn, setFormAnswerEn] = useState('');
  const [formCategory, setFormCategory] = useState<FAQCategory>('demarches-ci');
  const [formTags, setFormTags] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formPublished, setFormPublished] = useState<boolean>(true);

  // Persist to localStorage and broadcast event
  const persistFaqs = (updated: FAQItem[], msg?: string) => {
    setFaqs(updated);
    try {
      localStorage.setItem('jde_faq_items', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('jde_faq_updated', { detail: updated }));
    } catch (e) {
      console.error('Error saving FAQs:', e);
    }
    if (msg) {
      setFeedbackMsg(msg);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(null);
    setFormQuestion('');
    setFormQuestionEn('');
    setFormAnswer('');
    setFormAnswerEn('');
    setFormCategory('demarches-ci');
    setFormTags('État civil, Soutien');
    setFormOrder(faqs.length + 1);
    setFormPublished(true);
    setIsCreating(true);
  };

  const handleOpenEdit = (item: FAQItem) => {
    setIsCreating(false);
    setIsEditing(item.id);
    setFormQuestion(item.question);
    setFormQuestionEn(item.questionEn || '');
    setFormAnswer(item.answer);
    setFormAnswerEn(item.answerEn || '');
    setFormCategory(item.category);
    setFormTags((item.tags || []).join(', '));
    setFormOrder(item.order || 1);
    setFormPublished(item.isPublished);
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setIsEditing(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const categoryObj = FAQ_CATEGORIES.find((c) => c.id === formCategory);

    if (isCreating) {
      const newItem: FAQItem = {
        id: `faq-${Date.now()}`,
        question: formQuestion.trim(),
        questionEn: formQuestionEn.trim() || undefined,
        answer: formAnswer.trim(),
        answerEn: formAnswerEn.trim() || undefined,
        category: formCategory,
        categoryLabel: categoryObj?.label || 'Général',
        categoryLabelEn: categoryObj?.labelEn || 'General',
        order: Number(formOrder) || faqs.length + 1,
        isPublished: formPublished,
        helpfulCount: 0,
        tags: tagsArray,
        lastUpdated: 'À l\'instant'
      };
      const updated = [...faqs, newItem];
      persistFaqs(updated, 'Nouvelle question FAQ ajoutée et publiée avec succès !');
    } else if (isEditing) {
      const updated = faqs.map((f) => {
        if (f.id === isEditing) {
          return {
            ...f,
            question: formQuestion.trim(),
            questionEn: formQuestionEn.trim() || undefined,
            answer: formAnswer.trim(),
            answerEn: formAnswerEn.trim() || undefined,
            category: formCategory,
            categoryLabel: categoryObj?.label || f.categoryLabel,
            categoryLabelEn: categoryObj?.labelEn || f.categoryLabelEn,
            order: Number(formOrder) || f.order,
            isPublished: formPublished,
            tags: tagsArray,
            lastUpdated: 'Mis à jour à l\'instant'
          };
        }
        return f;
      });
      persistFaqs(updated, 'Question FAQ mise à jour avec succès.');
    }

    setIsCreating(false);
    setIsEditing(null);
  };

  const handleDeleteFaq = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette question de la FAQ ?')) {
      const updated = faqs.filter((f) => f.id !== id);
      persistFaqs(updated, 'Question FAQ supprimée.');
    }
  };

  const handleTogglePublish = (id: string) => {
    const updated = faqs.map((f) => {
      if (f.id === id) {
        return { ...f, isPublished: !f.isPublished };
      }
      return f;
    });
    persistFaqs(updated, 'Statut de publication mis à jour.');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Réinitialiser la FAQ avec les questions officielles de référence ?')) {
      persistFaqs(INITIAL_FAQ_ITEMS, 'FAQ réinitialisée avec les questions types.');
    }
  };

  // Filtered list
  const filteredFaqs = faqs
    .filter((f) => {
      if (selectedCategory !== 'tous' && f.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = f.question.toLowerCase().includes(q) || (f.questionEn && f.questionEn.toLowerCase().includes(q));
        const matchesA = f.answer.toLowerCase().includes(q) || (f.answerEn && f.answerEn.toLowerCase().includes(q));
        const matchesTag = (f.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchesQ || matchesA || matchesTag;
      }
      return true;
    })
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Gestionnaire FAQ Dynamique • Espace Ressources Parents</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white tracking-tight">
            Foire Aux Questions (FAQ) pour les Paranges
          </h2>
          <p className="text-emerald-100/85 text-xs sm:text-sm leading-relaxed">
            Administrez en temps réel les réponses aux questions les plus fréquentes posées par les familles endeuillées en Côte d'Ivoire (démarches d'état civil, psychologie du deuil, couple, fratrie, kits hospitaliers). Toute modification effectuée ici est immédiatement visible par les parents dans la vue <strong>« Ressources »</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-stone-950" />
              <span>Ajouter une nouvelle Question</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-300" />
              <span>Restaurer les questions par défaut</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Form modal or inline accordion for Create / Edit */}
      {(isCreating || isEditing) && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base sm:text-lg">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{isCreating ? 'Nouvelle question pour la FAQ' : 'Modifier la question FAQ'}</span>
            </div>
            <button
              onClick={handleCancelForm}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Catégorie thématique <span className="text-red-500">*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as FAQCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  {FAQ_CATEGORIES.filter((c) => c.id !== 'tous').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label} ({cat.labelEn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Statut de visibilité
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormPublished(!formPublished)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                      formPublished
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-stone-100 text-stone-500 border-stone-300'
                    }`}
                  >
                    {formPublished ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{formPublished ? 'Publiée' : 'Brouillon'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Question (Français) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                placeholder="Ex: Mon bébé est né sans vie : puis-je inscrire son prénom à l'état civil ?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                <span>Question (English - Optional)</span>
              </label>
              <input
                type="text"
                value={formQuestionEn}
                onChange={(e) => setFormQuestionEn(e.target.value)}
                placeholder="Ex: Can a stillborn child be registered in civil records?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Réponse détaillée (Français) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
                placeholder="Rédigez une réponse claire, bienveillante, avec les démarches ou conseils appropriés..."
                className="w-full p-3.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 leading-relaxed font-sans focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                <span>Réponse détaillée (English - Optional)</span>
              </label>
              <textarea
                rows={4}
                value={formAnswerEn}
                onChange={(e) => setFormAnswerEn(e.target.value)}
                placeholder="English translation for international and diaspora visitors..."
                className="w-full p-3.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 leading-relaxed font-sans focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mots-clés / Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="Ex: État civil, Mairie, Certificat médical, CHU"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isCreating ? 'Enregistrer la Question' : 'Mettre à jour'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une question ou mot-clé..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Layers className="w-4 h-4 text-stone-400" />
            <span><strong>{filteredFaqs.length}</strong> question(s) sur {faqs.length}</span>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* List of FAQ Cards */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500">
            <HelpCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="font-semibold text-sm">Aucune question trouvée pour ce filtre.</p>
            <p className="text-xs text-stone-400 mt-1">Essayez un autre mot-clé ou ajoutez une nouvelle question.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                faq.isPublished
                  ? 'border-stone-200 hover:border-emerald-300'
                  : 'border-dashed border-stone-300 bg-stone-50/70 opacity-75'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase">
                      {faq.categoryLabel || faq.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-stone-400">
                      #{faq.order}
                    </span>
                    {faq.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <Eye className="w-3 h-3" />
                        <span>En ligne</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                        <EyeOff className="w-3 h-3" />
                        <span>Brouillon</span>
                      </span>
                    )}
                    {faq.helpfulCount && faq.helpfulCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                        <ThumbsUp className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{faq.helpfulCount} utiles</span>
                      </span>
                    ) : null}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                    {faq.question}
                  </h4>

                  {faq.questionEn && (
                    <p className="text-xs text-stone-500 italic">
                      EN: {faq.questionEn}
                    </p>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {faq.answer}
                  </p>

                  {faq.tags && faq.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {faq.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  <button
                    onClick={() => handleTogglePublish(faq.id)}
                    title={faq.isPublished ? 'Dépublier' : 'Publier'}
                    className={`p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                      faq.isPublished
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-300'
                    }`}
                  >
                    {faq.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(faq)}
                    title="Modifier"
                    className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-800 border border-stone-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    title="Supprimer"
                    className="p-2 rounded-xl bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-700 border border-stone-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
