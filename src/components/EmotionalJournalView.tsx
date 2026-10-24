import React, { useState, useMemo, useEffect } from 'react';
import { 
  Heart, 
  Smile, 
  Sparkles, 
  LineChart, 
  Calendar, 
  Lock, 
  Unlock,
  Download, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Shield, 
  Info, 
  Phone, 
  FileText, 
  Moon, 
  Activity, 
  TrendingUp, 
  Clock, 
  Edit3,
  X,
  ChevronRight,
  BookOpen,
  Palette,
  Sun,
  Star,
  Eye,
  KeyRound,
  UserCheck,
  LogOut,
  Sliders,
  Check
} from 'lucide-react';
import { EmotionalJournalEntry, MoodScore } from '../types';
import { INITIAL_EMOTIONAL_ENTRIES, AVAILABLE_EMOTIONS, MOOD_LEVELS } from '../data/emotionalJournalData';
import { useLanguage } from '../context/LanguageContext';

export type CarnetThemeColor = 'emerald' | 'rose' | 'lavender' | 'amber' | 'night' | 'gold';
export type CarnetMotif = 'angel_wings' | 'lotus' | 'candle' | 'star' | 'heart' | 'dove' | 'tree';

export interface CarnetCustomization {
  themeColor: CarnetThemeColor;
  motif: CarnetMotif;
  title: string;
  dedicatedTo: string;
  personalMotto: string;
}

export interface PrivateEmotionalCarnet {
  carnetId: string; // ID unique de connexion
  passwordHash: string; // Mot de passe / PIN de protection
  createdAt: string;
  customization: CarnetCustomization;
  entries: EmotionalJournalEntry[];
}

const THEME_STYLES: Record<CarnetThemeColor, {
  name: string;
  coverBg: string;
  accentBorder: string;
  goldAccent: string;
  badgeBg: string;
  badgeText: string;
  pageHeaderBg: string;
}> = {
  emerald: {
    name: "Émeraude Apaisant",
    coverBg: "from-emerald-950 via-teal-950 to-stone-950",
    accentBorder: "border-emerald-500/60",
    goldAccent: "text-emerald-300",
    badgeBg: "bg-emerald-500/20",
    badgeText: "text-emerald-300",
    pageHeaderBg: "bg-emerald-900/10"
  },
  rose: {
    name: "Rose Tendresse & Céleste",
    coverBg: "from-rose-950 via-stone-900 to-rose-950",
    accentBorder: "border-rose-400/60",
    goldAccent: "text-rose-300",
    badgeBg: "bg-rose-500/20",
    badgeText: "text-rose-300",
    pageHeaderBg: "bg-rose-900/10"
  },
  lavender: {
    name: "Lavande Sérénité",
    coverBg: "from-purple-950 via-stone-950 to-indigo-950",
    accentBorder: "border-purple-400/60",
    goldAccent: "text-purple-300",
    badgeBg: "bg-purple-500/20",
    badgeText: "text-purple-300",
    pageHeaderBg: "bg-purple-900/10"
  },
  amber: {
    name: "Ambre Réconfortant",
    coverBg: "from-amber-950 via-stone-900 to-amber-950",
    accentBorder: "border-amber-500/60",
    goldAccent: "text-amber-300",
    badgeBg: "bg-amber-500/20",
    badgeText: "text-amber-300",
    pageHeaderBg: "bg-amber-900/10"
  },
  night: {
    name: "Nuit Céleste & Étoilée",
    coverBg: "from-slate-950 via-indigo-950 to-stone-950",
    accentBorder: "border-indigo-400/60",
    goldAccent: "text-cyan-300",
    badgeBg: "bg-indigo-500/20",
    badgeText: "text-cyan-300",
    pageHeaderBg: "bg-indigo-900/10"
  },
  gold: {
    name: "Or Solaire & Lumière",
    coverBg: "from-stone-950 via-amber-950 to-stone-900",
    accentBorder: "border-amber-400/80",
    goldAccent: "text-amber-200",
    badgeBg: "bg-amber-400/20",
    badgeText: "text-amber-200",
    pageHeaderBg: "bg-amber-900/15"
  }
};

const MOTIFS: Record<CarnetMotif, {
  name: string;
  symbol: string;
  icon: string;
  meaning: string;
}> = {
  angel_wings: {
    name: "Ailes d'Ange Gardien",
    symbol: "🪽",
    icon: "Ailes",
    meaning: "Protection sacrée et tendresse éternelle"
  },
  lotus: {
    name: "Fleur de Lotus Éternelle",
    symbol: "🪷",
    icon: "Lotus",
    meaning: "Renaissance de l'âme et pureté"
  },
  candle: {
    name: "Flamme Mémorielle Céleste",
    symbol: "🕯️",
    icon: "Flamme",
    meaning: "Lumière bienveillante qui ne s'éteint jamais"
  },
  star: {
    name: "Étoile Polaire des Paranges",
    symbol: "⭐",
    icon: "Étoile",
    meaning: "Guide scintillant dans les nuits d'angoisse"
  },
  heart: {
    name: "Cœur Protégé & Sacré",
    symbol: "🤍",
    icon: "Cœur",
    meaning: "Amour d'un père et d'une mère sans fin"
  },
  dove: {
    name: "Colombe de Paix & d'Espoir",
    symbol: "🕊️",
    icon: "Colombe",
    meaning: "Messagère de douceur et de sérénité"
  },
  tree: {
    name: "Arbre de Vie & Racines",
    symbol: "🌳",
    icon: "Arbre",
    meaning: "Mémoire enracinée et branches vers le ciel"
  }
};

const SAMPLE_DEMO_CARNET: PrivateEmotionalCarnet = {
  carnetId: 'famille_espoir',
  passwordHash: 'espoir2026',
  createdAt: '2026-01-15',
  customization: {
    themeColor: 'emerald',
    motif: 'angel_wings',
    title: "Mon Sanctuaire de Douceur",
    dedicatedTo: "À notre tout-petit bien-aimé",
    personalMotto: "L'amour ne disparaît jamais, il change simplement de demeure."
  },
  entries: INITIAL_EMOTIONAL_ENTRIES
};

interface EmotionalJournalViewProps {
  onOpenConsultationModal?: () => void;
}

export const EmotionalJournalView: React.FC<EmotionalJournalViewProps> = ({
  onOpenConsultationModal
}) => {
  const { isEn } = useLanguage();

  // Storage of all carnets
  const [allCarnets, setAllCarnets] = useState<Record<string, PrivateEmotionalCarnet>>(() => {
    try {
      const saved = localStorage.getItem('jde_private_carnets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          return {
            ...parsed,
            [SAMPLE_DEMO_CARNET.carnetId]: parsed[SAMPLE_DEMO_CARNET.carnetId] || SAMPLE_DEMO_CARNET
          };
        }
      }
      return { [SAMPLE_DEMO_CARNET.carnetId]: SAMPLE_DEMO_CARNET };
    } catch {
      return { [SAMPLE_DEMO_CARNET.carnetId]: SAMPLE_DEMO_CARNET };
    }
  });

  // Current authenticated carnet
  const [currentCarnetId, setCurrentCarnetId] = useState<string | null>(() => {
    return localStorage.getItem('jde_active_carnet_id') || null;
  });

  // Gateway mode: 'unlock' or 'create'
  const [gatewayMode, setGatewayMode] = useState<'unlock' | 'create'>('unlock');
  
  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Creation form state
  const [newId, setNewId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newTitle, setNewTitle] = useState("Mon Journal de Bord Émotionnel");
  const [newDedicatedTo, setNewDedicatedTo] = useState("");
  const [newThemeColor, setNewThemeColor] = useState<CarnetThemeColor>('emerald');
  const [newMotif, setNewMotif] = useState<CarnetMotif>('angel_wings');
  const [newMotto, setNewMotto] = useState("Un jour à la fois, avec douceur et respect de mon chemin.");
  const [creationError, setCreationError] = useState<string | null>(null);

  // Active view tab once logged in: 'book' (feuilleter), 'write' (nouvelle page), 'graph' (résilience), 'customize' (personnaliser)
  const [activeTab, setActiveTab] = useState<'book' | 'write' | 'graph' | 'customize'>('book');

  // Page index for reading mode
  const [bookPageIndex, setBookPageIndex] = useState(0);

  // Notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Persist all carnets
  const saveCarnetsToStorage = (updated: Record<string, PrivateEmotionalCarnet>) => {
    setAllCarnets(updated);
    try {
      localStorage.setItem('jde_private_carnets', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  // Active carnet reference
  const currentCarnet = useMemo(() => {
    if (!currentCarnetId || !allCarnets[currentCarnetId]) return null;
    return allCarnets[currentCarnetId];
  }, [currentCarnetId, allCarnets]);

  // Handle Login
  const handleUnlockCarnet = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const cleanId = loginId.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanId || !cleanPass) {
      setLoginError("Veuillez renseigner votre Identifiant et votre Mot de passe.");
      return;
    }

    const found = allCarnets[cleanId];
    if (!found || found.passwordHash !== cleanPass) {
      setLoginError("Identifiant ou mot de passe incorrect. Vérifiez vos identifiants secrets.");
      return;
    }

    setCurrentCarnetId(found.carnetId);
    localStorage.setItem('jde_active_carnet_id', found.carnetId);
    showToast(`Bienvenue dans votre carnet « ${found.customization.title} »`);
    setLoginId('');
    setLoginPassword('');
  };

  // Unlock sample demo directly
  const handleUnlockDemo = () => {
    const demo = allCarnets[SAMPLE_DEMO_CARNET.carnetId] || SAMPLE_DEMO_CARNET;
    setCurrentCarnetId(demo.carnetId);
    localStorage.setItem('jde_active_carnet_id', demo.carnetId);
    showToast(`Carnet de démonstration ouvert avec succès.`);
  };

  // Handle Carnet Creation
  const handleCreateCarnet = (e: React.FormEvent) => {
    e.preventDefault();
    setCreationError(null);

    const cleanId = newId.trim().toLowerCase().replace(/\s+/g, '_');
    const cleanPass = newPassword.trim();

    if (!cleanId || cleanId.length < 3) {
      setCreationError("L'identifiant doit comporter au moins 3 caractères.");
      return;
    }

    if (allCarnets[cleanId]) {
      setCreationError("Cet identifiant est déjà utilisé sur cet appareil. Choisissez-en un autre.");
      return;
    }

    if (!cleanPass || cleanPass.length < 4) {
      setCreationError("Le mot de passe / PIN doit comporter au moins 4 caractères.");
      return;
    }

    if (cleanPass !== newPasswordConfirm.trim()) {
      setCreationError("Les mots de passe ne correspondent pas.");
      return;
    }

    const newCarnet: PrivateEmotionalCarnet = {
      carnetId: cleanId,
      passwordHash: cleanPass,
      createdAt: new Date().toISOString().slice(0, 10),
      customization: {
        themeColor: newThemeColor,
        motif: newMotif,
        title: newTitle.trim() || "Mon Carnet Émotionnel",
        dedicatedTo: newDedicatedTo.trim() || "À mon enfant tant aimé",
        personalMotto: newMotto.trim() || "Un jour à la fois, avec douceur."
      },
      entries: INITIAL_EMOTIONAL_ENTRIES
    };

    const updated = {
      ...allCarnets,
      [cleanId]: newCarnet
    };

    saveCarnetsToStorage(updated);
    setCurrentCarnetId(cleanId);
    localStorage.setItem('jde_active_carnet_id', cleanId);
    showToast("Votre Carnet Émotionnel a été créé et scellé avec succès !");
  };

  // Logout / Lock Carnet
  const handleLockCarnet = () => {
    setCurrentCarnetId(null);
    localStorage.removeItem('jde_active_carnet_id');
    showToast("Carnet verrouillé. Vos confidences restent strictement secrètes.");
  };

  // Form State for new entry
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const currentTimeStr = new Date().toTimeString().slice(0, 5);

  const [dateInput, setDateInput] = useState(todayDateStr);
  const [timeInput, setTimeInput] = useState(currentTimeStr);
  const [selectedMood, setSelectedMood] = useState<MoodScore>(3);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['Nostalgie & Manque']);
  const [sleepInput, setSleepInput] = useState<'insomnie' | 'difficile' | 'moyen' | 'paisible'>('moyen');
  const [energyInput, setEnergyInput] = useState<number>(3);
  const [noteInput, setNoteInput] = useState('');
  const [angelMemoryInput, setAngelMemoryInput] = useState('');
  const [gratitudeInput, setGratitudeInput] = useState('');

  const toggleEmotion = (label: string) => {
    if (selectedEmotions.includes(label)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== label));
    } else {
      setSelectedEmotions([...selectedEmotions, label]);
    }
  };

  // Add new entry to current carnet
  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCarnet) return;

    const moodConfig = MOOD_LEVELS.find((m) => m.score === selectedMood) || MOOD_LEVELS[2];

    const newEntry: EmotionalJournalEntry = {
      id: `entry-${Date.now()}`,
      date: dateInput,
      time: timeInput,
      moodScore: selectedMood,
      moodEmoji: moodConfig.emoji,
      moodLabel: moodConfig.label,
      emotions: selectedEmotions.length > 0 ? selectedEmotions : ['Sensibilité'],
      sleepQuality: sleepInput,
      energyLevel: energyInput,
      note: noteInput.trim() || undefined,
      angelMemory: angelMemoryInput.trim() || undefined,
      gratitude: gratitudeInput.trim() || undefined,
      createdAt: `${dateInput} ${timeInput}`
    };

    const updatedEntries = [newEntry, ...currentCarnet.entries];
    updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const updatedCarnet: PrivateEmotionalCarnet = {
      ...currentCarnet,
      entries: updatedEntries
    };

    const updatedAll = {
      ...allCarnets,
      [currentCarnet.carnetId]: updatedCarnet
    };

    saveCarnetsToStorage(updatedAll);
    showToast("Votre page a été ajoutée et gravée dans votre carnet !");
    setNoteInput('');
    setAngelMemoryInput('');
    setGratitudeInput('');
    setActiveTab('book');
    setBookPageIndex(0);
  };

  // Delete entry
  const handleDeleteEntry = (entryId: string) => {
    if (!currentCarnet) return;
    if (window.confirm("Supprimer cette page de votre carnet intime ?")) {
      const updatedEntries = currentCarnet.entries.filter(e => e.id !== entryId);
      const updatedCarnet = { ...currentCarnet, entries: updatedEntries };
      const updatedAll = { ...allCarnets, [currentCarnet.carnetId]: updatedCarnet };
      saveCarnetsToStorage(updatedAll);
      showToast("Page supprimée.");
    }
  };

  // Update Carnet Customization
  const handleSaveCustomization = (custom: CarnetCustomization) => {
    if (!currentCarnet) return;
    const updatedCarnet: PrivateEmotionalCarnet = {
      ...currentCarnet,
      customization: custom
    };
    const updatedAll = {
      ...allCarnets,
      [currentCarnet.carnetId]: updatedCarnet
    };
    saveCarnetsToStorage(updatedAll);
    showToast("Personnalisation de votre carnet enregistrée avec succès !");
    setActiveTab('book');
  };

  // Export carnet content
  const handleExportCarnet = () => {
    if (!currentCarnet) return;
    const theme = THEME_STYLES[currentCarnet.customization.themeColor];
    const motif = MOTIFS[currentCarnet.customization.motif];

    let fullDoc = `========================================================\n`;
    fullDoc += `JOURNAL DE BORD ÉMOTIONNEL - LE JARDIN DE L'ESPOIR : PARANGE\n`;
    fullDoc += `Carnet Privé Sécurisé : ${currentCarnet.customization.title}\n`;
    fullDoc += `Dédié à : ${currentCarnet.customization.dedicatedTo}\n`;
    fullDoc += `Emblème : ${motif.name} (${motif.symbol})\n`;
    fullDoc += `Devise : « ${currentCarnet.customization.personalMotto} »\n`;
    fullDoc += `Identifiant : ${currentCarnet.carnetId} • Créé le : ${currentCarnet.createdAt}\n`;
    fullDoc += `========================================================\n\n`;

    currentCarnet.entries.forEach((e, idx) => {
      fullDoc += `[Page ${idx + 1}] Date : ${e.date} à ${e.time || '--:--'}\n`;
      fullDoc += `Météo Émotionnelle : ${e.moodEmoji} ${e.moodLabel} (${e.moodScore}/5)\n`;
      fullDoc += `Émotions vécues : ${e.emotions.join(', ')}\n`;
      fullDoc += `Sommeil : ${e.sleepQuality || 'N/A'} • Énergie : ${e.energyLevel || 3}/5\n`;
      if (e.note) fullDoc += `Pensée intime : « ${e.note} »\n`;
      if (e.angelMemory) fullDoc += `Souvenir pour l'ange : ${e.angelMemory}\n`;
      if (e.gratitude) fullDoc += `Réconfort / Lueur d'espoir : ${e.gratitude}\n`;
      fullDoc += `--------------------------------------------------------\n\n`;
    });

    const blob = new Blob([fullDoc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Carnet_Emotionnel_${currentCarnet.carnetId}_Le_Jardin_de_l_Espoir.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Votre carnet a été exporté sous format fichier texte sécurisé.");
  };

  // Current theme & motif shortcuts
  const activeTheme = currentCarnet ? THEME_STYLES[currentCarnet.customization.themeColor] : THEME_STYLES.emerald;
  const activeMotif = currentCarnet ? MOTIFS[currentCarnet.customization.motif] : MOTIFS.angel_wings;

  // -------------------------------------------------------------
  // RENDER: GATEWAY SCREEN (IF LOCKED)
  // -------------------------------------------------------------
  if (!currentCarnet) {
    return (
      <div className="min-h-[85vh] bg-[#faf8f5] py-10 px-4 sm:px-6 lg:px-8 animate-in fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header & Inclusivity Message */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold shadow-2xs">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Espace 100% Confidentiel & Sécurisé par ID & Mot de Passe</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif-accent text-stone-900 tracking-tight">
              Mon Carnet Émotionnel Intime
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Un sanctuaire doux et secret où déposer chaque jour vos ressentis, honorer la mémoire sacrée de votre enfant et mesurer le chemin de votre résilience. Vos données sont chiffrées localement et protégées par votre identifiant personnel.
            </p>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg text-sm font-semibold animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-emerald-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mode Tabs: Unlock vs Create */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xl space-y-8">
            <div className="flex p-1.5 bg-stone-100 rounded-2xl max-w-md mx-auto">
              <button
                onClick={() => setGatewayMode('unlock')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  gatewayMode === 'unlock'
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Ouvrir mon Carnet</span>
              </button>
              <button
                onClick={() => setGatewayMode('create')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  gatewayMode === 'create'
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Créer mon Carnet</span>
              </button>
            </div>

            {/* TAB 1: UNLOCK EXISTING CARNET */}
            {gatewayMode === 'unlock' && (
              <form onSubmit={handleUnlockCarnet} className="max-w-md mx-auto space-y-5 animate-in fade-in">
                <div className="text-center space-y-1 pb-2">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center mb-2 shadow-inner">
                    <Lock className="w-8 h-8 text-emerald-700" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 font-serif-accent">
                    Déverrouiller votre sanctuaire
                  </h3>
                  <p className="text-xs text-stone-500">
                    Entrez votre identifiant et votre mot de passe secret pour consulter vos pages.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Identifiant (ID ou Pseudo)
                    </label>
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="Ex: famille_espoir"
                      className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Mot de passe secret / Code PIN
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium bg-stone-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Ouvrir mon Carnet Sécurisé</span>
                </button>

                {/* Quick Demo Option */}
                <div className="pt-4 border-t border-stone-200 text-center space-y-2">
                  <p className="text-xs text-stone-500">
                    Vous souhaitez explorer immédiatement un exemple pré-configuré ?
                  </p>
                  <button
                    type="button"
                    onClick={handleUnlockDemo}
                    className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ★ Ouvrir le carnet modèle de démonstration (ID: famille_espoir)
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: CREATE NEW CUSTOM CARNET */}
            {gatewayMode === 'create' && (
              <form onSubmit={handleCreateCarnet} className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
                <div className="text-center space-y-1 pb-2">
                  <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-800 mx-auto flex items-center justify-center mb-2 shadow-inner">
                    <Sparkles className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-accent">
                    Créer votre Carnet Personnalisé
                  </h3>
                  <p className="text-xs text-stone-500">
                    Choisissez le nom, les couleurs et les dessins de votre carnet intime.
                  </p>
                </div>

                {creationError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{creationError}</span>
                  </div>
                )}

                {/* Section 1: Identifiants de Sécurité */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                  <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-700" />
                    <span>1. Vos Identifiants Secrets (pour vous reconnecter plus tard)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Identifiant / Pseudo unique *
                      </label>
                      <input
                        type="text"
                        required
                        value={newId}
                        onChange={(e) => setNewId(e.target.value)}
                        placeholder="Ex: maman_angeline"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                      />
                      <span className="text-[10px] text-stone-400">Sans espaces (ex: parange_jean)</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Mot de passe secret / Code PIN *
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 4 caractères"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Confirmer le mot de passe *
                      </label>
                      <input
                        type="password"
                        required
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        placeholder="Répétez votre mot de passe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Personnalisation Visuelle (Couleurs & Dessins) */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                  <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-amber-700" />
                    <span>2. Personnalisation de la Couverture & Ambiance</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Titre de votre carnet
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Mon Jardin de Tendresse, Carnet pour Liam..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Dédicace (Prénom de votre ange ou mot personnel)
                    </label>
                    <input
                      type="text"
                      value={newDedicatedTo}
                      onChange={(e) => setNewDedicatedTo(e.target.value)}
                      placeholder="Ex: À notre petit trésor Liam, toujours dans nos cœurs"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  {/* Choix de la Couleur de Reliure */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      Couleur de la Reliure du Carnet :
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(Object.keys(THEME_STYLES) as CarnetThemeColor[]).map((colKey) => {
                        const style = THEME_STYLES[colKey];
                        const isSelected = newThemeColor === colKey;
                        return (
                          <button
                            key={colKey}
                            type="button"
                            onClick={() => setNewThemeColor(colKey)}
                            className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                              isSelected
                                ? 'border-emerald-600 bg-white shadow-sm ring-2 ring-emerald-600/20'
                                : 'border-stone-200 bg-white hover:border-stone-300'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${style.coverBg} border ${style.accentBorder} shrink-0`} />
                            <div className="truncate">
                              <div className="text-[11px] font-bold text-stone-900 truncate">{style.name}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Choix du Motif / Dessin Emblème */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      Dessin / Motif Sacré de Couverture :
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(Object.keys(MOTIFS) as CarnetMotif[]).map((mKey) => {
                        const motif = MOTIFS[mKey];
                        const isSelected = newMotif === mKey;
                        return (
                          <button
                            key={mKey}
                            type="button"
                            onClick={() => setNewMotif(mKey)}
                            className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-2 ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-500/20'
                                : 'border-stone-200 bg-white hover:border-stone-300'
                            }`}
                          >
                            <span className="text-xl shrink-0">{motif.symbol}</span>
                            <div className="overflow-hidden">
                              <div className="text-[11px] font-bold text-stone-900 truncate">{motif.name}</div>
                              <div className="text-[10px] text-stone-500 leading-tight truncate">{motif.meaning}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Devise */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Citation ou pensée apaisante en ex-libris
                    </label>
                    <input
                      type="text"
                      value={newMotto}
                      onChange={(e) => setNewMotto(e.target.value)}
                      placeholder="Ex: Tu es mon étoile dans la nuit"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Créer & Sceller mon Carnet Privé</span>
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: AUTHENTICATED CARNET VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="max-w-6xl mx-auto bg-emerald-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl text-xs sm:text-sm font-semibold animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER: CARNET EMBLEM & ACTION CONTROLS */}
      <div className={`max-w-6xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${activeTheme.coverBg} text-white shadow-2xl border-2 ${activeTheme.accentBorder} relative overflow-hidden`}>
        {/* Subtle decorative motif watermark */}
        <div className="absolute right-4 bottom-2 text-8xl opacity-10 pointer-events-none select-none">
          {activeMotif.symbol}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs border ${activeTheme.accentBorder} flex items-center justify-center text-3xl shadow-inner shrink-0`}>
              {activeMotif.symbol}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-0.5 rounded-full ${activeTheme.badgeBg} ${activeTheme.badgeText} text-xs font-bold border border-white/15`}>
                  ID : {currentCarnet.carnetId} • Sanctuaire Privé
                </span>
                <span className="text-[11px] text-stone-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                  Thème : {activeTheme.name}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white tracking-tight">
                {currentCarnet.customization.title}
              </h1>

              {currentCarnet.customization.dedicatedTo && (
                <p className={`text-xs sm:text-sm ${activeTheme.goldAccent} italic font-medium`}>
                  🕊️ {currentCarnet.customization.dedicatedTo}
                </p>
              )}

              <p className="text-[11px] text-stone-300/80 max-w-xl">
                « {currentCarnet.customization.personalMotto} »
              </p>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportCarnet}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Télécharger mon carnet (texte sauvegardé)"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Exporter mon carnet</span>
            </button>

            <button
              onClick={handleLockCarnet}
              className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Verrouiller et fermer la session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Verrouiller / Quitter</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Inside Carnet */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('book')}
            className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'book'
                ? 'bg-white text-stone-900 shadow-md scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>1. Feuilleter mon Carnet ({currentCarnet.entries.length} pages)</span>
          </button>

          <button
            onClick={() => setActiveTab('write')}
            className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'write'
                ? 'bg-white text-stone-900 shadow-md scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Écrire une Page (Météo du jour)</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'graph'
                ? 'bg-white text-stone-900 shadow-md scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-teal-600" />
            <span>3. Courbe de Résilience</span>
          </button>

          <button
            onClick={() => setActiveTab('customize')}
            className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'customize'
                ? 'bg-white text-stone-900 shadow-md scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-rose-500" />
            <span>4. Customiser mon Carnet (Couleurs & Dessins)</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto">
        
        {/* ========================================================= */}
        {/* TAB 1: FEUILLETER MON CARNET (NOTEBOOK BOOK EXPERIENCE) */}
        {/* ========================================================= */}
        {activeTab === 'book' && (
          <div className="space-y-6 animate-in fade-in">
            {currentCarnet.entries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 shadow-sm space-y-4">
                <div className="text-5xl">{activeMotif.symbol}</div>
                <h3 className="text-xl font-bold text-stone-900 font-serif-accent">
                  Votre carnet attend ses premières confidences
                </h3>
                <p className="text-sm text-stone-500 max-w-md mx-auto">
                  Prenez quelques instants pour noter comment vous vous sentez aujourd'hui. Chaque mot est un pas vers l'apaisement.
                </p>
                <button
                  onClick={() => setActiveTab('write')}
                  className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Écrire ma première page
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Book Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                  <div className="text-xs text-stone-600">
                    Page <strong>{bookPageIndex + 1}</strong> sur <strong>{currentCarnet.entries.length}</strong> • Classées de la plus récente à la plus ancienne
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBookPageIndex(Math.max(0, bookPageIndex - 1))}
                      disabled={bookPageIndex === 0}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      ← Page précédente
                    </button>
                    <button
                      onClick={() => setBookPageIndex(Math.min(currentCarnet.entries.length - 1, bookPageIndex + 1))}
                      disabled={bookPageIndex >= currentCarnet.entries.length - 1}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Page suivante →
                    </button>
                  </div>
                </div>

                {/* RELIURE DE CARNET ÉLÉGANTE (NOTEBOOK PAGE DESIGN) */}
                {(() => {
                  const entry = currentCarnet.entries[bookPageIndex];
                  if (!entry) return null;

                  return (
                    <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-2xl overflow-hidden relative">
                      
                      {/* En-tête de la page avec motif et dorures */}
                      <div className={`p-6 sm:p-8 ${activeTheme.pageHeaderBg} border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{entry.moodEmoji}</span>
                          <div>
                            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-stone-400" />
                              <span>{entry.date} {entry.time && `à ${entry.time}`}</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900 mt-0.5">
                              Météo : {entry.moodLabel} ({entry.moodScore}/5)
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Supprimer cette page"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Corps de la page de carnet */}
                      <div className="p-6 sm:p-10 space-y-6 text-stone-800">
                        
                        {/* Émotions vécues (Chips) */}
                        <div>
                          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                            Émotions & ressentis traversés :
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {entry.emotions.map((em, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200"
                              >
                                {em}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Note intime (Écriture libre) */}
                        {entry.note && (
                          <div className="bg-[#faf8f5] p-6 rounded-2xl border-l-4 border-emerald-600 space-y-2 shadow-2xs">
                            <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                              <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Ce que mon cœur a chuchoté aujourd'hui :</span>
                            </div>
                            <p className="text-sm sm:text-base text-stone-800 leading-relaxed italic font-serif">
                              « {entry.note} »
                            </p>
                          </div>
                        )}

                        {/* Pensée pour l'Ange */}
                        {entry.angelMemory && (
                          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 space-y-1.5">
                            <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🕊️</span>
                              <span>Pensée ou souvenir pour mon enfant :</span>
                            </div>
                            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                              {entry.angelMemory}
                            </p>
                          </div>
                        )}

                        {/* Réconfort / Lueur d'Espoir */}
                        {entry.gratitude && (
                          <div className="bg-teal-50/70 p-5 rounded-2xl border border-teal-200/80 space-y-1.5">
                            <div className="text-[11px] font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🌱</span>
                              <span>Petite lueur d'apaisement ou de force :</span>
                            </div>
                            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                              {entry.gratitude}
                            </p>
                          </div>
                        )}

                        {/* Mètres Sommeil & Énergie */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                            <span className="text-stone-500 font-semibold">Qualité du sommeil :</span>
                            <span className="font-bold text-stone-800 capitalize">{entry.sleepQuality || 'Non renseigné'}</span>
                          </div>
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                            <span className="text-stone-500 font-semibold">Niveau d'énergie :</span>
                            <span className="font-bold text-stone-800">{entry.energyLevel || 3}/5</span>
                          </div>
                        </div>

                      </div>

                      {/* Bas de page avec dorure */}
                      <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400">
                        <span>Le Jardin de l'Espoir : Parange • Carnet Secret</span>
                        <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                          <span>{activeMotif.name}</span>
                          <span>{activeMotif.symbol}</span>
                        </div>
                      </div>

                    </div>
                  );
                })()}

              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: NOUVELLE PAGE / FORMULAIRE D'ÉCRITURE DU JOUR */}
        {/* ========================================================= */}
        {activeTab === 'write' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8 animate-in fade-in">
            <div className="border-b border-stone-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nouvelle Confidence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent text-stone-900">
                Écrire une page dans votre carnet
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Aucun jugement, aucune obligation. Prenez le temps de respirer et déposez ce qui pèse ou ce qui réconforte.
              </p>
            </div>

            <form onSubmit={handleSubmitEntry} className="space-y-6">
              
              {/* Date & Heure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Date de la page
                  </label>
                  <input
                    type="date"
                    required
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium bg-stone-50"
                  />
                </div>
              </div>

              {/* Météo Intérieure (Échelle 1 à 5) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Comment qualifieriez-vous votre météo intérieure en ce moment ?
                </label>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {MOOD_LEVELS.map((m) => {
                    const isSelected = selectedMood === m.score;
                    return (
                      <button
                        key={m.score}
                        type="button"
                        onClick={() => setSelectedMood(m.score as MoodScore)}
                        className={`p-3 sm:p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/60 shadow-md ring-2 ring-emerald-600/30'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl">{m.emoji}</span>
                        <span className="text-[10px] sm:text-xs font-bold text-stone-800 mt-1 leading-tight">{m.label}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{m.score}/5</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Émotions sélectionnables */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Quelles émotions résonnent en vous aujourd'hui ? (Plusieurs choix possibles)
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_EMOTIONS.map((em) => {
                    const isSelected = selectedEmotions.includes(em.label);
                    return (
                      <button
                        key={em.id}
                        type="button"
                        onClick={() => toggleEmotion(em.label)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {isSelected ? `✓ ${em.label}` : em.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note intime libre */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Vos pensées secrètes, vos larmes, vos espoirs (Confidentiel)
                </label>
                <textarea
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Écrivez librement ce que vous traversez aujourd'hui. Ces lignes sont protégées par votre mot de passe et n'appartiennent qu'à vous..."
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
                />
              </div>

              {/* Souvenir pour l'enfant */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🕊️</span>
                  <span>Un souvenir ou un message d'amour pour votre enfant</span>
                </label>
                <input
                  type="text"
                  value={angelMemoryInput}
                  onChange={(e) => setAngelMemoryInput(e.target.value)}
                  placeholder="Ex: J'ai pensé à toi en voyant une fleur ce matin..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
                />
              </div>

              {/* Petite lueur de réconfort */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🌱</span>
                  <span>Une petite lueur de réconfort, un geste doux reçu ou accordé</span>
                </label>
                <input
                  type="text"
                  value={gratitudeInput}
                  onChange={(e) => setGratitudeInput(e.target.value)}
                  placeholder="Ex: Le soutien chaleureux d'une autre maman parange, un thé chaud en paix..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
                />
              </div>

              {/* Sommeil & Énergie */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Qualité du sommeil
                  </label>
                  <select
                    value={sleepInput}
                    onChange={(e: any) => setSleepInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium bg-stone-50"
                  >
                    <option value="paisible">Paisible & Réparateur</option>
                    <option value="moyen">Moyen / Haché</option>
                    <option value="difficile">Difficile / Réveils fréquents</option>
                    <option value="insomnie">Nuit blanche / Insomnie sévère</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Niveau d'énergie physique ({energyInput}/5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={energyInput}
                    onChange={(e) => setEnergyInput(parseInt(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>1 (Épuisé)</span>
                    <span>3 (Modéré)</span>
                    <span>5 (Serein)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('book')}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer dans mon Carnet</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GRAPHIQUE DE RÉSILIENCE */}
        {/* ========================================================= */}
        {activeTab === 'graph' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>Observatoire de Douceur</span>
                </div>
                <h2 className="text-2xl font-bold font-serif-accent text-stone-900">
                  Courbe d'Évolution Émotionnelle
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Le deuil n'est pas linéaire : il est fait de vagues. Observer ces fluctuations vous aide à accueillir chaque étape avec compassion.
                </p>
              </div>
            </div>

            {/* Historique visuel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <div className="font-bold text-emerald-900">Pages Rédigées</div>
                <div className="text-2xl font-black text-emerald-800 mt-1">{currentCarnet.entries.length}</div>
                <div className="text-[11px] text-emerald-700">Moments capturés</div>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                <div className="font-bold text-amber-900">Moyenne Météo Récente</div>
                <div className="text-2xl font-black text-amber-800 mt-1">
                  {(
                    currentCarnet.entries.reduce((acc, curr) => acc + curr.moodScore, 0) /
                    (currentCarnet.entries.length || 1)
                  ).toFixed(1)} / 5
                </div>
                <div className="text-[11px] text-amber-700">Sur l'ensemble des notes</div>
              </div>

              <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200">
                <div className="font-bold text-teal-900">Dernier Moment Noté</div>
                <div className="text-sm font-bold text-teal-800 mt-1">
                  {currentCarnet.entries[0]?.date || 'Aucun'}
                </div>
                <div className="text-[11px] text-teal-700">
                  {currentCarnet.entries[0]?.moodLabel || '--'}
                </div>
              </div>
            </div>

            {/* Liste récapitulative des entrées */}
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Chronologie des 10 dernières météos :
              </h4>
              <div className="divide-y divide-stone-100">
                {currentCarnet.entries.slice(0, 10).map((e) => (
                  <div key={e.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{e.moodEmoji}</span>
                      <div>
                        <div className="font-bold text-stone-800">{e.date} • {e.moodLabel} ({e.moodScore}/5)</div>
                        <div className="text-[11px] text-stone-500">{e.emotions.join(', ')}</div>
                      </div>
                    </div>
                    {e.note && (
                      <span className="text-[11px] text-stone-400 italic max-w-xs truncate hidden sm:block">
                        « {e.note} »
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PERSONNALISER MON CARNET (CUSTOMIZATION) */}
        {/* ========================================================= */}
        {activeTab === 'customize' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8 animate-in fade-in">
            <div className="border-b border-stone-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold mb-2">
                <Palette className="w-3.5 h-3.5 text-rose-600" />
                <span>Atelier de Reliure & Dessins</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent text-stone-900">
                Customiser votre Carnet Intime
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Modifiez la couleur de couverture, l'emblème doré, le titre et la dédicace selon l'évolution de vos souhaits.
              </p>
            </div>

            {/* Customization Form */}
            <div className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Titre du carnet
                </label>
                <input
                  type="text"
                  value={currentCarnet.customization.title}
                  onChange={(e) => {
                    handleSaveCustomization({
                      ...currentCarnet.customization,
                      title: e.target.value
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Dédicace (Enfant ou proche honoré)
                </label>
                <input
                  type="text"
                  value={currentCarnet.customization.dedicatedTo}
                  onChange={(e) => {
                    handleSaveCustomization({
                      ...currentCarnet.customization,
                      dedicatedTo: e.target.value
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Devise / Citation personnelle
                </label>
                <input
                  type="text"
                  value={currentCarnet.customization.personalMotto}
                  onChange={(e) => {
                    handleSaveCustomization({
                      ...currentCarnet.customization,
                      personalMotto: e.target.value
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Sélection des Couleurs */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Couleur de Reliure :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(THEME_STYLES) as CarnetThemeColor[]).map((colKey) => {
                    const style = THEME_STYLES[colKey];
                    const isSelected = currentCarnet.customization.themeColor === colKey;
                    return (
                      <button
                        key={colKey}
                        type="button"
                        onClick={() => {
                          handleSaveCustomization({
                            ...currentCarnet.customization,
                            themeColor: colKey
                          });
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/30 shadow-md ring-2 ring-emerald-600/30'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${style.coverBg} border ${style.accentBorder} shrink-0`} />
                        <div>
                          <div className="text-xs font-bold text-stone-900">{style.name}</div>
                          {isSelected && <span className="text-[10px] text-emerald-700 font-bold">Actif ✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sélection des Motifs / Dessins */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Dessin & Emblème Sacré de Couverture :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(MOTIFS) as CarnetMotif[]).map((mKey) => {
                    const motif = MOTIFS[mKey];
                    const isSelected = currentCarnet.customization.motif === mKey;
                    return (
                      <button
                        key={mKey}
                        type="button"
                        onClick={() => {
                          handleSaveCustomization({
                            ...currentCarnet.customization,
                            motif: mKey
                          });
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/30'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{motif.symbol}</span>
                        <div>
                          <div className="text-xs font-bold text-stone-900">{motif.name}</div>
                          <div className="text-[10px] text-stone-500 leading-tight">{motif.meaning}</div>
                          {isSelected && <span className="text-[10px] text-amber-700 font-bold">Choisi ✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('book')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                >
                  Revenir à la lecture du carnet
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
