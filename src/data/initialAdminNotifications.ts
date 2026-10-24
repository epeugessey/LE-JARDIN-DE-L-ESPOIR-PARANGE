import { AdminNotificationMessage } from '../types';

export const INITIAL_ADMIN_NOTIFICATIONS: AdminNotificationMessage[] = [
  {
    id: 'alert-1',
    type: 'ecoute_urgente',
    senderName: 'Affi Clarisse',
    senderPhone: '07 48 19 32 01',
    senderEmail: 'clarisse.affi@gmail.com',
    senderCity: 'Abidjan (Cocody)',
    subject: 'Détresse aiguë suite à une fausse couche tardive',
    message: 'Je viens de rentrer de la clinique après la perte de mon bébé à 22 semaines. Je n\'arrête pas de trembler et de pleurer, je me sens tellement coupable. Aidez-moi s\'il vous plaît, je ne sais plus quoi faire.',
    timestamp: 'Aujourd\'hui à 06h42',
    urgencyLevel: 'critique',
    status: 'unread',
    metadata: {
      source: 'Bouton Aide Immédiate / Chatbox Directe',
      role: 'parange',
      requestedContact: 'whatsapp'
    }
  },
  {
    id: 'alert-2',
    type: 'rappel',
    senderName: 'Konan Yves-Roland',
    senderPhone: '05 84 92 11 45',
    senderEmail: 'yves.konan@yahoo.fr',
    senderCity: 'Bouaké',
    subject: 'Demande de rappel pour le Groupe des Pères',
    message: 'Bonjour, j\'ai perdu mon petit garçon il y a 3 mois. J\'aimerais être rappelé en fin de journée (après 18h) pour savoir comment intégrer le cercle des papas paranges.',
    timestamp: 'Aujourd\'hui à 05h15',
    urgencyLevel: 'haute',
    status: 'unread',
    metadata: {
      source: 'Formulaire de rappel en ligne',
      preferredTime: '18h00 - 20h00',
      role: 'papa-parange'
    }
  },
  {
    id: 'alert-3',
    type: 'chat_direct',
    senderName: 'Maman de Liam',
    senderPhone: '07 55 43 89 20',
    senderCity: 'Yopougon',
    subject: 'Message direct depuis la chatbox du site',
    message: 'Est-ce que vos psychologues reçoivent aussi le samedi matin ? J\'ai besoin de parler à quelqu\'un qui comprend ce que je traverse.',
    timestamp: 'Hier à 21h30',
    urgencyLevel: 'normale',
    status: 'read',
    metadata: {
      source: 'Chatbox Immédiate',
      role: 'parange'
    }
  },
  {
    id: 'alert-4',
    type: 'contact_general',
    senderName: 'Dr. Gnahoré Eric',
    senderPhone: '01 02 88 33 21',
    senderEmail: 'e.gnahore@maternite-chu.ci',
    senderCity: 'Abidjan',
    subject: 'Demande de kits de mémoire pour le service néonatal',
    message: 'Bonjour l\'équipe du Jardin de l\'Espoir : Parange, nous aimerions recevoir un lot de 30 kits de mémoire et organiser une sensibilisation de notre équipe de sages-femmes.',
    timestamp: 'Il y a 2 jours',
    urgencyLevel: 'normale',
    status: 'traite',
    notes: 'Rappelé par Mme Peugessey le 08/09. Livraison de 30 kits programmée.',
    metadata: {
      source: 'Formulaire soignant',
      role: 'soignant-relais'
    }
  }
];
