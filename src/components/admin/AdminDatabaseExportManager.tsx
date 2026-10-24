import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Download, 
  Search, 
  FileSpreadsheet, 
  FileCode, 
  FileText,
  Heart, 
  MessageSquare, 
  Flower2, 
  Quote, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Filter, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { 
  DonationRecord, 
  AdminNotificationMessage, 
  GardenFlower, 
  ParangeTestimony, 
  ForumTopic, 
  AccompanimentRecord,
  EventRegistration,
  EventItem
} from '../../types';
import { 
  telechargerCahierDesChargesPDF, 
  telechargerDossierPresentationPDF,
  downloadTechnicalSpecificationsPDF_EN,
  downloadStrategicPresentationPDF_EN
} from '../../utils/pdfGenerator';
import {
  exportAccompanimentsToCSV,
  exportAccompanimentsToExcel,
  exportEventRegistrationsToCSV,
  exportEventRegistrationsToExcel
} from '../../utils/monthlyReportingExport';

interface AdminDatabaseExportManagerProps {
  donations: DonationRecord[];
  notifications: AdminNotificationMessage[];
  flowers: GardenFlower[];
  testimonies: ParangeTestimony[];
  forumTopics: ForumTopic[];
  accompaniments: AccompanimentRecord[];
  eventRegistrations?: EventRegistration[];
  events?: EventItem[];
}

type DatabaseCategory = 'dons' | 'messages' | 'fleurs' | 'temoignages' | 'forum' | 'accompagnement' | 'inscriptions_evenements';

export const AdminDatabaseExportManager: React.FC<AdminDatabaseExportManagerProps> = ({
  donations,
  notifications,
  flowers,
  testimonies,
  forumTopics,
  accompaniments,
  eventRegistrations: incomingEventRegistrations = [],
  events = []
}) => {
  const [activeCategory, setActiveCategory] = useState<DatabaseCategory>('dons');
  const [reportingMonthFilter, setReportingMonthFilter] = useState<string>('all');

  // Fallback to localStorage if props are empty
  const resolvedEventRegistrations = useMemo(() => {
    if (incomingEventRegistrations && incomingEventRegistrations.length > 0) return incomingEventRegistrations;
    try {
      const saved = localStorage.getItem('jde_event_registrations');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [incomingEventRegistrations]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [downloadSuccessFeedback, setDownloadSuccessFeedback] = useState<string | null>(null);

  // Helper to trigger CSV download with UTF-8 BOM
  const triggerCsvDownload = (filename: string, csvContent: string) => {
    // BOM (\uFEFF) ensures Excel correctly displays accents (é, è, à, etc.)
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to trigger JSON download
  const triggerJsonDownload = (filename: string, jsonObject: any) => {
    const blob = new Blob([JSON.stringify(jsonObject, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Safe CSV field escape
  const escapeCsv = (str: any): string => {
    if (str === null || str === undefined) return '""';
    const clean = String(str).replace(/"/g, '""').replace(/\r?\n/g, ' ');
    return `"${clean}"`;
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // 1. Export CSV Dons
  const getDonationsCsv = (): string => {
    const headers = ['ID', 'Nom Donateur', 'Téléphone', 'Email', 'Ville', 'Montant', 'Devise', 'Moyen Paiement', 'Date', 'Affectation / Cause', 'Statut', 'Message'];
    const rows = donations.map(d => [
      escapeCsv(d.id),
      escapeCsv(d.donorName),
      escapeCsv(d.donorPhone),
      escapeCsv(d.donorEmail),
      escapeCsv(d.donorCity || 'Non renseigné'),
      escapeCsv(d.amount),
      escapeCsv(d.currency),
      escapeCsv(d.paymentMethod.toUpperCase()),
      escapeCsv(d.date),
      escapeCsv(d.purpose),
      escapeCsv(d.status),
      escapeCsv(d.message || '')
    ].join(';'));
    return [headers.join(';'), ...rows].join('\r\n');
  };

  // 2. Export CSV Messages
  const getMessagesCsv = (): string => {
    const headers = ['ID', 'Date', 'Expéditeur', 'Téléphone', 'Email', 'Ville', 'Type de Message', 'Niveau Urgence', 'Objet', 'Message Complet', 'Statut'];
    const rows = notifications.map(m => [
      escapeCsv(m.id),
      escapeCsv(m.timestamp),
      escapeCsv(m.senderName),
      escapeCsv(m.senderPhone),
      escapeCsv(m.senderEmail || 'Non renseigné'),
      escapeCsv(m.senderCity || 'Non renseigné'),
      escapeCsv(m.type),
      escapeCsv(m.urgencyLevel),
      escapeCsv(m.subject),
      escapeCsv(m.message),
      escapeCsv(m.status)
    ].join(';'));
    return [headers.join(';'), ...rows].join('\r\n');
  };

  // 3. Export CSV Fleurs
  const getFlowersCsv = (): string => {
    const headers = ['ID', 'Auteur / Parent', 'Statut Anonyme', 'Hommage / Pour l\'Ange', 'Type de Fleur', 'Couleur', 'Message d\'Amour', 'Date', 'Nombre Bougies'];
    const rows = flowers.map(f => [
      escapeCsv(f.id),
      escapeCsv(f.authorName),
      escapeCsv(f.isAnonymous ? 'Oui' : 'Non'),
      escapeCsv(f.relationship),
      escapeCsv(f.flowerType),
      escapeCsv(f.flowerColor),
      escapeCsv(f.message),
      escapeCsv(f.date),
      escapeCsv(f.candlesCount || 0)
    ].join(';'));
    return [headers.join(';'), ...rows].join('\r\n');
  };

  // 4. Export CSV Témoignages
  const getTestimoniesCsv = (): string => {
    const headers = ['ID', 'Auteur', 'Rôle', 'Nom de l\'Ange', 'Ville', 'Date / Période', 'Titre', 'Récit Témoignage', 'Message d\'Espoir', 'Statut Modération', 'Bougies Allumées', 'Soutiens Reçus', 'Date Dépôt'];
    const rows = testimonies.map(t => [
      escapeCsv(t.id),
      escapeCsv(t.authorName),
      escapeCsv(t.authorRole),
      escapeCsv(t.childName || 'Non renseigné'),
      escapeCsv(t.city || 'Non renseigné'),
      escapeCsv(t.yearOrDate),
      escapeCsv(t.title),
      escapeCsv(t.story),
      escapeCsv(t.hopeMessage || ''),
      escapeCsv(t.status),
      escapeCsv(t.candlesLitCount || 0),
      escapeCsv(t.likesCount || 0),
      escapeCsv(t.createdAt)
    ].join(';'));
    return [headers.join(';'), ...rows].join('\r\n');
  };

  // 5. Export CSV Forum
  const getForumCsv = (): string => {
    const headers = ['ID Sujet', 'Catégorie ID', 'Titre Sujet', 'Auteur Sujet', 'Rôle Auteur', 'Date Sujet', 'Statut Modération', 'Nombre Vues', 'Nombre Réponses', 'Contenu Sujet', 'Détail Réponses (Auteurs & Textes)'];
    const rows = forumTopics.map(topic => {
      const repliesSummary = topic.replies && topic.replies.length > 0
        ? topic.replies.map(r => `[${r.authorName} (${r.createdAt})]: ${r.content}`).join(' || ')
        : 'Aucune réponse';

      return [
        escapeCsv(topic.id),
        escapeCsv(topic.categoryId),
        escapeCsv(topic.title),
        escapeCsv(topic.authorName),
        escapeCsv(topic.authorRole || 'Membre'),
        escapeCsv(topic.createdAt),
        escapeCsv(topic.status),
        escapeCsv(topic.viewsCount),
        escapeCsv(topic.replies ? topic.replies.length : 0),
        escapeCsv(topic.content),
        escapeCsv(repliesSummary)
      ].join(';');
    });
    return [headers.join(';'), ...rows].join('\r\n');
  };

  // 6. Export CSV Accompagnement
  const getAccompanimentsCsv = (): string => {
    const headers = ['ID', 'Nom & Prénom', 'Téléphone', 'Email', 'Ville', 'Rôle', 'Situation / Type de Deuil', 'Service Sollicité', 'Mode de Contact Souhaité', 'Niveau Urgence', 'Date Demande', 'Statut Prise en Charge', 'Notes Internes', 'Psychologue / Référent'];
    const rows = accompaniments.map(a => [
      escapeCsv(a.id),
      escapeCsv(a.fullName),
      escapeCsv(a.phone),
      escapeCsv(a.email || 'Non renseigné'),
      escapeCsv(a.city),
      escapeCsv(a.userRole),
      escapeCsv(a.situationType),
      escapeCsv(a.serviceRequested),
      escapeCsv(a.preferredContact),
      escapeCsv(a.urgencyLevel),
      escapeCsv(a.requestDate),
      escapeCsv(a.status),
      escapeCsv(a.notes || ''),
      escapeCsv(a.assignedPsychologist || 'Non attribué')
    ].join(';'));
    return [headers.join(';'), ...rows].join('\r\n');
  };

  // 7. Export CSV Inscriptions aux Événements
  const getEventRegistrationsCsv = (): string => {
    const headers = [
      'ID Inscription',
      'Date Inscription',
      'Date Événement',
      'Heure',
      'Titre Événement',
      'Lieu',
      'Nom Participant',
      'Téléphone',
      'Email',
      'Ville',
      'Rôle / Statut',
      'Places Réservées',
      'Statut Inscription',
      'Urgence',
      'Notes'
    ];
    const rows = resolvedEventRegistrations.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.registeredAt ? r.registeredAt.replace('T', ' ').slice(0, 16) : ''),
      escapeCsv(r.eventDate),
      escapeCsv(r.eventTime || ''),
      escapeCsv(r.eventTitle),
      escapeCsv(r.eventLocation),
      escapeCsv(r.fullName),
      escapeCsv(r.phone),
      escapeCsv(r.email || 'Non renseigné'),
      escapeCsv(r.city || 'Abidjan'),
      escapeCsv(r.userRole),
      escapeCsv(r.numberOfPeople || 1),
      escapeCsv(r.status),
      escapeCsv(r.urgencyLevel || 'normale'),
      escapeCsv(r.notes || '')
    ].join(';'));
    return [headers.join(';'), ...rows].join('\r\n');
  };

  // Handlers for active category download
  const handleDownloadActiveCsv = () => {
    let filename = '';
    let content = '';

    switch (activeCategory) {
      case 'dons':
        filename = `Jardin_Espoir_Donateurs_${todayStr}.csv`;
        content = getDonationsCsv();
        break;
      case 'messages':
        filename = `Jardin_Espoir_Messages_Contacts_${todayStr}.csv`;
        content = getMessagesCsv();
        break;
      case 'fleurs':
        filename = `Jardin_Espoir_Fleurs_Semees_Anges_${todayStr}.csv`;
        content = getFlowersCsv();
        break;
      case 'temoignages':
        filename = `Jardin_Espoir_Temoignages_Paranges_${todayStr}.csv`;
        content = getTestimoniesCsv();
        break;
      case 'forum':
        filename = `Jardin_Espoir_Forum_Discussions_${todayStr}.csv`;
        content = getForumCsv();
        break;
      case 'accompagnement':
        filename = `Jardin_Espoir_Services_Accompagnement_${todayStr}.csv`;
        content = getAccompanimentsCsv();
        break;
      case 'inscriptions_evenements':
        filename = `Jardin_Espoir_Inscriptions_Evenements_${todayStr}.csv`;
        content = getEventRegistrationsCsv();
        break;
    }

    triggerCsvDownload(filename, content);
    showDownloadSuccess(`Fichier CSV « ${filename} » généré et téléchargé avec succès.`);
  };

  const handleDownloadActiveJson = () => {
    let filename = '';
    let data: any = null;

    switch (activeCategory) {
      case 'dons':
        filename = `Jardin_Espoir_Donateurs_${todayStr}.json`;
        data = { exportDate: new Date().toISOString(), total: donations.length, donations };
        break;
      case 'messages':
        filename = `Jardin_Espoir_Messages_Contacts_${todayStr}.json`;
        data = { exportDate: new Date().toISOString(), total: notifications.length, messages: notifications };
        break;
      case 'fleurs':
        filename = `Jardin_Espoir_Fleurs_Semees_Anges_${todayStr}.json`;
        data = { exportDate: new Date().toISOString(), total: flowers.length, flowers };
        break;
      case 'temoignages':
        filename = `Jardin_Espoir_Temoignages_Paranges_${todayStr}.json`;
        data = { exportDate: new Date().toISOString(), total: testimonies.length, testimonies };
        break;
      case 'forum':
        filename = `Jardin_Espoir_Forum_Discussions_${todayStr}.json`;
        data = { exportDate: new Date().toISOString(), total: forumTopics.length, forumTopics };
        break;
      case 'accompagnement':
        filename = `Jardin_Espoir_Services_Accompagnement_${todayStr}.json`;
        data = { exportDate: new Date().toISOString(), total: accompaniments.length, accompaniments };
        break;
      case 'inscriptions_evenements':
        filename = `Jardin_Espoir_Inscriptions_Evenements_${todayStr}.json`;
        data = { exportDate: new Date().toISOString(), total: resolvedEventRegistrations.length, registrations: resolvedEventRegistrations };
        break;
    }

    triggerJsonDownload(filename, data);
    showDownloadSuccess(`Fichier JSON « ${filename} » généré et téléchargé.`);
  };

  // Master multi-file export (downloads all 6 tables sequentially)
  const handleExportAllCsv = () => {
    const exports = [
      { name: `01_Jardin_Espoir_Donateurs_${todayStr}.csv`, content: getDonationsCsv() },
      { name: `02_Jardin_Espoir_Messages_Contacts_${todayStr}.csv`, content: getMessagesCsv() },
      { name: `03_Jardin_Espoir_Fleurs_Jardin_Virtuel_${todayStr}.csv`, content: getFlowersCsv() },
      { name: `04_Jardin_Espoir_Temoignages_Paranges_${todayStr}.csv`, content: getTestimoniesCsv() },
      { name: `05_Jardin_Espoir_Forum_Discussions_${todayStr}.csv`, content: getForumCsv() },
      { name: `06_Jardin_Espoir_Demandes_Accompagnement_${todayStr}.csv`, content: getAccompanimentsCsv() },
    ];

    exports.forEach((item, index) => {
      setTimeout(() => {
        triggerCsvDownload(item.name, item.content);
      }, index * 400);
    });

    showDownloadSuccess(`Pack complet de 6 fichiers CSV généré et téléchargé dans vos Téléchargements !`);
  };

  const handleExportAllJson = () => {
    const fullBackup = {
      platform: 'Le Jardin de l\'Espoir : Parange CI',
      exportTimestamp: new Date().toISOString(),
      summaryStats: {
        totalDonations: donations.length,
        totalMessages: notifications.length,
        totalFlowers: flowers.length,
        totalTestimonies: testimonies.length,
        totalForumTopics: forumTopics.length,
        totalAccompaniments: accompaniments.length
      },
      databases: {
        donations,
        messages: notifications,
        virtualFlowers: flowers,
        testimonies,
        forumTopics,
        accompanimentRequests: accompaniments
      }
    };

    triggerJsonDownload(`Jardin_Espoir_BACKUP_GLOBAL_COMPLET_${todayStr}.json`, fullBackup);
    showDownloadSuccess(`Backup global complet (JSON) téléchargé avec succès.`);
  };

  const showDownloadSuccess = (msg: string) => {
    setDownloadSuccessFeedback(msg);
    setTimeout(() => {
      setDownloadSuccessFeedback(null);
    }, 4500);
  };

  // Filtered view data
  const filteredDonations = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return donations;
    return donations.filter(d => 
      d.donorName.toLowerCase().includes(q) ||
      d.donorPhone.toLowerCase().includes(q) ||
      d.donorEmail.toLowerCase().includes(q) ||
      d.purpose.toLowerCase().includes(q) ||
      (d.message && d.message.toLowerCase().includes(q))
    );
  }, [donations, searchTerm]);

  const filteredMessages = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return notifications;
    return notifications.filter(m => 
      m.senderName.toLowerCase().includes(q) ||
      m.senderPhone.toLowerCase().includes(q) ||
      (m.senderEmail && m.senderEmail.toLowerCase().includes(q)) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  }, [notifications, searchTerm]);

  const filteredFlowers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return flowers;
    return flowers.filter(f => 
      f.authorName.toLowerCase().includes(q) ||
      f.relationship.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q)
    );
  }, [flowers, searchTerm]);

  const filteredTestimonies = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return testimonies;
    return testimonies.filter(t => 
      t.authorName.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.story.toLowerCase().includes(q) ||
      (t.childName && t.childName.toLowerCase().includes(q))
    );
  }, [testimonies, searchTerm]);

  const filteredForum = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return forumTopics;
    return forumTopics.filter(topic => 
      topic.title.toLowerCase().includes(q) ||
      topic.authorName.toLowerCase().includes(q) ||
      topic.content.toLowerCase().includes(q)
    );
  }, [forumTopics, searchTerm]);

  const filteredAccompaniments = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return accompaniments;
    return accompaniments.filter(a => 
      a.fullName.toLowerCase().includes(q) ||
      a.phone.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.serviceRequested.toLowerCase().includes(q) ||
      a.situationType.toLowerCase().includes(q)
    );
  }, [accompaniments, searchTerm]);

  // Total funds calculated
  const totalFundsFcfa = useMemo(() => {
    return donations
      .filter(d => d.currency === 'FCFA')
      .reduce((acc, d) => acc + d.amount, 0);
  }, [donations]);

  const totalFundsEur = useMemo(() => {
    return donations
      .filter(d => d.currency === 'EUR')
      .reduce((acc, d) => acc + d.amount, 0);
  }, [donations]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Database className="w-3.5 h-3.5" />
            <span>Gestion Sécurisée & Extraction des Données</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white tracking-tight">
            Base de Données & Téléchargements Officiels
          </h2>

          <p className="text-emerald-100/85 text-sm sm:text-base leading-relaxed">
            Consultez, filtrez et exportez en format universel <strong>CSV (compatible Excel UTF-8)</strong> ou <strong>JSON</strong> l'ensemble des données de l'ONG : bienfaiteurs et donateurs, messages reçus, fleurs du souvenir, témoignages des paranges, participants du forum et demandes d'accompagnement.
          </p>

          {/* Quick Action Pack Download */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={handleExportAllCsv}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Tout Télécharger (Pack 6 Fichiers CSV Excel)</span>
            </button>

            <button
              onClick={handleExportAllJson}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              <span>Backup Global Complet (JSON)</span>
            </button>

            <button
              onClick={() => {
                telechargerCahierDesChargesPDF();
                showDownloadSuccess("Cahier des Charges (FR) téléchargé avec succès (PDF).");
              }}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-emerald-400/40 transition-all cursor-pointer"
              title="Cahier des Charges Fonctionnel & Technique en Français"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Cahier des Charges (FR)</span>
            </button>

            <button
              onClick={() => {
                downloadTechnicalSpecificationsPDF_EN();
                showDownloadSuccess("Technical Specifications (EN) downloaded successfully (PDF).");
              }}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-emerald-400/40 transition-all cursor-pointer"
              title="Functional & Technical Specifications in English"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>Technical Specs (EN)</span>
            </button>

            <button
              onClick={() => {
                telechargerDossierPresentationPDF();
                showDownloadSuccess("Dossier de Présentation Stratégique (FR) téléchargé avec succès (PDF).");
              }}
              className="px-3.5 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-teal-400/40 transition-all cursor-pointer"
              title="Dossier de Présentation Stratégique en Français"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Présentation (FR)</span>
            </button>

            <button
              onClick={() => {
                downloadStrategicPresentationPDF_EN();
                showDownloadSuccess("Strategic Presentation Dossier (EN) downloaded successfully (PDF).");
              }}
              className="px-3.5 py-2.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-teal-400/40 transition-all cursor-pointer"
              title="Strategic Presentation Dossier & Impact Deck in English"
            >
              <Download className="w-4 h-4 text-teal-300" />
              <span>Strategic Dossier (EN)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success alert banner */}
      {downloadSuccessFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center gap-3 shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{downloadSuccessFeedback}</span>
        </div>
      )}

      {/* MODULE REPORTING MENSUEL : EXPORT CSV & EXCEL SPÉCIFIQUE */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Module de Reporting Mensuel • Formats CSV & Excel</span>
            </div>
            <h3 className="text-xl font-bold font-serif-accent text-stone-900">
              Extraction Simplifiée pour Rapports Mensuels & Bailleurs
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Téléchargez en 1 clic les dossiers d'accompagnement et les inscriptions aux événements sous forme de tableurs Excel (.xls) avec titres et styles officiels ou fichiers CSV universels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-stone-700 whitespace-nowrap">Période / Mois :</label>
            <select
              value={reportingMonthFilter}
              onChange={(e) => setReportingMonthFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">Tous les mois (Bilan Global)</option>
              {(() => {
                const s = new Set<string>();
                accompaniments.forEach((a) => {
                  if (a.requestDate && a.requestDate.length >= 7) s.add(a.requestDate.slice(0, 7));
                });
                resolvedEventRegistrations.forEach((r) => {
                  if (r.eventDate && r.eventDate.length >= 7) s.add(r.eventDate.slice(0, 7));
                });
                return Array.from(s).sort().reverse().map((m) => (
                  <option key={m} value={m}>Mois de {m}</option>
                ));
              })()}
            </select>
          </div>
        </div>

        {/* 4 Action Cards for Monthly Reporting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Accompagnements Excel */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                Excel .XLS
              </span>
              <h4 className="font-bold text-stone-900 text-sm mt-1.5">
                Demandes d'Accompagnement
              </h4>
              <p className="text-[11px] text-stone-600 mt-1">
                Tableur formaté avec styles verts, statuts, rôles, urgences et psychologues assignés.
              </p>
            </div>
            <button
              onClick={() => {
                exportAccompanimentsToExcel(accompaniments, reportingMonthFilter);
                showDownloadSuccess(`Reporting Accompagnement (Excel .XLS) téléchargé pour la période : ${reportingMonthFilter}`);
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Exporter Excel (.XLS)</span>
            </button>
          </div>

          {/* 2. Accompagnements CSV */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                CSV UTF-8
              </span>
              <h4 className="font-bold text-stone-900 text-sm mt-1.5">
                Accompagnements (CSV)
              </h4>
              <p className="text-[11px] text-stone-600 mt-1">
                Fichier délimité point-virgule compatible Excel, Numbers et Google Sheets.
              </p>
            </div>
            <button
              onClick={() => {
                exportAccompanimentsToCSV(accompaniments, reportingMonthFilter);
                showDownloadSuccess(`Reporting Accompagnement (CSV) téléchargé pour la période : ${reportingMonthFilter}`);
              }}
              className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Exporter CSV</span>
            </button>
          </div>

          {/* 3. Inscriptions Événements Excel */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md">
                Excel .XLS
              </span>
              <h4 className="font-bold text-stone-900 text-sm mt-1.5">
                Inscriptions aux Événements
              </h4>
              <p className="text-[11px] text-stone-600 mt-1">
                Roster mensuel complet des participants aux cercles GSP, ateliers et webinaires.
              </p>
            </div>
            <button
              onClick={() => {
                exportEventRegistrationsToExcel(resolvedEventRegistrations, events, reportingMonthFilter);
                showDownloadSuccess(`Reporting Inscriptions Événements (Excel .XLS) téléchargé pour la période : ${reportingMonthFilter}`);
              }}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-stone-950" />
              <span>Exporter Excel (.XLS)</span>
            </button>
          </div>

          {/* 4. Inscriptions Événements CSV */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                CSV UTF-8
              </span>
              <h4 className="font-bold text-stone-900 text-sm mt-1.5">
                Inscriptions Événements (CSV)
              </h4>
              <p className="text-[11px] text-stone-600 mt-1">
                Export brut pour import CRM, bases de données ou reporting bailleurs multilatéraux.
              </p>
            </div>
            <button
              onClick={() => {
                exportEventRegistrationsToCSV(resolvedEventRegistrations, events, reportingMonthFilter);
                showDownloadSuccess(`Reporting Inscriptions Événements (CSV) téléchargé pour la période : ${reportingMonthFilter}`);
              }}
              className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Exporter CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Statistics Cards (7 Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 1. Dons */}
        <button
          onClick={() => setActiveCategory('dons')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeCategory === 'dons'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-amber-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              {donations.length}
            </span>
          </div>
          <div className="text-xs font-semibold text-stone-700 truncate">1. Dons & Donateurs</div>
          <div className="text-[10px] text-stone-500 font-mono mt-0.5">
            {totalFundsFcfa > 0 ? `${totalFundsFcfa.toLocaleString('fr-FR')} F` : ''}
          </div>
        </button>

        {/* 2. Messages */}
        <button
          onClick={() => setActiveCategory('messages')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeCategory === 'messages'
              ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-sky-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          </div>
          <div className="text-xs font-semibold text-stone-700 truncate">2. Messages Reçus</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Contacts & Urgences</div>
        </button>

        {/* 3. Fleurs */}
        <button
          onClick={() => setActiveCategory('fleurs')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeCategory === 'fleurs'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-emerald-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Flower2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {flowers.length}
            </span>
          </div>
          <div className="text-xs font-semibold text-stone-700 truncate">3. Fleurs des Anges</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Jardin Virtuel</div>
        </button>

        {/* 4. Témoignages */}
        <button
          onClick={() => setActiveCategory('temoignages')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeCategory === 'temoignages'
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-purple-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Quote className="w-4 h-4 text-purple-600" />
            <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
              {testimonies.length}
            </span>
          </div>
          <div className="text-xs font-semibold text-stone-700 truncate">4. Témoignages</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Récits Paranges</div>
        </button>

        {/* 5. Forum */}
        <button
          onClick={() => setActiveCategory('forum')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeCategory === 'forum'
              ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-indigo-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">
              {forumTopics.length}
            </span>
          </div>
          <div className="text-xs font-semibold text-stone-700 truncate">5. Forum Entraide</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Discussions</div>
        </button>

        {/* 6. Accompagnement */}
        <button
          onClick={() => setActiveCategory('accompagnement')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeCategory === 'accompagnement'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-rose-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
              {accompaniments.length}
            </span>
          </div>
          <div className="text-xs font-semibold text-stone-700 truncate">6. Accompagnement</div>
          <div className="text-[10px] text-stone-500 mt-0.5">GSP & Suivis</div>
        </button>

        {/* 7. Inscriptions Événements */}
        <button
          onClick={() => setActiveCategory('inscriptions_evenements')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeCategory === 'inscriptions_evenements'
              ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-teal-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
              {resolvedEventRegistrations.length}
            </span>
          </div>
          <div className="text-xs font-semibold text-stone-700 truncate">7. Inscriptions Événements</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Participants</div>
        </button>
      </div>

      {/* Main Database Table & Controls Section */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        
        {/* Category Header & Export Buttons */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Base sélectionnée :
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif-accent">
                {activeCategory === 'dons' && '1. Tous ceux qui ont bien voulu laisser un don'}
                {activeCategory === 'messages' && '2. Tous ceux qui ont laissé des messages'}
                {activeCategory === 'fleurs' && '3. Tous ceux qui ont semé une fleur pour leur ange'}
                {activeCategory === 'temoignages' && '4. Tous ceux qui ont déposé un témoignage'}
                {activeCategory === 'forum' && '5. Tous les participants et sujets du forum'}
                {activeCategory === 'accompagnement' && '6. Tous ceux qui ont eu recours aux services d\'accompagnement'}
                {activeCategory === 'inscriptions_evenements' && '7. Tous les inscrits aux rencontres, GSP et ateliers'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Exportation directe pour vos bilans, rapports d'activité, rapports de donateurs et gestion d'équipe.
            </p>
          </div>

          {/* Download Buttons for Current Category */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleDownloadActiveCsv}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              title="Télécharger le fichier CSV encodé UTF-8 compatible Excel avec tous les accents"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Télécharger CSV (Excel)</span>
            </button>

            <button
              onClick={handleDownloadActiveJson}
              className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-stone-300 transition-all cursor-pointer"
              title="Télécharger les données brutes au format JSON"
            >
              <FileCode className="w-4 h-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, téléphone, mot-clé..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
            />
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Affichage de{' '}
            <strong className="text-stone-900">
              {activeCategory === 'dons' && filteredDonations.length}
              {activeCategory === 'messages' && filteredMessages.length}
              {activeCategory === 'fleurs' && filteredFlowers.length}
              {activeCategory === 'temoignages' && filteredTestimonies.length}
              {activeCategory === 'forum' && filteredForum.length}
              {activeCategory === 'accompagnement' && filteredAccompaniments.length}
            </strong>{' '}
            entrées
          </div>
        </div>

        {/* Live Table Preview */}
        <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
          
          {/* 1. TABLEAU DONS */}
          {activeCategory === 'dons' && (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-stone-100/80 sticky top-0 z-10 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Donateur</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Montant & Moyen</th>
                  <th className="py-3 px-4">Cause / Affectation</th>
                  <th className="py-3 px-4">Message déposé</th>
                  <th className="py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      Aucun donateur trouvé pour cette recherche.
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((don) => (
                    <tr key={don.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 text-stone-500 font-mono text-xs whitespace-nowrap">
                        {don.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {don.donorName}
                        {don.isAnonymous && (
                          <span className="ml-1.5 text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-full">
                            Anonyme
                          </span>
                        )}
                        <div className="text-[11px] text-stone-400 font-normal">{don.donorCity || "Côte d'Ivoire"}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        <div>{don.donorPhone}</div>
                        <div className="text-[11px] text-stone-400">{don.donorEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-800 text-sm">
                          {don.amount.toLocaleString('fr-FR')} {don.currency}
                        </span>
                        <div className="text-[11px] font-semibold text-stone-500 uppercase">
                          Via {don.paymentMethod}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs text-xs">
                        {don.purpose}
                      </td>
                      <td className="py-3 px-4 text-stone-500 max-w-xs italic text-xs">
                        {don.message || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          Confirmé
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 2. TABLEAU MESSAGES */}
          {activeCategory === 'messages' && (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-stone-100/80 sticky top-0 z-10 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Expéditeur</th>
                  <th className="py-3 px-4">Contact & Ville</th>
                  <th className="py-3 px-4">Type / Urgence</th>
                  <th className="py-3 px-4">Objet</th>
                  <th className="py-3 px-4">Message Complet</th>
                  <th className="py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      Aucun message trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 text-stone-500 font-mono text-xs whitespace-nowrap">
                        {msg.timestamp}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {msg.senderName}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        <div>{msg.senderPhone}</div>
                        <div className="text-[11px] text-stone-400">{msg.senderCity || "Côte d'Ivoire"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          msg.urgencyLevel === 'critique' 
                            ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-400' 
                            : msg.urgencyLevel === 'haute'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {msg.urgencyLevel}
                        </span>
                        <div className="text-[11px] text-stone-500 mt-0.5">{msg.type}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-800 max-w-xs text-xs">
                        {msg.subject}
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-md text-xs whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          msg.status === 'unread'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {msg.status === 'unread' ? 'Nouveau' : 'Traité'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 3. TABLEAU FLEURS POUR LES ANGES */}
          {activeCategory === 'fleurs' && (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-stone-100/80 sticky top-0 z-10 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Parent / Auteur</th>
                  <th className="py-3 px-4">Hommage pour l'Ange</th>
                  <th className="py-3 px-4">Fleur Semée</th>
                  <th className="py-3 px-4">Message d'Amour</th>
                  <th className="py-3 px-4">Bougies Reçues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredFlowers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      Aucune fleur trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredFlowers.map((fl) => (
                    <tr key={fl.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 text-stone-500 text-xs whitespace-nowrap">
                        {fl.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {fl.authorName}
                        {fl.isAnonymous && (
                          <span className="ml-1.5 text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-full">
                            Anonyme
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-emerald-900">
                        {fl.relationship}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-3 h-3 rounded-full shrink-0" 
                            style={{ backgroundColor: fl.flowerColor || '#10B981' }} 
                          />
                          <span className="capitalize font-medium text-stone-800">{fl.flowerType}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-md text-xs italic leading-relaxed">
                        « {fl.message} »
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-700">
                        🕯️ {fl.candlesCount || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 4. TABLEAU TÉMOIGNAGES PARANGES */}
          {activeCategory === 'temoignages' && (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-stone-100/80 sticky top-0 z-10 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Auteur & Rôle</th>
                  <th className="py-3 px-4">Ange & Ville</th>
                  <th className="py-3 px-4">Titre du Récit</th>
                  <th className="py-3 px-4">Récit & Message d'Espoir</th>
                  <th className="py-3 px-4">Interactions</th>
                  <th className="py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTestimonies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      Aucun témoignage trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredTestimonies.map((t) => (
                    <tr key={t.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 text-stone-500 text-xs whitespace-nowrap">
                        {t.createdAt}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {t.authorName}
                        <div className="text-[11px] text-purple-700 font-medium capitalize">
                          {t.authorRole}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        <div className="font-semibold text-stone-900">{t.childName || 'Ange au paradis'}</div>
                        <div className="text-[11px] text-stone-400">{t.city || "Côte d'Ivoire"} • {t.yearOrDate}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900 max-w-xs text-xs">
                        {t.title}
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-md text-xs leading-relaxed">
                        <p className="line-clamp-3">{t.story}</p>
                        {t.hopeMessage && (
                          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
                            🌟 Espoir : {t.hopeMessage}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-600 text-xs whitespace-nowrap">
                        <div>🕯️ {t.candlesLitCount || 0} bougies</div>
                        <div>🤍 {t.likesCount || 0} soutiens</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          t.status === 'approuve'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'rejete'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status === 'approuve' ? 'Publié' : t.status === 'rejete' ? 'Rejeté' : 'En attente'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 5. TABLEAU FORUM */}
          {activeCategory === 'forum' && (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-stone-100/80 sticky top-0 z-10 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Titre du Sujet</th>
                  <th className="py-3 px-4">Auteur</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Contenu du Message</th>
                  <th className="py-3 px-4">Réponses & Vues</th>
                  <th className="py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredForum.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      Aucune discussion trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredForum.map((topic) => (
                    <tr key={topic.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 text-stone-500 text-xs whitespace-nowrap">
                        {topic.createdAt}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900 max-w-xs">
                        {topic.title}
                        {topic.isPinned && (
                          <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-sm font-semibold">
                            Épinglé
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {topic.authorName}
                        <div className="text-[11px] text-stone-400 font-normal">{topic.authorRole || 'Membre'}</div>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-indigo-700">
                        {topic.categoryId}
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-md text-xs leading-relaxed">
                        <p className="line-clamp-2">{topic.content}</p>
                        {topic.replies && topic.replies.length > 0 && (
                          <div className="text-[11px] text-stone-400 mt-1">
                            Dernière réponse par {topic.replies[topic.replies.length - 1].authorName}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-600 whitespace-nowrap">
                        <div>💬 {topic.replies ? topic.replies.length : 0} réponses</div>
                        <div>👁️ {topic.viewsCount} vues</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          {topic.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 6. TABLEAU RECOURS ACCOMPAGNEMENT */}
          {activeCategory === 'accompagnement' && (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-stone-100/80 sticky top-0 z-10 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Date Demande</th>
                  <th className="py-3 px-4">Demandeur</th>
                  <th className="py-3 px-4">Contact & Ville</th>
                  <th className="py-3 px-4">Situation / Type de Deuil</th>
                  <th className="py-3 px-4">Service Sollicité</th>
                  <th className="py-3 px-4">Mode & Urgence</th>
                  <th className="py-3 px-4">Statut Prise en Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredAccompaniments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      Aucune demande d'accompagnement trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredAccompaniments.map((acc) => (
                    <tr key={acc.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 text-stone-500 font-mono text-xs whitespace-nowrap">
                        {acc.requestDate}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {acc.fullName}
                        <div className="text-[11px] text-rose-700 font-medium capitalize">
                          {acc.userRole}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        <div>{acc.phone}</div>
                        <div className="text-[11px] text-stone-400">{acc.city}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-800 max-w-xs text-xs font-medium">
                        {acc.situationType}
                      </td>
                      <td className="py-3 px-4 text-emerald-900 max-w-xs text-xs font-semibold">
                        {acc.serviceRequested}
                        {acc.assignedPsychologist && (
                          <div className="text-[10px] text-stone-400 font-normal mt-0.5">
                            Suivi par : {acc.assignedPsychologist}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          acc.urgencyLevel === 'critique'
                            ? 'bg-rose-100 text-rose-800'
                            : acc.urgencyLevel === 'haute'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {acc.urgencyLevel}
                        </span>
                        <div className="text-[11px] text-stone-500 capitalize mt-0.5">
                          Par {acc.preferredContact}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          acc.status === 'en_cours'
                            ? 'bg-emerald-100 text-emerald-800'
                            : acc.status === 'contacte'
                            ? 'bg-sky-100 text-sky-800'
                            : acc.status === 'cloture'
                            ? 'bg-stone-100 text-stone-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {acc.status === 'en_cours' ? 'En cours de suivi' : acc.status === 'contacte' ? 'Contacté' : acc.status === 'cloture' ? 'Clôturé' : 'En attente'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

        </div>

        {/* Footer information */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            💡 <strong>Astuce Excel :</strong> Le fichier CSV est encodé avec un préfixe universel UTF-8 BOM pour garantir l'affichage sans faute de tous les caractères spéciaux et accents français.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadActiveCsv}
              className="text-emerald-800 font-bold hover:underline cursor-pointer"
            >
              Télécharger CSV actif
            </button>
            <span>•</span>
            <button
              onClick={handleExportAllCsv}
              className="text-amber-700 font-bold hover:underline cursor-pointer"
            >
              Télécharger tout (Pack)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
