import React, { useState, useRef, useMemo, useEffect } from 'react';
import { NavTab, NewsArticle, PlatformConfig, UploadedDocument, BlogPost, BlogComment, AdminNotificationMessage, PromoBannerConfig, PageBackgroundConfig, EventItem, EventRegistration } from '../types';
import { 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Edit3, 
  Trash2, 
  Save, 
  Plus, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Eye, 
  Download, 
  Sparkles, 
  RefreshCw, 
  FolderOpen, 
  BookOpen, 
  Check, 
  XCircle, 
  Clock, 
  MessageSquare, 
  ThumbsUp, 
  Bell, 
  Palette, 
  Quote, 
  Database, 
  FileSpreadsheet,
  Calendar, 
  TrendingUp, 
  HelpCircle,
  GraduationCap,
  HeartHandshake,
  LayoutTemplate
} from 'lucide-react';
import { AdminNotificationsManager } from './admin/AdminNotificationsManager';
import { AdminPromoBannersManager } from './admin/AdminPromoBannersManager';
import { AdminPageBackgroundsManager } from './admin/AdminPageBackgroundsManager';
import { AdminTestimoniesManager } from './admin/AdminTestimoniesManager';
import { AdminDatabaseExportManager } from './admin/AdminDatabaseExportManager';
import { AdminOfficialDocumentsManager } from './admin/AdminOfficialDocumentsManager';
import { AdminActionAlertModal } from './admin/AdminActionAlertModal';
import { AdminEventsManager } from './admin/AdminEventsManager';
import { AdminDonationAnalytics } from './admin/AdminDonationAnalytics';
import { AdminTrainingsManager } from './admin/AdminTrainingsManager';
import { AdminHelpRequestsManager } from './admin/AdminHelpRequestsManager';
import { AdminHomeDisplayManager } from './admin/AdminHomeDisplayManager';
import { DynamicFaqSection } from './DynamicFaqSection';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_PLATFORM_CONFIG } from '../data/newsData';
import { DEFAULT_PROMO_BANNER_CONFIG } from '../data/promoBanners';
import { DEFAULT_PAGE_BACKGROUNDS } from '../data/defaultBackgrounds';
import { INITIAL_DONATIONS } from '../data/donationsData';
import { INITIAL_ACCOMPANIMENT_REQUESTS } from '../data/accompanimentData';
import { INITIAL_FLOWERS } from '../data/mockData';
import { INITIAL_CALENDAR_EVENTS, INITIAL_EVENT_REGISTRATIONS } from '../data/calendarEvents';
import { INITIAL_TRAINING_REGISTRATIONS } from '../data/trainingsData';
import { ParangeTestimony, DonationRecord, GardenFlower, ForumTopic, AccompanimentRecord, TrainingRegistrationRequest } from '../types';

interface AdminViewProps {
  platformConfig?: PlatformConfig;
  onUpdatePlatformConfig?: (newConfig: PlatformConfig) => void;
  onUpdateConfig?: (newConfig: PlatformConfig) => void;
  articles?: NewsArticle[];
  onAddArticle?: (article: NewsArticle) => void;
  onDeleteArticle?: (id: string) => void;
  uploadedDocuments?: UploadedDocument[];
  documents?: UploadedDocument[];
  onAddDocument?: (doc: UploadedDocument) => void;
  onDeleteDocument?: (id: string) => void;
  setActiveTab?: (tab: NavTab) => void;
  blogPosts?: BlogPost[];
  onAddBlogPost?: (post: BlogPost) => void;
  onApproveComment?: (postId: string, commentId: string) => void;
  onRejectComment?: (postId: string, commentId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  notifications?: AdminNotificationMessage[];
  onUpdateNotificationStatus?: (id: string, status: 'unread' | 'read' | 'handled' | 'archived') => void;
  onDeleteNotification?: (id: string) => void;
  onAddTestNotification?: () => void;
  promoBannerConfig?: PromoBannerConfig;
  onUpdatePromoBannerConfig?: (config: PromoBannerConfig) => void;
  onUpdatePageBackgrounds?: (backgrounds: PageBackgroundConfig) => void;
  testimonies?: ParangeTestimony[];
  onApproveTestimony?: (id: string) => void;
  onRejectTestimony?: (id: string) => void;
  onDeleteTestimony?: (id: string) => void;
  onAddTestimony?: (testimony: ParangeTestimony) => void;
  donations?: DonationRecord[];
  flowers?: GardenFlower[];
  forumTopics?: ForumTopic[];
  accompaniments?: AccompanimentRecord[];
  events?: EventItem[];
  onAddEvent?: (event: EventItem) => void;
  onUpdateEvent?: (event: EventItem) => void;
  onDeleteEvent?: (id: string) => void;
  eventRegistrations?: EventRegistration[];
  onAddEventRegistration?: (reg: EventRegistration) => void;
  onUpdateEventRegistrationStatus?: (id: string, status: EventRegistration['status']) => void;
  onDeleteEventRegistration?: (id: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  platformConfig = DEFAULT_PLATFORM_CONFIG,
  onUpdatePlatformConfig,
  onUpdateConfig,
  articles = [],
  onAddArticle = (_article: NewsArticle) => {},
  onDeleteArticle = (_id: string) => {},
  uploadedDocuments,
  documents,
  onAddDocument = (_doc: UploadedDocument) => {},
  onDeleteDocument = (_id: string) => {},
  setActiveTab: setParentActiveTab,
  blogPosts = [],
  onAddBlogPost = (_post: BlogPost) => {},
  onApproveComment = (_postId: string, _commentId: string) => {},
  onRejectComment = (_postId: string, _commentId: string) => {},
  onDeleteComment = (_postId: string, _commentId: string) => {},
  notifications = [],
  onUpdateNotificationStatus = (_id: string, _status: any) => {},
  onDeleteNotification = (_id: string) => {},
  onAddTestNotification,
  promoBannerConfig = DEFAULT_PROMO_BANNER_CONFIG,
  onUpdatePromoBannerConfig = (_cfg: PromoBannerConfig) => {},
  onUpdatePageBackgrounds = (_bg: PageBackgroundConfig) => {},
  testimonies = [],
  onApproveTestimony = (_id: string) => {},
  onRejectTestimony = (_id: string) => {},
  onDeleteTestimony = (_id: string) => {},
  onAddTestimony = (_testimony: ParangeTestimony) => {},
  donations: incomingDonations,
  flowers: incomingFlowers,
  forumTopics: incomingForumTopics,
  accompaniments: incomingAccompaniments,
  events: incomingEvents,
  onAddEvent = (_evt: EventItem) => {},
  onUpdateEvent = (_evt: EventItem) => {},
  onDeleteEvent = (_id: string) => {},
  eventRegistrations: incomingRegistrations,
  onAddEventRegistration = (_reg: EventRegistration) => {},
  onUpdateEventRegistrationStatus = (_id: string, _st: any) => {},
  onDeleteEventRegistration = (_id: string) => {}
}) => {
  const { isEn } = useLanguage();
  const actualDocuments = uploadedDocuments || documents || [];
  const handleUpdate = onUpdatePlatformConfig || onUpdateConfig || (() => {});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('jde_admin_auth') === 'true' || localStorage.getItem('jde_admin_session_auth') === 'true';
  });
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'notifications' | 'evenements' | 'analytics_dons' | 'formations' | 'demandes_aides' | 'faq' | 'database' | 'documents_officiels' | 'banners' | 'backgrounds' | 'files' | 'articles' | 'blog' | 'testimonies' | 'config' | 'affichage_accueil'>('notifications');
  const [commentFilter, setCommentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Local state for auto-synchronized calendar events and registrations
  const [localEvents, setLocalEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('jde_calendar_events');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : (incomingEvents || INITIAL_CALENDAR_EVENTS);
    } catch {
      return incomingEvents || INITIAL_CALENDAR_EVENTS;
    }
  });

  const [localRegistrations, setLocalRegistrations] = useState<EventRegistration[]>(() => {
    try {
      const saved = localStorage.getItem('jde_event_registrations');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : (incomingRegistrations || INITIAL_EVENT_REGISTRATIONS);
    } catch {
      return incomingRegistrations || INITIAL_EVENT_REGISTRATIONS;
    }
  });

  // Local state for training registrations
  const [localTrainings, setLocalTrainings] = useState<TrainingRegistrationRequest[]>(() => {
    try {
      const saved = localStorage.getItem('jde_training_registrations');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TRAINING_REGISTRATIONS;
    } catch {
      return INITIAL_TRAINING_REGISTRATIONS;
    }
  });

  // Local state for accompaniments / help requests
  const [localAccompaniments, setLocalAccompaniments] = useState<AccompanimentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('jde_accompaniment_requests');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : (incomingAccompaniments || INITIAL_ACCOMPANIMENT_REQUESTS);
    } catch {
      return incomingAccompaniments || INITIAL_ACCOMPANIMENT_REQUESTS;
    }
  });

  // Automated Real-time Synchronization (Storage listener + 3-second auto-poll)
  // Ensures admin never misses any distress call, event registration, message, training or help request
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedEvts = localStorage.getItem('jde_calendar_events');
        if (savedEvts) {
          const parsed = JSON.parse(savedEvts);
          if (Array.isArray(parsed)) setLocalEvents(parsed);
        }
        const savedRegs = localStorage.getItem('jde_event_registrations');
        if (savedRegs) {
          const parsed = JSON.parse(savedRegs);
          if (Array.isArray(parsed)) setLocalRegistrations(parsed);
        }
        const savedTrainings = localStorage.getItem('jde_training_registrations');
        if (savedTrainings) {
          const parsed = JSON.parse(savedTrainings);
          if (Array.isArray(parsed)) setLocalTrainings(parsed);
        }
        const savedAccompaniments = localStorage.getItem('jde_accompaniment_requests');
        if (savedAccompaniments) {
          const parsed = JSON.parse(savedAccompaniments);
          if (Array.isArray(parsed)) setLocalAccompaniments(parsed);
        }
      } catch (e) {
        console.warn('Auto-sync error in AdminView', e);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('jde_notifications_updated', handleSync);
    window.addEventListener('jde_events_updated', handleSync);
    window.addEventListener('jde_event_registrations_updated', handleSync);
    window.addEventListener('jde_trainings_updated', handleSync);
    window.addEventListener('jde_accompaniments_updated', handleSync);
    window.addEventListener('jde_testimonies_updated', handleSync);
    window.addEventListener('jde_forum_updated', handleSync);

    const intervalId = setInterval(handleSync, 3000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('jde_notifications_updated', handleSync);
      window.removeEventListener('jde_events_updated', handleSync);
      window.removeEventListener('jde_event_registrations_updated', handleSync);
      window.removeEventListener('jde_trainings_updated', handleSync);
      window.removeEventListener('jde_accompaniments_updated', handleSync);
      window.removeEventListener('jde_testimonies_updated', handleSync);
      window.removeEventListener('jde_forum_updated', handleSync);
      clearInterval(intervalId);
    };
  }, []);

  const actualEvents = incomingEvents && incomingEvents.length > 0 ? incomingEvents : localEvents;
  const actualEventRegistrations = incomingRegistrations && incomingRegistrations.length > 0 ? incomingRegistrations : localRegistrations;
  const actualTrainings = localTrainings;
  const actualAccompaniments = incomingAccompaniments && incomingAccompaniments.length > 0 ? incomingAccompaniments : localAccompaniments;

  // Handlers with localStorage persistence + cross-component event dispatching
  const handleAddEvent = (event: EventItem) => {
    const updated = [event, ...actualEvents];
    setLocalEvents(updated);
    try {
      localStorage.setItem('jde_calendar_events', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_events_updated'));
    } catch (e) {
      console.warn('Could not save events', e);
    }
    onAddEvent(event);
  };

  const handleUpdateEvent = (event: EventItem) => {
    const updated = actualEvents.map(e => e.id === event.id ? event : e);
    setLocalEvents(updated);
    try {
      localStorage.setItem('jde_calendar_events', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_events_updated'));
    } catch (e) {
      console.warn('Could not save events', e);
    }
    onUpdateEvent(event);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = actualEvents.filter(e => e.id !== id);
    setLocalEvents(updated);
    try {
      localStorage.setItem('jde_calendar_events', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_events_updated'));
    } catch (e) {
      console.warn('Could not save events', e);
    }
    onDeleteEvent(id);
  };

  const handleAddRegistration = (reg: EventRegistration) => {
    const updated = [reg, ...actualEventRegistrations];
    setLocalRegistrations(updated);
    try {
      localStorage.setItem('jde_event_registrations', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_event_registrations_updated'));
    } catch (e) {
      console.warn('Could not save registrations', e);
    }
    onAddEventRegistration(reg);
  };

  const handleUpdateRegistrationStatus = (id: string, status: EventRegistration['status']) => {
    const updated = actualEventRegistrations.map(r => r.id === id ? { ...r, status } : r);
    setLocalRegistrations(updated);
    try {
      localStorage.setItem('jde_event_registrations', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_event_registrations_updated'));
    } catch (e) {
      console.warn('Could not save registrations', e);
    }
    onUpdateEventRegistrationStatus(id, status);
  };

  const handleDeleteRegistration = (id: string) => {
    const updated = actualEventRegistrations.filter(r => r.id !== id);
    setLocalRegistrations(updated);
    try {
      localStorage.setItem('jde_event_registrations', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_event_registrations_updated'));
    } catch (e) {
      console.warn('Could not save registrations', e);
    }
    onDeleteEventRegistration(id);
  };

  // Training handlers
  const handleAddTraining = (training: TrainingRegistrationRequest) => {
    const updated = [training, ...actualTrainings];
    setLocalTrainings(updated);
    try {
      localStorage.setItem('jde_training_registrations', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_trainings_updated'));
    } catch (e) {
      console.warn('Could not save trainings', e);
    }
  };

  const handleUpdateTrainingStatus = (id: string, status: TrainingRegistrationRequest['status']) => {
    const updated = actualTrainings.map(t => t.id === id ? { ...t, status } : t);
    setLocalTrainings(updated);
    try {
      localStorage.setItem('jde_training_registrations', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_trainings_updated'));
    } catch (e) {
      console.warn('Could not save trainings', e);
    }
  };

  const handleUpdateTrainingNotes = (id: string, notes: string) => {
    const updated = actualTrainings.map(t => t.id === id ? { ...t, notes } : t);
    setLocalTrainings(updated);
    try {
      localStorage.setItem('jde_training_registrations', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_trainings_updated'));
    } catch (e) {
      console.warn('Could not save trainings', e);
    }
  };

  const handleDeleteTraining = (id: string) => {
    const updated = actualTrainings.filter(t => t.id !== id);
    setLocalTrainings(updated);
    try {
      localStorage.setItem('jde_training_registrations', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_trainings_updated'));
    } catch (e) {
      console.warn('Could not save trainings', e);
    }
  };

  // Accompaniment / Help requests handlers
  const handleAddAccompaniment = (record: AccompanimentRecord) => {
    const updated = [record, ...actualAccompaniments];
    setLocalAccompaniments(updated);
    try {
      localStorage.setItem('jde_accompaniment_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_accompaniments_updated'));
    } catch (e) {
      console.warn('Could not save accompaniments', e);
    }
  };

  const handleUpdateAccompanimentStatus = (id: string, status: AccompanimentRecord['status']) => {
    const updated = actualAccompaniments.map(a => a.id === id ? { ...a, status } : a);
    setLocalAccompaniments(updated);
    try {
      localStorage.setItem('jde_accompaniment_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_accompaniments_updated'));
    } catch (e) {
      console.warn('Could not save accompaniments', e);
    }
  };

  const handleUpdateAccompanimentUrgency = (id: string, urgency: 'critique' | 'haute' | 'normale' | 'faible') => {
    const updated = actualAccompaniments.map(a => a.id === id ? { ...a, urgency, urgencyLevel: (urgency === 'faible' ? 'normale' : urgency) as any } : a);
    setLocalAccompaniments(updated);
    try {
      localStorage.setItem('jde_accompaniment_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_accompaniments_updated'));
    } catch (e) {
      console.warn('Could not save accompaniments', e);
    }
  };

  const handleAssignAccompanimentReferent = (id: string, referentName: string) => {
    const updated = actualAccompaniments.map(a => a.id === id ? { ...a, assignedReferent: referentName, assignedVolunteer: referentName } : a);
    setLocalAccompaniments(updated);
    try {
      localStorage.setItem('jde_accompaniment_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_accompaniments_updated'));
    } catch (e) {
      console.warn('Could not save accompaniments', e);
    }
  };

  const handleUpdateAccompanimentNotes = (id: string, notes: string) => {
    const updated = actualAccompaniments.map(a => a.id === id ? { ...a, notes } : a);
    setLocalAccompaniments(updated);
    try {
      localStorage.setItem('jde_accompaniment_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_accompaniments_updated'));
    } catch (e) {
      console.warn('Could not save accompaniments', e);
    }
  };

  const handleDeleteAccompaniment = (id: string) => {
    const updated = actualAccompaniments.filter(a => a.id !== id);
    setLocalAccompaniments(updated);
    try {
      localStorage.setItem('jde_accompaniment_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('jde_accompaniments_updated'));
    } catch (e) {
      console.warn('Could not save accompaniments', e);
    }
  };

  // Resolved database collections (props with reliable localStorage fallbacks)
  const resolvedDonations: DonationRecord[] = useMemo(() => {
    if (incomingDonations && incomingDonations.length > 0) return incomingDonations;
    try {
      const saved = localStorage.getItem('jde_donations_records');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  }, [incomingDonations]);

  const resolvedFlowers: GardenFlower[] = useMemo(() => {
    if (incomingFlowers && incomingFlowers.length > 0) return incomingFlowers;
    try {
      const saved = localStorage.getItem('jardin_renaissance_ci_flowers') || localStorage.getItem('jardin_espoir_ci_flowers');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FLOWERS;
    } catch {
      return INITIAL_FLOWERS;
    }
  }, [incomingFlowers]);

  const resolvedForumTopics: ForumTopic[] = useMemo(() => {
    if (incomingForumTopics && incomingForumTopics.length > 0) return incomingForumTopics;
    try {
      const saved = localStorage.getItem('jde_forum_topics');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [incomingForumTopics]);

  const resolvedAccompaniments: AccompanimentRecord[] = useMemo(() => {
    if (incomingAccompaniments && incomingAccompaniments.length > 0) return incomingAccompaniments;
    try {
      const saved = localStorage.getItem('jde_accompaniment_requests');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ACCOMPANIMENT_REQUESTS;
    } catch {
      return INITIAL_ACCOMPANIMENT_REQUESTS;
    }
  }, [incomingAccompaniments]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = adminId.trim().toLowerCase();
    if ((cleanId === 'jardindelarenaissance' || cleanId === 'jardindelespoir') && adminPass.trim() === 'ELVIVICTO') {
      sessionStorage.setItem('jde_admin_auth', 'true');
      localStorage.setItem('jde_admin_session_auth', 'true');
      sessionStorage.setItem('jde_admin_show_alert_bubble', 'true');
      setIsAuthenticated(true);
      setShowAlertModal(true);
      setAuthError(null);
      setAdminId('');
      setAdminPass('');
    } else {
      setAuthError('Identifiant ou mot de passe incorrect. Accès strictement réservé à la direction.');
    }
  };

  // State for Alert Bubble & Cockpit Modal
  const [showAlertModal, setShowAlertModal] = useState<boolean>(() => {
    return sessionStorage.getItem('jde_admin_show_alert_bubble') === 'true';
  });

  // Auto-open Alert Bubble upon logging in or entering admin
  useEffect(() => {
    if (isAuthenticated && sessionStorage.getItem('jde_admin_show_alert_bubble') === 'true') {
      setShowAlertModal(true);
      sessionStorage.removeItem('jde_admin_show_alert_bubble');
    }
  }, [isAuthenticated]);

  // Compute total actionable items requiring review, approval, or processing
  const totalActionsRequired = useMemo(() => {
    const unhandledNotifs = (notifications || []).filter(n => n && n.status !== 'handled' && n.status !== 'traite').length;
    const pendingTestims = (testimonies || []).filter(t => t && t.status === 'en_attente').length;
    const pendingComms = (blogPosts || []).flatMap(p => p.comments || []).filter(c => c.status === 'pending').length;
    const pendingForums = (resolvedForumTopics || []).filter(f => f && f.status === 'pending').length;
    const pendingAccomps = (actualAccompaniments || []).filter(a => a && a.status === 'en_attente').length;
    const pendingDons = (resolvedDonations || []).filter(d => d && d.status === 'en_attente').length;
    const pendingRegs = (actualEventRegistrations || []).filter(r => r && r.status === 'en_attente').length;
    const pendingTrainings = (actualTrainings || []).filter(t => t && t.status === 'en_attente').length;
    return unhandledNotifs + pendingTestims + pendingComms + pendingForums + pendingAccomps + pendingDons + pendingRegs + pendingTrainings;
  }, [notifications, testimonies, blogPosts, resolvedForumTopics, actualAccompaniments, resolvedDonations, actualEventRegistrations, actualTrainings]);

  const handleLogout = () => {
    sessionStorage.removeItem('jde_admin_auth');
    localStorage.removeItem('jde_admin_session_auth');
    setIsAuthenticated(false);
  };

  // Form states for Blog Post Creation
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'cheminement-paranges' as BlogPost['category'],
    categoryLabel: 'Cheminement des Paranges',
    author: "Dr. Marie-Hélène Kouadio",
    authorRole: "Psychologue clinicienne",
    readTime: "7 min de lecture",
    excerpt: '',
    content: '',
    tags: 'Deuil Périnatal, Côte d\'Ivoire, Soutien, Témoignage',
    coverImageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80'
  });


  // Form states for Platform Config
  const [configForm, setConfigForm] = useState<PlatformConfig>({ ...platformConfig });

  // Form states for File Upload
  const [fileCategory, setFileCategory] = useState<'Brochure' | 'Guide' | 'Rapport' | 'Photo' | 'Actualite'>('Guide');
  const [fileDescription, setFileDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Article Creation
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'sante-maternelle-neonatale' as NewsArticle['category'],
    categoryLabel: 'Santé Maternelle & Néonatale',
    summary: '',
    content: '',
    author: 'Direction Médicale Le Jardin de l\'Espoir : Parange',
    authorRole: 'Psychologue / Référent',
    imageUrl: '',
    tags: 'Santé Publique, Côte d\'Ivoire, Paranges',
    keyTakeaways: 'Écoute active sans jugement\nPrise en charge précoce en maternité\nOrientation Ligne Solidaire'
  });

  const showFeedback = (msg: string) => {
    setSaveFeedback(msg);
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Handle File Input Selection
  const handleFileProcess = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type.includes('pdf');
      
      const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
        return (bytes / 1048576).toFixed(1) + ' Mo';
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = (e.target?.result as string) || '#';
        const newDoc: UploadedDocument = {
          id: 'upload-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          size: formatSize(file.size),
          fileType: isImg ? 'image' : isPdf ? 'pdf' : 'doc',
          category: fileCategory,
          uploadedAt: new Date().toLocaleDateString('fr-FR'),
          url: fileUrl,
          description: fileDescription || `${fileCategory} officiel chargé par l'administration.`
        };
        onAddDocument(newDoc);
        showFeedback(`Fichier « ${file.name} » ajouté avec succès aux documents !`);
        setFileDescription('');
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        // Read short text or placeholder data URL
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileProcess(e.dataTransfer.files);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdate(configForm);
    showFeedback('Les informations de la plateforme ont été enregistrées et mises à jour en direct !');
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.summary) {
      showFeedback('Veuillez remplir au moins le titre et le résumé de l\'article.');
      return;
    }

    const categoryLabels: Record<string, string> = {
      'sante-maternelle-neonatale': 'Santé Maternelle & Néonatale',
      'faits-de-societe-traditions': 'Faits de Société & Traditions',
      'sante-mentale-perinatale': 'Santé Mentale Périnatale',
      'actions-ong': 'Actions Terrain ONG',
      'plaidoyer': 'Plaidoyer & Droits'
    };

    const newArticle: NewsArticle = {
      id: 'news-' + Date.now(),
      title: articleForm.title,
      slug: articleForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
      category: articleForm.category,
      categoryLabel: categoryLabels[articleForm.category] || 'Actualité',
      summary: articleForm.summary,
      content: articleForm.content,
      author: articleForm.author || 'Rédaction ONG',
      authorRole: articleForm.authorRole || 'Le Jardin de l\'Espoir : Parange',
      publishedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: '4 min de lecture',
      imageUrl: articleForm.imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      tags: articleForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      keyTakeaways: articleForm.keyTakeaways.split('\n').filter(Boolean),
      sourceOrContext: 'Publication officielle Le Jardin de l\'Espoir : Parange CI'
    };

    onAddArticle(newArticle);
    showFeedback(`Article « ${newArticle.title} » publié avec succès dans la section Actualités !`);

    // Reset article form
    setArticleForm({
      title: '',
      category: 'sante-maternelle-neonatale',
      categoryLabel: 'Santé Maternelle & Néonatale',
      summary: '',
      content: '',
      author: 'Direction Médicale Le Jardin de l\'Espoir : Parange',
      authorRole: 'Psychologue / Référent',
      imageUrl: '',
      tags: 'Côte d\'Ivoire, Paranges, Soutien',
      keyTakeaways: 'Écoute active sans jugement\nPrise en charge précoce en maternité'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] py-16 sm:py-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold font-serif-accent text-stone-900">
              Espace Administration Protégé
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Veuillez vous authentifier avec vos accès réservés pour administrer la plateforme du Jardin de l'Espoir : Parange.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Identifiant Administrateur (ID)
              </label>
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Identifiant"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mot de Passe (MP)
              </label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Mot de passe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-amber-300" />
              <span>Déverrouiller l'Espace Administrateur</span>
            </button>
          </form>

          <div className="pt-2 text-center border-t border-stone-100">
            <button
              onClick={() => setParentActiveTab ? setParentActiveTab('accueil') : null}
              className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              Retour à l'accueil du site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Banner */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Espace Administration Certifié
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ONG Le Jardin de l'Espoir : Parange
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white">
                Gestion de la Plateforme & Médias
              </h1>
              <p className="text-xs sm:text-sm text-stone-400">
                Chargez des fichiers (documents, photos, articles) et ajustez les coordonnées officielles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Direct Open Button for the Alert Bubble & Cockpit */}
            <button
              onClick={() => setShowAlertModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 shadow-md flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer ring-2 ring-amber-300"
              title="Ouvrir la bulle d'alerte et le cockpit des actions en attente"
            >
              <Bell className="w-4 h-4 text-stone-950 animate-bounce" />
              <span>Bulle d'Alerte & Cockpit</span>
              {totalActionsRequired > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-600 text-white animate-pulse">
                  {totalActionsRequired}
                </span>
              )}
            </button>

            <div className="text-right text-xs hidden sm:block">
              <div className="text-stone-300 font-semibold">Administrateur Connecté</div>
              <div className="text-emerald-400">Accès Maître Actif</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-rose-900 text-stone-200 hover:text-white border border-stone-700 hover:border-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {saveFeedback && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-700 text-white shadow-lg flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 font-medium text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
              <span>{saveFeedback}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs for Admin */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-8 overflow-x-auto">
          {/* TAB: NOTIFICATIONS & ALERTS */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'notifications'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Alertes & Messages</span>
            {(() => {
              const unread = notifications.filter(n => n.status === 'unread').length;
              return unread > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-stone-950 font-black animate-pulse">
                  {unread}
                </span>
              ) : null;
            })()}
          </button>

          {/* TAB: GESTION COMPLÈTE DES ÉVÉNEMENTS (NOUVEAU) */}
          <button
            onClick={() => setActiveTab('evenements')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'evenements'
                ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-300 ring-2 ring-amber-400 shadow-md scale-105'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? 'Events & Registrations' : 'Gestion des Événements'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-200 text-emerald-950 font-bold">
              {actualEvents.length}
            </span>
            {(() => {
              const pending = actualEventRegistrations.filter(r => r.status === 'en_attente').length;
              return pending > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold animate-pulse">
                  {pending}
                </span>
              ) : null;
            })()}
          </button>

          {/* TAB: ÉVOLUTION DES DONS (RECHARTS) */}
          <button
            onClick={() => setActiveTab('analytics_dons')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'analytics_dons'
                ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-300 ring-2 ring-amber-400 shadow-md scale-105'
                : 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? 'Finances & Donations (Budget Goal & Ledger)' : 'Finances & Dons (Grand Livre & Objectif Budget)'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-stone-950 font-black">
              Bilan & Écritures
            </span>
          </button>

          {/* TAB: GESTION DES FORMATIONS & SOIGNANTS */}
          <button
            onClick={() => setActiveTab('formations')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'formations'
                ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-300 ring-2 ring-amber-400 shadow-md scale-105'
                : 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? 'Trainings & Health Relays' : 'Formations & Soignants'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-200 text-emerald-950 font-bold">
              {actualTrainings.length}
            </span>
            {(() => {
              const pending = actualTrainings.filter(t => t.status === 'en_attente').length;
              return pending > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-extrabold animate-pulse">
                  {pending}
                </span>
              ) : null;
            })()}
          </button>

          {/* TAB: GESTION DES DEMANDES D'AIDE & ACCOMPAGNEMENTS */}
          <button
            onClick={() => setActiveTab('demandes_aides')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'demandes_aides'
                ? 'bg-gradient-to-r from-rose-800 to-pink-800 text-white ring-2 ring-rose-400 shadow-md scale-105'
                : 'bg-rose-50 text-rose-950 hover:bg-rose-100 border border-rose-300'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-rose-600" />
            <span>{isEn ? 'Help & Support Requests' : "Demandes d'Aide & Suivi"}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-200 text-rose-950 font-bold">
              {actualAccompaniments.length}
            </span>
            {(() => {
              const highUrgency = actualAccompaniments.filter(a => a.urgency === 'critique' || a.urgency === 'haute').length;
              return highUrgency > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-extrabold animate-pulse">
                  {highUrgency} urgentes
                </span>
              ) : null;
            })()}
          </button>

          {/* TAB: GESTION FAQ PARENTS */}
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'faq'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white ring-2 ring-amber-300 shadow-md scale-105'
                : 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>{isEn ? 'FAQ Management' : 'Gestion FAQ Parents'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-200 text-amber-950 font-bold">
              Dynamique
            </span>
          </button>

          {/* TAB: BANNIERES EVENEMENTS */}
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'banners'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Bannières Événements (Carrousel)</span>
          </button>

          {/* TAB: ARRIERE-PLANS */}
          <button
            onClick={() => setActiveTab('backgrounds')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'backgrounds'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Palette className="w-4 h-4 text-teal-600" />
            <span>Arrière-Plans Pages</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'files'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Fichiers & Documents ({actualDocuments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'articles'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Articles & Actualités ({articles.length})</span>
          </button>

          {/* Blog & Comment Moderation Tab */}
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'blog'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Blog & Modération</span>
            {(() => {
              const count = (blogPosts || []).flatMap(p => p.comments || []).filter(c => c.status === 'pending').length;
              return count > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold animate-pulse">
                  {count}
                </span>
              ) : null;
            })()}
          </button>

          {/* TAB: TÉMOIGNAGES PARANGES */}
          <button
            onClick={() => setActiveTab('testimonies')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'testimonies'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Quote className="w-4 h-4 text-amber-400" />
            <span>Témoignages Paranges ({testimonies.length})</span>
            {(() => {
              const pending = testimonies.filter(t => t.status === 'en_attente').length;
              return pending > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold animate-pulse">
                  {pending}
                </span>
              ) : null;
            })()}
          </button>

          {/* TAB: BASE DE DONNÉES & TÉLÉCHARGEMENTS */}
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'database'
                ? 'bg-emerald-900 text-amber-300 ring-2 ring-amber-400 shadow-md'
                : 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <Database className="w-4 h-4 text-amber-500" />
            <span>Base de Données & Téléchargements</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-stone-950 font-black">
              CSV/JSON
            </span>
          </button>

          {/* TAB: CAHIER DES CHARGES & PRÉSENTATION (PDF FR & EN) */}
          <button
            onClick={() => setActiveTab('documents_officiels')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'documents_officiels'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 ring-2 ring-amber-300 shadow-md scale-105'
                : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-950 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>Documents Officiels (PDF FR & EN)</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-stone-950 font-black">
              4 PDFs
            </span>
          </button>

          {/* TAB: GESTION DE L'AFFICHAGE PAGE D'ACCUEIL */}
          <button
            onClick={() => setActiveTab('affichage_accueil')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'affichage_accueil'
                ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-300 ring-2 ring-amber-400 shadow-md scale-105'
                : 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <LayoutTemplate className="w-4 h-4 text-emerald-600" />
            <span>Affichage Accueil</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-stone-950 font-black">
              15 Blocs & Textes
            </span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'config'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Modifier Infos Plateforme</span>
          </button>
        </div>

        {/* TAB: GESTION COMPLÈTE DES ÉVÉNEMENTS & ROSTER INSCRITS (NOUVEAU) */}
        {activeTab === 'evenements' && (
          <AdminEventsManager
            events={actualEvents}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            eventRegistrations={actualEventRegistrations}
            onAddEventRegistration={handleAddRegistration}
            onUpdateEventRegistrationStatus={handleUpdateRegistrationStatus}
            onDeleteEventRegistration={handleDeleteRegistration}
          />
        )}

        {/* TAB: ÉVOLUTION MENSUELLE DES DONS (VISUALISATION RECHARTS) */}
        {activeTab === 'analytics_dons' && (
          <AdminDonationAnalytics donations={resolvedDonations} />
        )}

        {/* TAB: GESTION DE LA FAQ DYNAMIQUE DES PARENTS ENDEUILLÉS */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Module Administration FAQ Dynamique</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900">
                    Questions & Réponses Fréquentes des Parents Endeuillés
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Ajoutez, modifiez, supprimez et organisez les questions posées par les paranges et familles ivoiriennes. Vos modifications sont immédiatement visibles dans la vue 'Ressources'.
                  </p>
                </div>
              </div>

              <DynamicFaqSection isAdminProp={true} />
            </div>
          </div>
        )}

        {/* TAB: DOCUMENTS OFFICIELS & CAHIER DES CHARGES PDF */}
        {activeTab === 'documents_officiels' && (
          <AdminOfficialDocumentsManager />
        )}

        {/* TAB: BASE DE DONNÉES & EXPORTS TÉLÉCHARGEABLES */}
        {activeTab === 'database' && (
          <AdminDatabaseExportManager
            donations={resolvedDonations}
            notifications={notifications}
            flowers={resolvedFlowers}
            testimonies={testimonies}
            forumTopics={resolvedForumTopics}
            accompaniments={actualAccompaniments}
            eventRegistrations={actualEventRegistrations}
            events={actualEvents}
          />
        )}

        {/* TAB: FORMATIONS & SOIGNANTS */}
        {activeTab === 'formations' && (
          <AdminTrainingsManager
            trainings={actualTrainings}
            onAddTraining={handleAddTraining}
            onUpdateStatus={handleUpdateTrainingStatus}
            onUpdateNotes={handleUpdateTrainingNotes}
            onDeleteTraining={handleDeleteTraining}
          />
        )}

        {/* TAB: DEMANDES D'AIDE & ACCOMPAGNEMENTS */}
        {activeTab === 'demandes_aides' && (
          <AdminHelpRequestsManager
            accompaniments={actualAccompaniments}
            onAddAccompaniment={handleAddAccompaniment}
            onUpdateStatus={handleUpdateAccompanimentStatus}
            onUpdateUrgency={handleUpdateAccompanimentUrgency}
            onAssignReferent={handleAssignAccompanimentReferent}
            onUpdateNotes={handleUpdateAccompanimentNotes}
            onDeleteAccompaniment={handleDeleteAccompaniment}
          />
        )}

        {/* TAB: TÉMOIGNAGES MODÉRATION */}
        {activeTab === 'testimonies' && (
          <AdminTestimoniesManager
            testimonies={testimonies}
            onApproveTestimony={onApproveTestimony}
            onRejectTestimony={onRejectTestimony}
            onDeleteTestimony={onDeleteTestimony}
            onAddTestimony={onAddTestimony}
          />
        )}

        {/* TAB: NOTIFICATIONS & ALERTS */}
        {activeTab === 'notifications' && (
          <AdminNotificationsManager
            notifications={notifications}
            onUpdateStatus={onUpdateNotificationStatus}
            onDeleteNotification={onDeleteNotification}
            onAddTestNotification={onAddTestNotification}
          />
        )}

        {/* TAB: PROMO BANNERS CAROUSEL */}
        {activeTab === 'banners' && (
          <AdminPromoBannersManager
            config={promoBannerConfig}
            onUpdateConfig={onUpdatePromoBannerConfig}
            onShowFeedback={showFeedback}
          />
        )}

        {/* TAB: PAGE BACKGROUNDS */}
        {activeTab === 'backgrounds' && (
          <AdminPageBackgroundsManager
            pageBackgrounds={platformConfig?.pageBackgrounds}
            onUpdateBackgrounds={onUpdatePageBackgrounds}
            onShowFeedback={showFeedback}
          />
        )}

        {/* TAB 1: FILES & MEDIA MANAGER */}
        {activeTab === 'files' && (
          <div className="space-y-8">
            
            {/* Upload Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-serif-accent text-stone-900 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-emerald-700" />
                    Charger de nouveaux fichiers (Documents, Photos, Articles)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Glissez-déposez vos fichiers ou parcourez votre ordinateur. Les formats acceptés comprennent PDF, Word, JPG, PNG.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-emerald-600 bg-emerald-50/50 scale-[1.01]' 
                    : 'border-stone-300 hover:border-emerald-500 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => handleFileProcess(e.target.files)}
                  multiple
                  className="hidden" 
                />
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4 shadow-2xs">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="text-base font-bold text-stone-800 mb-1">
                  Cliquez pour choisir un fichier ou glissez-le ici
                </div>
                <div className="text-xs text-stone-500 max-w-md mx-auto">
                  Guides aux paranges, rapports d'activité, photos de cérémonies, brochures de sensibilisation des maternités...
                </div>
              </div>

              {/* Upload Metadata Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Catégorie du fichier
                  </label>
                  <select
                    value={fileCategory}
                    onChange={(e: any) => setFileCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="Guide">Guide / Manuel d'aide</option>
                    <option value="Brochure">Brochure & Dépliant maternité</option>
                    <option value="Rapport">Rapport financier / Statuts</option>
                    <option value="Photo">Photo de terrain / Cérémonie</option>
                    <option value="Actualite">Document d'enquête & Actualité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Description ou note facultative
                  </label>
                  <input
                    type="text"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="Ex : Livret d'accueil CHU Treichville 2026..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* List of current files */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif-accent text-stone-900">
                    Fichiers Actifs sur la Plateforme ({actualDocuments.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Documents consultables par les visiteurs ou l'équipe soignante.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actualDocuments.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-stone-50 transition-colors flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        {doc.fileType === 'image' ? (
                          <ImageIcon className="w-5 h-5 text-teal-700" />
                        ) : (
                          <FileText className="w-5 h-5 text-emerald-800" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-emerald-800 transition-colors break-all">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {doc.category}
                          </span>
                          <span>• {doc.size}</span>
                          <span>• Ajouté le {doc.uploadedAt}</span>
                        </div>
                        {doc.description && (
                          <p className="text-xs text-stone-600 italic line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                        {doc.fileType === 'image' && doc.url && doc.url !== '#' && (
                          <div className="mt-2 w-20 h-14 rounded-lg overflow-hidden border border-stone-200">
                            <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {doc.url && doc.url !== '#' && (
                        <a 
                          href={doc.url} 
                          download={doc.name}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer définitivement le fichier « ${doc.name} » ?`)) {
                            onDeleteDocument(doc.id);
                            showFeedback(`Fichier « ${doc.name} » supprimé.`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: NEWS ARTICLES MANAGER */}
        {activeTab === 'articles' && (
          <div className="space-y-8">
            
            {/* Create Article Form */}
            <form onSubmit={handleCreateArticle} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif-accent text-stone-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-700" />
                  Rédiger et Publier une Nouvelle Actualité en Côte d'Ivoire
                </h2>
                <p className="text-xs text-stone-500">
                  Partagez les faits de société, enquêtes hospitalières et avancées du deuil périnatal en CI.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Titre de l'article *
                  </label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    placeholder="Ex : Maternité de Treichville : ouverture d'un espace d'écoute..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Catégorie thématique *
                  </label>
                  <select
                    value={articleForm.category}
                    onChange={(e: any) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                  >
                    <option value="sante-maternelle-neonatale">Santé Maternelle & Néonatale</option>
                    <option value="faits-de-societe-traditions">Faits de Société & Traditions</option>
                    <option value="sante-mentale-perinatale">Santé Mentale Périnatale</option>
                    <option value="actions-ong">Actions Terrain ONG</option>
                    <option value="plaidoyer">Plaidoyer & Droits</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Résumé percutant (Chapô) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={articleForm.summary}
                  onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                  placeholder="En 2 à 3 phrases, résumez l'enjeu sociétal ou médical ivoirien..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Corps complet de l'article *
                </label>
                <textarea
                  required
                  rows={6}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Rédigez l'article avec témoignages, constats de terrain, recommandations..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Fonction de l'auteur
                  </label>
                  <input
                    type="text"
                    value={articleForm.authorRole}
                    onChange={(e) => setArticleForm({ ...articleForm, authorRole: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    URL de l'image d'illustration
                  </label>
                  <input
                    type="text"
                    value={articleForm.imageUrl}
                    onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={articleForm.tags}
                    onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Points clés retenus (1 par ligne)
                  </label>
                  <textarea
                    rows={2}
                    value={articleForm.keyTakeaways}
                    onChange={(e) => setArticleForm({ ...articleForm, keyTakeaways: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publier l'article immédiatement</span>
                </button>
              </div>
            </form>

            {/* Existing Articles List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-serif-accent text-stone-900">
                Articles Publiés sur le Site ({articles.length})
              </h3>
              <div className="space-y-3">
                {articles.map((art) => (
                  <div 
                    key={art.id}
                    className="p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-300 transition-colors"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {art.categoryLabel}
                        </span>
                        <span className="text-stone-400">• {art.publishedAt}</span>
                      </div>
                      <div className="font-bold text-stone-900 text-sm">{art.title}</div>
                      <p className="text-xs text-stone-500 line-clamp-1">{art.summary}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (confirm(`Voulez-vous supprimer l'article « ${art.title} » ?`)) {
                            onDeleteArticle(art.id);
                            showFeedback(`Article supprimé.`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PLATFORM CONFIGURATION & COORDONNÉES */}
        {activeTab === 'config' && (
          <form onSubmit={handleSaveConfig} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-bold font-serif-accent text-stone-900 flex items-center gap-2">
                <Save className="w-5 h-5 text-emerald-700" />
                Modifier les Coordonnées & Informations Officielles
              </h2>
              <p className="text-xs text-stone-500">
                Ces modifications s'appliquent immédiatement sur la barre de navigation, le pied de page, les formulaires et les moyens de dons.
              </p>
            </div>

            {/* Official Phones */}
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Numéros de Téléphone Officiels Le Jardin de l'Espoir : Parange</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Numéro Principal (Ligne Solidaire) *
                  </label>
                  <input
                    type="text"
                    required
                    value={configForm.phonePrimary}
                    onChange={(e) => setConfigForm({ ...configForm, phonePrimary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-stone-500">Actuellement : 07 59 87 21 61</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Numéro Secondaire / Ligne Directe *
                  </label>
                  <input
                    type="text"
                    required
                    value={configForm.phoneSecondary}
                    onChange={(e) => setConfigForm({ ...configForm, phoneSecondary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-stone-500">Actuellement : 05 75 23 93 12</span>
                </div>
              </div>
            </div>

            {/* Other Contacts & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Courriel Officiel
                </label>
                <input
                  type="email"
                  value={configForm.email}
                  onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Territoire d'action (Pied de page)
                </label>
                <input
                  type="text"
                  value={configForm.countryNotice}
                  onChange={(e) => setConfigForm({ ...configForm, countryNotice: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
                <span className="text-[11px] text-stone-500">Affiché en pied de page : « Côte d'Ivoire »</span>
              </div>
            </div>

            {/* Top Announcement Banner */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                Message d'annonce en haut du site (Bandeau d'information)
              </label>
              <input
                type="text"
                value={configForm.topBannerNotice}
                onChange={(e) => setConfigForm({ ...configForm, topBannerNotice: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Stats Metrics */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                Chiffres clés & Statistiques d'impact
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-500">Familles accompagnées</div>
                  <input
                    type="number"
                    value={configForm.stats.familiesHelped}
                    onChange={(e) => setConfigForm({
                      ...configForm,
                      stats: { ...configForm.stats, familiesHelped: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full mt-1 font-bold text-stone-900 text-lg border-b border-stone-300 bg-transparent focus:outline-hidden"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-500">Kits de deuil distribués</div>
                  <input
                    type="number"
                    value={configForm.stats.kitsDistributed}
                    onChange={(e) => setConfigForm({
                      ...configForm,
                      stats: { ...configForm.stats, kitsDistributed: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full mt-1 font-bold text-stone-900 text-lg border-b border-stone-300 bg-transparent focus:outline-hidden"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-500">Séances GSP réalisées</div>
                  <input
                    type="number"
                    value={configForm.stats.gspSessions}
                    onChange={(e) => setConfigForm({
                      ...configForm,
                      stats: { ...configForm.stats, gspSessions: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full mt-1 font-bold text-stone-900 text-lg border-b border-stone-300 bg-transparent focus:outline-hidden"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-500">Villes visitées</div>
                  <input
                    type="number"
                    value={configForm.stats.mobileClinicsCities}
                    onChange={(e) => setConfigForm({
                      ...configForm,
                      stats: { ...configForm.stats, mobileClinicsCities: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full mt-1 font-bold text-stone-900 text-lg border-b border-stone-300 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les modifications en direct</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB: GESTION DE L'AFFICHAGE PAGE D'ACCUEIL */}
        {activeTab === 'affichage_accueil' && (
          <AdminHomeDisplayManager
            platformConfig={platformConfig}
            onUpdatePlatformConfig={handleUpdate}
            onShowFeedback={showFeedback}
          />
        )}

        {/* TAB 4: BLOG ARTICLES & COMMENT MODERATION */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            
            {/* 1. Comment Moderation Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    Espace Modération des Paranges
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-700" />
                    Commentaires soumis par les lecteurs
                  </h2>
                  <p className="text-xs text-stone-500 mt-1 max-w-2xl">
                    Chaque témoignage ou commentaire déposé sous un article de fond est soumis à votre relecture. 
                    Seuls les commentaires validés deviennent visibles publiquement sur le blog.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'Tous' },
                    { id: 'pending', label: 'En attente' },
                    { id: 'approved', label: 'Approuvés' },
                    { id: 'rejected', label: 'Rejetés' }
                  ].map((f) => {
                    const count = (blogPosts || []).flatMap(p => p.comments || []).filter(c => 
                      f.id === 'all' ? true : c.status === f.id
                    ).length;

                    return (
                      <button
                        key={f.id}
                        onClick={() => setCommentFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          commentFilter === f.id
                            ? 'bg-emerald-800 text-white shadow-2xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        <span>{f.label}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          f.id === 'pending' && count > 0 
                            ? 'bg-amber-500 text-white' 
                            : commentFilter === f.id ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comments List */}
              {(() => {
                const filteredComments = (blogPosts || []).flatMap(p => 
                  (p.comments || []).map(c => ({ ...c, postTitle: p.title, postId: p.id }))
                ).filter(c => commentFilter === 'all' ? true : c.status === commentFilter);

                if (filteredComments.length === 0) {
                  return (
                    <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500">
                      <MessageSquare className="w-8 h-8 mx-auto text-stone-400 mb-2 opacity-60" />
                      <p className="text-sm font-semibold text-stone-700">Aucun commentaire dans cette catégorie</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {commentFilter === 'pending' 
                          ? 'Tous les commentaires soumis ont été modérés.' 
                          : 'Les nouveaux commentaires des lecteurs apparaîtront ici.'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filteredComments.map((c) => (
                      <div 
                        key={c.id} 
                        className={`p-5 rounded-2xl border transition-all ${
                          c.status === 'pending' 
                            ? 'bg-amber-50/40 border-amber-200/90 shadow-xs' 
                            : c.status === 'approved'
                            ? 'bg-emerald-50/20 border-emerald-100'
                            : 'bg-stone-50/60 border-stone-200 opacity-75'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-stone-900">{c.authorName}</span>
                              {c.authorRole && (
                                <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700 font-medium">
                                  {c.authorRole}
                                </span>
                              )}
                              <span className="text-stone-400 text-xs">• {c.createdAt}</span>
                              
                              {/* Status badge */}
                              {c.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                  <Clock className="w-3 h-3" />
                                  En attente de modération
                                </span>
                              )}
                              {c.status === 'approved' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Check className="w-3 h-3" />
                                  Approuvé & Publié
                                </span>
                              )}
                              {c.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                                  <XCircle className="w-3 h-3" />
                                  Rejeté
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-stone-500 font-medium">
                              Sous l'article : <span className="text-stone-800 font-semibold italic">« {c.postTitle} »</span>
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            {c.status !== 'approved' && (
                              <button
                                onClick={() => {
                                  onApproveComment(c.postId, c.id);
                                  showFeedback(`Commentaire de ${c.authorName} approuvé et publié !`);
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                title="Valider et rendre visible aux visiteurs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approuver</span>
                              </button>
                            )}

                            {c.status !== 'rejected' && (
                              <button
                                onClick={() => {
                                  onRejectComment(c.postId, c.id);
                                  showFeedback(`Commentaire de ${c.authorName} rejeté.`);
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center gap-1 transition-colors cursor-pointer"
                                title="Rejeter ce commentaire"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Rejeter</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (confirm(`Supprimer définitivement le commentaire de ${c.authorName} ?`)) {
                                  onDeleteComment(c.postId, c.id);
                                  showFeedback(`Commentaire supprimé.`);
                                }
                              }}
                              className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Supprimer définitivement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Comment body */}
                        <div className="mt-3 p-3.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
                          « {c.content} »
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* 2. Write New Long-Form Blog Post Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
                  <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                  Rédaction d'article de fond
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900">
                  Publier un nouvel article sur le deuil périnatal et le cheminement
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Rédigez des dossiers thématiques approfondis, des guides d'accompagnement ou des témoignages éclairants pour soutenir les Paranges.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!blogForm.title || !blogForm.content) {
                    showFeedback('Veuillez renseigner le titre et le contenu de l\'article.');
                    return;
                  }

                  const newPost: BlogPost = {
                    id: `blog-${Date.now()}`,
                    title: blogForm.title,
                    slug: blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    category: blogForm.category,
                    categoryLabel: blogForm.categoryLabel,
                    author: blogForm.author,
                    authorRole: blogForm.authorRole,
                    publishedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                    readTime: blogForm.readTime || '6 min de lecture',
                    excerpt: blogForm.excerpt || blogForm.content.slice(0, 160) + '...',
                    tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean),
                    coverImageUrl: blogForm.coverImageUrl,
                    likesCount: 1,
                    content: blogForm.content,
                    comments: []
                  };

                  onAddBlogPost(newPost);
                  showFeedback(`L'article de fond « ${newPost.title} » a été publié avec succès !`);
                  
                  // Reset form
                  setBlogForm({
                    title: '',
                    category: 'cheminement-paranges',
                    categoryLabel: 'Cheminement des Paranges',
                    author: 'Dr. Marie-Hélène Kouadio',
                    authorRole: 'Psychologue clinicienne',
                    readTime: '7 min de lecture',
                    excerpt: '',
                    content: '',
                    tags: 'Deuil Périnatal, Côte d\'Ivoire, Soutien',
                    coverImageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80'
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Titre complet de l'article *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="Ex: Les mots qui soulagent : guide de communication bienveillante avec les Paranges"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Catégorie thématique
                    </label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => {
                        const val = e.target.value as BlogPost['category'];
                        const labels: Record<BlogPost['category'], string> = {
                          'cheminement-paranges': 'Cheminement des Paranges',
                          'papas-paranges': 'Papas Paranges',
                          'fratrie-et-apres': 'Fratrie et Après',
                          'psychologie-trauma': 'Psychologie & Trauma',
                          'societe-et-culture': 'Société & Culture'
                        };
                        setBlogForm({ 
                          ...blogForm, 
                          category: val,
                          categoryLabel: labels[val]
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="cheminement-paranges">Cheminement des Paranges</option>
                      <option value="papas-paranges">Papas Paranges</option>
                      <option value="fratrie-et-apres">Fratrie et Après</option>
                      <option value="psychologie-trauma">Psychologie & Trauma</option>
                      <option value="societe-et-culture">Société & Culture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Auteur(e)
                    </label>
                    <input
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Rôle de l'auteur / Spécialité
                    </label>
                    <input
                      type="text"
                      value={blogForm.authorRole}
                      onChange={(e) => setBlogForm({ ...blogForm, authorRole: e.target.value })}
                      placeholder="Ex: Psychologue clinicienne, Pair-aidant..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Temps de lecture estimé
                    </label>
                    <input
                      type="text"
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                      placeholder="Ex: 8 min de lecture"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Image de couverture (URL)
                    </label>
                    <input
                      type="url"
                      value={blogForm.coverImageUrl}
                      onChange={(e) => setBlogForm({ ...blogForm, coverImageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Résumé introductif (affiché sur la carte d'aperçu)
                  </label>
                  <textarea
                    rows={2}
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    placeholder="Synthèse des thèmes abordés dans cet article..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tags thématiques (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contenu complet de l'article de fond *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="Rédigez ici votre article détaillé. Les sauts de ligne et sous-titres (### Titre) sont acceptés..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 font-mono text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publier cet article de fond</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* Admin Action Alert Modal (Cockpit en direct) */}
        <AdminActionAlertModal
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          notifications={notifications}
          onUpdateNotificationStatus={onUpdateNotificationStatus}
          testimonies={testimonies}
          onApproveTestimony={onApproveTestimony}
          onRejectTestimony={onRejectTestimony}
          blogPosts={blogPosts}
          onApproveComment={onApproveComment}
          onRejectComment={onRejectComment}
          flowers={resolvedFlowers}
          accompaniments={actualAccompaniments}
          donations={resolvedDonations}
          forumTopics={resolvedForumTopics}
          eventRegistrations={actualEventRegistrations}
          onUpdateEventRegistrationStatus={handleUpdateRegistrationStatus}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onParentNavigate={(tab) => setParentActiveTab ? setParentActiveTab(tab) : null}
        />

        {/* Floating Interactive Alert Bubble (Toujours accessible en bas à droite) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowAlertModal(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-stone-900 hover:bg-emerald-950 text-white shadow-2xl border-2 border-amber-400/90 hover:border-amber-300 transition-all transform hover:scale-105 cursor-pointer"
            aria-label="Ouvrir la bulle d'alerte et le cockpit des actions requises"
          >
            <div className="relative">
              <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
              {totalActionsRequired > 0 && (
                <span className="absolute -top-2.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-600 text-white border-2 border-stone-900 animate-pulse">
                  {totalActionsRequired}
                </span>
              )}
            </div>
            <div className="text-left pr-1 hidden sm:block">
              <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <span>Bulle d'Alerte</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-xs font-bold text-white">
                {totalActionsRequired > 0 ? `${totalActionsRequired} action${totalActionsRequired > 1 ? 's' : ''} en attente` : 'Veille en direct'}
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
