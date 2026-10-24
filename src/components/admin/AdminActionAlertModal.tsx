import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  Phone, 
  Flame, 
  Heart, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Package, 
  BookOpen, 
  MessageSquare, 
  Clock, 
  MapPin, 
  ExternalLink, 
  X, 
  Sparkles, 
  RefreshCw, 
  Check, 
  XCircle, 
  Quote, 
  CreditCard, 
  ArrowRight, 
  Eye, 
  Activity, 
  Filter,
  FileText,
  Mail,
  HelpCircle,
  TrendingDown,
  Calendar,
  HeartHandshake,
  UserCheck,
  Maximize2,
  Minimize2,
  Search
} from 'lucide-react';
import { 
  AdminNotificationMessage, 
  ParangeTestimony, 
  BlogPost, 
  DonationRecord, 
  GardenFlower, 
  ForumTopic, 
  AccompanimentRecord,
  EmotionalJournalEntry,
  EventRegistration 
} from '../../types';

interface AdminActionAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Data feeds
  notifications?: AdminNotificationMessage[];
  onUpdateNotificationStatus?: (id: string, status: 'unread' | 'read' | 'handled' | 'archived') => void;
  testimonies?: ParangeTestimony[];
  onApproveTestimony?: (id: string) => void;
  onRejectTestimony?: (id: string) => void;
  blogPosts?: BlogPost[];
  onApproveComment?: (postId: string, commentId: string) => void;
  onRejectComment?: (postId: string, commentId: string) => void;
  flowers?: GardenFlower[];
  accompaniments?: AccompanimentRecord[];
  donations?: DonationRecord[];
  forumTopics?: ForumTopic[];
  eventRegistrations?: EventRegistration[];
  onUpdateEventRegistrationStatus?: (id: string, status: EventRegistration['status']) => void;
  // Tab navigation in AdminView
  onNavigateTab?: (tab: 'notifications' | 'testimonies' | 'blog' | 'database' | 'documents_officiels' | 'config' | 'files' | 'evenements' | 'formations' | 'demandes_aides' | 'analytics_dons' | 'faq' | 'banners' | 'backgrounds' | 'articles') => void;
  onParentNavigate?: (tab: any) => void;
}

export const AdminActionAlertModal: React.FC<AdminActionAlertModalProps> = ({
  isOpen,
  onClose,
  notifications = [],
  onUpdateNotificationStatus,
  testimonies = [],
  onApproveTestimony,
  onRejectTestimony,
  blogPosts = [],
  onApproveComment,
  onRejectComment,
  flowers = [],
  accompaniments = [],
  donations = [],
  forumTopics = [],
  eventRegistrations = [],
  onUpdateEventRegistrationStatus,
  onNavigateTab,
  onParentNavigate
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'evenements' | 'urgences_rappels' | 'bougies' | 'approbations' | 'adhesions_gsp' | 'kits_plaidoyer' | 'carnet_bord' | 'inscriptions_dons'
  >('all');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Emotional journal entries read from localStorage
  const [journalEntries, setJournalEntries] = useState<EmotionalJournalEntry[]>([]);
  // Newsletter subscribers from localStorage
  const [subscribers, setSubscribers] = useState<any[]>([]);
  // Event registrations fallback from localStorage
  const [localRegistrations, setLocalRegistrations] = useState<EventRegistration[]>([]);

  // Function to reload localStorage-dependent items
  const reloadLocalData = () => {
    try {
      const savedJournal = localStorage.getItem('jde_emotional_journal');
      if (savedJournal) {
        const parsed = JSON.parse(savedJournal);
        if (Array.isArray(parsed)) setJournalEntries(parsed);
      }
      const savedSubs = localStorage.getItem('jde_newsletter_subscribers');
      if (savedSubs) {
        const parsed = JSON.parse(savedSubs);
        if (Array.isArray(parsed)) setSubscribers(parsed);
      }
      const savedRegs = localStorage.getItem('jde_event_registrations');
      if (savedRegs) {
        const parsed = JSON.parse(savedRegs);
        if (Array.isArray(parsed)) setLocalRegistrations(parsed);
      }
    } catch {
      // ignore
    }
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    reloadLocalData();
    const handleStorage = () => reloadLocalData();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('jde_notifications_updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('jde_notifications_updated', handleStorage);
    };
  }, [isOpen]);

  const showNotificationToast = (msg: string) => {
    setLocalFeedback(msg);
    setTimeout(() => setLocalFeedback(null), 3500);
  };

  // 1. MESSAGES & RAPPELS TELEPHONIQUES & URGENCES
  const urgentNotifications = useMemo(() => {
    return (notifications || []).filter(n => n && (n.status === 'unread' || n.status === ('read' as any)));
  }, [notifications]);

  const explicitPhoneCallbacks = useMemo(() => {
    return urgentNotifications.filter(n => n.type === 'rappel' || n.type === 'ecoute_urgente' || n.urgencyLevel === 'critique');
  }, [urgentNotifications]);

  const chatAndGeneralMessages = useMemo(() => {
    return urgentNotifications.filter(n => n.type === 'chat_direct' || n.type === 'contact_general' || n.type === 'feedback');
  }, [urgentNotifications]);

  // 2. BOUGIES ALLUMÉES RÉCEMMENT DANS LE JARDIN VIRTUEL
  const flowersWithCandles = useMemo(() => {
    const list = Array.isArray(flowers) ? flowers : [];
    return list.filter(f => (f.candlesCount || 0) > 0 || f.userLitCandle);
  }, [flowers]);

  const totalCandlesCount = useMemo(() => {
    const list = Array.isArray(flowers) ? flowers : [];
    return list.reduce((acc, f) => acc + (f.candlesCount || 0), 0);
  }, [flowers]);

  // 3. APPROBATIONS REQUISES (Témoignages, Commentaires Blog, Forum)
  const pendingTestimonies = useMemo(() => {
    return (testimonies || []).filter(t => t && t.status === 'en_attente');
  }, [testimonies]);

  const pendingComments = useMemo(() => {
    return (blogPosts || []).flatMap(p => 
      (p.comments || []).filter(c => c.status === 'pending').map(c => ({ ...c, postTitle: p.title, postId: p.id }))
    );
  }, [blogPosts]);

  const pendingForumTopics = useMemo(() => {
    return (forumTopics || []).filter(topic => topic && topic.status === 'pending');
  }, [forumTopics]);

  const pendingApprovalsCount = pendingTestimonies.length + pendingComments.length + pendingForumTopics.length;

  // 4. ADHÉSIONS GROUPES DE SOUTIEN (GSP) & INSCRIPTIONS
  const gspAccompaniments = useMemo(() => {
    return (accompaniments || []).filter(a => {
      if (!a) return false;
      const s = (a.serviceRequested || '').toLowerCase();
      return s.includes('gsp') || s.includes('groupe de soutien') || s.includes('groupe de parole') || s.includes('parole');
    });
  }, [accompaniments]);

  // 5. KITS MÉMOIRE OU PLAIDOYER
  const memoryKitsAccompaniments = useMemo(() => {
    return (accompaniments || []).filter(a => {
      if (!a) return false;
      const s = (a.serviceRequested || '').toLowerCase();
      const notes = (a.notes || '').toLowerCase();
      const situation = (a.situationType || '').toLowerCase();
      return s.includes('kit') || s.includes('mémoire') || s.includes('plaidoyer') || s.includes('sensibilisation') || s.includes('maternité') ||
             notes.includes('kit') || situation.includes('kit');
    });
  }, [accompaniments]);

  // 6. TOUTES DEMANDES D'AIDES GÉNÉRALES
  const generalHelpRequests = useMemo(() => {
    return (accompaniments || []).filter(a => {
      if (!a) return false;
      const s = (a.serviceRequested || '').toLowerCase();
      return !s.includes('gsp') && !s.includes('kit') && !s.includes('plaidoyer');
    });
  }, [accompaniments]);

  // 7. NOUVELLES INFOS SUR LE CARNET DE BORD D'UN MEMBRE (Scores faibles / Détresse)
  const highDistressJournalEntries = useMemo(() => {
    return (journalEntries || []).filter(entry => {
      // Mood score 1 or 2 represents acute distress or deep sorrow
      return entry && (entry.moodScore <= 2 || (entry.emotions && entry.emotions.some(e => e.toLowerCase().includes('angoisse') || e.toLowerCase().includes('détresse') || e.toLowerCase().includes('vide'))));
    });
  }, [journalEntries]);

  // 8. DONS EN ATTENTE
  const pendingDonations = useMemo(() => {
    return (donations || []).filter(d => d && d.status === 'en_attente');
  }, [donations]);

  // 9. INSCRIPTIONS AUX ÉVÉNEMENTS
  const allRegistrations = useMemo(() => {
    if (eventRegistrations && eventRegistrations.length > 0) return eventRegistrations;
    return localRegistrations;
  }, [eventRegistrations, localRegistrations]);

  const pendingEventRegistrations = useMemo(() => {
    return allRegistrations.filter(r => r.status === 'en_attente');
  }, [allRegistrations]);

  const handleConfirmRegistration = (regId: string) => {
    if (onUpdateEventRegistrationStatus) {
      onUpdateEventRegistrationStatus(regId, 'confirme');
    } else {
      // Local fallback
      try {
        const saved = localStorage.getItem('jde_event_registrations');
        const list: EventRegistration[] = saved ? JSON.parse(saved) : [];
        const updated = list.map(r => r.id === regId ? { ...r, status: 'confirme' as const } : r);
        localStorage.setItem('jde_event_registrations', JSON.stringify(updated));
        setLocalRegistrations(updated);
        window.dispatchEvent(new Event('jde_notifications_updated'));
      } catch (err) {
        console.error(err);
      }
    }
    showNotificationToast("Inscription confirmée avec succès !");
  };

  // TOTAL ACTIONS REQUISES
  const totalActionableCount = 
    urgentNotifications.length + 
    pendingApprovalsCount + 
    pendingEventRegistrations.length +
    gspAccompaniments.filter(a => a.status === 'en_attente').length + 
    memoryKitsAccompaniments.filter(a => a.status === 'en_attente').length + 
    generalHelpRequests.filter(a => a.status === 'en_attente').length + 
    pendingDonations.length +
    highDistressJournalEntries.length;

  if (!isOpen) return null;

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50 p-0 bg-stone-950/95' : 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-stone-950/85 backdrop-blur-xs'} overflow-y-auto animate-in fade-in`}>
      <div 
        className={`relative ${isFullScreen ? 'w-full h-full max-w-none max-h-none rounded-none' : 'w-[98vw] max-w-7xl max-h-[96vh] h-[95vh] rounded-3xl'} bg-white shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP ALERT BANNER / COCKPIT HEADER */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white relative shrink-0">
          <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isFullScreen ? "Réduire l'affichage" : "Afficher en très grand (Plein écran)"}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fermer la bulle d'alerte"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pr-20">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shadow-lg shrink-0 font-bold">
                  <Bell className="w-7 h-7 animate-bounce" />
                </div>
                {totalActionableCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white border-2 border-stone-900 animate-pulse">
                    {totalActionableCount}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-amber-400" />
                    Bulle d'Alerte & Cockpit Administrateur • Grand Format
                  </span>
                  <span className="text-xs text-stone-400">
                    Connecté • Veille active 24/7 en Côte d'Ivoire
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                  Synthèse des Actions & Requêtes en Direct
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-3xl leading-relaxed">
                  Voici l'ensemble des nouveaux messages, bougies allumées, rappels d'urgence demandés, adhésions aux Groupes de Soutien (GSP), kits mémoire, alertes du carnet de bord et contenus nécessitant votre approbation.
                </p>
              </div>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={reloadLocalData}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Rafraîchir les données en direct"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualiser</span>
              </button>
            </div>
          </div>

          {/* KEY METRICS SUMMARY STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-6 pt-5 border-t border-white/10 text-xs">
            <div 
              onClick={() => setActiveCategory('urgences_rappels')}
              className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                activeCategory === 'urgences_rappels' ? 'bg-rose-500/30 border border-rose-400/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1 text-rose-300 font-bold text-[11px]">
                <Phone className="w-3 h-3" />
                <span>Rappels & Urgences</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {explicitPhoneCallbacks.length + chatAndGeneralMessages.length}
              </div>
            </div>

            <div 
              onClick={() => setActiveCategory('bougies')}
              className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                activeCategory === 'bougies' ? 'bg-amber-500/30 border border-amber-400/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Bougies Allumées</span>
              </div>
              <div className="text-lg font-black text-amber-300 mt-0.5">
                {totalCandlesCount} <span className="text-[10px] text-stone-400 font-normal">({flowersWithCandles.length} fleurs)</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveCategory('approbations')}
              className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                activeCategory === 'approbations' ? 'bg-indigo-500/30 border border-indigo-400/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1 text-indigo-300 font-bold text-[11px]">
                <ShieldAlert className="w-3 h-3" />
                <span>À Approuver</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {pendingApprovalsCount}
              </div>
            </div>

            <div 
              onClick={() => setActiveCategory('adhesions_gsp')}
              className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                activeCategory === 'adhesions_gsp' ? 'bg-teal-500/30 border border-teal-400/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1 text-teal-300 font-bold text-[11px]">
                <Users className="w-3 h-3" />
                <span>Adhésions GSP</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {gspAccompaniments.length}
              </div>
            </div>

            <div 
              onClick={() => setActiveCategory('kits_plaidoyer')}
              className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                activeCategory === 'kits_plaidoyer' ? 'bg-emerald-500/30 border border-emerald-400/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1 text-emerald-300 font-bold text-[11px]">
                <Package className="w-3 h-3" />
                <span>Kits & Plaidoyers</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {memoryKitsAccompaniments.length}
              </div>
            </div>

            <div 
              onClick={() => setActiveCategory('evenements')}
              className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                activeCategory === 'evenements' ? 'bg-amber-500/30 border border-amber-400/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Événements & Rencontres</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5 flex items-center gap-1.5">
                <span>{allRegistrations.length}</span>
                {pendingEventRegistrations.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 font-black animate-pulse">
                    {pendingEventRegistrations.length} à valider
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveCategory('carnet_bord')}
              className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                activeCategory === 'carnet_bord' ? 'bg-pink-500/30 border border-pink-400/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1 text-pink-300 font-bold text-[11px]">
                <BookOpen className="w-3 h-3" />
                <span>Carnet de Bord</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {highDistressJournalEntries.length} <span className="text-[10px] text-pink-300 font-normal">détresse</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveCategory('inscriptions_dons')}
              className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                activeCategory === 'inscriptions_dons' ? 'bg-emerald-500/30 border border-emerald-400/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1 text-emerald-300 font-bold text-[11px]">
                <CreditCard className="w-3 h-3" />
                <span>Dons & Inscriptions</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {pendingDonations.length + subscribers.length}
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK TOAST */}
        {localFeedback && (
          <div className="bg-emerald-700 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{localFeedback}</span>
            </div>
            <button onClick={() => setLocalFeedback(null)} className="text-emerald-200 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CATEGORY FILTER TABS */}
        <div className="flex items-center gap-1.5 px-6 py-3 bg-stone-100/80 border-b border-stone-200 overflow-x-auto shrink-0 text-xs">
          {[
            { id: 'all', label: 'Toutes les Actions', count: totalActionableCount },
            { id: 'evenements', label: 'Événements & Inscriptions', count: pendingEventRegistrations.length },
            { id: 'urgences_rappels', label: 'Urgences & Rappels', count: explicitPhoneCallbacks.length + chatAndGeneralMessages.length },
            { id: 'bougies', label: 'Bougies Allumées', count: totalCandlesCount },
            { id: 'approbations', label: 'À Approuver', count: pendingApprovalsCount },
            { id: 'adhesions_gsp', label: 'Adhésions GSP', count: gspAccompaniments.length },
            { id: 'kits_plaidoyer', label: 'Kits & Plaidoyers', count: memoryKitsAccompaniments.length },
            { id: 'carnet_bord', label: 'Carnet de Bord', count: highDistressJournalEntries.length },
            { id: 'inscriptions_dons', label: 'Dons & Inscriptions', count: pendingDonations.length }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-stone-900 text-amber-300 shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeCategory === cat.id ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* MAIN BODY: SCROLLABLE ACTION LIST */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-stone-50/50">

          {/* 0. NOUVELLES INSCRIPTIONS AUX ÉVÉNEMENTS (DEMANDÉ EXPLICITEMENT PAR L'ADMINISTRATEUR) */}
          {(activeCategory === 'all' || activeCategory === 'evenements') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Inscriptions aux Événements & Rencontres ({pendingEventRegistrations.length} en attente / {allRegistrations.length} au total)</span>
                </h3>
                {onNavigateTab && (
                  <button 
                    onClick={() => { onClose(); onNavigateTab('evenements'); }}
                    className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Page Gestion des Événements</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {allRegistrations.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                  <Calendar className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
                  Aucune inscription pour le moment. Dès qu'un membre ou parange s'inscrit, la notification s'affichera immédiatement ici.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allRegistrations.map((reg) => {
                    const cleanPhone = (reg.phone || '').replace(/[^0-9+]/g, '');
                    const isPending = reg.status === 'en_attente';
                    return (
                      <div 
                        key={reg.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isPending 
                            ? 'bg-amber-50/90 border-amber-300 shadow-xs ring-1 ring-amber-400/30' 
                            : 'bg-white border-stone-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-stone-900">{reg.fullName}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 capitalize">
                                {reg.userRole?.replace('-', ' ')}
                              </span>
                              {isPending ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 animate-pulse">
                                  Nouvelle inscription
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  Confirmé
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-amber-900 font-semibold mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-700 shrink-0" />
                              <span className="line-clamp-1">{reg.eventTitle}</span>
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2 flex-wrap">
                              <span>📅 {reg.eventDate} ({reg.eventTime || 'Heure à confirmer'})</span>
                              {reg.eventLocation && <span>• 📍 {reg.eventLocation}</span>}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-black px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-800">
                              {reg.numberOfPeople} place{reg.numberOfPeople > 1 ? 's' : ''}
                            </span>
                            <div className="text-[10px] text-stone-400 mt-1">{reg.registeredAt}</div>
                          </div>
                        </div>

                        {reg.notes && (
                          <div className="mt-2 text-xs text-stone-700 bg-white/80 p-2.5 rounded-xl border border-stone-200/60 line-clamp-2 italic">
                            « {reg.notes} »
                          </div>
                        )}

                        <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5">
                            {cleanPhone && (
                              <>
                                <a
                                  href={`tel:${cleanPhone}`}
                                  className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                                  title="Appeler directement"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Bonjour ${reg.fullName}, Le Jardin de l'Espoir : Parange confirme la bonne réception de votre inscription pour : ${reg.eventTitle}.`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isPending && (
                              <button
                                onClick={() => handleConfirmRegistration(reg.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              >
                                <Check className="w-3 h-3" />
                                <span>Valider la place</span>
                              </button>
                            )}
                            {onNavigateTab && (
                              <button
                                onClick={() => { onClose(); onNavigateTab('evenements'); }}
                                className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Gérer cet événement et la liste complète des participants"
                              >
                                <span>Gérer</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 1. URGENCES & RAPPELS TÉLÉPHONIQUES */}
          {(activeCategory === 'all' || activeCategory === 'urgences_rappels') && (explicitPhoneCallbacks.length > 0 || chatAndGeneralMessages.length > 0) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-rose-600" />
                  <span>Demandes de Rappel Téléphonique & Messages d'Écoute ({explicitPhoneCallbacks.length + chatAndGeneralMessages.length})</span>
                </h3>
                {onNavigateTab && (
                  <button 
                    onClick={() => { onClose(); onNavigateTab('notifications'); }}
                    className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ouvrir onglet Notifications</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...explicitPhoneCallbacks, ...chatAndGeneralMessages].map((n) => (
                  <div 
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      n.urgencyLevel === 'critique'
                        ? 'bg-rose-50/80 border-rose-300 shadow-xs ring-1 ring-rose-400/30'
                        : 'bg-white border-stone-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-stone-900 text-sm">{n.senderName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            n.urgencyLevel === 'critique' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-white'
                          }`}>
                            {n.urgencyLevel === 'critique' ? 'Critique / Immédiat' : 'Priorité Haute'}
                          </span>
                          {n.senderCity && (
                            <span className="text-[11px] text-stone-500 flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" />
                              {n.senderCity}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-stone-700 mt-1 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-800 font-mono font-bold">{n.senderPhone}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(n.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 mt-2.5 bg-stone-50/80 p-2.5 rounded-xl border border-stone-100 line-clamp-3">
                      « {n.message} »
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-stone-100 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <a 
                          href={`tel:${n.senderPhone.replace(/\s+/g, '')}`}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Rappeler</span>
                        </a>
                        <a 
                          href={`https://wa.me/${n.senderPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-colors"
                        >
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      {onUpdateNotificationStatus && (
                        <button
                          onClick={() => {
                            onUpdateNotificationStatus(n.id, 'handled');
                            showNotificationToast(`La demande de rappel de ${n.senderName} a été marquée comme traitée.`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Marquer traité</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. BOUGIES ALLUMÉES & HOMMAGES DANS LE JARDIN VIRTUEL */}
          {(activeCategory === 'all' || activeCategory === 'bougies') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Bougies de Solidarité Allumées & Hommages des Paranges ({totalCandlesCount} bougies)</span>
                </h3>
                {onParentNavigate && (
                  <button 
                    onClick={() => { onClose(); onParentNavigate('jardin-virtuel'); }}
                    className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir dans le Jardin Virtuel</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {flowersWithCandles.slice(0, 6).map((flower) => (
                  <div key={flower.id} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-2xs"
                          style={{ backgroundColor: flower.flowerColor || '#F59E0B' }}
                        >
                          <Flame className="w-4 h-4 text-white animate-pulse" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">{flower.authorName}</div>
                          <div className="text-[10px] text-amber-800 font-medium">{flower.relationship}</div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {flower.candlesCount} bougie{flower.candlesCount > 1 ? 's' : ''}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 italic bg-white p-2.5 rounded-xl border border-amber-100 line-clamp-2">
                      « {flower.message} »
                    </p>

                    <div className="text-[10px] text-stone-400 text-right">
                      Déposé le {flower.date || 'Récemment'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. APPROBATIONS REQUISES (Témoignages, Commentaires Blog) */}
          {(activeCategory === 'all' || activeCategory === 'approbations') && pendingApprovalsCount > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  <span>Actions & Contenus Soumis Nécessitant Approbation ({pendingApprovalsCount})</span>
                </h3>
              </div>

              {/* Pending testimonies */}
              {pendingTestimonies.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-amber-600" />
                    <span>Témoignages de Paranges en Attente de Validation ({pendingTestimonies.length})</span>
                  </div>

                  <div className="space-y-2.5">
                    {pendingTestimonies.map((t) => (
                      <div key={t.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/90 shadow-2xs">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <span className="text-xs font-bold text-stone-900">{t.authorName}</span>
                            {t.childName && (
                              <span className="text-xs text-amber-800 font-semibold ml-2">
                                (En mémoire de {t.childName})
                              </span>
                            )}
                            <div className="text-xs text-stone-500">{t.city} • Rôle: {t.authorRoleLabel || t.authorRole}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {onApproveTestimony && (
                              <button
                                onClick={() => {
                                  onApproveTestimony(t.id);
                                  showNotificationToast(`Témoignage de ${t.authorName} approuvé avec succès.`);
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approuver</span>
                              </button>
                            )}

                            {onRejectTestimony && (
                              <button
                                onClick={() => {
                                  onRejectTestimony(t.id);
                                  showNotificationToast(`Témoignage de ${t.authorName} rejeté.`);
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-200 hover:bg-rose-100 text-stone-700 hover:text-rose-800 flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Rejeter</span>
                              </button>
                            )}

                            {onNavigateTab && (
                              <button
                                onClick={() => { onClose(); onNavigateTab('testimonies'); }}
                                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-white transition-colors cursor-pointer"
                                title="Voir dans l'onglet Témoignages"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-stone-700 mt-2 bg-white p-3 rounded-xl border border-stone-200 line-clamp-2">
                          « {t.story} »
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending comments */}
              {pendingComments.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Commentaires sous Articles de Blog en Attente ({pendingComments.length})</span>
                  </div>

                  <div className="space-y-2.5">
                    {pendingComments.map((c) => (
                      <div key={c.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-xs font-bold text-stone-900">{c.authorName}</span>
                            <span className="text-xs text-stone-400 ml-2">sur l'article :</span>
                            <div className="text-xs font-semibold text-emerald-900">{c.postTitle}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {onApproveComment && (
                              <button
                                onClick={() => {
                                  onApproveComment(c.postId, c.id);
                                  showNotificationToast(`Commentaire de ${c.authorName} approuvé.`);
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approuver</span>
                              </button>
                            )}
                            {onRejectComment && (
                              <button
                                onClick={() => {
                                  onRejectComment(c.postId, c.id);
                                  showNotificationToast(`Commentaire rejeté.`);
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-200 hover:bg-rose-100 text-stone-700 hover:text-rose-800 flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Rejeter</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-stone-700 mt-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                          « {c.content} »
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. ADHÉSIONS GROUPES DE SOUTIEN (GSP) */}
          {(activeCategory === 'all' || activeCategory === 'adhesions_gsp') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>Nouvelles Adhésions & Inscriptions aux Groupes de Soutien Psychologique (GSP) ({gspAccompaniments.length})</span>
                </h3>
                {onNavigateTab && (
                  <button 
                    onClick={() => { onClose(); onNavigateTab('database'); }}
                    className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir dans Base de données</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gspAccompaniments.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-white border border-teal-200/80 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                          <span>{req.fullName}</span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                            {req.userRole}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">{req.city} • Tél: {req.phone}</div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'en_attente' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {req.status === 'en_attente' ? 'En attente' : 'Pris en charge'}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-teal-900 bg-teal-50/60 p-2 rounded-xl border border-teal-100">
                      Demande : {req.serviceRequested} ({req.situationType})
                    </div>

                    {req.notes && (
                      <p className="text-xs text-stone-600 italic">« {req.notes} »</p>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${req.phone.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Contacter pour intégration</span>
                      </a>
                      <a
                        href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-colors"
                      >
                        <span>WhatsApp GSP</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. KITS MÉMOIRE OU PLAIDOYER */}
          {(activeCategory === 'all' || activeCategory === 'kits_plaidoyer') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>Demandes de Kits Mémoire Maternités & Actions de Plaidoyer ({memoryKitsAccompaniments.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {memoryKitsAccompaniments.map((kit) => (
                  <div key={kit.id} className="p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-stone-900">{kit.fullName}</div>
                        <div className="text-xs text-stone-500">{kit.city} • Tél: {kit.phone}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {kit.serviceRequested}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                      {kit.notes || `Demande de kit de mémoire (empreintes d'argile, livret d'adieu, lange d'hommage) ou action de plaidoyer pour maternité.`}
                    </p>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                      <span className="text-[11px] text-stone-400">Demandé le {kit.requestDate}</span>
                      <a
                        href={`tel:${kit.phone.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1"
                      >
                        <Package className="w-3 h-3" />
                        <span>Organiser l'expédition du Kit</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. NOUVELLE INFO SUR LE CARNET DE BORD D'UN MEMBRE */}
          {(activeCategory === 'all' || activeCategory === 'carnet_bord') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-pink-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-pink-600" />
                  <span>Veille Bienveillante sur le Carnet de Bord des Membres ({highDistressJournalEntries.length} alertes détresse)</span>
                </h3>
                {onParentNavigate && (
                  <button 
                    onClick={() => { onClose(); onParentNavigate('journal-bien-etre'); }}
                    className="text-xs font-semibold text-pink-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Consulter le carnet de bord</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {highDistressJournalEntries.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                  <Heart className="w-6 h-6 text-pink-400 mx-auto mb-1.5" />
                  Aucune détresse aiguë détectée sur les carnets récents. La veille émotionnelle se poursuit en continu.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {highDistressJournalEntries.map((entry) => (
                    <div key={entry.id} className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{entry.moodEmoji}</span>
                          <div>
                            <div className="text-xs font-bold text-rose-950">{entry.moodLabel}</div>
                            <div className="text-[10px] text-stone-500">{entry.date} {entry.time ? `à ${entry.time}` : ''}</div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          Détresse Élevée
                        </span>
                      </div>

                      {entry.emotions && entry.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {entry.emotions.map((em, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-medium">
                              {em}
                            </span>
                          ))}
                        </div>
                      )}

                      {entry.note && (
                        <p className="text-xs text-stone-700 bg-white p-2.5 rounded-xl border border-rose-100 line-clamp-3">
                          « {entry.note} »
                        </p>
                      )}

                      <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-stone-500">Veille clinique recommandée</span>
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-500" />
                          Soutien psychologique mobilisable
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7. DONS & INSCRIPTIONS */}
          {(activeCategory === 'all' || activeCategory === 'inscriptions_dons') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Dons Solidaires en Attente & Nouvelles Inscriptions ({pendingDonations.length} dons en attente, {subscribers.length} abonnés)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingDonations.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-stone-900">{d.donorName}</div>
                        <div className="text-xs text-stone-500">{d.donorPhone} • {d.paymentMethod?.toUpperCase()}</div>
                      </div>
                      <span className="text-sm font-black text-emerald-700">
                        {d.amount.toLocaleString()} {d.currency}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 bg-stone-50 p-2 rounded-xl">
                      Affectation : {d.purpose}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                      <span className="text-[10px] text-stone-400">Date : {d.date}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        À vérifier sur Wave / Orange / MTN
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Toutes les actions sont enregistrées en temps réel et synchronisées avec votre console de direction.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Compris, passer au tableau de bord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
