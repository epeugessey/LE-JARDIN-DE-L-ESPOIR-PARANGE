export type Language = 'fr' | 'en';

export type NavTab = 
  | 'accueil' 
  | 'actualites'
  | 'blog'
  | 'temoignages'
  | 'forum'
  | 'services' 
  | 'ressources' 
  | 'jardin-virtuel' 
  | 'journal-bien-etre'
  | 'formations' 
  | 'qui-sommes-nous' 
  | 'faire-un-don' 
  | 'contact'
  | 'admin';

export interface ParangeTestimony {
  id: string;
  authorName: string;
  authorRole: 'maman' | 'papa' | 'fratrie' | 'couple' | 'proche';
  authorRoleLabel?: string;
  authorRoleLabelEn?: string;
  childName?: string;
  city?: string;
  yearOrDate: string;
  title: string;
  titleEn?: string;
  story: string;
  storyEn?: string;
  hopeMessage?: string;
  hopeMessageEn?: string;
  status: 'approuve' | 'en_attente' | 'rejete';
  likesCount?: number;
  candlesLitCount?: number;
  createdAt: string;
  isAnonymous?: boolean;
  category?: 'Mamans Paranges' | 'Papas Paranges' | 'Couples Unis' | 'Fratrie & Famille' | 'Espoir & Renaissance';
  categoryEn?: string;
}

export type AudienceType = 'tous' | 'paranges' | 'fratrie' | 'soignants-relais';

export type DeuilTheme = 
  | 'tous'
  | 'deuil-parental' 
  | 'deuil-perinatal' 
  | 'fratrie-endeuillee' 
  | 'couple-et-culpabilite'
  | 'tabou-communaute';

export interface NewsArticle {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  category: 'sante-maternelle-neonatale' | 'faits-de-societe-traditions' | 'sante-mentale-perinatale' | 'actions-ong' | 'plaidoyer';
  categoryLabel: string;
  categoryLabelEn?: string;
  summary: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  author: string;
  authorRole: string;
  authorRoleEn?: string;
  publishedAt: string;
  readTime: string;
  readTimeEn?: string;
  imageUrl?: string;
  tags: string[];
  sourceOrContext?: string;
  keyTakeaways: string[];
  keyTakeawaysEn?: string[];
  isHighlighted?: boolean;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  fileType: 'pdf' | 'image' | 'article' | 'doc';
  category: 'Brochure' | 'Guide' | 'Rapport' | 'Photo' | 'Actualite';
  uploadedAt: string;
  url: string;
  description?: string;
}

export interface PageBackgroundConfig {
  accueil: string;
  actualites: string;
  blog: string;
  forum: string;
  services: string;
  ressources: string;
  'jardin-virtuel': string;
  formations: string;
  'qui-sommes-nous': string;
  'faire-un-don': string;
}

export interface HomeSectionVisibility {
  showHero: boolean;
  showPromoBanner: boolean;
  showHelplineBar: boolean;
  showRealtimeCounters: boolean;
  showPillars: boolean;
  showInclusivityBanner: boolean;
  showEmotionalJournalBanner: boolean;
  showUpcomingEvents: boolean;
  showImpactStats: boolean;
  showVirtualGardenTeaser: boolean;
  showRecentNews: boolean;
  showTestimonials: boolean;
  showCommunityBanner: boolean;
  showFaq: boolean;
  showNewsletter: boolean;
}

export interface HomeDisplayConfig {
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroPrimaryBtnText?: string;
  heroSecondaryBtnText?: string;
  emergencyAlertNotice?: string;
  presidentMessageTitle?: string;
  presidentMessageContent?: string;
  presidentAuthor?: string;
  sectionVisibility: HomeSectionVisibility;
}

export interface PlatformConfig {
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  address: string;
  countryNotice: string;
  topBannerNotice: string;
  stats: {
    familiesHelped: number;
    kitsDistributed: number;
    gspSessions: number;
    mobileClinicsCities: number;
  };
  facebookGroupUrl?: string;
  pageBackgrounds?: PageBackgroundConfig;
  homeDisplayConfig?: HomeDisplayConfig;
}

export interface ResourceGuide {
  id: string;
  title: string;
  category: 'guide-du-parange' | 'fiche-conseil' | 'temoignage' | 'capsule-psychoeducation';
  theme: DeuilTheme;
  targetAudience: AudienceType;
  summary: string;
  fullContent?: string;
  keyAdvice: string[];
  pdfDownloadUrl?: string;
  readTime: string;
}

export interface GardenFlower {
  id: string;
  authorName: string;
  isAnonymous: boolean;
  relationship: string; // Ex: "Pour mon Ange Rayan", "Pour notre bébé parti trop tôt"
  flowerType: 'tournesol' | 'myosotis' | 'rose' | 'lavande' | 'marguerite' | 'bougie';
  flowerColor: string;
  message: string;
  date: string;
  candlesCount: number;
  userLitCandle?: boolean;
}

export interface TrainingModule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetProfessionals: string;
  duration: string;
  format: string;
  objectives: string[];
  program: string[];
  pricePerPerson: string;
  nextDates: string[];
}

export interface TrainingRegistrationRequest {
  id: string;
  name: string;
  institution: string;
  email: string;
  phone: string;
  city: string;
  moduleCode: string;
  moduleTitle: string;
  participantsCount: number;
  message?: string;
  requestedAt: string;
  status: 'en_attente' | 'confirme' | 'en_cours' | 'termine' | 'annule';
  notes?: string;
}

export interface ConsultationRequest {
  fullName: string;
  email?: string;
  phone: string;
  city: string; // Abidjan, Bouaké, etc.
  userRole: 'parange' | 'fratrie' | 'proche' | 'soignant-relais';
  situationType: 'deces-enfant' | 'deuil-perinatal' | 'deces-fratrie' | 'autre';
  concernedPersonAge?: string;
  preferredContact: 'telephone' | 'whatsapp' | 'presentiel' | 'courriel';
  urgentListeningNeeded: boolean;
  message: string;
}

export interface BudgetItem {
  label: string;
  category?: string;
  detail: string;
  amountFCFA: number;
  percentage: string;
  annualAmountXOF?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  category: 'cheminement-paranges' | 'psychologie-trauma' | 'societe-et-culture' | 'papas-paranges' | 'fratrie-et-apres';
  categoryLabel: string;
  categoryLabelEn?: string;
  author: string;
  authorRole: string;
  authorRoleEn?: string;
  publishedAt: string;
  readTime: string;
  readTimeEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  coverImageUrl?: string;
  tags: string[];
  isFeatured?: boolean;
  likesCount?: number;
  comments?: BlogComment[];
}


export interface BlogComment {
  id: string;
  postId: string;
  postTitle?: string;
  authorName: string;
  authorRole?: 'parange' | 'proche' | 'soignant' | 'sympathisant';
  content: string;
  contentEn?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminReply?: string;
  adminReplyEn?: string;
}

export interface EventItem {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  date: string; // YYYY-MM-DD
  time: string; // Ex: "10h00 - 12h30"
  location: string; // Ex: "Abidjan - Cocody Angré" ou "En ligne (Zoom / Google Meet)"
  locationEn?: string;
  type: 'gsp' | 'atelier' | 'ceremonie' | 'conference' | 'commemoration';
  typeLabel: string;
  typeLabelEn?: string;
  isOnline: boolean;
  facilitators?: string;
  capacity?: number;
  registeredCount: number;
  registrationOpen: boolean;
  badgeColor?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  eventLocation: string;
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  userRole: 'maman-parange' | 'papa-parange' | 'couple' | 'fratrie' | 'proche' | 'soignant' | 'benevole' | 'autre';
  numberOfPeople: number;
  notes?: string;
  registeredAt: string;
  status: 'en_attente' | 'confirme' | 'annule' | 'present';
  urgencyLevel?: 'normale' | 'prioritaire' | 'haute';
  userName?: string;
  seats?: number;
}

export interface ForumCategory {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  iconName: string;
  accentColor: string;
  topicsCount: number;
}

export interface ForumReply {
  id: string;
  topicId: string;
  authorName: string;
  authorRole?: 'parange' | 'maman-parange' | 'papa-parange' | 'fratrie' | 'benevole' | 'psychologue';
  content: string;
  contentEn?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  likesCount?: number;
}

export interface ForumTopic {
  id: string;
  categoryId: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  authorName: string;
  authorRole?: 'parange' | 'maman-parange' | 'papa-parange' | 'fratrie' | 'benevole' | 'psychologue';
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  viewsCount: number;
  replies: ForumReply[];
  isPinned?: boolean;
}

export interface AdminNotificationMessage {
  id: string;
  type: 'ecoute_urgente' | 'rappel' | 'contact_general' | 'chat_direct' | 'forum_moderation' | 'commentaire_blog' | 'feedback' | 'event_registration' | 'adhesion' | 'demande_formation' | 'demande_aide';
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  senderCity?: string;
  subject: string;
  message: string;
  timestamp: string;
  urgencyLevel: 'critique' | 'haute' | 'normale';
  status: 'unread' | 'read' | 'traite' | 'handled' | 'archived';
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ConsultationFeedback {
  id: string;
  timestamp: string;
  dateFormatted: string;
  overallRating: number; // 1 to 5
  listeningEmpathy: number; // 1 to 5: Empathie & Respect de la douleur
  responseSpeed: number; // 1 to 5: Rapidité de la prise de contact
  reliefAndGuidance: number; // 1 to 5: Soulagement & Utilité des conseils
  sessionType: 'telephone' | 'chat_direct' | 'presentiel' | 'visio' | 'autre';
  sessionTypeLabel: string;
  respondentRole: 'parange' | 'fratrie' | 'proche' | 'soignant' | 'anonyme';
  respondentRoleLabel: string;
  respondentName?: string;
  respondentCity?: string;
  isAnonymous: boolean;
  wouldRecommend: boolean;
  feedbackText: string;
  improvementSuggestion?: string;
  status: 'nouveau' | 'lu' | 'traite';
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  ctaText?: string;
  ctaActionTab?: NavTab;
  ctaExternalUrl?: string;
  active: boolean;
  order: number;
  bgColor?: string;
}

export interface PromoBannerConfig {
  enabled: boolean;
  displayPlacement: 'accueil' | 'header' | 'all';
  autoplayDurationSeconds: number; // Ex: 6s
  banners: PromoBanner[];
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  donorCity?: string;
  amount: number;
  currency: 'FCFA' | 'EUR';
  paymentMethod: 'wave' | 'orange' | 'mtn' | 'card';
  date: string;
  purpose: string;
  status: 'confirme' | 'en_attente';
  message?: string;
  isAnonymous?: boolean;
}

export interface AccompanimentRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  userRole: 'parange' | 'fratrie' | 'proche' | 'soignant-relais';
  situationType: string;
  serviceRequested: string; // Ex: "Groupe de Soutien Psychologique (GSP)", "Consultation individuelle", "Consultation Mobile"
  preferredContact: 'telephone' | 'whatsapp' | 'presentiel' | 'visio';
  urgencyLevel: 'critique' | 'haute' | 'normale';
  requestDate: string;
  status: 'en_attente' | 'contacte' | 'en_cours' | 'cloture' | 'archive';
  notes?: string;
  assignedPsychologist?: string;

  // Reporting and compatibility fields
  beneficiaryName?: string;
  type?: string;
  channel?: string;
  urgency?: 'critique' | 'haute' | 'normale' | 'faible';
  location?: string;
  assignedReferent?: string;
  assignedVolunteer?: string;
  createdAt?: string;
  lastContactDate?: string;
  nextAppointmentDate?: string;
  sessionsCompleted?: number;
}

export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface EmotionalJournalEntry {
  id: string;
  date: string; // Format YYYY-MM-DD
  time?: string; // HH:mm
  moodScore: MoodScore; // 1 to 5
  moodEmoji: string; // '😭' | '😢' | '😐' | '🌤️' | '🕊️'
  moodLabel: string;
  emotions: string[];
  sleepQuality?: 'insomnie' | 'difficile' | 'moyen' | 'paisible';
  energyLevel?: number; // 1 to 5
  note?: string;
  angelMemory?: string;
  gratitude?: string;
  createdAt: string;
}

export type FAQCategory = 
  | 'tous'
  | 'demarches-ci'
  | 'psychologie-trauma'
  | 'couple-et-famille'
  | 'fratrie'
  | 'rituels-et-sanctuaire'
  | 'medical-et-maternite';

export interface FAQItem {
  id: string;
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
  category: FAQCategory;
  categoryLabel?: string;
  categoryLabelEn?: string;
  order: number;
  isPublished: boolean;
  helpfulCount?: number;
  tags?: string[];
  lastUpdated?: string;
}

export interface NewsSyncStatus {
  lastSyncTimestamp: string;
  sourceCount: number;
  sources: string[];
  isAutoSyncEnabled: boolean;
  syncIntervalHours: number;
  lastSyncSummary?: string;
}
