import React, { useState } from 'react';
import { 
  Phone, 
  Heart, 
  Sparkles, 
  MessageCircle, 
  Send, 
  X, 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AdminNotificationMessage } from '../types';

interface FloatingImmediateHelpButtonProps {
  onOpenConsultationModal?: () => void;
  onSendDirectMessage?: (notification: AdminNotificationMessage) => void;
  phone1?: string;
  phone2?: string;
}

export const FloatingImmediateHelpButton: React.FC<FloatingImmediateHelpButtonProps> = ({
  onOpenConsultationModal,
  onSendDirectMessage,
  phone1 = '07 59 87 21 61',
  phone2 = '05 75 23 93 12'
}) => {
  const { language, isEn } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'hotline'>('chat');

  // Direct chat message state
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [senderLocation, setSenderLocation] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'critique' | 'haute' | 'normale'>('haute');
  const [messageText, setMessageText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) {
      setFormError(isEn 
        ? 'Please enter your message before sending.' 
        : 'Veuillez rédiger votre message avant de l\'envoyer.'
      );
      return;
    }

    setFormError(null);

    const notificationPayload: AdminNotificationMessage = {
      id: `chat-${Date.now()}`,
      type: urgencyLevel === 'critique' ? 'ecoute_urgente' : 'chat_direct',
      senderName: senderName.trim() || (isEn ? 'Anonymous Parent' : 'Parent anonyme'),
      senderPhone: senderContact.trim() || (isEn ? 'Not provided (Web message)' : 'Non renseigné (Message web direct)'),
      senderCity: senderLocation.trim() || "COTE D'IVOIRE",
      subject: isEn 
        ? `Immediate Help Request (${urgencyLevel === 'critique' ? 'Critical Distress' : 'Listening Support'})` 
        : `Demande d'aide immédiate (${urgencyLevel === 'critique' ? 'Détresse Aiguë' : 'Besoin d\'écoute'})`,
      message: messageText.trim(),
      timestamp: new Date().toISOString(),
      urgencyLevel: urgencyLevel,
      status: 'unread',
      metadata: {
        source: 'Chatbox DEMANDE D\'AIDE IMMÉDIATE',
        requestedContact: senderContact.trim() ? 'whatsapp' : 'web_chat'
      }
    };

    // 1. Send via callback to parent if available
    if (onSendDirectMessage) {
      try {
        onSendDirectMessage(notificationPayload);
      } catch (err) {
        console.warn('Error in onSendDirectMessage callback', err);
      }
    }

    // 2. Direct guaranteed persistence into localStorage
    try {
      const stored = localStorage.getItem('jde_admin_notifications');
      const existingList = stored ? JSON.parse(stored) : [];
      const updatedList = [notificationPayload, ...existingList];
      localStorage.setItem('jde_admin_notifications', JSON.stringify(updatedList));
      // Dispatch custom storage event for instant admin synchronization
      window.dispatchEvent(new Event('jde_notifications_updated'));
    } catch (err) {
      console.warn('Could not save notification directly to localStorage', err);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setMessageText('');
      setSenderName('');
      setSenderContact('');
      setSenderLocation('');
      setIsSubmitted(false);
      setIsOpen(false);
    }, 3500);
  };

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white shadow-xl hover:scale-105 transition-all cursor-pointer border border-amber-300 group"
        title="DEMANDE D'AIDE IMMÉDIATE"
      >
        <Heart className="w-5 h-5 text-amber-200 fill-amber-200/40 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-auto">
      
      {/* EXPANDABLE CHATBOX WINDOW */}
      {isOpen && (
        <div 
          className="mb-3 w-[calc(100vw-2rem)] sm:w-96 rounded-3xl bg-white shadow-2xl border-2 border-amber-400/80 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 relative flex flex-col max-h-[85vh]"
          style={{ minHeight: '440px' }}
        >
          {/* Logo Watermark in Chatbox Background */}
          <div 
            className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.07] pointer-events-none"
            style={{ backgroundImage: "url('/logo-circular.jpg')" }}
          />

          {/* Chatbox Header */}
          <div className="relative z-10 p-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white flex items-center justify-between border-b border-amber-300/30">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Heart className="w-5 h-5 fill-stone-950 text-stone-950" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide font-serif-accent text-amber-300">
                  {isEn ? "IMMEDIATE HELP REQUEST" : "DEMANDE D'AIDE IMMÉDIATE"}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-200 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isEn ? "Active 24/7 Helpline • Côte d'Ivoire" : "Permanence active 24/7 en Côte d'Ivoire"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={isEn ? "Close chatbox" : "Fermer la chatbox"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Tab Switcher */}
          <div className="relative z-10 grid grid-cols-2 bg-stone-100/90 border-b border-stone-200 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isEn ? "Direct Message" : "Message Direct"}</span>
            </button>
            <button
              onClick={() => setActiveTab('hotline')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'hotline'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{isEn ? "Phone Lines" : "Lignes Téléphoniques"}</span>
            </button>
          </div>

          {/* Chatbox Body Content */}
          <div className="relative z-10 p-4 flex-1 overflow-y-auto space-y-3 text-xs">
            
            {activeTab === 'chat' ? (
              isSubmitted ? (
                <div className="py-8 px-2 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 font-serif-accent">
                    {isEn ? "Message Sent Directly to Our Team" : "Message Transmis à Notre Équipe"}
                  </h4>
                  <p className="text-stone-600 leading-relaxed text-xs">
                    {isEn 
                      ? "Your request has been received by our on-call listening team in Côte d'Ivoire. We will call or WhatsApp you very promptly with complete confidentiality."
                      : "Votre demande a été reçue par notre équipe d'écoute de permanence en Côte d'Ivoire. Un bénévole ou soignant vous contactera très rapidement dans la plus stricte bienveillance."}
                  </p>
                  
                  {/* WhatsApp instant option */}
                  <a
                    href={`https://wa.me/225${phone1.replace(/\s+/g, '')}?text=${encodeURIComponent(
                      `[Message direct depuis le site] Bonjour, je sollicite une aide immédiate. Nom: ${senderName || 'Anonyme'} - Contact: ${senderContact} - Ville: ${senderLocation || "Côte d'Ivoire"} : "${messageText}"`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isEn ? "Open WhatsApp Immediately" : "Ouvrir aussi sur WhatsApp"}</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmitMessage} className="space-y-2.5">
                  <p className="text-stone-600 text-[11px] leading-relaxed bg-amber-50/80 p-2 rounded-xl border border-amber-200/80">
                    <strong>{isEn ? "Confidential & Free:" : "Écoute solidaire & confidentielle :"}</strong>{' '}
                    {isEn 
                      ? "Write to us directly. Your message will be instantly received by our coordination team at Le Jardin de l'Espoir : Parange in Côte d'Ivoire."
                      : "Écrivez-nous directement ici. Votre message est transmis instantanément à la coordination du Jardin de l'Espoir : Parange en Côte d'Ivoire."}
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                      {isEn ? "Your Name or First Name (Optional)" : "Votre Prénom ou Nom (ou Anonyme)"}
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={isEn ? "e.g. Marie, Paul, or A Mother" : "Ex: Marie, ou Un papa endeuillé"}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                        {isEn ? "WhatsApp or Phone (Optional)" : "WhatsApp ou Téléphone (Optionnel)"}
                      </label>
                      <input
                        type="tel"
                        value={senderContact}
                        onChange={(e) => setSenderContact(e.target.value)}
                        placeholder="Ex: 07 59 87 21 61"
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                        {isEn ? "Location (Côte d'Ivoire)" : "Localité (Côte d'Ivoire)"}
                      </label>
                      <input
                        type="text"
                        value={senderLocation}
                        onChange={(e) => setSenderLocation(e.target.value)}
                        placeholder="Ex: COTE D'IVOIRE"
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                      {isEn ? "Level of urgency" : "Niveau de détresse / Urgence"}
                    </label>
                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setUrgencyLevel('critique')}
                        className={`py-1 rounded-lg border font-semibold cursor-pointer ${
                          urgencyLevel === 'critique'
                            ? 'bg-rose-100 text-rose-800 border-rose-400 font-bold'
                            : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}
                      >
                        🚨 {isEn ? "Critical" : "Critique"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgencyLevel('haute')}
                        className={`py-1 rounded-lg border font-semibold cursor-pointer ${
                          urgencyLevel === 'haute'
                            ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                            : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}
                      >
                        ⚡ {isEn ? "High" : "Urgent"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgencyLevel('normale')}
                        className={`py-1 rounded-lg border font-semibold cursor-pointer ${
                          urgencyLevel === 'normale'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                            : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}
                      >
                        💬 {isEn ? "Normal" : "Écoute"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                      {isEn ? "Your message or situation *" : "Votre message de détresse ou question *"}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      placeholder={isEn 
                        ? "Briefly describe what you are going through right now..." 
                        : "Décrivez en quelques mots ce que vous traversez en ce moment..."}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 resize-none"
                    />
                  </div>

                  {formError && (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium animate-shake">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isEn ? "Send Directly from Platform" : "Envoyer directement depuis le site"}</span>
                  </button>
                </form>
              )
            ) : (
              /* HOTLINE DIRECT */
              <div className="space-y-3">
                <p className="text-xs text-stone-600 leading-relaxed bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80">
                  {isEn 
                    ? "Our helpline is available 7 days a week in Côte d'Ivoire. Calls are confidential, anonymous, and free."
                    : "Nos lignes de permanence sont ouvertes 7 jours sur 7 en Côte d'Ivoire. L'appel est anonyme, gratuit et confidentiel."}
                </p>

                <a
                  href={`tel:+225${phone1.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>+225 {phone1}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md uppercase font-bold">
                    {isEn ? "Direct Call" : "Appel Direct"}
                  </span>
                </a>

                <a
                  href={`tel:+225${phone2.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-xs font-bold transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-700" />
                    <span>+225 {phone2}</span>
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md uppercase font-bold">
                    {isEn ? "Line 2" : "Ligne 2"}
                  </span>
                </a>

                <a
                  href={`https://wa.me/225${phone1.replace(/\s+/g, '')}?text=${encodeURIComponent(
                    "Bonjour, je sollicite une écoute en urgence auprès du Jardin de l'Espoir : Parange suite à la perte de notre enfant."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{isEn ? "Write on WhatsApp" : "Écrire sur WhatsApp"}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-200" />
                </a>

                {/* Facebook Support Group Direct Link */}
                <a
                  href="https://www.facebook.com/groups/lejardindelespoirparange/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-white text-[#1877F2] flex items-center justify-center font-black text-[10px] shrink-0">f</span>
                    <span>{isEn ? "Join Facebook Parange Group" : "Groupe Facebook des Paranges"}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-blue-200" />
                </a>

                {onOpenConsultationModal && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenConsultationModal();
                    }}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? "Request Full Consultation" : "Demander un rappel prioritaire complet"}</span>
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Chatbox Footer */}
          <div className="relative z-10 px-4 py-2 bg-stone-50 border-t border-stone-200 text-[10px] text-stone-500 flex items-center justify-between">
            <span>Le Jardin de l'Espoir : Parange • ONG Côte d'Ivoire</span>
            <span className="font-semibold text-emerald-800">{isEn ? "100% Confidential" : "100% Confidentiel"}</span>
          </div>

        </div>
      )}

      {/* CHEERFUL FLOATING LAUNCHER BUTTON ("DEMANDE D'AIDE IMMÉDIATE") */}
      <div className="flex items-center gap-1.5 shadow-2xl rounded-full bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-600 text-white border-2 border-amber-300/90 p-1.5 pl-4 pr-3 backdrop-blur-md transition-all hover:scale-105 duration-200 cursor-pointer group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 text-xs sm:text-sm font-extrabold tracking-wide uppercase text-white cursor-pointer focus:outline-hidden"
          title="DEMANDE D'AIDE IMMÉDIATE — Cliquez pour ouvrir la chatbox"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-85"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>

          <span className="flex items-center gap-1.5 drop-shadow-xs font-serif-accent text-amber-200">
            <Heart className="w-4 h-4 text-rose-300 fill-rose-300 animate-pulse" />
            <span>{isEn ? "IMMEDIATE HELP REQUEST" : "DEMANDE D'AIDE IMMÉDIATE"}</span>
          </span>
        </button>

        {/* Small toggle icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          title="Ouvrir la chatbox"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>

        {/* Small dismiss button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          title="Réduire"
          aria-label="Réduire"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
