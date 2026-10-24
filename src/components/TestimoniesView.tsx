import React, { useState } from 'react';
import { 
  Heart, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  X, 
  Send, 
  Baby, 
  MapPin, 
  Clock, 
  AlertCircle,
  Quote,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ParangeTestimony } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TestimoniesViewProps {
  testimonies: ParangeTestimony[];
  onAddTestimony: (testimony: ParangeTestimony) => void;
  onOpenConsultationModal?: () => void;
}

export const TestimoniesView: React.FC<TestimoniesViewProps> = ({
  testimonies,
  onAddTestimony,
  onOpenConsultationModal
}) => {
  const { isEn } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [litCandles, setLitCandles] = useState<Record<string, boolean>>({});
  const [lovedStories, setLovedStories] = useState<Record<string, boolean>>({});
  const [localCounts, setLocalCounts] = useState<Record<string, { candles: number; likes: number }>>({});
  const [submittedFeedback, setSubmittedFeedback] = useState<string | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorRole, setAuthorRole] = useState<ParangeTestimony['authorRole']>('maman');
  const [childName, setChildName] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<ParangeTestimony['category']>('Mamans Paranges');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [hopeMessage, setHopeMessage] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Filter approved stories
  const approvedTestimonies = testimonies.filter(t => t.status === 'approuve');

  const categories = [
    { id: 'all', label: isEn ? 'All Stories' : 'Tous les récits' },
    { id: 'Mamans Paranges', label: isEn ? 'Grieving Mothers' : 'Mamans Paranges' },
    { id: 'Papas Paranges', label: isEn ? 'Grieving Fathers' : 'Papas Paranges' },
    { id: 'Couples Unis', label: isEn ? 'Couples in Grief' : 'Couples Unis' },
    { id: 'Fratrie & Famille', label: isEn ? 'Siblings & Family' : 'Fratrie & Famille' },
    { id: 'Espoir & Renaissance', label: isEn ? 'Hope & Healing' : 'Espoir & Renaissance' },
  ];

  const filteredStories = approvedTestimonies.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const titleVal = (isEn && item.titleEn ? item.titleEn : item.title) || '';
    const storyVal = (isEn && item.storyEn ? item.storyEn : item.story) || '';
    const matchesSearch = 
      titleVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      storyVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.childName && item.childName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLightCandle = (id: string, currentCount: number = 0) => {
    if (litCandles[id]) return;
    setLitCandles(prev => ({ ...prev, [id]: true }));
    setLocalCounts(prev => ({
      ...prev,
      [id]: {
        candles: (prev[id]?.candles ?? currentCount) + 1,
        likes: prev[id]?.likes ?? (testimonies.find(t => t.id === id)?.likesCount || 0)
      }
    }));
  };

  const handleLike = (id: string, currentLikes: number = 0) => {
    if (lovedStories[id]) return;
    setLovedStories(prev => ({ ...prev, [id]: true }));
    setLocalCounts(prev => ({
      ...prev,
      [id]: {
        candles: prev[id]?.candles ?? (testimonies.find(t => t.id === id)?.candlesLitCount || 0),
        likes: (prev[id]?.likes ?? currentLikes) + 1
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !story.trim()) return;

    const newTestimony: ParangeTestimony = {
      id: `testim-${Date.now()}`,
      authorName: isAnonymous 
        ? (isEn ? 'Anonymous Parange' : 'Parange anonyme') 
        : (authorName.trim() || (isEn ? 'A loving parent' : 'Un parent aimant')),
      authorRole,
      authorRoleLabel: authorRole === 'maman' ? 'Maman Parange' :
                       authorRole === 'papa' ? 'Papa Parange' :
                       authorRole === 'couple' ? 'Couple Parange' :
                       authorRole === 'fratrie' ? 'Fratrie endeuillée' : 'Proche',
      childName: childName.trim() || undefined,
      city: city.trim() || 'Côte d\'Ivoire',
      yearOrDate: new Date().getFullYear().toString(),
      title: title.trim(),
      category: category || 'Mamans Paranges',
      story: story.trim(),
      hopeMessage: hopeMessage.trim() || undefined,
      status: 'en_attente', // Needs admin moderation
      likesCount: 1,
      candlesLitCount: 1,
      createdAt: isEn ? 'Just now' : 'À l\'instant',
      isAnonymous
    };

    onAddTestimony(newTestimony);

    // Reset form
    setAuthorName('');
    setIsAnonymous(false);
    setChildName('');
    setCity('');
    setTitle('');
    setStory('');
    setHopeMessage('');
    setConsentAccepted(false);
    setIsModalOpen(false);

    setSubmittedFeedback(
      isEn
        ? "Your heartfelt testimony has been received with immense gratitude. It will be reviewed by our listening team with care before being published in this sanctuary."
        : "Votre témoignage a été transmis avec infinie douceur. Notre équipe d'écoute et de modération le relira avec respect avant sa mise en ligne dans cet espace protégé."
    );
    setTimeout(() => setSubmittedFeedback(null), 7000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soothing Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 text-white p-8 sm:p-12 mb-10 shadow-xl border border-emerald-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/80 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Quote className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEn ? 'Bereaved Parents Stories • Sanctuary of Remembrance' : 'Récits & Témoignages • Sanctuaire des Paranges'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight font-serif-accent text-white">
              {isEn 
                ? 'Voices of Remembrance, Love & Healing' 
                : 'Paroles de Mémoire, d\'Amour & de Renaissance'}
            </h1>
            
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              {isEn 
                ? 'A safe, moderated haven where grieving mothers, fathers, and siblings in Côte d\'Ivoire break the silence. Every word honors a departed child with dignity and without taboo.'
                : 'Un refuge bienveillant et sécurisé où mamans, papas et fratries endeuillés brisent le silence en Côte d\'Ivoire. Chaque mot honore un petit ange parti trop tôt avec dignité et sans tabou.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-stone-950" />
                <span>{isEn ? 'Share My Testimony' : 'Déposer mon témoignage'}</span>
              </button>

              {onOpenConsultationModal && (
                <button
                  onClick={onOpenConsultationModal}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 text-emerald-100 border border-emerald-600/60 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-300" />
                  <span>{isEn ? 'Need to Talk to Someone?' : 'Besoin d\'une écoute fraternelle ?'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security & Respect Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3.5 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block text-amber-950 mb-0.5">
              {isEn ? 'Sanctuary Guarantee & Benevolent Moderation' : 'Garantie de Sérénité & Modération Bienveillante'}
            </span>
            {isEn 
              ? 'To protect the deep sensitivity of every grieving family, all testimonies submitted are gently moderated by our clinical team before publication. Anonymity is guaranteed if you wish.'
              : 'Afin de préserver la sensibilité profonde de chaque famille, tous les récits partagés sont relus avec précaution par nos psychologues et coordinateurs avant mise en ligne. Votre anonymat est préservé selon votre choix.'}
          </div>
        </div>

        {/* Success feedback alert */}
        {submittedFeedback && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-start gap-3 shadow-md animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">{isEn ? 'Thank you from the bottom of our hearts' : 'Merci du fond du cœur'}</p>
              <p>{submittedFeedback}</p>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 border border-stone-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search stories, city, baby...' : 'Rechercher un récit, ville, ange...'}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-200 space-y-4">
            <Quote className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800 font-serif-accent">
              {isEn ? 'No stories found matching your criteria' : 'Aucun témoignage ne correspond à votre recherche'}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {isEn 
                ? 'Try adjusting your filters or be the first to deposit your story in this section.'
                : 'Essayez de modifier votre filtre ou soyez le premier parent à déposer votre histoire avec bienveillance.'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isEn ? 'Deposit a testimony' : 'Déposer mon témoignage'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStories.map((item) => {
              const isCandleLit = litCandles[item.id];
              const isLoved = lovedStories[item.id];
              const candlesCount = localCounts[item.id]?.candles ?? (item.candlesLitCount || 0);
              const likesCount = localCounts[item.id]?.likes ?? (item.likesCount || 0);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    {/* Card Top: Author & Category */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs shadow-2xs">
                          {item.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-stone-900">
                              {item.authorName}
                            </span>
                            {item.isAnonymous && (
                              <span className="text-[10px] text-stone-400 italic">
                                ({isEn ? 'Anonymous' : 'Anonyme'})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500">
                            <span>
                              {(isEn && item.authorRoleLabelEn)
                                ? item.authorRoleLabelEn
                                : (item.authorRoleLabel || item.authorRole)}
                            </span>
                            {item.city && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="w-2.5 h-2.5 text-stone-400" />
                                  {item.city}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {item.category && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {(isEn && item.categoryEn) ? item.categoryEn : item.category}
                        </span>
                      )}
                    </div>

                    {/* Child Tribute Dedication */}
                    {item.childName && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs font-semibold">
                        <Baby className="w-3.5 h-3.5 text-amber-700" />
                        <span>{isEn ? 'In memory of' : 'En hommage à'} : <strong>{item.childName}</strong></span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif-accent leading-snug">
                      « {(isEn && item.titleEn) ? item.titleEn : item.title} »
                    </h3>

                    {/* Story content */}
                    <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50/50 p-4 sm:p-5 rounded-2xl border border-stone-100">
                      {(isEn && item.storyEn) ? item.storyEn : item.story}
                    </div>

                    {/* Uplifting message of hope */}
                    {item.hopeMessage && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-teal-50/60 border border-emerald-200/70 text-xs text-emerald-950 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-emerald-900 mb-0.5">
                            {isEn ? 'Message of Hope to Other Families:' : 'Message d\'Espérance aux Autres Familles :'}
                          </span>
                          <span className="italic">
                            {(isEn && item.hopeMessageEn) ? item.hopeMessageEn : item.hopeMessage}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions (Candle & Heart reactions) */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLightCandle(item.id, item.candlesLitCount)}
                        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold transition-all cursor-pointer border ${
                          isCandleLit
                            ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                        title={isEn ? 'Light a symbolic candle' : 'Allumer une bougie pour ce récit'}
                      >
                        <Flame className={`w-3.5 h-3.5 ${isCandleLit ? 'text-amber-600 fill-amber-500 animate-bounce' : 'text-amber-500'}`} />
                        <span>{isCandleLit ? (isEn ? 'Candle Lit' : 'Bougie allumée') : (isEn ? 'Light 1 Candle' : 'Allumer 1 bougie')}</span>
                        <span className="ml-1 text-[11px] font-bold text-amber-800">({candlesCount})</span>
                      </button>

                      <button
                        onClick={() => handleLike(item.id, item.likesCount)}
                        className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl flex items-center gap-1.5 font-semibold transition-all cursor-pointer border ${
                          isLoved
                            ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                        title={isEn ? 'Send a loving thought' : 'Envoyer une pensée douce'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLoved ? 'text-rose-600 fill-rose-500' : 'text-stone-400'}`} />
                        <span className="hidden sm:inline">{isLoved ? (isEn ? 'Touched' : 'Touché(e)') : (isEn ? 'Compassion' : 'Soutien')}</span>
                        <span className="text-[11px] font-bold text-rose-700">({likesCount})</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal to Submit Testimony */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
              <div 
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 my-8 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 text-white bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 relative">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                      <Quote className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isEn ? 'Safe & Confidential Space' : 'Espace Sécurisé & Bienveillant'}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white tracking-tight">
                        {isEn ? 'Share Your Journey as a Parange' : 'Partager votre cheminement de Parange'}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isEn ? 'Every story brings light to another parent' : 'Chaque mot apporte de la lumière à un autre parent'}</span>
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      {isEn
                        ? 'Your testimony will be reviewed with boundless respect by our listening psychologists before publication. You can choose to remain fully anonymous.'
                        : 'Votre témoignage sera relu avec une infinie bienveillance par nos psychologues écoutants avant parution. Vous pouvez choisir de rester strictement anonyme.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isEn ? 'Your Name or Pseudonym' : 'Votre Prénom ou Pseudonyme'}
                      </label>
                      <input
                        type="text"
                        disabled={isAnonymous}
                        value={isAnonymous ? (isEn ? 'Anonymous' : 'Anonyme') : authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={isEn ? 'e.g. Marie or Kouamé' : 'Ex: Marie ou Kouamé'}
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden disabled:opacity-60"
                      />
                      <label className="mt-1.5 flex items-center gap-2 text-[11px] text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-3.5 h-3.5 text-emerald-600 rounded-sm focus:ring-emerald-500"
                        />
                        <span>{isEn ? 'Keep my testimony anonymous' : 'Garder mon récit strictement anonyme'}</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isEn ? 'Your Relationship / Profile *' : 'Votre Profil *'}
                      </label>
                      <select
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                      >
                        <option value="maman">{isEn ? 'Grieving Mother (Maman Parange)' : 'Maman Parange'}</option>
                        <option value="papa">{isEn ? 'Grieving Father (Papa Parange)' : 'Papa Parange'}</option>
                        <option value="couple">{isEn ? 'Grieving Couple' : 'Couple Parange'}</option>
                        <option value="fratrie">{isEn ? 'Grieving Sibling (Fratrie)' : 'Fratrie endeuillée'}</option>
                        <option value="proche">{isEn ? 'Relative / Close friend' : 'Proche bienveillant'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isEn ? 'Child\'s Name or Nickname (optional)' : 'Prénom ou petit nom de l\'ange (facultatif)'}
                      </label>
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder={isEn ? 'e.g. Little Liam, Angel Sophie...' : 'Ex: Liam, Ange Grâce...'}
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isEn ? 'City / Location' : 'Ville de résidence'}
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={isEn ? 'e.g. Abidjan, Bouaké, Diaspora...' : 'Ex: Abidjan (Cocody), San-Pédro...'}
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isEn ? 'Theme Category' : 'Thématique principale'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                    >
                      <option value="Mamans Paranges">{isEn ? 'Mothers\' Journey' : 'Mamans Paranges'}</option>
                      <option value="Papas Paranges">{isEn ? 'Fathers\' Voice' : 'Papas Paranges'}</option>
                      <option value="Couples Unis">{isEn ? 'Couples Journey' : 'Couples Unis'}</option>
                      <option value="Fratrie & Famille">{isEn ? 'Siblings & Family' : 'Fratrie & Famille'}</option>
                      <option value="Espoir & Renaissance">{isEn ? 'Hope & Rebuilding' : 'Espoir & Renaissance'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isEn ? 'Title of Your Story *' : 'Titre de votre témoignage *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={isEn ? 'e.g. Finding peace after the storm' : 'Ex: Sortir de la nuit et honorer sa mémoire'}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isEn ? 'Your Story & Feelings *' : 'Votre récit en toute liberté *'}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder={isEn ? 'Share what you experienced, the obstacles you faced, the moments of peace you found...' : 'Racontez ce que vous avez traversé, les mots maladroits reçus, le chemin parcouru, ce qui vous a aidé...'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 leading-relaxed focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isEn ? 'A Message of Hope or Compassion for other families (optional)' : 'Un message d\'espérance pour les autres parents (facultatif)'}
                    </label>
                    <input
                      type="text"
                      value={hopeMessage}
                      onChange={(e) => setHopeMessage(e.target.value)}
                      placeholder={isEn ? 'e.g. Your love will always remain sacred.' : 'Ex: Vous n\'êtes pas seuls, la vie refleurira peu à peu.'}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 text-[11px] text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={consentAccepted}
                        onChange={(e) => setConsentAccepted(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 mt-0.5 shrink-0"
                      />
                      <span>
                        {isEn
                          ? 'I authorize Le Jardin de l\'Espoir : Parange to publish my story after moderation to comfort other families.'
                          : 'J\'autorise Le Jardin de l\'Espoir : Parange à publier mon récit après relecture et validation éthique pour apporter du réconfort à d\'autres familles.'}
                      </span>
                    </label>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {isEn ? 'Cancel' : 'Annuler'}
                    </button>

                    <button
                      type="submit"
                      disabled={!consentAccepted || !title.trim() || !story.trim()}
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isEn ? 'Submit My Story Confidentially' : 'Transmettre mon récit avec respect'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
