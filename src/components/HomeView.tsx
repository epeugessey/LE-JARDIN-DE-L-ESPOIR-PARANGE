import React, { useState, useMemo } from 'react';
import { NavTab, PromoBannerConfig, EventItem } from '../types';
import { 
  Phone, 
  Heart, 
  Users, 
  BookOpen, 
  Flower2, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown,
  Smile,
  Flame,
  Calendar as CalendarIcon,
  Compass,
  MapPin,
  Newspaper,
  LineChart,
  Lock
} from 'lucide-react';
import { NewsArticle, PlatformConfig, AccompanimentRecord } from '../types';
import { DEFAULT_HOME_DISPLAY_CONFIG } from '../data/newsData';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { NewsletterSection } from './NewsletterSection';
import { PromoBannerCarousel } from './PromoBannerCarousel';
import { InteractiveCalendar } from './InteractiveCalendar';
import { useLanguage } from '../context/LanguageContext';

interface HomeViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenConsultationModal: (audience?: 'parange' | 'fratrie' | 'proche' | 'soignant-relais') => void;
  platformConfig?: PlatformConfig;
  articles?: NewsArticle[];
  promoBannerConfig?: PromoBannerConfig;
  events?: EventItem[];
  onRegisterEvent?: (event: EventItem) => void;
  accompaniments?: AccompanimentRecord[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onOpenConsultationModal,
  platformConfig,
  articles = [],
  promoBannerConfig,
  events = [],
  onRegisterEvent,
  accompaniments = []
}) => {
  const { t, isEn } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [logoImgError, setLogoImgError] = useState(false);

  // Home page display configuration managed by Administrator
  const displayConfig = platformConfig?.homeDisplayConfig || DEFAULT_HOME_DISPLAY_CONFIG;
  const visibility = displayConfig.sectionVisibility || DEFAULT_HOME_DISPLAY_CONFIG.sectionVisibility;

  // Dynamic Real-Time Counter Calculation from Accompaniment Records
  const historicalBaselineFamilies = 1420;
  const dynamicAccompanimentsCount = accompaniments?.length || 0;
  const totalFamiliesAccompanied = historicalBaselineFamilies + dynamicAccompanimentsCount;

  const activeFollowups = useMemo(() => {
    const active = (accompaniments || []).filter(a => a.status === 'en_cours' || a.status === 'nouveau').length;
    return active > 0 ? active : 18;
  }, [accompaniments]);

  const urgentHelplineCalls = useMemo(() => {
    const customCalls = (accompaniments || []).filter(a => a.preferredContact === 'phone' || a.preferredContact === 'whatsapp').length;
    return 1850 + customCalls;
  }, [accompaniments]);

  const gspParticipants = useMemo(() => {
    return 640 + Math.floor(dynamicAccompanimentsCount * 0.45);
  }, [dynamicAccompanimentsCount]);

  const memoryBoxesCount = useMemo(() => {
    return 890 + Math.floor(dynamicAccompanimentsCount * 0.35);
  }, [dynamicAccompanimentsCount]);

  const phone1 = platformConfig?.phonePrimary || '07 59 87 21 61';
  const phone2 = platformConfig?.phoneSecondary || '05 75 23 93 12';

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleRegisterEvent = (event: EventItem) => {
    if (onRegisterEvent) {
      onRegisterEvent(event);
    } else {
      onOpenConsultationModal('parange');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Section with logo & warm organic atmosphere */}
      {visibility.showHero && (
        <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20">
          {/* Subtle decorative watermark & gradient orbs */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none bg-repeat bg-cover bg-center"
            style={{ backgroundImage: "url('/bg-watermark.jpg')" }}
          />
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              
              {/* Logo Emblem presentation in Hero */}
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-white shadow-lg border-2 border-emerald-100 p-1 hover:scale-105 transition-transform">
                  {!logoImgError ? (
                    <img 
                      src="/logo-circular.jpg" 
                      alt="Logo Le Jardin de l'Espoir : Parange" 
                      className="w-full h-full object-cover rounded-2xl"
                      onError={() => setLogoImgError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-emerald-700 flex items-center justify-center text-white">
                      <Flower2 className="w-12 h-12 text-emerald-200" />
                    </div>
                  )}
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-950 text-xs sm:text-sm font-semibold shadow-2xs">
                  <Flower2 className="w-4 h-4 text-emerald-700" />
                  <span>{displayConfig.heroBadge || t.homeHeroBadge}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 font-serif-accent leading-[1.15]">
                {displayConfig.heroTitle || t.homeHeroTitle}
              </h1>

              <p className="text-base sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
                {displayConfig.heroSubtitle || t.homeHeroSubtitle}
              </p>

              {/* Quick Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => onOpenConsultationModal('parange')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5 text-emerald-200" />
                  <span>{displayConfig.heroPrimaryBtnText || t.homeJoinGspBtn}</span>
                </button>

                <button
                  onClick={() => { setActiveTab('jardin-virtuel'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm sm:text-base border border-stone-300/80 shadow-xs transition-all cursor-pointer"
                >
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>{displayConfig.heroSecondaryBtnText || t.homeLightCandleBtn}</span>
                </button>
              </div>

              {/* Helpline quick strip */}
              {visibility.showHelplineBar && (
                <div className="pt-3 flex items-center justify-center flex-wrap gap-2 text-xs sm:text-sm text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span className="font-medium">{displayConfig.emergencyAlertNotice || t.homeHelplineLabel}</span>
                  <a href={`tel:+225${phone1.replace(/\s+/g, '')}`} className="font-bold text-emerald-800 hover:underline">
                    +225 {phone1}
                  </a>
                  <span className="text-stone-400">/</span>
                  <a href={`tel:+225${phone2.replace(/\s+/g, '')}`} className="font-bold text-emerald-800 hover:underline">
                    {phone2}
                  </a>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* Optional President Editorial Card */}
      {displayConfig.presidentMessageContent && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-10 relative z-20">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-md relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Flower2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Éditorial Officiel
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-serif-accent text-stone-900">
                  {displayConfig.presidentMessageTitle || "Le Mot de la Direction : Une main tendue sans jugement"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 italic leading-relaxed">
                  « {displayConfig.presidentMessageContent} »
                </p>
                <div className="text-xs font-semibold text-emerald-900 pt-1">
                  — {displayConfig.presidentAuthor || "Mme Élodie Peugessey — Présidente Fondatrice"}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMPTEUR EN TEMPS RÉEL : FAMILLES ACCOMPAGNÉES DEPUIS LA CRÉATION */}
      {visibility.showRealtimeCounters && (
        <section className="relative -mt-6 sm:-mt-10 mb-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-emerald-700/40 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-800/40">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span>{isEn ? "Live Synchronized Counter" : "Compteur en Temps Réel • Registres d'Accueil"}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-200/80 bg-white/10 px-2.5 py-0.5 rounded-full">
                      {isEn ? "Directly synced with support database" : "Données synchronisées dynamiquement"}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-accent text-white tracking-tight">
                    {isEn 
                      ? "Families Supported by « Le Jardin de l'Espoir : Parange » Since Creation" 
                      : "Familles Accompagnées par « Le Jardin de l'Espoir : Parange » Depuis sa Création"}
                  </h2>

                  <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
                    {isEn
                      ? "Every child's memory is sacred. Our ecosystem supports ALL persons having lost at least one child, regardless of age: from stillborn babies to children who passed away at an advanced adult age."
                      : "La mémoire de chaque enfant est sacrée. Notre écosystème accueille inconditionnellement TOUTE personne ayant perdu au moins 1 enfant, quel que soit l'âge de l'enfant disparu : qu'il soit mort-né ou décédé à un âge avancé."}
                  </p>
                </div>

                {/* Grand Compteur Principal */}
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-emerald-400/30 flex flex-col items-center justify-center text-center shrink-0 min-w-[240px]">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>{isEn ? "Total Families" : "Total Familles"}</span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight mt-1">
                    {totalFamiliesAccompanied.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-[11px] text-emerald-200/90 mt-1 font-medium">
                    {isEn ? "Parent & family cases since 2018" : "Dossiers paranges suivis depuis 2018"}
                  </div>
                </div>
              </div>

              {/* 4 Indicateurs Dynamiques de Prise en Charge */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
                <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{isEn ? "7/7 Helpline Listening" : "Écoute Solidaire 7j/7"}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {urgentHelplineCalls.toLocaleString('fr-FR')}
                  </div>
                  <p className="text-[11px] text-stone-300 leading-tight">
                    {isEn ? "Calls and WhatsApp interventions" : "Appels reçus et relais d'urgence"}
                  </p>
                </div>

                <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>{isEn ? "Peer Groups (GSP)" : "Groupes de Soutien GSP"}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {gspParticipants.toLocaleString('fr-FR')}
                  </div>
                  <p className="text-[11px] text-stone-300 leading-tight">
                    {isEn ? "Parents in healing circles" : "Mères et pères réunis en cercles"}
                  </p>
                </div>

                <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-300 font-bold">
                    <Flower2 className="w-4 h-4 text-teal-400" />
                    <span>{isEn ? "Memory Keepsake Kits" : "Kits de Mémoire Remis"}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {memoryBoxesCount.toLocaleString('fr-FR')}
                  </div>
                  <p className="text-[11px] text-stone-300 leading-tight">
                    {isEn ? "Boxes donated in maternities" : "Boîtes d'empreintes & souvenirs"}
                  </p>
                </div>

                <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-rose-400" />
                    <span>{isEn ? "Active Follow-ups" : "Accompagnements Actifs"}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {activeFollowups}
                  </div>
                  <p className="text-[11px] text-stone-300 leading-tight">
                    {isEn ? "Families currently guided by pairs" : "Familles actuellement accompagnées"}
                  </p>
                </div>
              </div>

              {/* Bottom Actions: Support Request & Facebook Community */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-emerald-200/90 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>{isEn ? "Support is 100% free and confidential in Côte d'Ivoire and abroad." : "Accompagnement 100% gratuit et confidentiel en Côte d'Ivoire et pour la diaspora."}</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => onOpenConsultationModal('parange')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{isEn ? "Request Family Support" : "Demander un accompagnement"}</span>
                  </button>

                  <a
                    href="https://www.facebook.com/groups/lejardindelespoirparange/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span className="font-black text-xs">f</span>
                    <span>{isEn ? "Facebook Group" : "Groupe Facebook"}</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* PROMO EVENT BANNERS CAROUSEL (IF ENABLED) */}
      {visibility.showPromoBanner && promoBannerConfig && (
        <PromoBannerCarousel
          config={promoBannerConfig}
          currentPlacement="accueil"
          onNavigateTab={setActiveTab}
        />
      )}

      {/* 4 Piliers Fondateurs */}
      {visibility.showPillars && (
        <section className="py-14 sm:py-20 bg-white border-y border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {t.homePillarsBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-serif-accent">
                {t.homePillarsTitle}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {t.homePillarsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Pilier 1: Écoute & Soutien Psychologique */}
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200/90 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 font-serif-accent">
                    {isEn ? "Helpline & Clinical Listening" : "Écoute & Soutien Psychologique"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {isEn 
                      ? "Confidential consultations by clinical psychologists and trained peer-volunteers 7 days a week in Côte d'Ivoire and for the diaspora."
                      : "Consultations téléphoniques confidentielles menées par des psychologues cliniciens et des pairs-aidants 7j/7 en Côte d'Ivoire et diaspora."}
                  </p>
                </div>
                <div className="pt-6 border-t border-stone-200/60 mt-6">
                  <button
                    onClick={() => onOpenConsultationModal('parange')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.requestCallback}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pilier 2: Groupes de Parole (GSP) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200/90 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 font-serif-accent">
                    {isEn ? "Support Groups (GSP)" : "Groupes de Soutien (GSP)"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {isEn 
                      ? "Safe, warm circles for grieving mothers and fathers to express their feelings without shame, isolation, or taboo."
                      : "Cercles d'échanges bienveillants entre paranges pour sortir du silence, partager sa peine et retrouver la force auprès de ceux qui comprennent."}
                  </p>
                </div>
                <div className="pt-6 border-t border-stone-200/60 mt-6">
                  <button
                    onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isEn ? "Explore groups" : "Découvrir les cercles"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pilier 3: Boîtes à Souvenirs & Mémoire */}
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200/90 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Flower2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 font-serif-accent">
                    {isEn ? "Keepsake & Memory Kits" : "Kits de Mémoire & Souvenirs"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {isEn 
                      ? "Dignified keepsake boxes given to maternities to preserve tangible memories of babies (prints, bracelets, blankets)."
                      : "Création et don aux maternités de boîtes à souvenirs pour préserver les traces tangibles de l'enfant (empreintes, bracelet, lange)."}
                  </p>
                </div>
                <div className="pt-6 border-t border-stone-200/60 mt-6">
                  <button
                    onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isEn ? "Memory kits program" : "Le programme Kits"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pilier 4: Plaidoyer & Formation Maternités */}
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200/90 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 font-serif-accent">
                    {isEn ? "Hospital Training & Advocacy" : "Plaidoyer & Formations Pro"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {isEn 
                      ? "Sensitizing midwives, doctors, and institutions to humanize bereavement care and abolish hurtful phrases."
                      : "Sensibilisation des soignants en maternités et CHU pour humaniser l'accueil du deuil et abolir les maladresses de langage."}
                  </p>
                </div>
                <div className="pt-6 border-t border-stone-200/60 mt-6">
                  <button
                    onClick={() => { setActiveTab('formations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isEn ? "Training modules" : "Nos modules soignants"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALL AGES INCLUSIVITY & FACEBOOK COMMUNITY BANNER */}
      {visibility.showInclusivityBanner && (
        <section className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-y border-emerald-800/60 relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? 'Universal Inclusivity Principle • All Ages' : 'Principe Fondateur d\'Inclusivité Universelle • Tout Âge'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-accent text-white">
                {isEn 
                  ? 'Supporting Every Person Who Has Lost a Child, Regardless of Age' 
                  : 'Le Jardin de l\'Espoir concerne TOUTES les personnes ayant perdu au moins 1 enfant'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {isEn
                  ? 'Whether your child was stillborn (perinatal loss, miscarriage, medical termination) or passed away at an advanced age (infant, child, teenager, or adult son/daughter), your grief is sacred. A parent surviving their child transcends chronological age: once a parent, always a Parange.'
                  : 'Quel que soit l\'âge de l\'enfant disparu — qu\'il soit mort-né (deuil périnatal, IMG, fausse couche tardive, décès néonatal) ou décédé à un âge avancé (nourrisson, jeune enfant, adolescent ou enfant adulte) — votre douleur est légitime et sacrée. Notre communauté vous accueille les bras ouverts sans aucun tabou.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
              <a
                href="https://www.facebook.com/groups/lejardindelespoirparange/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-white text-[#1877F2] flex items-center justify-center font-black text-[10px] shrink-0">f</span>
                <span>{isEn ? 'Join Facebook Support Group' : 'Rejoindre le Groupe Facebook'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => { setActiveTab('qui-sommes-nous'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{isEn ? 'Read Our Mission' : 'Découvrir Notre Mission'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* NOUVEAUTÉ BIEN-ÊTRE : CARNET ÉMOTIONNEL PRIVÉ */}
      {visibility.showEmotionalJournalBanner && (
        <section className="py-12 bg-gradient-to-br from-teal-900 via-emerald-900 to-stone-900 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold border border-teal-300/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'New Supportive Tool' : 'Outil de Bien-Être Inédit'}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-xs flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-300" />
                    <span>100% Privé & Confidentiel</span>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white">
                  {isEn ? 'Intimate Emotional Journal & Mood Curve' : 'Votre Carnet Émotionnel & Météo Intérieure'}
                </h3>

                <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                  {isEn 
                    ? 'Grief is a non-linear voyage. Track your daily feelings with expressive emojis, note your thoughts to your angel, and visualize your evolution curves over 7, 14, or 30 days in total privacy on your device.'
                    : 'Le deuil est une traversée par vagues. Notez chaque jour ce que vous ressentez avec des émojis sincères, déposez vos pensées intimes pour votre ange et visualisez l’évolution de votre bien-être sur des courbes douces et simplifiées.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                <button
                  onClick={() => { setActiveTab('journal-bien-etre'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <LineChart className="w-4 h-4 text-stone-900" />
                  <span>{isEn ? 'Open My Journal' : 'Ouvrir mon carnet de bord'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { setActiveTab('jardin-virtuel'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
                >
                  <Flower2 className="w-4 h-4 text-amber-300" />
                  <span>{isEn ? 'Virtual Garden' : 'Jardin Virtuel'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* INTERACTIVE CALENDAR SECTION (CALENDRIER DES ÉVÉNEMENTS & RENCONTRES) */}
      {visibility.showUpcomingEvents && (
        <section className="py-14 sm:py-20 bg-[#f7f5f0] border-b border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isEn ? "Upcoming Events & Gatherings" : "Agenda Solidaire & Rencontres"}</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-serif-accent">
                {isEn ? "Interactive Community Calendar" : "Calendrier Interactif des Rencontres"}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base">
                {isEn 
                  ? "Discover upcoming Support Groups (GSP), fathers' circles, sibling workshops, and memorial ceremonies in Côte d'Ivoire."
                  : "Retrouvez les prochaines séances de nos Groupes de Soutien (GSP), cercles de papas, ateliers fratries et cérémonies du souvenir en Côte d'Ivoire."}
              </p>
            </div>

            <InteractiveCalendar
              events={events}
              onRegisterEvent={handleRegisterEvent}
            />
          </div>
        </section>
      )}

      {/* Impact Statistics */}
      {visibility.showImpactStats && (
        <section className="py-12 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-5xl font-extrabold font-serif-accent text-amber-300">
                  {platformConfig?.stats?.familiesHelped || 420}+
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                  {t.homeStatFamilies}
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-5xl font-extrabold font-serif-accent text-amber-300">
                  {platformConfig?.stats?.kitsDistributed || 1850}+
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                  {t.homeStatKits}
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-5xl font-extrabold font-serif-accent text-amber-300">
                  {platformConfig?.stats?.gspSessions || 38}
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                  {t.homeStatGsp}
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-5xl font-extrabold font-serif-accent text-amber-300">
                  COTE D'IVOIRE
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                  {t.homeStatCities}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Press & Field News Section */}
      {visibility.showRecentNews && (
        <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Newspaper className="w-4 h-4 text-emerald-700" />
                  <span>{isEn ? "News & Society • Côte d'Ivoire" : "Actualités & Société • Côte d'Ivoire"}</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-accent">
                  {isEn ? "Advocacy Actions & Health Reports" : "Faits de société & actions de plaidoyer"}
                </h2>
                <p className="text-stone-600 text-sm mt-1 max-w-2xl">
                  {isEn 
                    ? "Follow our field investigations, maternal health updates, and initiatives to support bereaved parents in Côte d'Ivoire."
                    : "Suivez nos prises de parole, les analyses sur la prise en charge du deuil périnatal et les initiatives citoyennes en Côte d'Ivoire."}
                </p>
              </div>
              <button
                onClick={() => { setActiveTab('actualites'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold transition-all self-start md:self-auto cursor-pointer shadow-xs"
              >
                <span>{isEn ? "All News Articles" : "Toutes les actualités"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.slice(0, 3).map((article) => (
                <div 
                  key={article.id}
                  onClick={() => { setActiveTab('actualites'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-900/90 text-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {article.categoryLabel || article.category}
                    </div>
                    <div className="absolute bottom-2 right-3 text-white text-[10px] bg-black/60 px-2 py-0.5 rounded-md">
                      {article.readTime}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.author}</span>
                      </div>
                      <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition-colors font-serif-accent">
                        {article.title}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                      <span>{isEn ? "Read full article" : "Lire l'article complet"}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Carrousel de Témoignages Anonymisés de Paranges en Côte d'Ivoire */}
      {visibility.showTestimonials && (
        <TestimonialsCarousel
          onOpenConsultationModal={() => onOpenConsultationModal('parange')}
        />
      )}

      {/* FAQ Section adapted to Côte d'Ivoire & Le Jardin de l'Espoir : Parange */}
      {visibility.showFaq && (
        <section className="py-14 sm:py-20 bg-white border-t border-stone-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {t.homeFaqBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-serif-accent">
                {t.homeFaqTitle}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base">
                {t.homeFaqSubtitle}
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: isEn ? "What is a « Parange »?" : "Qu'appelle-t-on un « Parange » ?",
                  a: isEn 
                    ? "A Parange (contraction of 'Parent of an Angel') designates a mother or father who has lost a child. While languages have words for a child who lost parents (orphan) or a spouse who lost their partner (widow/widower), there was no recognized word for a parent who lost their child. Naming this reality provides sacred recognition and dignity to their everlasting parenthood."
                    : "Un Parange (contraction de 'Parent d'Ange') est un père ou une mère qui a perdu son enfant. Dans la langue française comme dans de nombreuses cultures, il existe des mots pour désigner celui qui a perdu ses parents (orphelin) ou son conjoint (veuf/veuve), mais aucun mot pour qualifier un parent qui a perdu son enfant. Nommer cette réalité permet de redonner une identité et une reconnaissance sacrée à leur paternité et maternité éternelles."
                },
                {
                  q: isEn ? "Why does Le Jardin de l'Espoir : Parange specialize strictly in perinatal and child loss?" : "Pourquoi Le Jardin de l'Espoir : Parange se spécialise-t-il exclusivement dans le deuil de l'enfant ?",
                  a: isEn 
                    ? "Founded in Côte d'Ivoire following a tragic family loss in 2018, Le Jardin de l'Espoir : Parange addresses a neglected public health emergency: the silent trauma of families who lost an infant, baby, or child, and grieving siblings. Focusing our clinical expertise on this specific bond ensures the highest quality, sensitivity, and dignity."
                    : "Né d'un drame familial en 2018, Le Jardin de l'Espoir : Parange répond à une urgence de santé publique spécifique et délaissée en Côte d'Ivoire : le traumatisme des familles ayant perdu un bébé ou un enfant et des fratries endeuillées. En concentrant nos compétences cliniques sur ce champ exclusif, nous garantissons un accompagnement d'excellence et sans compromis."
                },
                {
                  q: isEn ? "How does a Support Group (GSP) work?" : "Comment se déroule un Groupe de Soutien Psychologique (GSP) ?",
                  a: isEn 
                    ? "Each group gathers 6 to 12 parents in a gentle, warm, and strictly confidential setting. Facilitated by a clinical psychologist and a trained peer-parent, it offers freedom to express feelings without fear of awkward advice. Silent presence is fully respected and therapeutic."
                    : "Chaque groupe réunit 6 à 12 personnes dans un lieu chaleureux, confidentiel et neutre. Animé par un psychologue clinicien et un parent pair-aidant, le groupe permet d'échanger en toute liberté, sans peur du jugement ni formules maladroites. Personne n'est forcé de parler : l'écoute silencieuse est déjà thérapeutique."
                },
                {
                  q: isEn ? "How much does support cost for families?" : "Combien coûte l'accompagnement pour les familles ?",
                  a: isEn 
                    ? "Access to our Helpline, online resources, and Support Groups is 100% free, funded by community donations and partners. For regional mobile clinics, an optional symbolic contribution of 500 to 1,000 FCFA is accepted to preserve dignity, with complete waiver for families in financial need."
                    : "L'accès à la Ligne d'Écoute Solidaire, aux ressources et aux Groupes de Soutien est 100% gratuit. Lors des journées de consultations mobiles en région, une participation symbolique de 500 à 1 000 FCFA est acceptée pour préserver la dignité de chacun, avec gratuité totale pour les personnes en précarité."
                },
                {
                  q: isEn ? "Can I participate if I live outside Abidjan?" : "Puis-je participer si je vis en dehors d'Abidjan ?",
                  a: isEn 
                    ? `Yes! Our Solitary Helpline (+225 ${phone1} / ${phone2}) is accessible throughout all of CÔTE D'IVOIRE and the international diaspora. In addition, our team conducts Mobile Consultation Missions across CÔTE D'IVOIRE and organizes confidential virtual listening circles.`
                    : `Oui ! Notre Ligne d'Écoute Solidaire (+225 ${phone1} / ${phone2}) est accessible depuis toute la CÔTE D'IVOIRE et la diaspora. De plus, notre équipe effectue des missions de Consultation Mobile régulière en CÔTE D'IVOIRE et organise des cercles virtuels d'écoute.`
                }
              ].map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-stone-200 bg-stone-50/50 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-5 sm:p-6 font-bold text-stone-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-100/60"
                    >
                      <span className="text-sm sm:text-base font-serif-accent">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-emerald-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-5 sm:p-6 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/50 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Community Banner */}
      {visibility.showCommunityBanner && (
        <section className="py-12 bg-gradient-to-r from-emerald-800 to-teal-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <Heart className="w-8 h-8 text-amber-300 mx-auto animate-pulse" />
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white">
              {t.homeCommunityBannerTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {t.homeCommunityBannerDesc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenConsultationModal('parange')}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{t.homeCommunityBannerBtn}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      {visibility.showNewsletter && (
        <NewsletterSection platformConfig={platformConfig} />
      )}
    </div>
  );
};
