import React, { useState } from 'react';
import { NavTab, PlatformConfig } from '../types';
import { 
  Phone, 
  Heart, 
  Menu, 
  X, 
  Flower2, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Newspaper, 
  Settings, 
  Languages, 
  BookOpen, 
  Search, 
  MessageSquare,
  Users,
  GraduationCap,
  Quote,
  Shield,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenConsultationModal: () => void;
  onOpenSearch?: () => void;
  platformConfig?: PlatformConfig;
  unreadNotificationsCount?: number;
  onOpenAdminLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConsultationModal,
  onOpenSearch,
  platformConfig,
  unreadNotificationsCount = 0,
  onOpenAdminLogin
}) => {
  const { language, setLanguage, t, isEn } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);

  const phone1 = platformConfig?.phonePrimary || '07 59 87 21 61';
  const phone2 = platformConfig?.phoneSecondary || '05 75 23 93 12';

  // Streamlined main bottom navigation items (7 concise tabs that fit cleanly)
  const mainNavItems: { id: NavTab; label: string; highlight?: boolean; icon?: React.ReactNode }[] = [
    { id: 'accueil', label: t.navHome },
    { id: 'actualites', label: t.navNews, icon: <Newspaper className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: 'blog', label: t.navBlog, icon: <BookOpen className="w-3.5 h-3.5 text-teal-600" /> },
    { id: 'temoignages', label: t.navTestimonies || (isEn ? 'Stories' : 'Témoignages'), icon: <Quote className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'forum', label: t.navForum || (isEn ? 'Forum' : 'Forum Paranges'), icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: 'services', label: t.navServices },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (onOpenAdminLogin) {
      onOpenAdminLogin();
    } else {
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
      
      {/* 
        TOP GREEN BANNER:
        - Center: Centered action buttons [Boîte à outils] [Jardin Virtuel] [Formation pro] [Recherche]
        - Right: [Permanence 24/7] [Qui sommes-nous ?] [FR/EN] + Discreet Admin logo
      */}
      <div className="bg-[#1b3b30] text-[#f4f7f4] text-xs px-3 sm:px-6 py-2 border-b border-emerald-950/40">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-y-2.5 gap-x-4">
          
          {/* Left: Country indicator */}
          <div className="hidden xl:flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-200 uppercase tracking-wider text-[10px]">
              {isEn ? "Sanctuary • Côte d'Ivoire" : "Refuge Paranges • Côte d'Ivoire"}
            </span>
          </div>

          {/* CENTER: Centered Tools, Virtual Garden, Pro Training & Search (Requested by user) */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 w-full lg:w-auto">
            {/* Boîte à outils */}
            <button
              onClick={() => handleNavClick('ressources')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'ressources'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border-emerald-700/60'
              }`}
              title={isEn ? "Bereavement Toolbox & Resources" : "Boîte à Outils & Ressources"}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEn ? 'Toolbox' : 'Boîte à outils'}</span>
            </button>

            {/* Jardin Virtuel */}
            <button
              onClick={() => handleNavClick('jardin-virtuel')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
                activeTab === 'jardin-virtuel'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 ring-2 ring-white/40'
                  : 'bg-emerald-900/90 hover:bg-emerald-800 text-amber-200 hover:text-amber-100 border-amber-500/40'
              }`}
              title={isEn ? "Virtual Memorial Garden" : "Jardin Virtuel de la Mémoire"}
            >
              <Flower2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? 'Virtual Garden' : 'Jardin Virtuel'}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </button>

            {/* Journal Émotionnel Privé */}
            <button
              onClick={() => handleNavClick('journal-bien-etre')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
                activeTab === 'journal-bien-etre'
                  ? 'bg-teal-500 text-stone-950 border-teal-400 ring-2 ring-white/40'
                  : 'bg-emerald-900/90 hover:bg-emerald-800 text-teal-200 hover:text-white border-teal-500/40'
              }`}
              title={isEn ? "Private Emotional Well-being Journal" : "Journal de bord émotionnel privé"}
            >
              <Heart className="w-3.5 h-3.5 text-teal-300" />
              <span>{isEn ? 'Mood Journal' : 'Journal Émotionnel'}</span>
              <span className="text-[10px]">🌱</span>
            </button>

            {/* Formation pro */}
            <button
              onClick={() => handleNavClick('formations')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'formations'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border-emerald-700/60'
              }`}
              title={isEn ? "Healthcare Pro & Caregiver Training" : "Formation Soignants & Professionnels"}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isEn ? 'Pro Training' : 'Formation pro'}</span>
            </button>

            {/* Recherche */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
                title={isEn ? "Search the platform (Ctrl+K)" : "Rechercher sur la plateforme (Ctrl+K)"}
              >
                <Search className="w-3 h-3 text-amber-300" />
                <span>{isEn ? 'Search' : 'Recherche'}</span>
              </button>
            )}

            {/* Groupe Facebook Paranges */}
            <a
              href={platformConfig?.facebookGroupUrl || "https://www.facebook.com/groups/lejardindelespoirparange/"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full text-xs font-bold bg-[#1877F2] hover:bg-[#166fe5] text-white border border-blue-400/60 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
              title={isEn ? "Join Official Facebook Support Group" : "Rejoindre le Groupe Facebook des Paranges"}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white text-[#1877F2] flex items-center justify-center font-black text-[9px] shrink-0 leading-none">f</span>
              <span>{isEn ? 'Facebook Group' : 'Groupe Facebook'}</span>
            </a>
          </div>

          {/* RIGHT: Permanence + Qui sommes-nous + Lang + Discreet Admin logo */}
          <div className="flex items-center justify-center sm:justify-end flex-wrap gap-2 text-xs w-full lg:w-auto">
            
            {/* Permanence d'écoute 24/7 */}
            <div className="flex items-center gap-1.5 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-700/60 text-emerald-200 text-[11px]">
              <span className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-300">
                {isEn ? "Helpline 24/7:" : "Permanence 24/7 :"}
              </span>
              <a 
                href={`tel:+225${phone1.replace(/\s+/g, '')}`} 
                className="font-bold text-white hover:text-amber-300 transition-colors flex items-center gap-1"
                title="Appeler la permanence d'urgence"
              >
                <Phone className="w-2.5 h-2.5 text-emerald-400" />
                <span>+225 {phone1}</span>
              </a>
            </div>

            {/* Qui sommes-nous ? */}
            <button
              onClick={() => handleNavClick('qui-sommes-nous')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'qui-sommes-nous'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border-emerald-700/60'
              }`}
              title={isEn ? "About our mission" : "Qui sommes-nous ?"}
            >
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isEn ? 'About Us' : 'Qui sommes-nous ?'}</span>
            </button>

            {/* Language Switcher (FR / EN) */}
            <div className="inline-flex items-center bg-emerald-950 rounded-full p-0.5 border border-emerald-700/60 text-[10px] font-bold">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  language === 'fr' 
                    ? 'bg-emerald-600 text-white shadow-2xs' 
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Français"
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-emerald-600 text-white shadow-2xs' 
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Discreet Admin Logo (Masked behind a discreet seal, no text) */}
            <button
              onClick={handleAdminClick}
              className="w-7 h-7 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-500 hover:text-amber-300 border border-emerald-800/80 hover:border-amber-400/60 flex items-center justify-center transition-all cursor-pointer opacity-70 hover:opacity-100 shadow-2xs"
              title={isEn ? "Internal Portal" : "Espace protégé"}
              aria-label="Accès sécurisé"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      </div>

      {/* 
        MAIN BOTTOM BAR:
        Rassemblé de sorte que tout tienne harmonieusement sur la page sans déborder
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Brand Identity & Logo */}
          <div 
            onClick={() => handleNavClick('accueil')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-emerald-200/50 shrink-0">
              {!logoImgError ? (
                <img 
                  src="/logo-circular.jpg" 
                  alt="Logo Le Jardin de l'Espoir : Parange"
                  className="w-full h-full object-cover"
                  onError={() => setLogoImgError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Flower2 className="w-6 h-6 text-emerald-200" />
              )}
            </div>
            <div>
              <span className="block text-lg sm:text-2xl font-bold tracking-tight text-stone-900 font-serif-accent leading-tight">
                Le Jardin de l'Espoir
              </span>
              <span className="block text-[9px] sm:text-[11px] font-bold text-emerald-800 tracking-wider uppercase">
                {isEn ? "PARANGE • Sanctuary for Bereaved Parents • Côte d'Ivoire" : "PARANGE • Premier refuge pour les Paranges • Côte d'Ivoire"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links: 6 core tabs + 1 CTA 'Faire un don' */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 xl:px-3.5 py-2 text-xs xl:text-sm font-semibold rounded-xl transition-all cursor-pointer relative flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-emerald-950 bg-emerald-100/70 shadow-2xs font-bold'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/80'
                  }`}
                >
                  {item.icon && !isActive && item.icon}
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Direct CTA 'Faire un don' in white banner */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => handleNavClick('faire-un-don')}
              className={`flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer border ${
                activeTab === 'faire-un-don'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 ring-2 ring-amber-400'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-stone-950 border-amber-300 hover:scale-105'
              }`}
              title={isEn ? "Make a donation" : "Faire un don"}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>{isEn ? 'Donate' : 'Faire un don'}</span>
            </button>
          </div>

          {/* Mobile Actions (Donate + Help + Burger toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <button
              onClick={() => handleNavClick('faire-un-don')}
              className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 border border-amber-300 shadow-xs cursor-pointer"
              title={isEn ? "Donate" : "Faire un don"}
            >
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
            </button>

            <button
              onClick={onOpenConsultationModal}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer"
              title="Besoin d'aide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 focus:outline-hidden cursor-pointer"
              aria-label="Menu de navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-stone-900" /> : <Menu className="w-6 h-6 text-stone-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer with complete layout */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          
          {/* Quick CTA row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultationModal();
              }}
              className="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isEn ? 'Need Help?' : "Besoin d'aide"}</span>
            </button>

            <button
              onClick={() => handleNavClick('faire-un-don')}
              className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
              <span>{isEn ? 'Donate' : 'Faire un don'}</span>
            </button>
          </div>

          {/* Primary Nav Links */}
          <div className="space-y-1 pt-2 border-t border-stone-100">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Green banner tools repeated in drawer for mobile convenience */}
          <div className="pt-2 border-t border-stone-100 space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block px-2 pb-1">
              {isEn ? 'Spaces & Tools' : 'Espaces & Outils'}
            </span>
            <button
              onClick={() => handleNavClick('ressources')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'ressources' ? 'bg-emerald-100 text-emerald-950 font-bold' : 'text-stone-600'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>{isEn ? 'Toolbox' : 'Boîte à outils'}</span>
            </button>
            <button
              onClick={() => handleNavClick('jardin-virtuel')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'jardin-virtuel' ? 'bg-amber-100 text-amber-950 font-bold' : 'text-stone-600'
              }`}
            >
              <Flower2 className="w-4 h-4 text-amber-600" />
              <span>{isEn ? 'Virtual Garden' : 'Jardin Virtuel'}</span>
            </button>
            <button
              onClick={() => handleNavClick('journal-bien-etre')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'journal-bien-etre' ? 'bg-teal-100 text-teal-950 font-bold' : 'text-stone-600'
              }`}
            >
              <Heart className="w-4 h-4 text-teal-600" />
              <span>{isEn ? 'Mood Journal' : 'Journal Émotionnel (Privé)'}</span>
            </button>
            <button
              onClick={() => handleNavClick('formations')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'formations' ? 'bg-emerald-100 text-emerald-950 font-bold' : 'text-stone-600'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>{isEn ? 'Pro Training' : 'Formation pro'}</span>
            </button>
            <button
              onClick={() => handleNavClick('qui-sommes-nous')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'qui-sommes-nous' ? 'bg-emerald-100 text-emerald-950 font-bold' : 'text-stone-600'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-700" />
              <span>{isEn ? 'About Us' : 'Qui sommes-nous ?'}</span>
            </button>
            <a
              href={platformConfig?.facebookGroupUrl || "https://www.facebook.com/groups/lejardindelespoirparange/"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20"
            >
              <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-black text-[10px] shrink-0">f</span>
              <span>{isEn ? 'Join Facebook Group' : 'Rejoindre le Groupe Facebook'}</span>
            </a>
          </div>

          {/* Discreet Admin link on mobile */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between px-2 text-xs text-stone-400">
            <span>Le Jardin de l'Espoir : Parange</span>
            <button
              onClick={handleAdminClick}
              className="p-1 text-stone-400 hover:text-stone-600"
              title="Portail interne"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </header>
  );
};
