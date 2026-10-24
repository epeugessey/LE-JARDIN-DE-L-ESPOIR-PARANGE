import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  NavTab, 
  NewsArticle, 
  UploadedDocument, 
  PlatformConfig, 
  BlogPost, 
  BlogComment, 
  AdminNotificationMessage, 
  PromoBannerConfig, 
  PageBackgroundConfig, 
  ForumTopic, 
  ForumReply, 
  EventItem,
  EventRegistration,
  ParangeTestimony,
  DonationRecord,
  AccompanimentRecord,
  GardenFlower
} from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { ResourcesView } from './components/ResourcesView';
import { VirtualGardenView } from './components/VirtualGardenView';
import { TrainingView } from './components/TrainingView';
import { AboutView } from './components/AboutView';
import { DonationView } from './components/DonationView';
import { NewsView } from './components/NewsView';
import { AdminView } from './components/AdminView';
import { BlogView } from './components/BlogView';
import { ForumView } from './components/ForumView';
import { TestimoniesView } from './components/TestimoniesView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { FloatingImmediateHelpButton } from './components/FloatingImmediateHelpButton';
import { FloatingDonationButton } from './components/FloatingDonationButton';
import { ContactConsultationModal } from './components/ContactConsultationModal';
import { EventRegistrationModal } from './components/EventRegistrationModal';
import { EmotionalJournalView } from './components/EmotionalJournalView';

import { INITIAL_NEWS_ARTICLES, INITIAL_UPLOADED_DOCUMENTS, DEFAULT_PLATFORM_CONFIG } from './data/newsData';
import { DEFAULT_PROMO_BANNER_CONFIG } from './data/promoBanners';
import { INITIAL_BLOG_POSTS } from './data/blogPosts';
import { INITIAL_FORUM_TOPICS } from './data/forumData';
import { INITIAL_CALENDAR_EVENTS, INITIAL_EVENT_REGISTRATIONS } from './data/calendarEvents';
import { INITIAL_ADMIN_NOTIFICATIONS } from './data/initialAdminNotifications';
import { DEFAULT_PAGE_BACKGROUNDS } from './data/defaultBackgrounds';
import { INITIAL_PARANGE_TESTIMONIES } from './data/testimoniesData';
import { INITIAL_DONATIONS } from './data/donationsData';
import { INITIAL_ACCOMPANIMENT_REQUESTS } from './data/accompanimentData';
import { INITIAL_FLOWERS } from './data/mockData';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<NavTab>('accueil');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isPriorityConsultation, setIsPriorityConsultation] = useState(false);
  const [consultationAudience, setConsultationAudience] = useState<'parange' | 'fratrie' | 'proche' | 'soignant-relais'>('parange');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 1. Centralized Platform Config (persisted)
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => {
    try {
      const saved = localStorage.getItem('jde_platform_config');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed === 'object' ? parsed : DEFAULT_PLATFORM_CONFIG;
    } catch {
      return DEFAULT_PLATFORM_CONFIG;
    }
  });

  // 2. News Articles (persisted)
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('jde_news_articles');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_NEWS_ARTICLES;
    } catch {
      return INITIAL_NEWS_ARTICLES;
    }
  });

  // 3. Documents (persisted)
  const [documents, setDocuments] = useState<UploadedDocument[]>(() => {
    try {
      const saved = localStorage.getItem('jde_uploaded_documents');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_UPLOADED_DOCUMENTS;
    } catch {
      return INITIAL_UPLOADED_DOCUMENTS;
    }
  });

  // 4. Blog Posts & Comments (persisted)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('jde_blog_posts');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_BLOG_POSTS;
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  });

  // 5. Forum Topics & Replies (persisted)
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(() => {
    try {
      const saved = localStorage.getItem('jde_forum_topics');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_FORUM_TOPICS;
    } catch {
      return INITIAL_FORUM_TOPICS;
    }
  });

  // 6. Calendar Events (persisted)
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('jde_calendar_events');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_CALENDAR_EVENTS;
    } catch {
      return INITIAL_CALENDAR_EVENTS;
    }
  });

  // 7. Admin Notifications & Incoming Messages (persisted)
  const [adminNotifications, setAdminNotifications] = useState<AdminNotificationMessage[]>(() => {
    try {
      const saved = localStorage.getItem('jde_admin_notifications');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_ADMIN_NOTIFICATIONS;
    } catch {
      return INITIAL_ADMIN_NOTIFICATIONS;
    }
  });

  // 8. Promo Banner Config (persisted)
  const [promoBannerConfig, setPromoBannerConfig] = useState<PromoBannerConfig>(() => {
    try {
      const saved = localStorage.getItem('jde_promo_banners');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed === 'object' && Array.isArray(parsed.banners)
        ? parsed
        : DEFAULT_PROMO_BANNER_CONFIG;
    } catch {
      return DEFAULT_PROMO_BANNER_CONFIG;
    }
  });

  // 9. Parange Testimonies (persisted)
  const [testimonies, setTestimonies] = useState<ParangeTestimony[]>(() => {
    try {
      const saved = localStorage.getItem('jde_parange_testimonies');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_PARANGE_TESTIMONIES;
    } catch {
      return INITIAL_PARANGE_TESTIMONIES;
    }
  });

  // 10. Donations & Donors (persisted)
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('jde_donations_records');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const handleAddDonation = (newDonation: DonationRecord) => {
    setDonations((prev) => {
      const updated = [newDonation, ...prev];
      try {
        localStorage.setItem('jde_donations_records', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save donation', e);
      }
      return updated;
    });
  };

  // 11. Recours Service Accompagnement (persisted)
  const [accompaniments, setAccompaniments] = useState<AccompanimentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('jde_accompaniment_requests');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ACCOMPANIMENT_REQUESTS;
    } catch {
      return INITIAL_ACCOMPANIMENT_REQUESTS;
    }
  });

  const handleAddAccompaniment = (newRecord: AccompanimentRecord) => {
    setAccompaniments((prev) => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem('jde_accompaniment_requests', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save accompaniment request', e);
      }
      return updated;
    });
  };

  // 12. Fleurs Semées pour les Anges (persisted)
  const [flowers, setFlowers] = useState<GardenFlower[]>(() => {
    try {
      const saved = localStorage.getItem('jardin_espoir_ci_flowers') || localStorage.getItem('jardin_renaissance_ci_flowers');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FLOWERS;
    } catch {
      return INITIAL_FLOWERS;
    }
  });

  // 13. Event Registrations (persisted)
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(() => {
    try {
      const saved = localStorage.getItem('jde_event_registrations');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EVENT_REGISTRATIONS;
    } catch {
      return INITIAL_EVENT_REGISTRATIONS;
    }
  });

  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Listen to cross-component notification updates (from chatbox, help buttons, etc.)
  useEffect(() => {
    const handleNotificationsUpdated = () => {
      try {
        const saved = localStorage.getItem('jde_admin_notifications');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setAdminNotifications(parsed);
          }
        }
      } catch (e) {
        console.error('Error syncing notifications', e);
      }
    };

    window.addEventListener('jde_notifications_updated', handleNotificationsUpdated);
    return () => window.removeEventListener('jde_notifications_updated', handleNotificationsUpdated);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jde_platform_config', JSON.stringify(platformConfig));
    } catch (e) {
      console.warn('Could not save platformConfig', e);
    }
  }, [platformConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('jde_news_articles', JSON.stringify(articles));
    } catch (e) {
      console.warn('Could not save articles', e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('jde_uploaded_documents', JSON.stringify(documents));
    } catch (e) {
      console.warn('Could not save documents', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('jde_blog_posts', JSON.stringify(blogPosts));
    } catch (e) {
      console.warn('Could not save blogPosts', e);
    }
  }, [blogPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('jde_forum_topics', JSON.stringify(forumTopics));
    } catch (e) {
      console.warn('Could not save forumTopics', e);
    }
  }, [forumTopics]);

  useEffect(() => {
    try {
      localStorage.setItem('jde_calendar_events', JSON.stringify(events));
    } catch (e) {
      console.warn('Could not save events', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('jde_admin_notifications', JSON.stringify(adminNotifications));
    } catch (e) {
      console.warn('Could not save adminNotifications', e);
    }
  }, [adminNotifications]);

  useEffect(() => {
    try {
      localStorage.setItem('jde_promo_banners', JSON.stringify(promoBannerConfig));
    } catch (e) {
      console.warn('Could not save promoBannerConfig', e);
    }
  }, [promoBannerConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('jde_parange_testimonies', JSON.stringify(testimonies));
    } catch (e) {
      console.warn('Could not save testimonies', e);
    }
  }, [testimonies]);

  // Testimonies handlers
  const handleAddTestimony = (testimony: ParangeTestimony) => {
    setTestimonies((prev) => [testimony, ...prev]);
    const newNotif: AdminNotificationMessage = {
      id: `notif-${Date.now()}`,
      senderName: testimony.authorName,
      senderPhone: 'Non renseigné',
      senderCity: testimony.city || "Côte d'Ivoire",
      subject: `Nouveau récit déposé : « ${testimony.title} »`,
      message: testimony.story,
      timestamp: "À l'instant",
      status: 'unread',
      type: 'contact_general',
      urgencyLevel: 'normale'
    };
    setAdminNotifications((prev) => [newNotif, ...prev]);
  };

  const handleApproveTestimony = (id: string) => {
    setTestimonies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'approuve' } : t))
    );
  };

  const handleRejectTestimony = (id: string) => {
    setTestimonies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'rejete' } : t))
    );
  };

  const handleDeleteTestimony = (id: string) => {
    setTestimonies((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLightCandle = (id: string) => {
    setTestimonies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, candlesLitCount: (t.candlesLitCount || 0) + 1 } : t))
    );
  };

  const handleLikeTestimony = (id: string) => {
    setTestimonies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likesCount: (t.likesCount || 0) + 1 } : t))
    );
  };

  const handleOpenAdminLogin = () => {
    const isAuth = sessionStorage.getItem('jde_admin_auth') === 'true' || localStorage.getItem('jde_admin_session_auth') === 'true';
    if (isAuth) {
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    sessionStorage.setItem('jde_admin_show_alert_bubble', 'true');
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler functions
  const handleUpdateConfig = (newConfig: PlatformConfig) => {
    setPlatformConfig(newConfig);
  };

  const handleUpdatePromoBannerConfig = (newConfig: PromoBannerConfig) => {
    setPromoBannerConfig(newConfig);
  };

  const handleUpdatePageBackgrounds = (newBackgrounds: PageBackgroundConfig) => {
    setPlatformConfig((prev) => ({
      ...prev,
      pageBackgrounds: newBackgrounds
    }));
  };

  const handleAddArticle = (article: NewsArticle) => {
    setArticles((prev) => [article, ...prev]);
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => (prev || []).filter((a) => a.id !== id));
  };

  const handleAddDocument = (doc: UploadedDocument) => {
    setDocuments((prev) => [doc, ...(prev || [])]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => (prev || []).filter((d) => d.id !== id));
  };

  // Blog comment handlers
  const handleAddBlogPost = (post: BlogPost) => {
    setBlogPosts((prev) => [post, ...(prev || [])]);
  };

  const handleAddComment = (
    commentOrPostId: string | (Omit<BlogComment, 'id' | 'createdAt' | 'status'> & { postId?: string }),
    maybeComment?: BlogComment
  ) => {
    let targetPostId: string;
    let newComment: BlogComment;

    if (typeof commentOrPostId === 'string' && maybeComment) {
      targetPostId = commentOrPostId;
      newComment = maybeComment;
    } else {
      const payload = commentOrPostId as Omit<BlogComment, 'id' | 'createdAt' | 'status'> & { postId: string };
      targetPostId = payload.postId;
      newComment = {
        ...payload,
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        createdAt: new Date().toLocaleDateString('fr-FR'),
        status: 'pending'
      };
    }

    setBlogPosts((prev) => (prev || []).map((p) => {
      if (p.id !== targetPostId) return p;
      return {
        ...p,
        comments: [...(p.comments || []), newComment]
      };
    }));
  };

  const handleApproveComment = (postId: string, commentId: string) => {
    setBlogPosts((prev) => (prev || []).map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: (p.comments || []).map((c) => c.id === commentId ? { ...c, status: 'approved' } : c)
      };
    }));
  };

  const handleRejectComment = (postId: string, commentId: string) => {
    setBlogPosts((prev) => (prev || []).map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: (p.comments || []).map((c) => c.id === commentId ? { ...c, status: 'rejected' } : c)
      };
    }));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setBlogPosts((prev) => (prev || []).map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: (p.comments || []).filter((c) => c.id !== commentId)
      };
    }));
  };

  // Forum handlers
  const handleAddTopic = (topic: ForumTopic) => {
    setForumTopics((prev) => [topic, ...prev]);
  };

  const handleAddReply = (topicId: string, reply: ForumReply) => {
    setForumTopics((prev) => prev.map((t) => {
      if (t.id !== topicId) return t;
      return {
        ...t,
        replies: [...(t.replies || []), reply]
      };
    }));
  };

  // Admin Notification status update
  const handleUpdateNotificationStatus = (id: string, status: 'unread' | 'read' | 'handled' | 'archived') => {
    setAdminNotifications((prev) => prev.map((n) => n.id === id ? { ...n, status } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setAdminNotifications((prev) => (prev || []).filter((n) => n.id !== id));
  };

  const handleAddTestNotification = () => {
    const testAlert: AdminNotificationMessage = {
      id: `test-${Date.now()}`,
      type: 'chat_direct',
      senderName: 'Visiteur Test Côte d\'Ivoire',
      senderPhone: '07 11 22 33 44',
      senderEmail: 'test.parent@gmail.com',
      senderCity: 'Abidjan (Cocody)',
      subject: 'Alerte test d\'écoute solidaire',
      message: 'Ceci est une notification de test générée par l\'administrateur pour vérifier la fluidité de la réception des alertes et du bouton WhatsApp.',
      timestamp: new Date().toISOString(),
      urgencyLevel: 'haute',
      status: 'unread',
      metadata: { source: 'Test Administrateur' }
    };

    setAdminNotifications((prev) => [testAlert, ...prev]);
  };

  // Event & Event Registration Handlers
  const handleAddEvent = (newEvent: EventItem) => {
    setEvents((prev) => {
      const updated = [newEvent, ...prev];
      try {
        localStorage.setItem('jde_calendar_events', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      window.dispatchEvent(new CustomEvent('jde_events_updated', { detail: updated }));
      return updated;
    });
  };

  const handleUpdateEvent = (updatedEvent: EventItem) => {
    setEvents((prev) => {
      const updated = prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev));
      try {
        localStorage.setItem('jde_calendar_events', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      window.dispatchEvent(new CustomEvent('jde_events_updated', { detail: updated }));
      return updated;
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((ev) => ev.id !== id);
      try {
        localStorage.setItem('jde_calendar_events', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      window.dispatchEvent(new CustomEvent('jde_events_updated', { detail: updated }));
      return updated;
    });
  };

  const handleAddEventRegistration = (newReg: EventRegistration) => {
    setEventRegistrations((prev) => {
      const updated = [newReg, ...prev];
      try {
        localStorage.setItem('jde_event_registrations', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      window.dispatchEvent(new CustomEvent('jde_event_registrations_updated', { detail: updated }));
      return updated;
    });
  };

  const handleUpdateEventRegistrationStatus = (id: string, status: EventRegistration['status']) => {
    setEventRegistrations((prev) => {
      const updated = prev.map((reg) => (reg.id === id ? { ...reg, status } : reg));
      try {
        localStorage.setItem('jde_event_registrations', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      window.dispatchEvent(new CustomEvent('jde_event_registrations_updated', { detail: updated }));
      return updated;
    });
  };

  const handleDeleteEventRegistration = (id: string) => {
    setEventRegistrations((prev) => {
      const updated = prev.filter((reg) => reg.id !== id);
      try {
        localStorage.setItem('jde_event_registrations', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      window.dispatchEvent(new CustomEvent('jde_event_registrations_updated', { detail: updated }));
      return updated;
    });
  };

  const handleConfirmEventRegistration = (regData: Omit<EventRegistration, 'id' | 'registeredAt' | 'status'>) => {
    const newReg: EventRegistration = {
      ...regData,
      id: `reg-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      status: 'en_attente'
    };
    handleAddEventRegistration(newReg);

    // Update registered count on the event
    setEvents((prev) => {
      const updated = prev.map((ev) => {
        if (ev.id === regData.eventId) {
          return {
            ...ev,
            registeredCount: (ev.registeredCount || 0) + (regData.numberOfPeople || 1)
          };
        }
        return ev;
      });
      try {
        localStorage.setItem('jde_calendar_events', JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('jde_events_updated', { detail: updated }));
      return updated;
    });

    // Create an admin notification for the alert bubble
    const adminNotif: AdminNotificationMessage = {
      id: `notif-event-${Date.now()}`,
      type: 'event_registration',
      senderName: regData.fullName,
      senderPhone: regData.phone,
      senderEmail: regData.email,
      senderCity: regData.city || (regData.notes ? "Côte d'Ivoire" : undefined),
      subject: `Inscription : ${regData.eventTitle}`,
      message: `${regData.fullName} (${regData.userRole}) s'est inscrit(e) pour "${regData.eventTitle}" (${regData.numberOfPeople} place(s)). ${regData.notes ? `Notes: ${regData.notes}` : ''}`,
      timestamp: new Date().toISOString(),
      status: 'unread',
      urgencyLevel: 'normale',
      metadata: {
        eventId: regData.eventId,
        eventTitle: regData.eventTitle,
        attendeesCount: regData.numberOfPeople,
        participantType: regData.userRole
      }
    };

    setAdminNotifications((prev) => {
      const updated = [adminNotif, ...prev];
      try {
        localStorage.setItem('jde_admin_notifications', JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('jde_notifications_updated', { detail: updated }));
      return updated;
    });
  };

  // Consultation modal triggers
  const handleOpenConsultationModal = (audience?: 'parange' | 'fratrie' | 'proche' | 'soignant-relais') => {
    if (audience) {
      setConsultationAudience(audience);
    }
    setIsPriorityConsultation(false);
    setIsConsultationModalOpen(true);
  };

  const handleOpenPriorityHelp = () => {
    setConsultationAudience('parange');
    setIsPriorityConsultation(true);
    setIsConsultationModalOpen(true);
  };

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Current page background image
  const currentBgUrl = 
    platformConfig?.pageBackgrounds?.[activeTab] || 
    DEFAULT_PAGE_BACKGROUNDS[activeTab] || 
    '';

  const unreadNotificationsCount = (Array.isArray(adminNotifications) ? adminNotifications : []).filter(
    (n) => n && n.status === 'unread'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#2d3748] relative">
      
      {/* 1. Page Background Image (Customizable per tab by Admin) */}
      {currentBgUrl && (
        <div 
          key={`page-bg-${activeTab}`}
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
          aria-hidden="true"
        >
          <img 
            src={currentBgUrl} 
            alt="" 
            className="w-full h-full object-cover object-center opacity-[0.035] filter saturate-50"
            referrerPolicy="no-referrer"
          />
          {/* Subtle uniform scrim without bottom wash-out so all text and cards remain 100% crisp and readable */}
          <div className="absolute inset-0 bg-[#faf8f5]/40" />
        </div>
      )}

      {/* 2. Watermark Logo that animates gently on EVERY tab switch */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`watermark-logo-${activeTab}`}
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 0.04, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <img 
            src="/logo-circular.jpg" 
            alt="" 
            className="w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] lg:w-[580px] lg:h-[580px] object-contain select-none filter contrast-125 pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Top sticky navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConsultationModal={() => handleOpenConsultationModal()}
        onOpenSearch={() => setIsSearchOpen(true)}
        platformConfig={platformConfig}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenAdminLogin={handleOpenAdminLogin}
      />

      {/* Main content with serene soothing transition */}
      <main className="flex-1 relative z-10 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${language}`}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {activeTab === 'accueil' && (
              <HomeView
                setActiveTab={setActiveTab}
                onOpenConsultationModal={handleOpenConsultationModal}
                platformConfig={platformConfig}
                articles={articles}
                promoBannerConfig={promoBannerConfig}
                events={events}
                onRegisterEvent={(event) => setRegisteringEvent(event)}
                accompaniments={accompaniments}
              />
            )}

            {activeTab === 'actualites' && (
              <NewsView
                articles={articles}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'blog' && (
              <BlogView
                posts={blogPosts || []}
                comments={(blogPosts || []).flatMap((p) => p.comments || [])}
                onAddComment={handleAddComment}
                onOpenConsultationModal={handleOpenConsultationModal}
              />
            )}

            {activeTab === 'temoignages' && (
              <TestimoniesView
                testimonies={testimonies}
                onAddTestimony={handleAddTestimony}
                onLightCandle={handleLightCandle}
                onLikeTestimony={handleLikeTestimony}
                onOpenConsultationModal={handleOpenConsultationModal}
              />
            )}

            {activeTab === 'forum' && (
              <ForumView
                topics={forumTopics}
                onAddTopic={handleAddTopic}
                onAddReply={handleAddReply}
                onOpenConsultationModal={() => handleOpenConsultationModal('parange')}
              />
            )}

            {activeTab === 'services' && (
              <ServicesView
                onOpenConsultationModal={handleOpenConsultationModal}
                platformConfig={platformConfig}
              />
            )}

            {activeTab === 'ressources' && (
              <ResourcesView />
            )}

            {activeTab === 'jardin-virtuel' && (
              <VirtualGardenView />
            )}

            {activeTab === 'journal-bien-etre' && (
              <EmotionalJournalView
                onOpenConsultationModal={handleOpenPriorityHelp}
              />
            )}

            {activeTab === 'formations' && (
              <TrainingView />
            )}

            {activeTab === 'qui-sommes-nous' && (
              <AboutView
                onOpenConsultationModal={() => handleOpenConsultationModal()}
              />
            )}

            {activeTab === 'faire-un-don' && (
              <DonationView 
                platformConfig={platformConfig} 
                onAddDonation={handleAddDonation}
              />
            )}

            {activeTab === 'contact' && (
              <ServicesView
                onOpenConsultationModal={handleOpenConsultationModal}
                platformConfig={platformConfig}
              />
            )}

            {activeTab === 'admin' && (
              <AdminView
                platformConfig={platformConfig}
                onUpdateConfig={handleUpdateConfig}
                articles={articles}
                onAddArticle={handleAddArticle}
                onDeleteArticle={handleDeleteArticle}
                documents={documents}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
                setActiveTab={setActiveTab}
                blogPosts={blogPosts}
                onAddBlogPost={handleAddBlogPost}
                onApproveComment={handleApproveComment}
                onRejectComment={handleRejectComment}
                onDeleteComment={handleDeleteComment}
                notifications={adminNotifications}
                onUpdateNotificationStatus={handleUpdateNotificationStatus}
                onDeleteNotification={handleDeleteNotification}
                onAddTestNotification={handleAddTestNotification}
                promoBannerConfig={promoBannerConfig}
                onUpdatePromoBannerConfig={handleUpdatePromoBannerConfig}
                onUpdatePageBackgrounds={handleUpdatePageBackgrounds}
                testimonies={testimonies}
                onApproveTestimony={handleApproveTestimony}
                onRejectTestimony={handleRejectTestimony}
                onDeleteTestimony={handleDeleteTestimony}
                onAddTestimony={handleAddTestimony}
                donations={donations}
                flowers={flowers}
                forumTopics={forumTopics}
                accompaniments={accompaniments}
                events={events}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                eventRegistrations={eventRegistrations}
                onAddEventRegistration={handleAddEventRegistration}
                onUpdateEventRegistrationStatus={handleUpdateEventRegistrationStatus}
                onDeleteEventRegistration={handleDeleteEventRegistration}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating "Faire un don" Button (top left under the logo, visible on all pages) */}
      <FloatingDonationButton
        onClick={() => {
          setActiveTab('faire-un-don');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isActive={activeTab === 'faire-un-don'}
      />

      {/* Floating Discreet "Besoin d'aide immédiate" & Direct Chatbox */}
      <FloatingImmediateHelpButton
        onOpenPriorityContact={handleOpenPriorityHelp}
        onSendDirectMessage={(notif) => {
          setAdminNotifications((prev) => [notif, ...prev]);
        }}
        phone1={platformConfig.phonePrimary}
        phone2={platformConfig.phoneSecondary}
      />

      {/* Global Consultation & Callback Request Modal */}
      <ContactConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        preselectedAudience={consultationAudience}
        isPriority={isPriorityConsultation}
        onSubmitRequest={(notif) => {
          setAdminNotifications((prev) => [notif, ...prev]);
          const newAcc: AccompanimentRecord = {
            id: `acc-${Date.now()}`,
            fullName: notif.senderName,
            phone: notif.senderPhone,
            email: notif.senderEmail,
            city: notif.senderCity || "Côte d'Ivoire",
            userRole: (notif.metadata?.role as any) || 'parange',
            situationType: (notif.metadata?.situation as any) || 'Deuil périnatal',
            serviceRequested: notif.subject,
            preferredContact: (notif.metadata?.preferredContact as any) || 'telephone',
            urgencyLevel: notif.urgencyLevel,
            requestDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'en_cours',
            notes: notif.message
          };
          handleAddAccompaniment(newAcc);
        }}
      />

      {/* Global Search Modal (Ctrl+K or Header Search button) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsSearchOpen(false);
        }}
        articles={articles}
        blogPosts={blogPosts}
        documents={documents}
        events={events}
      />

      {/* Global Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenConsultationModal={() => handleOpenConsultationModal()}
        platformConfig={platformConfig}
        onOpenAdminLogin={handleOpenAdminLogin}
      />

      {/* Admin Login Modal (Triggered by discreet logo) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Event Registration Modal for Visitors */}
      <EventRegistrationModal
        isOpen={!!registeringEvent}
        onClose={() => setRegisteringEvent(null)}
        event={registeringEvent}
        onConfirmRegistration={handleConfirmEventRegistration}
      />
    </div>
  );
}
