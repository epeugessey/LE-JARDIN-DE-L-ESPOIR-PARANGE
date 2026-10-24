import { TrainingRegistrationRequest } from '../types';

export const INITIAL_TRAINING_REGISTRATIONS: TrainingRegistrationRequest[] = [
  {
    id: 'tr-001',
    name: 'Mme Christine Yao',
    institution: 'CHU de Cocody - Service Maternité & Néonatalogie',
    email: 'c.yao@chu-cocody.ci',
    phone: '+225 07 48 22 19 01',
    city: 'Abidjan',
    moduleCode: 'MOD-01',
    moduleTitle: 'Annonce d’un décès périnatal et premiers gestes soignants',
    participantsCount: 8,
    message: 'Formation demandée pour l’équipe de sages-femmes et puéricultrices de garde de nuit.',
    requestedAt: '2025-05-10T09:30:00Z',
    status: 'confirme',
    notes: 'Session programmée le 14 juin 2025 en salle de conférence maternité.'
  },
  {
    id: 'tr-002',
    name: 'Dr. Kouadio Armand',
    institution: 'Hôpital Général de Bouaké - Pôle Mère-Enfant',
    email: 'armand.kouadio@sante.gouv.ci',
    phone: '+225 05 12 88 44 20',
    city: 'Bouaké',
    moduleCode: 'MOD-02',
    moduleTitle: 'L’arbre des souvenirs : Créer des rituels et des empreintes tangibles',
    participantsCount: 12,
    message: 'Mise en place de boîtes à souvenirs et empreintes pour les familles touchées dans le Gbêkê.',
    requestedAt: '2025-05-12T14:15:00Z',
    status: 'en_attente',
    notes: 'Attente confirmation de la convention de partenariat avec la direction régionale.'
  },
  {
    id: 'tr-003',
    name: 'M. Soro Lassina',
    institution: 'ONG Espoir & Relais Communautaires Nord',
    email: 'lassina.soro@ong-espoir.ci',
    phone: '+225 01 02 77 99 15',
    city: 'Korhogo',
    moduleCode: 'MOD-03',
    moduleTitle: 'Psychopathologie du deuil périnatal et écoute empathique',
    participantsCount: 6,
    message: 'Formation des pairs-aidants et psychologues bénévoles du réseau local.',
    requestedAt: '2025-05-14T11:00:00Z',
    status: 'en_cours',
    notes: 'Module théorique en ligne validé, stage pratique en cours à Korhogo.'
  },
  {
    id: 'tr-004',
    name: 'Mme Affoué Delphine',
    institution: 'Clinique Internationale de Treichville',
    email: 'd.affoue@citreichville.com',
    phone: '+225 07 89 44 11 32',
    city: 'Abidjan',
    moduleCode: 'MOD-01',
    moduleTitle: 'Annonce d’un décès périnatal et premiers gestes soignants',
    participantsCount: 4,
    message: 'Sensibilisation de notre service d’obstétrique suite à plusieurs cas récents.',
    requestedAt: '2025-05-15T16:45:00Z',
    status: 'en_attente',
    notes: 'Rappel téléphonique prévu sous 48h.'
  }
];
