import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Send, 
  ThumbsUp, 
  ShieldCheck, 
  Clock, 
  User, 
  MapPin,
  HelpCircle
} from 'lucide-react';
import { ConsultationFeedback, AdminNotificationMessage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PostConsultationFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionType?: 'telephone' | 'chat_direct' | 'presentiel' | 'visio' | 'autre';
  consultantName?: string;
  onFeedbackSubmitted?: (feedback: ConsultationFeedback) => void;
}

export const PostConsultationFeedbackModal: React.FC<PostConsultationFeedbackModalProps> = ({
  isOpen,
  onClose,
  sessionType = 'telephone',
  consultantName,
  onFeedbackSubmitted
}) => {
  const { language, isEn } = useLanguage();

  // Ratings (1-5)
  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [listeningEmpathy, setListeningEmpathy] = useState<number>(5);
  const [responseSpeed, setResponseSpeed] = useState<number>(5);
  const [reliefAndGuidance, setReliefAndGuidance] = useState<number>(5);

  // Details
  const [selectedSessionType, setSelectedSessionType] = useState<'telephone' | 'chat_direct' | 'presentiel' | 'visio' | 'autre'>(sessionType);
  const [respondentRole, setRespondentRole] = useState<'parange' | 'fratrie' | 'proche' | 'soignant' | 'anonyme'>('parange');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [respondentName, setRespondentName] = useState<string>('');
  const [respondentCity, setRespondentCity] = useState<string>('Abidjan');
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(true);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [improvementSuggestion, setImprovementSuggestion] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const ratingDescriptions: Record<number, string> = {
    1: isEn ? "Difficult / Needs major improvement" : "Difficile / Grand besoin d'amélioration",
    2: isEn ? "Fair / Could be better" : "Passable / Des manques ressentis",
    3: isEn ? "Comforting & Supportive" : "Réconfortant et bienveillant",
    4: isEn ? "Very helpful & Attentive" : "Très aidant, attentif et rassurant",
    5: isEn ? "Deeply soothing, empathetic & humane" : "Exceptionnellement bienveillant, humain et apaisant"
  };

  const getSessionTypeLabel = (st: string) => {
    switch (st) {
      case 'telephone': return isEn ? 'Helpline Phone Call' : 'Permanence Téléphonique Écoute';
      case 'chat_direct': return isEn ? 'Direct Web / WhatsApp Chat' : 'Tchat d\'Aide Immédiate';
      case 'presentiel': return isEn ? 'In-person Consultation' : 'Entretien Présentiel';
      case 'visio': return isEn ? 'Online Video Support' : 'Accompagnement Visio';
      default: return isEn ? 'Support Session' : 'Session d\'accompagnement';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'parange': return isEn ? 'Bereaved Parent (Parange)' : 'Parent endeuillé (Parange)';
      case 'fratrie': return isEn ? 'Sibling' : 'Fratrie';
      case 'proche': return isEn ? 'Close Relative' : 'Proche / Famille';
      case 'soignant': return isEn ? 'Healthcare Worker' : 'Soignant / Relais';
      default: return isEn ? 'Anonymous' : 'Anonyme';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const newFeedback: ConsultationFeedback = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: now.toISOString(),
      dateFormatted: now.toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      overallRating,
      listeningEmpathy,
      responseSpeed,
      reliefAndGuidance,
      sessionType: selectedSessionType,
      sessionTypeLabel: getSessionTypeLabel(selectedSessionType),
      respondentRole,
      respondentRoleLabel: getRoleLabel(respondentRole),
      respondentName: isAnonymous ? '' : respondentName.trim(),
      respondentCity: respondentCity.trim() || 'Côte d\'Ivoire',
      isAnonymous,
      wouldRecommend,
      feedbackText: feedbackText.trim() || (isEn ? 'No detailed written comments provided.' : 'Session évaluée positivement sans commentaire libre supplémentaire.'),
      improvementSuggestion: improvementSuggestion.trim() || undefined,
      status: 'nouveau'
    };

    // 1. Save to feedbacks store
    try {
      const storedFb = localStorage.getItem('jde_consultation_feedbacks');
      const list = storedFb ? JSON.parse(storedFb) : [];
      const updatedList = [newFeedback, ...list];
      localStorage.setItem('jde_consultation_feedbacks', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('jde_feedbacks_updated'));
    } catch (err) {
      console.warn('Could not save feedback to localStorage', err);
    }

    // 2. Alert administration in admin notifications
    const adminAlert: AdminNotificationMessage = {
      id: `alert-fb-${Date.now()}`,
      type: 'feedback',
      senderName: isAnonymous ? (isEn ? 'Anonymous Parent' : 'Parent anonyme') : (respondentName.trim() || 'Famille'),
      senderPhone: 'N/A (Évaluation qualité)',
      senderCity: respondentCity.trim() || 'Côte d\'Ivoire',
      subject: `Évaluation d'écoute reçue : ${overallRating}/5 ⭐ (${getSessionTypeLabel(selectedSessionType)})`,
      message: `Note globale : ${overallRating}/5 étoiles. Recommandation : ${wouldRecommend ? 'Oui' : 'Non'}.\nCommentaire : « ${newFeedback.feedbackText} »${newFeedback.improvementSuggestion ? `\nSuggestions : « ${newFeedback.improvementSuggestion} »` : ''}`,
      timestamp: new Date().toISOString(),
      urgencyLevel: overallRating <= 2 ? 'critique' : 'normale',
      status: 'unread',
      metadata: {
        source: 'Formulaire Post-Consultation Feedback',
        rating: overallRating,
        empathy: listeningEmpathy,
        speed: responseSpeed,
        relief: reliefAndGuidance,
        sessionType: selectedSessionType
      }
    };

    try {
      const storedNotifs = localStorage.getItem('jde_admin_notifications');
      const listNotifs = storedNotifs ? JSON.parse(storedNotifs) : [];
      localStorage.setItem('jde_admin_notifications', JSON.stringify([adminAlert, ...listNotifs]));
      window.dispatchEvent(new Event('jde_notifications_updated'));
    } catch (err) {
      console.warn('Could not save admin feedback notification', err);
    }

    if (onFeedbackSubmitted) {
      onFeedbackSubmitted(newFeedback);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/75 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-7 text-white bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 relative shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isEn ? "Continuous Quality Improvement" : "Amélioration Continue de l'Écoute"}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            {isEn ? "Your Post-Session Feedback" : "Votre Avis sur l'Écoute Reçue"}
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl">
            {isEn 
              ? "Your feedback helps our team and administration continuously enhance the empathy, warmth, and responsiveness provided to bereaved families in Côte d'Ivoire."
              : "Votre retour d'expérience aide directement notre administration à perfectionner la chaleur, l'empathie et la rapidité de l'accompagnement offert aux familles endeuillées."}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {submitted ? (
            <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {isEn ? "Thank you from the bottom of our hearts" : "Merci du fond du cœur pour votre précieux retour"}
              </h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                {isEn 
                  ? "Your evaluation has been securely transmitted to our administrative and psychological supervision board. It directly contributes to maintaining our standard of benevolence and tender care."
                  : "Votre évaluation a été transmise à notre équipe de supervision administrative et psychologique. Chaque avis nous aide à veiller à ce qu'aucun parent ne reste isolé face à l'épreuve du deuil."}
              </p>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  {isEn ? "Close window" : "Fermer cette fenêtre"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Overall Star Rating */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/60 to-stone-50 border border-amber-200/80 text-center space-y-3">
                <label className="block text-sm font-bold text-stone-900">
                  {isEn ? "Overall experience of the session" : "Quelle note globale attribuez-vous à cet échange ?"}
                </label>
                
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || overallRating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setOverallRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 sm:p-2 transition-transform hover:scale-125 cursor-pointer focus:outline-hidden"
                        aria-label={`${star} étoiles`}
                      >
                        <Star 
                          className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                            active 
                              ? 'text-amber-500 fill-amber-400 drop-shadow-xs' 
                              : 'text-stone-300'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs sm:text-sm font-medium text-amber-900/90 h-5">
                  {ratingDescriptions[hoverRating || overallRating]}
                </p>
              </div>

              {/* 2. Specific Criteria Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? "Quality Criteria Assessment" : "Critères détaillés de qualité"}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Criterion 1: Empathy */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-800">
                        {isEn ? "Empathy & Kindness" : "Bienveillance & Empathie"}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">{listeningEmpathy}/5</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setListeningEmpathy(val)}
                          className={`flex-1 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                            listeningEmpathy >= val 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Criterion 2: Speed */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-800">
                        {isEn ? "Response Speed" : "Rapidité de contact"}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">{responseSpeed}/5</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setResponseSpeed(val)}
                          className={`flex-1 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                            responseSpeed >= val 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Criterion 3: Relief */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-800">
                        {isEn ? "Comfort & Relief" : "Soulagement & Utilité"}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">{reliefAndGuidance}/5</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setReliefAndGuidance(val)}
                          className={`flex-1 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                            reliefAndGuidance >= val 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Session Context & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isEn ? "Type of Support Evaluated" : "Type d'échange évalué"}
                  </label>
                  <select
                    value={selectedSessionType}
                    onChange={(e) => setSelectedSessionType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="telephone">Permanence Téléphonique (+225)</option>
                    <option value="chat_direct">Tchat d'Aide Immédiate / WhatsApp</option>
                    <option value="presentiel">Entretien Présentiel / Groupe</option>
                    <option value="visio">Accompagnement Visio en ligne</option>
                    <option value="autre">Autre orientation solidaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isEn ? "Your Relationship / Role" : "Vous êtes"}
                  </label>
                  <select
                    value={respondentRole}
                    onChange={(e) => setRespondentRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="parange">Parent endeuillé (Maman ou Papa Parange)</option>
                    <option value="fratrie">Fratrie / Frère ou Sœur</option>
                    <option value="proche">Proche de la famille / Conjoint</option>
                    <option value="soignant">Personnel de santé / Relais</option>
                    <option value="anonyme">Participant anonyme</option>
                  </select>
                </div>
              </div>

              {/* 4. Recommendation Question */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-semibold text-emerald-950 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-emerald-700" />
                  <span>{isEn ? "Would you recommend this support to other families?" : "Recommanderiez-vous notre permanence à d'autres familles éprouvées ?"}</span>
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      wouldRecommend
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {isEn ? "Yes, absolutely" : "Oui, absolument"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !wouldRecommend
                        ? 'bg-stone-700 text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {isEn ? "Not currently" : "Pas encore"}
                  </button>
                </div>
              </div>

              {/* 5. Qualitative Feedback & Improvement Suggestions */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isEn 
                      ? "What helped you most during this exchange? (Your feedback)" 
                      : "Qu'est-ce qui vous a le plus aidé(e) ou apporté de réconfort ?"}
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={isEn 
                      ? "Share your impression or words on the quality of listening received..." 
                      : "Partagez librement vos ressentis sur la qualité de l'écoute, les paroles apaisantes..."}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden placeholder:text-stone-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isEn ? "What could the administration improve?" : "Comment l'administration peut-elle encore améliorer ce soutien ? (Suggestions)"}</span>
                  </label>
                  <input
                    type="text"
                    value={improvementSuggestion}
                    onChange={(e) => setImprovementSuggestion(e.target.value)}
                    placeholder={isEn ? "E.g., broader call hours, follow-up WhatsApp summary..." : "Ex: plus de plages horaires, guide récapitulatif par SMS..."}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* 6. Confidentiality Toggle */}
              <div className="p-3.5 rounded-xl bg-stone-100/80 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-stone-600" />
                    <span>{isEn ? "Confidentiality of your evaluation" : "Confidentialité de votre avis"}</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                    />
                    <span className="text-xs text-stone-700 font-medium">
                      {isEn ? "Keep 100% anonymous" : "Garder mon avis 100% anonyme"}
                    </span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-in fade-in">
                    <div>
                      <input
                        type="text"
                        value={respondentName}
                        onChange={(e) => setRespondentName(e.target.value)}
                        placeholder={isEn ? "Your name or nickname" : "Votre prénom ou pseudo"}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={respondentCity}
                        onChange={(e) => setRespondentCity(e.target.value)}
                        placeholder="Ville (Abidjan, Bouaké...)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isEn ? "Cancel / Skip" : "Passer cette étape"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{isEn ? "Submitting..." : "Transmission en cours..."}</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isEn ? "Send My Feedback to Admin" : "Transmettre mon avis à l'administration"}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
