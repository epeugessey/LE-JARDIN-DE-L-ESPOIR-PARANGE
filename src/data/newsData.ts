import { NewsArticle, PlatformConfig, UploadedDocument, HomeDisplayConfig } from '../types';
import { DEFAULT_PAGE_BACKGROUNDS } from './defaultBackgrounds';

export const DEFAULT_HOME_DISPLAY_CONFIG: HomeDisplayConfig = {
  heroBadge: "Refuge National & Écoute Fraternelle • Côte d'Ivoire",
  heroTitle: "Briser le silence. Honorer chaque petit ange. Reconstruire l'espoir.",
  heroSubtitle: "Premier sanctuaire spécialisé en Côte d'Ivoire dédié à TOUTES les personnes endeuillées par la perte d'un enfant — qu'il soit mort-né ou décédé à un âge avancé — ainsi qu'au deuil périnatal et à la fratrie orpheline.",
  heroPrimaryBtnText: "Rejoindre un Groupe GSP",
  heroSecondaryBtnText: "Découvrir nos Piliers",
  emergencyAlertNotice: "Permanence téléphonique d'urgence active 7j/7 de 8h à 20h. Écoute gratuite, bienveillante et confidentielle.",
  presidentMessageTitle: "Le Mot de la Direction : Une main tendue sans jugement",
  presidentMessageContent: "Perdre son enfant est l'épreuve la plus déchirante qu'un parent puisse traverser. En Côte d'Ivoire, les maladresses et les tabous culturels enferment trop souvent cette douleur dans le silence. Le Jardin de l'Espoir : Parange est né pour vous dire : vous n'êtes plus seul(e). Votre bébé ou enfant existe pour toujours dans notre cœur.",
  presidentAuthor: "Mme Élodie Peugessey — Présidente Fondatrice & Référente Parange",
  sectionVisibility: {
    showHero: true,
    showPromoBanner: true,
    showHelplineBar: true,
    showRealtimeCounters: true,
    showPillars: true,
    showInclusivityBanner: true,
    showEmotionalJournalBanner: true,
    showUpcomingEvents: true,
    showImpactStats: true,
    showVirtualGardenTeaser: true,
    showRecentNews: true,
    showTestimonials: true,
    showCommunityBanner: true,
    showFaq: true,
    showNewsletter: true
  }
};

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  phonePrimary: '07 59 87 21 61',
  phoneSecondary: '05 75 23 93 12',
  email: 'contact@lejardindelespoir-ci.org',
  address: 'Abidjan, Côte d\'Ivoire',
  countryNotice: 'Côte d\'Ivoire',
  topBannerNotice: 'Ligne d\'Écoute Solidaire 7j/7 de 8h à 20h • Confidentialité & Compassion Fraternelle',
  stats: {
    familiesHelped: 480,
    kitsDistributed: 2150,
    gspSessions: 46,
    mobileClinicsCities: 5
  },
  facebookGroupUrl: 'https://www.facebook.com/groups/lejardindelespoirparange/',
  pageBackgrounds: DEFAULT_PAGE_BACKGROUNDS,
  homeDisplayConfig: DEFAULT_HOME_DISPLAY_CONFIG
};

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'ci-news-1',
    title: 'Santé maternelle et néonatale en Côte d\'Ivoire : L\'urgence d\'humaniser la prise en charge du deuil périnatal dans nos maternités',
    titleEn: 'Maternal and Neonatal Health in Côte d\'Ivoire: The Urgency of Humanizing Perinatal Bereavement Care in Our Maternity Wards',
    slug: 'humaniser-deuil-perinatal-maternites-ci',
    category: 'sante-maternelle-neonatale',
    categoryLabel: 'Santé Maternelle & Néonatale',
    categoryLabelEn: 'Maternal & Neonatal Health',
    summary: 'En Côte d\'Ivoire, des milliers de mères quittent chaque année les maternités sans leur bébé dans les bras. Face au silence institutionnel, Le Jardin de l\'Espoir : Parange plaide pour un protocole national d\'accompagnement du deuil dans les CHU et maternités de référence.',
    summaryEn: 'In Côte d\'Ivoire, thousands of mothers leave maternity wards each year without their baby in their arms. Faced with institutional silence, Le Jardin de l\'Espoir : Parange advocates for a national protocol for bereavement support in University Hospitals and reference maternity clinics.',
    content: `Chaque jour à Abidjan et dans les villes de l'intérieur, des mères franchissent les portes des maternités le cœur lourd d'un avenir anéanti. En Côte d'Ivoire, bien que des progrès majeurs aient été accomplis dans la réduction de la mortalité maternelle, le décès in utero et la mortalité néonatale précoce demeurent des tragédies fréquentes, souvent vécues dans une terrible solitude.

Dans de nombreuses structures sanitaires (CHU de Cocody, Treichville, Yopougon, maternités communautaires), le personnel soignant, confronté à une surcharge de travail et à un manque de formation psychologique spécifique, se trouve désarmé. La mère qui vient de perdre son nourrisson se retrouve parfois hospitalisée dans la même salle que des accouchées berçant leurs nouveau-nés en bonne santé. Les pleurs des bébés voisins résonnent alors comme une déchirure insoutenable.

« On m'a dit : "Madame, fais preuve de courage, tu es jeune, Dieu va te donner un autre". Ces mots, pensés pour consoler, ont scellé ma peine dans la honte. On n'a même pas prononcé le prénom de mon fils », témoigne Estelle K., mère parange rencontrée à Treichville.

Face à ce constat, Le Jardin de l'Espoir : Parange déploie deux actions d'urgence :
1. La mise en place de « Kits de Deuil Hospitaliers » contenant une boîte mémorielle, une carte d'empreintes et un livret d'accueil bienveillant remis dès l'annonce du décès.
2. Des sessions de sensibilisation auprès des sages-femmes et internes pour promouvoir des gestes simples : permettre aux parents de voir et tenir leur bébé s'ils le souhaitent, isoler la maman dans un espace calme, et la mettre en relation directe avec notre permanence d'écoute.`,
    contentEn: `Every day in Abidjan and cities across Côte d'Ivoire, mothers step out of maternity wards with heavy hearts and shattered futures. While major progress has been made in reducing maternal mortality, stillbirths and early neonatal deaths remain frequent tragedies, often suffered in devastating silence.

In many healthcare centers (University Teaching Hospitals of Cocody, Treichville, Yopougon, and community clinics), healthcare staff, burdened by high workloads and a lack of specific perinatal grief training, often feel powerless. Mothers who just lost their infant sometimes find themselves in the very same recovery rooms as mothers nursing healthy newborns. The cries of neighboring babies become an unbearable reminder of their loss.

"They told me: 'Madam, be strong, you are still young, God will give you another.' These words, spoken to comfort me, only locked my pain in shame. Nobody even pronounced the name of my baby boy," shares Estelle K., a bereaved mother in Treichville.

To address this crisis, Le Jardin de l'Espoir : Parange implements two priority actions:
1. Distributing Hospital Bereavement Kits containing a sacred keepsake box, footprint cards, and a gentle guidance booklet provided right at the onset of loss.
2. Training sessions for midwives, obstetricians, and interns promoting essential dignity practices: allowing parents to see and hold their baby if they wish, providing quiet private recovery rooms, and connecting them directly with our 7/7 Solitary Helpline.`,
    author: 'Dr. Karine N\'Guessan',
    authorRole: 'Psychologue Clinicienne & Référente Médicale ONG',
    authorRoleEn: 'Clinical Psychologist & Medical Lead',
    publishedAt: '8 Octobre 2026',
    readTime: '5 min de lecture',
    readTimeEn: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    tags: ['CHU Abidjan', 'Mortalité Néonatale', 'Kits Hospitaliers', 'Santé Publique CI'],
    sourceOrContext: 'Rapport d\'enquête terrain Le Jardin de l\'Espoir : Parange • Maternités du District d\'Abidjan',
    keyTakeaways: [
      'Nécessité de chambres calmes isolées des naissances joyeuses dans les maternités ivoiriennes.',
      'Remplacement des formules invalidantes ("tu en auras d\'autres") par une écoute active respectueuse du statut de parent.',
      'Partenariat d\'orientation systématique vers la Ligne d\'Écoute Solidaire (+225 07 59 87 21 61).'
    ],
    keyTakeawaysEn: [
      'Urgent need for quiet private rooms separated from joyous births across Ivorian maternity facilities.',
      'Replacing hurtful cliches ("you will have more") with attentive, respectful listening recognizing lasting parenthood.',
      'Systematic referral partnerships to the Solitary Helpline (+225 07 59 87 21 61).'
    ],
    isHighlighted: true
  },
  {
    id: 'ci-news-2',
    title: 'Faits de société en Côte d\'Ivoire : Quand le tabou culturel et la culpabilisation étouffent la détresse des mères endeuillées',
    titleEn: 'Society & Culture in Côte d\'Ivoire: When Cultural Taboos and Blame Stifle the Pain of Grieving Mothers',
    slug: 'tabou-culturel-culpabilisation-meres-paranges',
    category: 'faits-de-societe-traditions',
    categoryLabel: 'Faits de Société & Traditions',
    categoryLabelEn: 'Society Facts & Traditions',
    summary: 'Dans plusieurs traditions locales ivoiriennes, la mort précoce d\'un nourrisson ou d\'un enfant est encore perçue comme un mauvais présage ou une punition spirituelle, privant la famille de funérailles et de parole. Décryptage d\'un enfermement que l\'ONG combat.',
    summaryEn: 'In several Ivorian local traditions, the early loss of an infant or child is still perceived as an ill omen or spiritual punishment, depriving families of funerals and speech. An insight into an isolation that the NGO is fighting against.',
    content: `En Côte d'Ivoire, les rituels funéraires consacrés aux anciens et aux chefs sont grandioses et collectifs. Mais lorsqu'il s'agit d'un nouveau-né ou d'un jeune enfant parti avant ses aînés, la coutume bascule souvent dans un mutisme absolu. 

Dans certaines croyances traditionnelles, le décès d'un enfant en bas âge est entouré de suspicions de sorcellerie, de dettes d'ancêtres ou de « malédiction ». Pire encore, le soupçon est immédiatement reporté sur la mère : qu'a-t-elle mangé ? A-t-elle commis une faute ? Est-elle une « mangeuse d'âmes » ? Les rituels d'adieu sont alors interdits, la tombe n'a pas de nom, et il est formellement interdit à la mère de pleurer en public pour « ne pas attirer le malheur sur les prochaines grossesses ».

Cet interdit du deuil plonge les mères dans un effondrement silencieux, propice aux dépressions post-traumatiques majeures, aux ruptures conjugales et à l'isolement social.

« Notre mission n'est pas de juger les coutumes de nos ancêtres, mais de les éclairer à la lumière de la dignité humaine », explique M. Konan, responsable des relais communautaires du Jardin de l'Espoir : Parange. « Un enfant a existé, il a été aimé, il a respiré. Priver ses parents de l'expression de leur douleur est une violence psychique intolérable. »

À travers des cercles de dialogue villageois et communaux en COTE D'IVOIRE, notre équipe réunit chefs de communauté, leaders religieux (pasteurs, imams, prêtres) et soignants pour expliquer que la perte d'un enfant est une épreuve médicale et humaine universelle, et non une faute spirituelle.`,
    contentEn: `In Côte d'Ivoire, funeral rituals dedicated to elders and tribal leaders are grand and deeply communal. Yet when an infant or young child departs before their elders, customs often collapse into absolute silence.

In certain traditional beliefs, early childhood loss has been surrounded by suspicions of ill omens, ancestral debt, or curses. Worse, scrutiny often turns unfairly upon the mother: What did she eat? Did she make a mistake? Farewell rites are frequently withheld, graves remain unmarked, and mothers are often forbidden from weeping publicly to avoid "bringing misfortune onto future pregnancies."

This taboo plunges mothers into silent emotional collapse, fostering severe post-traumatic depression, marital breakdowns, and devastating isolation.

"Our mission is not to judge the heritage of our ancestors, but to illuminate it with human dignity," explains Mr. Konan, community coordinator at Le Jardin de l'Espoir : Parange. "A child existed, was loved, breathed life. Depriving parents of mourning their child is an unbearable psychological injury."

Through community discussion circles across Côte d'Ivoire, our team unites community elders, religious leaders (pastors, imams, priests), and healthcare providers to affirm that child loss is a medical and universal human tragedy, never a spiritual failure.`,
    author: 'Serge Bamba',
    authorRole: 'Sociologue & Médiateur Communautaire',
    authorRoleEn: 'Sociologist & Community Mediator',
    publishedAt: '28 Septembre 2026',
    readTime: '6 min de lecture',
    readTimeEn: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Traditions Ivoiriennes', 'Déstigmatisation', 'Santé Mentale', 'Plaidoyer Communautaire'],
    sourceOrContext: 'Étude d\'impact sociologique • Pôle Dialogue Communautaire Le Jardin de l\'Espoir : Parange',
    keyTakeaways: [
      'La mère ne doit jamais être tenue pour coupable ou désignée comme responsable d\'une perte d\'enfant.',
      'Le deuil doit pouvoir s\'extérioriser sans crainte de représailles familiales ou mystiques.',
      'Sensibilisation active des chefs de quartier et guides religieux pour légitimer les hommages.'
    ],
    keyTakeawaysEn: [
      'Mothers must never be held guilty or blamed for the tragic loss of an infant.',
      'Bereavement must be expressed openly without fear of familial or mystical stigma.',
      'Active community dialogue with traditional chiefs and faith leaders to legitimize memorials.'
    ],
    isHighlighted: false
  },
  {
    id: 'ci-news-3',
    title: 'Santé mentale post-partum et deuil périnatal : L\'angle mort des politiques de santé en Côte d\'Ivoire',
    titleEn: 'Postpartum Mental Health and Perinatal Bereavement: The Blind Spot of Healthcare Policies in Côte d\'Ivoire',
    slug: 'sante-mentale-postpartum-et-deuil-ci',
    category: 'sante-mentale-perinatale',
    categoryLabel: 'Santé Mentale Périnatale',
    categoryLabelEn: 'Perinatal Mental Health',
    summary: 'Moins de 2% des femmes ivoiriennes éprouvées par une perte périnatale ont accès à un psychologue. Le Jardin de l\'Espoir : Parange mobilise ses professionnels pour offrir des thérapies gratuites et des Groupes de Soutien Psychologique (GSP).',
    summaryEn: 'Less than 2% of Ivorian women enduring perinatal loss have access to psychological care. Le Jardin de l\'Espoir : Parange mobilizes its clinical professionals to provide free therapies and Psychological Support Groups (GSP).',
    content: `Si le bien-être physique des mères fait l'objet de campagnes sanitaires régulières, la santé mentale périnatale reste un parent pauvre en Côte d'Ivoire. Pourtant, le choc de la perte d'un enfant – qu'il s'agisse d'une interruption médicale de grossesse, d'un mort-né ou du décès d'un tout-petit – entraîne des séquelles psychologiques sévères chez plus de 60% des parents concernés.

Les symptômes observés par nos psychologues lors des consultations d'accueil sont alarmants :
- Troubles du sommeil chroniques et cauchemars récurrents revivant la scène hospitalière.
- Sentiment d'anesthésie émotionnelle et de vide existentiel.
- Crise du couple : l'homme s'enfermant dans le devoir de "rester fort" et de travailler, la femme se sentant abandonnée dans ses larmes.
- Évitement des lieux publics et phobie des bébés d'autrui.

« En Côte d'Ivoire, consulter un psychologue privé coûte entre 15 000 et 30 000 FCFA par consultation. Pour un ménage modeste à Koumassi, Yopougon ou Abobo, c'est tout simplement impensable », rappelle la direction du Jardin de l'Espoir : Parange.

C'est pourquoi notre ONG a institué la gratuité totale des séances des Groupes de Soutien Psychologique (GSP) et une tarification solidaire symbolique (500 FCFA) pour les consultations mobiles dans les quartiers populaires et à l'intérieur du pays, financée par la générosité des donateurs et parrains.`,
    contentEn: `While physical post-natal care receives regular public health attention, perinatal mental health remains largely neglected in Côte d'Ivoire. Yet the trauma of infant loss—whether through miscarriage, medical termination, stillbirth, or neonatal passing—causes severe psychological sequelae in over 60% of affected parents.

Symptoms observed by our psychologists during initial evaluations are serious:
- Chronic sleep disturbances and recurring flashbacks to hospital delivery rooms.
- Emotional numbness, deep existential emptiness, and pervasive guilt.
- Marital strains: fathers retreating into work to "remain tough", leaving mothers feeling isolated in grief.
- Social avoidance and intense dread of encountering infants and baby celebrations.

"In Côte d'Ivoire, seeing a private psychologist costs between 15,000 and 30,000 FCFA per session. For a modest family in Koumassi, Yopougon, or Abobo, this is simply out of reach," notes the NGO directorship.

This is why Le Jardin de l'Espoir : Parange guarantees 100% free access to Support Groups (GSP) and a symbolic solidarity contribution (500 FCFA) for regional mobile clinics, supported by compassionate donors.`,
    author: 'Dr. Patricia Kouamé',
    authorRole: 'Pédopsychiatre & Membre du Conseil Scientifique',
    authorRoleEn: 'Child Psychiatrist & Scientific Council Member',
    publishedAt: '21 Septembre 2026',
    readTime: '4 min de lecture',
    readTimeEn: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Santé Mentale', 'Thérapie Solidaire', 'GSP', 'Accompagnement Psychologique'],
    sourceOrContext: 'Revue Clinique Le Jardin de l\'Espoir : Parange • Vol. 3, 2026',
    keyTakeaways: [
      'Le deuil n\'est pas une maladie mentale, mais sans écoute, il peut dégénérer en dépression sévère.',
      'Les pères ivoiriens souffrent souvent en silence et nécessitent une prise en charge adaptée.',
      'Les groupes de pairs permettent une identification salvatrice : "Ici, on ne me juge pas".'
    ],
    keyTakeawaysEn: [
      'Grief is not a mental disease, but without compassionate listening, it can degenerate into severe clinical depression.',
      'Ivorian fathers often suffer in complete silence and require specialized, adapted care spaces.',
      'Peer groups provide life-saving identification: "Here, no one judges me."'
    ],
    isHighlighted: false
  },
  {
    id: 'ci-news-4',
    title: 'Consultations Mobiles en Région : Succès des étapes à Bouaké, San-Pédro et Yamoussoukro avec plus de 210 familles accueillies',
    titleEn: 'Regional Mobile Clinics: Successful Stops in Bouaké, San-Pédro and Yamoussoukro Welcoming over 210 Families',
    slug: 'succes-consultations-mobiles-bouake-sanpedro',
    category: 'actions-ong',
    categoryLabel: 'Actions Terrain de l\'ONG',
    categoryLabelEn: 'NGO Field Actions',
    summary: 'La caravane solidaire du Jardin de l\'Espoir : Parange a sillonné les localités du Gbêkê, du Bas-Sassandra et du Bélier pour briser l\'isolement des parents des régions de Côte d\'Ivoire.',
    summaryEn: 'The solidarity caravan of Le Jardin de l\'Espoir : Parange traveled through the Gbêkê, Bas-Sassandra and Bélier regions to break the isolation of parents across Côte d\'Ivoire.',
    content: `Parce que la souffrance ne s'arrête pas aux frontières d'Abidjan, l'équipe mobile du Jardin de l'Espoir : Parange a mené une mission clinique et humaine intensive de trois semaines à Bouaké, San-Pédro et Yamoussoukro.

Accueillie dans des locaux gracieusement mis à disposition par des centres sociaux partenaires et des structures hospitalières locales, notre caravane d'écoute a permis :
- L'accueil de plus de 210 parents (mères et pères) et 65 frères et sœurs endeuillés en entretiens individuels et familiaux.
- La constitution de trois noyaux permanents de Paranges Relais formés au programme « Parange à Guide », assurant ainsi une continuité de l'entraide locale.
- La distribution de plus de 600 livrets d'accompagnement et fiches conseils traduits et adaptés au contexte ivoirien.

« Voir des pères de famille fondre en larmes dans nos bras en disant : "C'est la première fois depuis deux ans que je peux parler de ma fille sans qu'on me dise de me taire", c'est la preuve que notre présence en région est vitale », partage Aminata Soro, coordinatrice des missions mobiles.

Les prochaines étapes programmées pour novembre et décembre couvriront Korhogo, Daloa et Man.`,
    contentEn: `Because sorrow knows no geographical boundaries, the mobile caravan of Le Jardin de l'Espoir : Parange conducted an intensive three-week clinical outreach in Bouaké, San-Pédro and Yamoussoukro.

Hosted generously by community partner centers and regional medical facilities, our team achieved:
- Welcoming over 210 parents (mothers and fathers) and 65 grieving siblings in private individual and family consultations.
- Establishing three local permanent peer-support networks trained under our "Parange to Guide" mentoring curriculum.
- Distributing over 600 culturally-adapted guidance manuals and memory materials.

"Witnessing fathers break down in tears and whisper: 'This is the first time in two years someone lets me speak about my daughter without telling me to be quiet,' proves that regional presence is indispensable," says Aminata Soro, field outreach director.

Upcoming missions for November and December are slated for Korhogo, Daloa, and Man.`,
    author: 'Aminata Soro',
    authorRole: 'Coordinatrice des Missions Mobiles Régions',
    authorRoleEn: 'Regional Outreach Director',
    publishedAt: '12 Septembre 2026',
    readTime: '4 min de lecture',
    readTimeEn: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Bouaké', 'San-Pédro', 'Yamoussoukro', 'Caravane Solidaire', 'Côte d\'Ivoire'],
    sourceOrContext: 'Bulletin de bord des Missions de Proximité CI',
    keyTakeaways: [
      'Immense besoin d\'espaces d\'écoute sécurisés en dehors de la capitale économique.',
      'Implication croissante des papas dans les cercles de parole.',
      'Création de réseaux d\'entraide autonomes par ville.'
    ],
    keyTakeawaysEn: [
      'Immense need for safe listening spaces outside the economic capital of Abidjan.',
      'Growing involvement of fathers in discussion circles.',
      'Creation of autonomous local mutual-aid networks in each city.'
    ],
    isHighlighted: false
  },
  {
    id: 'ci-news-5',
    title: 'Plaidoyer National : Vers la création d\'une Journée Ivoirienne du Souvenir des Paranges et des Tout-Petits le 15 Octobre',
    titleEn: 'National Advocacy: Towards the Creation of an Ivorian Remembrance Day for Paranges and Infants on October 15th',
    slug: 'plaidoyer-journee-ivoirienne-paranges-octobre',
    category: 'plaidoyer',
    categoryLabel: 'Plaidoyer & Droits des Familles',
    categoryLabelEn: 'Advocacy & Family Rights',
    summary: 'Le Jardin de l\'Espoir : Parange dépose un mémorandum auprès des ministères de la Santé et de la Famille pour reconnaître officiellement le 15 octobre comme journée commémorative nationale en Côte d\'Ivoire.',
    summaryEn: 'Le Jardin de l\'Espoir : Parange submits an official memorandum to the Ministries of Health and Family to officially recognize October 15th as a national commemorative day in Côte d\'Ivoire.',
    content: `Alors que la Journée mondiale du deuil périnatal est célébrée chaque 15 octobre à travers le monde, la Côte d'Ivoire s'apprête à franchir une étape historique. Le Jardin de l'Espoir : Parange, aux côtés de collectifs de médecins et de familles, a formalisé un plaidoyer officiel auprès du Ministère de la Santé, de l'Hygiène Publique et de la Couverture Maladie Universelle.

Ce mémorandum s'articule autour de 3 revendications phares :
1. **L'octroi d'un congé de deuil digne :** Permettre aux mères salariées et aux fonctionnaires de bénéficier d'un temps de repos médical d'au moins 30 jours après une fausse couche tardive ou un décès néonatal, sans perte de rémunération.
2. **La reconnaissance de l'identité du fœtus :** Faciliter la délivrance d'un certificat d'accouchement pour permettre aux parents de donner un prénom légal à leur enfant né sans vie, afin de figurer au registre familial.
3. **L'institution de la Marche des Lumières (#1Fleur1Ange) :** Autoriser un rassemblement mémoriel annuel à Abidjan au cours duquel des milliers de bougies et fleurs sont déposées en communion solidaire.

« Nommer son enfant et lui accorder une place dans la généalogie ivoirienne n'est pas un caprice : c'est le fondement même de la reconstruction psychologique de toute une lignée », rappelle la présidence de l'ONG.`,
    contentEn: `While the International Wave of Light and Pregnancy & Infant Loss Remembrance Day is celebrated globally each October 15th, Côte d'Ivoire is poised to take a landmark step. Le Jardin de l'Espoir : Parange, in partnership with healthcare associations and affected families, has submitted a formal legislative memorandum to the Ministry of Health and Family Affairs.

The memorandum focuses on three key pillars:
1. **Dignified Bereavement Leave:** Granting employed mothers and fathers at least 30 days of paid medical bereavement leave following late miscarriages, stillbirths, or neonatal loss.
2. **Identity Recognition for Stillborns:** Streamlining birth/death certificates allowing parents to legally record the name of their departed infant in the official family civil booklet.
3. **Annual Wave of Light Gathering (#1Flower1Angel):** Establishing a recognized national memorial ceremony in Abidjan where families gather to illuminate candles and lay flowers in serene tribute.

"Giving a child their rightful name and place in our genealogy is not a mere detail: it is the essential bedrock of psychological healing for generations to come," states the NGO presidency.`,
    author: 'Direction du Plaidoyer',
    authorRole: 'Le Jardin de l\'Espoir : Parange CI',
    authorRoleEn: 'Advocacy Directorate',
    publishedAt: '2 Septembre 2026',
    readTime: '5 min de lecture',
    readTimeEn: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    tags: ['Plaidoyer', 'Ministère de la Santé CI', '15 Octobre', 'Droits des Familles'],
    sourceOrContext: 'Mémorandum officiel déposé à Abidjan',
    keyTakeaways: [
      'Plaidoyer pour un congé de deuil périnatal d\'au moins 30 jours pour la mère et le père.',
      'Possibilité administrative d\'inscrire le prénom de l\'enfant né sans vie sur le livret de famille.',
      'Organisation d\'une grande veillée commémorative annuelle nationale.'
    ],
    keyTakeawaysEn: [
      'Advocacy for a paid perinatal bereavement leave of at least 30 days for parents.',
      'Administrative registration of the name of a stillborn child in the family civil booklet.',
      'Nationwide annual commemorative vigil and flower dedication ceremony.'
    ],
    isHighlighted: false
  }
];

export const INITIAL_UPLOADED_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-1',
    name: 'Guide_Essentiel_du_Parange_CI_2026.pdf',
    size: '2.4 Mo',
    fileType: 'pdf',
    category: 'Guide',
    uploadedAt: '05/10/2026',
    url: '#',
    description: 'Livret complet d\'accompagnement des parents endeuillés en Côte d\'Ivoire (48 pages, conseils cliniques et légaux).'
  },
  {
    id: 'doc-2',
    name: 'Fiche_Sages_Femmes_Kit_Deuil_Hospitalier.pdf',
    size: '850 Ko',
    fileType: 'pdf',
    category: 'Brochure',
    uploadedAt: '01/10/2026',
    url: '#',
    description: 'Protocole d\'accueil et phrases bienveillantes pour le personnel des maternités et pédiatries de référence.'
  },
  {
    id: 'doc-3',
    name: 'Rapport_Financier_et_Gouvernance_2025_2026.pdf',
    size: '1.8 Mo',
    fileType: 'pdf',
    category: 'Rapport',
    uploadedAt: '25/09/2026',
    url: '#',
    description: 'Bilan comptable certifié et transparence de l\'utilisation des dons Mobile Money et institutionnels.'
  },
  {
    id: 'doc-4',
    name: 'Photo_Mission_Mobile_Bouake_Yamoussoukro.jpg',
    size: '3.1 Mo',
    fileType: 'image',
    category: 'Photo',
    uploadedAt: '20/09/2026',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    description: 'Photo de terrain lors de l\'atelier d\'écoute communautaire à Bouaké et Yamoussoukro.'
  }
];
