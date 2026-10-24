import React, { useState } from 'react';
import { NavTab, PlatformConfig } from '../types';
import { Flower2, Phone, Mail, MapPin, Heart, Shield, ArrowRight, Newspaper, Lock, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenConsultationModal: () => void;
  platformConfig?: PlatformConfig;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenConsultationModal,
  platformConfig,
  onOpenAdminLogin
}) => {
  const { isEn } = useLanguage();
  const [logoImgError, setLogoImgError] = useState(false);
  const phone1 = platformConfig?.phonePrimary || '07 59 87 21 61';
  const phone2 = platformConfig?.phoneSecondary || '05 75 23 93 12';
  const countryNotice = platformConfig?.countryNotice || "Côte d'Ivoire";

  const handleAdminClick = () => {
    if (onOpenAdminLogin) {
      onOpenAdminLogin();
    } else {
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1 & 2: Organization Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-700 text-emerald-100 flex items-center justify-center border border-emerald-500/40 shrink-0">
                {!logoImgError ? (
                  <img 
                    src="/logo-circular.jpg" 
                    alt="Logo Le Jardin de l'Espoir : Parange"
                    className="w-full h-full object-cover"
                    onError={() => setLogoImgError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Flower2 className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-2xl font-bold text-white font-serif-accent block">
                  Le Jardin de l'Espoir : Parange
                </span>
                <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                  {isEn ? 'Support & Remembrance • Côte d\'Ivoire' : 'Soutien & Mémoire • Côte d\'Ivoire'}
                </span>
              </div>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed pr-4">
              {isEn 
                ? 'First sanctuary in Côte d\'Ivoire supporting ALL persons who have lost at least one child, regardless of age — whether stillborn or deceased at an advanced age — as well as perinatal loss and grieving siblings.'
                : 'Premier refuge en Côte d\'Ivoire dédié à TOUTES les personnes ayant perdu au moins un enfant, quel que soit son âge (qu\'il soit mort-né ou décédé à un âge avancé), au deuil périnatal et aux fratries orphelines de leur frère ou sœur.'}
            </p>

            {/* Official Facebook Group Community Card */}
            <div className="p-3.5 rounded-2xl bg-[#1877F2]/15 border border-[#1877F2]/40 text-xs text-blue-100 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1877F2] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  f
                </div>
                <div>
                  <div className="font-bold text-white text-xs">
                    {isEn ? 'Official Facebook Parange Group' : 'Groupe Facebook Officiel des Paranges'}
                  </div>
                  <div className="text-[11px] text-blue-200/80">
                    {isEn ? 'Active mutual support community' : 'Communauté d\'entraide et d\'écoute fraternelle'}
                  </div>
                </div>
              </div>
              <a
                href={platformConfig?.facebookGroupUrl || "https://www.facebook.com/groups/lejardindelespoirparange/"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <span>{isEn ? 'Join Group' : 'Rejoindre'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60 text-xs text-stone-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>{isEn ? 'Specialized clinical scope' : 'Périmètre d\'intervention ciblé'}</span>
              </div>
              <p className="text-stone-400">
                {isEn 
                  ? 'Le Jardin de l\'Espoir : Parange is exclusively dedicated to parental, perinatal, and sibling grief. In accordance with our specialized clinical mission, we do not intervene in divorce, serious illness, or disappearances.'
                  : 'Le Jardin de l\'Espoir : Parange se consacre exclusivement au deuil parental, périnatal et de la fratrie. Conformément à notre mission clinique spécialisée, nous n\'intervenons pas sur les séparations ou divorces, les maladies graves, l\'abandon ou les disparitions.'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
              <span className="inline-block px-2.5 py-1 rounded bg-stone-800 text-stone-300 font-medium">
                {isEn ? 'Ivorian Non-Profit NGO' : 'ONG Ivoirienne à but non lucratif'}
              </span>
              <span className="inline-block px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/50">
                {countryNotice}
              </span>
            </div>
          </div>

          {/* Col 3: Publics & Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {isEn ? 'Our Pillars' : 'Nos Piliers'}
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button 
                  onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  {isEn ? 'Support Groups (GSP)' : 'Groupes de Soutien (GSP)'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  {isEn ? 'Perinatal Grief Support' : 'Soutien Deuil Périnatal'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('temoignages'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Quote className="w-3 h-3 text-amber-400" />
                  <span>{isEn ? 'Bereaved Parents Stories' : 'Récits des Paranges'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  {isEn ? 'Bereaved Siblings' : 'Fratrie Endeuillée'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('formations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  {isEn ? 'Hospital Grief Kit' : 'Kit de Deuil Hospitalier'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('jardin-virtuel'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors text-left text-amber-300 font-medium cursor-pointer"
                >
                  {isEn ? 'Virtual Memorial Garden' : 'Jardin Virtuel de la Mémoire'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('journal-bien-etre'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-teal-400 transition-colors text-left text-teal-300 font-medium cursor-pointer flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-teal-400" />
                  <span>{isEn ? 'Private Emotional Journal' : 'Journal Émotionnel (Privé)'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Actualités & Ressources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {isEn ? 'Knowledge & Dialogue' : 'Espaces & Savoirs'}
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button 
                  onClick={() => { setActiveTab('actualites'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? 'CI News & Press' : 'Actualités CI'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  {isEn ? 'Blog & Clinical Reflections' : 'Blog & Réflexions'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('forum'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  {isEn ? 'Community Forum' : 'Forum d\'Entraide'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('ressources'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  {isEn ? 'Guides & Downloads' : 'Guides & Téléchargements'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('qui-sommes-nous'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  {isEn ? 'Who We Are' : 'Qui sommes-nous ?'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Helpline Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {isEn ? 'Urgent Listening' : 'Écoute d\'Urgence'}
            </h4>
            <div className="p-4 rounded-xl bg-stone-800/90 border border-stone-700/80 space-y-2.5 text-xs">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{isEn ? 'Direct Paranges Helpline' : 'Lignes Directes Paranges'}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300 pl-5">
                  <a href={`tel:+225${phone1.replace(/\s+/g, '')}`} className="hover:underline">
                    +225 {phone1}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300 pl-5">
                  <a href={`tel:+225${phone2.replace(/\s+/g, '')}`} className="hover:underline">
                    +225 {phone2}
                  </a>
                </div>
              </div>
              <p className="text-stone-300">
                {isEn 
                  ? 'Listening available 7/7 from 8am to 8pm. Free, confidential, and fraternal.'
                  : 'Permanence d\'écoute 7j/7 de 8h à 20h. Écoute gratuite, confidentielle et fraternelle.'}
              </p>
              <button
                onClick={onOpenConsultationModal}
                className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {isEn ? 'Request a callback' : 'Demander un rappel'}
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-stone-400 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>{platformConfig?.email || 'contact@lejardindelespoir-ci.org'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>COTE D'IVOIRE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Discreet Admin trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Le Jardin de l'Espoir : Parange Côte d'Ivoire. {isEn ? 'All rights reserved. Dedicated in loving memory of all our little angels.' : 'Tous droits réservés. En hommage à tous nos petits anges.'}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setActiveTab('qui-sommes-nous'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:underline cursor-pointer"
            >
              {isEn ? 'Ethical Charter & Transparency' : 'Charte éthique & Transparence'}
            </button>
            <span>•</span>
            <button 
              onClick={() => { setActiveTab('faire-un-don'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:underline flex items-center gap-1 text-stone-400 cursor-pointer"
            >
              <Heart className="w-3 h-3 text-amber-500 inline" /> {isEn ? 'Sponsor a Parent' : 'Parrainez un Parange'}
            </button>
            <span>•</span>
            
            {/* Masked Admin button: discreet subtle seal logo instead of visible text */}
            <button
              onClick={handleAdminClick}
              className="p-1 rounded-md text-stone-600 hover:text-stone-400 transition-colors opacity-50 hover:opacity-100 cursor-pointer"
              title={isEn ? "Confidential access" : "Accès réservé"}
              aria-label="Accès sécurisé"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
