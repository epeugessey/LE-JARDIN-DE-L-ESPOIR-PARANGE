import { PromoBannerConfig } from '../types';

export const DEFAULT_PROMO_BANNER_CONFIG: PromoBannerConfig = {
  enabled: true,
  displayPlacement: 'accueil',
  autoplayDurationSeconds: 7,
  banners: [
    {
      id: 'banner-1',
      title: 'Caravane Nationale d\'Écoute & Consultations Mobiles 2026',
      subtitle: 'Nos équipes cliniques sillonnent la Côte d\'Ivoire pour offrir des séances d\'écoute gratuites, des groupes de parole et des kits de mémoire.',
      badge: 'Événement Solidaire',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1400&q=80',
      ctaText: 'Découvrir le programme & les étapes',
      ctaActionTab: 'services',
      active: true,
      order: 1,
      bgColor: 'from-stone-950/95 via-stone-900/80 to-emerald-950/70'
    },
    {
      id: 'banner-2',
      title: 'Cérémonie de la Flamme Éternelle & Nuit du Souvenir',
      subtitle: 'Rejoignez notre veillée commémorative en hommage à tous nos petits anges. Allumez une bougie en ligne ou participez en présentiel.',
      badge: 'Hommage Annuel',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=80',
      ctaText: 'Allumer une bougie au Jardin Virtuel',
      ctaActionTab: 'jardin-virtuel',
      active: true,
      order: 2,
      bgColor: 'from-stone-950/95 via-stone-900/85 to-amber-950/70'
    },
    {
      id: 'banner-3',
      title: 'Cycles de Formation Humanisation des Maternités',
      subtitle: 'Nouvelles sessions accréditées pour sages-femmes, obstétriciens et personnels soignants en CHU et maternités ivoiriennes.',
      badge: 'Formation Professionnelle',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=80',
      ctaText: 'Consulter les modules de formation',
      ctaActionTab: 'formations',
      active: true,
      order: 3,
      bgColor: 'from-stone-950/95 via-stone-900/85 to-teal-950/70'
    }
  ]
};
