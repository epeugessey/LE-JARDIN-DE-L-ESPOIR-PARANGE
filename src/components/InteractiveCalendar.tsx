import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  CheckCircle2, 
  UserCheck, 
  PlusCircle, 
  Filter,
  HeartHandshake
} from 'lucide-react';
import { EventItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface InteractiveCalendarProps {
  events?: EventItem[];
  onRegisterEvent: (event: EventItem) => void;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  events = [],
  onRegisterEvent
}) => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<'agenda' | 'month'>('agenda');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gsp' | 'atelier' | 'conference' | 'ceremonie'>('all');
  
  // Current calendar month view state (Defaults to September 2026 based on events)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [selectedDay, setSelectedDay] = useState<string | null>('2026-09-19');

  const safeEvents = Array.isArray(events) ? events : [];

  // Filtered events
  const filteredEvents = useMemo(() => {
    return safeEvents.filter(evt => {
      if (selectedFilter === 'all') return true;
      return evt.type === selectedFilter;
    });
  }, [safeEvents, selectedFilter]);

  // Calendar month calculation
  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'long',
      year: 'numeric'
    });
  }, [currentDate, language]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Adjust to Monday first (0 = Monday, 6 = Sunday)
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysTotal = new Date(year, month + 1, 0).getDate();

    const days: { dayNumber: number; dateString: string; isCurrentMonth: boolean; hasEvent: boolean }[] = [];

    // Empty previous month padding
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({
        dayNumber: 0,
        dateString: '',
        isCurrentMonth: false,
        hasEvent: false
      });
    }

    // Days of current month
    for (let d = 1; d <= daysTotal; d++) {
      const monthPadded = String(month + 1).padStart(2, '0');
      const dayPadded = String(d).padStart(2, '0');
      const dateStr = `${year}-${monthPadded}-${dayPadded}`;
      const hasEvt = events.some(e => e.date === dateStr);

      days.push({
        dayNumber: d,
        dateString: dateStr,
        isCurrentMonth: true,
        hasEvent: hasEvt
      });
    }

    return days;
  }, [currentDate, events]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Events on selected day
  const eventsOnSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return safeEvents.filter(e => e.date === selectedDay);
  }, [safeEvents, selectedDay]);

  return (
    <section className="relative py-12 sm:py-16 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100 overflow-hidden">
      
      {/* Decorative Watermark Logo in background */}
      <div 
        className="absolute -right-16 -bottom-16 w-96 h-96 bg-contain bg-no-repeat opacity-5 pointer-events-none"
        style={{ backgroundImage: "url('/logo-circular.jpg')" }}
      />
      <div 
        className="absolute -left-16 top-10 w-72 h-72 bg-contain bg-no-repeat opacity-5 pointer-events-none"
        style={{ backgroundImage: "url('/logo-circular.jpg')" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === 'fr' ? 'Agenda & Rencontres des Paranges' : 'Calendar & Support Gatherings'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif-accent text-stone-900 tracking-tight">
            {language === 'fr' 
              ? 'Prochains Groupes de Parole, Ateliers & Cérémonies' 
              : 'Upcoming Support Groups, Workshops & Memorials'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'fr'
              ? 'Le deuil périnatal ne se vit pas dans la solitude. Rejoignez nos espaces de rencontre sécurisés en Côte d\'Ivoire (Abidjan, Bouaké) ou depuis chez vous en ligne.'
              : 'Perinatal bereavement should not be walked alone. Join our safe support circles in Côte d\'Ivoire (Abidjan, Bouaké) or online from home.'}
          </p>
        </div>

        {/* View mode toggle & filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
          
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs text-stone-400 font-semibold px-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Type :' : 'Type:'}</span>
            </span>
            {[
              { id: 'all', label: language === 'fr' ? 'Tous les événements' : 'All Events' },
              { id: 'gsp', label: language === 'fr' ? 'Groupes de parole' : 'Support Groups' },
              { id: 'atelier', label: language === 'fr' ? 'Ateliers Fratrie' : 'Sibling Workshops' },
              { id: 'conference', label: language === 'fr' ? 'Conférences / Webinaires' : 'Webinars' },
              { id: 'ceremonie', label: language === 'fr' ? 'Cérémonies & Mémoire' : 'Memorials' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View mode switcher */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {language === 'fr' ? 'Liste / Agenda' : 'List / Agenda'}
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {language === 'fr' ? 'Vue Calendrier' : 'Calendar View'}
            </button>
          </div>
        </div>

        {/* AGENDA VIEW */}
        {viewMode === 'agenda' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const eventDateObj = new Date(event.date + 'T00:00:00');
              const dayStr = eventDateObj.getDate();
              const monthStr = eventDateObj.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' }).toUpperCase();

              return (
                <div 
                  key={event.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top accent border */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500" />

                  <div className="space-y-4">
                    {/* Header with Date Badge & Type */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col items-center justify-center font-bold shrink-0 shadow-2xs">
                          <span className="text-lg leading-none font-extrabold">{dayStr}</span>
                          <span className="text-[10px] uppercase font-semibold text-amber-700">{monthStr}</span>
                        </div>
                        <div>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            event.isOnline 
                              ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {event.isOnline ? <Video className="w-3 h-3 text-teal-600" /> : <MapPin className="w-3 h-3 text-emerald-600" />}
                            <span>{(language === 'en' && event.typeLabelEn) ? event.typeLabelEn : event.typeLabel}</span>
                          </span>
                          <div className="text-[11px] text-stone-400 font-medium mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>

                      {event.registrationOpen ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          {language === 'fr' ? 'Ouvert' : 'Open'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                          {language === 'fr' ? 'Complet' : 'Full'}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-serif-accent text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                        {(language === 'en' && event.titleEn) ? event.titleEn : event.title}
                      </h3>
                      <p className="mt-2 text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {(language === 'en' && event.descriptionEn) ? event.descriptionEn : event.description}
                      </p>
                    </div>

                    {/* Meta info */}
                    <div className="pt-2 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-medium text-stone-700 truncate">
                          {(language === 'en' && event.locationEn) ? event.locationEn : event.location}
                        </span>
                      </div>
                      {event.facilitators && (
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span className="text-stone-500 truncate">{event.facilitators}</span>
                        </div>
                      )}
                      {event.capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="text-stone-500">
                            {event.registeredCount} / {event.capacity} {language === 'fr' ? 'inscrits' : 'registered'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-5 mt-4 border-t border-stone-100">
                    <button
                      onClick={() => onRegisterEvent(event)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer group-hover:bg-emerald-700"
                    >
                      <HeartHandshake className="w-4 h-4 text-emerald-200" />
                      <span>{language === 'fr' ? 'S\'inscrire / Participer' : 'Register / Attend'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MONTH VIEW */}
        {viewMode === 'month' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            {/* Calendar month controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg sm:text-xl font-bold font-serif-accent text-stone-900 capitalize">
                  {monthYearLabel}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                  title="Mois précédent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                  title={language === 'fr' ? 'Mois suivant' : 'Next month'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 pb-2">
              {(language === 'fr' ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map(d => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((day, idx) => {
                if (!day.isCurrentMonth) {
                  return <div key={`empty-${idx}`} className="h-14 sm:h-20 rounded-xl bg-stone-50/50" />;
                }

                const isSelected = selectedDay === day.dateString;
                const hasEvt = day.hasEvent;

                return (
                  <div
                    key={day.dateString}
                    onClick={() => setSelectedDay(day.dateString)}
                    className={`h-14 sm:h-20 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40'
                        : hasEvt
                        ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400'
                        : 'bg-white border-stone-100 hover:bg-stone-50'
                    }`}
                  >
                    <span className={`text-xs font-bold ${
                      isSelected ? 'text-emerald-900' : hasEvt ? 'text-amber-900' : 'text-stone-700'
                    }`}>
                      {day.dayNumber}
                    </span>

                    {hasEvt && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="hidden sm:inline text-[10px] font-bold text-amber-800 truncate">
                          {language === 'fr' ? 'Événement' : 'Event'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Events for selected day */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-sm font-bold text-stone-800 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>
                  {language === 'fr' 
                    ? `Événements prévus le ${selectedDay || 'jour sélectionné'} :`
                    : `Events scheduled for ${selectedDay || 'selected date'}:`}
                </span>
              </h4>

              {eventsOnSelectedDay.length === 0 ? (
                <p className="text-xs text-stone-500 italic p-4 bg-stone-50 rounded-xl border border-stone-100">
                  {language === 'fr'
                    ? 'Aucun événement public prévu pour cette date. Cliquez sur un jour marqué en jaune pour voir les détails.'
                    : 'No public events scheduled for this date. Click on a highlighted day.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {eventsOnSelectedDay.map(evt => (
                    <div 
                      key={evt.id} 
                      className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                            {(language === 'en' && evt.typeLabelEn) ? evt.typeLabelEn : evt.typeLabel}
                          </span>
                          <span className="text-xs text-stone-600 font-semibold">• {evt.time}</span>
                        </div>
                        <h5 className="text-sm font-bold text-stone-900">
                          {(language === 'en' && evt.titleEn) ? evt.titleEn : evt.title}
                        </h5>
                        <p className="text-xs text-stone-600">
                          {(language === 'en' && evt.locationEn) ? evt.locationEn : evt.location}
                        </p>
                      </div>

                      <button
                        onClick={() => onRegisterEvent(evt)}
                        className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>{language === 'fr' ? 'S\'inscrire' : 'Register'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
