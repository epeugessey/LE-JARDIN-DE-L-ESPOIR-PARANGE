import React, { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight, Heart, Sparkles, ShieldCheck, MessageCircleHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ParangeTestimonial {
  id: string;
  author: string;
  location: string;
  babyNameOrContext: string;
  role: string;
  category: 'Groupe GSP' | 'Ligne Solidaire' | 'Papas Paranges' | 'Jardin Virtuel' | 'Maternité';
  quote: string;
  fullStory: string;
  date: string;
  reactionsCount: number;
}

const TESTIMONIALS: ParangeTestimonial[] = [
  {
    id: 'test-1',
    author: 'Awa & Moussa',
    location: 'Abidjan (Cocody)',
    babyNameOrContext: 'Paranges de Liam (mort in utero à 36 SA)',
    role: 'Couple parange',
    category: 'Groupe GSP',
    quote: '« Pour la première fois, nous avons pu prononcer le prénom de notre fils sans voir des regards fuyants. Nous ne sommes plus seuls dans cette nuit. »',
    fullStory: 'Quand nous avons perdu Liam, le silence de notre entourage nous étouffait. On nous répétait avec maladresse "Dieu a donné, Dieu a repris, vous êtes jeunes". Au Jardin de l\'Espoir : Parange, nous avons trouvé un espace où notre douleur a une légitimité absolue. Échanger avec d\'autres couples qui traversent la même tempête a été le premier pas vers la réconciliation avec la vie.',
    date: 'Accompagnés en 2025',
    reactionsCount: 142
  },
  {
    id: 'test-2',
    author: 'Kouamé P.',
    location: 'San-Pédro',
    babyNameOrContext: 'Papa parange d\'Emmanuel (décès néonatal à 3 jours)',
    role: 'Papa parange',
    category: 'Papas Paranges',
    quote: '« En Côte d\'Ivoire, la tradition attend de l\'homme qu\'il ne pleure pas. Le groupe d\'écoute spécial Papas m\'a sauvé de la dépression silencieuse. »',
    fullStory: 'Je devais consoler ma femme, rassurer la belle-famille, organiser les funérailles et retourner au travail comme si rien ne s\'était passé. Mais au fond de moi, j\'étais brisé. Participer aux cercles d\'écoute entre pères au Jardin de l\'Espoir : Parange m\'a permis de poser mes larmes sans honte. Je suis un père endeuillé, et aujourd\'hui je le reconnais avec fierté et amour.',
    date: 'Cercle d\'écoute 2025',
    reactionsCount: 98
  },
  {
    id: 'test-3',
    author: 'Marie-Josée & David',
    location: 'Bouaké',
    babyNameOrContext: 'Paranges de nos jumeaux célestes (fausse couche tardive)',
    role: 'Parents',
    category: 'Jardin Virtuel',
    quote: '« Planter une pensée dans le Jardin Virtuel et recevoir un message bienveillant d\'une autre maman m\'a donné la force de respirer à nouveau. »',
    fullStory: 'Nos bébés n\'ont pas eu d\'existence légale à l\'état civil. C\'était comme s\'ils n\'avaient jamais existé pour le monde. Le Jardin de l\'Espoir : Parange leur a offert une maison éternelle. Allumer une bougie et lire les mots doux de la communauté ivoirienne apaise nos cœurs chaque soir.',
    date: 'Mémorial virtuel',
    reactionsCount: 174
  },
  {
    id: 'test-4',
    author: 'Christelle T.',
    location: 'Abidjan (Yopougon)',
    babyNameOrContext: 'Maman de Grâce (interruption médicale de grossesse)',
    role: 'Maman parange',
    category: 'Ligne Solidaire',
    quote: '« J\'ai appelé la Ligne Solidaire un dimanche soir en pleine crise de sanglots. Une écoute fraternelle sans aucun jugement pendant 45 minutes. »',
    fullStory: 'Après une IMG, le sentiment de culpabilité vous ronge jour et nuit. L\'écoutante du Jardin de l\'Espoir : Parange a simplement écouté, validé mes émotions et m\'a mise en relation avec un psychologue partenaire. Sans cette ligne, je me serais enfoncée dans le noir.',
    date: 'Ligne 07 59 87 21 61',
    reactionsCount: 119
  },
  {
    id: 'test-5',
    author: 'Honorine & Paul K.',
    location: 'Abidjan (Plateau / Deux-Plateaux)',
    babyNameOrContext: 'Paranges de Stéphane (décédé à 24 ans)',
    role: 'Parents d\'un jeune adulte',
    category: 'Groupe GSP',
    quote: '« On pense que le deuil d\'un enfant ne concerne que les bébés. Mais perdre un fils de 24 ans est tout aussi dévastateur. Ici, nous avons trouvé notre place. »',
    fullStory: 'Quand notre fils Stéphane est parti brusquement à 24 ans suite à un accident, notre vie s\'est arrêtée. Les gens nous disaient "Vous avez eu le temps de le connaître". Mais pour des parents, la douleur est la même. Le Jardin de l\'Espoir : Parange accueille tout parent ayant perdu un enfant, quel que soit son âge, du mort-né à l\'adulte. Cette communauté nous a permis de continuer à vivre.',
    date: 'Accompagnement 2025-2026',
    reactionsCount: 186
  },
  {
    id: 'test-6',
    author: 'Fatoumata B.',
    location: 'Yamoussoukro',
    babyNameOrContext: 'Parange d\'Aïcha & maman d\'un enfant "arc-en-ciel"',
    role: 'Pair-aidante',
    category: 'Groupe GSP',
    quote: '« On ne guérit pas d\'un enfant qu\'on a aimé, mais on apprend à faire vivre son amour plutôt que seulement sa perte. »',
    fullStory: 'Après trois ans de cheminement au sein du Jardin de l\'Espoir : Parange, je suis aujourd\'hui devenue marraine pair-aidante. Accueillir une maman qui arrive le regard éteint et la voir retrouver un souffle quelques mois plus tard est la plus belle manière d\'honorer la mémoire de ma fille Aïcha.',
    date: 'Pair-aidance 2026',
    reactionsCount: 208
  }
];

interface TestimonialsCarouselProps {
  onOpenConsultationModal?: () => void;
  title?: string;
  subtitle?: string;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  onOpenConsultationModal,
  title = "Paroles de Paranges : La force du partage fraternel",
  subtitle = "Des témoignages de pères et mères en Côte d'Ivoire ayant perdu un enfant (quel que soit son âge) qui ont trouvé réconfort, écoute et dignité au Jardin de l'Espoir : Parange."
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const timerRef = useRef<any>(null);

  const current = TESTIMONIALS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying]);

  const toggleHeart = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section 
      className="py-16 sm:py-24 bg-gradient-to-b from-[#f8faf7] via-white to-[#faf8f5] relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Soft background aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold shadow-2xs">
            <MessageCircleHeart className="w-3.5 h-3.5 text-emerald-700" />
            <span>Témoignages & Récits de Vie • Côte d'Ivoire</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-accent text-stone-900 tracking-tight">
            {title}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Main Card with AnimatePresence */}
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-200/90 shadow-xl relative min-h-[380px] flex flex-col justify-between">
            
            {/* Top Badge & Quote Icon */}
            <div className="flex items-center justify-between gap-4 mb-6 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {current.category}
                </span>
                <span className="text-xs text-stone-500 hidden sm:inline">
                  {current.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHeart(current.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    likedMap[current.id]
                      ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                  title="Témoigner de votre soutien avec bienveillance"
                >
                  <Heart className={`w-3.5 h-3.5 ${likedMap[current.id] ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                  <span>{current.reactionsCount + (likedMap[current.id] ? 1 : 0)} cœurs</span>
                </button>
              </div>
            </div>

            {/* Quote Body with Animated Transition */}
            <div className="flex-1 flex flex-col justify-center my-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-200 shrink-0 mt-1 rotate-180" />
                    <p className="text-lg sm:text-2xl font-semibold font-serif-accent text-stone-900 leading-snug">
                      {current.quote}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-stone-600 pl-11 sm:pl-13 leading-relaxed">
                    {current.fullStory}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Author Footer */}
            <div className="mt-8 pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                  {current.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                    <span>{current.author}</span>
                    <span className="text-stone-400 text-xs font-normal">• {current.location}</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">
                    {current.babyNameOrContext}
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 transition-colors cursor-pointer border border-stone-200"
                  title="Témoignage précédent"
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 transition-colors cursor-pointer border border-stone-200"
                  title="Témoignage suivant"
                  aria-label="Témoignage suivant"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {TESTIMONIALS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 h-2.5 bg-emerald-700'
                    : 'w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400'
                }`}
                title={`Afficher le témoignage de ${t.author}`}
                aria-label={`Aller au témoignage ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Bottom invitation note */}
        <div className="mt-10 max-w-2xl mx-auto text-center bg-white/70 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-600 text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tous les témoignages sont recueillis avec accord et anonymisés pour préserver l'intimité des familles.</span>
          </div>

          {onOpenConsultationModal && (
            <button
              onClick={onOpenConsultationModal}
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer shrink-0"
            >
              Échanger avec notre équipe
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
