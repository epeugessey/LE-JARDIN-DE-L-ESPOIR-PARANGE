import { Language } from '../types';

export interface Translations {
  // Top Banner
  topBannerHelpline: string;
  topBannerHours: string;
  topBannerSanctuary: string;
  requestCallback: string;
  adminPortal: string;

  // Navigation
  navHome: string;
  navNews: string;
  navBlog: string;
  navTestimonies: string;
  navForum: string;
  navServices: string;
  navResources: string;
  navVirtualGarden: string;
  navTraining: string;
  navAboutUs: string;
  navDonate: string;
  needHelp: string;
  searchPlaceholder: string;

  // Floating Immediate Help Button
  immediateHelpBtn: string;
  immediateHelpTooltip: string;
  immediateHelpBadge: string;
  immediateHelpModalTitle: string;
  immediateHelpModalSubtitle: string;
  callDirectly: string;
  orUseForm: string;

  // Consultation Modal
  modalTitle: string;
  modalSubtitle: string;
  modalConfidentiality: string;
  fullNameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  cityLabel: string;
  roleLabel: string;
  roleParange: string;
  roleSibling: string;
  roleRelative: string;
  roleProfessional: string;
  situationLabel: string;
  situationPerinatal: string;
  situationChildLoss: string;
  situationSiblingLoss: string;
  situationOther: string;
  contactMethodLabel: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactInPerson: string;
  urgentListeningLabel: string;
  urgentListeningDesc: string;
  priorityAlertActive: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitRequestBtn: string;
  submittingText: string;
  successTitle: string;
  successDescStandard: string;
  successDescPriority: string;
  closeBtn: string;

  // Blog
  blogHeaderBadge: string;
  blogTitle: string;
  blogSubtitle: string;
  blogFilterAll: string;
  blogFilterJourney: string;
  blogFilterPsychology: string;
  blogFilterSociety: string;
  blogFilterFathers: string;
  blogFilterSiblings: string;
  readArticle: string;
  readingTime: string;
  publishedOn: string;
  writtenBy: string;
  backToBlog: string;
  commentsHeading: string;
  noCommentsYet: string;
  leaveAComment: string;
  commentAuthorName: string;
  commentRoleLabel: string;
  commentContentPlaceholder: string;
  submitCommentBtn: string;
  commentModerationNotice: string;
  commentSubmittedSuccess: string;
  adminReplyLabel: string;

  // Home page keys
  homeHeroBadge: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeJoinGspBtn: string;
  homeLightCandleBtn: string;
  homeHelplineLabel: string;
  homePillarsBadge: string;
  homePillarsTitle: string;
  homePillarsSubtitle: string;
  homeStatFamilies: string;
  homeStatKits: string;
  homeStatGsp: string;
  homeStatCities: string;
  homeFaqBadge: string;
  homeFaqTitle: string;
  homeFaqSubtitle: string;
  homeCommunityBannerTitle: string;
  homeCommunityBannerDesc: string;
  homeCommunityBannerBtn: string;

  // About page keys
  aboutTitle: string;
  aboutSubtitle: string;
  aboutOriginTitle: string;
  aboutOriginP1: string;
  aboutOriginP2: string;
  aboutValuesTitle: string;
  aboutTeamTitle: string;

  // Services page keys
  servicesTitle: string;
  servicesSubtitle: string;

  // Resources page keys
  resourcesTitle: string;
  resourcesSubtitle: string;

  // Training page keys
  trainingTitle: string;
  trainingSubtitle: string;

  // Donation page keys
  donationTitle: string;
  donationSubtitle: string;

  // Forum page keys
  forumTitle: string;
  forumSubtitle: string;

  // Virtual Garden page keys
  gardenTitle: string;
  gardenSubtitle: string;

  // Footer keys
  footerTagline: string;
  footerHelplineTitle: string;
  footerCopyright: string;

  // Common CTAs
  learnMore: string;
  contactUs: string;
  donateNow: string;
  ourServices: string;
  virtualGardenCta: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    // Top Banner
    topBannerHelpline: "Ligne d'Écoute Solidaire Côte d'Ivoire :",
    topBannerHours: "7j/7 de 8h à 20h • Anonyme & Bienveillant",
    topBannerSanctuary: "Premier refuge pour Paranges en Côte d'Ivoire",
    requestCallback: "Demander un rappel",
    adminPortal: "Espace Admin",

    // Navigation
    navHome: "Accueil",
    navNews: "Actualités CI",
    navBlog: "Blog & Chemins",
    navTestimonies: "Témoignages",
    navForum: "Forum Paranges",
    navServices: "Services & Accompagnement",
    navResources: "Boîte à Outils",
    navVirtualGarden: "Jardin Virtuel",
    navTraining: "Formations Pro",
    navAboutUs: "Qui sommes-nous ?",
    navDonate: "Faire un don",
    needHelp: "Besoin d'aide ?",
    searchPlaceholder: "Rechercher un article, document, service, groupe...",

    // Floating Immediate Help Button
    immediateHelpBtn: "Besoin d'aide immédiate ?",
    immediateHelpTooltip: "Prise en charge d'urgence 7j/7 pour parents en détresse",
    immediateHelpBadge: "Urgence Paranges 24/7",
    immediateHelpModalTitle: "Assistance Immédiate & Écoute Prioritaire",
    immediateHelpModalSubtitle: "Vous traversez une douleur insoutenable ou un choc récent ? Notre cellule de veille et nos psychologues sont là pour vous porter.",
    callDirectly: "Appeler directement la permanence :",
    orUseForm: "Ou demandez à être rappelé(e) en urgence :",

    // Consultation Modal
    modalTitle: "Demande d'écoute & Groupe de Soutien (GSP)",
    modalSubtitle: "Que vous soyez père, mère, frère, sœur ou soignant, notre équipe vous accueille avec discrétion et bienveillance.",
    modalConfidentiality: "Accompagnement confidentiel & solidaire en Côte d'Ivoire",
    fullNameLabel: "Nom complet ou Pseudonyme",
    phoneLabel: "Numéro de téléphone / WhatsApp (Côte d'Ivoire ou Diaspora)",
    emailLabel: "Adresse courriel (facultatif)",
    cityLabel: "Ville de résidence",
    roleLabel: "Vous êtes :",
    roleParange: "Parent endeuillé (Parange)",
    roleSibling: "Frère / Sœur (Fratrie)",
    roleRelative: "Proche / Ami de la famille",
    roleProfessional: "Soignant / Relais médical",
    situationLabel: "Situation traversée :",
    situationPerinatal: "Deuil périnatal (fausse couche, IMG, MFIU, néonatal)",
    situationChildLoss: "Décès d'un enfant ou jeune adulte",
    situationSiblingLoss: "Décès d'un frère ou d'une sœur",
    situationOther: "Autre accompagnement lié au deuil",
    contactMethodLabel: "Mode de contact préféré :",
    contactPhone: "Appel téléphonique",
    contactWhatsapp: "Message WhatsApp",
    contactInPerson: "Rendez-vous présentiel (Abidjan)",
    urgentListeningLabel: "🚨 Écoute d'urgence souhaitée",
    urgentListeningDesc: "Cochez cette case si vous vous sentez en détresse émotionnelle aiguë ou avez besoin d'une réponse aujourd'hui.",
    priorityAlertActive: "Demande prioritaire activée • Notre écoutant vous appellera en priorité absolue.",
    messageLabel: "Votre message ou vos questions (en toute liberté)",
    messagePlaceholder: "Racontez-nous brièvement ce que vous vivez, ce dont vous avez besoin...",
    submitRequestBtn: "Envoyer ma demande confidentielle",
    submittingText: "Transmission en cours...",
    successTitle: "Votre demande a bien été reçue",
    successDescStandard: "Un psychologue clinicien ou un pair-aidant formé du Jardin de l'Espoir : Parange vous contactera avec discrétion et bienveillance sous 24 à 48 heures ouvrées.",
    successDescPriority: "Votre demande prioritaire a été transmise en alerte à nos coordinateurs d'astreinte. Nous vous recontacterons dans les toutes prochaines heures.",
    closeBtn: "Fermer",

    // Blog
    blogHeaderBadge: "Blog de Réflexion & Cheminement des Paranges",
    blogTitle: "Mots d'Apaisement, Pensées & Résilience",
    blogSubtitle: "Articles de fond, regards cliniques, repères culturels ivoiriens et guides pour briser le tabou du deuil périnatal et honorer la mémoire de nos enfants.",
    blogFilterAll: "Tous les articles",
    blogFilterJourney: "Cheminement des Paranges",
    blogFilterPsychology: "Psychologie & Traumatisme",
    blogFilterSociety: "Société & Tabous Africains",
    blogFilterFathers: "Papas Paranges",
    blogFilterSiblings: "Fratrie & Après",
    readArticle: "Lire l'article de fond",
    readingTime: "min de lecture",
    publishedOn: "Publié le",
    writtenBy: "Par",
    backToBlog: "← Retour à tous les articles du blog",
    commentsHeading: "Espace Témoignages & Échanges Bienveillants",
    noCommentsYet: "Aucun commentaire pour le moment. Soyez le premier à déposer des mots d'espérance ou votre témoignage.",
    leaveAComment: "Partager un témoignage ou un commentaire",
    commentAuthorName: "Votre prénom ou pseudonyme",
    commentRoleLabel: "Votre profil :",
    commentContentPlaceholder: "Déposez vos ressentis, une pensée fraternelle ou une question avec bienveillance...",
    submitCommentBtn: "Envoyer mon commentaire",
    commentModerationNotice: "Afin de protéger la sensibilité de tous les paranges, chaque commentaire est modéré avec douceur par l'équipe avant publication.",
    commentSubmittedSuccess: "Merci du fond du cœur. Votre commentaire a été enregistré et sera publié après validation par notre équipe de modération.",
    adminReplyLabel: "Réponse de l'équipe du Jardin de l'Espoir : Parange :",

    // Home
    homeHeroBadge: "Premier refuge pour les Paranges en Côte d'Ivoire",
    homeHeroTitle: "Nul parent ne devrait affronter seul le désert de la perte d'un enfant.",
    homeHeroSubtitle: "Le Jardin de l'Espoir : Parange accueille et accompagne TOUTES les personnes ayant perdu au moins 1 enfant, quel que soit l'âge de l'enfant disparu (qu'il soit mort-né ou décédé à un âge avancé). Né d'une tragédie familiale en 2018, il brise le silence et le tabou du deuil en Côte d'Ivoire en offrant un accompagnement psychologique professionnel, fraternel et bienveillant.",
    homeJoinGspBtn: "Rejoindre un Groupe de Soutien (GSP)",
    homeLightCandleBtn: "Allumer 1 bougie pour un Ange",
    homeHelplineLabel: "Ligne d'écoute solidaire Côte d'Ivoire :",
    homePillarsBadge: "Nos 4 Piliers Fondateurs",
    homePillarsTitle: "Une approche holistique et bienveillante pour traverser l'épreuve",
    homePillarsSubtitle: "Parce que la perte d'un enfant — qu'elle survienne in utero, dans la petite enfance ou à l'âge adulte — ébranle l'âme, le corps et le couple, notre action s'articule autour de quatre engagements inconditionnels.",
    homeStatFamilies: "Familles accueillies et soutenues",
    homeStatKits: "Kits de mémoire et boîtes à souvenirs offerts",
    homeStatGsp: "Séances de Groupes de Soutien animées",
    homeStatCities: "Villes touchées en Côte d'Ivoire",
    homeFaqBadge: "Questions Fréquentes & Repères",
    homeFaqTitle: "Mieux comprendre et aborder le deuil périnatal",
    homeFaqSubtitle: "Des réponses transparentes et chaleureuses formulées par nos psychologues et pairs-aidants pour vous orienter sans jugement.",
    homeCommunityBannerTitle: "Un sanctuaire vivant d'amour et de souvenir",
    homeCommunityBannerDesc: "Votre histoire compte. Nos espaces de parole, physiques à Abidjan et virtuels à travers toute la Côte d'Ivoire, sont là pour accueillir vos larmes et vos souvenirs sans tabou.",
    homeCommunityBannerBtn: "Prendre rendez-vous avec un écoutant",

    // About
    aboutTitle: "Notre Histoire & Nos Engagements",
    aboutSubtitle: "Fondée suite au drame de 2018, notre ONG transforme la douleur indicible en une source d'espérance, de dignité et de réconfort fraternel pour chaque famille en Côte d'Ivoire.",
    aboutOriginTitle: "Le Drame de 2018 : Une étincelle née dans les cendres",
    aboutOriginP1: "Le Jardin de l'Espoir : Parange a vu le jour après une terrible épreuve personnelle vécue par nos fondateurs en Côte d'Ivoire. Face à la perte soudaine et au silence écrasant de l'entourage, l'incompréhension des maternités et les phrases maladroites, la nécessité absolue d'un refuge est devenue évidente.",
    aboutOriginP2: "En Côte d'Ivoire et dans toute l'Afrique de l'Ouest, la mort périnatale demeure trop souvent occultée par la honte, la superstition ou le tabou. Nous avons choisi d'ériger ce sanctuaire pour donner un nom, une voix et un souvenir digne à chaque enfant parti trop tôt.",
    aboutValuesTitle: "Nos Valeurs Cardinales",
    aboutTeamTitle: "L'Équipe d'Écoute & Professionnels",

    // Services
    servicesTitle: "Accompagnement & Piliers de Soutien",
    servicesSubtitle: "Découvrez notre palette complète de soins psychologiques, groupes de parole, kits de mémoire et cliniques mobiles déployés à travers la Côte d'Ivoire.",

    // Resources
    resourcesTitle: "Boîte à Outils & Ressources Pratiques",
    resourcesSubtitle: "Guides pratiques à télécharger, fiches conseils, podcasts psychoéducatifs et recommandations littéraires pour cheminer pas à pas.",

    // Training
    trainingTitle: "Formations Professionnelles & Soignants",
    trainingSubtitle: "Programmes agréés destinés aux sages-femmes, infirmiers, gynécologues, psychologues et soignants relais pour humaniser l'accueil du deuil périnatal dans les maternités.",

    // Donation
    donationTitle: "Soutenir Notre Mission & Faire un Don",
    donationSubtitle: "Chaque don permet d'offrir gratuitement une boîte à souvenirs, de financer une séance de soutien psychologique ou de former une sage-femme en maternité publique.",

    // Forum
    forumTitle: "Forum d'Échange & d'Entraide des Paranges",
    forumSubtitle: "Un espace bienveillant et modéré pour déposer vos doutes, trouver du soutien auprès de parents qui comprennent votre douleur, et échanger par thématique.",

    // Virtual Garden
    gardenTitle: "Le Jardin Virtuel du Souvenir",
    gardenSubtitle: "Un sanctuaire paisible et éternel pour allumer une bougie, planter une fleur symbolique et déposer un message d'amour à la mémoire de votre bébé.",

    // Footer
    footerTagline: "Premier refuge pour les Paranges • Association humanitaire & médicale en Côte d'Ivoire.",
    footerHelplineTitle: "Permanence 24/7 en Côte d'Ivoire :",
    footerCopyright: "© 2018 - 2026 Le Jardin de l'Espoir : Parange. Tous droits réservés. Organisation Non Gouvernementale reconnue en République de Côte d'Ivoire.",

    // Common CTAs
    learnMore: "En savoir plus",
    contactUs: "Nous contacter",
    donateNow: "Faire un don solidaire",
    ourServices: "Découvrir nos services",
    virtualGardenCta: "Visiter le Jardin Virtuel"
  },

  en: {
    // Top Banner
    topBannerHelpline: "Solitary Support Helpline Côte d'Ivoire:",
    topBannerHours: "7/7 from 8am to 8pm • Anonymous & Caring",
    topBannerSanctuary: "First Sanctuary for Bereaved Parents in Côte d'Ivoire",
    requestCallback: "Request a callback",
    adminPortal: "Admin Portal",

    // Navigation
    navHome: "Home",
    navNews: "CI News & Press",
    navBlog: "Blog & Reflections",
    navTestimonies: "Stories & Tributes",
    navForum: "Parents Forum",
    navServices: "Services & Support",
    navResources: "Resource Toolbox",
    navVirtualGarden: "Virtual Garden",
    navTraining: "Pro Training",
    navAboutUs: "About Us",
    navDonate: "Donate",
    needHelp: "Need Help?",
    searchPlaceholder: "Search articles, documents, services, groups...",

    // Floating Immediate Help Button
    immediateHelpBtn: "Need Immediate Help?",
    immediateHelpTooltip: "Emergency support 7/7 for grieving parents in distress",
    immediateHelpBadge: "Paranges Emergency 24/7",
    immediateHelpModalTitle: "Immediate Crisis Support & Priority Care",
    immediateHelpModalSubtitle: "Are you facing overwhelming sorrow or a recent loss? Our crisis hotline and clinical psychologists are here to support you right now.",
    callDirectly: "Call our emergency hotline directly:",
    orUseForm: "Or request an urgent callback:",

    // Consultation Modal
    modalTitle: "Support Request & Support Group (GSP)",
    modalSubtitle: "Whether you are a grieving mother, father, sibling, or healthcare provider, our compassionate team welcomes you warmly.",
    modalConfidentiality: "Confidential & compassionate perinatal care in Côte d'Ivoire",
    fullNameLabel: "Full Name or Pseudonym",
    phoneLabel: "Phone / WhatsApp number (Côte d'Ivoire or International)",
    emailLabel: "Email address (optional)",
    cityLabel: "City of residence",
    roleLabel: "You are:",
    roleParange: "Bereaved Parent (Parange)",
    roleSibling: "Brother / Sister (Sibling)",
    roleRelative: "Close Friend / Family Member",
    roleProfessional: "Healthcare Professional / Midwife",
    situationLabel: "Situation experienced:",
    situationPerinatal: "Perinatal loss (miscarriage, TFMR, stillbirth, neonatal death)",
    situationChildLoss: "Loss of an older child or young adult",
    situationSiblingLoss: "Loss of a brother or sister",
    situationOther: "Other grief and bereavement support",
    contactMethodLabel: "Preferred contact method:",
    contactPhone: "Phone call",
    contactWhatsapp: "WhatsApp text message",
    contactInPerson: "In-person appointment (Abidjan)",
    urgentListeningLabel: "🚨 Urgent Crisis Support Requested",
    urgentListeningDesc: "Check this box if you are feeling overwhelming emotional distress or require a same-day response.",
    priorityAlertActive: "Priority request activated • Our coordinator on duty will contact you as the top priority.",
    messageLabel: "Your message or questions (confidential)",
    messagePlaceholder: "Feel free to share briefly what you are experiencing, what support you are seeking...",
    submitRequestBtn: "Send My Confidential Request",
    submittingText: "Sending request...",
    successTitle: "Your request has been received",
    successDescStandard: "A clinical psychologist or trained peer-supporter from Le Jardin de l'Espoir : Parange will contact you discreetly within 24 to 48 business hours.",
    successDescPriority: "Your priority request has triggered an alert for our on-call coordinators. We will reach out to you within the next few hours.",
    closeBtn: "Close",

    // Blog
    blogHeaderBadge: "Reflection & Healing Blog for Bereaved Parents",
    blogTitle: "Words of Solace, Reflection & Resilience",
    blogSubtitle: "In-depth articles, clinical insights, West African cultural perspectives, and guides to break the silence on perinatal grief and honor our babies.",
    blogFilterAll: "All Articles",
    blogFilterJourney: "Parents' Journey",
    blogFilterPsychology: "Psychology & Trauma",
    blogFilterSociety: "Society & African Taboos",
    blogFilterFathers: "Grieving Fathers",
    blogFilterSiblings: "Siblings & Aftermath",
    readArticle: "Read In-Depth Article",
    readingTime: "min read",
    publishedOn: "Published on",
    writtenBy: "By",
    backToBlog: "← Back to all blog articles",
    commentsHeading: "Tributes & Compassionate Community Exchange",
    noCommentsYet: "No comments yet. Be the first to share compassionate words or your story.",
    leaveAComment: "Share a tribute or leave a comment",
    commentAuthorName: "Your name or pseudonym",
    commentRoleLabel: "Your profile:",
    commentContentPlaceholder: "Share your thoughts, words of hope or questions in a caring manner...",
    submitCommentBtn: "Submit My Comment",
    commentModerationNotice: "To preserve a safe, compassionate space for all grieving families, every comment is thoughtfully reviewed by our team before publication.",
    commentSubmittedSuccess: "Thank you from the bottom of our hearts. Your comment has been received and will be published once approved by our moderation team.",
    adminReplyLabel: "Response from Le Jardin de l'Espoir : Parange team:",

    // Home
    homeHeroBadge: "First Sanctuary for Bereaved Parents in Côte d'Ivoire",
    homeHeroTitle: "No parent should walk through the desert of losing a child alone.",
    homeHeroSubtitle: "Le Jardin de l'Espoir : Parange supports ALL persons having lost at least one child, regardless of the child's age — whether stillborn or deceased at an advanced adult age. Born from a personal tragedy in 2018, it breaks the silence and stigma in Côte d'Ivoire, offering professional, compassionate, and fraternal psychological care.",
    homeJoinGspBtn: "Join a Support Group (GSP)",
    homeLightCandleBtn: "Light 1 Candle for an Angel",
    homeHelplineLabel: "Helpline 24/7 Côte d'Ivoire:",
    homePillarsBadge: "Our 4 Founding Pillars",
    homePillarsTitle: "A holistic and compassionate approach to healing and remembrance",
    homePillarsSubtitle: "Because the loss of a child — whether before birth, in early childhood, or at an adult age — profoundly touches mind, body, and family, our work is anchored around four unconditional commitments.",
    homeStatFamilies: "Families welcomed and supported",
    homeStatKits: "Memory kits and keepsake boxes distributed",
    homeStatGsp: "Support Group sessions conducted",
    homeStatCities: "Major cities reached across Côte d'Ivoire",
    homeFaqBadge: "Frequently Asked Questions",
    homeFaqTitle: "Understanding and Navigating Perinatal Grief",
    homeFaqSubtitle: "Honest, caring, and practical answers provided by our clinical psychologists and trained peer-volunteers without judgment.",
    homeCommunityBannerTitle: "A living sanctuary of love and remembrance",
    homeCommunityBannerDesc: "Your story matters. Our listening spaces, held both physically in Abidjan and virtually across Côte d'Ivoire, are open to welcome your tears and memories freely.",
    homeCommunityBannerBtn: "Schedule a Session with a Listener",

    // About
    aboutTitle: "Our Story & Commitments",
    aboutSubtitle: "Founded following the heartbreaking tragedy of 2018, our NGO transforms profound pain into a beacon of hope, dignity, and fraternal solace for every family in Côte d'Ivoire.",
    aboutOriginTitle: "The Tragedy of 2018: A Spark Born From the Ashes",
    aboutOriginP1: "Le Jardin de l'Espoir : Parange was born after a devastating personal loss endured by our founders in Côte d'Ivoire. Faced with sudden grief, overwhelming isolation, and the awkward silence of society and medical teams, the absolute necessity of a dedicated sanctuary became clear.",
    aboutOriginP2: "Across Côte d'Ivoire and West Africa, perinatal death is too often concealed behind shame, superstition, or taboo. We chose to build this sanctuary to give a name, a voice, and a dignified memorial to every child gone too soon.",
    aboutValuesTitle: "Our Cardinal Values",
    aboutTeamTitle: "Listening Team & Healthcare Partners",

    // Services
    servicesTitle: "Compassionate Support & Care Pillars",
    servicesSubtitle: "Explore our comprehensive range of clinical psychological support, peer groups, memory kits, and mobile clinics deployed across Côte d'Ivoire.",

    // Resources
    resourcesTitle: "Resource Toolbox & Practical Guides",
    resourcesSubtitle: "Downloadable practical guides, advice sheets, psychoeducational podcasts, and recommended readings to walk forward step by step.",

    // Training
    trainingTitle: "Professional Training for Healthcare Providers",
    trainingSubtitle: "Certified training programs designed for midwives, nurses, obstetricians, and psychologists to humanize bereavement care in public and private hospitals.",

    // Donation
    donationTitle: "Support Our Mission & Make a Donation",
    donationSubtitle: "Every contribution funds a free keepsake memory box for a grieving family, sponsors psychological sessions, or trains healthcare workers in public maternities.",

    // Forum
    forumTitle: "Community Forum & Peer Support for Parents",
    forumSubtitle: "A safe, moderated space to express your feelings, find understanding among parents who have walked this path, and connect through thematic discussions.",

    // Virtual Garden
    gardenTitle: "The Virtual Garden of Remembrance",
    gardenSubtitle: "A peaceful, eternal sanctuary to light a candle, plant a symbolic flower, and leave a loving tribute in memory of your angel.",

    // Footer
    footerTagline: "First Sanctuary for Bereaved Parents • Humanitarian & Medical NGO in Côte d'Ivoire.",
    footerHelplineTitle: "Helpline 24/7 Côte d'Ivoire:",
    footerCopyright: "© 2018 - 2026 Le Jardin de l'Espoir : Parange. All rights reserved. Recognized Non-Governmental Organization in the Republic of Côte d'Ivoire.",

    // Common CTAs
    learnMore: "Learn More",
    contactUs: "Contact Us",
    donateNow: "Make a Donation",
    ourServices: "Explore Our Services",
    virtualGardenCta: "Visit the Virtual Garden"
  }
};
