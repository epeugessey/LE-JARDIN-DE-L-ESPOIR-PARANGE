import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FloatingDonationButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const FloatingDonationButton: React.FC<FloatingDonationButtonProps> = ({
  onClick,
  isActive = false
}) => {
  const { isEn } = useLanguage();

  return (
    <aside aria-label={isEn ? 'Donate button' : 'Bouton Faire un don'}>
      <div 
        id="floating-donation-button-container"
        className="fixed top-[145px] sm:top-[140px] left-3 sm:left-6 lg:left-8 z-[90] pointer-events-auto"
      >
        <button
          id="btn-floating-make-donation"
          onClick={onClick}
          className={`group flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer select-none border-2 ring-2 ring-amber-400/40 backdrop-blur-md ${
            isActive
              ? 'bg-amber-500 text-stone-950 border-amber-400 ring-4 ring-amber-400/80 shadow-amber-500/50 scale-105'
              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-stone-950 border-amber-300 hover:from-amber-300 hover:to-amber-400 hover:scale-105 active:scale-95'
          }`}
          title={isEn ? 'Make a donation - Support a grieving parent' : 'Faire un don - Soutenir un parange'}
        >
          {/* Beating Heart Icon */}
          <div className="relative flex items-center justify-center">
            <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-rose-600 text-rose-600 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
          </div>

          {/* Text labels */}
          <div className="flex flex-col items-start leading-none text-left">
            <span className="font-extrabold font-serif-accent text-stone-950 text-xs sm:text-[13px] whitespace-nowrap">
              {isEn ? 'Donate' : 'Faire un don'}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-medium text-amber-950/80 whitespace-nowrap pt-0.5">
              {isEn ? 'Support a parange' : 'Soutenez un parange'}
            </span>
          </div>

          <Sparkles className="w-3.5 h-3.5 text-amber-900/70 ml-0.5 group-hover:rotate-12 transition-transform hidden xs:block" />
        </button>
      </div>
    </aside>
  );
};
