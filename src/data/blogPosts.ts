import { BlogPost, BlogComment } from '../types';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: "Le deuil périnatal en Côte d'Ivoire : briser le silence, réhabiliter la mémoire et apprivoiser l'absence",
    titleEn: "Perinatal Bereavement in Côte d'Ivoire: Breaking the Silence, Restoring Memory, and Embracing Absence",
    slug: "deuil-perinatal-cote-divoire-briser-silence-memoire",
    category: 'cheminement-paranges',
    categoryLabel: 'Cheminement des Paranges',
    categoryLabelEn: 'Bereaved Parents Journey',
    author: "Dr. Marie-Hélène Kouadio",
    authorRole: "Psychologue clinicienne & Référente deuil périnatal",
    authorRoleEn: "Clinical Psychologist & Perinatal Bereavement Specialist",
    publishedAt: "12 Octobre 2024",
    readTime: "8 min de lecture",
    readTimeEn: "8 min read",
    excerpt: "Pourquoi la perte d'un bébé avant ou juste après sa naissance reste-t-elle l'un des tabous les plus douloureux de notre société ? Analyse d'un deuil invisibilisé et pistes pour redonner une place légitime à ces enfants partis trop tôt.",
    excerptEn: "Why does the loss of a baby before or shortly after birth remain one of society's most painful taboos? An analysis of invisible grief and concrete paths to giving these cherished children their rightful place.",
    tags: ['Deuil Périnatal', 'Société Ivoirienne', 'Résilience', 'Paranges'],
    isFeatured: true,
    likesCount: 38,
    coverImageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
    content: `
### L'invisibilisation d'une tragédie intime

En Côte d'Ivoire comme dans une large partie de l'Afrique de l'Ouest, la grossesse est célébrée comme une bénédiction divine et l'enfant comme l'accomplissement d'une lignée. Lorsque la vie s'interrompt brutalement — qu'il s'agisse d'une fausse couche précoce, d'une interruption médicale de grossesse (IMG), d'une mort fœtale in utero (MFIU) ou d'un décès dans les premiers jours de vie en néonatalogie —, le silence retombe comme un couvercle de plomb.

Les mères entendent alors des phrases devenues des réflexes collectifs :
> « Tu es encore jeune, Dieu va t'en donner un autre. »  
> « Ne pleure pas, tes larmes vont l'attacher ou porter malheur à tes futures maternités. »  
> « C'est la volonté de Dieu, oublie vite pour aller de l'avant. »

Bien que souvent formulées pour consoler ou par maladresse face à l'indicible, ces paroles nient la réalité d'un attachement profond. Car on ne remplace pas un être humain par un autre. Le bébé décédé n'était pas un simple 'projet virtuel' : il avait déjà un prénom secret, une place dans le cœur des parents, des mouvements ressentis dans le ventre et des rêves tissés autour de son berceau.

### La triple blessure du Parange

Le deuil périnatal porte une singularité que les manuels de psychologie décrivent comme une « perte ambiguë » et « désynchronisée » :
1. **La blessure physique et hormonale :** Le corps de la mère a porté la vie et se prépare à nourrir un enfant qui n'est plus là. Les montées de lait et le vide utérin constituent des traumatismes sensoriels d'une violence inouïe.
2. **La blessure de l'invisibilité sociale :** Pas d'album photo, rarement de sépulture formelle ou d'état civil, peu ou pas de souvenirs tangibles partagés avec l'entourage. Le parent endeuillé pleure ce qui a été, mais surtout ce qui aurait dû être.
3. **Le sentiment d'illégitimité et de culpabilité :** Les parents finissent par se demander s'ils ont le droit de pleurer autant pour un bébé qui n'a pas « vécu » aux yeux de la communauté.

### Comment cheminer vers l'apaisement ?

Au sein de l'ONG Le Jardin de l'Espoir : Parange, nous constatons chaque jour combien la parole libérée en communauté restaure la dignité des familles :
- **Nommer l'enfant :** Donner un prénom à son tout-petit et inscrire son existence dans l'histoire de la famille est la première étape de la reconnaissance symbolique.
- **Créer des rituels réparateurs :** Une bougie allumée le 15 octobre lors de la Vague Mondiale de Lumière, une boîte à souvenirs conservant l'échographie, un mot déposé dans le Jardin Virtuel.
- **Rejoindre un Groupe de Soutien Psychologique (GSP) :** Découvrir qu'on n'est ni fou ni seul, que d'autres mères et pères partagent exactement les mêmes pensées, libère d'un poids immense.

Le deuil ne signifie pas oublier : il s'agit d'apprendre à aimer autrement celui ou celle qui n'est plus visible, mais qui continue d'exister à travers l'amour qu'il a suscité.
`,
    contentEn: `
### The Invisibility of an Intimate Tragedy

In Côte d'Ivoire, as across West Africa, pregnancy is celebrated as a sacred blessing and a newborn represents the crowning of family lineage. When life is abruptly cut short—whether through early miscarriage, medical termination, stillbirth, or loss in the neonatal intensive care unit—a heavy silence falls like lead upon grieving families.

Mothers are repeatedly subjected to instinctive cultural clichés:
> "You are still young, God will give you another child."  
> "Do not weep, your tears will hold back your angel or curse your future pregnancies."  
> "It is God's will; move on quickly and forget."

While these phrases are often born of awkwardness in the presence of unbearable grief, they cruelly deny genuine human attachment. A child cannot be replaced. The lost baby was not an abstract concept: they already had an intimate name, a sacred place in their parents' hearts, felt kicks, and a tapestry of dreams woven around their nursery.

### The Triple Wound of Bereaved Parents

Clinical psychology categorizes perinatal bereavement as a complex "ambiguous loss":
1. **The Physical & Hormonal Wound:** The mother's body prepared for motherhood and lactation for a baby who is not in her arms. The physical emptiness is deeply distressing.
2. **The Social Invisibility:** No traditional photo albums, rare civil registrations, minimal tangible mementos shared with society. Parents mourn both what existed and what will never come to pass.
3. **The Wound of Illegitimacy & Guilt:** Grieving parents question whether they have the right to mourn so deeply for an infant who was not recognized by the community.

### Paths Toward Healing

At Le Jardin de l'Espoir : Parange, we observe daily that compassionate community dialogue restores dignity:
- **Naming the Child:** Giving an identity and inscribing their memory in family records is the essential first step of recognition.
- **Healing Rituals:** Lighting a candle on October 15th for the International Wave of Light, preserving memory boxes, dedicating an eternal flower in the Virtual Garden.
- **Joining a Support Group (GSP):** Discovering that you are not broken and that fellow parents carry the exact same ache lifts an immense burden.

Grief does not mean forgetting: it is learning to love anew the one who is no longer visible, but who continues to live through the everlasting love they inspired.
`
  },
  {
    id: 'blog-2',
    title: "Le chagrin silencieux des pères : comment les Papas Paranges traversent la perte",
    titleEn: "The Silent Sorrow of Fathers: How Grieving Dads Navigate Child Loss",
    slug: "chagrin-silencieux-peres-papas-paranges",
    category: 'papas-paranges',
    categoryLabel: 'Papas Paranges',
    categoryLabelEn: 'Bereaved Fathers',
    author: "Marc-Aurèle Tanoh",
    authorRole: "Pair-aidant & Co-animateur du cercle Papas Paranges",
    authorRoleEn: "Peer Mentor & Facilitator of Bereaved Fathers Circle",
    publishedAt: "28 Novembre 2024",
    readTime: "6 min de lecture",
    readTimeEn: "6 min read",
    excerpt: "Obligés par la culture à être le 'pilier fort' qui gère la clinique et protège sa compagne, les pères taisent souvent leurs larmes. Pourquoi et comment donner une voix aux pères endeuillés ?",
    excerptEn: "Culturally commanded to be the unyielding 'pillar of strength' who handles hospital administration and shields his spouse, fathers often conceal their tears. How can we open dedicated healing spaces for grieving dads?",
    tags: ['Pères', 'Hommes & Vulnérabilité', 'Couple', 'Côte d\'Ivoire'],
    isFeatured: false,
    likesCount: 29,
    coverImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    content: `
### L'armure exigée par le patriarcat

Dans notre contexte ivoirien, l'homme est éduqué à contenir ses émotions. Lorsqu'un drame survient à la maternité, le père est propulsé au front : c'est lui qui doit régler les factures médicales, annoncer la nouvelle aux beaux-parents, veiller sur sa conjointe hospitalisée et répondre aux appels de compassion.

On lui répète sans cesse :
> « Sois fort pour ta femme, un homme ne pleure pas. »

Résultat : le père s'oublie. Il refoule sa peine sous une débauche d'énergie professionnelle ou un silence hermétique. Mais ce silence est souvent mal interprété par la conjointe, qui peut ressentir ce mutisme comme une forme de détachement ou d'indifférence. C'est ainsi que des couples pourtant très unis se déchirent au pire moment.

### La réalité du deuil paternel

Le père n'a certes pas porté biologiquement le bébé dans son ventre, mais il a investi ce rôle dès le premier test de grossesse. Il s'est projeté dans la paternité : lui apprendre à marcher, partager des moments de fierté, protéger sa famille.

Lorsque ce rêve s'écroule, le sentiment d'impuissance est ravageur :
- **L'incapacité à avoir protégé sa compagne et son enfant :** Une blessure profonde dans l'estime de soi masculine.
- **L'absence d'espace d'écoute :** Lors des visites de condoléances, tout le monde demande : *« Comment va la maman ? »*. Très peu de personnes demandent sincèrement : *« Et toi, Marc, comment te sens-tu ? »*.

### Le cercle Papas Paranges du Jardin de l'Espoir : Parange

Pour briser cet isolement, l'ONG a mis en place des cercles exclusivement masculins. Entre pairs ayant traversé la même tempête, la parole se dénoue. On y découvre qu'un homme a le droit d'avoir le cœur brisé, de pleurer son fils ou sa fille, et que la vulnérabilité partagée au sein du couple est au contraire le plus solide des ciments pour se reconstruire ensemble.
`,
    contentEn: `
### The Armor of Cultural Expectations

In our Ivorian context, men are socialized from childhood to suppress emotional pain. When a catastrophe strikes in the delivery ward, fathers are thrust into duty: settling medical bills, breaking the devastating news to extended families, watching over hospitalized spouses, and managing condolence visits.

They are repeatedly told:
> "Be strong for your wife; real men do not cry."

Consequently, fathers bury their own grief. They plunge into overwork or withdraw into stony silence. However, this emotional barricade is often misunderstood by their partners as detachment or indifference—causing beloved couples to drift apart in the aftermath of trauma.

### The True Reality of Paternal Grief

While fathers do not carry the pregnancy biologically, they emotionally invest from the first ultrasound. They envision teaching their child to walk, guiding their milestones, and nurturing their future.

When this vision collapses, the sense of helplessness cuts deep:
- **Helplessness in Protecting Loved Ones:** A severe injury to paternal self-worth.
- **Lack of Emotional Check-ins:** During condolences, visitors constantly ask, *"How is the mother doing?"* Almost no one asks, *"And you, my brother, how is your heart holding up?"*

### Dedicated Circles for Grieving Fathers

To dismantle this isolation, Le Jardin de l'Espoir : Parange organizes peer circles exclusively for men. Among brothers who walked through the same valley, defenses drop. Fathers learn that crying for their son or daughter is an act of love, and that shared vulnerability within marriage is the truest foundation for shared healing.
`
  },
  {
    id: 'blog-3',
    title: "La fratrie face au berceau vide : trouver les mots vrais pour les aînés",
    titleEn: "Siblings Facing the Empty Crib: Finding Honest and Gentle Words for Children",
    slug: "fratrie-face-au-berceau-vide-parler-aux-enfants",
    category: 'fratrie-et-apres',
    categoryLabel: 'Fratrie & Après',
    categoryLabelEn: 'Siblings & Healing',
    author: "Christelle Bamba",
    authorRole: "Pédopsychologue & Art-thérapeute",
    authorRoleEn: "Child Psychologist & Art Therapist",
    publishedAt: "15 Janvier 2025",
    readTime: "7 min de lecture",
    readTimeEn: "7 min read",
    excerpt: "Comment expliquer la perte du futur petit frère ou de la petite sœur sans semer l'angoisse chez les aînés ? Repères pratiques, contes et rituels familiaux adaptés à chaque âge.",
    excerptEn: "How do you explain the loss of an anticipated younger sibling without instilling deep anxiety in children? Practical developmental guidance, soothing allegories, and comforting family rituals.",
    tags: ['Fratrie', 'Enfance', 'Éducation', 'Pédopsychologie'],
    isFeatured: false,
    likesCount: 22,
    coverImageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca564?auto=format&fit=crop&w=1200&q=80',
    content: `
### Les pièges des métaphores trompeuses

Les enfants ont une intuition remarquable : même si les adultes tentent de leur cacher leur détresse en essuyant furtivement leurs larmes, les aînés perçoivent immédiatement le changement d'atmosphère dans la maison.

Par peur de traumatiser les petits, les parents recourent parfois à des euphémismes qui, bien qu'apaisants en apparence, créent de graves confusions chez l'enfant :
- *« Le bébé s'est endormi pour toujours »* → L'enfant développe la phobie du coucher, craignant de ne plus se réveiller s'il dort.
- *« Dieu avait besoin d'un petit ange auprès de lui »* → L'enfant peut nourrir une rancœur envers le divin ou craindre que Dieu vienne aussi chercher maman ou papa.
- *« Il est parti en voyage »* → L'enfant attend son retour chaque matin à la porte.

### Les mots simples et la vérité bienveillante

Les psychologues pédiatriques recommandent une formulation limpide adaptée à l'âge :
> « Le cœur du bébé s'est arrêté de battre. Son corps était trop fragile pour vivre avec nous sur terre. Les médecins ont tout essayé, mais ils n'ont pas pu le réparer. Ce n'est la faute de personne : ni la tienne, ni celle de maman, ni celle de papa. »

Il est primordial de rassurer l'enfant sur sa propre sécurité et de dissiper toute pensée magique : beaucoup d'aînés qui avaient manifesté un sentiment de jalousie durant la grossesse (« Je ne veux pas prêter mes jouets ») croient intimement que leurs mauvaises pensées ont causé la mort du bébé.

### Les ateliers d'expression au Jardin de l'Espoir : Parange

À travers le dessin, le modelage de l'argile et la lecture de contes thérapeutiques, nos ateliers fratrie permettent aux enfants de poser des questions, d'exprimer leur tristesse ou leur colère, et de fabriquer un petit objet mémoriel pour inscrire le petit frère ou la petite sœur disparue dans leur histoire d'enfant.
`,
    contentEn: `
### The Pitfalls of Misleading Metaphors

Children possess keen emotional antennae. Even when parents conceal tears, older siblings instantly sense the sudden tension and sorrow in the home.

Out of fear of distressing children, adults often resort to euphemisms that inadvertently provoke severe anxieties:
- *"The baby went to sleep forever"* → Children may develop severe sleep phobias, fearing they will never wake up if they close their eyes.
- *"God needed a little angel in heaven"* → Children may feel resentment toward the divine or fear that parents might also be taken next.
- *"The baby went on a long journey"* → Children stand at the window waiting for their return.

### Honest, Age-Appropriate Truth

Pediatric psychologists advise simple, honest phrasing:
> "The baby's heart stopped beating. Their tiny body was too delicate to live with us in this world. The doctors tried everything, but they could not heal them. It is nobody's fault: not yours, not mommy's, and not daddy's."

It is vital to reassure children of their own safety and eliminate "magical thinking": many siblings who felt momentary jealousy during the pregnancy ("I don't want to share my room") privately fear their thoughts caused the tragedy.

### Creative Expression Workshops

Through guided drawing, clay modeling, and therapeutic storytelling, our sibling workshops help children ask questions, express natural emotions, and craft small keepsakes honoring their baby brother or sister.
`
  },
  {
    id: 'blog-4',
    title: "Après la nuit : envisager une grossesse d'après (bébé espoir) sans trahir son ange",
    titleEn: "After the Storm: Welcoming a Rainbow Pregnancy Without Betraying Your Angel",
    slug: "apres-la-nuit-grossesse-d-apres-bebe-espoir",
    category: 'psychologie-trauma',
    categoryLabel: 'Psychologie & Traumatisme',
    categoryLabelEn: 'Psychology & Trauma',
    author: "Dr. Marie-Hélène Kouadio",
    authorRole: "Psychologue clinicienne",
    authorRoleEn: "Clinical Psychologist",
    publishedAt: "20 Février 2025",
    readTime: "9 min de lecture",
    readTimeEn: "9 min read",
    excerpt: "Porter à nouveau la vie après une mort périnatale est un parcours d'une intensité émotionnelle extrême, oscillant entre joie fragile et terreur panique. Conseils pour vivre ce pont entre mémoire et avenir.",
    excerptEn: "Carrying life again after infant loss is an intensely emotional journey, suspended between fragile hope and profound anxiety. Guidance for building a bridge between eternal remembrance and new beginnings.",
    tags: ['Bébé Espoir', 'Grossesse d\'après', 'Trauma', 'Maternité'],
    isFeatured: false,
    likesCount: 34,
    coverImageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
    content: `
### Le grand écart du cœur : aimer sans remplacer

L'annonce d'une nouvelle grossesse après un deuil périnatal ne balaye pas la douleur passée d'un coup de baguette magique. Au contraire, elle réveille souvent une anxiété sourde : chaque échographie devient un examen redouté, chaque date anniversaire fait trembler, et la joie peine à s'exprimer par crainte de revivre le cauchemar.

Beaucoup de mères expriment également une culpabilité secrète :
> « Si je me réjouis pour ce nouveau bébé, ai-je l'impression de trahir ou d'oublier mon premier ange ? »

Il est fondamental de comprendre qu'un enfant n'en remplace jamais un autre. Le bébé décédé garde sa place pour l'éternité dans le cœur des parents. Le bébé à venir n'a pas pour mission de « réparer » les parents ou de combler le vide : il arrive avec sa propre vie, son propre destin et son propre prénom.

### Les balises pour traverser la grossesse d'après

1. **Un suivi médical et psychologique renforcé :** Exigez une écoute bienveillante de la part de votre gynécologue et de votre sage-femme. Avoir un rendez-vous d'écoute régulier avec un psychologue permet de déposer ses angoisses sans contaminer le lien avec le futur nouveau-né.
2. **Ne pas s'interdire de parler de son ange :** Le conjoint, la famille et les soignants doivent être au courant de vos antécédents pour adapter leur accompagnement avec douceur.
3. **Le concept d'enfant arc-en-ciel :** Tout comme l'arc-en-ciel ne fait pas disparaître la tempête qui a précédé, il illumine le ciel par sa beauté singulière.
`,
    contentEn: `
### Loving Without Replacing

Announcing a new pregnancy after child loss does not magically erase sorrow. Rather, it frequently reawakens deep apprehension: each ultrasound feels agonizing, milestone dates bring chills, and celebrating joy feels risky.

Many mothers harbor an unspoken guilt:
> "If I allow myself to rejoice for this new baby, am I betraying or forgetting my first angel?"

It is foundational to know that no child ever replaces another. Your departed baby holds an eternal, sacred place in your heart. The incoming child is not here to "fix" grief or fill a void: they arrive with their own destiny, their own unique light, and their own name.

### Guiding Milestones for a Rainbow Pregnancy

1. **Enhanced Supportive Care:** Seek an obstetrician and midwife attuned to previous trauma. Regular listening sessions with a counselor allow parents to release tension without projecting fear onto the new infant.
2. **Freely Honoring Your Angel:** Partners, families, and clinicians should be gently informed of your journey to cultivate patience and tender support.
3. **The Meaning of a Rainbow Child:** Just as a rainbow does not pretend the prior storm never happened, it illuminates the horizon with gentle hope.
`
  }
];

export const INITIAL_BLOG_COMMENTS: BlogComment[] = [
  {
    id: 'comm-1',
    postId: 'blog-1',
    postTitle: "Le deuil périnatal en Côte d'Ivoire : briser le silence",
    authorName: "Awa K.",
    authorRole: 'parange',
    createdAt: "14 Octobre 2024 à 16:30",
    status: 'approved',
    content: "Merci infiniment pour cet article qui met des mots si justes sur ce que j'ai vécu à Abidjan il y a 8 mois quand j'ai perdu ma petite Grâce à 34 semaines. Entendre ma belle-famille me dire 'tu es jeune, oublie' m'a brisé le cœur plus que tout. Votre association m'a sauvée de la dépression.",
    contentEn: "Thank you from the bottom of my heart for putting such accurate words to what I experienced in Abidjan 8 months ago when I lost little Grâce at 34 weeks. Hearing family say 'you are young, move on' broke my heart even more. Your association saved me from despair.",
    adminReply: "Chère Awa, toute notre équipe vous serre fort dans ses bras. La mémoire de la petite Grâce est sacrée et vous avez toute votre place parmi nous.",
    adminReplyEn: "Dear Awa, our entire team embraces you warmly. Little Grâce's memory is sacred, and you are always embraced here."
  },
  {
    id: 'comm-2',
    postId: 'blog-2',
    postTitle: "Le chagrin silencieux des pères : comment les Papas Paranges traversent la perte",
    authorName: "Kouassi Émile",
    authorRole: 'parange',
    createdAt: "02 Décembre 2024 à 10:15",
    status: 'approved',
    content: "En tant qu'Ivoirien et père, cet article résonne au plus profond de moi. J'ai gardé mes larmes pendant deux ans pour ne pas inquiéter ma femme, jusqu'au jour où j'ai craqué. Participer à votre groupe d'hommes m'a fait comprendre que la vulnérabilité n'est pas une faiblesse.",
    contentEn: "As an Ivorian father, this article speaks to my very soul. I hid my tears for two years to shield my wife, until the day I broke down. Joining your fathers' group made me realize vulnerability is not weakness.",
    adminReply: "Merci pour ce témoignage courageux Kouassi. Votre témoignage aide d'autres pères à oser déposer leur armure.",
    adminReplyEn: "Thank you for this courageous voice Kouassi. Your words inspire other fathers to lay down their heavy armor."
  },
  {
    id: 'comm-3',
    postId: 'blog-1',
    postTitle: "Le deuil périnatal en Côte d'Ivoire : briser le silence",
    authorName: "Sœur Blandine M.",
    authorRole: 'soignant',
    createdAt: "22 Janvier 2025 à 11:00",
    status: 'pending',
    content: "Je suis sage-femme dans un centre hospitalier à Bouaké. Nous sommes souvent démunis face à la détresse des mamans qui perdent leur bébé. Votre article me donne des repères concrets. Comment pouvons-nous organiser une session de sensibilisation pour notre équipe de garde ?",
    contentEn: "I am a midwife at a hospital in Bouaké. We often feel unequipped when facing the distress of mothers losing their infants. Your article provides practical landmarks. How can we organize a training session for our maternity staff?"
  }
];
