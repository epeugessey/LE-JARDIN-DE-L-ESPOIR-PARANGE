import React, { useState } from 'react';
import { AdminNotificationMessage } from '../../types';
import { 
  Bell, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  Send, 
  Check, 
  Filter, 
  Sparkles,
  Info,
  Volume2
} from 'lucide-react';

interface AdminNotificationsManagerProps {
  notifications?: AdminNotificationMessage[];
  onUpdateStatus: (id: string, status: 'unread' | 'read' | 'handled' | 'archived') => void;
  onDeleteNotification: (id: string) => void;
  onAddTestNotification?: () => void;
}

export const AdminNotificationsManager: React.FC<AdminNotificationsManagerProps> = ({
  notifications = [],
  onUpdateStatus,
  onDeleteNotification,
  onAddTestNotification
}) => {
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'critique' | 'chat_direct' | 'rappel'>('all');

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const filtered = safeNotifications.filter(n => {
    if (!n) return false;
    if (filterType === 'unread') return n.status === 'unread';
    if (filterType === 'critique') return n.urgencyLevel === 'critique';
    if (filterType === 'chat_direct') return n.type === 'chat_direct';
    if (filterType === 'rappel') return n.type === 'rappel' || n.type === 'ecoute_urgente';
    return true;
  });

  const unreadCount = safeNotifications.filter(n => n && n.status === 'unread').length;
  const criticalCount = safeNotifications.filter(n => n && n.urgencyLevel === 'critique' && n.status !== 'handled').length;

  return (
    <div className="space-y-8">
      {/* EXPLANATORY HERO: Comment l'administrateur reçoit les alertes */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0 shadow-md">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Système de Réception en Temps Réel
                </span>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white animate-pulse">
                    {unreadCount} NOUVEAU{unreadCount > 1 ? 'X' : ''}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-accent text-white">
                Central des Alertes, Demandes d'Écoute & Messages
              </h2>
            </div>
          </div>

          {onAddTestNotification && (
            <button
              onClick={onAddTestNotification}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-emerald-100 border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simuler une alerte test</span>
            </button>
          )}
        </div>

        {/* 4 Points Clairs expliquant comment l'admin reçoit tout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Réception Immédiate</span>
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              Toute demande envoyée depuis la chatbox ou les formulaires est consignée immédiatement ici et met à jour le badge d'alerte rouge dans le menu.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              <span>2. Réponse 1-Clic WhatsApp</span>
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              Cliquez sur « Répondre via WhatsApp » pour ouvrir directement l'application avec un message d'accueil pré-rempli et bienveillant.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <div className="font-bold text-amber-200 flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              <span>3. Appel Direct & Suivi</span>
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              Bouton d'appel direct vers le parent. Vous pouvez marquer l'alerte comme « Traitée » une fois le contact établi pour garder un registre propre.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-stone-900 text-white font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Tous les messages ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'unread'
                ? 'bg-rose-600 text-white font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>Non traités</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-rose-700 text-[10px] font-black rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterType('critique')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'critique'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>🚨 Détresse critique</span>
            {criticalCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-amber-800 text-[10px] font-black rounded-full">
                {criticalCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterType('chat_direct')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              filterType === 'chat_direct'
                ? 'bg-emerald-700 text-white font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            💬 Chatbox directe
          </button>
          <button
            onClick={() => setFilterType('rappel')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              filterType === 'rappel'
                ? 'bg-teal-700 text-white font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            📞 Demandes de rappel
          </button>
        </div>

        <span className="text-xs text-stone-500">
          {filtered.length} élément{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-800 font-serif-accent">
            Aucun message dans cette catégorie
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Toutes les demandes de cette section sont actuellement traitées. Les nouvelles alertes apparaîtront ici automatiquement.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isUnread = item.status === 'unread';
            const isCritical = item.urgencyLevel === 'critique';
            const isHandled = item.status === 'handled';
            
            // Clean phone for WhatsApp link
            const cleanPhone = item.senderPhone.replace(/\D/g, '');
            const intlPhone = cleanPhone.startsWith('225') ? cleanPhone : `225${cleanPhone}`;
            const whatsappText = encodeURIComponent(
              `Bonjour ${item.senderName},\n\nJe suis l'écoutant du Jardin de l'Espoir : Parange en Côte d'Ivoire. Nous avons bien reçu votre demande d'aide et sommes là pour vous accompagner en toute confidentialité.`
            );

            return (
              <div 
                key={item.id}
                className={`rounded-3xl p-5 sm:p-6 transition-all border shadow-xs ${
                  isCritical && !isHandled
                    ? 'bg-rose-50/70 border-rose-300'
                    : isUnread
                    ? 'bg-amber-50/50 border-amber-200'
                    : isHandled
                    ? 'bg-white/90 border-stone-200 opacity-90'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left: Message content & Sender */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-600 text-white'
                          : item.urgencyLevel === 'haute'
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {item.urgencyLevel === 'critique' ? '🚨 Détresse Critique' : item.urgencyLevel === 'haute' ? '⚡ Urgence Haute' : '💬 Écoute'}
                      </span>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {item.type === 'chat_direct' ? 'Message Chatbox Direct' : item.type === 'ecoute_urgente' ? 'Aide Immédiate' : 'Demande Rappel'}
                      </span>

                      {isHandled ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Traité
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 animate-pulse">
                          ● En attente de contact
                        </span>
                      )}

                      <span className="text-[11px] text-stone-400 flex items-center gap-1 ml-auto md:ml-0">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-stone-900 font-serif-accent">
                      {item.subject}
                    </h4>

                    {/* Sender Identity card */}
                    <div className="p-3 rounded-2xl bg-white border border-stone-200/80 text-xs flex flex-wrap items-center gap-4 text-stone-700">
                      <div>
                        <span className="text-stone-400 text-[10px] block">Expéditeur :</span>
                        <strong className="text-stone-900">{item.senderName}</strong>
                      </div>

                      <div>
                        <span className="text-stone-400 text-[10px] block">Contact Téléphone / WhatsApp :</span>
                        <strong className="text-emerald-800 tracking-wide">{item.senderPhone}</strong>
                      </div>

                      {item.senderCity && (
                        <div>
                          <span className="text-stone-400 text-[10px] block">Localisation :</span>
                          <span className="text-stone-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            {item.senderCity}
                          </span>
                        </div>
                      )}

                      {item.senderEmail && (
                        <div>
                          <span className="text-stone-400 text-[10px] block">Courriel :</span>
                          <span className="text-stone-700">{item.senderEmail}</span>
                        </div>
                      )}
                    </div>

                    {/* The message itself */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs text-stone-800 leading-relaxed italic">
                      "{item.message}"
                    </div>

                    {item.metadata?.source && (
                      <div className="text-[10px] text-stone-500">
                        Canal : <span className="font-semibold text-stone-700">{item.metadata.source}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Quick Action Buttons for the Admin */}
                  <div className="flex flex-row md:flex-col gap-2 shrink-0 pt-2 md:pt-0">
                    {/* 1. WhatsApp Instant Contact */}
                    <a
                      href={`https://wa.me/${intlPhone}?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      title="Ouvrir WhatsApp pour dialoguer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>

                    {/* 2. Direct Phone Call */}
                    <a
                      href={`tel:${item.senderPhone}`}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      title="Composer le numéro"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>Appeler</span>
                    </a>

                    {/* 3. Mark Handled */}
                    {!isHandled ? (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'handled')}
                        className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-xs transition-colors cursor-pointer"
                        title="Marquer comme pris en charge"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Marquer traité</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'unread')}
                        className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                        title="Remettre en attente"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Réactiver</span>
                      </button>
                    )}

                    {/* 4. Delete */}
                    <button
                      onClick={() => onDeleteNotification(item.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer self-center md:self-end"
                      title="Supprimer cette alerte"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
