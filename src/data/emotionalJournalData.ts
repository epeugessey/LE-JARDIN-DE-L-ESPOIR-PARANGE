import { EmotionalJournalEntry } from '../types';

export const INITIAL_EMOTIONAL_ENTRIES: EmotionalJournalEntry[] = [
  {
    id: 'entry-001',
    date: '2026-09-05',
    time: '20:15',
    moodScore: 1,
    moodEmoji: '😭',
    moodLabel: 'Douleur intense',
    emotions: ['Douleur vive', 'Larmes', 'Sentiment de vide', 'Solitude'],
    sleepQuality: 'insomnie',
    energyLevel: 1,
    note: 'Une vague immense m\'a submergé en ouvrant l\'armoire ce matin. J\'ai pleuré sans pouvoir m\'arrêter.',
    angelMemory: 'Mon petit ange, ta présence me manque tellement à chaque seconde.',
    createdAt: '2026-09-05 20:15'
  },
  {
    id: 'entry-002',
    date: '2026-09-06',
    time: '21:00',
    moodScore: 2,
    moodEmoji: '😢',
    moodLabel: 'Journée difficile',
    emotions: ['Tristesse', 'Fatigue émotionnelle', 'Nostalgie'],
    sleepQuality: 'difficile',
    energyLevel: 2,
    note: 'Journée lourde et silencieuse. J\'ai allumé une bougie ce soir pour me sentir reliée à toi.',
    angelMemory: 'Une petite flamme qui brille pour toi mon trésor.',
    createdAt: '2026-09-06 21:00'
  },
  {
    id: 'entry-003',
    date: '2026-09-07',
    time: '19:40',
    moodScore: 2,
    moodEmoji: '😢',
    moodLabel: 'Tristesse présente',
    emotions: ['Fatigue émotionnelle', 'Manque', 'Nostalgie'],
    sleepQuality: 'moyen',
    energyLevel: 2,
    note: 'J\'ai écouté les messages vocaux de soutien de mon amie. Ça m\'a fait du bien de ne pas me sentir jugée.',
    gratitude: 'Reconnaissante envers ceux qui osent prononcer ton prénom sans baisser les yeux.',
    createdAt: '2026-09-07 19:40'
  },
  {
    id: 'entry-004',
    date: '2026-09-08',
    time: '20:30',
    moodScore: 3,
    moodEmoji: '😐',
    moodLabel: 'Entre deux eaux',
    emotions: ['Fragile', 'Calme passager', 'Nostalgie'],
    sleepQuality: 'moyen',
    energyLevel: 3,
    note: 'J\'ai pu sortir marcher 20 minutes au bord de la lagune. L\'air frais a apaisé ma gorge nouée.',
    gratitude: 'Le bruit du vent et de l\'eau.',
    createdAt: '2026-09-08 20:30'
  },
  {
    id: 'entry-005',
    date: '2026-09-09',
    time: '21:15',
    moodScore: 3,
    moodEmoji: '😐',
    moodLabel: 'Patience & fragilité',
    emotions: ['Pensée d\'amour', 'Apaisement timide', 'Fatigue'],
    sleepQuality: 'moyen',
    energyLevel: 3,
    note: 'J\'ai lu un témoignage sur Le Jardin de l\'Espoir : Parange. Se savoir comprise par d\'autres mamans aide à respirer.',
    angelMemory: 'Tu vis dans chacun de mes battements de cœur.',
    createdAt: '2026-09-09 21:15'
  },
  {
    id: 'entry-006',
    date: '2026-09-10',
    time: '18:50',
    moodScore: 4,
    moodEmoji: '🌤️',
    moodLabel: 'Éclaircie douce',
    emotions: ['Apaisement', 'Pensée d\'amour', 'Gratitude', 'Espoir timide'],
    sleepQuality: 'paisible',
    energyLevel: 4,
    note: 'Une discussion douce avec mon conjoint ce soir. Nous avons réussi à parler de notre petit avec le sourire au lieu des larmes.',
    gratitude: 'Nos mains serrées sans un mot.',
    angelMemory: 'Ton souvenir devient peu à peu une lumière plutôt qu\'une brûlure.',
    createdAt: '2026-09-10 18:50'
  },
  {
    id: 'entry-007',
    date: '2026-09-11',
    time: '12:30',
    moodScore: 4,
    moodEmoji: '🌤️',
    moodLabel: 'Journée de paix',
    emotions: ['Sérénité', 'Espoir', 'Pensée d\'amour'],
    sleepQuality: 'paisible',
    energyLevel: 4,
    note: 'Je me sens plus forte aujourd\'hui. J\'ai semé une fleur dans le Jardin Virtuel. Un pas vers la lumière.',
    angelMemory: 'À jamais notre ange Rayan.',
    createdAt: '2026-09-11 12:30'
  }
];

export const AVAILABLE_EMOTIONS = [
  { id: 'douleur', label: 'Douleur vive', category: 'difficile' },
  { id: 'tristesse', label: 'Tristesse lourde', category: 'difficile' },
  { id: 'vide', label: 'Sentiment de vide', category: 'difficile' },
  { id: 'solitude', label: 'Solitude / Incompréhension', category: 'difficile' },
  { id: 'culpabilite', label: 'Culpabilité', category: 'difficile' },
  { id: 'colere', label: 'Colère / Injustice', category: 'difficile' },
  { id: 'fatigue', label: 'Épuisement émotionnel', category: 'difficile' },
  { id: 'nostalgie', label: 'Nostalgie & Manque', category: 'neutre' },
  { id: 'fragile', label: 'Vulnérabilité', category: 'neutre' },
  { id: 'calme', label: 'Calme passager', category: 'neutre' },
  { id: 'apaisement', label: 'Apaisement', category: 'positif' },
  { id: 'amour', label: 'Pensée d\'amour infini', category: 'positif' },
  { id: 'gratitude', label: 'Gratitude', category: 'positif' },
  { id: 'espoir', label: 'Éclaircie & Espoir', category: 'positif' },
  { id: 'serenite', label: 'Paix intérieure', category: 'positif' }
];

export const MOOD_LEVELS = [
  {
    score: 1 as const,
    emoji: '😭',
    label: 'Douleur vive',
    desc: 'Le poids est écrasant, larmes continues, besoin d\'un refuge doux.',
    color: '#E11D48', // rose-600
    bgColor: 'bg-rose-50 border-rose-200 text-rose-800'
  },
  {
    score: 2 as const,
    emoji: '😢',
    label: 'Journée grise',
    desc: 'Tristesse pesante, manque profond, énergie basse.',
    color: '#EA580C', // orange-600
    bgColor: 'bg-orange-50 border-orange-200 text-orange-800'
  },
  {
    score: 3 as const,
    emoji: '😐',
    label: 'Entre deux eaux',
    desc: 'Ni tout à fait bien ni effondré(e), on avance un pas après l\'autre.',
    color: '#D97706', // amber-600
    bgColor: 'bg-amber-50 border-amber-200 text-amber-800'
  },
  {
    score: 4 as const,
    emoji: '🌤️',
    label: 'Éclaircie douce',
    desc: 'Une respiration, une pensée apaisée, la mémoire fait du bien.',
    color: '#059669', // emerald-600
    bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-800'
  },
  {
    score: 5 as const,
    emoji: '🕊️',
    label: 'Paix & Espoir',
    desc: 'Sérénité, reconnexion avec soi, la lumière gagne du terrain.',
    color: '#0284C7', // sky-600
    bgColor: 'bg-sky-50 border-sky-200 text-sky-800'
  }
];
