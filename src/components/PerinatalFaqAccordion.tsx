import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Heart, ShieldCheck, Phone, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface FaqItem {
  id: string;
  category: string;
  categoryEn: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
  practicalTip?: string;
  practicalTipEn?: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Compréhension',
    categoryEn: 'Understanding',
    question: "Qu'appelle-t-on exactement « deuil périnatal » et qui est concerné ?",
    questionEn: "What exactly is 'perinatal bereavement' and who does it affect?",
    answer: "Le deuil périnatal désigne la perte d'un bébé survenue entre la conception et les premières semaines suivant la naissance : fausse couche spontanée précoce ou tardive, grossesse arrêtée, interruption médicale de grossesse (IMG), mort fœtale in utero (MFIU), ou décès en néonatalogie. Toute personne ayant investi d'amour cet enfant — mères, pères, conjoints, grands-parents et fratrie — est pleinement légitime dans sa souffrance.",
    answerEn: "Perinatal bereavement refers to the loss of a baby between conception and the first weeks following birth: early or late miscarriage, missed miscarriage, termination for medical reasons (TFMR), stillbirth, or neonatal death. Anyone who invested love into this child — mothers, fathers, partners, grandparents, and siblings — is entirely legitimate in their grief.",
    practicalTip: "Il n'y a pas de 'petit' deuil. Même si la grossesse n'a duré que quelques semaines, l'attachement et les projets de vie étaient déjà bien réels.",
    practicalTipEn: "There is no 'minor' grief. Even if the pregnancy lasted only a few weeks, attachment and life plans were already deeply real."
  },
  {
    id: 'faq-2',
    category: 'Société & Culture',
    categoryEn: 'Society & Culture',
    question: "Pourquoi ai-je l'impression que la société ivoirienne minimise ou occulte ma douleur ?",
    questionEn: "Why do I feel that society often minimizes or hides my sorrow?",
    answer: "Dans notre environnement social, les proches recourent fréquemment à des formules automatiques telles que « Tu es jeune, tu en auras d'autres », « Ne pleure pas pour ne pas porter malheur » ou « Accepte, c'est la volonté de Dieu ». Bien que souvent prononcées par maladresse ou impuissance, ces paroles invisibilisent le bébé et enferment les parents dans la solitude et la culpabilité. Au Jardin de l'Espoir : Parange, nous réaffirmons que votre peine a un sens et mérite d'être entendue avec respect.",
    answerEn: "In our social environment, loved ones often resort to automatic remarks such as 'You are young, you will have others', 'Do not cry or you will bring bad luck', or 'Accept it, it is God's will'. Though often spoken out of helplessness, these phrases silence the baby and trap parents in solitude and guilt. At Le Jardin de l'Espoir : Parange, we reaffirm that your grief matters and deserves respectful listening.",
    practicalTip: "Vous avez le droit de poser vos limites : dites avec douceur à vos proches que vous avez besoin d'écoute et non de leçons ou d'injonctions à aller vite.",
    practicalTipEn: "You have the right to set boundaries: gently tell relatives that you need compassionate listening, not instructions to move on quickly."
  },
  {
    id: 'faq-3',
    category: 'Couple & Famille',
    categoryEn: 'Couples & Family',
    question: "Mon conjoint ne pleure pas ou semble fuir la réalité. Est-ce un désintérêt ?",
    questionEn: "My partner does not cry or seems to avoid reality. Does this mean they don't care?",
    answer: "Absolument pas. En Côte d'Ivoire, les hommes sont souvent conditionnés par la société à 'rester le pilier fort' qui protège la maisonnée et gère les démarches. Beaucoup de pères s'interdisent d'extérioriser leurs larmes pour ne pas effondrer davantage leur compagne, ce qui peut créer un malentendu douloureux dans le couple. Le père souffre tout autant, mais de manière souvent plus silencieuse ou par l'hyperactivité au travail.",
    answerEn: "Absolutely not. Men are often conditioned by societal expectations to 'remain the strong pillar' who protects the home and handles logistics. Many fathers hold back their tears to avoid overwhelming their partner, which can create painful misunderstandings. Fathers grieve just as intensely, but often in silence or through work.",
    practicalTip: "Notre cercle d'écoute dédié 'Papas Paranges' offre un espace sécurisé où les pères peuvent enfin déposer leur armure sans crainte du jugement.",
    practicalTipEn: "Our dedicated 'Bereaved Dads' support circle provides a safe haven where fathers can let down their guard without fear of judgment."
  },
  {
    id: 'faq-4',
    category: 'Nos Services',
    categoryEn: 'Our Services',
    question: "Comment se déroule concrètement un Groupe de Soutien pour Paranges (GSP) ?",
    questionEn: "How does a Psychological Support Group (PSG) work in practice?",
    answer: "Nos GSP réunissent 6 à 10 paranges dans une atmosphère feutrée, sécurisée et chaleureuse. Ils sont animés conjointement par un psychologue clinicien et un parent pair-aidant (qui a lui-même traversé cette épreuve). Les séances se tiennent mensuellement et en visioconférence confidentielle pour les résidents de toute la COTE D'IVOIRE ou de la diaspora. Rien n'est obligatoire : vous pouvez venir simplement pour écouter.",
    answerEn: "Our PSGs gather 6 to 10 bereaved parents in a warm, confidential, and safe setting. They are co-facilitated by a clinical psychologist and a peer support parent. Sessions are held monthly and via confidential video calls for residents across COTE D'IVOIRE or the diaspora. Participation is entirely voluntary: you may simply come to listen.",
    practicalTip: "Tout ce qui est partagé dans la salle ou lors de la réunion virtuelle reste sous le sceau de la confidentialité et de la bienveillance fraternelle.",
    practicalTipEn: "Everything shared in the room or during online circles remains strictly confidential and held in warm brotherly and sisterly care."
  },
  {
    id: 'faq-5',
    category: 'Mémoire & Rituels',
    categoryEn: 'Memory & Rituals',
    question: "Notre enfant n'a pas d'acte d'état civil ni de sépulture. Comment faire vivre son souvenir ?",
    questionEn: "Our child has no civil birth certificate or burial site. How can we keep their memory alive?",
    answer: "L'absence de sépulture formelle ou de reconnaissance administrative ne doit pas effacer l'existence de votre tout-petit. Le Jardin de l'Espoir : Parange vous accompagne pour créer des symboles réparateurs : inscrire le prénom de votre ange dans notre Jardin Virtuel, allumer une veilleuse lors de la Vague Mondiale de Lumière du 15 octobre, ou conserver une boîte à trésors (premiers chaussons, échographie, empreintes pédiatriques réalisées avec la maternité).",
    answerEn: "The lack of formal burial or administrative records should never erase the existence of your precious child. Le Jardin de l'Espoir : Parange guides you in creating meaningful symbols: recording your angel's name in our Virtual Memorial Garden, lighting a candle during the Global Wave of Light on October 15, or keeping a memory box (ultrasound scans, hospital wristbands, handprints).",
    practicalTip: "Nommer votre enfant est un droit fondamental pour lui donner sa juste place dans l'arbre généalogique de votre famille.",
    practicalTipEn: "Naming your child is a fundamental step to giving them their rightful place in your family's tree of life."
  },
  {
    id: 'faq-6',
    category: 'Tarifs & Accessibilité',
    categoryEn: 'Fees & Access',
    question: "L'accompagnement et les consultations sont-ils payants ?",
    questionEn: "Are the services and consultations chargeable?",
    answer: "L'accès à la Ligne Solidaire d'urgence 7j/7, aux Groupes de Soutien Psychologique (GSP), aux cafés-paranges et aux cérémonies mémorielles est entièrement GRATUIT. Grâce à nos donateurs et partenaires, l'ONG veille à ce qu'aucun parent endeuillé en Côte d'Ivoire ne soit freiné par des contraintes financières pour recevoir un soutien de qualité.",
    answerEn: "Access to our 7d/7 solidarity helpline, Support Groups (PSG), parent coffee hours, and memorial gatherings is completely FREE. Thanks to our donors and partners, our NGO ensures that no grieving parent in Côte d'Ivoire is hindered by financial constraints from receiving high quality care.",
    practicalTip: "Les consultations psychologiques individuelles approfondies sont soit dispensées bénévolement au centre, soit conventionnées à tarifs très solidaires.",
    practicalTipEn: "In-depth individual psychological consultations are provided either free of charge or through deeply subsidized solidarity contributions."
  },
  {
    id: 'faq-7',
    category: 'Santé Mentale',
    categoryEn: 'Mental Health',
    question: "Quels sont les signaux qui doivent m'inciter à consulter un psychologue sans attendre ?",
    questionEn: "What warning signs should prompt me to consult a psychologist immediately?",
    answer: "Si vous constatez des troubles du sommeil sévères, une perte totale d'appétit, des idées noires récurrentes (« Je veux rejoindre mon bébé »), des flash-backs traumatiques de l'accouchement, ou une incapacité persistante à accomplir les gestes de la vie quotidienne après plusieurs semaines, n'hésitez pas. Ces symptômes relèvent du choc post-traumatique ou de la dépression périnatale et se traitent avec succès lorsqu'ils sont pris en charge à temps.",
    answerEn: "If you notice severe sleep disturbances, complete loss of appetite, persistent dark thoughts ('I want to join my baby'), traumatic flashbacks of labor, or persistent inability to perform basic daily activities after several weeks, do not hesitate. These symptoms indicate post-traumatic stress or perinatal depression and can be treated effectively when addressed early.",
    practicalTip: "Appelez immédiatement notre permanence au 07 59 87 21 61 ou 05 75 23 93 12 pour un aiguillage clinique bienveillant.",
    practicalTipEn: "Call our helpline immediately at 07 59 87 21 61 or 05 75 23 93 12 for compassionate clinical guidance."
  },
  {
    id: 'faq-8',
    category: 'Compréhension',
    categoryEn: 'Understanding',
    question: "Le Jardin de l'Espoir concerne-t-il uniquement les bébés ou toute personne ayant perdu au moins 1 enfant quel que soit son âge ?",
    questionEn: "Does Le Jardin de l'Espoir only support infant loss, or anyone having lost a child regardless of age?",
    answer: "Le Jardin de l'Espoir : Parange concerne et accompagne inconditionnellement TOUTE personne ayant perdu au moins un enfant, quel que soit l'âge de l'enfant disparu : qu'il soit mort-né (fausse couche tardive, mort in utero, IMG), nourrisson, écolier, adolescent ou qu'il soit décédé à un âge adulte avancé (accident, maladie, drame). Pour un parent, voir son enfant partir avant lui défie l'ordre naturel des générations : aucun âge n'atténue l'immensité de ce lien. On reste Parange pour toujours.",
    answerEn: "Le Jardin de l'Espoir : Parange unconditionally welcomes EVERY person who has lost at least one child, regardless of the child's age: whether stillborn (late miscarriage, stillbirth, medical termination), infant, toddler, teenager, or having passed away at an advanced adult age. Surviving one's child defies the natural generational order: once a parent, always a Parange.",
    practicalTip: "Toutes les personnes endeuillées par la perte d'un enfant sont accueillies avec la même fraternité et le même respect sacré.",
    practicalTipEn: "All persons grieving the loss of a child are embraced with equal compassion and sacred dignity."
  },
  {
    id: 'faq-9',
    category: 'Nos Services',
    categoryEn: 'Our Services',
    question: "Comment rejoindre le Groupe Facebook Officiel pour échanger avec d'autres parents ?",
    questionEn: "How do I join the Official Facebook Group to connect with other parents?",
    answer: "Le Jardin de l'Espoir : Parange met à disposition un Groupe Facebook Officiel d'Entraide (https://www.facebook.com/groups/lejardindelespoirparange/). Modéré 24h/24, il offre un espace sécurisé et chaleureux pour rompre le silence, échanger avec d'autres parents paranges en Côte d'Ivoire et honorer la mémoire de nos enfants.",
    answerEn: "Le Jardin de l'Espoir : Parange provides an Official Facebook Mutual-Support Group (https://www.facebook.com/groups/lejardindelespoirparange/). Moderated 24/7, it offers a secure and warm community space to break isolation and connect with fellow bereaved parents.",
    practicalTip: "Cliquez sur le lien direct ou le bouton Facebook dans l'en-tête pour faire votre demande d'adhésion bienveillante.",
    practicalTipEn: "Click the direct link or the Facebook button in the header to join the supportive community."
  }
];

interface PerinatalFaqAccordionProps {
  onOpenConsultationModal?: (audience?: 'parange' | 'fratrie' | 'proche' | 'soignant-relais') => void;
  phone1?: string;
  phone2?: string;
}

export const PerinatalFaqAccordion: React.FC<PerinatalFaqAccordionProps> = ({
  onOpenConsultationModal,
  phone1 = '07 59 87 21 61',
  phone2 = '05 75 23 93 12'
}) => {
  const { isEn } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const categories = [
    { key: 'Tous', label: isEn ? 'All' : 'Tous' },
    { key: 'Compréhension', label: isEn ? 'Understanding' : 'Compréhension' },
    { key: 'Société & Culture', label: isEn ? 'Society & Culture' : 'Société & Culture' },
    { key: 'Couple & Famille', label: isEn ? 'Couples & Family' : 'Couple & Famille' },
    { key: 'Nos Services', label: isEn ? 'Our Services' : 'Nos Services' },
    { key: 'Mémoire & Rituels', label: isEn ? 'Memory & Rituals' : 'Mémoire & Rituels' },
    { key: 'Tarifs & Accessibilité', label: isEn ? 'Fees & Access' : 'Tarifs & Accessibilité' },
    { key: 'Santé Mentale', label: isEn ? 'Mental Health' : 'Santé Mentale' }
  ];

  const filteredFaqs = selectedCategory === 'Tous'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === selectedCategory);

  const toggleAccordion = (id: string) => {
    setOpenId(prev => prev === id ? null : id);
  };

  return (
    <section className="mt-16 pt-16 border-t border-stone-200/80">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isEn ? 'Specialized Knowledge & Support FAQ' : 'Foire Aux Questions Spécialisée'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-accent text-stone-900 tracking-tight">
            {isEn ? 'Understanding Perinatal Bereavement in Côte d\'Ivoire' : "Comprendre le Deuil Périnatal en Côte d'Ivoire"}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {isEn 
              ? 'Enlightened, clinical, and compassionate answers to ease doubts, dissolve guilt, and guide your healing journey.'
              : 'Des réponses éclairées, médicales et fraternelles pour apaiser vos doutes, dissiper la culpabilité et savoir comment être épaulé(e) au quotidien.'}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                  isOpen
                    ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                    : 'border-stone-200/90 hover:border-stone-300 shadow-2xs'
                }`}
              >
                {/* Header / Button */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-hidden"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {isEn ? faq.categoryEn : faq.category}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-serif-accent text-stone-900 text-left">
                      {isEn ? faq.questionEn : faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-emerald-100 text-emerald-800 rotate-180' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Animated Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-stone-600 text-sm leading-relaxed border-t border-stone-100 space-y-3">
                        <p>{isEn ? faq.answerEn : faq.answer}</p>

                        {(faq.practicalTip || faq.practicalTipEn) && (
                          <div className="mt-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold text-amber-950">
                                {isEn ? 'Compassionate Tip: ' : 'Conseil bienveillant : '}
                              </strong>
                              <span>{isEn ? faq.practicalTipEn : faq.practicalTip}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Small Bottom Helper */}
        <div className="mt-10 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-stone-900">
                {isEn ? 'Have another question left unanswered?' : 'Une autre question restée sans réponse ?'}
              </div>
              <div className="text-xs text-stone-600">
                {isEn 
                  ? `Our volunteer listeners and clinicians are available 7d/7 at +225 ${phone1} / ${phone2}.`
                  : `Nos écoutants bénévoles et psychologues vous répondent 7j/7 au +225 ${phone1} / ${phone2}.`}
              </div>
            </div>
          </div>

          {onOpenConsultationModal && (
            <button
              onClick={() => onOpenConsultationModal('parange')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              {isEn ? 'Ask a question in private' : 'Poser une question en privé'}
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
