import { ResourceGuide, GardenFlower, TrainingModule, BudgetItem } from '../types';

export const INITIAL_RESOURCES: ResourceGuide[] = [
  {
    id: 'res-guide-parange',
    title: "Le Guide Essentiel du Parange : Traverser la perte d'un enfant en Côte d'Ivoire",
    category: 'guide-du-parange',
    theme: 'deuil-parental',
    targetAudience: 'paranges',
    summary: "Le livret fondamental édité par Le Jardin de l'Espoir : Parange pour comprendre les vagues du deuil, légitimer sa douleur face aux silences et retrouver un souffle jour après jour.",
    readTime: '8 min',
    pdfDownloadUrl: '#guide-parange-pdf',
    keyAdvice: [
      "Le mot 'Parange' (Parent d'Ange) vous rend votre identité : vous restez parent pour toujours, même après le départ de votre enfant.",
      "La douleur physique et psychologique n'est pas de la folie : le cœur brisé a besoin d'écoute et de soins, pas de rejet ni de honte.",
      "Ne vous isolez pas : les rites funéraires s'arrêtent au bout de quelques jours, mais votre deuil commence. Rejoignez un Groupe de Soutien Psychologique (GSP).",
      "Avancez à votre rythme : chaque minute respirée est déjà une victoire sans trahir la mémoire de votre enfant."
    ],
    fullContent: "En Côte d'Ivoire, la perte d'un enfant est encore trop souvent traitée en silence, confinée aux seuls rites funéraires sans aucun suivi psychologique. Les Paranges se retrouvent confrontés à une solitude abyssale. Ce guide a été conçu par des parents ayant eux-mêmes traversé cette épreuve et par des psychologues spécialisés, pour vous apporter des repères concrets, chaleureux et bienveillants."
  },
  {
    id: 'res-deuil-perinatal',
    title: "Vivre et reconnaître le deuil périnatal : quand un bébé s'envole avant ou à la naissance",
    category: 'fiche-conseil',
    theme: 'deuil-perinatal',
    targetAudience: 'paranges',
    summary: "Mort in utero, fausse couche tardive ou décès néonatal : briser l'invisibilité et le déni social qui blessent tant les mamans et les papas.",
    readTime: '5 min',
    keyAdvice: [
      "Reconnaître le statut d'enfant : 'Tu en auras d'autres' est une phrase dévastatrice. Ce bébé était unique et attendu avec amour.",
      "Conservez des souvenirs tangibles : le bracelet de naissance, une échographie, une empreinte ou une mèche de cheveux pour ancrer son existence.",
      "Donnez-lui un prénom : nommer son enfant permet d'inscrire sa place dans la lignée familiale.",
      "Le deuil périnatal touche aussi le père : les pères masquent souvent leur peine pour 'tenir le coup', mais ont tout autant besoin de soutien."
    ],
    fullContent: "Le deuil périnatal est un deuil sans souvenirs partagés avec la communauté, ce qui renforce l'isolement. Au Jardin de l'Espoir : Parange, un groupe spécifique est réservé aux mamans et papas endeuillés au stade périnatal pour pouvoir parler librement de leur bébé sans minimisation."
  },
  {
    id: 'res-fratrie-endeuillee',
    title: "Accompagner la fratrie endeuillée : les frères et sœurs ont aussi le cœur brisé",
    category: 'fiche-conseil',
    theme: 'fratrie-endeuillee',
    targetAudience: 'fratrie',
    summary: "Quand un enfant ou adolescent perd son frère ou sa sœur, il devient souvent un 'endeuillé invisible'. Comment le protéger et lui donner la parole.",
    readTime: '6 min',
    keyAdvice: [
      "Ne cachez pas vos larmes d'adulte : voir un parent pleurer montre à l'enfant que la tristesse est naturelle et partagée.",
      "Désamorcez la culpabilité du survivant : l'enfant peut croire qu'une dispute ou une pensée négative est responsable du drame.",
      "Évitez la comparaison ou l'idéalisation excessive de l'enfant disparu : le frère ou la sœur vivant doit pouvoir continuer à grandir avec ses propres défauts et rêves.",
      "Préservez des moments individuels avec chaque enfant pour vérifier comment il vit son quotidien à l'école et avec ses amis."
    ],
    fullContent: "Les frères et sœurs peuvent s'interdire de souffrir pour 'ne pas rajouter de peine à maman et papa'. Ils prennent parfois le rôle de l'adulte protecteur. Les cercles d'écoute et les ateliers d'art-thérapie leur permettent d'extérioriser leurs émotions sans craindre de blesser leurs parents."
  },
  {
    id: 'res-couple-apres-drame',
    title: "Couple & Culpabilité : préserver son foyer après la perte d'un enfant",
    category: 'capsule-psychoeducation',
    theme: 'couple-et-culpabilite',
    targetAudience: 'paranges',
    summary: "Chaque conjoint vit son deuil à un rythme différent. Comprendre ces décalages pour éviter l'incompréhension, la rancœur et la rupture conjugale.",
    readTime: '7 min',
    keyAdvice: [
      "Accepter des rythmes différents : l'un peut avoir besoin de parler sans cesse, tandis que l'autre se réfugie dans le travail ou le silence.",
      "Ne pas mesurer l'amour à la quantité de larmes visibles : la pudeur ou l'anesthésie émotionnelle n'est pas un manque d'amour.",
      "Éviter la recherche d'un coupable : les accidents ou les maladies créent des tourments intérieurs immenses qui ne doivent pas se transformer en accusation mutuelle.",
      "Créer des micro-moments de trêve : s'autoriser à prendre un thé ou à marcher ensemble sans aborder le drame pour recharger son énergie."
    ],
    fullContent: "Les statistiques montrent une fragilisation accrue des couples après un deuil d'enfant. Nos ateliers thématiques mensuels sur le couple fournissent un cadre de médiation douce où chaque parent réapprend à écouter la manière dont son conjoint endure l'épreuve."
  },
  {
    id: 'res-briser-tabou-ci',
    title: "« Ce n'est pas de la folie, c'est du deuil » : Guide pour l'entourage et la communauté",
    category: 'fiche-conseil',
    theme: 'tabou-communaute',
    targetAudience: 'soignants-relais',
    summary: "Ce qu'il faut dire — et ce qu'il ne faut jamais dire — à un parent qui a perdu son enfant. Déconstruire les tabous culturels en Côte d'Ivoire.",
    readTime: '5 min',
    keyAdvice: [
      "Ce qu'il ne faut pas dire : 'C'est la volonté de Dieu, oublie', 'Tu es encore jeune, tu en feras un autre', 'Arrête de pleurer pour laisser son âme reposer'.",
      "Ce qui soulage vraiment : 'Je suis là avec toi', 'Je n'ai pas de mots parfaits, mais je t'aime', 'Parle-moi de lui / d'elle si tu le souhaites'.",
      "Le soutien concret : apportez un repas cuisiné, faites une course, proposez une aide sans attendre qu'on vous la demande.",
      "Continuer à être présent après les funérailles : le 3e et le 6e mois sont souvent les périodes les plus dures car tout le monde est reparti à sa vie."
    ],
    fullContent: "Dans nos sociétés, par maladresse ou par peur de la contagion du malheur, l'entourage enjoint souvent les parents à 'tourner la page rapidement'. Cette injonction plonge le Parange dans un silence destructeur. Notre campagne de sensibilisation vise à transformer la pitié gênée en compassion active."
  }
];

export const INITIAL_FLOWERS: GardenFlower[] = [
  {
    id: 'flower-1',
    authorName: 'Aissatou & Ibrahim (Abidjan Cocody)',
    isAnonymous: false,
    relationship: 'Pour notre Ange Rayan (4 ans)',
    flowerType: 'tournesol',
    flowerColor: '#F59E0B',
    message: 'Depuis ce jour tragique de 2021, ton sourire illumine notre cœur. Grâce au Jardin de l\'Espoir : Parange, nous avons enfin trouvé des frères et sœurs d\'épreuve pour parler de toi sans trembler. #ParangeCI',
    date: 'Hier',
    candlesCount: 34,
    userLitCandle: true
  },
  {
    id: 'flower-2',
    authorName: 'Clarisse (Yopougon)',
    isAnonymous: false,
    relationship: 'Pour ma petite Aïcha, née sans vie',
    flowerType: 'rose',
    flowerColor: '#EC4899',
    message: 'On m\'avait dit de faire comme si tu n\'avais jamais existé. Aujourd\'hui je t\'allume une bougie : tu as existé dans mon ventre et tu vivras à jamais dans mes pensées. Tu es mon ange.',
    date: 'Il y a 2 jours',
    candlesCount: 42,
    userLitCandle: false
  },
  {
    id: 'flower-3',
    authorName: 'Les Fondateurs',
    isAnonymous: false,
    relationship: 'En mémoire des 9 membres de notre famille (Tragédie de 2018)',
    flowerType: 'bougie',
    flowerColor: '#F59E0B',
    message: 'Nos deux enfants, notre maman, notre frère, neveux et nièces : 3 générations fauchées par le feu en une nuit. Votre souvenir a transformé notre désert en ce Jardin de l\'Espoir : Parange, pour qu\'aucun parent ivoirien ne souffre plus jamais seul.',
    date: 'Fondation 2018',
    candlesCount: 156,
    userLitCandle: true
  },
  {
    id: 'flower-4',
    authorName: 'Mireille (Bouaké)',
    isAnonymous: false,
    relationship: 'Pour notre fils Jean-Luc (9 ans)',
    flowerType: 'myosotis',
    flowerColor: '#3B82F6',
    message: 'Merci à la consultation mobile du Jardin de l\'Espoir : Parange passée à Bouaké. Pour 1 000 francs CFA symboliques, une psychologue m\'a écoutée 1h sans me juger. J\'ai enfin pu respirer.',
    date: 'Il y a 4 jours',
    candlesCount: 28,
    userLitCandle: false
  },
  {
    id: 'flower-5',
    authorName: 'Junior, 13 ans (Marcory)',
    isAnonymous: false,
    relationship: 'Pour ma grande sœur adorée Vanessa',
    flowerType: 'lavande',
    flowerColor: '#8B5CF6',
    message: 'C\'est dur de voir maman pleurer tous les soirs, mais à l\'atelier d\'art-thérapie j\'ai peint notre maison avec le soleil. Repose en paix grande sœur, je veillerai sur papa et maman.',
    date: 'Il y a 1 semaine',
    candlesCount: 51,
    userLitCandle: false
  },
  {
    id: 'flower-6',
    authorName: 'Un Parange solidaire',
    isAnonymous: true,
    relationship: 'Pour tous les bébés et enfants partis trop tôt en Côte d\'Ivoire',
    flowerType: 'marguerite',
    flowerColor: '#10B981',
    message: 'Une fleur et une bougie pour chaque maman et chaque papa dont les bras sont vides aujourd\'hui. Vous n\'êtes pas fous, vous êtes en deuil. Nous marchons ensemble vers la lumière.',
    date: 'Il y a 1 semaine',
    candlesCount: 89,
    userLitCandle: false
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'train-pro-sante',
    code: 'SANTE-01',
    title: 'Accueil & Annonce du Deuil Périnatal et Pédiatrique en Milieu Hospitalier',
    subtitle: 'Pour soignants de maternité, pédiatrie et urgences en Côte d\'Ivoire',
    targetProfessionals: 'Sages-femmes, infirmiers d\'État, pédiatres, médecins généralistes, assistantes sociales hospitalières',
    duration: '2 jours (14 heures)',
    format: 'En présentiel en CHU / Hôpitaux ou Campus Abidjan',
    objectives: [
      'Maîtriser les protocoles d\'annonce bienveillante et humaine lors de la perte d\'un nouveau-né ou d\'un enfant',
      'Déployer le "Kit de Deuil" en maternité (carte d\'écoute, conseils de premiers secours émotionnels)',
      'Accompagner les premiers rituels d\'adieu (présentation du bébé avec dignité, recueil des empreintes)',
      'Déconstruire les fausses croyances culturelles qui isolent les mamans en détresse'
    ],
    program: [
      'Jour 1 : Psychopathologie du deuil parental précoce et impact du choc traumatique',
      'Jour 1 Après-midi : Mises en situation pratiques et jeux de rôle sur l\'annonce',
      'Jour 2 : Gestion de la douleur des soignants et protocole du Kit de Deuil hospitalier',
      'Jour 2 Après-midi : Création d\'une filière de référence directe vers les GSP du Jardin de l\'Espoir : Parange'
    ],
    pricePerPerson: '45 000 FCFA / soignant (Prise en charge institutionnelle ou subventionnée)',
    nextDates: ['18 - 19 Octobre 2026 (Abidjan)', '15 - 16 Novembre 2026 (Bouaké)']
  },
  {
    id: 'train-relais-comm',
    code: 'RELAIS-02',
    title: 'Détection du Deuil Traumatique et Rôle des Relais Communautaires',
    subtitle: 'Mobiliser les leaders de quartier, religieux et associatifs',
    targetProfessionals: 'Responsables d\'associations de femmes, chefs de communauté, guides spirituels, agents communautaires',
    duration: '1 journée (7 heures)',
    format: 'En présentiel décentralisé dans les communes d\'Abidjan et villes partenaires',
    objectives: [
      'Déstigmatiser la souffrance psychologique : "Ce n\'est pas de la folie, c\'est du deuil"',
      'Repérer les signaux d\'isolement dangereux (dépression sévère, mutisme, idées sombres)',
      'Savoir orienter les familles vers la Ligne d\'Écoute Solidaire et les Consultations Mobiles',
      'Promouvoir une écoute fraternelle sans culpabilisation religieuse ou sociale'
    ],
    program: [
      'Matin : Le tabou du deuil en Côte d\'Ivoire et ses conséquences destructrices sur le couple et la santé',
      'Après-midi : Guide pratique du pair-aidant et outils d\'orientation d\'urgence'
    ],
    pricePerPerson: 'Gratuit pour les associations communautaires partenaires (financé par nos donateurs)',
    nextDates: ['Sessions mensuelles à Yopougon, Abobo, Treichville et Port-Bouët']
  },
  {
    id: 'train-parange-guide',
    code: 'PAIR-03',
    title: 'Programme « Parange à Guide » : Devenir Parent Pair-Aidant',
    subtitle: 'Transformer son épreuve personnelle en une force de résilience collective',
    targetProfessionals: 'Parents endeuillés ayant au moins 2 ans de recul et désireux de soutenir d\'autres Paranges',
    duration: '3 sessions de week-end (24 heures) + Supervision continue',
    format: 'En petit groupe fermé avec supervision par un psychologue clinicien',
    objectives: [
      'Comprendre la juste posture du pair-aidant : écouter sans projeter son propre drame',
      'Animer un Groupe de Soutien Psychologique (GSP) en binôme avec un psychologue',
      'Assurer des permanences d\'écoute bienveillantes sur la Ligne d\'Écoute Solidaire',
      'Préserver sa propre écologie émotionnelle et prévenir l\'usure de compassion'
    ],
    program: [
      'Session 1 : Résonance personnelle, éthique et cadre de l\'écoute active',
      'Session 2 : Dynamique des groupes de parole et gestion des émotions intenses',
      'Session 3 : Pratique simulée d\'animation et immersion sur la ligne d\'écoute'
    ],
    pricePerPerson: 'Entièrement pris en charge par l\'ONG Le Jardin de l\'Espoir : Parange',
    nextDates: ['Promotion Annuelle : Inscriptions ouvertes sur candidature']
  }
];

export const BUDGET_ITEMS: BudgetItem[] = [
  {
    label: 'Groupes de Soutien Psychologique (GSP)',
    category: 'Clinique',
    detail: 'Honoraires des psychologues cliniciens certifiés, coordination des groupes de parole mensuels à Abidjan et location des salles sécurisées.',
    amountFCFA: 7200000,
    percentage: '40%',
    annualAmountXOF: 7200000
  },
  {
    label: 'Consultations Mobiles & Outreach Intérieur',
    category: 'Proximité',
    detail: "Déplacements des équipes cliniques à travers toute la COTE D'IVOIRE pour des journées de consultation solidaire (500 - 1 000 FCFA symboliques).",
    amountFCFA: 3500000,
    percentage: '20%',
    annualAmountXOF: 3500000
  },
  {
    label: 'Kits de Deuil Hospitaliers & Guides du Parange',
    category: 'Maternités',
    detail: 'Impression et distribution de livrets et kits d\'urgence remis aux mamans et papas dans les maternités et pédiatries dès la survenue du décès.',
    amountFCFA: 2400000,
    percentage: '13%',
    annualAmountXOF: 2400000
  },
  {
    label: 'Ligne d\'Écoute Solidaire 7j/7 & Pairs-Aidants',
    category: 'Permanence',
    detail: 'Plateforme téléphonique sans attente, numéros d\'urgence et formation continue du Pôle "Parange à Guide".',
    amountFCFA: 1800000,
    percentage: '10%',
    annualAmountXOF: 1800000
  },
  {
    label: 'Campagnes « Briser le Tabou » & Cérémonies Mémorielles',
    category: 'Plaidoyer',
    detail: 'Capsules d\'information publique, organisation de la Marche des Lumières et ateliers d\'Art-Thérapie pour les fratries.',
    amountFCFA: 1500000,
    percentage: '9%',
    annualAmountXOF: 1500000
  },
  {
    label: 'Gestion Administrative, Audit & Transparence',
    category: 'Gouvernance',
    detail: 'Frais de fonctionnement légal, assurance, suivi comptable certifié et rapports financiers publics remis aux donateurs.',
    amountFCFA: 1580000,
    percentage: '8%',
    annualAmountXOF: 1580000
  }
];

export const ANNUAL_BUDGET_ITEMS = BUDGET_ITEMS;
