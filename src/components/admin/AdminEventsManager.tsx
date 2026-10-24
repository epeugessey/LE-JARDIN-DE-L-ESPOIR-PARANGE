import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  MapPin, 
  Clock, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MessageSquare, 
  Download, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  UserPlus, 
  Eye, 
  Globe, 
  UserCheck, 
  ExternalLink,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { EventItem, EventRegistration } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { exportEventRegistrationsToCSV, exportEventRegistrationsToExcel } from '../../utils/monthlyReportingExport';

interface AdminEventsManagerProps {
  events: EventItem[];
  eventRegistrations: EventRegistration[];
  onAddEvent: (event: EventItem) => void;
  onUpdateEvent: (event: EventItem) => void;
  onDeleteEvent: (id: string) => void;
  onAddRegistration: (reg: EventRegistration) => void;
  onUpdateRegistrationStatus: (id: string, status: EventRegistration['status']) => void;
  onDeleteRegistration: (id: string) => void;
}

export const AdminEventsManager: React.FC<AdminEventsManagerProps> = ({
  events,
  eventRegistrations,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddRegistration,
  onUpdateRegistrationStatus,
  onDeleteRegistration
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(events[0]?.id || null);
  const [exportMonthFilter, setExportMonthFilter] = useState<string>('all');

  const availableEventMonths = useMemo(() => {
    const s = new Set<string>();
    events.forEach(e => {
      if (e.date && e.date.length >= 7) s.add(e.date.slice(0, 7));
    });
    eventRegistrations.forEach(r => {
      if (r.eventDate && r.eventDate.length >= 7) s.add(r.eventDate.slice(0, 7));
    });
    return Array.from(s).sort().reverse();
  }, [events, eventRegistrations]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [manualRegEvent, setManualRegEvent] = useState<EventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Event Form State
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '10h00 - 12h30 GMT',
    location: 'Cocody Angré, Abidjan',
    type: 'gsp' as EventItem['type'],
    typeLabel: 'Groupe de parole',
    isOnline: false,
    facilitators: 'Psychologue référente & Équipe d\'écoute',
    capacity: 15,
    registrationOpen: true,
    badgeColor: 'emerald'
  });

  // Manual Attendee Form State
  const [manualAttendee, setManualAttendee] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Abidjan',
    userRole: 'maman-parange' as EventRegistration['userRole'],
    numberOfPeople: 1,
    notes: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchesType = selectedType === 'all' || evt.type === selectedType;
      const matchesSearch = 
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.facilitators && evt.facilitators.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesTime = true;
      if (statusFilter === 'upcoming') {
        matchesTime = evt.date >= todayStr;
      } else if (statusFilter === 'past') {
        matchesTime = evt.date < todayStr;
      }

      return matchesType && matchesSearch && matchesTime;
    });
  }, [events, selectedType, searchQuery, statusFilter, todayStr]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const upcomingCount = events.filter(e => e.date >= todayStr).length;
    const totalRegistrations = eventRegistrations.length;
    const pendingRegistrations = eventRegistrations.filter(r => r.status === 'en_attente').length;
    const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
    const totalAttendeesSum = eventRegistrations.filter(r => r.status !== 'annule').reduce((sum, r) => sum + (r.numberOfPeople || 1), 0);
    return {
      totalEvents,
      upcomingCount,
      totalRegistrations,
      pendingRegistrations,
      totalCapacity,
      totalAttendeesSum
    };
  }, [events, eventRegistrations, todayStr]);

  // Handle Create Event
  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title.trim() || !newEventForm.date) {
      showToast('Veuillez remplir le titre et la date de l\'événement.');
      return;
    }

    const created: EventItem = {
      id: `evt-${Date.now()}`,
      title: newEventForm.title.trim(),
      description: newEventForm.description.trim(),
      date: newEventForm.date,
      time: newEventForm.time,
      location: newEventForm.location,
      type: newEventForm.type,
      typeLabel: newEventForm.typeLabel,
      isOnline: newEventForm.isOnline,
      facilitators: newEventForm.facilitators,
      capacity: Number(newEventForm.capacity) || 15,
      registeredCount: 0,
      registrationOpen: newEventForm.registrationOpen,
      badgeColor: newEventForm.badgeColor
    };

    onAddEvent(created);
    setIsCreateModalOpen(false);
    showToast(`L'événement « ${created.title} » a été créé avec succès.`);
    setExpandedEventId(created.id);
  };

  // Handle Edit Event Submit
  const handleEditEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    onUpdateEvent(editingEvent);
    setEditingEvent(null);
    showToast(`Événement « ${editingEvent.title} » mis à jour.`);
  };

  // Toggle Registration Open/Close
  const handleToggleRegistrationOpen = (evt: EventItem) => {
    const updated: EventItem = {
      ...evt,
      registrationOpen: !evt.registrationOpen
    };
    onUpdateEvent(updated);
    showToast(updated.registrationOpen ? 'Inscriptions réouvertes.' : 'Inscriptions clôturées.');
  };

  // Handle Manual Attendee Submit
  const handleManualAttendeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRegEvent) return;
    if (!manualAttendee.fullName.trim() || !manualAttendee.phone.trim()) {
      showToast('Veuillez saisir au minimum le nom et le numéro de téléphone.');
      return;
    }

    const reg: EventRegistration = {
      id: `reg-man-${Date.now()}`,
      eventId: manualRegEvent.id,
      eventTitle: manualRegEvent.title,
      eventDate: manualRegEvent.date,
      eventTime: manualRegEvent.time,
      eventLocation: manualRegEvent.location,
      fullName: manualAttendee.fullName.trim(),
      phone: manualAttendee.phone.trim(),
      email: manualAttendee.email.trim() || undefined,
      city: manualAttendee.city.trim() || 'Abidjan',
      userRole: manualAttendee.userRole,
      numberOfPeople: Number(manualAttendee.numberOfPeople) || 1,
      notes: manualAttendee.notes.trim() || undefined,
      registeredAt: 'Inscrit par l\'Admin',
      status: 'confirme',
      urgencyLevel: 'normale'
    };

    onAddRegistration(reg);
    setManualRegEvent(null);
    setManualAttendee({
      fullName: '',
      phone: '',
      email: '',
      city: 'Abidjan',
      userRole: 'maman-parange',
      numberOfPeople: 1,
      notes: ''
    });
    showToast(`Participant(e) ${reg.fullName} inscrit(e) à ${manualRegEvent.title}.`);
  };

  // Export Roster to CSV for a specific event
  const handleExportRosterCSV = (event: EventItem) => {
    const regs = eventRegistrations.filter(r => r.eventId === event.id);
    if (regs.length === 0) {
      showToast('Aucune inscription pour cet événement à exporter.');
      return;
    }

    const headers = ['Nom Complet', 'Téléphone', 'Email', 'Ville', 'Rôle', 'Nb Personnes', 'Statut', 'Date Inscription', 'Notes'];
    const rows = regs.map(r => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${r.email || ''}"`,
      `"${r.city || ''}"`,
      `"${r.userRole || ''}"`,
      r.numberOfPeople || 1,
      `"${r.status}"`,
      `"${r.registeredAt}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inscrits_${event.title.substring(0, 25).replace(/[^a-zA-Z0-9]/g, '_')}_${event.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Export CSV téléchargé (${regs.length} participants).`);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Actions */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{isEn ? 'Full Event & Gathering Management • Event by Event' : 'Gestion Complète des Événements • Événement par Événement'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white">
            {isEn ? 'Support Groups & Community Gatherings Management' : 'Organisation des Groupes de Soutien & Rencontres'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            {isEn 
              ? 'Manage every GSP session, fathers\' circle, sibling workshop, and memorial ceremony. View live attendee lists, validate registrations, and contact families directly via WhatsApp.'
              : 'Gérez chaque session GSP, cercle de papas, atelier fratrie et cérémonie commémorative. Consultez en direct la liste nominative des personnes inscrites, confirmez-les et contactez-les directement par WhatsApp.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Month selector for reporting */}
          <select
            value={exportMonthFilter}
            onChange={(e) => setExportMonthFilter(e.target.value)}
            className="px-3 py-2 bg-emerald-900/90 text-white border border-emerald-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-400"
            title="Filtrer les inscriptions par mois pour le reporting"
          >
            <option value="all">Mois : Tous (Global)</option>
            {availableEventMonths.map((m) => (
              <option key={m} value={m}>Mois : {m}</option>
            ))}
          </select>

          {/* Export Excel (.xls) */}
          <button
            onClick={() => {
              exportEventRegistrationsToExcel(eventRegistrations, events, exportMonthFilter);
              showToast(isEn ? 'Monthly event reporting exported (Excel .XLS).' : 'Export Excel des inscriptions téléchargé.');
            }}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title={isEn ? "Export monthly registrations to Excel (.xls)" : "Exporter les inscriptions du mois en format Excel (.xls)"}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
            <span>Reporting Excel (.XLS)</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={() => {
              exportEventRegistrationsToCSV(eventRegistrations, events, exportMonthFilter);
              showToast(isEn ? 'Monthly event reporting exported (CSV).' : 'Export CSV des inscriptions téléchargé.');
            }}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title={isEn ? "Export monthly registrations to CSV" : "Exporter les inscriptions du mois en format CSV"}
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Reporting CSV</span>
          </button>

          {/* Create Event */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all transform hover:scale-105"
          >
            <PlusCircle className="w-4 h-4 text-stone-950" />
            <span>{isEn ? 'Create an Event' : 'Créer un Événement'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
            {isEn ? 'Total Events' : 'Total Événements'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif-accent text-stone-900">
            {stats.totalEvents}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            {isEn ? `${stats.upcomingCount} upcoming` : `${stats.upcomingCount} à venir prochainement`}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-teal-700" />
            {isEn ? 'Registered Attendees' : 'Personnes Inscrites'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif-accent text-stone-900">
            {stats.totalAttendeesSum}
          </div>
          <span className="text-[11px] text-stone-500 font-medium block">
            {isEn ? `Across ${stats.totalRegistrations} registration files` : `Sur ${stats.totalRegistrations} dossiers d'inscriptions`}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            {isEn ? 'To Confirm' : 'À Confirmer'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif-accent text-amber-700">
            {stats.pendingRegistrations}
          </div>
          <span className="text-[11px] text-amber-600 font-medium block">
            {isEn ? 'Pending admin approval' : 'En attente de validation admin'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            {isEn ? 'Global Capacity' : 'Jauge Globale'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif-accent text-stone-900">
            {stats.totalCapacity > 0 ? Math.round((stats.totalAttendeesSum / stats.totalCapacity) * 100) : 0}%
          </div>
          <span className="text-[11px] text-stone-500 font-medium block">
            {isEn ? 'Overall occupancy rate' : 'Taux d\'occupation global'}
          </span>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter: Upcoming, Past, All */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isEn ? `All (${events.length})` : `Tous (${events.length})`}
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'upcoming' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isEn ? `Upcoming (${events.filter(e => e.date >= todayStr).length})` : `À venir (${events.filter(e => e.date >= todayStr).length})`}
            </button>
            <button
              onClick={() => setStatusFilter('past')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'past' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isEn ? `Past (${events.filter(e => e.date < todayStr).length})` : `Passés (${events.filter(e => e.date < todayStr).length})`}
            </button>
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="all">{isEn ? 'All event types' : 'Tous les types de rencontres'}</option>
            <option value="gsp">{isEn ? 'Support Groups (GSP) & Circles' : 'Groupes de Soutien (GSP) & Cercles'}</option>
            <option value="atelier">{isEn ? 'Sibling & Creative Workshops' : 'Ateliers Fratries & Créatifs'}</option>
            <option value="conference">{isEn ? 'Webinars & Training' : 'Webinaires & Formations'}</option>
            <option value="ceremonie">{isEn ? 'Memorial Ceremonies' : 'Cérémonies & Commémorations'}</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? "Search by title, location, facilitator..." : "Rechercher par titre, lieu, animateur..."}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Event by Event Detailed List */}
      <div className="space-y-6">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-200 space-y-4">
            <CalendarIcon className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800 font-serif-accent">
              Aucun événement ne correspond à vos filtres
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Modifiez votre recherche ou créez une nouvelle session de rencontre pour les familles.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer un événement</span>
            </button>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isExpanded = expandedEventId === evt.id;
            const eventRegs = eventRegistrations.filter(r => r.eventId === evt.id);
            const attendeesSum = eventRegs.filter(r => r.status !== 'annule').reduce((acc, r) => acc + (r.numberOfPeople || 1), 0);
            const pendingForThisEvent = eventRegs.filter(r => r.status === 'en_attente').length;
            const isPast = evt.date < todayStr;
            const capacity = evt.capacity || 15;
            const fillPercentage = Math.min(100, Math.round((attendeesSum / capacity) * 100));

            return (
              <div 
                key={evt.id} 
                className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Event Main Header Card */}
                <div className="p-6 sm:p-7 border-b border-stone-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Event Left Metadata */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          evt.type === 'gsp' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                          evt.type === 'atelier' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          evt.type === 'conference' ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' :
                          'bg-purple-100 text-purple-900 border border-purple-200'
                        }`}>
                          {(isEn && evt.typeLabelEn) ? evt.typeLabelEn : (evt.typeLabel || evt.type)}
                        </span>

                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 flex items-center gap-1">
                          {evt.isOnline ? <Globe className="w-3 h-3 text-emerald-700" /> : <MapPin className="w-3 h-3 text-amber-700" />}
                          <span>{evt.isOnline ? (isEn ? 'Online (Zoom / Meet)' : 'En ligne (Zoom / Meet)') : (isEn ? 'In-Person Côte d\'Ivoire' : 'Présentiel Côte d\'Ivoire')}</span>
                        </span>

                        {isPast ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                            {isEn ? 'Past Event' : 'Événement Passé'}
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            evt.registrationOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {evt.registrationOpen ? (isEn ? 'Registrations Open' : 'Inscriptions Ouvertes') : (isEn ? 'Registrations Closed' : 'Inscriptions Clôturées')}
                          </span>
                        )}

                        {pendingForThisEvent > 0 && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                            {isEn ? `${pendingForThisEvent} pending validation` : `${pendingForThisEvent} en attente de validation`}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold font-serif-accent text-stone-900 leading-snug">
                        {(isEn && evt.titleEn) ? evt.titleEn : evt.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-2">
                        {(isEn && evt.descriptionEn) ? evt.descriptionEn : evt.description}
                      </p>

                      {/* Details row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                        <span className="flex items-center gap-1 font-semibold text-stone-900">
                          <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
                          {evt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {evt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {(isEn && evt.locationEn) ? evt.locationEn : evt.location}
                        </span>
                        {evt.facilitators && (
                          <span className="flex items-center gap-1 text-emerald-800">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {evt.facilitators}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event Right Actions & Fill Progress */}
                    <div className="flex flex-col sm:items-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                      {/* Capacity Pill & Progress */}
                      <div className="w-full sm:w-56 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-700">{isEn ? 'Capacity Gauge' : 'Remplissage Jauge'}</span>
                          <span className="font-bold text-stone-900">
                            {attendeesSum} / {capacity} {isEn ? 'seats' : 'places'} ({fillPercentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              fillPercentage >= 90 ? 'bg-rose-500' : fillPercentage >= 60 ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Controls Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Toggle Open/Closed */}
                        <button
                          onClick={() => handleToggleRegistrationOpen(evt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                            evt.registrationOpen 
                              ? 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100' 
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                          }`}
                          title={evt.registrationOpen ? (isEn ? 'Close registrations' : 'Clôturer les inscriptions') : (isEn ? 'Open registrations' : 'Ouvrir les inscriptions')}
                        >
                          {evt.registrationOpen ? (isEn ? 'Close' : 'Clôturer') : (isEn ? 'Open' : 'Ouvrir')}
                        </button>

                        {/* Manual Add Attendee */}
                        <button
                          onClick={() => setManualRegEvent(evt)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-1 transition-colors cursor-pointer"
                          title={isEn ? "Register an attendee manually" : "Inscrire un participant manuellement"}
                        >
                          <UserPlus className="w-3.5 h-3.5 text-emerald-800" />
                          <span>{isEn ? '+ Attendee' : '+ Participant'}</span>
                        </button>

                        {/* Export CSV */}
                        <button
                          onClick={() => handleExportRosterCSV(evt)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-1 transition-colors cursor-pointer"
                          title={isEn ? "Export attendee list to CSV" : "Exporter la liste des inscrits en format CSV"}
                        >
                          <Download className="w-3.5 h-3.5 text-stone-600" />
                          <span>CSV</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingEvent(evt)}
                          className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                          title={isEn ? "Edit event" : "Modifier l'événement"}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (window.confirm(isEn ? `Permanently delete event "${evt.title}"?` : `Supprimer définitivement l'événement « ${evt.title} » ?`)) {
                              onDeleteEvent(evt.id);
                              showToast(isEn ? 'Event deleted.' : 'Événement supprimé.');
                            }
                          }}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                          title={isEn ? "Delete event" : "Supprimer l'événement"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Accordion Expand/Collapse */}
                        <button
                          onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isExpanded 
                              ? 'bg-emerald-800 text-white shadow-xs' 
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{isEn ? `Attendees (${eventRegs.length})` : `Inscrits (${eventRegs.length})`}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE ATTENDEES ROSTER (Événement par Événement) */}
                {isExpanded && (
                  <div className="bg-stone-50/70 p-6 sm:p-7 border-t border-stone-100 space-y-4 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-800" />
                          <span>{isEn ? `Registered Attendees for this Session (${eventRegs.length})` : `Liste nominative des inscrits pour cette session (${eventRegs.length})`}</span>
                        </h4>
                        <p className="text-xs text-stone-500">
                          {isEn 
                            ? 'Review contact info, confirm attendee statuses, or message families directly on WhatsApp.'
                            : 'Consultez les informations de contact, validez les statuts et écrivez directement aux familles.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleExportRosterCSV(evt)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-stone-600" />
                          <span>{isEn ? 'Export List (.CSV)' : 'Exporter la liste (.CSV)'}</span>
                        </button>
                        <button
                          onClick={() => setManualRegEvent(evt)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Register an attendee' : 'Inscrire une personne'}</span>
                        </button>
                      </div>
                    </div>

                    {eventRegs.length === 0 ? (
                      <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-2">
                        <Users className="w-8 h-8 text-stone-300 mx-auto" />
                        <p className="text-xs text-stone-500 italic">
                          {isEn ? 'No attendees registered yet for this session.' : 'Aucun inscrit pour le moment à cette session.'}
                        </p>
                        <button
                          onClick={() => setManualRegEvent(evt)}
                          className="text-xs text-emerald-800 hover:underline font-bold"
                        >
                          {isEn ? '+ Manually register a parent or caregiver' : '+ Inscrire manuellement un parent ou un soignant'}
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-2xs">
                        <table className="w-full text-left text-xs text-stone-700">
                          <thead className="bg-stone-100/90 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200">
                            <tr>
                              <th className="px-4 py-3">{isEn ? 'Participant' : 'Participant(e)'}</th>
                              <th className="px-4 py-3">{isEn ? 'Role / Profile' : 'Rôle / Profil'}</th>
                              <th className="px-4 py-3">{isEn ? 'Contact & WhatsApp' : 'Contact & WhatsApp'}</th>
                              <th className="px-4 py-3">{isEn ? 'Seats' : 'Places'}</th>
                              <th className="px-4 py-3">{isEn ? 'Notes & Needs' : 'Notes & Besoins'}</th>
                              <th className="px-4 py-3">{isEn ? 'Status' : 'Statut'}</th>
                              <th className="px-4 py-3 text-right">{isEn ? 'Actions' : 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {eventRegs.map((reg) => {
                              const cleanPhone = reg.phone.replace(/[^0-9]/g, '');
                              const fullPhone = cleanPhone.startsWith('225') ? cleanPhone : `225${cleanPhone}`;
                              const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(
                                isEn 
                                  ? `Hello ${reg.fullName}, this is Le Jardin de l'Espoir : Parange regarding your registration for "${evt.title}" on ${evt.date}.`
                                  : `Bonjour ${reg.fullName}, ici Le Jardin de l'Espoir : Parange concernant votre inscription à « ${evt.title} » le ${evt.date}.`
                              )}`;

                              return (
                                <tr key={reg.id} className="hover:bg-amber-50/40 transition-colors">
                                  {/* Name & Date */}
                                  <td className="px-4 py-3 font-semibold text-stone-900">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-[11px] shrink-0">
                                        {reg.fullName.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="font-bold">{reg.fullName}</div>
                                        <div className="text-[10px] text-stone-400 font-normal">
                                          {reg.city ? `${reg.city} • ` : ''}{reg.registeredAt}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Role */}
                                  <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-700">
                                      {reg.userRole === 'maman-parange' ? (isEn ? 'Bereaved Mother' : 'Maman Parange') :
                                       reg.userRole === 'papa-parange' ? (isEn ? 'Bereaved Father' : 'Papa Parange') :
                                       reg.userRole === 'couple' ? (isEn ? 'United Couple' : 'Couple Uni') :
                                       reg.userRole === 'fratrie' ? (isEn ? 'Sibling' : 'Fratrie') :
                                       reg.userRole === 'soignant' ? (isEn ? 'Caregiver / Relay' : 'Soignant / Relais') :
                                       reg.userRole || (isEn ? 'Participant' : 'Participant')}
                                    </span>
                                  </td>

                                  {/* Phone / WhatsApp */}
                                  <td className="px-4 py-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 font-bold text-stone-900">
                                        <Phone className="w-3 h-3 text-emerald-700" />
                                        <span>{reg.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <a
                                          href={whatsappUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[10px] text-emerald-800 hover:text-emerald-900 font-bold inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                                        >
                                          <MessageSquare className="w-2.5 h-2.5" />
                                          <span>WhatsApp</span>
                                        </a>
                                        <a
                                          href={`tel:${reg.phone}`}
                                          className="text-[10px] text-stone-600 hover:text-stone-900 inline-flex items-center gap-0.5"
                                        >
                                          <span>{isEn ? 'Call' : 'Appeler'}</span>
                                        </a>
                                      </div>
                                    </div>
                                  </td>

                                  {/* People Count */}
                                  <td className="px-4 py-3 font-bold text-stone-800">
                                    {reg.numberOfPeople || 1} {isEn ? 'pers.' : 'pers.'}
                                  </td>

                                  {/* Notes */}
                                  <td className="px-4 py-3 max-w-xs text-[11px] text-stone-600 italic">
                                    {reg.notes || '—'}
                                  </td>

                                  {/* Status */}
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      reg.status === 'confirme' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                                      reg.status === 'present' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                                      reg.status === 'annule' ? 'bg-stone-200 text-stone-600' :
                                      'bg-amber-100 text-amber-900 border border-amber-300'
                                    }`}>
                                      {reg.status === 'confirme' ? (isEn ? 'Confirmed' : 'Confirmé') :
                                       reg.status === 'present' ? (isEn ? 'Attended' : 'Présent') :
                                       reg.status === 'annule' ? (isEn ? 'Cancelled' : 'Annulé') : (isEn ? 'Pending' : 'En attente')}
                                    </span>
                                  </td>

                                  {/* Action Buttons */}
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {reg.status !== 'confirme' && (
                                        <button
                                          onClick={() => {
                                            onUpdateRegistrationStatus(reg.id, 'confirme');
                                            showToast(isEn ? `Registration of ${reg.fullName} confirmed.` : `Inscription de ${reg.fullName} confirmée.`);
                                          }}
                                          className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors cursor-pointer"
                                          title={isEn ? "Confirm attendance" : "Confirmer la présence"}
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </button>
                                      )}

                                      {reg.status !== 'present' && (
                                        <button
                                          onClick={() => {
                                            onUpdateRegistrationStatus(reg.id, 'present');
                                            showToast(isEn ? `${reg.fullName} marked as attended.` : `${reg.fullName} marqué(e) présent(e).`);
                                          }}
                                          className="p-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors cursor-pointer"
                                          title={isEn ? "Mark present on event day" : "Marquer comme présent le jour J"}
                                        >
                                          <UserCheck className="w-3.5 h-3.5" />
                                        </button>
                                      )}

                                      {reg.status !== 'annule' && (
                                        <button
                                          onClick={() => {
                                            onUpdateRegistrationStatus(reg.id, 'annule');
                                            showToast(isEn ? `Registration of ${reg.fullName} marked cancelled.` : `Inscription de ${reg.fullName} marquée comme annulée.`);
                                          }}
                                          className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
                                          title={isEn ? "Cancel registration" : "Annuler"}
                                        >
                                          <XCircle className="w-3.5 h-3.5" />
                                        </button>
                                      )}

                                      <button
                                        onClick={() => {
                                          if (window.confirm(isEn ? `Delete registration of ${reg.fullName}?` : `Supprimer l'inscription de ${reg.fullName} ?`)) {
                                            onDeleteRegistration(reg.id);
                                            showToast(isEn ? 'Registration deleted.' : 'Inscription supprimée.');
                                          }
                                        }}
                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                        title={isEn ? "Permanently delete" : "Supprimer définitivement"}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* CREATE EVENT MODAL */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif-accent text-stone-900">
                    {isEn ? 'Create a New Event / Session' : 'Créer un Nouvel Événement / Session'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {isEn 
                      ? 'Add a gathering to the public interactive calendar and open registrations.'
                      : 'Ajoutez une rencontre au calendrier interactif public et ouvrez les inscriptions.'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isEn ? 'Event Title *' : "Intitulé de l'événement *"}
                </label>
                <input
                  type="text"
                  required
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  placeholder={isEn ? "Ex: Bereaved Parents Support Group (GSP) — Yopougon Session" : "Ex: Groupe de Soutien aux Paranges (GSP) — Session Yopougon"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Type & TypeLabel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isEn ? 'Category' : 'Catégorie'}
                  </label>
                  <select
                    value={newEventForm.type}
                    onChange={(e) => {
                      const val = e.target.value as EventItem['type'];
                      const labels: Record<string, string> = {
                        gsp: isEn ? 'Support Group' : 'Groupe de parole',
                        atelier: isEn ? 'Sibling Workshop' : 'Atelier Fratrie',
                        conference: isEn ? 'Conference & Training' : 'Conférence & Formation',
                        ceremonie: isEn ? 'Ceremony & Remembrance' : 'Cérémonie & Commémoration',
                        commemoration: isEn ? 'Commemoration' : 'Commémoration'
                      };
                      setNewEventForm({ 
                        ...newEventForm, 
                        type: val, 
                        typeLabel: labels[val] || (isEn ? 'Gathering' : 'Rencontre') 
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="gsp">{isEn ? 'Support Group (GSP) / Circle' : 'Groupe de Soutien (GSP) / Cercle'}</option>
                    <option value="atelier">{isEn ? 'Sibling Workshop / Creative' : 'Atelier Fratrie / Créatif'}</option>
                    <option value="conference">{isEn ? 'Webinar / Medical Conference' : 'Webinaire / Conférence Médicale'}</option>
                    <option value="ceremonie">{isEn ? 'Ceremony / Wave of Light' : 'Cérémonie / Vague de Lumière'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isEn ? 'Subtitle / Short Badge' : 'Sous-titre / Badge court'}
                  </label>
                  <input
                    type="text"
                    value={newEventForm.typeLabel}
                    onChange={(e) => setNewEventForm({ ...newEventForm, typeLabel: e.target.value })}
                    placeholder={isEn ? "Ex: Fathers' Circle, Expressive Art..." : "Ex: Cercle des Pères, Atelier Médiation..."}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isEn ? 'Session Date *' : 'Date de la session *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isEn ? 'Time (GMT)' : 'Horaire (GMT)'}
                  </label>
                  <input
                    type="text"
                    value={newEventForm.time}
                    onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    placeholder={isEn ? "Ex: 10:00 AM - 12:30 PM GMT" : "Ex: 10h00 - 12h30 GMT"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Location & Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isEn ? 'Exact Location or Link' : 'Lieu précis ou lien'}
                  </label>
                  <input
                    type="text"
                    value={newEventForm.location}
                    onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                    placeholder={isEn ? "Ex: Cocody Angré, Abidjan or Secure Zoom link" : "Ex: Cocody Angré, Abidjan ou Lien Zoom sécurisé"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isOnlineCheckbox"
                    checked={newEventForm.isOnline}
                    onChange={(e) => setNewEventForm({ ...newEventForm, isOnline: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="isOnlineCheckbox" className="text-xs font-bold text-stone-700 cursor-pointer">
                    🌐 {isEn ? '100% Online Event (Video / Zoom)' : 'Événement 100% en ligne (Visio / Zoom)'}
                  </label>
                </div>
              </div>

              {/* Facilitators & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isEn ? 'Facilitators / Speakers' : 'Intervenants / Animateurs'}
                  </label>
                  <input
                    type="text"
                    value={newEventForm.facilitators}
                    onChange={(e) => setNewEventForm({ ...newEventForm, facilitators: e.target.value })}
                    placeholder={isEn ? "Ex: Dr. Kouadio & Two peer-support mothers" : "Ex: Dr Kouadio & Deux mamans pairs-aidantes"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isEn ? 'Max Capacity (Seats)' : 'Capacité maximale (Jauge)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={newEventForm.capacity}
                    onChange={(e) => setNewEventForm({ ...newEventForm, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isEn ? 'Detailed Description' : 'Description détaillée'}
                </label>
                <textarea
                  rows={3}
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  placeholder={isEn ? "Session goals, schedule, warm welcoming guidelines..." : "Objectif de la rencontre, déroulement, consignes d'accueil bienveillant..."}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {isEn ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isEn ? 'Publish Event' : "Publier l'événement"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setEditingEvent(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold font-serif-accent text-stone-900">
                {isEn ? 'Edit Event' : "Modifier l'événement"}
              </h3>
              <button onClick={() => setEditingEvent(null)} className="p-2 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Title' : 'Titre'}</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Date' : 'Date'}</label>
                  <input
                    type="date"
                    required
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Time' : 'Horaire'}</label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Location' : 'Lieu'}</label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Capacity (Seats)' : 'Capacité (Jauge)'}</label>
                  <input
                    type="number"
                    value={editingEvent.capacity || 15}
                    onChange={(e) => setEditingEvent({ ...editingEvent, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="editRegOpen"
                    checked={editingEvent.registrationOpen}
                    onChange={(e) => setEditingEvent({ ...editingEvent, registrationOpen: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="editRegOpen" className="text-xs font-bold text-stone-700 cursor-pointer">
                    {isEn ? 'Registrations Open' : 'Inscriptions Ouvertes'}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Facilitators' : 'Intervenants'}</label>
                <input
                  type="text"
                  value={editingEvent.facilitators || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, facilitators: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Description' : 'Description'}</label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {isEn ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {isEn ? 'Save Changes' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL ADD ATTENDEE MODAL */}
      {manualRegEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setManualRegEvent(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold font-serif-accent text-stone-900">
                  {isEn ? 'Register an Attendee Manually' : 'Inscrire un Participant Manuellement'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isEn ? 'Session:' : 'Session :'} {manualRegEvent.title}
                </p>
              </div>
              <button onClick={() => setManualRegEvent(null)} className="p-2 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAttendeeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Full Name *' : 'Nom Complet *'}</label>
                <input
                  type="text"
                  required
                  value={manualAttendee.fullName}
                  onChange={(e) => setManualAttendee({ ...manualAttendee, fullName: e.target.value })}
                  placeholder={isEn ? "Ex: Clarisse Bamba" : "Ex: Clarisse Bamba"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Phone / WhatsApp *' : 'Téléphone / WhatsApp *'}</label>
                  <input
                    type="tel"
                    required
                    value={manualAttendee.phone}
                    onChange={(e) => setManualAttendee({ ...manualAttendee, phone: e.target.value })}
                    placeholder="07 59 87 21 61"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Email' : 'Email'}</label>
                  <input
                    type="email"
                    value={manualAttendee.email}
                    onChange={(e) => setManualAttendee({ ...manualAttendee, email: e.target.value })}
                    placeholder="nom@exemple.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Profile / Role' : 'Profil / Rôle'}</label>
                  <select
                    value={manualAttendee.userRole}
                    onChange={(e) => setManualAttendee({ ...manualAttendee, userRole: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white"
                  >
                    <option value="maman-parange">{isEn ? 'Bereaved Mother' : 'Maman Parange'}</option>
                    <option value="papa-parange">{isEn ? 'Bereaved Father' : 'Papa Parange'}</option>
                    <option value="couple">{isEn ? 'United Couple' : 'Couple Uni'}</option>
                    <option value="fratrie">{isEn ? 'Sibling' : 'Fratrie'}</option>
                    <option value="soignant">{isEn ? 'Caregiver / Relay' : 'Soignant / Relais'}</option>
                    <option value="autre">{isEn ? 'Other' : 'Autre'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Number of seats' : 'Nb de personnes'}</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={manualAttendee.numberOfPeople}
                    onChange={(e) => setManualAttendee({ ...manualAttendee, numberOfPeople: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{isEn ? 'Notes / Special Request' : 'Notes / Demande particulière'}</label>
                <textarea
                  rows={2}
                  value={manualAttendee.notes}
                  onChange={(e) => setManualAttendee({ ...manualAttendee, notes: e.target.value })}
                  placeholder={isEn ? "Caregiver notes or specific emotional needs..." : "Notes de l'écoutant ou besoins particuliers..."}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setManualRegEvent(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {isEn ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {isEn ? 'Confirm Registration' : "Valider l'inscription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
