export interface ParangeFaqItem {
  id: string;
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
  category: 'deuil_emotions' | 'couple_famille' | 'tabous_ci' | 'aspects_pratiques' | 'soins_cliniques';
  order: number;
  helpfulCount?: number;
  createdAt?: string;
}

export const FAQ_CATEGORIES: { id: ParangeFaqItem['category'] | 'tous'; label: string; labelFr: string; labelEn: string }[] = [
  { id: 'tous', label: 'Toutes les questions', labelFr: 'Toutes les questions', labelEn: 'All Questions' },
  { id: 'deuil_emotions', label: 'Émotions & Deuil', labelFr: 'Émotions & Deuil', labelEn: 'Grief & Emotions' },
  { id: 'couple_famille', label: 'Couple & Fratrie', labelFr: 'Couple & Fratrie', labelEn: 'Couple & Siblings' },
  { id: 'tabous_ci', label: 'Tabous & Entourage CI', labelFr: 'Tabous & Entourage CI', labelEn: 'Taboos & Culture CI' },
  { id: 'aspects_pratiques', label: 'Rituels & Mémoire', labelFr: 'Rituels & Mémoire', labelEn: 'Memorial & Rituals' },
  { id: 'soins_cliniques', label: 'Accompagnement & Ligne 24/7', labelFr: 'Accompagnement & Ligne 24/7', labelEn: 'Care & 24/7 Helpline' }
];

export const INITIAL_PARANGE_FAQS: ParangeFaqItem[] = [
  {
    id: 'faq-1',
    order: 1,
    category: 'deuil_emotions',
    question: "Qu'est-ce qu'un « Parange » et pourquoi ce terme est-il fondamental pour nous ?",
    questionEn: "What is a « Parange » and why is this word essential for our healing?",
    answer: "Le mot « parange » est un néologisme doux unissant « parent » et « ange ». Dans notre langue et nos traditions, un enfant qui perd ses parents est appelé orphelin, une personne qui perd son conjoint est veuf ou veuve, mais il n'existait aucun terme pour désigner des parents dont l'enfant est décédé. Nommer cette réalité permet de reconnaître publiquement notre paternité et notre maternité pour toujours. Votre bébé a existé, vous êtes et resterez ses parents.",
    answerEn: "The word « parange » unites 'parent' and 'angel'. While languages have words for a child who loses parents (orphan) or a spouse who loses their partner (widow/widower), there was no single word for parents who lost their child. Giving a name to this sacred reality validates our lasting parenthood forever. Your baby existed, and you will always remain their mother or father.",
    helpfulCount: 42
  },
  {
    id: 'faq-2',
    order: 2,
    category: 'tabous_ci',
    question: "Comment faire face aux phrases maladroites de l'entourage (« Tu es jeune », « Dieu va te donner un autre ») en Côte d'Ivoire ?",
    questionEn: "How to handle painful remarks from acquaintances ('You are young', 'God will give another') in Côte d'Ivoire?",
    answer: "En Côte d'Ivoire, ces formules partent presque toujours d'une maladresse dictée par le malaise, la peur de vos larmes ou des croyances coutumières. Sachez que vous n'avez pas à minimiser votre douleur pour ménager votre entourage. Vous pouvez répondre avec dignité et douceur : « Mon enfant a existé, il n'est pas remplaçable et son absence me brise le cœur. J'ai juste besoin de votre présence silencieuse et de votre écoute, pas de comparaisons. » Vous avez le droit d'établir des limites saines.",
    answerEn: "In Côte d'Ivoire, such remarks usually stem from awkwardness, fear of grief, or customary silence. You never have to minimize your heartbreak to make others comfortable. You can respond calmly: 'My baby existed, cannot be replaced, and my heart is broken. I only need your loving silent presence, not comparisons.' You have the absolute right to set gentle boundaries.",
    helpfulCount: 38
  },
  {
    id: 'faq-3',
    order: 3,
    category: 'deuil_emotions',
    question: "Est-il normal d'éprouver une culpabilité écrasante ou de rejouer sans cesse l'accouchement en boucle ?",
    questionEn: "Is it normal to experience overwhelming guilt or constantly replay delivery events in my mind?",
    answer: "Oui, la culpabilité est l'une des étapes les plus fréquentes et douloureuses du choc post-traumatique lié à la perte périnatale. Les pensées obsessionnelles (« Et si j'avais consulté un médecin plus tôt ? », « Ai-je fait un faux mouvement ? ») sont une tentative désespérée du cerveau pour chercher une cause logique à l'inconcevable. Nos psychologues cliniciens du Jardin de l'Espoir : Parange vous aident à déconstruire ces fausses croyances : vous n'êtes en rien responsable de la perte de votre bébé.",
    answerEn: "Yes, intense guilt is one of the most common reactions to perinatal trauma. Obsessive thoughts ('What if I went to the clinic sooner?', 'Did I do something wrong?') are the mind's defense attempt to rationalize the unthinkable. Our psychologists at Le Jardin de l'Espoir : Parange help deconstruct these painful beliefs: you are in no way responsible for your baby's death.",
    helpfulCount: 51
  },
  {
    id: 'faq-4',
    order: 4,
    category: 'couple_famille',
    question: "Notre couple vacille : mon conjoint semble hermétique et ne pleure pas, alors que je suis effondrée. Que se passe-t-il ?",
    questionEn: "Our relationship is strained: my partner seems distant and doesn't cry while I am weeping. What is happening?",
    answer: "Les hommes et les femmes cheminent très souvent à des rythmes différents dans le deuil. En Côte d'Ivoire, les pères subissent une immense pression sociétale et familiale exigeant de « rester fort », de travailler pour nourrir le foyer et de ne jamais montrer de faiblesse. Ce silence masculin n'est pas de l'indifférence, mais un bouclier protecteur. Nos séances de couple et les cercles Papas Paranges permettent d'ouvrir un dialogue sans reproche où chacun peut enfin déposer son fardeau.",
    answerEn: "Partners almost always grieve at different tempos. In Côte d'Ivoire, fathers face heavy social pressure to 'stay strong', support the household financially, and suppress vulnerability. This silence is not coldness; it is often a protective shell. Our couple consultations and dedicated Father Support Circles create a neutral space to reconnect without blame.",
    helpfulCount: 29
  },
  {
    id: 'faq-5',
    order: 5,
    category: 'couple_famille',
    question: "Comment expliquer la perte du bébé aux autres enfants de la fratrie sans les traumatiser ?",
    questionEn: "How do we gently explain baby loss to surviving siblings without instilling fear?",
    answer: "La règle fondamentale recommandée par nos pédopsychiatres est la clarté bienveillante. Il faut impérativement bannir les métaphores floues comme « le bébé s'est endormi pour toujours » ou « il est parti en grand voyage », qui peuvent déclencher chez l'enfant une phobie du sommeil ou des angoisses de séparation. Dites avec douceur : « Le corps du bébé était trop fragile ou trop malade pour continuer à vivre. Son cœur s'est arrêté. Il ne souffre pas, et notre amour pour lui reste vivant dans notre cœur. »",
    answerEn: "Our child psychiatrists recommend compassionate truth. Avoid confusing metaphors like 'the baby went to sleep forever' or 'went on a long journey', which often create bedtime fears and separation anxiety. Instead say gently: 'The baby's body was too fragile or sick to stay alive. Their heart stopped. They feel no pain, and our love for them lives forever in our hearts.'",
    helpfulCount: 35
  },
  {
    id: 'faq-6',
    order: 6,
    category: 'aspects_pratiques',
    question: "Peut-on donner un prénom et organiser un hommage digne pour un bébé mort-né en Côte d'Ivoire ?",
    questionEn: "Can we name and hold a dignified memorial ceremony for a stillborn baby in Côte d'Ivoire?",
    answer: "Absolument. C'est un droit fondamental et un geste hautement réparateur pour les parents. Vous pouvez donner un prénom d'amour à votre enfant, semer une fleur éternelle dans notre Jardin Virtuel, conserver ses empreintes dans notre Kit de Mémoire, et allumer une bougie solidaire chaque 15 octobre lors de la Vague Mondiale de Lumière. Nous vous accompagnons également dans vos démarches auprès des maternités.",
    answerEn: "Absolutely. Naming your child is a fundamental right and an essential milestone for healing. You can choose a loving name, plant an enduring bloom in our Virtual Memorial Garden, keep their footprint in our Memory Box, and light a candle each October 15th during the Wave of Light. We support you every step of the way.",
    helpfulCount: 47
  },
  {
    id: 'faq-7',
    order: 7,
    category: 'soins_cliniques',
    question: "Comment bénéficier de l'accompagnement gratuit du Jardin de l'Espoir : Parange et quelles sont les modalités ?",
    questionEn: "How can I access free psychological support from Le Jardin de l'Espoir : Parange?",
    answer: "L'accompagnement offert par l'ONG est entièrement gratuit, bienveillant et strictement confidentiel. Il vous suffit d'appeler notre permanence 24/7 au 07 59 87 21 61 / 05 75 23 93 12 ou d'écrire par WhatsApp. Un premier temps d'accueil téléphonique est réalisé sous 24h ouvrées. Selon vos besoins, nous vous proposons un entretien individuel, des séances de couple ou une intégration dans l'un de nos Groupes de Soutien Psychologique (GSP).",
    answerEn: "Support provided by our NGO is 100% free, compassionate, and strictly confidential. Simply call our 24/7 helpline (+225 07 59 87 21 61 / 05 75 23 93 12) or reach out via WhatsApp. A clinical counselor connects with you within 24 business hours to organize individual care, couple therapy, or access to our Support Groups (GSP).",
    helpfulCount: 64
  },
  {
    id: 'faq-8',
    order: 8,
    category: 'deuil_emotions',
    question: "Le Jardin de l'Espoir concerne-t-il uniquement les bébés ou toute personne ayant perdu un enfant quel que soit son âge ?",
    questionEn: "Does Le Jardin de l'Espoir only support infant loss, or any person who has lost a child regardless of age?",
    answer: "Le Jardin de l'Espoir : Parange concerne et accompagne inconditionnellement TOUTE personne ayant perdu au moins 1 enfant, quel que soit l'âge de l'enfant disparu : qu'il s'agisse d'un enfant mort-né (mort in utero, fausse couche tardive, IMG), d'un nourrisson, d'un enfant en bas âge, d'un adolescent ou d'un enfant décédé à un âge adulte ou avancé (accident, maladie, drame). La douleur d'un père ou d'une mère qui survit à son enfant défie l'ordre naturel des générations et aucune durée de vie n'atténue la blessure d'un parent. On reste Parange pour toujours.",
    answerEn: "Le Jardin de l'Espoir : Parange unconditionally welcomes EVERY person who has lost at least one child, regardless of the child's age: whether stillborn (miscarriage, stillbirth, medical termination), infant, young child, adolescent, or an adult son/daughter who passed away at an advanced age. A parent surviving their child transcends chronological age: once a parent, always a Parange.",
    helpfulCount: 78
  },
  {
    id: 'faq-9',
    order: 9,
    category: 'aspects_pratiques',
    question: "Comment rejoindre le Groupe Facebook Officiel et échanger au quotidien avec d'autres parents ?",
    questionEn: "How do I join the Official Facebook Group to connect daily with fellow bereaved parents?",
    answer: "Vous pouvez rejoindre notre communauté sécurisée et bienveillante directement sur notre Groupe Facebook Officiel (https://www.facebook.com/groups/lejardindelespoirparange/). Cet espace fraternel, modéré 24h/24, permet aux mamans, papas et proches endeuillés en Côte d'Ivoire et dans la diaspora de rompre la solitude, d'échanger des conseils d'apaisement, de partager des souvenirs et d'honorer ensemble les dates anniversaires.",
    answerEn: "You can join our compassionate and moderated community on our Official Facebook Group (https://www.facebook.com/groups/lejardindelespoirparange/). Moderated 24/7, this group allows mothers, fathers, and families across Côte d'Ivoire and the diaspora to break the silence, share comforting words, and honor memorial milestones together.",
    helpfulCount: 56
  }
];

export const getStoredFaqs = (): ParangeFaqItem[] => {
  try {
    const raw = localStorage.getItem('jde_parange_faqs');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure new system questions (faq-8 on all ages, faq-9 on facebook) are always present
        const hasFaq8 = parsed.some((f: ParangeFaqItem) => f.id === 'faq-8');
        const hasFaq9 = parsed.some((f: ParangeFaqItem) => f.id === 'faq-9');
        if (!hasFaq8 || !hasFaq9) {
          const missing = INITIAL_PARANGE_FAQS.filter(initF => !parsed.some((p: ParangeFaqItem) => p.id === initF.id));
          const updated = [...parsed, ...missing];
          localStorage.setItem('jde_parange_faqs', JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading stored FAQs', e);
  }
  return INITIAL_PARANGE_FAQS;
};

export const saveStoredFaqs = (faqs: ParangeFaqItem[]) => {
  try {
    localStorage.setItem('jde_parange_faqs', JSON.stringify(faqs));
  } catch (e) {
    console.error('Error saving stored FAQs', e);
  }
};

export const INITIAL_FAQ_ITEMS: any[] = INITIAL_PARANGE_FAQS.map(item => ({
  ...item,
  isPublished: true,
  categoryLabel: item.category,
  categoryLabelEn: item.category,
  lastUpdated: 'Initial'
}));
