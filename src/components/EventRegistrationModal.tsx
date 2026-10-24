import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  HeartHandshake, 
  Users, 
  Phone, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { EventItem, EventRegistration } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  onConfirmRegistration: (registration: Omit<EventRegistration, 'id' | 'registeredAt' | 'status'>) => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  isOpen,
  onClose,
  event,
  onConfirmRegistration
}) => {
  const { isEn } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Abidjan');
  const [userRole, setUserRole] = useState<EventRegistration['userRole']>('maman-parange');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage(isEn ? 'Please enter your full name or pseudonym.' : 'Veuillez renseigner votre nom ou pseudonyme.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage(isEn ? 'Please enter your phone/WhatsApp number.' : 'Veuillez renseigner votre numéro de téléphone ou WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      onConfirmRegistration({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        city: city.trim() || 'Abidjan',
        userRole,
        numberOfPeople: Math.max(1, numberOfPeople),
        notes: notes.trim() || undefined,
        urgencyLevel: 'normale'
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form
        setFullName('');
        setPhone('');
        setEmail('');
        setNotes('');
        setNumberOfPeople(1);
      }, 2400);
    } catch {
      setIsSubmitting(false);
      setErrorMessage(isEn ? 'An error occurred during submission. Please try again.' : 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-800 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-5 border-b border-stone-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif-accent text-stone-900 leading-tight">
                {isEn ? 'Event Registration' : 'Inscription à l\'Événement'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEn ? 'Free, confidential & welcoming participation' : 'Participation gratuite, bienveillante & confidentielle'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Brief Card */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900">
                {event.typeLabel || event.type}
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                {event.isOnline 
                  ? (isEn ? '🌐 Online (Zoom/Meet)' : '🌐 En ligne (Zoom/Meet)')
                  : (isEn ? '📍 In-person' : '📍 En présentiel')}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-stone-900 font-serif-accent">
              {event.title}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 pt-1 border-t border-amber-200/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-emerald-950 font-serif-accent">
                  {isEn ? 'Registration Confirmed!' : 'Inscription Enregistrée avec Succès !'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  {isEn 
                    ? 'Our team has been notified. We will contact you via WhatsApp / phone to confirm all details.'
                    : 'Notre équipe et l\'administrateur ont été notifiés en temps réel. Vous recevrez un rappel par WhatsApp ou appel téléphonique avant l\'événement.'}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEn ? 'Thank you for joining our community' : 'Merci pour votre confiance fraternelle'}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {isEn ? 'Full Name or Pseudonym *' : 'Nom complet ou Pseudonyme *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isEn ? 'e.g., Sarah Kouassi' : 'Ex: Clarisse Bamba ou Maman Liam'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isEn ? 'Phone / WhatsApp *' : 'Téléphone / WhatsApp *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: 07 59 87 21 61"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isEn ? 'Email (Optional)' : 'Adresse Courriel (Facultatif)'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Role & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isEn ? 'Your Profile / Role' : 'Votre Situation / Rôle'}
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all shadow-2xs"
                  >
                    <option value="maman-parange">{isEn ? 'Grieving Mother (Maman Parange)' : 'Maman Parange (Mère endeuillée)'}</option>
                    <option value="papa-parange">{isEn ? 'Grieving Father (Papa Parange)' : 'Papa Parange (Père endeuillé)'}</option>
                    <option value="couple">{isEn ? 'Couple together' : 'Couple uni dans l\'épreuve'}</option>
                    <option value="fratrie">{isEn ? 'Sibling (Brother / Sister)' : 'Fratrie (Frère / Sœur endeuillé)'}</option>
                    <option value="proche">{isEn ? 'Close family / Friend' : 'Proche ou ami bienveillant'}</option>
                    <option value="soignant">{isEn ? 'Healthcare Worker / Midwife' : 'Soignant / Sage-femme / Médecin'}</option>
                    <option value="benevole">{isEn ? 'Volunteer / Sympathizer' : 'Bénévole / Sympathisant'}</option>
                    <option value="autre">{isEn ? 'Other' : 'Autre'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isEn ? 'City / Commune' : 'Ville ou Commune'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Abidjan Cocody, Yopougon, Bouaké..."
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Number of People */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>{isEn ? 'Number of Participants' : 'Nombre de personnes qui viendront'}</span>
                  <span className="text-[11px] font-normal text-stone-500">
                    {numberOfPeople === 1 ? (isEn ? '1 person' : '1 personne seule') : `${numberOfPeople} ${isEn ? 'people' : 'personnes'}`}
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNumberOfPeople(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        numberOfPeople === num
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {num} {num === 1 ? (isEn ? 'Person' : 'Personne') : (isEn ? 'People' : 'Personnes')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes or Needs */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {isEn ? 'Specific notes or emotional needs (Confidential)' : 'Notes particulières ou besoins d\'écoute (Confidentiel)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isEn 
                    ? 'Share if you need special accompaniment or have any questions...'
                    : 'Précisez si vous souhaitez être appelé(e) avant la séance, votre ressenti...'}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all shadow-2xs"
                />
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-start gap-2.5 text-[11px] text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  {isEn 
                    ? 'Total confidentiality guaranteed. Your data is used exclusively by Le Jardin de l\'Espoir : Parange for event organization.'
                    : 'Confidentialité totale garantie. Vos coordonnées ne seront jamais divulguées et servent uniquement à l\'accueil solidaire par Le Jardin de l\'Espoir : Parange.'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? (isEn ? 'Submitting...' : 'Enregistrement...') 
                      : (isEn ? 'Confirm My Registration' : 'Confirmer mon inscription')}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
