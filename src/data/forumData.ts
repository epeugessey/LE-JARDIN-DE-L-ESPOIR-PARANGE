import { ForumCategory, ForumTopic } from '../types';

export const FORUM_CATEGORIES: ForumCategory[] = [
  {
    id: 'premiers-pas',
    name: 'Premiers pas dans le deuil',
    nameEn: 'First Steps in Grief',
    description: 'Les premières heures, le retour de la maternité, le choc émotionnel et le brouillard des premiers jours.',
    descriptionEn: 'The earliest hours, coming home from the maternity ward, the emotional shock and initial haze.',
    iconName: 'Heart',
    accentColor: 'rose',
    topicsCount: 4
  },
  {
    id: 'soutien-papas',
    name: 'Soutien aux Papas Paranges',
    nameEn: 'Support for Grieving Fathers',
    description: 'La douleur silencieuse des pères, les injonctions à « être fort » et trouver son propre espace d\'expression.',
    descriptionEn: 'The quiet sorrow of fathers, the pressure to "be strong" and finding a space for authentic expression.',
    iconName: 'Shield',
    accentColor: 'teal',
    topicsCount: 3
  },
  {
    id: 'la-fratrie',
    name: 'La Fratrie et les autres enfants',
    nameEn: 'Siblings & Surviving Children',
    description: 'Comment annoncer le décès aux aînés, répondre à leurs angoisses et préserver l\'équilibre du foyer.',
    descriptionEn: 'How to explain loss to older children, addressing their fears and nurturing the family balance.',
    iconName: 'Users',
    accentColor: 'amber',
    topicsCount: 2
  },
  {
    id: 'dates-cles',
    name: 'Anniversaires & Dates Clés',
    nameEn: 'Milestones & Key Dates',
    description: 'Faire face à la date présumée d\'accouchement (DPA), aux fêtes de fin d\'année et aux dates anniversaires.',
    descriptionEn: 'Coping with due dates, holidays, seasonal celebrations, and anniversary days with tender care.',
    iconName: 'Calendar',
    accentColor: 'indigo',
    topicsCount: 3
  },
  {
    id: 'reconstruction-espoir',
    name: 'Chemin de Reconstruction & Espoir',
    nameEn: 'Pathways of Healing & Hope',
    description: 'Donner du sens, créer des rituels pérennes, surmonter la culpabilité et envisager l\'avenir avec tendresse.',
    descriptionEn: 'Finding meaning, creating lasting rituals, lifting guilt, and welcoming the future with tenderness.',
    iconName: 'Sparkles',
    accentColor: 'emerald',
    topicsCount: 5
  }
];

export const INITIAL_FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'topic-1',
    categoryId: 'premiers-pas',
    title: 'Le retour à la maison les bras vides : comment avez-vous surmonté les premières nuits ?',
    titleEn: 'Returning home with empty arms: how did you survive the first nights?',
    content: 'Bonjour à tous. Il y a tout juste 11 jours, notre petite princesse Amina est née sans vie à la maternité de Treichville. Rentrer à la maison devant la chambre préparée, les petits vêtements encore étiquetés... le silence est devenu assourdissant. Mon mari et moi sommes perdus. Comment avez-vous réussi à respirer au tout début ? Merci pour votre chaleur.',
    contentEn: 'Hello everyone. Just 11 days ago, our little princess Amina was born still at the Treichville maternity hospital. Walking back into our home with her nursery prepared, tiny clothes still with tags on... the silence became deafening. My husband and I feel completely lost. How did you manage to breathe in the very beginning? Thank you for your warmth.',
    authorName: 'Aïcha K.',
    authorRole: 'maman-parange',
    createdAt: 'Il y a 3 jours',
    status: 'approved',
    viewsCount: 142,
    isPinned: true,
    replies: [
      {
        id: 'rep-1',
        topicId: 'topic-1',
        authorName: 'Sandrine B.',
        authorRole: 'maman-parange',
        content: 'Chère Aïcha, toutes mes pensées les plus douces. Ce que vous décrivez est ce que nous appelons ici "le gouffre". Pour ma part, avec mon époux, nous n\'avons pas touché à la chambre pendant 3 semaines. Ne vous forcez à rien. Pleurez autant qu\'il le faut, tenez-vous la main. Le Jardin de l\'Espoir : Parange m\'avait conseillé de ranger petit à petit dans une jolie malle à souvenirs. Vous n\'êtes pas seule.',
        contentEn: 'Dear Aïcha, sending you my gentlest thoughts. What you describe is what we call "the chasm" here. My husband and I did not touch the nursery for 3 weeks. Do not force yourselves into anything. Cry as much as you need, hold hands. Le Jardin de l\'Espoir : Parange advised me to store things little by little in a memory keepsake box. You are not alone.',
        createdAt: 'Il y a 2 jours',
        status: 'approved',
        likesCount: 14
      },
      {
        id: 'rep-2',
        topicId: 'topic-1',
        authorName: 'Dr Marie-Hélène Kouadio',
        authorRole: 'psychologue',
        content: 'Chère Aïcha, vos réactions sont le reflet normal d\'une rupture d\'une violence inouïe. Prenez un jour à la fois, une heure à la fois si la journée paraît trop longue. N\'hésitez pas à solliciter un appel de notre permanence d\'écoute si les nuits sont trop angoissantes.',
        contentEn: 'Dear Aïcha, your feelings are the natural response to a deeply shattering loss. Take it one day at a time, one hour at a time if the days feel too daunting. Never hesitate to request a call through our support hotline if nights become overwhelming.',
        createdAt: 'Il y a 1 jour',
        status: 'approved',
        likesCount: 22
      }
    ]
  },
  {
    id: 'topic-2',
    categoryId: 'soutien-papas',
    title: 'Pères endeuillés : pourquoi tout le monde me demande seulement "comment va ta femme ?"',
    titleEn: 'Bereaved fathers: why does everyone only ask "how is your wife doing?"',
    content: 'C\'est un cri du cœur. Notre fils Yanis est parti à 34 semaines. Depuis, la famille, les collègues, les amis m\'interpellent tous en disant : "Sois fort pour ta femme, comment va-t-elle ?". Mais personne ne me demande comment MOI je vais. J\'ai perdu mon fils, ma chair. Est-ce qu\'en Côte d\'Ivoire un père n\'a pas le droit de s\'effondrer aussi ?',
    contentEn: 'This is a plea from the heart. Our son Yanis passed away at 34 weeks. Since then, family, colleagues, and friends all keep telling me: "Be strong for your wife, how is she?". But nobody asks how I am doing. I lost my son, my flesh and blood. In Côte d\'Ivoire, does a father not have the right to break down too?',
    authorName: 'Kouamé Jean-Marc',
    authorRole: 'papa-parange',
    createdAt: 'Il y a 5 jours',
    status: 'approved',
    viewsCount: 210,
    isPinned: true,
    replies: [
      {
        id: 'rep-3',
        topicId: 'topic-2',
        authorName: 'Alassane D.',
        authorRole: 'papa-parange',
        content: 'Mon frère Jean-Marc, ton message me touche au plus profond. J\'ai vécu exactement la même chose en 2024. Dans notre culture, on exige de l\'homme qu\'il soit le roc protecteur. Mais un roc pleure aussi. Participe au cercle des papas en ligne le 24 septembre, nous pourrons parler d\'homme à homme sans honte.',
        contentEn: 'Brother Jean-Marc, your words touch my core. I lived the exact same sorrow in 2024. In our culture, men are expected to be an immovable rock. But a rock weeps too. Join the online fathers circle on September 24; we talk man-to-man without shame.',
        createdAt: 'Il y a 4 jours',
        status: 'approved',
        likesCount: 31
      }
    ]
  },
  {
    id: 'topic-3',
    categoryId: 'la-fratrie',
    title: 'Mon fils de 6 ans me demande quand sa petite sœur va redescendre du ciel',
    titleEn: 'My 6-year-old son asks when his baby sister will come back down from heaven',
    content: 'Comment lui expliquer la permanence de la mort sans lui faire peur ? Nous lui avons dit que bébé Sarah est devenue une étoile, mais maintenant il attend qu\'elle revienne à chaque nuit claire.',
    contentEn: 'How do I explain the permanence of death without frightening him? We told him baby Sarah became a star, but now he waits for her to come back on every clear starry night.',
    authorName: 'Fatou Traoré',
    authorRole: 'maman-parange',
    createdAt: 'Il y a 6 jours',
    status: 'approved',
    viewsCount: 98,
    replies: [
      {
        id: 'rep-4',
        topicId: 'topic-3',
        authorName: 'Bénédicte G.',
        authorRole: 'benevole',
        content: 'Bonjour Fatou. Chez les enfants de moins de 7 ans, la notion de réversibilité est courante. Les psychologues de l\'ONG recommandent d\'utiliser des mots clairs : "son petit corps a cessé de vivre et ne peut plus respirer ni bouger". Téléchargez la fiche conseil "Parler de la perte aux aînés" dans la Boîte à Outils du site, elle contient des phrases très aidantes.',
        contentEn: 'Hello Fatou. In children under 7, the concept of reversibility is natural. The NGO psychologists suggest using clear, gentle words: "her little body stopped working and cannot breathe or move anymore". Download our guidance sheet "Talking about loss to older siblings" in our Toolkit; it contains deeply reassuring phrasing.',
        createdAt: 'Il y a 5 jours',
        status: 'approved',
        likesCount: 17
      }
    ]
  },
  {
    id: 'topic-4',
    categoryId: 'reconstruction-espoir',
    title: 'Planter un oranger dans notre cour en mémoire de notre ange : notre rituel d\'apaisement',
    titleEn: 'Planting an orange tree in our courtyard in memory of our angel: our soothing ritual',
    content: 'Je voulais partager une lueur d\'espérance avec vous. Avec mon époux, un an après le départ de notre fille Grâce, nous avons planté un bel oranger dans la cour familiale à Bingerville. Chaque fois qu\'une feuille pousse ou qu\'une fleur sent bon, nous sentons sa présence vivante et douce. Avez-vous aussi des rituels qui vous font du bien ?',
    contentEn: 'I wanted to share a ray of hope with you. With my husband, one year after our daughter Grâce left us, we planted an orange tree in our family yard in Bingerville. Whenever a new leaf sprouts or an orange blossom releases its perfume, we feel her sweet and living presence. Do you have comforting rituals too?',
    authorName: 'Estelle N\'Guessan',
    authorRole: 'maman-parange',
    createdAt: 'Il y a 1 semaine',
    status: 'approved',
    viewsCount: 340,
    replies: [
      {
        id: 'rep-5',
        topicId: 'topic-4',
        authorName: 'Yasmine C.',
        authorRole: 'maman-parange',
        content: 'C\'est magnifique Estelle ! Nous avons allumé une bougie virtuelle ici dans Le Jardin de l\'Espoir : Parange et nous portons un petit bracelet gravé de son prénom. Ça nous relie chaque jour.',
        contentEn: 'That is truly beautiful Estelle! We lit a virtual candle right here in Le Jardin de l\'Espoir : Parange, and we wear a small bracelet engraved with her name. It keeps us intimately linked every day.',
        createdAt: 'Il y a 6 jours',
        status: 'approved',
        likesCount: 19
      }
    ]
  }
];
