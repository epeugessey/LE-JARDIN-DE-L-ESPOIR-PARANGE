import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Play, Volume2, VolumeX } from 'lucide-react';
import { PromoBanner, PromoBannerConfig, NavTab } from '../types';

interface PromoBannerCarouselProps {
  config: PromoBannerConfig;
  currentPlacement: 'accueil' | 'header';
  onNavigateTab: (tab: NavTab) => void;
}

export const PromoBannerCarousel: React.FC<PromoBannerCarouselProps> = ({
  config,
  currentPlacement,
  onNavigateTab
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const activeBanners = (config.banners || []).filter((b) => b.active);

  // Check if this placement should render
  const shouldRender =
    config.enabled &&
    activeBanners.length > 0 &&
    (config.displayPlacement === 'all' || config.displayPlacement === currentPlacement);

  // Autoplay timer
  useEffect(() => {
    if (!shouldRender || activeBanners.length <= 1 || isPaused) return;

    const intervalTime = Math.max(3, config.autoplayDurationSeconds || 7) * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [shouldRender, activeBanners.length, isPaused, config.autoplayDurationSeconds]);

  if (!shouldRender || activeBanners.length === 0) return null;

  // Safe index
  const safeIndex = currentIndex >= activeBanners.length ? 0 : currentIndex;
  const currentBanner = activeBanners[safeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleCtaClick = () => {
    if (currentBanner.ctaExternalUrl) {
      window.location.href = currentBanner.ctaExternalUrl;
    } else if (currentBanner.ctaActionTab) {
      onNavigateTab(currentBanner.ctaActionTab);
    }
  };

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-200/50 min-h-[260px] sm:min-h-[320px] md:min-h-[360px] flex items-center bg-stone-900">
        
        {/* Media Background (Image or Video) */}
        {currentBanner.mediaType === 'video' ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              key={currentBanner.mediaUrl}
              src={currentBanner.mediaUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover opacity-60"
            />
            {/* Audio Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/80 transition-all cursor-pointer backdrop-blur-xs"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div 
            key={currentBanner.mediaUrl}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out scale-105"
            style={{ backgroundImage: `url('${currentBanner.mediaUrl}')` }}
          />
        )}

        {/* Dynamic Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.bgColor || 'from-stone-950/95 via-stone-900/80 to-emerald-950/70'} backdrop-blur-[1px]`} />

        {/* Subtle Watermark Logo overlay in carousel */}
        <div 
          className="absolute right-6 -bottom-8 w-64 h-64 bg-no-repeat bg-contain opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('/logo-circular.jpg')" }}
        />

        {/* Carousel Content */}
        <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-3xl space-y-3 sm:space-y-4">
          {currentBanner.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentBanner.badge}</span>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-serif-accent text-white leading-tight drop-shadow-sm">
            {currentBanner.title}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-stone-200 leading-relaxed max-w-2xl drop-shadow-xs">
            {currentBanner.subtitle}
          </p>

          {currentBanner.ctaText && (
            <div className="pt-2 sm:pt-3">
              <button
                onClick={handleCtaClick}
                className="px-6 sm:px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2 group transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{currentBanner.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Left / Right Nav Arrows (if more than 1 banner) */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer border border-white/20 shadow-md"
              aria-label="Bannière précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer border border-white/20 shadow-md"
              aria-label="Bannière suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Dots Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  safeIndex === idx
                    ? 'w-8 h-2.5 bg-amber-400 shadow-sm'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Aller à la diapositive ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
