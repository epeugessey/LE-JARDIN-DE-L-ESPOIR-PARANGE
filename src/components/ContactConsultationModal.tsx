import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Phone, Heart, Shield, Send, MessageSquare, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ConsultationRequest, AdminNotificationMessage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ContactConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedAudience?: 'parange' | 'fratrie' | 'proche' | 'soignant-relais';
  isPriority?: boolean;
  onSubmitRequest?: (notification: AdminNotificationMessage) => void;
}

export const ContactConsultationModal: React.FC<ContactConsultationModalProps> = ({
  isOpen,
  onClose,
  preselectedAudience,
  isPriority = false,
  onSubmitRequest
}) => {
  const { t, language, isEn } = useLanguage();

  const [formData, setFormData] = useState<ConsultationRequest>({
    fullName: '',
    email: '',
    phone: '',
    city: 'Abidjan',
    userRole: preselectedAudience || 'parange',
    situationType: 'deuil-perinatal',
    concernedPersonAge: '',
    preferredContact: 'telephone',
    urgentListeningNeeded: isPriority,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        userRole: preselectedAudience || prev.userRole,
        urgentListeningNeeded: isPriority ? true : prev.urgentListeningNeeded
      }));
    }
  }, [isOpen, preselectedAudience, isPriority]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newNotification: AdminNotificationMessage = {
      id: `modal-${Date.now()}`,
      type: formData.urgentListeningNeeded ? 'ecoute_urgente' : 'rappel',
      senderName: formData.fullName.trim() || (isEn ? 'Bereaved Parent' : 'Parent endeuillé'),
      senderPhone: formData.phone.trim(),
      senderEmail: formData.email?.trim(),
      senderCity: formData.city.trim() || "Côte d'Ivoire",
      subject: `Demande de rappel / consultation (${formData.userRole})`,
      message: formData.message.trim() || `Demande d'accompagnement (${formData.situationType} • contact souhaité: ${formData.preferredContact}).`,
      timestamp: new Date().toISOString(),
      urgencyLevel: formData.urgentListeningNeeded ? 'critique' : 'haute',
      status: 'unread',
      metadata: {
        source: isPriority ? 'Modal Aide Prioritaire' : 'Modal Consultation',
        role: formData.userRole,
        situation: formData.situationType,
        preferredContact: formData.preferredContact
      }
    };

    if (onSubmitRequest) {
      onSubmitRequest(newNotification);
    }

    try {
      const stored = localStorage.getItem('jde_admin_notifications');
      const existingList = stored ? JSON.parse(stored) : [];
      localStorage.setItem('jde_admin_notifications', JSON.stringify([newNotification, ...existingList]));
      window.dispatchEvent(new Event('jde_notifications_updated'));
    } catch (err) {
      console.warn('Could not save notification to localStorage', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-900/65 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 sm:p-8 text-white ${
          isPriority 
            ? 'bg-gradient-to-r from-red-950 via-emerald-950 to-teal-950' 
            : 'bg-gradient-to-r from-emerald-900 to-teal-950'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label={t.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-medium mb-3">
            {isPriority ? <ShieldAlert className="w-3.5 h-3.5 text-amber-300" /> : <Shield className="w-3.5 h-3.5" />}
            {isPriority ? t.immediateHelpBadge : t.modalConfidentiality}
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold font-serif-accent">
            {isPriority ? t.immediateHelpModalTitle : t.modalTitle}
          </h3>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 max-w-lg leading-relaxed">
            {isPriority ? t.immediateHelpModalSubtitle : t.modalSubtitle}
          </p>

          {/* Quick direct phone numbers banner if priority */}
          {isPriority && (
            <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span className="font-semibold">{t.callDirectly}</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <a href="tel:+2250759872161" className="hover:underline text-amber-300">+225 07 59 87 21 61</a>
                <span>/</span>
                <a href="tel:+2250575239312" className="hover:underline text-amber-300">05 75 23 93 12</a>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-stone-900 font-serif-accent">
                {t.successTitle}
              </h4>
              <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                {formData.urgentListeningNeeded ? t.successDescPriority : t.successDescStandard}
              </p>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left max-w-md mx-auto space-y-2 text-xs text-stone-600">
                <div className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  {isEn ? "Need to talk immediately?" : "Besoin de parler immédiatement ?"}
                </div>
                <p>
                  {isEn 
                    ? "Our Côte d'Ivoire Support Helpline is accessible 7/7 at "
                    : "Notre Ligne Solidaire Côte d'Ivoire est joignable 7j/7 au "}
                  <strong className="text-emerald-800">+225 07 59 87 21 61</strong> / <strong className="text-emerald-800">05 75 23 93 12</strong>.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Priority Notice Banner */}
              {formData.urgentListeningNeeded && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>{isEn ? "Priority Intake Active" : "Prise en charge prioritaire :"}</strong> {t.priorityAlertActive}
                  </div>
                </div>
              )}

              {/* Step 1: Who are you? */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  1. {t.roleLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'parange', label: t.roleParange },
                    { id: 'fratrie', label: t.roleSibling },
                    { id: 'proche', label: t.roleRelative },
                    { id: 'soignant-relais', label: t.roleProfessional }
                  ].map((role) => (
                    <button
                      type="button"
                      key={role.id}
                      onClick={() => setFormData({ ...formData, userRole: role.id as any })}
                      className={`py-2.5 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        formData.userRole === role.id
                          ? 'border-emerald-700 bg-emerald-700 text-white shadow-xs'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Situation Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  2. {t.situationLabel}
                </label>
                <select
                  value={formData.situationType}
                  onChange={(e) => setFormData({ ...formData, situationType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="deuil-perinatal">{t.situationPerinatal}</option>
                  <option value="deces-enfant">{t.situationChildLoss}</option>
                  <option value="deces-fratrie">{t.situationSiblingLoss}</option>
                  <option value="autre">{t.situationOther}</option>
                </select>
              </div>

              {/* Step 3: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t.fullNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={isEn ? "e.g. John Doe or Anonymous" : "Ex: Kouassi Marie ou Anonyme"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: 07 59 87 21 61"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t.cityLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={isEn ? "e.g. COTE D'IVOIRE (City, Commune or Region)" : "Ex: COTE D'IVOIRE (Ville, Commune ou Région)"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t.contactMethodLabel}
                  </label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                  >
                    <option value="telephone">{t.contactPhone}</option>
                    <option value="whatsapp">{t.contactWhatsapp}</option>
                    <option value="presentiel">{t.contactInPerson}</option>
                  </select>
                </div>
              </div>

              {/* Urgency checkbox */}
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="urgentListening"
                  checked={formData.urgentListeningNeeded}
                  onChange={(e) => setFormData({ ...formData, urgentListeningNeeded: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded-sm border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="urgentListening" className="text-xs text-amber-900 cursor-pointer">
                  <strong>{t.urgentListeningLabel} :</strong> {t.urgentListeningDesc}
                </label>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {t.messageLabel}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.messagePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? t.submittingText : t.submitRequestBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

